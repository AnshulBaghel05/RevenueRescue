-- Security enhancements and additional constraints
-- This migration adds security features, audit logging, and data integrity constraints

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- For encryption functions

-- Add audit logging table for security tracking
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_action ON audit_logs(table_name, action);

-- Enable RLS on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow viewing audit logs for own user (admins can override with service role)
CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Add function to log sensitive table changes
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log for subscriptions and payments tables
  IF TG_TABLE_NAME IN ('subscriptions', 'payments', 'profiles') THEN
    INSERT INTO audit_logs (user_id, table_name, action, old_data, new_data)
    VALUES (
      COALESCE(NEW.user_id, OLD.user_id),
      TG_TABLE_NAME,
      TG_OP,
      CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit logging triggers
DROP TRIGGER IF EXISTS audit_subscriptions_changes ON subscriptions;
CREATE TRIGGER audit_subscriptions_changes
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

DROP TRIGGER IF EXISTS audit_payments_changes ON payments;
CREATE TRIGGER audit_payments_changes
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

DROP TRIGGER IF EXISTS audit_profiles_changes ON profiles;
CREATE TRIGGER audit_profiles_changes
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Add constraint to ensure subscription amounts are positive
ALTER TABLE subscriptions ADD CONSTRAINT positive_amount CHECK (amount > 0);

-- Add constraint to ensure payment amounts are positive
ALTER TABLE payments ADD CONSTRAINT positive_payment_amount CHECK (amount > 0);

-- Add constraint to ensure audit scores are in valid range
ALTER TABLE audits ADD CONSTRAINT valid_overall_score CHECK (overall_score >= 0 AND overall_score <= 100);
ALTER TABLE audits ADD CONSTRAINT valid_performance_score CHECK (performance_score IS NULL OR (performance_score >= 0 AND performance_score <= 100));
ALTER TABLE audits ADD CONSTRAINT valid_conversion_score CHECK (conversion_score IS NULL OR (conversion_score >= 0 AND conversion_score <= 100));
ALTER TABLE audits ADD CONSTRAINT valid_mobile_score CHECK (mobile_score IS NULL OR (mobile_score >= 0 AND mobile_score <= 100));
ALTER TABLE audits ADD CONSTRAINT valid_seo_score CHECK (seo_score IS NULL OR (seo_score >= 0 AND seo_score <= 100));

-- Add constraint to ensure audits_used doesn't exceed limit
ALTER TABLE profiles ADD CONSTRAINT valid_audits_usage CHECK (audits_used >= 0 AND audits_used <= audits_limit + 5); -- Allow 5 over for grace

-- Add function to reset monthly audit counters (to be called by cron job)
CREATE OR REPLACE FUNCTION reset_monthly_audits()
RETURNS void AS $$
BEGIN
  -- Reset audits_used for all active users
  UPDATE profiles
  SET audits_used = 0
  WHERE subscription_status = 'active';

  -- Log the reset
  INSERT INTO audit_logs (user_id, table_name, action, new_data)
  VALUES (NULL, 'profiles', 'UPDATE', jsonb_build_object('action', 'monthly_reset', 'timestamp', NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to check audit limit before creating audit
CREATE OR REPLACE FUNCTION check_audit_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_limit INTEGER;
  user_used INTEGER;
BEGIN
  -- Get current usage and limit
  SELECT audits_limit, audits_used INTO user_limit, user_used
  FROM profiles
  WHERE id = NEW.user_id;

  -- Check if user has exceeded limit
  IF user_used >= user_limit THEN
    RAISE EXCEPTION 'Audit limit exceeded. Please upgrade your plan or wait for monthly reset.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to check audit limit before insert
DROP TRIGGER IF EXISTS check_audit_limit_trigger ON audits;
CREATE TRIGGER check_audit_limit_trigger
  BEFORE INSERT ON audits
  FOR EACH ROW EXECUTE FUNCTION check_audit_limit();

-- Add function to validate subscription tier changes
CREATE OR REPLACE FUNCTION validate_subscription_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure tier is valid
  IF NEW.subscription_tier NOT IN ('free', 'starter', 'pro') THEN
    RAISE EXCEPTION 'Invalid subscription tier: %', NEW.subscription_tier;
  END IF;

  -- Update audit limits based on tier
  NEW.audits_limit := CASE NEW.subscription_tier
    WHEN 'free' THEN 3
    WHEN 'starter' THEN 16
    WHEN 'pro' THEN 30
    ELSE 3
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to validate subscription tier
DROP TRIGGER IF EXISTS validate_subscription_tier_trigger ON profiles;
CREATE TRIGGER validate_subscription_tier_trigger
  BEFORE INSERT OR UPDATE OF subscription_tier ON profiles
  FOR EACH ROW EXECUTE FUNCTION validate_subscription_tier();

-- Add indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Add comments for documentation
COMMENT ON TABLE audit_logs IS 'Security audit trail for sensitive operations';
COMMENT ON FUNCTION reset_monthly_audits() IS 'Resets monthly audit counters for all active users';
COMMENT ON FUNCTION check_audit_limit() IS 'Prevents audit creation if user has exceeded their limit';
COMMENT ON FUNCTION validate_subscription_tier() IS 'Ensures subscription tier is valid and sets appropriate limits';
