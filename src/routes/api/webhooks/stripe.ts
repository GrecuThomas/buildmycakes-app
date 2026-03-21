import { createFileRoute } from '@tanstack/react-router';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const priceId = (subscription.items.data[0]?.price.id) || '';

    // Get customer from database
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!customer) {
      console.error(`Customer not found for Stripe ID: ${customerId}`);
      return;
    }

    // Insert subscription
    await supabase.from('subscriptions').insert({
      customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
    });

    console.log(`Subscription created: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription.created webhook:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!data) {
      console.error(`Subscription not found: ${subscription.id}`);
      return;
    }

    // Update subscription
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription.updated webhook:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date(),
        ended_at: new Date(),
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log(`Subscription deleted: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription.deleted webhook:', error);
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
