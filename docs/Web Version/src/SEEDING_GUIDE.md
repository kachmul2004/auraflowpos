# 🌱 Database Seeding Guide

This guide will help you populate your Supabase database with sample data from your mock data.

---

## 📋 Prerequisites

1. **Supabase Account** - You should have created a Supabase project
2. **Python 3.7+** installed on your machine
3. **Database Schema Deployed** - Run the SQL from `supabase/schema.sql` first

---

## 🚀 Quick Start

### Step 1: Install Python Dependencies

```bash
pip install supabase python-dotenv
```

Or if you prefer using a virtual environment (recommended):

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install supabase python-dotenv
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon)
3. Go to **API** section
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important**: Use the `service_role` key, NOT the `anon` key. The service role key bypasses Row Level Security (RLS) which is needed for seeding.

### Step 3: Create Admin User (Optional but Recommended)

To create sample orders, you need a user ID:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add User**
3. Create a user with:
   - Email: `admin@auraflow.local`
   - Password: (your choice)
   - Auto Confirm: ✅ Yes
4. Copy the UUID after creation (you'll need this)

### Step 4: Run the Seeding Script

```bash
python seed_database.py
```

The script will:
1. ⚠️ Ask for confirmation (it will delete existing data!)
2. 🗑️ Clear all existing data from tables
3. 📦 Insert 55 products (including bar items)
4. 👥 Insert 5 sample customers
5. 🧾 Create 3 sample orders (if you provide admin user ID)
6. 📊 Show summary of seeded data

---

## 📊 What Gets Seeded

### Products (55 total)
- **Grocery Items**: Fruits, vegetables, dairy, meat, bakery (24 items)
- **Beverages**: Coffee, juice, energy drinks (5 items)
- **Pharmacy**: Medications, personal care (2 items)
- **Bar & Nightclub**: 
  - Beer (5 types)
  - Wine (4 types)
  - Spirits (5 types)
  - Cocktails (6 types)
  - Shots (4 types)
  - Non-Alcoholic (5 types)
  - Bar Food (5 types)

### Customers (5)
- Sarah Johnson - Prefers dairy-free ($1,250 lifetime value)
- Michael Chen - Restaurant owner, large orders ($3,420 LTV)
- Emily Rodriguez - Regular customer ($875 LTV)
- David Thompson - VIP customer ($5,680 LTV)
- Jennifer Martinez - Frequent visitor ($2,060 LTV)

### Sample Orders (3)
- Dine-in order with items
- Takeout order
- Table order (Table 5)

---

## 🔧 Troubleshooting

### "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"

**Solution**: Make sure your `.env` file exists and has the correct values:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-key-here
```

### "Error seeding products: ..."

**Possible causes:**
1. Schema not deployed - Run `supabase/schema.sql` first
2. Wrong API key - Use `service_role` key, not `anon` key
3. Network issue - Check your internet connection

### "Error creating sample orders: relation does not exist"

**Solution**: Your database schema isn't deployed yet.

1. Go to Supabase Dashboard → SQL Editor
2. Open a new query
3. Paste the entire contents of `supabase/schema.sql`
4. Click **Run**
5. Wait for success message
6. Run the seeding script again

### Products are inserted but orders fail

**Solution**: Make sure you created an admin user and provided the correct UUID when prompted.

---

## 🎯 Manual Verification

After seeding, verify in Supabase:

1. Go to **Table Editor**
2. Check each table:
   - `products` - Should have 55 rows
   - `customers` - Should have 5 rows
   - `orders` - Should have 3 rows (if you provided user ID)
   - `order_items` - Should have items linked to orders

---

## 🔄 Re-seeding

To re-seed (clear and insert fresh data):

```bash
python seed_database.py
```

Type `yes` when prompted to confirm deletion.

**Note**: This will DELETE all existing data and replace it with the sample data.

---

## 🛠️ Advanced Usage

### Seeding Only Specific Tables

Edit `seed_database.py` and comment out the functions you don't want to run:

```python
def main():
    clear_all_data()
    
    # Seed products
    products = seed_products()
    
    # Seed customers
    # customers = seed_customers()  # Commented out
    
    # Create sample orders
    # create_sample_orders(...)  # Commented out
```

### Adding More Sample Data

Edit the `PRODUCTS` or `CUSTOMERS` arrays in `seed_database.py`:

```python
PRODUCTS = [
    # ... existing products ...
    {'name': 'New Product', 'price': 9.99, 'category': 'Custom', ...},
]
```

Then re-run the script.

---

## 🔐 Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Service Role Key** is powerful - Keep it secret
3. **Don't use service_role key in frontend** - Only for seeding/admin scripts
4. **For production** - Use Row Level Security (RLS) policies

---

## 📚 Next Steps

After seeding:

1. ✅ Verify data in Supabase dashboard
2. ✅ Update your frontend `.env.local` with Supabase credentials
3. ✅ Test your application with real data
4. ✅ Set up Row Level Security (RLS) policies for production

---

## 🆘 Need Help?

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Import error | Run `pip install supabase python-dotenv` |
| Connection refused | Check SUPABASE_URL is correct |
| Permission denied | Use `service_role` key, not `anon` key |
| Table doesn't exist | Deploy `supabase/schema.sql` first |
| Data not showing | Refresh Supabase dashboard |

**Still stuck?**
1. Check `supabase/schema.sql` was run successfully
2. Verify your `.env` has correct credentials
3. Check Python version: `python --version` (need 3.7+)
4. Try running with verbose error output

---

## 📖 Reference Files

- `seed_database.py` - Main seeding script
- `.env.example` - Environment variables template
- `supabase/schema.sql` - Database schema
- `lib/mockData.ts` - Original TypeScript mock data

---

**Happy Seeding! 🌱**
