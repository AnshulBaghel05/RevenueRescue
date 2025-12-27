-- Scheduled/Automated Audits Feature (Starter & Pro Plans)
-- This migration adds support for recurring automated audits

-- Create scheduled_audits table
CREATE TABLE IF NOT EXISTS scheduled_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_url TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure users can only schedule one audit per store
  UNIQUE(user_id, store_url)
);

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_scheduled_audits_user ON scheduled_audits(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_audits_next_run ON scheduled_audits(next_run_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_scheduled_audits_user_active ON scheduled_audits(user_id, is_active);

-- Enable RLS
ALTER TABLE scheduled_audits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own scheduled audits"
  ON scheduled_audits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own scheduled audits"
  ON scheduled_audits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scheduled audits"
  ON scheduled_audits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own scheduled audits"
  ON scheduled_audits FOR DELETE
  USING (auth.uid() = user_id);

-- Function to calculate next run time
CREATE OR REPLACE FUNCTION calculate_next_run(
  p_frequency TEXT,
  p_from_time TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  RETURN CASE p_frequency
    WHEN 'daily' THEN p_from_time + INTERVAL '1 day'
    WHEN 'weekly' THEN p_from_time + INTERVAL '7 days'
    WHEN 'monthly' THEN p_from_time + INTERVAL '1 month'
    ELSE p_from_time + INTERVAL '1 week'
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_scheduled_audits_updated_at
  BEFORE UPDATE ON scheduled_audits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user can schedule more audits (based on tier limits)
CREATE OR REPLACE FUNCTION check_scheduled_audit_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_tier TEXT;
  scheduled_count INTEGER;
  max_allowed INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM profiles WHERE id = NEW.user_id;

  -- Count existing scheduled audits
  SELECT COUNT(*) INTO scheduled_count
  FROM scheduled_audits
  WHERE user_id = NEW.user_id AND is_active = true;

  -- Set limits based on tier
  max_allowed := CASE user_tier
    WHEN 'pro' THEN 10      -- Pro: 10 scheduled audits
    WHEN 'starter' THEN 3   -- Starter: 3 scheduled audits
    ELSE 0                  -- Free: No scheduled audits
  END;

  -- Check if user has reached limit
  IF user_tier = 'free' THEN
    RAISE EXCEPTION 'Scheduled audits are only available for Starter and Pro plans. Please upgrade.';
  END IF;

  IF scheduled_count >= max_allowed THEN
    RAISE EXCEPTION 'You have reached the maximum number of scheduled audits for your % plan (%/%)', user_tier, scheduled_count, max_allowed;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce scheduled audit limits
CREATE TRIGGER check_scheduled_audit_limit_trigger
  BEFORE INSERT ON scheduled_audits
  FOR EACH ROW
  EXECUTE FUNCTION check_scheduled_audit_limit();

-- Function to get scheduled audits due for execution
CREATE OR REPLACE FUNCTION get_due_scheduled_audits(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  store_url TEXT,
  frequency TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sa.id,
    sa.user_id,
    sa.store_url,
    sa.frequency
  FROM scheduled_audits sa
  JOIN profiles p ON sa.user_id = p.id
  WHERE sa.is_active = true
    AND sa.next_run_at <= NOW()
    AND p.subscription_tier IN ('starter', 'pro')  -- Only run for paid tiers
    AND p.audits_used < p.audits_limit             -- Only if user has audits remaining
  ORDER BY sa.next_run_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark scheduled audit as executed and calculate next run
CREATE OR REPLACE FUNCTION mark_scheduled_audit_executed(p_audit_id UUID)
RETURNS VOID AS $$
DECLARE
  v_frequency TEXT;
BEGIN
  -- Get frequency
  SELECT frequency INTO v_frequency
  FROM scheduled_audits
  WHERE id = p_audit_id;

  -- Update last_run and next_run
  UPDATE scheduled_audits
  SET
    last_run_at = NOW(),
    next_run_at = calculate_next_run(v_frequency),
    updated_at = NOW()
  WHERE id = p_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE scheduled_audits IS 'Stores recurring/scheduled audit configurations for Starter and Pro users';
COMMENT ON FUNCTION calculate_next_run IS 'Calculates next execution time based on frequency';
COMMENT ON FUNCTION check_scheduled_audit_limit IS 'Enforces tier-based limits: Free=0, Starter=3, Pro=10';
COMMENT ON FUNCTION get_due_scheduled_audits IS 'Returns scheduled audits ready for execution';
COMMENT ON FUNCTION mark_scheduled_audit_executed IS 'Updates audit after execution and schedules next run';
