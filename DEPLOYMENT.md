# Deployment Guide - RevenueRescue

Complete guide for deploying RevenueRescue to production.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] All `.env` variables documented in `.env.example`
- [ ] Supabase credentials ready
- [ ] Razorpay API keys ready (production keys)
- [ ] Production domain configured

### 2. Database
- [ ] Migrations 001-008 applied
- [ ] RLS policies tested
- [ ] Audit limit enforcement verified
- [ ] Monthly reset cron job scheduled

### 3. Payment Integration
- [ ] Razorpay production keys configured
- [ ] Webhooks endpoint set up
- [ ] Payment signature verification tested
- [ ] Subscription plans created in Razorpay

### 4. Testing
- [ ] Build completes without errors
- [ ] All features manually tested
- [ ] Payment flow tested (test mode)
- [ ] PDF export working
- [ ] Analytics dashboard functional

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set database password (save securely)
5. Wait for project provisioning (~2 minutes)

### Step 2: Apply Migrations
Apply migrations in order via SQL Editor:

1. Open SQL Editor in Supabase dashboard
2. Copy contents of each migration file
3. Paste and run in sequence:

```sql
-- Migration 001: Initial schema
-- Copy from supabase/migrations/001_initial_schema.sql
-- Click "Run"

-- Migration 002: Audit tracking
-- Copy from supabase/migrations/002_update_profiles_audits.sql
-- Click "Run"

-- Migration 003: Shopify connections
-- Copy from supabase/migrations/003_shopify_connections.sql
-- Click "Run"

-- Migration 004: Company name
-- Copy from supabase/migrations/004_add_company_name.sql
-- Click "Run"

-- Migration 005: Missing columns (CRITICAL)
-- Copy from supabase/migrations/005_add_missing_columns.sql
-- Click "Run"

-- Migration 006: Security enhancements (CRITICAL)
-- Copy from supabase/migrations/006_security_enhancements.sql
-- Click "Run"

-- Migration 007: Analytics features
-- Copy from supabase/migrations/007_analytics_features.sql
-- Click "Run"

-- Migration 008: Performance optimizations
-- Copy from supabase/migrations/008_performance_optimizations.sql
-- Click "Run"
```

### Step 3: Verify Database Setup
```sql
-- Check all tables exist (should return 10)
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
-- All should show TRUE

-- Check triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### Step 4: Set Up Monthly Reset Cron Job
In Supabase Dashboard → Database → Cron Jobs:

```sql
-- Schedule: 0 0 1 * * (1st of month at midnight UTC)
SELECT reset_monthly_audits();
```

### Step 5: Get API Credentials
1. Go to Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

---

## 💳 Razorpay Setup

### Step 1: Create Razorpay Account
1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Enable subscription products

### Step 2: Create Subscription Plans
In Razorpay Dashboard → Subscriptions → Plans:

**Free Plan** (for tracking only):
- Name: Free Plan
- Amount: ₹0
- Billing Cycle: 1 month
- Plan ID: Save for reference

**Starter Plan**:
- Name: Starter Plan
- Amount: ₹2,399 ($29 USD)
- Billing Cycle: 1 month
- Plan ID: Save for reference

**Pro Plan**:
- Name: Pro Plan
- Amount: ₹6,499 ($79 USD)
- Billing Cycle: 1 month
- Plan ID: Save for reference

### Step 3: Configure Webhooks
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `payment.authorized`
   - `payment.failed`
   - `subscription.activated`
   - `subscription.cancelled`
   - `subscription.charged`
4. Save webhook secret → `RAZORPAY_WEBHOOK_SECRET`

### Step 4: Get API Keys
1. Go to Settings → API Keys
2. Generate keys (use **production keys** for live deployment)
3. Copy:
   - Key ID → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET` ⚠️ Keep secret!

---

## 🚀 Vercel Deployment

### Step 1: Prepare for Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Build locally to verify
npm run build

# Should complete without errors
```

### Step 2: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Secret!

# Razorpay (Production Keys)
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx # Secret!
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_WEBHOOK_SECRET=xxx # Secret!

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Razorpay Plan IDs
RAZORPAY_STARTER_PLAN_ID=plan_xxx
RAZORPAY_PRO_PLAN_ID=plan_yyy
```

