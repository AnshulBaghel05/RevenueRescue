-- Performance optimizations and additional indexes
-- This migration improves query performance for common operations
-- NOTE: This migration can be run independently, but works best after migrations 006 and 007

-- Add partial indexes for faster filtered queries
CREATE INDEX IF NOT EXISTS idx_audits_completed
  ON audits(user_id, created_at DESC)
  WHERE status = 'completed';

CREATE INDEX IF NOT EXISTS idx_audits_failed
  ON audits(user_id, created_at DESC)
  WHERE status = 'failed';

CREATE INDEX IF NOT EXISTS idx_audits_pending
  ON audits(user_id, created_at DESC)
  WHERE status = 'pending' OR status = 'running';

-- Add composite index for trend queries
CREATE INDEX IF NOT EXISTS idx_audits_user_store_date
  ON audits(user_id, store_url, created_at DESC)
  WHERE status = 'completed';

-- Add index for subscription expiration checks
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_expiry
  ON profiles(subscription_ends_at)
  WHERE subscription_status = 'active';

-- Add index for payment lookup by order
CREATE INDEX IF NOT EXISTS idx_payments_order_user
  ON payments(razorpay_order_id, user_id);

-- Optimize JSONB queries with GIN indexes
CREATE INDEX IF NOT EXISTS idx_audits_results_gin ON audits USING GIN (results);
CREATE INDEX IF NOT EXISTS idx_audits_performance_gin ON audits USING GIN (performance_data);
CREATE INDEX IF NOT EXISTS idx_audits_conversion_gin ON audits USING GIN (conversion_data);

-- Create function to archive old audit data (for data retention)
CREATE OR REPLACE FUNCTION archive_old_audits(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Create archived_audits table if it doesn't exist
  CREATE TABLE IF NOT EXISTS archived_audits (LIKE audits INCLUDING ALL);

  -- Move old audits to archive
  WITH archived AS (
    DELETE FROM audits
    WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL
    AND status = 'completed'
    RETURNING *
  )
  INSERT INTO archived_audits
  SELECT * FROM archived;

  GET DIAGNOSTICS archived_count = ROW_COUNT;

  RETURN archived_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to cleanup failed/stale audits
CREATE OR REPLACE FUNCTION cleanup_stale_audits()
RETURNS INTEGER AS $$
DECLARE
  cleaned_count INTEGER;
BEGIN
  -- Delete audits that have been stuck in pending/running for more than 1 hour
  DELETE FROM audits
  WHERE status IN ('pending', 'running')
  AND created_at < NOW() - INTERVAL '1 hour';

  GET DIAGNOSTICS cleaned_count = ROW_COUNT;

  RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get dashboard statistics efficiently
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_user_id UUID)
RETURNS TABLE (
  total_audits INTEGER,
  audits_remaining INTEGER,
  average_score NUMERIC,
  total_revenue_loss BIGINT,
  recent_audits JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH profile_data AS (
    SELECT
      p.audits_used,
      p.audits_limit
    FROM profiles p
    WHERE p.id = p_user_id
  ),
  audit_data AS (
    SELECT
      COUNT(*) as total,
      ROUND(AVG(a.overall_score), 0) as avg_score,
      SUM(a.estimated_revenue_loss) as total_loss
    FROM audits a
    WHERE a.user_id = p_user_id
    AND a.status = 'completed'
  ),
  recent AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'store_url', a.store_url,
        'overall_score', a.overall_score,
        'overall_grade', a.overall_grade,
        'estimated_revenue_loss', a.estimated_revenue_loss,
        'created_at', a.created_at
      )
      ORDER BY a.created_at DESC
    ) as audits
    FROM (
      SELECT * FROM audits
      WHERE user_id = p_user_id
      AND status = 'completed'
      ORDER BY created_at DESC
      LIMIT 10
    ) a
  )
  SELECT
    COALESCE(ad.total, 0)::INTEGER,
    COALESCE(pd.audits_limit - pd.audits_used, 0)::INTEGER,
    COALESCE(ad.avg_score, 0),
    COALESCE(ad.total_loss, 0)::BIGINT,
    COALESCE(r.audits, '[]'::JSONB)
  FROM profile_data pd
  CROSS JOIN audit_data ad
  CROSS JOIN recent r;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get audit comparison data
CREATE OR REPLACE FUNCTION get_audit_comparison(p_audit_id_1 UUID, p_audit_id_2 UUID, p_user_id UUID)
RETURNS TABLE (
  audit1 JSONB,
  audit2 JSONB,
  differences JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH a1 AS (
    SELECT row_to_json(a)::JSONB as data
    FROM audits a
    WHERE a.id = p_audit_id_1
    AND a.user_id = p_user_id
  ),
  a2 AS (
    SELECT row_to_json(a)::JSONB as data
    FROM audits a
    WHERE a.id = p_audit_id_2
    AND a.user_id = p_user_id
  )
  SELECT
    a1.data,
    a2.data,
    jsonb_build_object(
      'score_diff', (a1.data->>'overall_score')::INTEGER - (a2.data->>'overall_score')::INTEGER,
      'performance_diff', (a1.data->>'performance_score')::INTEGER - (a2.data->>'performance_score')::INTEGER,
      'conversion_diff', (a1.data->>'conversion_score')::INTEGER - (a2.data->>'conversion_score')::INTEGER,
      'revenue_diff', (a1.data->>'estimated_revenue_loss')::INTEGER - (a2.data->>'estimated_revenue_loss')::INTEGER
    )
  FROM a1
  CROSS JOIN a2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable auto-vacuum on large tables (only if they exist)
-- This uses DO blocks to safely configure tables that may not exist yet

DO $$
BEGIN
  -- Configure audits table (always exists)
  ALTER TABLE audits SET (autovacuum_vacuum_scale_factor = 0.05);

  -- Configure analytics_events table if it exists (from migration 007)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics_events') THEN
    ALTER TABLE analytics_events SET (autovacuum_vacuum_scale_factor = 0.05);
  END IF;

  -- Configure audit_logs table if it exists (from migration 006)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    ALTER TABLE audit_logs SET (autovacuum_vacuum_scale_factor = 0.1);
  END IF;
END $$;

-- Add table statistics for query planner (only for tables that exist)
DO $$
BEGIN
  -- Core tables (always exist)
  ANALYZE profiles;
  ANALYZE audits;
  ANALYZE subscriptions;
  ANALYZE payments;

  -- Optional tables from other migrations
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics_events') THEN
    ANALYZE analytics_events;
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
    ANALYZE audit_logs;
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
    ANALYZE user_preferences;
  END IF;
END $$;

-- Comments
COMMENT ON FUNCTION archive_old_audits IS 'Archives audits older than specified days to archive table';
COMMENT ON FUNCTION cleanup_stale_audits IS 'Removes audits stuck in pending/running state';
COMMENT ON FUNCTION get_dashboard_stats IS 'Efficiently retrieves dashboard statistics in single query';
COMMENT ON FUNCTION get_audit_comparison IS 'Returns comparison data for two audits with calculated differences';
