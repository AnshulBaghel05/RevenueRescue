-- Migration to update profiles table with audit tracking fields
-- This migration is safe to run on existing databases

-- Check if columns exist before adding them
DO $$
BEGIN
    -- Add audits_used column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'audits_used'
    ) THEN
        ALTER TABLE profiles ADD COLUMN audits_used INTEGER DEFAULT 0;
    END IF;

    -- Add audits_limit column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'audits_limit'
    ) THEN
        ALTER TABLE profiles ADD COLUMN audits_limit INTEGER DEFAULT 3;
    END IF;

    -- Remove credits_remaining if it exists (old field)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'credits_remaining'
    ) THEN
        ALTER TABLE profiles DROP COLUMN credits_remaining;
    END IF;
END $$;

-- Update audits table to add missing columns
DO $$
BEGIN
    -- Add overall_grade column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'audits' AND column_name = 'overall_grade'
    ) THEN
        ALTER TABLE audits ADD COLUMN overall_grade TEXT;
    END IF;

    -- Add estimated_revenue_loss column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'audits' AND column_name = 'estimated_revenue_loss'
    ) THEN
        ALTER TABLE audits ADD COLUMN estimated_revenue_loss INTEGER;
    END IF;

    -- Add results column (JSONB) if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'audits' AND column_name = 'results'
    ) THEN
        ALTER TABLE audits ADD COLUMN results JSONB;
    END IF;
END $$;

-- Create or replace the increment_audits_used function
CREATE OR REPLACE FUNCTION increment_audits_used(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET audits_used = audits_used + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing profiles to have default audit limits based on subscription tier
UPDATE profiles
SET
    audits_limit = CASE
        WHEN subscription_tier = 'free' THEN 3
        WHEN subscription_tier = 'starter' THEN 16
        WHEN subscription_tier = 'pro' THEN 30
        ELSE 3
    END
WHERE audits_limit IS NULL OR audits_limit = 0;

-- Set default audits_used to 0 for existing users
UPDATE profiles
SET audits_used = 0
WHERE audits_used IS NULL;