### Step 4: Configure Domain
1. Go to Settings → Domains
2. Add custom domain
3. Configure DNS records as shown
4. Wait for SSL certificate (automatic)

### Step 5: Configure Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x or higher

---

## 🔒 Security Configuration

### 1. Supabase RLS Policies
Verify RLS is enabled on all tables:
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 2. Environment Variables Security
- ✅ Never commit `.env` files to git
- ✅ Use Vercel environment variables (encrypted at rest)
- ✅ Rotate keys periodically
- ✅ Use different keys for dev/staging/prod

### 3. CORS Configuration
Supabase auto-configures CORS for your domain. Verify in Settings → API.

### 4. Rate Limiting
Consider adding rate limiting for API routes:
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

---

## 📊 Post-Deployment Monitoring

### 1. Database Health
Monitor in Supabase Dashboard → Database:
- Query performance
- Connection pooling
- Table sizes
- Index usage

```sql
-- Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Check table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Application Monitoring
In Vercel Dashboard → Analytics:
- Page load times
- Error rates
- Visitor analytics
- Core Web Vitals

### 3. Payment Monitoring
In Razorpay Dashboard:
- Transaction success rate
- Failed payments (investigate reasons)
- Subscription churn
- Revenue metrics

### 4. Error Tracking
Consider integrating Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🔄 Maintenance Tasks

### Daily
- [ ] Check error logs (Vercel)
- [ ] Monitor payment failures (Razorpay)
- [ ] Review security alerts (Supabase)

### Weekly
- [ ] Refresh materialized views:
```sql
SELECT refresh_audit_statistics();
```
- [ ] Cleanup stale audits:
```sql
SELECT cleanup_stale_audits();
```

### Monthly
- [ ] Archive old audits (runs automatically, but monitor):
```sql
SELECT archive_old_audits(365);
```
- [ ] Review database performance
- [ ] Check subscription metrics
- [ ] Update dependencies

### Quarterly
- [ ] Security audit
- [ ] Rotate API keys
- [ ] Review and update pricing
- [ ] Database backup verification

---

## 🚨 Troubleshooting

### Build Fails on Vercel
```bash
# Clear cache and rebuild
vercel --force

# Check build logs for specific errors
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Module not found
```

### Database Connection Issues
```bash
# Verify Supabase URL and keys
# Check connection pooling limits
# Review RLS policies blocking queries
```

### Payment Integration Issues
```bash
# Verify Razorpay keys are production keys
# Check webhook URL is accessible
# Verify signature validation logic
# Test with Razorpay test mode first
```

### Performance Issues
```sql
-- Check if indexes are being used
SELECT * FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Analyze slow queries
EXPLAIN ANALYZE
SELECT * FROM audits
WHERE user_id = 'xxx' AND status = 'completed';
```

---

## 📱 Progressive Web App (Optional)

### Enable PWA Features
1. Create `public/manifest.json`
2. Add service worker
3. Configure icons
4. Test with Lighthouse

---

## 🎯 Launch Checklist

### Pre-Launch
- [ ] All features tested in production
- [ ] Payment flow tested (small real payment)
- [ ] PDF exports working
- [ ] Email notifications configured
- [ ] Legal pages complete (Privacy, Terms, Refund)
- [ ] Analytics tracking setup
- [ ] Custom domain SSL working

### Launch Day
- [ ] Monitor error logs continuously
- [ ] Watch payment transactions
- [ ] Track user signups
- [ ] Respond to support requests quickly
- [ ] Post on social media
- [ ] Notify email list

### Post-Launch (First Week)
- [ ] Daily monitoring of all metrics
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately
- [ ] Optimize based on real usage patterns
- [ ] Send follow-up emails to users

---

## 📞 Support

### Supabase Support
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Status: https://status.supabase.com

### Vercel Support
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### Razorpay Support
- Docs: https://razorpay.com/docs
- Support: support@razorpay.com
- Status: https://status.razorpay.com

---

## 🎉 You're Ready!

Your RevenueRescue SaaS is now deployed and ready to generate revenue.

**Next Steps**:
1. Drive traffic to your landing page
2. Convert free users to paid plans
3. Gather feedback and iterate
4. Scale your infrastructure as you grow

**Remember**: Monitor, optimize, and keep improving based on real user data.

---

**Deployment Time**: ~2-3 hours
**Difficulty**: Medium
**Status**: Production-ready ✅
