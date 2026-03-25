import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const STRIPE_RETURN_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';

// Helper to get service role client for database operations (bypasses RLS)
function getAdminSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

/**
 * Create or get a Stripe customer for the authenticated user
 * Note: Auth should be handled by API routes, not here
 */
export const getOrCreateStripeCustomer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ userId: z.string(), email: z.string().email() }))
  .handler(async ({ data }) => {
    try {
      // Check if customer already exists in database
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('stripe_customer_id')
        .eq('user_id', data.userId)
        .single();

      if (existingCustomer?.stripe_customer_id) {
        return { customerId: existingCustomer.stripe_customer_id };
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: data.email,
        metadata: {
          userId: data.userId,
        },
      });

      // Save to database
      await supabase.from('customers').insert({
        user_id: data.userId,
        stripe_customer_id: customer.id,
        email: data.email,
      });

      return { customerId: customer.id };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  });

/**
 * Create a checkout session for subscription
 * Note: Auth and customer lookup should be handled by API routes
 */
export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ priceId: z.string(), customerId: z.string() }))
  .handler(async ({ data }) => {
    try {
      // Use 'payment' mode for one-time purchases, 'subscription' for recurring
      const ONETIME_PRICE_ID = 'price_1TEQpIF6w6kZyHeYzgaYvyTi'; // 24-hour pass
      const checkoutMode = data.priceId === ONETIME_PRICE_ID ? 'payment' : 'subscription';

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: data.customerId,
        mode: checkoutMode,
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        success_url: `${STRIPE_RETURN_URL}/subscription?success=true`,
        cancel_url: `${STRIPE_RETURN_URL}/pricing-checkout`,
      });

      if (!session.url) {
        throw new Error('Failed to create checkout session');
      }

      return { url: session.url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  });

/**
 * Get user's subscription by customer ID
 */
export const getUserSubscription = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ customerId: z.string() }))
  .handler(async ({ data }) => {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', data.customerId)
        .eq('status', 'active')
        .single();

      return subscription || null;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  });

/**
 * Get detailed subscription information for the authenticated user
 * Matches users with their subscriptions from Supabase
 */
/**
 * Get detailed subscription information for the authenticated user
 * Matches users with their subscriptions from Supabase
 */
export const getSubscriptionDetails = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ authToken: z.string() }))
  .handler(async ({ data }) => {
    try {
      console.log('[getSubscriptionDetails] Starting with auth token...');
      
      // Get user from auth token using regular client
      const { data: { user }, error: authError } = await supabase.auth.getUser(data.authToken);
      
      console.log('[getSubscriptionDetails] Auth check - User:', user?.id, 'Error:', authError);
      
      if (!user) {
        console.log('[getSubscriptionDetails] No authenticated user found');
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      console.log('[getSubscriptionDetails] Looking up customer for user:', user.id);
      console.log(user);

      // Get customer record for this user - use ADMIN client to bypass RLS
      const adminClient = getAdminSupabaseClient();
      const { data: customers, error: customerError } = await (adminClient as any)
        .from('customers')
        .select('id, stripe_customer_id, email')
        .eq('user_id', user.id);

      console.log('[getSubscriptionDetails] Customer query - customers:', customers?.length, 'Error:', customerError);

      if (customerError) {
        console.error('[getSubscriptionDetails] Error fetching customer:', customerError);
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      let customerRecord = customers?.[0];

      if (!customerRecord) {
        console.log('[getSubscriptionDetails] No customer record found for user:', user.id);
        console.log('[getSubscriptionDetails] Auto-creating Stripe customer...');
        
        try {
          // Create new Stripe customer
          const newStripeCustomer = await stripe.customers.create({
            email: user.email,
            metadata: {
              userId: user.id,
            },
          });

          // Save to database
          await (adminClient as any)
            .from('customers')
            .insert({
              user_id: user.id,
              stripe_customer_id: newStripeCustomer.id,
              email: user.email,
            });

          customerRecord = {
            id: newStripeCustomer.id,
            stripe_customer_id: newStripeCustomer.id,
            user_id: user.id,
          };

          console.log('[getSubscriptionDetails] Created new customer:', newStripeCustomer.id);
        } catch (error) {
          console.error('[getSubscriptionDetails] Error creating customer:', error);
          return { hasPayment: false, subscription: null, paymentMethods: [] };
        }
      }

      console.log('[getSubscriptionDetails] Found/created customer:', customerRecord.id);

      // Get subscriptions for this customer - use ADMIN client to bypass RLS
      const { data: subscriptions, error: subsError } = await (adminClient as any)
        .from('subscriptions')
        .select('*')
        .eq('customer_id', customerRecord.id)
        .order('created_at', { ascending: false });

      console.log('[getSubscriptionDetails] Subscriptions query - found:', subscriptions?.length, 'Error:', subsError);

      if (subsError) {
        console.error('[getSubscriptionDetails] Error fetching subscriptions:', subsError);
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      if (!subscriptions || subscriptions.length === 0) {
        console.log('[getSubscriptionDetails] No subscriptions found for customer:', customerRecord.id);
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      console.log('[getSubscriptionDetails] Found', subscriptions.length, 'subscriptions');

      // Filter out expired subscriptions and get the active one
      const now = new Date();
      const validSubscriptions = subscriptions.filter((s: any) => {
        // Skip canceled subscriptions
        if (s.status === 'canceled') return false;
        
        // Skip subscriptions where current_period_end has passed
        if (s.current_period_end && new Date(s.current_period_end) < now) {
          console.log('[getSubscriptionDetails] Subscription expired:', s.id, 'ended at:', s.current_period_end);
          return false;
        }
        
        return true;
      });

      if (validSubscriptions.length === 0) {
        console.log('[getSubscriptionDetails] No valid (non-expired) subscriptions found');
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      // Get the most recent active subscription
      const activeSubscription = validSubscriptions.find((s: any) => s.status === 'active');
      const mostRecent = activeSubscription || validSubscriptions[0];

      console.log('[getSubscriptionDetails] Returning subscription:', mostRecent.id, 'Status:', mostRecent.status, 'Expires:', mostRecent.current_period_end);

      // Get payment methods from Stripe (only first one)
      let paymentMethods: any[] = [];
      try {
        const methods = await stripe.paymentMethods.list({
          customer: customerRecord.stripe_customer_id,
          type: 'card',
          limit: 1, // Only fetch the first/default payment method
        });
        paymentMethods = methods.data || [];
      } catch (error) {
        console.warn('[getSubscriptionDetails] Could not fetch payment methods:', error);
      }

      return {
        hasPayment: true,
        subscription: mostRecent,
        paymentMethods,
      };
    } catch (error) {
      console.error('[getSubscriptionDetails] Unexpected error:', error);
      return { hasPayment: false, subscription: null, paymentMethods: [] };
    }
  });

/**
 * Cancel subscription
 */
export const cancelSubscription = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ subscriptionId: z.string() }))
  .handler(async ({ data }) => {
    try {
      // Cancel in Stripe
      const canceled = await stripe.subscriptions.update(data.subscriptionId, {
        cancel_at_period_end: true,
      });

      // Update database
      await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('stripe_subscription_id', data.subscriptionId);

      return { canceled: canceled as any };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  });

/**
 * Create Stripe portal session for managing subscriptions
 */
export const createPortalSession = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ customerId: z.string() }))
  .handler(async ({ data }) => {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: data.customerId,
        return_url: `${process.env.VITE_SITE_URL || 'http://localhost:3000'}/account/billing`,
      });

      return { url: session.url };
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  });
