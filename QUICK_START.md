# Quick Start Guide

**Get your RevenueRescue SaaS running in 5 minutes!**

---

## ✅ Prerequisites

- Node.js installed
- Supabase account
- Project already cloned

---

## 🚀 Setup Steps

### 1. Environment Variables (Already Done ✅)

Your `.env.local` is already configured with:
- ✅ Supabase credentials
- ✅ Google PageSpeed API key
- ✅ Shopify OAuth credentials

### 2. Run Database Migration

**IMPORTANT**: You need to run one more migration for Shopify connections.

#### Steps:
1. Go to: https://supabase.com/dashboard/project/zqmlwtxapmgwlexjqmoh/sql
2. Click "New Query"
3. Open file: `supabase/migrations/003_shopify_connections.sql`
4. Copy ALL contents (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor
6. Click "Run" button
7. Wait for "Success" message

#### Verify:
- Go to Table Editor
- Check `shopify_connections` table exists
- Verify columns: id, user_id, shop_domain, access_token, scopes, created_at, updated_at

### 3. Start Development Server

```bash
npm run dev
```

The app will start on http://localhost:3000

---

## 🎯 Test the New Features

### Test New Audit Page

1. Open browser: http://localhost:3000
2. Login or signup
3. Click "New Audit" in sidebar
4. Enter a Shopify store URL (e.g., `shop.gymshark.com`)
5. Click "Start Audit"
6. Watch progress bar
7. View results!

### All Working Features

**Dashboard Pages**:
- ✅ `/dashboard` - Overview with stats
- ✅ `/dashboard/history` - All audits with search/filters
- ✅ `/dashboard/trends` - Score trends over time
- ✅ `/dashboard/compare` - Compare two audits
- ✅ `/dashboard/new` - **NEW** Run audit
- ✅ `/dashboard/settings` - Account settings

**Features**:
- ✅ Run audits with Google PageSpeed API
- ✅ Real Lighthouse scores
- ✅ Search and filter audit history
- ✅ Compare audits side-by-side
- ✅ Track score trends with charts
- ✅ User profile management
- ✅ Quota tracking

---

## 🔑 API Keys Status

### Google PageSpeed API ✅
- **Status**: Integrated
- **Usage**: Automatic in all audits
- **Fallback**: Simulated metrics if API fails

### Shopify OAuth ✅
- **Status**: Configured
- **Usage**: Optional store connection
- **Flow**: Ready for testing

---

## 🧪 Quick Test Scenarios

### Scenario 1: Run Your First Audit
```
1. Go to /dashboard/new
2. Enter: shop.gymshark.com
3. Click "Start Audit"
4. See: Progress bar animates
5. Result: Redirects to audit report
6. Check: Score, issues, recommendations
```

### Scenario 2: View Audit History
```
1. Go to /dashboard/history
2. See: List of past audits
3. Search: Enter store name
4. Filter: Click "Good (80+)"
5. Click: Any audit card
6. Result: Opens full report
```

### Scenario 3: Compare Audits
```
1. Go to /dashboard/compare
2. Select: First audit from dropdown
3. Select: Second audit from dropdown
4. See: Side-by-side comparison
5. Check: Difference indicators
```

### Scenario 4: View Trends
```
1. Go to /dashboard/trends
2. See: Score trend charts
3. Check: Insights panel
4. Filter: Select specific store (if multiple)
```

---

## 📊 What to Expect

### First Run (New User)
- Dashboard shows "No audits yet"
- All pages have empty states
- CTAs prompt to run first audit

### After Running Audits
- Dashboard populates with stats
- History shows all audits
- Trends charts display (needs ≥2 audits)
- Compare works (needs ≥2 audits)

---

## 🔍 Troubleshooting

### Build Issues
```bash
# If build fails, try:
npm run build

# Should see:
✓ Compiled successfully
✓ Generating static pages (19/19)
```

### Migration Issues
**Error: "relation already exists"**
- ✅ This is fine! Table already created
- Just means migration ran before

**Error: "permission denied"**
- ❌ Check you're logged into correct Supabase project
- Verify project ID matches

### API Issues
**PageSpeed API not working**
- Check API key in .env.local
- App will fallback to simulated metrics
- Audit still completes successfully

**Shopify OAuth fails**
- Verify all credentials in .env.local
- Check redirect URI matches exactly
- Ensure migration ran (shopify_connections table exists)

---

## 📝 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Clean install
rm -rf node_modules .next
npm install
npm run dev
```

---

## 🎯 Next Steps

### Immediate
1. Run the migration (Step 2 above)
2. Test new audit page
3. Run a few audits
4. Explore dashboard features

### Soon
- Configure Razorpay for payments (Phase 6)
- Add advanced features (Phase 7)
- Deploy to production

---

## 📚 Documentation

- [PHASE5_COMPLETE.md](PHASE5_COMPLETE.md) - Phase 5 features
- [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) - API setup details
- [NEW_AUDIT_PAGE_COMPLETE.md](NEW_AUDIT_PAGE_COMPLETE.md) - New audit page
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Database migrations

---

## 🆘 Need Help?

Check the comprehensive guides above or review:
- Migration files in `supabase/migrations/`
- Environment setup in `.env.example`
- API integration in `API_INTEGRATION_GUIDE.md`

---

**You're all set! 🚀**

Run the migration, start the server, and begin auditing stores!
