-- Analytics and reporting features migration
-- Supports Phase 8 Advanced Analytics Dashboard

-- Create analytics_events table for tracking user actions
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- Enable RLS on analytics_events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can view own events, service role can view all
CREATE POLICY "Users can view own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics events" ON analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create materialized view for audit statistics (for faster analytics)
CREATE MATERIALIZED VIEW IF NOT EXISTS audit_statistics AS
SELECT
  user_id,
  COUNT(*) as total_audits,
  AVG(overall_score) as avg_overall_score,
  AVG(performance_score) as avg_performance_score,
  AVG(conversion_score) as avg_conversion_score,
  AVG(mobile_score) as avg_mobile_score,
  AVG(estimated_revenue_loss) as avg_revenue_loss,
  MIN(created_at) as first_audit_date,
  MAX(created_at) as last_audit_date,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as audits_last_30_days,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '90 days' THEN 1 END) as audits_last_90_days
FROM audits
WHERE status = 'completed'
GROUP BY user_id;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_statistics_user_id ON audit_statistics(user_id);

-- Create function to refresh audit statistics
CREATE OR REPLACE FUNCTION refresh_audit_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY audit_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for trend analysis (used in Trends page)
CREATE OR REPLACE VIEW audit_trends AS
SELECT
  a.user_id,
  a.store_url,
  a.created_at::date as audit_date,
  a.overall_score,
  a.performance_score,
  a.conversion_score,
  a.mobile_score,
  a.estimated_revenue_loss,
  LAG(a.overall_score) OVER (PARTITION BY a.user_id, a.store_url ORDER BY a.created_at) as previous_score,
  a.overall_score - LAG(a.overall_score) OVER (PARTITION BY a.user_id, a.store_url ORDER BY a.created_at) as score_change
FROM audits a
WHERE a.status = 'completed'
ORDER BY a.user_id, a.store_url, a.created_at;

-- Grant SELECT on view to authenticated users
GRANT SELECT ON audit_trends TO authenticated;

-- Create function for predictive analytics (linear regression for score forecasting)
CREATE OR REPLACE FUNCTION calculate_score_prediction(p_user_id UUID, p_store_url TEXT)
RETURNS TABLE (
  predicted_score NUMERIC,
  confidence NUMERIC,
  trend TEXT
) AS $$
DECLARE
  data_count INTEGER;
BEGIN
  -- Count available data points
  SELECT COUNT(*) INTO data_count
  FROM audits
  WHERE user_id = p_user_id
    AND store_url = p_store_url
    AND status = 'completed'
    AND created_at > NOW() - INTERVAL '90 days';

  -- Need at least 3 data points for prediction
  IF data_count < 3 THEN
    RETURN QUERY SELECT NULL::NUMERIC, NULL::NUMERIC, 'insufficient_data'::TEXT;
    RETURN;
  END IF;

  -- Simple linear regression on recent audits
  RETURN QUERY
  WITH audit_data AS (
    SELECT
      ROW_NUMBER() OVER (ORDER BY created_at) as x,
      overall_score as y
    FROM audits
    WHERE user_id = p_user_id
      AND store_url = p_store_url
      AND status = 'completed'
      AND created_at > NOW() - INTERVAL '90 days'
    ORDER BY created_at
  ),
  regression AS (
    SELECT
      COUNT(*) as n,
      SUM(x) as sum_x,
      SUM(y) as sum_y,
      SUM(x * y) as sum_xy,
      SUM(x * x) as sum_xx,
      SUM(y * y) as sum_yy
    FROM audit_data
  ),
  coefficients AS (
    SELECT
      (n * sum_xy - sum_x * sum_y) / NULLIF(n * sum_xx - sum_x * sum_x, 0) as slope,
      (sum_y - ((n * sum_xy - sum_x * sum_y) / NULLIF(n * sum_xx - sum_x * sum_x, 0)) * sum_x) / n as intercept,
      n,
      sum_y,
      sum_yy,
      sum_x
    FROM regression
  )
  SELECT
    ROUND(slope * (n + 1) + intercept, 2) as predicted_score,
    -- R-squared as confidence
    ROUND(POWER(
      (n * sum_xy - sum_x * sum_y) /
      SQRT((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y))
    , 2) * 100, 2) as confidence,
    CASE
      WHEN slope > 1 THEN 'improving'
      WHEN slope < -1 THEN 'declining'
      ELSE 'stable'
    END as trend
  FROM coefficients
  CROSS JOIN regression;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to generate AI insights for analytics dashboard
CREATE OR REPLACE FUNCTION generate_audit_insights(p_user_id UUID)
RETURNS TABLE (
  insight_type TEXT,
  title TEXT,
  description TEXT,
  priority INTEGER,
  data JSONB
) AS $$
BEGIN
  -- Overall trend insight
  RETURN QUERY
  SELECT
    'trend'::TEXT,
    'Overall Performance Trend'::TEXT,
    CASE
      WHEN AVG(overall_score) OVER (ORDER BY created_at ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) >
           AVG(overall_score) OVER (ORDER BY created_at ROWS BETWEEN 9 PRECEDING AND 5 PRECEDING)
      THEN 'Your store scores are improving! Keep up the good work.'
      ELSE 'Your scores are declining. Review recent changes to identify issues.'
    END,
    5,
    jsonb_build_object(
      'current_avg', ROUND(AVG(overall_score) OVER (ORDER BY created_at ROWS BETWEEN 4 PRECEDING AND CURRENT ROW), 2),
      'previous_avg', ROUND(AVG(overall_score) OVER (ORDER BY created_at ROWS BETWEEN 9 PRECEDING AND 5 PRECEDING), 2)
    )
  FROM audits
  WHERE user_id = p_user_id AND status = 'completed'
  ORDER BY created_at DESC
  LIMIT 1;

  -- Add more insight types here as needed

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add table for storing user preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  audit_reminders BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  timezone TEXT DEFAULT 'UTC',
  preferred_export_format TEXT DEFAULT 'pdf' CHECK (preferred_export_format IN ('pdf', 'json', 'csv')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Tracks user interactions and events for analytics';
COMMENT ON MATERIALIZED VIEW audit_statistics IS 'Pre-calculated statistics for analytics dashboard performance';
COMMENT ON VIEW audit_trends IS 'Time-series view of audit scores for trend analysis';
COMMENT ON FUNCTION calculate_score_prediction IS 'Predicts next audit score using linear regression';
COMMENT ON FUNCTION generate_audit_insights IS 'Generates AI-powered insights from audit history';
COMMENT ON TABLE user_preferences IS 'User-specific settings and preferences';
