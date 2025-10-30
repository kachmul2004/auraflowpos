# 🔄 Schema Migration Guide

## Overview

This guide covers how to handle database schema changes in production for AuraFlow POS.

---

## 📋 Table of Contents

1. [Migration Philosophy](#migration-philosophy)
2. [Supabase Migrations](#supabase-migrations)
3. [Migration Workflow](#migration-workflow)
4. [Common Scenarios](#common-scenarios)
5. [Rollback Strategy](#rollback-strategy)
6. [Best Practices](#best-practices)

---

## Migration Philosophy

### The Problem
- Users have production databases with real data
- Schema needs to evolve (new features, bug fixes)
- Can't just "recreate" the database
- Must preserve existing data
- Must handle version mismatches

### The Solution
- **Migrations**: Incremental, versioned SQL scripts
- **Forward-only**: Each migration builds on previous
- **Atomic**: Each migration is a transaction
- **Reversible**: Rollback capability for emergencies

---

## 🏗️ Supabase Migrations

### Current State

**Initial Schema**: `/supabase/schema.sql`
- Contains complete database schema
- Used for initial setup
- ⚠️ Problem: Applies ALL changes, can't be re-run

### Production State

**Migration System**: `/supabase/migrations/`
- Incremental changes only
- Version controlled
- Can be applied to existing databases
- Tracks what's been applied

---

## 📁 Migration File Structure

### Recommended Structure

```
supabase/
├── schema.sql                    # Initial schema (for reference)
├── migrations/
│   ├── 00000000000000_initial_schema.sql
│   ├── 20251029120000_add_user_pins_table.sql
│   ├── 20251029130000_add_product_images.sql
│   ├── 20251029140000_add_tips_to_orders.sql
│   └── README.md
└── seed.sql                      # Optional: Sample data
```

### Migration Naming Convention

Format: `YYYYMMDDHHMMSS_description.sql`

Examples:
- `20251029120000_add_user_pins_table.sql`
- `20251029130000_add_product_images.sql`
- `20251029140000_alter_orders_add_table_number.sql`

---

## 🔧 Creating Migrations

### Method 1: Supabase CLI (Recommended)

**Setup:**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Link to your project
supabase link --project-ref your-project-ref
```

**Create Migration:**
```bash
# Generate new migration file
supabase migration new add_product_images

# Edit the generated file
# supabase/migrations/YYYYMMDDHHMMSS_add_product_images.sql
```

**Apply Migration:**
```bash
# Apply to local dev
supabase db push

# Apply to production
supabase db push --linked
```

### Method 2: Manual Migration Files

**1. Create Migration File**

Create: `/supabase/migrations/20251029120000_add_product_images.sql`

```sql
-- Migration: Add product images support
-- Created: 2025-10-29
-- Author: AuraFlow Team

BEGIN;

-- Add image_url column to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_image_url 
ON products(image_url) 
WHERE image_url IS NOT NULL;

-- Add comment
COMMENT ON COLUMN products.image_url IS 'URL to product image (local or CDN)';

COMMIT;
```

**2. Apply Manually**

Via Supabase Dashboard:
1. Go to **SQL Editor**
2. Paste migration SQL
3. Click **Run**
4. Verify success

---

## 🔄 Migration Workflow

### For New Projects (Clean Slate)

```bash
# 1. Run initial schema
# Supabase Dashboard → SQL Editor → Run schema.sql

# 2. Run seeding script
python seed_database.py
```

### For Existing Projects (Production)

```bash
# 1. Create migration file
supabase migration new your_change_description

# 2. Write migration SQL
# Edit the generated file

# 3. Test locally first
supabase db reset  # Reset local DB
supabase db push   # Apply all migrations

# 4. Test with your app
npm run dev

# 5. Apply to production
supabase db push --linked

# Or manually via SQL Editor
```

---

## 📚 Common Migration Scenarios

### Scenario 1: Add New Column

**Migration**: `20251029120000_add_product_cost.sql`

```sql
BEGIN;

-- Add cost column for profit tracking
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost DECIMAL(10,2) DEFAULT 0 
CHECK (cost >= 0);

-- Add comment
COMMENT ON COLUMN products.cost IS 'Cost price for profit calculations';

-- Backfill existing products (optional)
UPDATE products 
SET cost = price * 0.60  -- Assume 40% margin
WHERE cost = 0;

COMMIT;
```

### Scenario 2: Add New Table

**Migration**: `20251029130000_add_user_pins_table.sql`

```sql
BEGIN;

-- Create user_pins table for secure PIN storage
CREATE TABLE IF NOT EXISTS user_pins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_user_pins_user_id ON user_pins(user_id);

-- Enable RLS
ALTER TABLE user_pins ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own PIN
CREATE POLICY "Users can view own PIN"
ON user_pins FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Admins can manage all PINs
CREATE POLICY "Admins can manage PINs"
ON user_pins FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true
);

COMMIT;
```

### Scenario 3: Modify Existing Column

**Migration**: `20251029140000_increase_product_name_length.sql`

```sql
BEGIN;

-- Increase product name length from default to 500 chars
ALTER TABLE products 
ALTER COLUMN name TYPE VARCHAR(500);

-- Add validation
ALTER TABLE products
ADD CONSTRAINT name_not_empty 
CHECK (LENGTH(TRIM(name)) > 0);

COMMIT;
```

### Scenario 4: Add Index for Performance

**Migration**: `20251029150000_add_orders_performance_indexes.sql`

```sql
BEGIN;

-- Add composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at_status
ON orders(created_at DESC, status)
WHERE status != 'cancelled';

-- Add index for customer order history
CREATE INDEX IF NOT EXISTS idx_orders_customer_created
ON orders(customer_id, created_at DESC)
WHERE customer_id IS NOT NULL;

-- Add index for terminal reports
CREATE INDEX IF NOT EXISTS idx_orders_terminal_created
ON orders(terminal_id, created_at DESC)
WHERE terminal_id IS NOT NULL;

COMMIT;
```

### Scenario 5: Data Transformation

**Migration**: `20251029160000_normalize_phone_numbers.sql`

```sql
BEGIN;

-- Create function to normalize phone numbers
CREATE OR REPLACE FUNCTION normalize_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Remove all non-numeric characters
  RETURN regexp_replace(phone, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing customers
UPDATE customers
SET phone = normalize_phone(phone)
WHERE phone IS NOT NULL AND phone != normalize_phone(phone);

-- Add constraint to ensure normalized format
ALTER TABLE customers
ADD CONSTRAINT phone_normalized
CHECK (phone IS NULL OR phone = normalize_phone(phone));

COMMIT;
```

### Scenario 6: Add New Feature (Bar Tabs)

**Migration**: `20251029170000_add_bar_tabs_support.sql`

```sql
BEGIN;

-- Create bar_tabs table
CREATE TABLE IF NOT EXISTS bar_tabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tab_name TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  card_last_four VARCHAR(4),
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  server_id UUID,  -- References auth.users
  section TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_bar_tabs_status ON bar_tabs(status);
CREATE INDEX idx_bar_tabs_opened ON bar_tabs(opened_at DESC);
CREATE INDEX idx_bar_tabs_customer ON bar_tabs(customer_id);

-- Enable RLS
ALTER TABLE bar_tabs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view tabs"
ON bar_tabs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Staff can manage tabs"
ON bar_tabs FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' -> 'roles' ? 'cashier')
  OR (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true
);

-- Add trigger for updated_at
CREATE TRIGGER update_bar_tabs_updated_at
BEFORE UPDATE ON bar_tabs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

---

## ⏮️ Rollback Strategy

### Method 1: Rollback Migration (Ideal)

Create corresponding "down" migration:

**Original**: `20251029120000_add_product_cost.sql`
```sql
ALTER TABLE products ADD COLUMN cost DECIMAL(10,2);
```

**Rollback**: `20251029120001_rollback_add_product_cost.sql`
```sql
ALTER TABLE products DROP COLUMN IF EXISTS cost;
```

### Method 2: Database Backup/Restore

**Before Major Migration:**
```sql
-- Create backup
pg_dump -h your-db-host -U postgres -d postgres > backup_before_migration.sql

-- Or via Supabase Dashboard:
-- Settings → Database → Backups → Create Backup
```

**If Migration Fails:**
```sql
-- Restore from backup
psql -h your-db-host -U postgres -d postgres < backup_before_migration.sql
```

### Method 3: Point-in-Time Recovery

Supabase Pro plan includes Point-in-Time Recovery (PITR):
1. Settings → Database → Backups
2. Select time before migration
3. Restore to new instance or same

---

## ✅ Best Practices

### 1. Always Use Transactions

```sql
BEGIN;

-- Your changes here

COMMIT;
```

If anything fails, entire migration rolls back.

### 2. Use IF NOT EXISTS / IF EXISTS

```sql
-- Safe: Won't error if already exists
CREATE TABLE IF NOT EXISTS my_table (...);

-- Safe: Won't error if doesn't exist
DROP TABLE IF EXISTS my_table;

-- Safe: Won't error if column exists
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS new_column TEXT;
```

### 3. Provide Default Values

```sql
-- Good: Existing rows get default value
ALTER TABLE products 
ADD COLUMN image_url TEXT DEFAULT NULL;

-- Bad: Existing rows might fail constraints
ALTER TABLE products 
ADD COLUMN image_url TEXT NOT NULL;
```

### 4. Test Locally First

```bash
# 1. Test on local Supabase
supabase db reset
supabase db push

# 2. Test with actual data
python seed_database.py

# 3. Run your app
npm run dev

# 4. Only then apply to production
```

### 5. Make Migrations Idempotent

Migrations should be safe to run multiple times:

```sql
-- Idempotent: Can run multiple times safely
CREATE TABLE IF NOT EXISTS my_table (...);
ALTER TABLE products ADD COLUMN IF NOT EXISTS new_col TEXT;
CREATE INDEX IF NOT EXISTS idx_name ON products(name);

-- Not idempotent: Will error on second run
CREATE TABLE my_table (...);
ALTER TABLE products ADD COLUMN new_col TEXT;
```

### 6. Document Your Migrations

```sql
-- Migration: Add support for product variants
-- Created: 2025-10-29
-- Author: Dev Team
-- Jira: POS-123
-- Description: Enables products to have multiple variants (size, color, etc.)

BEGIN;

-- Your changes...

COMMIT;
```

### 7. Handle Data Carefully

```sql
-- Good: Preserve existing data
ALTER TABLE products ADD COLUMN category_id UUID;
UPDATE products SET category_id = 'default-category-id' WHERE category_id IS NULL;
ALTER TABLE products ALTER COLUMN category_id SET NOT NULL;

-- Bad: Lose data
ALTER TABLE products DROP COLUMN category;
ALTER TABLE products ADD COLUMN category_id UUID NOT NULL;  -- Fails!
```

---

## 🔍 Migration Tracking

### Supabase Migrations Table

Supabase automatically creates a `schema_migrations` table:

```sql
-- Check applied migrations
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

### Manual Tracking (Alternative)

Create your own tracking:

```sql
-- Create migrations table
CREATE TABLE IF NOT EXISTS migrations (
  version TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Record migration
INSERT INTO migrations (version, name)
VALUES ('20251029120000', 'add_product_images');
```

---

## 🚨 Emergency Procedures

### If Migration Fails in Production

**1. Don't Panic**
- Database is in a transaction (should auto-rollback)
- Check error message carefully

**2. Assess Damage**
```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'your_table';
```

**3. Options:**
- Fix forward: Create new migration to fix issue
- Rollback: Restore from backup
- Manual fix: Carefully correct via SQL Editor

**4. Communication**
- Notify users if downtime
- Document what happened
- Update migration with fix

---

## 📊 Migration Checklist

### Before Creating Migration
- [ ] Understand the change needed
- [ ] Consider impact on existing data
- [ ] Plan rollback strategy
- [ ] Write migration SQL
- [ ] Add comments and documentation

### Before Applying to Production
- [ ] Test migration locally
- [ ] Test with seed data
- [ ] Test app functionality
- [ ] Create database backup
- [ ] Schedule maintenance window (if needed)
- [ ] Notify team

### After Applying
- [ ] Verify migration succeeded
- [ ] Test app functionality
- [ ] Monitor for errors
- [ ] Update documentation
- [ ] Commit migration file to git

---

## 🔗 Related Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/managing-migrations)
- [PostgreSQL ALTER TABLE](https://www.postgresql.org/docs/current/sql-altertable.html)
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Initial setup
- [AUTH_MIGRATION_GUIDE.md](AUTH_MIGRATION_GUIDE.md) - Authentication setup

---

## 📝 Example Migration Workflow

### Scenario: Adding Product Images Feature

**1. Create Migration**
```bash
supabase migration new add_product_images
```

**2. Write Migration**
`supabase/migrations/20251029120000_add_product_images.sql`
```sql
BEGIN;

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
CREATE INDEX IF NOT EXISTS idx_products_image_url ON products(image_url);

COMMIT;
```

**3. Test Locally**
```bash
supabase db reset
supabase db push
python seed_database.py
npm run dev
```

**4. Apply to Production**
```bash
# Via CLI
supabase db push --linked

# Or via Dashboard SQL Editor
```

**5. Update Application**
```typescript
// Update Product type
interface Product {
  // ... existing fields
  image_url?: string | null
}

// Update ProductGrid to show images
<img src={product.image_url || '/placeholder.png'} />
```

**6. Deploy Frontend**
```bash
git add .
git commit -m "feat: add product images support"
git push
```

---

**Last Updated**: October 29, 2025  
**Status**: Production Ready  
**Next Review**: When adding new features
