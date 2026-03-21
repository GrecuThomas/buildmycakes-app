import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const STRIPE_RETURN_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';

export const Route = createFileRoute('/api/checkout')({
  component: () => null,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { priceId } = body;

          if (!priceId) {
            return new Response(JSON.stringify({ error: 'Missing priceId' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Get auth token from request header
          const authHeader = request.headers.get('authorization');
          if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Get user from auth token
          const token = authHeader.replace('Bearer ', '');
          const {
            data: { user },
          } = await supabase.auth.getUser(token);

          if (!user?.id || !user.email) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Get or create Stripe customer
          let customerId: string;

          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

          if (existingCustomer?.stripe_customer_id) {
            customerId = existingCustomer.stripe_customer_id;
          } else {
            // Create new Stripe customer
            const customer = await stripe.customers.create({
              email: user.email,
              metadata: {
                userId: user.id,
              },
            });
            customerId = customer.id;

            // Save to database
            await supabase.from('customers').insert({
              user_id: user.id,
              stripe_customer_id: customerId,
              email: user.email,
            });
          }

          // Create checkout session
          const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            success_url: `${STRIPE_RETURN_URL}/account/billing?success=true`,
            cancel_url: `${STRIPE_RETURN_URL}/pricing?canceled=true`,
          });

          if (!session.url) {
            throw new Error('Failed to create checkout session');
          }

          return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Checkout error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to create checkout session' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      },
    },
  },
});
