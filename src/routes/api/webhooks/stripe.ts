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

async function handleChargeSucceeded(charge: Stripe.Charge) {
  try {
    console.log('[Webhook] Processing charge.succeeded event');
    
    const supabaseClient = getSupabaseClient();
    const customerId = charge.customer as string;
    
    if (!customerId) {
      console.log('[Webhook] Charge has no customer, skipping');
      return;
    }

    // Get customer from database
    const { data: customers } = await supabaseClient
      .from('customers')
      .select('id, user_id')
      .eq('stripe_customer_id', customerId) as any;

    if (!customers || customers.length === 0) {
      console.log('[Webhook] Customer not found for charge, skipping');
      return;
    }

    const customer = customers[0];

    // Check if this customer already has a subscription for this price
    // This prevents double-creating subscriptions when charge.succeeded fires for recurring subscriptions
    const { data: existingSubs } = await (supabaseClient as any)
      .from('subscriptions')
      .select('id')
      .eq('customer_id', customer.id)
      .eq('stripe_price_id', 'price_1TEQpIF6w6kZyHeYzgaYvyTi') // Only check for one-time price
      .gte('created_at', new Date(Date.now() - 5000).toISOString()); // Created in last 5 seconds

    // If we found a subscription created very recently, don't create another one
    if (existingSubs && existingSubs.length > 0) {
      console.log('[Webhook] Subscription for this price already exists recently, skipping duplicate');
      return;
    }

    // Only create subscriptions from charge.succeeded for the one-time purchase price
    if (charge.currency === 'usd' && charge.amount === 200) { // $2.00 = 200 cents
      console.log('[Webhook] Processing one-time payment charge ($2.00)');
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      const { error: insertError } = await (supabaseClient as any)
        .from('subscriptions')
        .insert({
          customer_id: customer.id,
          stripe_subscription_id: `onetime_${charge.id}`, // Use charge ID as unique identifier
          stripe_price_id: 'price_1TEQpIF6w6kZyHeYzgaYvyTi', // The 24-hour pass price
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: expiresAt.toISOString(),
          created_at: now.toISOString(),
        });

      if (insertError) {
        console.error(`[Webhook] Error inserting 24h pass subscription:`, insertError);
        throw insertError;
      }

      console.log(`[Webhook] Created 24-hour pass subscription for charge: ${charge.id}, expires at: ${expiresAt.toISOString()}`);
    } else {
      console.log(`[Webhook] Charge amount (${charge.amount} ${charge.currency}) doesn't match one-time price, skipping`);
    }
  } catch (error) {
    console.error('[Webhook] Error handling charge.succeeded:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('[Webhook] Processing customer.subscription.created event');
    const supabaseClient = getSupabaseClient();
    const customerId = subscription.customer as string;
    
    // Fetch full subscription details from Stripe to ensure we have all fields
    const fullSubscription = await stripe.subscriptions.retrieve(subscription.id);
    const priceId = (fullSubscription.items.data[0]?.price.id) || '';

    console.log(`[Webhook] Looking up customer with Stripe ID: ${customerId}`);
    
    // Get customer from database with retry for race condition
    let customer: { id: string; user_id: string } | undefined;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      const { data: customers, error: queryError } = await supabaseClient
        .from('customers')
        .select('id, user_id')
        .eq('stripe_customer_id', customerId) as any;

      if (queryError) {
        console.error(`[Webhook] Error querying customers table (attempt ${attempt}):`, queryError);
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

    // Insert subscription with full details from Stripe
    let startTime = fullSubscription.current_period_start;
    let endTime = fullSubscription.current_period_end;

    console.log(`[Webhook] Full subscription object:`, {
      id: fullSubscription.id,
      status: fullSubscription.status,
      current_period_start: fullSubscription.current_period_start,
      current_period_end: fullSubscription.current_period_end,
      created: fullSubscription.created,
      billing_cycle_anchor: (fullSubscription as any).billing_cycle_anchor,
    });

    // If period dates are missing, compute them from created time and billing interval
    if (!startTime || !endTime) {
      console.log(`[Webhook] Period dates missing, computing from billing details`);
      const billingInterval = fullSubscription.items.data[0]?.billing_period?.interval || 'month';
      const billingIntervalCount = fullSubscription.items.data[0]?.billing_period?.interval_count || 1;
      
      startTime = fullSubscription.created;
      
      // Calculate end time based on billing interval
      const startDate = new Date(startTime * 1000);
      if (billingInterval === 'month') {
        startDate.setMonth(startDate.getMonth() + billingIntervalCount);
      } else if (billingInterval === 'year') {
        startDate.setFullYear(startDate.getFullYear() + billingIntervalCount);
      } else if (billingInterval === 'week') {
        startDate.setDate(startDate.getDate() + (7 * billingIntervalCount));
      } else if (billingInterval === 'day') {
        startDate.setDate(startDate.getDate() + billingIntervalCount);
      }
      endTime = Math.floor(startDate.getTime() / 1000);
      
      console.log(`[Webhook] Computed period - start: ${startTime}, end: ${endTime}`);
    }

    console.log(`[Webhook] Timestamp values - start: ${startTime}, end: ${endTime}`);

    console.log(`[Webhook] About to insert subscription with customer_id: ${customer.id} (type: ${typeof customer.id})`);
    console.log(`[Webhook] Full subscription insert data:`, {
      customer_id: customer.id,
      stripe_subscription_id: fullSubscription.id,
      stripe_price_id: priceId,
      status: fullSubscription.status,
      current_period_start: new Date(startTime * 1000).toISOString(),
      current_period_end: new Date(endTime * 1000).toISOString(),
    });

    const { data: insertedSub, error: insertError } = await (supabaseClient as any)
      .from('subscriptions')
      .insert({
        customer_id: customer.id,
        stripe_subscription_id: fullSubscription.id,
        stripe_price_id: priceId,
        status: fullSubscription.status,
        current_period_start: new Date(startTime * 1000).toISOString(),
        current_period_end: new Date(endTime * 1000).toISOString(),
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
    
    // Fetch full subscription details from Stripe to ensure we have all fields
    const fullSubscription = await stripe.subscriptions.retrieve(subscription.id);
    
    const { data: subscriptions, error: selectError } = await supabaseClient
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', fullSubscription.id) as any;

    if (selectError) {
      console.error(`[Webhook] Error querying subscriptions table:`, selectError);
      throw selectError;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.error(`[Webhook] Subscription not found: ${fullSubscription.id}`);
      return;
    }

    // Update subscription with full details from Stripe
    const startTime = (fullSubscription as any).current_period_start;
    const endTime = (fullSubscription as any).current_period_end;

    const { error: updateError } = await (supabaseClient as any)
      .from('subscriptions')
      .update({
        status: fullSubscription.status,
        current_period_start: startTime ? new Date(startTime * 1000).toISOString() : null,
        current_period_end: endTime ? new Date(endTime * 1000).toISOString() : null,
        cancel_at_period_end: fullSubscription.cancel_at_period_end,
      })
      .eq('stripe_subscription_id', fullSubscription.id);

    if (updateError) {
      console.error(`[Webhook] Error updating subscription:`, updateError);
      throw updateError;
    }

    console.log(`[Webhook] Subscription updated successfully: ${fullSubscription.id}`);
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

            case 'charge.succeeded': {
              const charge = event.data.object as Stripe.Charge;
              await handleChargeSucceeded(charge);
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
