# 👥 Users vs Customers - Visual Guide

## The Confusion

Many people get confused between **Users** and **Customers** in a POS system. Let's clarify!

---

## 🎯 Quick Answer

| | Users (Staff) | Customers (Shoppers) |
|---|---|---|
| **Who?** | Your employees | People who buy from you |
| **What do they do?** | Operate the POS | Make purchases |
| **How do they interact?** | Login with credentials | Selected during checkout |
| **Database table** | `auth.users` | `customers` |
| **Created by** | Manual (Supabase Dashboard) | Admin or seeding script |
| **Examples** | Admin, John Cashier, Jane Staff | Sarah Johnson, Michael Chen |

---

## 📊 Visual Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR BUSINESS                            │
└─────────────────────────────────────────────────────────────────┘

STAFF USERS (auth.users)              CUSTOMERS (customers table)
━━━━━━━━━━━━━━━━━━━━━                ━━━━━━━━━━━━━━━━━━━━━━━━━
                                     
👤 Admin User                         👤 Sarah Johnson
   ├─ Email: admin@store.com            ├─ Name: Sarah Johnson
   ├─ Password: ********                ├─ Email: sarah@email.com
   ├─ PIN: 123456                       ├─ Phone: (555) 234-5678
   ├─ Roles: [admin, cashier]           ├─ Loyalty: 250 points
   └─ Can: Everything                   ├─ Spent: $1,250.75
                                        └─ Visits: 28 times
👤 John Cashier                      
   ├─ Email: john@store.com          👤 Michael Chen
   ├─ Password: ********                ├─ Name: Michael Chen
   ├─ PIN: 567890                       ├─ Email: michael@email.com
   ├─ Roles: [cashier]                  ├─ Phone: (555) 345-6789
   └─ Can: Process sales, voids         ├─ Loyalty: 680 points
                                        ├─ Spent: $3,420.50
👤 Jane Staff                           └─ Visits: 45 times
   ├─ Email: jane@store.com          
   ├─ Password: ********              👤 Emily Rodriguez
   ├─ PIN: 901234                       ├─ Name: Emily Rodriguez
   ├─ Roles: [cashier]                  ├─ Email: emily@email.com
   └─ Can: Limited permissions          └─ Spent: $875.25

┌────────────────────────┐           ┌────────────────────────┐
│  THEY LOG IN           │           │  THEY CHECK OUT        │
│  ├─ LoginScreen        │           │  ├─ Selected during    │
│  ├─ With credentials   │           │  │   sale               │
│  └─ Access POS         │           │  └─ Get receipts       │
└────────────────────────┘           └────────────────────────┘
```

---

## 🔄 The Flow

### Staff User Flow (Login)

```
1. Employee arrives at work
   👇
2. Opens POS application
   👇
3. Enters PIN (or email/password)
   👇
4. System checks auth.users table
   👇
5. ✅ Logged in - Can use POS
   👇
6. Makes sales for customers
   👇
7. Ends shift
   👇
8. Logs out
```

### Customer Flow (Purchase)

```
1. Customer enters store
   👇
2. Selects items to buy
   👇
3. Goes to checkout
   👇
4. Cashier (logged-in user) rings them up
   👇
5. Optional: Link to customer record
   👇
6. Payment processed
   👇
7. Receipt printed
   👇
8. Customer leaves with products
```

---

## 💻 In Code

### Staff Users (auth.users)

**Created via Supabase Dashboard:**
```
Authentication → Users → Add User

Email: john@store.com
Password: SecurePass123!
User Metadata:
{
  "firstName": "John",
  "lastName": "Cashier",
  "pin": "567890",
  "roles": ["cashier"],
  "permissions": ["process_sales", "void_items"]
}
```

**Used in code:**
```typescript
// LoginScreen.tsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'john@store.com',
  password: 'SecurePass123!'
})

// Now John can operate the POS
```

### Customers (customers table)

**Created via seeding script:**
```python
# seed_database.py
CUSTOMERS = [
    {
        'name': 'Sarah Johnson',
        'email': 'sarah@email.com',
        'phone': '(555) 234-5678',
        'loyalty_points': 250,
        'total_spent': 1250.75,
        'visit_count': 28
    }
]
```

**Used in code:**
```typescript
// ShoppingCart.tsx
const { data: customers } = await supabase
  .from('customers')
  .select('*')

// Select customer for order
<CustomerSelectionDialog 
  customers={customers}
  onSelect={(customer) => attachToOrder(customer)}
