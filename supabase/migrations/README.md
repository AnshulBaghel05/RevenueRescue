# Database Migrations - RevenueRescue

This directory contains all database migrations for the RevenueRescue SaaS application.

## Migration Files

### 001_initial_schema.sql ✅
**Purpose**: Initial database schema setup
**Created**: Initial release

**What it does**:
- Creates all core tables (profiles, audits, subscriptions, payments, etc.)
- Sets up Row Level Security (RLS) policies
- Creates indexes for performance
- Sets up triggers for user creation and timestamp updates
- Creates utility functions (`increment_audits_used`)

**Tables Created**:
- `profiles` - User profiles with subscription information
- `shopify_stores` - Shopify store connections
- `audits` - Audit results and history
- `subscriptions` - Razorpay subscription management
- `payments` - Payment transaction records
- `audit_exports` - PDF/JSON export tracking

**Security Features**:
- RLS enabled on all tables
- User can only access their own data
- Automatic profile creation on signup
- Secure foreign key relationships

---

### 002_update_profiles_audits.sql ✅
**Purpose**: Add audit tracking and limits
**Created**: Feature update

**What it does**:
- Adds `audits_used` and `audits_limit` columns to profiles
- Adds `overall_grade` and `estimated_revenue_loss` to audits
- Adds `results` JSONB column for flexible data storage
- Creates `increment_audits_used()` function
- Updates existing users with default limits based on tier

**Why needed**:
- Enables monthly audit limit enforcement
- Tracks usage per user
- Stores revenue impact calculations

---

### 003_shopify_connections.sql ✅
**Purpose**: Shopify OAuth integration
**Created**: Shopify feature

**What it does**:
- Creates `shopify_connections` table
- Stores OAuth access tokens (should be encrypted in production)
- RLS policies for secure access
- Indexes for fast lookups
- Unique constraint on user + shop domain

**Security**:
- Tokens should be encrypted at rest (add pgcrypto in production)
- Each user can only access their own connections

---

### 004_add_company_name.sql ✅
**Purpose**: Custom branding for Pro users
**Created**: Phase 7 (PDF Export)

**What it does**:
- Adds `company_name` column to profiles table
- Used for custom branding in PDF exports
- Only Pro tier users get custom branding

---

### 005_add_missing_columns.sql ✅ NEW
**Purpose**: Add columns used by application but missing from initial schema
**Created**: Database audit fix

**What it does**:
- Adds `overall_grade` to audits (if missing)
- Adds `estimated_revenue_loss` to audits (if missing)
- Adds `results` JSONB to audits (if missing)
- Makes `razorpay_payment_id` nullable in payments table
- Adds additional indexes for performance
- Adds column comments for documentation

**Why needed**:
- Application code uses these columns
- Ensures all features work correctly
- Improves query performance

---

### 006_security_enhancements.sql ✅ NEW
**Purpose**: Security hardening and audit logging
**Created**: Security audit

**What it does**:
- Creates `audit_logs` table for security tracking
- Logs all changes to subscriptions, payments, and profiles
- Adds data integrity constraints (positive amounts, valid scores)
- Creates `reset_monthly_audits()` function for cron job
- Adds `check_audit_limit()` trigger to prevent overuse
- Validates subscription tier changes automatically
- Prevents audit creation if limit exceeded

