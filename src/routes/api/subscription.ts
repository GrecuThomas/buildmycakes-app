import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '../../lib/supabase';

export const Route = createFileRoute('/api/subscription')({
  component: () => null,
  server: {
    handlers: {
      GET: async ({ request }) => {
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
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!customer) {
            return new Response(JSON.stringify(null), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }

          // Get active subscription
          const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('customer_id', customer.id)
            .eq('status', 'active')
            .single();

          return new Response(JSON.stringify(subscription || null), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Error fetching subscription:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch subscription' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
