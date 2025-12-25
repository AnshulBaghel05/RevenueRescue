# Quick Reference - RevenueRescue

Essential commands and information for daily operations.

---

## 🚀 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run lint
```

**Local URL**: http://localhost:3000

---

## 🗄️ Database Quick Commands

### Apply All Migrations (First Time)
```sql
-- In Supabase SQL Editor, run in order:
-- 1. 001_initial_schema.sql
-- 2. 002_update_profiles_audits.sql
-- 3. 003_shopify_connections.sql
-- 4. 004_add_company_name.sql
-- 5. 005_add_missing_columns.sql
-- 6. 006_security_enhancements.sql
-- 7. 007_analytics_features.sql
-- 8. 008_performance_optimizations.sql
```

### Verify Database Health
```sql
-- Check all tables exist (should return 10)
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS enabled (all should be TRUE)
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check functions exist
SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public';
```

### Monthly Maintenance (1st of Month)
```sql
-- Reset audit limits for all users
SELECT reset_monthly_audits();

-- Refresh analytics statistics
SELECT refresh_audit_statistics();
```

### Cleanup Tasks
```sql
-- Remove stuck audits (>1 hour old)
SELECT cleanup_stale_audits();

-- Archive old audits (keep 1 year)
SELECT archive_old_audits(365);
```

---

## 💳 Razorpay

### Test Mode Keys
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### Production Keys
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Test Card Details
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

### Webhook URL
```
https://yourdomain.com/api/payments/webhook
```

---

## 🔑 Environment Variables

### Required for All Environments
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # KEEP SECRET

# Razorpay
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx # KEEP SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional
```env
RAZORPAY_WEBHOOK_SECRET=xxx
RAZORPAY_STARTER_PLAN_ID=plan_xxx
RAZORPAY_PRO_PLAN_ID=plan_xxx
```

---

## 📊 Pricing Plans

| Plan | Price | Audits/Month | Features |
|------|-------|--------------|----------|
| Free | $0 | 1 | Basic audit only |
| Starter | $29 | 10 | + PDF, Trends, Compare |
| Pro | $79 | 50 | + Analytics, Forecasting |

**Razorpay Amounts** (in paise):
- Starter: ₹2,399 = 239900 paise
- Pro: ₹6,499 = 649900 paise

---

## 🛠 Common Tasks

### Create New User (Manual)
```sql
-- User created automatically on signup via trigger
-- But to manually set tier:
UPDATE profiles
SET subscription_tier = 'pro',
    audits_limit = 50
WHERE id = 'user-uuid-here';
```

### Check User Audit Usage
```sql
SELECT
  email,
  subscription_tier,
  audits_used,
  audits_limit,
  (audits_limit - audits_used) as remaining
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'user@example.com';
```

### Reset Single User's Audits
```sql
UPDATE profiles
SET audits_used = 0
WHERE id = 'user-uuid-here';
```

### View Recent Audits
```sql
SELECT
  a.id,
  a.store_url,
  a.overall_score,
  a.overall_grade,
  a.status,
  a.created_at,
  p.email
FROM audits a
JOIN profiles p ON a.user_id = p.id
JOIN auth.users u ON p.id = u.id
ORDER BY a.created_at DESC
LIMIT 10;
```

### View Payment History
```sql
SELECT
  p.razorpay_payment_id,
  p.amount,
  p.status,
  p.created_at,
  u.email
FROM payments p
JOIN profiles prof ON p.user_id = prof.id
JOIN auth.users u ON prof.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;
```

---

## 🐛 Debugging

### Check Logs (Vercel)
```bash
vercel logs --follow
```

### Check Database Errors
```sql
-- View PostgreSQL error logs
SELECT * FROM pg_stat_activity
WHERE state = 'active';

-- Check for locks
SELECT * FROM pg_locks;
```

### Test RLS Policies
```sql
-- Set user context
SET request.jwt.claims.sub = 'user-uuid-here';

-- Test query (should only see user's data)
SELECT * FROM audits;

-- Reset context
RESET request.jwt.claims.sub;
```

### Verify Webhook Signature (Razorpay)
```javascript
// In your webhook handler
const crypto = require('crypto');

const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (expectedSignature === req.headers['x-razorpay-signature']) {
  // Valid webhook
}
```

---

## 📈 Monitoring

### Key Metrics to Track
- **MRR** (Monthly Recurring Revenue)
- **Churn Rate** (users canceling)
- **Free → Paid Conversion Rate**
- **Audit Completion Rate**
- **PDF Export Rate** (engagement)
- **Average Score** (product quality)

### Database Performance
```sql
-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Table sizes
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Index usage
SELECT
  schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 🚨 Emergency Procedures

### Site Down
1. Check Vercel status dashboard
2. Check Supabase status dashboard
3. Check Razorpay status dashboard
4. Review recent deployments (rollback if needed)

### Database Issues
1. Check connection pooling limits
2. Check for long-running queries
3. Restart connections (worst case)
4. Check RLS policies aren't blocking legitimate access

### Payment Failures
1. Verify Razorpay keys are correct
2. Check webhook endpoint is accessible
3. Review Razorpay dashboard for errors
4. Check signature verification logic

### User Can't Create Audit
1. Check audit limit: `SELECT audits_used, audits_limit FROM profiles WHERE id = 'xxx'`
2. Check RLS policies
3. Check `check_audit_limit` trigger isn't blocking
4. Manually increment limit if needed (with approval)

---

## 📞 Support Contacts

### Services
- **Vercel**: https://vercel.com/support
- **Supabase**: https://supabase.com/support
- **Razorpay**: support@razorpay.com

### Documentation
- **README**: [README.md](README.md) - Project overview
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- **Sales**: [SALES_DECK.md](SALES_DECK.md) - Marketing materials
- **API**: [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) - API docs
- **Database**: [supabase/migrations/README.md](supabase/migrations/README.md) - Migration guide

---

## 🎯 Quick Wins for New Developers

### Setup (10 minutes)
1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. Add Supabase + Razorpay keys
5. `npm run dev`

### First PR (1 hour)
1. Read [README.md](README.md)
2. Run local build: `npm run build`
3. Pick a small issue from GitHub
4. Test locally
5. Create PR

### Deploy (30 minutes)
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Verify all migrations applied
3. Set env vars in Vercel
4. Deploy with `vercel --prod`
5. Test production URL

---

## ✅ Pre-Launch Checklist

### Technical
- [ ] All 8 migrations applied
- [ ] RLS enabled on all tables
- [ ] Environment variables set in Vercel
- [ ] SSL certificate active
- [ ] Razorpay webhooks configured
- [ ] Monthly cron job scheduled
- [ ] Build completes without errors

### Business
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Refund policy published
- [ ] Pricing clearly displayed
- [ ] Contact information visible
- [ ] Social media accounts created

### Testing
- [ ] User signup works
- [ ] Login works
- [ ] Create audit works (free)
- [ ] Payment flow works (Starter/Pro)
- [ ] PDF export works
- [ ] Analytics dashboard works (Pro)
- [ ] Limit enforcement works

---

**Last Updated**: December 25, 2025
**Quick Access**: Keep this file bookmarked!
