# 🚀 AuraFlow POS - Production Backend Setup

**Status:** You have a Supabase account ✅  
**Next Step:** Complete the setup below  
**Estimated Time:** 45 minutes  

---

## ✅ Step 1: Install Dependencies (5 minutes)

Run this command in your terminal:

```bash
npm install @supabase/supabase-js dexie
```

**What this installs:**
- `@supabase/supabase-js` - Supabase client for database, auth, realtime
- `dexie` - IndexedDB wrapper for offline queue

**Verify installation:**
```bash
npm list @supabase/supabase-js dexie
```

You should see both packages listed.

---

## ✅ Step 2: Set Up Supabase Database (15 minutes)

### 2.1 Access Your Supabase Project

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Click on your project (or create a new one)

### 2.2 Run Database Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `/supabase/schema.sql` in your code editor
4. Copy the **ENTIRE** file content (all 401 lines)
5. Paste into Supabase SQL Editor
6. Click **Run** (bottom right)
7. Wait for completion (~30 seconds)

**Expected result:**
```
Success. No rows returned
```

**What this creates:**
- ✅ Products table
- ✅ Customers table
- ✅ Orders table
- ✅ Order items table
- ✅ Transactions table
- ✅ Refunds table
- ✅ Shifts table
- ✅ Inventory adjustments table
- ✅ Settings table
- ✅ Automated triggers
- ✅ Row Level Security policies
- ✅ Performance indexes

### 2.3 Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. You'll see two important values:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...
```

3. **Keep this tab open** - you'll need these in the next step

---

## ✅ Step 3: Configure Environment Variables (5 minutes)

### 3.1 Create .env.local File

In your project root, create a new file called `.env.local`:

```bash
# Create the file (run in terminal)
touch .env.local
```

### 3.2 Add Your Credentials

Open `.env.local` and paste this template:

```bash
# ============================================================================
# SUPABASE CONFIGURATION
# ============================================================================
# Replace with YOUR values from Step 2.3

VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================================================
# FEATURE FLAGS
# ============================================================================

# Enable real-time sync across devices
VITE_ENABLE_REALTIME_SYNC=true

# Enable offline mode with automatic sync
VITE_ENABLE_OFFLINE_MODE=true

# Enable background sync
VITE_ENABLE_BACKGROUND_SYNC=true

# Use mock data as fallback (set to false for production)
VITE_USE_MOCK_DATA=false

# ============================================================================
# OPTIONAL FEATURES
# ============================================================================

# Stripe (leave empty for now - we'll add this later)
VITE_STRIPE_PUBLISHABLE_KEY=

# Backend server for network printing
VITE_BACKEND_URL=http://localhost:3001

# Environment
VITE_APP_ENV=development

# Debug mode
VITE_DEBUG=true
```

### 3.3 Replace Placeholder Values

**IMPORTANT:** Replace these two values with YOUR credentials from Step 2.3:

1. `VITE_SUPABASE_URL` → Paste your Project URL
2. `VITE_SUPABASE_ANON_KEY` → Paste your anon public key

### 3.4 Save the File

Make sure `.env.local` is saved in your project root (same level as `package.json`).

---

## ✅ Step 4: Verify Connection (5 minutes)

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Open Your App

Open your browser to `http://localhost:5173` (or whatever port Vite uses)

### 4.3 Check Browser Console

Open DevTools (F12 or Right Click → Inspect) → Console tab

**Look for:**
```
✅ Supabase configured
✅ Real-time sync enabled
```

**If you see errors:**
- Double-check your `.env.local` values
- Make sure there are no extra spaces or quotes
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

---

## ✅ Step 5: Create First Admin User (10 minutes)

### 5.1 Enable Email Authentication

1. In Supabase dashboard → **Authentication** → **Providers**
2. Make sure **Email** is enabled (should be by default)
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL:** `http://localhost:5173`
5. Click **Save**

### 5.2 Create Admin User

**Option A: Via Supabase Dashboard (Easier)**

