import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const STRIPE_RETURN_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';

export const Route = createFileRoute('/api/portal-session')({
  component: () => null,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get('authorization');
          if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const token = authHeader.replace('Bearer ', '');
          const {
            data: { user },
          } = await supabase.auth.getUser(token);

          if (!user?.id) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Get customer
          const { data: customer } = await supabase
            .from('customers')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

          if (!customer?.stripe_customer_id) {
            return new Response(JSON.stringify({ error: 'No Stripe customer found' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Create portal session
          const session = await stripe.billingPortal.sessions.create({
            customer: customer.stripe_customer_id,
            return_url: `${STRIPE_RETURN_URL}/account/billing`,
          });

          return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error creating portal session:', error);
          return new Response(JSON.stringify({ error: 'Failed to create portal session' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