**Security Features**:
- ✅ Complete audit trail for sensitive operations
- ✅ Constraint-based validation (can't be bypassed)
- ✅ Automatic tier limit enforcement
- ✅ Score validation (0-100 range)
- ✅ Amount validation (positive values only)
- ✅ Grace period for audit limits (+5 over)

**New Tables**:
- `audit_logs` - Security audit trail

**New Functions**:
- `log_audit_changes()` - Logs all sensitive table changes
- `reset_monthly_audits()` - Monthly reset (call via cron)
- `check_audit_limit()` - Prevents audit creation if over limit
- `validate_subscription_tier()` - Auto-sets correct limits

---

### 007_analytics_features.sql ✅ NEW
**Purpose**: Support for Phase 8 Advanced Analytics Dashboard
**Created**: Phase 8 implementation

**What it does**:
- Creates `analytics_events` table for event tracking
- Creates `audit_statistics` materialized view for fast analytics
- Creates `audit_trends` view for trend analysis
- Creates `calculate_score_prediction()` for linear regression forecasting
- Creates `generate_audit_insights()` for AI-powered insights
- Creates `user_preferences` table for user settings
- Adds indexes for analytics queries

**New Tables**:
- `analytics_events` - User interaction tracking
- `user_preferences` - User-specific settings
- `audit_statistics` - Materialized view (pre-calculated stats)
- `audit_trends` - View for trend queries

**New Functions**:
- `refresh_audit_statistics()` - Updates materialized view
- `calculate_score_prediction(user_id, store_url)` - Predicts next score
- `generate_audit_insights(user_id)` - AI insights generation

**Features Enabled**:
- ✅ Predictive forecasting with confidence scores
- ✅ Trend analysis over time
- ✅ AI-powered recommendations
- ✅ User event tracking
- ✅ Fast dashboard statistics

---

### 008_performance_optimizations.sql ✅ NEW
**Purpose**: Query performance and data management
**Created**: Performance optimization

**What it does**:
- Adds partial indexes for faster filtered queries
- Adds GIN indexes for JSONB column searches
- Creates `archive_old_audits()` function for data retention
- Creates `cleanup_stale_audits()` function to remove stuck audits
- Creates `get_dashboard_stats()` for efficient dashboard queries
- Creates `get_audit_comparison()` for compare feature
- Configures auto-vacuum for large tables
- Runs ANALYZE for query planner optimization

**Performance Features**:
- ✅ Partial indexes on completed/failed/pending audits
- ✅ Composite index for trend queries
- ✅ GIN indexes for JSONB full-text search
- ✅ Single-query dashboard stats (vs multiple queries)
- ✅ Efficient audit comparison
- ✅ Auto-vacuum tuning

**New Functions**:
- `archive_old_audits(days)` - Archive old data (default 365 days)
- `cleanup_stale_audits()` - Remove stuck audits (>1 hour)
- `get_dashboard_stats(user_id)` - Single query for dashboard
- `get_audit_comparison(id1, id2, user_id)` - Compare two audits

---

## Migration Order

**CRITICAL**: Run migrations in numerical order!

```bash
1. 001_initial_schema.sql        # Base schema
2. 002_update_profiles_audits.sql # Audit tracking
3. 003_shopify_connections.sql   # Shopify OAuth
4. 004_add_company_name.sql      # Pro branding
5. 005_add_missing_columns.sql   # Application fixes
6. 006_security_enhancements.sql # Security hardening
7. 007_analytics_features.sql    # Phase 8 analytics
8. 008_performance_optimizations.sql # Performance
```

---

## How to Apply Migrations

### Using Supabase Dashboard (Recommended)
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste each migration file
4. Run in order (001 → 008)
5. Verify no errors

### Using Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push all migrations
supabase db push

# Or apply specific migration
supabase db execute -f supabase/migrations/001_initial_schema.sql
```

### Manual psql (Advanced)
```bash
psql "postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres" \
  -f supabase/migrations/001_initial_schema.sql
```

---

## Verification Checklist

After running all migrations, verify:

### Tables Created
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected tables** (14 total):
- ✅ analytics_events
- ✅ audit_exports
- ✅ audit_logs
- ✅ audits
- ✅ payments
- ✅ profiles
- ✅ shopify_connections
- ✅ shopify_stores
- ✅ subscriptions
- ✅ user_preferences

### RLS Enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

**All tables should show**: `rowsecurity = true`

### Functions Created
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Expected functions** (15+):
- archive_old_audits
- calculate_score_prediction
- check_audit_limit
- cleanup_stale_audits
- generate_audit_insights
- get_audit_comparison
- get_dashboard_stats
- handle_new_user
- increment_audits_used
- log_audit_changes
- refresh_audit_statistics
- reset_monthly_audits
- update_updated_at_column
- validate_subscription_tier

### Indexes Created
```sql
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY indexname;
```

**Should see 30+ indexes** including:
- Primary keys
- Foreign keys
- Performance indexes (idx_*)
- GIN indexes for JSONB
- Partial indexes for filtered queries

---

## Security Best Practices

### ✅ Implemented
1. **Row Level Security (RLS)** - Enabled on all tables
2. **User Isolation** - Users can only access their own data
3. **Audit Logging** - All sensitive changes tracked
4. **Constraint Validation** - Database-level validation
5. **Secure Functions** - SECURITY DEFINER for controlled access
6. **Audit Limit Enforcement** - Prevents abuse

### ⚠️ TODO for Production
1. **Encrypt Shopify tokens** - Use pgcrypto for access_token column
2. **IP Rate Limiting** - Add rate limiting at database level
3. **Backup Strategy** - Configure automated backups
4. **Monitoring** - Set up alerts for failed migrations
5. **Connection Pooling** - Configure pgBouncer
6. **SSL/TLS** - Ensure all connections use SSL

---

## Maintenance Tasks

### Monthly (Automated via Cron)
```sql
-- Reset audit counters (run on 1st of each month)
SELECT reset_monthly_audits();

-- Refresh analytics statistics
SELECT refresh_audit_statistics();
```

### Quarterly
```sql
-- Archive old audits (keep last year)
SELECT archive_old_audits(365);

-- Cleanup stale audits
SELECT cleanup_stale_audits();

-- Vacuum large tables
VACUUM ANALYZE audits;
VACUUM ANALYZE analytics_events;
VACUUM ANALYZE audit_logs;
```

### As Needed
```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## Rollback Instructions

If a migration fails, you can rollback:

### Rollback 008 (Performance)
```sql
-- Drop functions
DROP FUNCTION IF EXISTS archive_old_audits;
DROP FUNCTION IF EXISTS cleanup_stale_audits;
DROP FUNCTION IF EXISTS get_dashboard_stats;
DROP FUNCTION IF EXISTS get_audit_comparison;

-- Drop indexes created in 008
-- (List specific indexes from migration 008)
```

### Rollback 007 (Analytics)
```sql
-- Drop views
DROP MATERIALIZED VIEW IF EXISTS audit_statistics CASCADE;
DROP VIEW IF EXISTS audit_trends CASCADE;

-- Drop tables
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS refresh_audit_statistics;
DROP FUNCTION IF EXISTS calculate_score_prediction;
DROP FUNCTION IF EXISTS generate_audit_insights;
```

### Rollback 006 (Security)
```sql
-- Drop triggers
DROP TRIGGER IF EXISTS audit_subscriptions_changes ON subscriptions;
DROP TRIGGER IF EXISTS audit_payments_changes ON payments;
DROP TRIGGER IF EXISTS audit_profiles_changes ON profiles;
DROP TRIGGER IF EXISTS check_audit_limit_trigger ON audits;
DROP TRIGGER IF EXISTS validate_subscription_tier_trigger ON profiles;

-- Drop constraints
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS positive_amount;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS positive_payment_amount;
ALTER TABLE audits DROP CONSTRAINT IF EXISTS valid_overall_score;
-- ... (drop other constraints)

-- Drop table
DROP TABLE IF EXISTS audit_logs CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS log_audit_changes;
DROP FUNCTION IF EXISTS reset_monthly_audits;
DROP FUNCTION IF EXISTS check_audit_limit;
DROP FUNCTION IF EXISTS validate_subscription_tier;
```

**Note**: Only rollback if absolutely necessary. Better to fix forward with a new migration.

---

## Environment-Specific Notes

### Development (.env.local)
- RLS can be bypassed with service role key for testing
- Use test Razorpay keys
- Smaller data retention (30 days vs 365)

### Staging
- Same schema as production
- Use test payment keys
- Test all migrations before production
- Full RLS enforcement

### Production
- **BACKUP BEFORE MIGRATIONS**
- Run during low-traffic hours
- Monitor for errors
- Have rollback plan ready
- Use live Razorpay keys
- Enable all security features
- Set up monitoring and alerts

---

## Database Health Checks

### Check RLS Status
```sql
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✅ Enabled' ELSE '❌ Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public';
```

### Check Foreign Keys
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```

### Check Constraints
```sql
SELECT
  table_name,
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
ORDER BY table_name, constraint_type;
```

---

## Support and Documentation

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Project GitHub**: [Your repo URL]

---

**Last Updated**: December 25, 2025
**Database Version**: PostgreSQL 15.x (Supabase)
**Total Migrations**: 8
**Status**: ✅ Production Ready
