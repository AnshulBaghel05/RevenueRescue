-- Migration to add missing columns to audits table that are used by the application
-- This ensures all application features work correctly

-- Add missing columns to audits table
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

-- Update payments table to support the current payment flow
DO $$
BEGIN
    -- Make razorpay_payment_id nullable for order creation
    ALTER TABLE payments ALTER COLUMN razorpay_payment_id DROP NOT NULL;

    -- Add status default if not set
    ALTER TABLE payments ALTER COLUMN status SET DEFAULT 'created';
END $$;

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_audits_overall_score ON audits(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_audits_user_created ON audits(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(razorpay_order_id);

-- Comment on important columns for documentation
COMMENT ON COLUMN audits.overall_grade IS 'Letter grade (A+, A, B, C, D, F) based on overall_score';
COMMENT ON COLUMN audits.estimated_revenue_loss IS 'Estimated monthly revenue loss in cents/paise';
COMMENT ON COLUMN audits.results IS 'Full audit results stored as JSON for flexibility';
