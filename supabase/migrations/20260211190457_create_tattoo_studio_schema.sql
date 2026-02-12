/*
  # Tattoo Studio Booking System Schema

  ## Overview
  Complete database schema for a tattoo studio booking SaaS platform with:
  - User authentication and profiles
  - Tattoo gallery with categories and pricing
  - Appointment booking system
  - Admin dashboard support

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `phone` (text)
  - `is_admin` (boolean, default false)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. categories
  - `id` (uuid, primary key)
  - `name` (text, unique) - e.g., "Traços Finos", "Fechada", "Colorida"
  - `slug` (text, unique)
  - `description` (text)
  - `display_order` (integer)
  - `created_at` (timestamptz)

  ### 3. tattoos
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `category_id` (uuid, references categories)
  - `price` (decimal)
  - `image_url` (text)
  - `is_featured` (boolean) - for home page gallery
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. appointments
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `appointment_date` (date)
  - `appointment_time` (time)
  - `tattoo_description` (text)
  - `tattoo_size` (text)
  - `body_placement` (text)
  - `reference_images` (text)
  - `notes` (text)
  - `status` (text) - 'pending', 'confirmed', 'completed', 'cancelled'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public can read tattoos and categories
  - Authenticated users can create appointments and read their own
  - Only admins can manage everything
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create tattoos table
CREATE TABLE IF NOT EXISTS tattoos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price decimal(10, 2) NOT NULL,
  image_url text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tattoos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tattoos"
  ON tattoos FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert tattoos"
  ON tattoos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can update tattoos"
  ON tattoos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Only admins can delete tattoos"
  ON tattoos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  tattoo_description text NOT NULL,
  tattoo_size text,
  body_placement text,
  reference_images text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Authenticated users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tattoos_category ON tattoos(category_id);
CREATE INDEX IF NOT EXISTS idx_tattoos_featured ON tattoos(is_featured);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Traços Finos', 'tracos-finos', 'Tatuagens delicadas com linhas finas e detalhadas', 1),
  ('Fechada', 'fechada', 'Tatuagens com preenchimento completo e sombreamento', 2),
  ('Colorida', 'colorida', 'Tatuagens vibrantes com cores diversas', 3),
  ('Blackwork', 'blackwork', 'Tatuagens em preto sólido com alto contraste', 4),
  ('Realismo', 'realismo', 'Tatuagens hiper-realistas com detalhes precisos', 5),
  ('Minimalista', 'minimalista', 'Tatuagens simples e discretas', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample tattoos
INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Rosa Delicada',
  'Rosa em traços finos com detalhes em sombreado',
  c.id,
  350.00,
  'https://images.unsplash.com/photo-1590246814883-57c511e2f3fa?w=800',
  true
FROM categories c WHERE c.slug = 'tracos-finos'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Mandala Geométrica',
  'Mandala circular com padrões geométricos detalhados',
  c.id,
  450.00,
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703f?w=800',
  true
FROM categories c WHERE c.slug = 'tracos-finos'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Dragão Oriental',
  'Dragão em estilo oriental com sombreamento completo',
  c.id,
  1200.00,
  'https://images.unsplash.com/photo-1598371611251-b8b6aac65db4?w=800',
  true
FROM categories c WHERE c.slug = 'fechada'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Leão Realista',
  'Leão em preto e cinza com alto nível de realismo',
  c.id,
  950.00,
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
  false
FROM categories c WHERE c.slug = 'realismo'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Flores Coloridas',
  'Bouquet de flores vibrantes em cores aquarela',
  c.id,
  650.00,
  'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
  true
FROM categories c WHERE c.slug = 'colorida'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Serpente Tribal',
  'Serpente em estilo blackwork com padrões tribais',
  c.id,
  550.00,
  'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800',
  false
FROM categories c WHERE c.slug = 'blackwork'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Montanha Minimalista',
  'Silhueta de montanhas em traço único e minimalista',
  c.id,
  280.00,
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
  false
FROM categories c WHERE c.slug = 'minimalista'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Borboleta Delicada',
  'Borboleta em traços finos com asas detalhadas',
  c.id,
  320.00,
  'https://images.unsplash.com/photo-1590246814883-57c511e2f3fa?w=800',
  true
FROM categories c WHERE c.slug = 'tracos-finos'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Fênix em Chamas',
  'Fênix renascendo das cinzas com cores vibrantes',
  c.id,
  1100.00,
  'https://images.unsplash.com/photo-1598371611251-b8b6aac65db4?w=800',
  true
FROM categories c WHERE c.slug = 'colorida'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Lobo Tribal',
  'Cabeça de lobo em estilo blackwork tribal',
  c.id,
  680.00,
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
  false
FROM categories c WHERE c.slug = 'blackwork'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Tigre Fechado',
  'Tigre em estilo oriental com sombreamento completo',
  c.id,
  1350.00,
  'https://images.unsplash.com/photo-1598371611251-b8b6aac65db4?w=800',
  false
FROM categories c WHERE c.slug = 'fechada'
ON CONFLICT DO NOTHING;

INSERT INTO tattoos (title, description, category_id, price, image_url, is_featured) 
SELECT 
  'Olho Realista',
  'Olho humano hiper-realista em preto e cinza',
  c.id,
  720.00,
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
  false
FROM categories c WHERE c.slug = 'realismo'
ON CONFLICT DO NOTHING;