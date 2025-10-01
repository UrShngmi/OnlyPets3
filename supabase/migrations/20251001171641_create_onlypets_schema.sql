/*
  # OnlyPets Application Database Schema

  ## Overview
  Complete database schema for the OnlyPets pet adoption and services platform.

  ## Tables Created
  
  ### 1. users
  - id (uuid, primary key)
  - email (text, unique)
  - username (text)
  - profile_picture (text) - URL or base64 string
  - created_at (timestamptz)
  
  ### 2. pets
  - id (uuid, primary key)
  - name (text)
  - species (text) - Dog, Cat, Bird, Other
  - breed (text)
  - age (integer)
  - description (text)
  - quick_facts (jsonb) - array of facts
  - image_urls (jsonb) - array of image URLs
  - created_at (timestamptz)
  
  ### 3. services
  - id (uuid, primary key)
  - name (text)
  - description (text)
  - price (numeric)
  - duration (integer) - in minutes
  - activities (jsonb) - array of activities
  - image_url (text)
  - notes (text, optional)
  - created_at (timestamptz)
  
  ### 4. products
  - id (uuid, primary key)
  - name (text)
  - price (numeric)
  - image_url (text)
  - created_at (timestamptz)
  
  ### 5. wishlist
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - item_id (uuid) - references pet or service
  - item_type (text) - 'pet' or 'service'
  - created_at (timestamptz)
  
  ### 6. cart
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - product_id (uuid, foreign key to products)
  - quantity (integer)
  - created_at (timestamptz)
  
  ### 7. bookings
  - id (uuid, primary key)
  - user_id (uuid, foreign key to users)
  - service_id (uuid, foreign key to services)
  - pet_id (uuid, optional, foreign key to pets) - for pet adoptions
  - booking_date (date)
  - time_slot (text) - 'morning' or 'afternoon'
  - status (text) - 'pending', 'confirmed', 'completed'
  - created_at (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own wishlist, cart, and bookings
  - Pets, services, and products are publicly readable
  - User profile data is readable by authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  profile_picture text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL,
  breed text NOT NULL,
  age integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  quick_facts jsonb DEFAULT '[]'::jsonb,
  image_urls jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pets are publicly readable"
  ON pets FOR SELECT
  TO public
  USING (true);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  duration integer NOT NULL DEFAULT 60,
  activities jsonb DEFAULT '[]'::jsonb,
  image_url text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are publicly readable"
  ON services FOR SELECT
  TO public
  USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO public
  USING (true);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('pet', 'service')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own wishlist"
  ON wishlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON wishlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  time_slot text NOT NULL CHECK (time_slot IN ('morning', 'afternoon')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_slot ON bookings(booking_date, time_slot);
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
