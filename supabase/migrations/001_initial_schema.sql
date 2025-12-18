-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_ends_at TIMESTAMPTZ,
  razorpay_customer_id TEXT,
  audits_used INTEGER DEFAULT 0,
  audits_limit INTEGER DEFAULT 3, -- Free tier gets 3 audits per month
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Shopify stores table
CREATE TABLE shopify_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_domain TEXT NOT NULL, -- e.g., "mystore.myshopify.com"
  shop_name TEXT,
  access_token TEXT, -- Encrypted OAuth token
  scope TEXT, -- OAuth scopes granted
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, shop_domain)
);

-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES shopify_stores(id) ON DELETE SET NULL, -- NULL if public URL audit

  -- Store Info
  store_url TEXT NOT NULL,
  store_name TEXT,
  audit_type TEXT CHECK (audit_type IN ('public', 'authenticated')),

  -- Audit Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0, -- 0-100

  -- Overall Score
  overall_score INTEGER, -- 0-100
  grade TEXT, -- A, B, C, D, F

  -- Category Scores (0-100 each)
  performance_score INTEGER,
  conversion_score INTEGER,
  mobile_score INTEGER,
  seo_score INTEGER,

  -- Detailed Results (JSONB for flexibility)
  performance_data JSONB,
  conversion_data JSONB,
  revenue_data JSONB,
  image_data JSONB,
  mobile_data JSONB,
  link_data JSONB,
  app_data JSONB,

  -- Benchmarking
  benchmark_data JSONB,

  -- Recommendations
  instant_wins JSONB[],
  priority_fixes JSONB[],

  -- Metadata
  audit_duration_seconds INTEGER,
  error_message TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Razorpay Details
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_plan_id TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,

  -- Subscription Info
  plan_name TEXT NOT NULL CHECK (plan_name IN ('starter', 'pro')),
  amount INTEGER NOT NULL, -- In paise (INR)
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),

  -- Status
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'authenticated', 'active', 'paused', 'cancelled', 'expired')),
  current_start TIMESTAMPTZ,
  current_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,

  -- Limits
  audits_per_month INTEGER,
  audits_used_this_period INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  razorpay_payment_id TEXT UNIQUE NOT NULL,
  razorpay_order_id TEXT,

  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),

  payment_method TEXT,
  invoice_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit exports table
CREATE TABLE audit_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  export_type TEXT DEFAULT 'pdf' CHECK (export_type IN ('pdf', 'json')),
  file_url TEXT,
  file_size INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_audits_user_id ON audits(user_id);
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX idx_shopify_stores_user_id ON shopify_stores(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for shopify_stores
CREATE POLICY "Users can view own stores" ON shopify_stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stores" ON shopify_stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stores" ON shopify_stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stores" ON shopify_stores FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for audits
CREATE POLICY "Users can view own audits" ON audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own audits" ON audits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own audits" ON audits FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for audit_exports
CREATE POLICY "Users can view own exports" ON audit_exports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own exports" ON audit_exports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shopify_stores_updated_at BEFORE UPDATE ON shopify_stores
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to increment audits_used counter
CREATE OR REPLACE FUNCTION increment_audits_used(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET audits_used = audits_used + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