1. Go to **Authentication** → **Users**
2. Click **Add user** (top right)
3. Select **Create new user**
4. Fill in:
   - **Email:** `admin@auraflow.local` (or your email)
   - **Password:** Create a strong password (save it!)
   - **Auto Confirm User:** ✅ Check this box
5. Click **Create user**

**Option B: Via SQL Editor**

1. Go to **SQL Editor** → **New Query**
2. Paste this (replace password):

```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@auraflow.local',
  crypt('YourStrongPassword123!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  NOW(),
  NOW(),
  '',
  ''
);
```

3. Click **Run**

### 5.3 Test Login

1. In your app, log out if logged in
2. Try logging in with:
   - **Email:** `admin@auraflow.local`
   - **Password:** (the password you set)

**Success:** You should be logged in! 🎉

---

## ✅ Step 6: Add Sample Data (Optional - 5 minutes)

You have two options for adding sample data:

### Option A: Python Seeding Script (Recommended - All Mock Data)

**This option seeds ALL your mock data** (55 products, 5 customers, sample orders)

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Create `.env` file with your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. Run the seeding script:
   ```bash
   python seed_database.py
   ```

4. Follow the prompts (type 'yes' to confirm)

**See `SEEDING_GUIDE.md` for complete instructions.**

---

### Option B: Quick SQL Insert (Manual - Few Products)

**This option adds just a few products for quick testing**

### 6.1 Run Sample Data Script

1. Go to Supabase **SQL Editor** → **New Query**
2. Paste this:

```sql
-- Insert sample products
INSERT INTO products (name, price, category, stock_quantity, barcode, description, enabled) VALUES
  ('Latte', 4.50, 'Coffee', 100, '001', 'Classic espresso with steamed milk', true),
  ('Cappuccino', 4.00, 'Coffee', 100, '002', 'Espresso with foamed milk', true),
  ('Americano', 3.50, 'Coffee', 100, '003', 'Espresso with hot water', true),
  ('Espresso', 2.50, 'Coffee', 100, '004', 'Classic espresso shot', true),
  ('Mocha', 5.00, 'Coffee', 100, '005', 'Chocolate espresso drink', true),
  
  ('Croissant', 3.50, 'Pastry', 50, '101', 'Buttery French pastry', true),
  ('Bagel', 2.50, 'Pastry', 75, '102', 'Fresh baked bagel', true),
  ('Muffin', 3.00, 'Pastry', 60, '103', 'Assorted flavors', true),
  ('Danish', 3.75, 'Pastry', 40, '104', 'Sweet pastry', true),
  
  ('Orange Juice', 3.00, 'Beverages', 50, '201', 'Fresh squeezed', true),
  ('Bottled Water', 2.00, 'Beverages', 100, '202', 'Spring water', true),
  ('Iced Tea', 2.50, 'Beverages', 75, '203', 'Fresh brewed', true);

-- Insert sample customers
INSERT INTO customers (name, email, phone, loyalty_points) VALUES
  ('John Doe', 'john@example.com', '555-0100', 150),
  ('Jane Smith', 'jane@example.com', '555-0101', 200),
  ('Bob Wilson', 'bob@example.com', '555-0102', 50),
  ('Alice Brown', 'alice@example.com', '555-0103', 300);
```

3. Click **Run**
4. You should see: "Success. No rows returned"

### 6.2 Verify in Your App

1. Go to your app
2. If you're in Admin dashboard → **Products Module**
3. You should see the sample products! ✨

**If you don't see them:**
- Refresh the page
- Check browser console for errors
- Make sure you're logged in

---

## ✅ Step 7: Test Real Database Connection (5 minutes)

### 7.1 Test Product Creation

1. In your app, go to **Admin** → **Products**
2. Click **Add Product**
3. Fill in:
   - **Name:** Test Product
   - **Price:** 9.99
   - **Category:** Test
   - **Stock:** 10
4. Click **Save**

### 7.2 Verify in Supabase

1. Go to Supabase dashboard
2. Click **Table Editor** (left sidebar)
3. Select **products** table
4. You should see "Test Product" in the list! 🎉

