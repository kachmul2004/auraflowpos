# 🤔 Backend Migration - Frequently Asked Questions

## Quick Answers to Your Questions

---

## 1️⃣ Will the Python script add sample users?

### ❌ NO - It does NOT create login users

**What it DOES create:**
- ✅ **Products** (55 items - grocery + bar)
- ✅ **Customers** (5 POS customers)
- ✅ **Orders** (3 sample orders)

**What it DOES NOT create:**
- ❌ **Login users** (staff/cashiers/admin)
- ❌ **Authentication accounts**
- ❌ **User credentials**

### Why the Confusion?

There are TWO types of "users" in the system:

| Type | Purpose | Table | Created By |
|------|---------|-------|------------|
| **Staff Users** | Login to POS | `auth.users` | Manual (Supabase Dashboard) |
| **POS Customers** | Buy products | `customers` | Seeding script ✅ |

**Think of it this way:**
- **Staff users** = Your employees who operate the POS
- **Customers** = People who shop at your store

---

## 2️⃣ How will logins be handled?

### Current State (Mock)
```typescript
// In store.ts - CURRENT
login(user: User) {
  // Just sets local state
  // No real authentication
}
```

### Production State (Supabase Auth)

**You need to:**

1. **Create staff users in Supabase:**
   - Go to Supabase Dashboard
   - Authentication → Users → Add User
   - Fill in email, password, metadata

2. **Update frontend to use Supabase Auth:**
   ```typescript
   // In lib/supabase.ts
   import { createClient } from '@supabase/supabase-js'
   
   export const supabase = createClient(url, key)
   
   // Login function
   export async function login(email: string, password: string) {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password
     })
     return { data, error }
   }
   ```

3. **Update LoginScreen.tsx:**
   ```typescript
   import { login } from '@/lib/supabase'
   
   const handleLogin = async () => {
     const { data, error } = await login(email, password)
     if (data.user) {
       // Update store with user data
       useStore.getState().login(data.user)
     }
   }
   ```

### Complete Guide

See **[AUTH_MIGRATION_GUIDE.md](AUTH_MIGRATION_GUIDE.md)** for:
- ✅ Step-by-step authentication setup
- ✅ Creating staff users
- ✅ Code examples for frontend
- ✅ PIN-based login
- ✅ Session management
- ✅ Security best practices

---

## 3️⃣ How will data schema changes be handled?

### The Challenge

When you add new features, you might need to change the database:
- Add new columns (e.g., `product.image_url`)
- Add new tables (e.g., `bar_tabs`)
- Modify existing columns (e.g., increase name length)
- Add indexes for performance

**Problem:** You have production data you can't lose! 🚨

### The Solution: Migrations

**Migrations** = Incremental SQL scripts that modify your schema

```
Initial Schema (Day 1):
products (id, name, price, category)

Migration 1 (Day 30):
+ Add column: image_url

Migration 2 (Day 45):
+ Add table: bar_tabs

Migration 3 (Day 60):
+ Add index: products(category)
```

### How to Do It

**Method 1: Supabase CLI** (Recommended)

```bash
# Create migration
supabase migration new add_product_images

# Edit the generated file
# supabase/migrations/YYYYMMDDHHMMSS_add_product_images.sql

# Apply migration
supabase db push --linked
```

**Method 2: Manual SQL**

1. Create file: `/supabase/migrations/20251029120000_add_product_images.sql`
2. Write SQL:
   ```sql
   BEGIN;
   ALTER TABLE products ADD COLUMN image_url TEXT;
   COMMIT;
   ```
3. Run via Supabase Dashboard → SQL Editor

### Best Practices

✅ **Always use transactions:**
```sql
BEGIN;
-- your changes
COMMIT;
```

✅ **Use IF NOT EXISTS:**
```sql
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

✅ **Test locally first:**
```bash
supabase db reset  # Reset local DB
supabase db push   # Test migration
```

✅ **Backup before major changes:**
```
Supabase Dashboard → Settings → Database → Backups
```

### Complete Guide

See **[SCHEMA_MIGRATION_GUIDE.md](SCHEMA_MIGRATION_GUIDE.md)** for:
- ✅ Migration file structure
- ✅ Common migration scenarios
- ✅ Rollback strategies
- ✅ Best practices
- ✅ Emergency procedures

---

## 🎯 Complete Migration Path

### Step 1: Initial Setup (One Time)

```bash
# 1. Run schema
# Supabase Dashboard → SQL Editor → Paste schema.sql → Run

# 2. Seed data
pip install -r requirements.txt
python seed_database.py

