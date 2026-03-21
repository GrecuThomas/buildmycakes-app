import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { supabase } from '../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export const Route = createFileRoute('/api/cancel-subscription')({
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

          const body = await request.json();
          const { subscriptionId } = body;

          if (!subscriptionId) {
            return new Response(JSON.stringify({ error: 'Missing subscriptionId' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Verify subscription belongs to user
          const { data: customer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!customer) {
            return new Response(JSON.stringify({ error: 'Customer not found' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscriptionId)
            .eq('customer_id', customer.id)
            .single();

          if (!subscription) {
            return new Response(JSON.stringify({ error: 'Subscription not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Cancel at period end
          const canceled = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
          });

          // Update database
          await supabase
            .from('subscriptions')
            .update({ cancel_at_period_end: true })
            .eq('stripe_subscription_id', subscriptionId);

          return new Response(JSON.stringify({ canceled }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error canceling subscription:', error);
          return new Response(JSON.stringify({ error: 'Failed to cancel subscription' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
