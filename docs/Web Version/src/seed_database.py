#!/usr/bin/env python3
"""
AuraFlow POS - Database Seeding Script
Migrates mock data from TypeScript to Supabase PostgreSQL database

⚠️  IMPORTANT - WHAT THIS SCRIPT DOES:
    ✅ Seeds PRODUCTS (55 grocery + bar items)
    ✅ Seeds CUSTOMERS (5 sample POS customers)
    ✅ Seeds ORDERS (3 sample orders with items)
    
    ❌ Does NOT create LOGIN USERS (staff/admin)
    ❌ Does NOT set up authentication
    ❌ Does NOT create cashier accounts
    
    For login users, see: AUTH_MIGRATION_GUIDE.md

Prerequisites:
    pip install supabase python-dotenv

Usage:
    python seed_database.py

Environment Variables (create .env file):
    SUPABASE_URL=your-project-url
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
"""

import os
import sys
from datetime import datetime, date
from decimal import Decimal
from typing import List, Dict, Any
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    print("Please create a .env file with:")
    print("  SUPABASE_URL=your-project-url")
    print("  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ============================================================================
# MOCK DATA - Translated from TypeScript
# ============================================================================

PRODUCTS = [
    {'name': 'Organic Apples', 'price': 2.99, 'category': 'Fruits', 'stock_quantity': 50, 'sku': 'FRT-001', 'barcode': '0123456789012'},
    {'name': 'Whole Wheat Bread', 'price': 4.50, 'category': 'Bakery', 'stock_quantity': 30, 'sku': 'BAK-001', 'barcode': '0123456789029'},
    {'name': 'Free-Range Eggs', 'price': 5.20, 'category': 'Dairy', 'stock_quantity': 25, 'sku': 'DAI-001', 'barcode': '0123456789036'},
    {'name': 'Almond Milk', 'price': 3.75, 'category': 'Dairy', 'stock_quantity': 40, 'sku': 'DAI-002', 'barcode': '0123456789043'},
    {'name': 'Cheddar Cheese', 'price': 7.00, 'category': 'Dairy', 'stock_quantity': 20, 'sku': 'DAI-003', 'barcode': '0123456789050'},
    {'name': 'Chicken Breast', 'price': 9.50, 'category': 'Meat', 'stock_quantity': 15, 'sku': 'MEA-001', 'barcode': '0123456789067'},
    {'name': 'Avocado', 'price': 1.50, 'category': 'Fruits', 'stock_quantity': 35, 'sku': 'FRT-002', 'barcode': '0123456789074'},
    {'name': 'Organic Spinach', 'price': 3.25, 'category': 'Vegetables', 'stock_quantity': 28, 'sku': 'VEG-001', 'barcode': '0123456789081'},
    {'name': 'Coffee - Small', 'price': 3.50, 'category': 'Coffee', 'stock_quantity': 50, 'sku': 'COF-001-S', 'barcode': '0123456789098'},
    {'name': 'Coffee - Medium', 'price': 4.50, 'category': 'Coffee', 'stock_quantity': 30, 'sku': 'COF-001-M', 'barcode': '0123456789099'},
    {'name': 'Coffee - Large', 'price': 5.50, 'category': 'Coffee', 'stock_quantity': 20, 'sku': 'COF-001-L', 'barcode': '0123456789100'},
    {'name': 'Painkiller Tablets', 'price': 8.99, 'category': 'Pharmacy', 'stock_quantity': 45, 'sku': 'PHA-001', 'barcode': '0123456789104'},
    {'name': 'Shampoo', 'price': 6.50, 'category': 'Salon', 'stock_quantity': 22, 'sku': 'SAL-001', 'barcode': '0123456789111'},
    {'name': 'Beef Burger - Single', 'price': 12.00, 'category': 'Restaurant', 'stock_quantity': 30, 'sku': 'RES-001-S', 'barcode': '0123456789128'},
    {'name': 'Beef Burger - Double', 'price': 16.00, 'category': 'Restaurant', 'stock_quantity': 20, 'sku': 'RES-001-D', 'barcode': '0123456789129'},
    {'name': 'Bananas', 'price': 1.99, 'category': 'Fruits', 'stock_quantity': 60, 'sku': 'FRT-003', 'barcode': '0123456789135'},
    {'name': 'Strawberries', 'price': 4.99, 'category': 'Fruits', 'stock_quantity': 8, 'sku': 'FRT-004', 'barcode': '0123456789142'},
    {'name': 'Orange Juice', 'price': 5.50, 'category': 'Beverages', 'stock_quantity': 32, 'sku': 'BEV-001', 'barcode': '0123456789159'},
    {'name': 'Greek Yogurt', 'price': 4.25, 'category': 'Dairy', 'stock_quantity': 27, 'sku': 'DAI-004', 'barcode': '0123456789166'},
    {'name': 'Salmon Fillet', 'price': 14.99, 'category': 'Seafood', 'stock_quantity': 10, 'sku': 'SEA-001', 'barcode': '0123456789173'},
    {'name': 'Croissant', 'price': 3.50, 'category': 'Bakery', 'stock_quantity': 24, 'sku': 'BAK-002', 'barcode': '0123456789180'},
    {'name': 'Tomatoes', 'price': 2.75, 'category': 'Vegetables', 'stock_quantity': 42, 'sku': 'VEG-002', 'barcode': '0123456789197'},
    {'name': 'Olive Oil', 'price': 11.99, 'category': 'Vegetables', 'stock_quantity': 16, 'sku': 'VEG-003', 'barcode': '0123456789203'},
    {'name': 'Energy Drink', 'price': 2.99, 'category': 'Beverages', 'stock_quantity': 48, 'sku': '08102023125', 'barcode': '08102023125'},
    
    # Bar & Nightclub Products
    # Beer
    {'name': 'Budweiser Draft', 'price': 6.00, 'category': 'Beer', 'stock_quantity': 100, 'sku': 'BEER-001', 'barcode': '0123456789210'},
    {'name': 'Corona Extra', 'price': 7.00, 'category': 'Beer', 'stock_quantity': 75, 'sku': 'BEER-002', 'barcode': '0123456789227'},
    {'name': 'Guinness Stout', 'price': 8.00, 'category': 'Beer', 'stock_quantity': 50, 'sku': 'BEER-003', 'barcode': '0123456789234'},
    {'name': 'Blue Moon', 'price': 7.50, 'category': 'Beer', 'stock_quantity': 60, 'sku': 'BEER-004', 'barcode': '0123456789241'},
    {'name': 'IPA Draft', 'price': 8.50, 'category': 'Beer', 'stock_quantity': 80, 'sku': 'BEER-005', 'barcode': '0123456789258'},
    
    # Wine
    {'name': 'Cabernet Sauvignon', 'price': 12.00, 'category': 'Wine', 'stock_quantity': 40, 'sku': 'WINE-001', 'barcode': '0123456789265'},
    {'name': 'Chardonnay', 'price': 11.00, 'category': 'Wine', 'stock_quantity': 45, 'sku': 'WINE-002', 'barcode': '0123456789272'},
    {'name': 'Pinot Noir', 'price': 13.00, 'category': 'Wine', 'stock_quantity': 35, 'sku': 'WINE-003', 'barcode': '0123456789289'},
    {'name': 'Prosecco', 'price': 10.00, 'category': 'Wine', 'stock_quantity': 50, 'sku': 'WINE-004', 'barcode': '0123456789296'},
    
    # Spirits
    {'name': 'Jack Daniels', 'price': 10.00, 'category': 'Spirits', 'stock_quantity': 30, 'sku': 'SPRT-001', 'barcode': '0123456789302'},
    {'name': 'Grey Goose Vodka', 'price': 12.00, 'category': 'Spirits', 'stock_quantity': 35, 'sku': 'SPRT-002', 'barcode': '0123456789319'},
    {'name': 'Patron Tequila', 'price': 14.00, 'category': 'Spirits', 'stock_quantity': 25, 'sku': 'SPRT-003', 'barcode': '0123456789326'},
    {'name': 'Bacardi Rum', 'price': 9.00, 'category': 'Spirits', 'stock_quantity': 40, 'sku': 'SPRT-004', 'barcode': '0123456789333'},
    {'name': 'Tanqueray Gin', 'price': 11.00, 'category': 'Spirits', 'stock_quantity': 30, 'sku': 'SPRT-005', 'barcode': '0123456789340'},
    
    # Cocktails
    {'name': 'Margarita', 'price': 12.00, 'category': 'Cocktails', 'stock_quantity': 999, 'sku': 'CKTL-001', 'barcode': '0123456789357'},
    {'name': 'Mojito', 'price': 11.00, 'category': 'Cocktails', 'stock_quantity': 999, 'sku': 'CKTL-002', 'barcode': '0123456789364'},
    {'name': 'Old Fashioned', 'price': 13.00, 'category': 'Cocktails', 'stock_quantity': 999, 'sku': 'CKTL-003', 'barcode': '0123456789371'},
    {'name': 'Manhattan', 'price': 13.00, 'category': 'Cocktails', 'stock_quantity': 999, 'sku': 'CKTL-004', 'barcode': '0123456789388'},
    {'name': 'Cosmopolitan', 'price': 12.00, 'category': 'Cocktails', 'stock_quantity': 999, 'sku': 'CKTL-005', 'barcode': '0123456789395'},
    {'name': 'Long Island Iced Tea', 'price': 14.00, 'category': 'Cocktails', 'stock_quantity': 999, 'sku': 'CKTL-006', 'barcode': '0123456789401'},
    
    # Shots
    {'name': 'Jägermeister Shot', 'price': 6.00, 'category': 'Shots', 'stock_quantity': 999, 'sku': 'SHOT-001', 'barcode': '0123456789418'},
    {'name': 'Fireball Shot', 'price': 5.00, 'category': 'Shots', 'stock_quantity': 999, 'sku': 'SHOT-002', 'barcode': '0123456789425'},
    {'name': 'Tequila Shot', 'price': 7.00, 'category': 'Shots', 'stock_quantity': 999, 'sku': 'SHOT-003', 'barcode': '0123456789432'},
    {'name': 'Vodka Shot', 'price': 6.00, 'category': 'Shots', 'stock_quantity': 999, 'sku': 'SHOT-004', 'barcode': '0123456789449'},
    
    # Non-Alcoholic
    {'name': 'Virgin Mojito', 'price': 6.00, 'category': 'Non-Alcoholic', 'stock_quantity': 999, 'sku': 'NONA-001', 'barcode': '0123456789456'},
    {'name': 'Shirley Temple', 'price': 5.00, 'category': 'Non-Alcoholic', 'stock_quantity': 999, 'sku': 'NONA-002', 'barcode': '0123456789463'},
    {'name': 'Coca-Cola', 'price': 3.00, 'category': 'Non-Alcoholic', 'stock_quantity': 999, 'sku': 'NONA-003', 'barcode': '0123456789470'},
    {'name': 'Red Bull', 'price': 5.00, 'category': 'Non-Alcoholic', 'stock_quantity': 999, 'sku': 'NONA-004', 'barcode': '0123456789487'},
    {'name': 'Sparkling Water', 'price': 3.00, 'category': 'Non-Alcoholic', 'stock_quantity': 999, 'sku': 'NONA-005', 'barcode': '0123456789494'},
    
    # Bar Food
    {'name': 'Wings (12pc)', 'price': 14.00, 'category': 'Food', 'stock_quantity': 50, 'sku': 'FOOD-001', 'barcode': '0123456789500'},
    {'name': 'Nachos Supreme', 'price': 12.00, 'category': 'Food', 'stock_quantity': 50, 'sku': 'FOOD-002', 'barcode': '0123456789517'},
    {'name': 'Loaded Fries', 'price': 8.00, 'category': 'Food', 'stock_quantity': 50, 'sku': 'FOOD-003', 'barcode': '0123456789524'},
    {'name': 'Pretzel Bites', 'price': 7.00, 'category': 'Food', 'stock_quantity': 50, 'sku': 'FOOD-004', 'barcode': '0123456789531'},
    {'name': 'Sliders (3pc)', 'price': 11.00, 'category': 'Food', 'stock_quantity': 50, 'sku': 'FOOD-005', 'barcode': '0123456789548'},
]

CUSTOMERS = [
    {
        'name': 'Sarah Johnson',
        'email': 'sarah.johnson@email.com',
        'phone': '(555) 234-5678',
        'address': '123 Main Street, Springfield, IL 62701',
        'loyalty_points': 250,
        'total_spent': 1250.75,
        'visit_count': 28,
        'birthday': '1985-06-15',
        'notes': 'Prefers dairy-free products',
    },
    {
        'name': 'Michael Chen',
        'email': 'michael.chen@email.com',
        'phone': '(555) 345-6789',
        'address': '456 Oak Avenue, Springfield, IL 62702',
        'loyalty_points': 680,
        'total_spent': 3420.50,
        'visit_count': 45,
        'birthday': '1992-03-22',
        'notes': 'Restaurant owner, large orders',
    },
    {
        'name': 'Emily Rodriguez',
        'email': 'emily.rodriguez@email.com',
        'phone': '(555) 456-7890',
        'address': '789 Elm Street, Springfield, IL 62703',
        'loyalty_points': 175,
        'total_spent': 875.25,
        'visit_count': 15,
        'birthday': '1988-11-08',
    },
    {
        'name': 'David Thompson',
        'email': 'david.t@email.com',
        'phone': '(555) 567-8901',
        'address': '321 Pine Road, Springfield, IL 62704',
        'loyalty_points': 1136,
        'total_spent': 5680.00,
        'visit_count': 89,
        'birthday': '1975-09-30',
        'notes': 'VIP customer - always gets 10% discount',
    },
    {
        'name': 'Jennifer Martinez',
        'email': 'jennifer.m@email.com',
        'phone': '(555) 678-9012',
        'address': '654 Maple Lane, Springfield, IL 62705',
        'loyalty_points': 412,
        'total_spent': 2060.80,
        'visit_count': 32,
        'birthday': '1990-07-14',
    },
]

# ============================================================================
# SEEDING FUNCTIONS
# ============================================================================

def clear_all_data():
    """Clear all existing data from tables (in correct order for foreign keys)"""
    print("\n🗑️  Clearing existing data...")
    
    tables = [
        'inventory_adjustments',
        'refunds',
        'transactions',
        'order_items',
        'orders',
        'shifts',
        'customers',
        'products',
        'settings',
    ]
    
    for table in tables:
        try:
            result = supabase.table(table).delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
            print(f"  ✅ Cleared {table}")
        except Exception as e:
            print(f"  ⚠️  {table}: {str(e)}")

def seed_products():
    """Seed products table"""
    print("\n📦 Seeding Products...")
    
    try:
        result = supabase.table('products').insert(PRODUCTS).execute()
        print(f"  ✅ Inserted {len(PRODUCTS)} products")
        return result.data
    except Exception as e:
        print(f"  ❌ Error seeding products: {str(e)}")
        return []

def seed_customers():
    """Seed customers table"""
    print("\n👥 Seeding Customers...")
    
    try:
        result = supabase.table('customers').insert(CUSTOMERS).execute()
        print(f"  ✅ Inserted {len(CUSTOMERS)} customers")
        return result.data
    except Exception as e:
        print(f"  ❌ Error seeding customers: {str(e)}")
        return []

def create_sample_orders(customer_ids: List[str], product_ids: List[str], user_id: str):
    """Create sample orders with order items"""
    print("\n🧾 Creating Sample Orders...")
    
    if not customer_ids or not product_ids:
        print("  ⚠️  Skipping orders - no customers or products available")
        return
    
    sample_orders = [
        {
            'order_number': 'ORD-2025-001',
            'customer_id': customer_ids[0] if len(customer_ids) > 0 else None,
            'user_id': user_id,
            'terminal_id': 'Till 1',
            'subtotal': 45.50,
            'tax': 4.10,
            'discount': 0.00,
            'tip': 5.00,
            'total': 54.60,
            'payment_method': 'Credit Card',
            'payment_status': 'completed',
            'order_type': 'dine-in',
            'status': 'completed',
        },
        {
            'order_number': 'ORD-2025-002',
            'customer_id': customer_ids[1] if len(customer_ids) > 1 else None,
            'user_id': user_id,
            'terminal_id': 'Till 1',
            'subtotal': 123.75,
            'tax': 11.14,
            'discount': 12.38,
            'tip': 15.00,
            'total': 137.51,
            'payment_method': 'Cash',
            'payment_status': 'completed',
            'order_type': 'takeout',
            'status': 'completed',
        },
        {
            'order_number': 'ORD-2025-003',
            'customer_id': customer_ids[2] if len(customer_ids) > 2 else None,
            'user_id': user_id,
            'terminal_id': 'Till 2',
            'subtotal': 78.00,
            'tax': 7.02,
            'discount': 0.00,
            'tip': 10.00,
            'total': 95.02,
            'payment_method': 'Debit Card',
            'payment_status': 'completed',
            'order_type': 'dine-in',
            'table_number': 'Table 5',
            'status': 'completed',
        },
    ]
    
    try:
        result = supabase.table('orders').insert(sample_orders).execute()
        print(f"  ✅ Inserted {len(sample_orders)} sample orders")
        
        # Create order items for first order
        if result.data and len(result.data) > 0:
            order_id = result.data[0]['id']
            order_items = [
                {
                    'order_id': order_id,
                    'product_id': product_ids[0] if len(product_ids) > 0 else None,
                    'product_name': 'Organic Apples',
                    'quantity': 3,
                    'price': 2.99,
                    'discount': 0.00,
                    'total': 8.97,
                },
                {
                    'order_id': order_id,
                    'product_id': product_ids[1] if len(product_ids) > 1 else None,
                    'product_name': 'Whole Wheat Bread',
                    'quantity': 2,
                    'price': 4.50,
                    'discount': 0.00,
                    'total': 9.00,
                },
            ]
            
            supabase.table('order_items').insert(order_items).execute()
            print(f"  ✅ Inserted {len(order_items)} order items")
        
    except Exception as e:
        print(f"  ❌ Error creating sample orders: {str(e)}")

def show_summary():
    """Show summary of seeded data"""
    print("\n" + "="*60)
    print("📊 Database Seeding Summary")
    print("="*60)
    
    tables = {
        'products': 'Products',
        'customers': 'Customers',
        'orders': 'Orders',
        'order_items': 'Order Items',
    }
    
    for table, label in tables.items():
        try:
            result = supabase.table(table).select('id', count='exact').execute()
            count = result.count if hasattr(result, 'count') else len(result.data)
            print(f"  ✅ {label}: {count}")
        except Exception as e:
            print(f"  ❌ {label}: Error - {str(e)}")
    
    print("="*60)

def get_or_create_admin_user() -> str:
    """Get existing admin user ID or prompt to create one"""
    print("\n👤 Getting admin user ID...")
    print("  ℹ️  You need to create an admin user in Supabase first.")
    print("  ℹ️  Go to: Authentication → Users → Add User")
    print()
    user_id = input("  Enter your admin user UUID (or press Enter to skip orders): ").strip()
    
    if not user_id:
        print("  ⚠️  No user ID provided - will skip creating sample orders")
        return None
    
    return user_id

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main seeding function"""
    print("="*60)
    print("🌊 AuraFlow POS - Database Seeding Script")
    print("="*60)
    print(f"📍 Supabase URL: {SUPABASE_URL}")
    print("="*60)
    
    # Important notice
    print("\n📋 WHAT THIS SCRIPT DOES:")
    print("   ✅ Seeds 55 products (grocery + bar items)")
    print("   ✅ Seeds 5 customers (POS customers)")
    print("   ✅ Seeds 3 sample orders")
    print("\n📋 WHAT THIS SCRIPT DOES NOT DO:")
    print("   ❌ Does NOT create login users (staff/cashiers)")
    print("   ❌ Does NOT set up authentication")
    print("   👉 See AUTH_MIGRATION_GUIDE.md for login setup")
    
    # Confirm before clearing
    print("\n⚠️  WARNING: This will DELETE all existing data!")
    confirm = input("Type 'yes' to continue: ").strip().lower()
    
    if confirm != 'yes':
        print("\n❌ Seeding cancelled.")
        return
    
    # Clear existing data
    clear_all_data()
    
    # Seed products
    products = seed_products()
    product_ids = [p['id'] for p in products] if products else []
    
    # Seed customers
    customers = seed_customers()
    customer_ids = [c['id'] for c in customers] if customers else []
    
    # Get admin user for orders
    user_id = get_or_create_admin_user()
    
    # Create sample orders (if user ID provided)
    if user_id and product_ids and customer_ids:
        create_sample_orders(customer_ids, product_ids, user_id)
    
    # Show summary
    show_summary()
    
    print("\n✨ Database seeding complete!")
    print("\n💡 Next steps:")
    print("   1. Check your Supabase dashboard to verify the data")
    print("   2. CREATE LOGIN USERS (staff/admin) via Supabase Dashboard")
    print("      → Authentication → Users → Add User")
    print("      → See AUTH_MIGRATION_GUIDE.md for details")
    print("   3. Update your .env.local with SUPABASE credentials")
    print("   4. Test your application with real data")
    print("\n⚠️  REMEMBER: You still need to create login users manually!")
    print("   This script only created products and customers, not staff logins.")
    print()

if __name__ == '__main__':
    main()
