# Audit Functionality Troubleshooting Guide

**Date**: December 18, 2025
**Status**: Enhanced with Logging

---

## 🔍 Recent Changes

Added comprehensive logging to track audit flow from start to finish:

1. **Homepage Hero Component** - Logs audit requests
2. **Dashboard New Audit Page** - Logs audit requests with user info
3. **API Route** - Logs every step of audit processing
4. **Cache System** - Already has logging

---

## 🧪 How to Test

### Test 1: Homepage Audit (Anonymous)

1. **Start Server**:
   ```bash
   npm run dev
   ```

2. **Open Browser**:
   - Go to: http://localhost:3000
   - Open DevTools Console (F12)

3. **Run Audit**:
   - Enter URL: `shop.gymshark.com`
   - Click "Start Free Audit"

4. **Check Console**:
   You should see these log messages:
   ```
   [Hero] Starting audit for: shop.gymshark.com
   [Audit API] Starting audit for: shop.gymshark.com (anonymous)
   [Audit API] Audit completed: audit_xxx Score: XX
   [Audit API] Cached anonymous audit: audit_xxx
   [Hero] Audit response: {success: true, audit: {...}}
   [Hero] Redirecting to: /audit/audit_xxx
   ```

5. **Results Page**:
   - Should redirect automatically
   - Should show audit results
   - Console should show:
   ```
   [Audit API GET] Fetching audit: audit_xxx
   [Audit API GET] Found in cache: audit_xxx
   ```

### Test 2: Dashboard Audit (Authenticated)

1. **Login First**:
   - Go to: http://localhost:3000/login
   - Sign in with your account

2. **Go to New Audit Page**:
   - Navigate to: http://localhost:3000/dashboard/new
   - Or click "New Audit" in sidebar

3. **Run Audit**:
   - Enter URL: `allbirds.com`
   - Click "Start Audit"
   - Watch progress bar

4. **Check Console**:
   ```
   [New Audit] Starting audit for: allbirds.com User: xxx-xxx-xxx
   [Audit API] Starting audit for: allbirds.com (user: xxx-xxx-xxx)
   [Audit API] Audit completed: audit_yyy Score: YY
   [New Audit] Audit response: {success: true, audit: {...}}
   [New Audit] Redirecting to: /audit/audit_yyy
   ```

5. **Results Page**:
   - Should redirect automatically
   - Should show audit results
   - Console should show:
   ```
   [Audit API GET] Fetching audit: audit_yyy
   [Audit API GET] Not in cache, checking database: audit_yyy
   [Audit API GET] Found in database: audit_yyy
   ```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Audit Not Found" Error

**Symptoms**:
- Audit runs successfully
- Redirects to results page
- Shows "Audit Not Found" message

**Causes**:
1. Audit ID not in cache (for anonymous users)
2. Audit not saved to database (for authenticated users)
3. Redirect happens before audit is fully saved

**Debug Steps**:
1. Check console for logs
2. Look for this sequence:
   ```
   [Audit API] Audit completed: audit_xxx
   [Audit API GET] Fetching audit: audit_xxx
   [Audit API GET] Audit not found
   ```

**Solutions**:

**Solution A: Timing Issue (Most Likely)**
The redirect might happen before the audit is saved/cached. Add a delay:

```typescript
// In Hero.tsx or New Audit page
setTimeout(() => {
  router.push(`/audit/${data.audit.id}`);
}, 1000); // Increased from 500ms to 1000ms
```

**Solution B: Cache Not Persisting**
Check if cache is being cleared:
- In-memory cache clears on server restart
- Cache expires after 1 hour
- Make sure server is running continuously

**Solution C: Database Not Saving**
Check Supabase logs:
1. Go to Supabase Dashboard
2. Check Table Editor → `audits` table
3. Verify audit record exists
4. Check RLS policies are not blocking

### Issue 2: Generic Results (Same for All URLs)

**Symptoms**:
- Different URLs show similar scores
- Results don't reflect actual store differences

**This Should NOT Happen Because**:
- Performance analyzer fetches actual URL
- Conversion analyzer parses actual HTML
- Each URL gets unique analysis

**Debug Steps**:
1. Check console logs for URL being audited
2. Verify different URLs in logs:
   ```
   [Audit API] Starting audit for: shop.gymshark.com
   [Audit API] Starting audit for: allbirds.com
   ```

**If Scores Are Similar**:
- This might be normal if stores have similar performance
- Check specific metrics (LCP, FID, CLS) - they should differ
- Look at actual issues detected - should be store-specific

