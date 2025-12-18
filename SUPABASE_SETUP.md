# Supabase Setup Instructions

## ✅ Step 1: Environment Variables - COMPLETE

Your Supabase credentials have been securely added to `.env.local`.

## 🔄 Step 2: Run Database Migrations

You need to create the database tables in your Supabase project. Here's how:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/zqmlwtxapmgwlexjqmoh

2. Click on **SQL Editor** in the left sidebar

3. Click **"New Query"** button

4. Open the file: `supabase/migrations/001_initial_schema.sql`

5. Copy the ENTIRE contents (all ~300 lines)

6. Paste into the SQL Editor

7. Click **"Run"** button (or press Ctrl+Enter)

8. You should see: "Success. No rows returned"

9. Verify tables were created:
   - Click **"Table Editor"** in left sidebar
   - You should see 6 tables:
     - profiles
     - shopify_stores
     - audits
     - subscriptions
     - payments
     - audit_exports

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref zqmlwtxapmgwlexjqmoh

# Push migrations
supabase db push
```

## 🔐 Step 3: Configure Authentication

1. Go to **Authentication** → **URL Configuration**

2. Add these URLs:
   - **Site URL**: `http://localhost:3002`
   - **Redirect URLs**:
     - `http://localhost:3002/**`
     - `http://localhost:3002/callback`

3. For production later, add:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/**`

## ✅ Step 4: Test Authentication

Once migrations are run, test the authentication:

1. Navigate to: http://localhost:3002/signup

2. Create a test account:
   - Full Name: Test User
   - Email: test@example.com
   - Password: testpassword123

3. After signup, check:
   - Supabase Dashboard → **Authentication** → **Users**
   - Your test user should appear

4. Check the database:
   - Supabase Dashboard → **Table Editor** → **profiles**
   - Your profile should be auto-created

## 🔒 Security Notes

- ✅ `.env.local` is in `.gitignore` - keys won't be committed to git
- ✅ ANON key is safe to use in client-side code
- ⚠️ NEVER expose SERVICE_ROLE_KEY in client code (only use in server-side API routes)
- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only access their own data

## 🚀 What's Next

After running migrations, you can:
- ✅ Sign up new users
- ✅ Login existing users
- ✅ Access will be protected by authentication
- 🔄 Ready to build the Audit Engine (Phase 4)

---

**Current Status**: Waiting for database migration to be run.

**Action Required**: Run the SQL migration using Option A above.
