import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const STRIPE_RETURN_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
    if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`);
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

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

          // Get or create Stripe customer using admin client (bypasses RLS)
          const adminClient = getAdminSupabaseClient();

          const { data: existingCustomers, error: customerQueryError } = await adminClient
            .from('customers')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .limit(1);

          if (customerQueryError) {
            throw customerQueryError;
          }

          let customerId = existingCustomers?.[0]?.stripe_customer_id;

          if (!customerId) {
            const newCustomer = await stripe.customers.create({
              email: user.email ?? undefined,
              metadata: {
                userId: user.id,
              },
            });

            customerId = newCustomer.id;

            const { error: customerInsertError } = await adminClient
              .from('customers')
              .insert({
                user_id: user.id,
                stripe_customer_id: customerId,
                email: user.email ?? null,
              });

            if (customerInsertError) {
              throw customerInsertError;
            }
          }

          // Create portal session
          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${STRIPE_RETURN_URL}/subscription`,
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