# 3. Create staff users
# Supabase Dashboard → Authentication → Users → Add User
```

**Result:** Database with products, customers, orders, and one admin user

### Step 2: Update Frontend (One Time)

```bash
# 1. Install Supabase client
npm install @supabase/supabase-js

# 2. Configure environment
# Create .env.local with Supabase credentials

# 3. Update auth code
# See AUTH_MIGRATION_GUIDE.md
```

**Result:** Frontend connects to real database and auth

### Step 3: Ongoing Development

```bash
# When you need to change schema:

# 1. Create migration
supabase migration new my_feature

# 2. Write SQL
# Edit generated file

# 3. Test locally
supabase db push

# 4. Apply to production
supabase db push --linked
```

**Result:** Schema evolves safely without losing data

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [SEEDING_GUIDE.md](SEEDING_GUIDE.md) | How to seed products/customers |
| [AUTH_MIGRATION_GUIDE.md](AUTH_MIGRATION_GUIDE.md) | How to set up authentication |
| [SCHEMA_MIGRATION_GUIDE.md](SCHEMA_MIGRATION_GUIDE.md) | How to handle schema changes |
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Complete setup walkthrough |

---

## 🚀 Quick Reference

### What the Seeding Script Does

```python
python seed_database.py

# Creates:
✅ 55 products (in 'products' table)
✅ 5 customers (in 'customers' table)  
✅ 3 orders (in 'orders' table)

# Does NOT create:
❌ Login users (in 'auth.users' table)
```

### What You Need to Do Manually

1. **Create staff users:**
   ```
   Supabase Dashboard → Authentication → Users → Add User
   ```

2. **Apply future schema changes:**
   ```bash
   supabase migration new my_change
   # Edit SQL file
   supabase db push --linked
   ```

3. **Update frontend auth:**
   ```typescript
   // Replace mock auth with Supabase auth
   // See AUTH_MIGRATION_GUIDE.md
   ```

---

## 💡 Common Scenarios

### "I ran the seeding script but can't login"

**Why:** The script doesn't create login users, only products/customers.

**Fix:** 
1. Go to Supabase Dashboard
2. Authentication → Users → Add User
3. Create admin user with email/password
4. Now you can login

### "I added a new feature, how do I update the database?"

**Solution:** Create a migration
```bash
# 1. Create migration file
supabase migration new add_my_feature

# 2. Write SQL (e.g., add table/column)
# 3. Test locally
supabase db push

# 4. Apply to production
supabase db push --linked
```

### "I made a mistake in a migration, how do I rollback?"

**Solution:** Create a rollback migration
```sql
-- If you added a column:
ALTER TABLE products DROP COLUMN mistake_column;

-- If you added a table:
DROP TABLE IF EXISTS mistake_table;
```

See [SCHEMA_MIGRATION_GUIDE.md](SCHEMA_MIGRATION_GUIDE.md) for details.

### "How do I add more products after initial seeding?"

**Option 1:** Via Admin Dashboard (once frontend is connected)
- Login → Admin → Products → Add Product

**Option 2:** Via SQL
```sql
INSERT INTO products (name, price, category, stock_quantity, sku)
VALUES ('New Product', 9.99, 'Category', 100, 'SKU-001');
```

**Option 3:** Update seeding script and re-run
- Edit `seed_database.py` PRODUCTS array
- Run script again (will delete all data and re-seed)

---

## 🔐 Security Notes

### Don't Commit These:
- ❌ `.env` file (has your keys)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` anywhere in code
- ❌ Real user passwords

### Do Commit These:
- ✅ `.env.example` (template without real keys)
- ✅ Migration files
- ✅ Schema files
- ✅ Seeding scripts

### Production Security:
- ✅ Enable Row Level Security (RLS)
- ✅ Create proper policies
- ✅ Use `anon` key in frontend
- ✅ Use `service_role` key only in backend/scripts
- ✅ Never expose service role key to users

---

## 🆘 Need More Help?

### For Seeding Issues:
- Read: [SEEDING_GUIDE.md](SEEDING_GUIDE.md)
- Quick: [SEED_QUICKSTART.md](SEED_QUICKSTART.md)

### For Auth Issues:
- Read: [AUTH_MIGRATION_GUIDE.md](AUTH_MIGRATION_GUIDE.md)

### For Schema Issues:
- Read: [SCHEMA_MIGRATION_GUIDE.md](SCHEMA_MIGRATION_GUIDE.md)

### For General Setup:
- Read: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

---

**Last Updated**: October 29, 2025  
**Questions?** Check the related documentation above or create an issue.