### 7.3 Test Real-time Sync (The Cool Part!)

1. Open your app in **TWO browser tabs** side by side
2. In Tab 1: Go to Admin → Products
3. In Tab 2: Go to Admin → Products
4. In Tab 1: Create a new product
5. **Watch Tab 2** → The product should appear automatically! ✨

**This is real-time sync in action!**

---

## ✅ Step 8: Test Offline Mode (5 minutes)

### 8.1 Enable Offline Mode in DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Check the **Offline** checkbox (at the top)

### 8.2 Try Creating an Order

1. In the app, add some products to cart
2. Try to complete the order
3. You should see: "Operation queued for sync"

### 8.3 Go Back Online

1. Uncheck the **Offline** checkbox
2. Within a few seconds, check the Console tab
3. You should see: "Synced: ..." messages

### 8.4 Verify in Supabase

1. Go to Supabase → **Table Editor** → **orders**
2. Your order should be there! 🎉

**This is offline queue working!**

---

## 🎉 Setup Complete!

You now have:
- ✅ Real PostgreSQL database
- ✅ Products stored in Supabase
- ✅ Real-time sync working
- ✅ Offline mode with auto-sync
- ✅ Sample data to test with

---

## 🚀 Next Steps

Now that your backend is set up, you can:

### Option 1: Continue Testing
Test all the features you've implemented:
- Create products → See them in Supabase
- Create orders → Verify data persistence
- Test on mobile → Check responsive design
- Test offline → Verify queue sync

### Option 2: Start Production Migration
Follow `/PHASE_3_PRODUCTION_PLAN.md` to:
- Migrate all modules to real database
- Implement advanced features
- Add payment processing
- Deploy to production

### Option 3: Deploy Beta
Deploy your current version:
- Run production build: `npm run build`
- Deploy to Vercel/Netlify
- Invite beta testers
- Gather feedback

---

## 🆘 Troubleshooting

### "Supabase not configured" Error

**Check:**
1. `.env.local` file exists in project root
2. Variables have correct values (no extra spaces)
3. Dev server was restarted after creating `.env.local`

**Fix:**
```bash
# Stop dev server (Ctrl+C)
# Restart
npm run dev
```

### "Row Level Security policy violation"

**Check:**
1. You're logged in (check top right of app)
2. Database schema was deployed correctly
3. RLS policies exist in Supabase

**Fix:**
1. Go to Supabase → **Authentication** → **Policies**
2. Check "products" table has policy: "Allow authenticated access to products"
3. If missing, re-run `/supabase/schema.sql`

### Products Don't Appear in App

**Check:**
1. Browser console for errors
2. Network tab shows API calls to Supabase
3. You're looking at the right table in Supabase

**Fix:**
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache
3. Check `/lib/store.ts` is loading from database

### Real-time Sync Not Working

**Check:**
1. `VITE_ENABLE_REALTIME_SYNC=true` in `.env.local`
2. Supabase Realtime is enabled

**Fix:**
1. Go to Supabase → **Database** → **Replication**
2. Make sure "products" table is enabled
3. Restart app

---

## 📚 Helpful Resources

- **Supabase Docs:** https://supabase.com/docs
- **Phase 3 Plan:** `/PHASE_3_PRODUCTION_PLAN.md`
- **Setup Guide:** `/PRODUCTION_SETUP_GUIDE.md`
- **Implementation Summary:** `/PRODUCTION_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Verification Checklist

Before moving on, verify:

- [ ] `npm install` completed successfully
- [ ] Supabase schema deployed (all tables created)
- [ ] `.env.local` file created with credentials
- [ ] Dev server running without errors
- [ ] Can log in with admin user
- [ ] Sample products appear in app
- [ ] Can create product → appears in Supabase
- [ ] Real-time sync works (two tabs test)
- [ ] Offline mode queues operations
- [ ] Browser console shows no errors

---

**All checked?** You're ready for production! 🚀

**Questions?** Check the troubleshooting section or review `/PRODUCTION_SETUP_GUIDE.md`
