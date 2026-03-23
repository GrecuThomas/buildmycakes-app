import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const STRIPE_RETURN_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';

// Helper to get service role client for database operations
function getAdminSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

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
          const adminClient = getAdminSupabaseClient();
          console.log('[Checkout] Getting or creating customer for user:', user.id);

          const { data: existingCustomer, error: queryError } = await adminClient
            .from('customers')
            .select('stripe_customer_id')
            .eq('user_id', user.id);

          console.log('[Checkout] Customer query result:', existingCustomer, 'Error:', queryError);

          if (existingCustomer && existingCustomer.length > 0 && existingCustomer[0]?.stripe_customer_id) {
            customerId = existingCustomer[0].stripe_customer_id;
            console.log('[Checkout] Found existing customer:', customerId);
          } else {
            // Create new Stripe customer
            console.log('[Checkout] Creating new Stripe customer for user:', user.id);
            const customer = await stripe.customers.create({
              email: user.email,
              metadata: {
                userId: user.id,
              },
            });
            customerId = customer.id;
            console.log('[Checkout] Created Stripe customer:', customerId);

            // Save to database using admin client (bypasses RLS)
            console.log('[Checkout] Inserting customer record:', { user_id: user.id, stripe_customer_id: customerId, email: user.email });
            const { error: insertError, data: insertData } = await adminClient
              .from('customers')
              .insert({
                user_id: user.id,
                stripe_customer_id: customerId,
                email: user.email,
              });

            console.log('[Checkout] Insert response - Data:', insertData, 'Error:', insertError);

            if (insertError) {
              console.error('[Checkout] Error inserting customer:', insertError);
              throw insertError;
            }
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
            success_url: `${STRIPE_RETURN_URL}/subscription?success=true`,
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