**To Verify URLs Are Being Analyzed**:
Add more logging in performance.ts:
```typescript
async analyze(url: string): Promise<PerformanceScore> {
  console.log('[Performance Analyzer] Analyzing:', url);
  const testUrl = url.startsWith('http') ? url : `https://${url}`;
  console.log('[Performance Analyzer] Fetching:', testUrl);
  // ... rest of code
}
```

### Issue 3: PageSpeed API Not Working

**Symptoms**:
- Audits complete but scores seem estimated
- No real Lighthouse data

**Check**:
1. Verify API key in `.env.local`:
   ```bash
   GOOGLE_PAGESPEED_API_KEY=AQ.Ab8RN6JmE0i3ELuAMmbPTgxgivzm06gTQRxzO0FhZA1iGmdRyw
   ```

2. Check server logs for API errors:
   ```
   PageSpeed API error: 400/401/403
   ```

3. **API Returns 400**: URL might be invalid or inaccessible
4. **API Returns 401/403**: API key invalid or quota exceeded

**Solution**:
- If API fails, system automatically falls back to simulated metrics
- This is expected behavior
- Audits still complete successfully

### Issue 4: User Quota Issues

**Symptoms**:
- "Audit limit reached" error
- Can't run new audits

**Solution**:
1. Check user profile in Supabase:
   ```sql
   SELECT audits_used, audits_limit FROM profiles WHERE id = 'user-id';
   ```

2. Reset counter (for testing):
   ```sql
   UPDATE profiles SET audits_used = 0 WHERE id = 'user-id';
   ```

3. Increase limit (for testing):
   ```sql
   UPDATE profiles SET audits_limit = 100 WHERE id = 'user-id';
   ```

---

## 📊 Expected Log Flow

### Complete Anonymous Audit Flow:
```
[Hero] Starting audit for: example.com
[Audit API] Starting audit for: example.com (anonymous)
[Performance Analyzer] Analyzing: example.com
[Performance Analyzer] Fetching: https://example.com
[Conversion Analyzer] Analyzing: example.com
[Audit API] Audit completed: audit_123 Score: 75
[Audit API] Cached anonymous audit: audit_123
[Hero] Audit response: {success: true, audit: {...}}
[Hero] Redirecting to: /audit/audit_123
[Audit API GET] Fetching audit: audit_123
[Audit API GET] Found in cache: audit_123
```

### Complete Authenticated Audit Flow:
```
[New Audit] Starting audit for: example.com User: user-456
[Audit API] Starting audit for: example.com (user: user-456)
[Performance Analyzer] Analyzing: example.com
[Conversion Analyzer] Analyzing: example.com
[Audit API] Audit completed: audit_789 Score: 82
[Audit API] Saved to database
[New Audit] Audit response: {success: true, audit: {...}}
[New Audit] Redirecting to: /audit/audit_789
[Audit API GET] Fetching audit: audit_789
[Audit API GET] Not in cache, checking database: audit_789
[Audit API GET] Found in database: audit_789
```

---

## 🔧 Quick Fixes

### Fix 1: Increase Redirect Delay

If audits aren't found, the redirect might be too fast:

**File**: `components/landing/Hero.tsx` (line 42)
**Change**: Add delay before redirect
```typescript
// Wait 1 second to ensure audit is cached
setTimeout(() => {
  router.push(`/audit/${data.audit.id}`);
}, 1000);
```

**File**: `app/(dashboard)/dashboard/new/page.tsx` (line 89-91)
**Change**: Already has 500ms delay, increase if needed

### Fix 2: Verify Database Save

**File**: `app/api/audit/route.ts` (line 61-72)
**Add**: Better error logging
```typescript
try {
  const supabase = await createClient();

  console.log('[Audit API] Saving to database:', result.id);

  await supabase.from('audits').insert({...});

  console.log('[Audit API] Successfully saved to database');
  await supabase.rpc('increment_audits_used', { user_id: userId });
} catch (dbError) {
  console.error('[Audit API] Database save failed:', dbError);
  // Continue anyway
}
```

### Fix 3: Check RLS Policies

If authenticated audits aren't saving, check Supabase RLS:

```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'audits';

-- Ensure insert policy exists
CREATE POLICY "Users can insert their own audits"
  ON audits FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🧩 Verification Checklist

After running tests, verify:

- [ ] Console shows all log messages
- [ ] Audit ID is generated
- [ ] Audit is cached (anonymous) or saved (authenticated)
- [ ] Redirect happens to correct URL
- [ ] Results page finds audit
- [ ] Different URLs produce different results
- [ ] Scores are reasonable (20-100 range)
- [ ] Issues and recommendations are shown

---

## 📞 Still Having Issues?

1. **Check Browser Console**:
   - Look for red error messages
   - Check network tab for failed requests

2. **Check Server Logs**:
   - Terminal where `npm run dev` is running
   - Look for error stack traces

3. **Check Supabase**:
   - Table Editor → `audits` table
   - Check if records are being created
   - Check timestamps

4. **Test URLs**:
   - Try known working stores:
     - `shop.gymshark.com`
     - `allbirds.com`
     - `shopify.com`
   - These should definitely work

---

## 🎯 Success Criteria

Audit system is working correctly when:

1. ✅ Console shows complete log flow
2. ✅ No "Audit not found" errors
3. ✅ Different URLs show different scores
4. ✅ Results page loads within 2 seconds
5. ✅ Authenticated users see audits in history
6. ✅ Anonymous users can view recent audit
7. ✅ Quota tracking works for authenticated users

---

**Next Steps**: Follow the test procedures above and share the console logs if issues persist.
