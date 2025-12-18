# Database Migration Guide

## ⚠️ You're Getting "Relation Already Exists" Error?

This means the tables were already created from a previous migration run. **This is normal!**

You just need to update the existing tables with new fields.

---

## ✅ Solution: Run Update Migration

### Step-by-Step Instructions:

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/zqmlwtxapmgwlexjqmoh/sql
   - Click "New Query"

2. **Copy the Update Migration**
   - Open file: `supabase/migrations/002_update_profiles_audits.sql`
   - Copy **ALL** contents (Ctrl+A, Ctrl+C)

3. **Run the Migration**
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - Wait for "Success" message

4. **Verify Changes**
   - Go to Table Editor
   - Check `profiles` table has:
     - `audits_used` column (INTEGER, default 0)
     - `audits_limit` column (INTEGER, default 3)
   - Check `audits` table has:
     - `overall_grade` column (TEXT)
     - `estimated_revenue_loss` column (INTEGER)
     - `results` column (JSONB)

---

## What This Migration Does

### ✅ Safe Operations:
- Checks if columns exist before adding them (no errors)
- Adds missing fields required by Phase 4 audit engine
- Creates `increment_audits_used()` SQL function
- Updates existing users with default values

### 📊 New Fields Added:

**profiles table**:
```sql
audits_used INTEGER DEFAULT 0        -- Tracks how many audits user has run
audits_limit INTEGER DEFAULT 3       -- Monthly audit quota (3 for free tier)
```

**audits table**:
```sql
overall_grade TEXT                   -- Letter grade (A+, A, B, C, D, F)
estimated_revenue_loss INTEGER       -- Monthly $ loss estimate
results JSONB                        -- Complete audit results
```

**New SQL Function**:
```sql
increment_audits_used(user_id UUID) -- Increments counter after each audit
```

---

## ❌ DO NOT Run

**Do NOT run** `001_initial_schema.sql` again!
- This creates the initial tables
- Your tables already exist
- Running it will cause the error you saw

---

## 🧪 After Migration

Once migration completes successfully, you can:

1. **Test the audit system**:
   - Go to http://localhost:3000
   - Enter a Shopify store URL
   - Click "Start Free Audit"
   - See the results page!

2. **Verify database saves**:
   - Go to Supabase Table Editor
   - Check `audits` table
   - You should see your audit record

---

## 🆘 Troubleshooting

### Error: "column already exists"
✅ **This is fine!** The migration safely checks before adding columns.
Just ignore this message - it means the field was already added.

### Error: "function already exists"
✅ **This is fine!** We use `CREATE OR REPLACE` which updates the function.

### Error: "permission denied"
❌ Make sure you're logged into Supabase dashboard with correct project selected.

### Migration runs but audit still fails
1. Check browser console for errors
2. Verify all 3 new fields exist in tables
3. Check that function `increment_audits_used` exists in Supabase Database > Functions

---

## 📝 Migration Files

- `001_initial_schema.sql` - ✅ Already ran (creates tables)
- `002_update_profiles_audits.sql` - ⏳ **Run this one now**

---

## ✅ Success Criteria

After running the migration, you should see:

```
profiles table:
✓ audits_used column exists
✓ audits_limit column exists

audits table:
✓ overall_grade column exists
✓ estimated_revenue_loss column exists
✓ results column exists

Functions:
✓ increment_audits_used function exists
```

---

Need help? The migration is designed to be **safe and idempotent** - you can run it multiple times without issues.