/>
```

---

## 📋 Database Schema

### Staff Users Table (auth.users) - Managed by Supabase

```sql
-- Supabase managed table
auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT NOT NULL,
  user_metadata JSONB,  -- Your custom data (name, pin, roles)
  created_at TIMESTAMP,
  ...
)
```

**You access via:** Supabase Auth API
**You create via:** Supabase Dashboard or Auth API
**Used for:** Authentication & authorization

### Customers Table (customers) - Your table

```sql
-- Your table from schema.sql
customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP
)
```

**You access via:** Regular SQL queries
**You create via:** Seeding script or Admin panel
**Used for:** Customer management, loyalty, analytics

---

## 🎯 What the Seeding Script Does

### ✅ Creates (in customers table):

```python
python seed_database.py

# Inserts 5 records into 'customers' table:
1. Sarah Johnson - Regular customer, 250 loyalty points
2. Michael Chen - Restaurant owner, wholesale customer  
3. Emily Rodriguez - Regular shopper
4. David Thompson - VIP customer
5. Jennifer Martinez - Frequent visitor
```

### ❌ Does NOT Create (in auth.users):

The script does NOT create:
- Admin user (for login)
- Cashier accounts (for login)
- Staff members (for login)

**You must create these manually** via Supabase Dashboard!

---

## 🔧 How to Create Staff Users

### Step 1: Go to Supabase Dashboard

```
https://app.supabase.com
→ Your Project
→ Authentication
→ Users
→ Add User
```

### Step 2: Create Admin

```
Email: admin@yourstore.com
Password: YourSecurePassword123!
Auto Confirm User: ✅ Check this

User Metadata (click "Edit user metadata"):
{
  "firstName": "Admin",
  "lastName": "User",
  "pin": "123456",
  "roles": ["admin", "cashier"],
  "permissions": ["all"],
  "isAdmin": true
}
```

### Step 3: Create Cashier

```
Email: cashier@yourstore.com
Password: SecurePassword123!
Auto Confirm User: ✅ Check this

User Metadata:
{
  "firstName": "John",
  "lastName": "Cashier",
  "pin": "567890",
  "roles": ["cashier"],
  "permissions": ["process_sales", "void_items", "apply_discounts"],
  "isAdmin": false
}
```

### Step 4: Test Login

```typescript
// In your app
1. Go to login screen
2. Enter: admin@yourstore.com
3. Password: YourSecurePassword123!
4. ✅ Should log in successfully
```

---

## 🤔 Common Questions

### "Why are there two types of users?"

Because they serve different purposes:
- **Staff Users** = Your team (who operate the POS)
- **Customers** = Your clients (who buy products)

### "Can a staff user also be a customer?"

Technically yes, but they're stored separately:
- **Staff user** = In `auth.users` (for login)
- **Customer record** = In `customers` (for purchases)

If an employee buys something, create a customer record for them too.

### "Why doesn't the seeding script create staff users?"

Because:
1. **Security**: Staff users need secure authentication (Supabase Auth)
2. **Separation**: Auth is managed by Supabase, data is managed by you
3. **Control**: You should explicitly create staff accounts, not seed them

### "How do I add more staff later?"

Two options:
1. **Supabase Dashboard** (easiest): Authentication → Users → Add User
2. **Admin Panel** (future): Build a UsersModule that uses Supabase Auth API

---

## 📚 Real-World Analogy

Think of a restaurant:

### Staff Users (Employees)
- 👨‍🍳 Chef - Logs in to kitchen system
- 🧑‍💼 Manager - Logs in to admin panel  
- 🧑‍💼 Waiter - Logs in to POS terminal
- **They work there** - Need credentials to access systems

### Customers (Diners)
- 👤 Sarah - Regular diner, has rewards card
- 👤 Michael - VIP customer, gets discounts
- 👤 Emily - First-time visitor
- **They eat there** - Don't need login, but tracked for loyalty

---

## ✅ Checklist

### After Running Seeding Script

- [ ] ✅ Check products table (should have 55 products)
- [ ] ✅ Check customers table (should have 5 customers)
- [ ] ✅ Check orders table (should have 3 orders)
- [ ] ❌ Try to login (won't work yet - no staff users!)

### To Enable Login

- [ ] Go to Supabase Dashboard
- [ ] Create admin user in Authentication → Users
- [ ] Create cashier users if needed
- [ ] Test login with created credentials
- [ ] ✅ Now you can login!

---

## 🔗 Related Documentation

- [BACKEND_FAQ.md](BACKEND_FAQ.md) - Common backend questions
- [AUTH_MIGRATION_GUIDE.md](AUTH_MIGRATION_GUIDE.md) - Complete auth setup
- [SEEDING_GUIDE.md](SEEDING_GUIDE.md) - Database seeding details

---

**Remember:** 
- **Users** = Your employees (manual creation)
- **Customers** = Your shoppers (script creates them)

**Last Updated**: October 29, 2025
