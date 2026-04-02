import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

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

function resolveSubscriptionPeriod(subscription: Stripe.Subscription) {
  let startTime = (subscription as any).current_period_start;
  let endTime = (subscription as any).current_period_end;

  if (!startTime || !endTime) {
    const billingInterval = subscription.items.data[0]?.price.recurring?.interval || 'month';
    const billingIntervalCount = subscription.items.data[0]?.price.recurring?.interval_count || 1;

    startTime = subscription.created;

    const endDate = new Date(startTime * 1000);
    if (billingInterval === 'month') {
      endDate.setMonth(endDate.getMonth() + billingIntervalCount);
    } else if (billingInterval === 'year') {
      endDate.setFullYear(endDate.getFullYear() + billingIntervalCount);
    } else if (billingInterval === 'week') {
      endDate.setDate(endDate.getDate() + 7 * billingIntervalCount);
    } else if (billingInterval === 'day') {
      endDate.setDate(endDate.getDate() + billingIntervalCount);
    }

    endTime = Math.floor(endDate.getTime() / 1000);
  }

  return { startTime, endTime };
}

export const Route = createFileRoute('/api/reconcile-checkout')({
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

          if (!user?.id || !user.email) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
              status: 401,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const body = await request.json();
          const sessionId = body?.sessionId;

          if (!sessionId) {
            return new Response(JSON.stringify({ error: 'Missing sessionId' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
          if (checkoutSession.mode !== 'subscription') {
            return new Response(JSON.stringify({ ok: true, skipped: 'non-subscription-session' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const stripeCustomerId = typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.customer?.id;
          const stripeSubscriptionId =
            typeof checkoutSession.subscription === 'string' ? checkoutSession.subscription : checkoutSession.subscription?.id;

          if (!stripeCustomerId || !stripeSubscriptionId) {
            return new Response(JSON.stringify({ error: 'Checkout session missing customer or subscription' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const adminClient = getAdminSupabaseClient();

          const { data: userCustomers } = await adminClient
            .from('customers')
            .select('id, stripe_customer_id')
            .eq('user_id', user.id)
            .limit(1);

          let localCustomer = userCustomers?.[0];

          if (!localCustomer) {
            const { error: insertCustomerError } = await adminClient
              .from('customers')
              .insert({
                user_id: user.id,
                stripe_customer_id: stripeCustomerId,
                email: user.email,
              });

            if (insertCustomerError) {
              throw insertCustomerError;
            }

            const { data: inserted } = await adminClient
              .from('customers')
              .select('id, stripe_customer_id')
              .eq('user_id', user.id)
              .limit(1);

            localCustomer = inserted?.[0];
          }

          if (!localCustomer) {
            return new Response(JSON.stringify({ error: 'Failed to resolve customer' }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          if (localCustomer.stripe_customer_id !== stripeCustomerId) {
            return new Response(JSON.stringify({ error: 'Checkout session customer mismatch' }), {
              status: 403,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const priceId = subscription.items.data[0]?.price.id || '';
          const { startTime, endTime } = resolveSubscriptionPeriod(subscription);

          const { error: upsertSubError } = await (adminClient as any)
            .from('subscriptions')
            .upsert(
              {
                customer_id: localCustomer.id,
                stripe_subscription_id: subscription.id,
                stripe_price_id: priceId,
                status: subscription.status,
                current_period_start: new Date(startTime * 1000).toISOString(),
                current_period_end: new Date(endTime * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
              },
              { onConflict: 'stripe_subscription_id' },
            );

          if (upsertSubError) {
            throw upsertSubError;
          }

          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Reconcile checkout error:', error);
          return new Response(JSON.stringify({ error: 'Failed to reconcile checkout' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
