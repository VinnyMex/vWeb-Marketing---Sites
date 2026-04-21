-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT,
  image TEXT,
  available BOOLEAN DEFAULT true,
  unit TEXT
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  phone TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  neighborhood TEXT,
  reference TEXT,
  lastOrderDate TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Note: Using OR REPLACE isn't supported for policies, we check existence if needed 
-- but since I'm creating a fresh schema, let's keep it simple.

DROP POLICY IF EXISTS "Allow public insertion of orders" ON orders;
CREATE POLICY "Allow public insertion of orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of orders" ON orders;
CREATE POLICY "Allow public update of orders" ON orders FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read of orders" ON orders;
CREATE POLICY "Allow public read of orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public delete of orders" ON orders;
CREATE POLICY "Allow public delete of orders" ON orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read of products" ON products;
CREATE POLICY "Allow public read of products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public interaction with customers" ON customers;
CREATE POLICY "Allow public interaction with customers" ON customers FOR ALL USING (true);
