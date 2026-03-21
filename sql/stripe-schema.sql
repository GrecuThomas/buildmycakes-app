-- Create customers table (links auth to Stripe)
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL UNIQUE,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_price_id text NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active, past_due, canceled, unpaid, etc.
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT FALSE,
  canceled_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Enable row level security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers table
CREATE POLICY "Users can view their own customer record"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer record"
  ON customers FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = subscriptions.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
