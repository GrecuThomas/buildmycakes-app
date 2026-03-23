import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialize Supabase with service role key (will be created on first use)
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (supabase) return supabase;
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables for webhook handler');
  }

  supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  return supabase;
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('[Webhook] Processing customer.subscription.created event');
    const supabaseClient = getSupabaseClient();
    const customerId = subscription.customer as string;
    const priceId = (subscription.items.data[0]?.price.id) || '';

    console.log(`[Webhook] Looking up customer with Stripe ID: ${customerId}`);
    
    // Get customer from database with retry for race condition
    let customer: { id: string; user_id: string } | undefined;
    let customerError = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      const { data: customers, error: queryError } = await supabaseClient
        .from('customers')
        .select('id, user_id')
        .eq('stripe_customer_id', customerId) as any;

      if (queryError) {
        console.error(`[Webhook] Error querying customers table (attempt ${attempt}):`, queryError);
        customerError = queryError;
        continue;
      }

      customer = customers?.[0] as { id: string; user_id: string } | undefined;
      
      if (customer) {
        console.log(`[Webhook] Found customer on attempt ${attempt} with ID: ${customer.id} for user: ${customer.user_id}`);
        break;
      }
      
      if (attempt < 3) {
        console.log(`[Webhook] Customer not found on attempt ${attempt}, retrying in 1 second...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!customer) {
      console.error(`[Webhook] Customer not found for Stripe ID: ${customerId} after 3 attempts. This means the customer wasn't created during checkout.`);
      return;
    }

    console.log(`[Webhook] Using customer with ID: ${customer.id} for user: ${customer.user_id}`);

    // Insert subscription
    const startTime = (subscription as any).current_period_start;
    const endTime = (subscription as any).current_period_end;

    console.log(`[Webhook] Timestamp values - start: ${startTime}, end: ${endTime}`);
    console.log(`[Webhook] About to insert subscription with customer_id: ${customer.id} (type: ${typeof customer.id})`);
    console.log(`[Webhook] Full subscription insert data:`, {
      customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_start: startTime ? new Date(startTime * 1000).toISOString() : null,
      current_period_end: endTime ? new Date(endTime * 1000).toISOString() : null,
    });

    const { data: insertedSub, error: insertError } = await (supabaseClient as any)
      .from('subscriptions')
      .insert({
        customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        status: subscription.status,
        current_period_start: startTime ? new Date(startTime * 1000).toISOString() : null,
        current_period_end: endTime ? new Date(endTime * 1000).toISOString() : null,
      })
      .select();

    if (insertError) {
      console.error(`[Webhook] Error inserting subscription:`, insertError);
      throw insertError;
    }

    console.log(`[Webhook] Subscription created successfully: ${subscription.id}`, insertedSub);
  } catch (error) {
    console.error('[Webhook] Error handling subscription.created webhook:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('[Webhook] Processing customer.subscription.updated event');
    const supabaseClient = getSupabaseClient();
    const { data: subscriptions, error: selectError } = await supabaseClient
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscription.id) as any;

    if (selectError) {
      console.error(`[Webhook] Error querying subscriptions table:`, selectError);
      throw selectError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.error(`[Webhook] Subscription not found: ${subscription.id}`);
      return;
    }

    // Update subscription
    const startTime = (subscription as any).current_period_start;
    const endTime = (subscription as any).current_period_end;

    const { error: updateError } = await (supabaseClient as any)
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: startTime ? new Date(startTime * 1000).toISOString() : null,
        current_period_end: endTime ? new Date(endTime * 1000).toISOString() : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      console.error(`[Webhook] Error updating subscription:`, updateError);
      throw updateError;
    }

    console.log(`[Webhook] Subscription updated successfully: ${subscription.id}`);
  } catch (error) {
    console.error('[Webhook] Error handling subscription.updated webhook:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('[Webhook] Processing customer.subscription.deleted event');
    const supabaseClient = getSupabaseClient();
    const { error: updateError } = await (supabaseClient as any)
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (updateError) {
      console.error(`[Webhook] Error canceling subscription:`, updateError);
      throw updateError;
    }

    console.log(`[Webhook] Subscription deleted successfully: ${subscription.id}`);
  } catch (error) {
    console.error('[Webhook] Error handling subscription.deleted webhook:', error);
    throw error;
  }
}

export const Route = createFileRoute('/api/webhooks/stripe')({
  component: () => null,
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.text();
          const signature = request.headers.get('stripe-signature');

          if (!signature || !webhookSecret) {
            return new Response('Missing signature or webhook secret', { status: 400 });
          }

          let event: Stripe.Event;

          try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Webhook signature verification failed:', errorMessage);
            return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
          }

          // Handle subscription events
          switch (event.type) {
            case 'customer.subscription.created': {
              const subscription = event.data.object as Stripe.Subscription;
              await handleSubscriptionCreated(subscription);
              break;
            }

            case 'customer.subscription.updated': {
              const subscription = event.data.object as Stripe.Subscription;
              await handleSubscriptionUpdated(subscription);
              break;
            }

            case 'customer.subscription.deleted': {
              const subscription = event.data.object as Stripe.Subscription;
              await handleSubscriptionDeleted(subscription);
              break;
            }

            case 'invoice.payment_succeeded': {
              // Handle successful payment (optional: send email receipt)
              const invoice = event.data.object as Stripe.Invoice;
              console.log(`Payment succeeded for invoice: ${invoice.id}`);
              break;
            }

            case 'invoice.payment_failed': {
              // Handle failed payment (optional: send email notification)
              const invoice = event.data.object as Stripe.Invoice;
              console.log(`Payment failed for invoice: ${invoice.id}`);
              break;
            }

            default:
              console.log(`Unhandled event type: ${event.type}`);
          }

          // Return 200 OK to acknowledge receipt
          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error('Webhook handler error:', error);
          return new Response('Webhook handler failed', { status: 500 });
        }
      },
    },
  },
});
