import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import Stripe from 'stripe';
import { supabase } from '../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const STRIPE_RETURN_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';

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
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: data.customerId,
        mode: 'subscription',
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        success_url: `${STRIPE_RETURN_URL}/subscription?success=true`,
        cancel_url: `${STRIPE_RETURN_URL}/pricing?canceled=true`,
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
 * Get detailed subscription information including payment methods and plan details
 */
export const getSubscriptionDetails = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ authToken: z.string() }))
  .handler(async ({ data }) => {
    try {
      // Verify auth token and get user ID
      const authClient = await import('../lib/supabase').then(m => m.supabase);
      const { data: { user } } = await authClient.auth.getUser(data.authToken);
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Get customer record
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!customer) {
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      // Get subscriptions
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (!subscriptions || subscriptions.length === 0) {
        return { hasPayment: false, subscription: null, paymentMethods: [] };
      }

      const activeSubscription = subscriptions.find(s => s.status === 'active');

      // Get payment methods from Stripe
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.stripe_customer_id,
        type: 'card',
      });

      // Get subscription details from Stripe if it exists
      let stripeSubscription = null;
      if (activeSubscription) {
        try {
          stripeSubscription = await stripe.subscriptions.retrieve(activeSubscription.stripe_subscription_id);
        } catch (error) {
          console.error('Error retrieving Stripe subscription:', error);
        }
      }

      return {
        hasPayment: true,
        subscription: activeSubscription ? {
          ...activeSubscription,
          stripeData: stripeSubscription,
        } : null,
        paymentMethods: paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
        })),
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      throw error;
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
