# Stripe Integration Setup Guide

This guide walks you through integrating Stripe subscriptions into your BuildMyCakes app.

## Files Created

### Server Functions
- `src/server/stripe.functions.ts` - Server-side functions for Stripe operations

### API Routes
- `src/routes/api/webhooks/stripe.ts` - Webhook handler for Stripe events
- `src/routes/api/checkout.ts` - Checkout session creation
- `src/routes/api/subscription.ts` - Get user subscription
- `src/routes/api/portal-session.ts` - Stripe billing portal
- `src/routes/api/cancel-subscription.ts` - Cancel subscription

### Components
- `src/components/Pricing_Standalone.tsx` - Pricing page with plans
- `src/components/Billing.tsx` - Billing/subscription management page

### Routes
- `src/routes/pricing-checkout.tsx` - Main pricing page route
- `src/routes/account/billing.tsx` - Billing management route

### Database
- `sql/stripe-schema.sql` - Supabase schema for customers and subscriptions

## Step 1: Set Up Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create a Stripe account (or use existing)
3. Go to [Dashboard](https://dashboard.stripe.com)
4. Navigate to **Developers > API Keys**
5. Copy your keys:
   - **Secret Key** (starts with `sk_test_`)
   - **Publishable Key** (starts with `pk_test_`)

## Step 2: Create Products and Prices

1. In Stripe Dashboard, go to **Products**
2. Click **+ Add product**
3. Create three products: Basic, Pro, Enterprise
4. For each product, add a **Price** with **Billing period: Monthly**
5. Copy each Price ID (starts with `price_`)
6. Save these Price IDs - you'll need them next

## Step 3: Update Environment Variables

1. Open `.env.local` (or create if missing)
2. Add these variables:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLISHABLE_KEY
VITE_SITE_URL=http://localhost:3000

# Supabase (should already exist)
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

3. **For Production:** Replace `sk_test_` and `pk_test_` with `sk_live_` and `pk_live_` keys

## Step 4: Set Up Database Schema

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Paste the contents of `sql/stripe-schema.sql`
6. Click **Run**

This creates:
- `customers` table - Links users to Stripe customers
- `subscriptions` table - Tracks active subscriptions
- Row-level security policies
- Auto-updating timestamps

## Step 5: Update Pricing Tier Price IDs

1. Open `src/components/Pricing_Standalone.tsx`
2. Find the `PRICING_TIERS` array
3. Replace the `priceId` values with your actual Price IDs from Stripe:

```typescript
const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    priceId: 'price_YOUR_BASIC_PRICE_ID', // ← Replace this
    // ...
  },
  // ... etc
];
```

## Step 6: Configure Webhook (Production Only)

In development, Stripe events won't reach your `/api/webhooks/stripe` endpoint. For production:

1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **+ Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET`

## Step 7: Test Locally (Optional)

To test webhooks locally:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Copy the webhook signing secret and add to `.env.local`
4. Now Stripe events will be sent to your local server

## Step 8: Update Navigation Links

Add links to pricing/billing in your navigation:

```tsx
<Link to="/pricing-checkout">Pricing</Link>
<Link to="/account/billing">Billing</Link>
```

## Integration Summary

### User Flow

1. **User visits `/pricing-checkout`**
   - Sees pricing plans
   - Clicks "Subscribe Now"

2. **Checkout Process**
   - Creates/gets Stripe customer
   - Redirects to Stripe Checkout
   - User enters payment info

3. **Post-Checkout**
   - Stripe creates subscription
   - Webhook notifies your app
   - Subscription saved to database
   - User redirected to success page

4. **User visits `/account/billing`**
   - Sees active subscription
   - Can manage billing (update payment method, etc.)
   - Can cancel subscription

### Webhook Flow

When subscription events occur in Stripe:
1. Stripe sends webhook to `/api/webhooks/stripe`
2. Handler verifies signature
3. Updates database based on event type
4. Responds with 200 OK

## Testing Checklist

- [ ] Created Stripe account with test keys
- [ ] Created 3 products with monthly prices
- [ ] Added environment variables to `.env.local`
- [ ] Ran database schema SQL in Supabase
- [ ] Updated price IDs in `Pricing_Standalone.tsx`
- [ ] Site loads without errors
- [ ] Can navigate to `/pricing-checkout`
- [ ] Can navigate to `/account/billing`
- [ ] (Optional) Tested webhook with Stripe CLI

## Troubleshooting

### "Missing Stripe environment variables"
- Make sure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are in `.env.local`
- Restart dev server after adding env vars

### Checkout not working
- Verify price IDs are correct in `Pricing_Standalone.tsx`
- Check browser console for API errors
- Make sure user is authenticated before checkout

### Subscriptions not saving
- Check database schema was run successfully
- Verify webhook handler is logging events
- Check Supabase RLS policies aren't blocking inserts

## Next Steps

1. **Customize pricing plans** - Update features, prices, and names in `Pricing_Standalone.tsx`
2. **Add trial period** - Modify checkout to include `trial_period_days`
3. **Email notifications** - Add email service (SendGrid, Resend, etc.) for receipts
4. **Upgrade/downgrade** - Use Stripe portal for plan changes
5. **Metered billing** - For usage-based pricing (advanced)

## Security Notes

- ✅ Never expose `STRIPE_SECRET_KEY` to client
- ✅ Always verify webhook signatures
- ✅ Use RLS policies to protect customer data
- ✅ Validate user ownership before operations
- ✅ Store sensitive data server-side only

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Subscriptions Guide](https://stripe.com/docs/billing)
- [TanStack Start Guide](https://tanstack.com/start/latest)
- [Supabase Guide](https://supabase.com/docs)
