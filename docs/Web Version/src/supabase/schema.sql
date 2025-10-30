-- AuraFlow POS Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE shift_status AS ENUM ('open', 'closed');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE refund_status AS ENUM ('pending', 'completed', 'failed');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  barcode TEXT,
  sku TEXT,
  description TEXT,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INTEGER DEFAULT 10,
  cost DECIMAL(10,2) CHECK (cost >= 0),
  taxable BOOLEAN DEFAULT true,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_barcode ON products(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_products_enabled ON products(enabled);

-- Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
  total_spent DECIMAL(10,2) DEFAULT 0 CHECK (total_spent >= 0),
  visit_count INTEGER DEFAULT 0 CHECK (visit_count >= 0),
  birthday DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL;
CREATE INDEX idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_customers_loyalty_points ON customers(loyalty_points DESC);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  user_id UUID NOT NULL, -- References auth.users
  terminal_id TEXT,
  subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  tip DECIMAL(10,2) DEFAULT 0 CHECK (tip >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  order_type TEXT, -- 'dine-in', 'takeout', 'delivery', etc.
  table_number TEXT,
  notes TEXT,
  status order_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  stripe_payment_id TEXT,
  status transaction_status DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_stripe_payment_id ON transactions(stripe_payment_id) WHERE stripe_payment_id IS NOT NULL;

-- Refunds Table
CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  reason TEXT NOT NULL,
  notes TEXT,
  refund_method TEXT NOT NULL, -- 'original', 'cash', 'store_credit'
  status refund_status DEFAULT 'pending',
  processed_by UUID NOT NULL, -- References auth.users
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_refunds_transaction_id ON refunds(transaction_id);
CREATE INDEX idx_refunds_created_at ON refunds(created_at DESC);

-- Shifts Table
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- References auth.users
  terminal_id TEXT,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  opening_cash DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_cash DECIMAL(10,2),
  total_sales DECIMAL(10,2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  status shift_status DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shifts_user_id ON shifts(user_id);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_clock_in ON shifts(clock_in DESC);

-- Inventory Adjustments Table
CREATE TABLE inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_change INTEGER NOT NULL, -- Can be positive or negative
  reason TEXT NOT NULL, -- 'restock', 'damage', 'theft', 'correction', 'sale'
  notes TEXT,
  user_id UUID NOT NULL, -- References auth.users
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_adjustments_product_id ON inventory_adjustments(product_id);
CREATE INDEX idx_inventory_adjustments_created_at ON inventory_adjustments(created_at DESC);

-- Settings Table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update product stock on order completion
CREATE OR REPLACE FUNCTION update_product_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stock when order status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE products p
    SET stock_quantity = stock_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.product_id = p.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_on_order_completion
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed')
  EXECUTE FUNCTION update_product_stock_on_order();

-- Update customer stats on order completion
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.customer_id IS NOT NULL THEN
    UPDATE customers
    SET 
      total_spent = total_spent + NEW.total,
      visit_count = visit_count + 1
    WHERE id = NEW.customer_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_stats_on_order
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed')
  EXECUTE FUNCTION update_customer_stats();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- For beta/development: Allow authenticated users full access
-- In production, you would create more granular policies based on roles

CREATE POLICY "Allow authenticated access to products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to customers" ON customers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to order_items" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to transactions" ON transactions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to refunds" ON refunds
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to shifts" ON shifts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to inventory_adjustments" ON inventory_adjustments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE
-- ============================================================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public to read product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('store_name', '"AuraFlow POS"'),
  ('tax_rate', '8.5'),
  ('currency', '"USD"'),
  ('low_stock_threshold', '10'),
  ('receipt_footer', '"Thank you for your business!"');

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

-- Daily sales summary view
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
  DATE(created_at) as sale_date,
  COUNT(*) as order_count,
  SUM(total) as total_sales,
  SUM(tax) as total_tax,
  SUM(tip) as total_tips,
  AVG(total) as average_order_value
FROM orders
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Product performance view
CREATE OR REPLACE VIEW product_performance AS
SELECT 
  p.id,
  p.name,
  p.category,
  p.price,
  p.stock_quantity,
  COUNT(oi.id) as times_sold,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.total) as total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
GROUP BY p.id, p.name, p.category, p.price, p.stock_quantity
ORDER BY total_revenue DESC NULLS LAST;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);
CREATE INDEX idx_order_items_product_created ON order_items(product_id, created_at DESC);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on all sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ============================================================================
-- COMPLETED
-- ============================================================================

-- Schema creation complete!
-- Next steps:
-- 1. Create a Supabase account at https://supabase.com
-- 2. Create a new project
-- 3. Run this SQL in the SQL Editor
-- 4. Copy your project URL and anon key to .env file
-- 5. Run the seed data script (if you want demo data)
