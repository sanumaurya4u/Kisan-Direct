-- Phase 15: Seed Data for Demo

-- Insert Categories
INSERT INTO public.product_categories (id, name, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Vegetables', 'Fresh everyday vegetables'),
  ('00000000-0000-0000-0000-000000000002', 'Fruits', 'Fresh seasonal fruits'),
  ('00000000-0000-0000-0000-000000000003', 'Grains & Cereals', 'Staple grains and cereals')
ON CONFLICT (id) DO NOTHING;

-- Insert Products
INSERT INTO public.products (id, category_id, name, description, unit) VALUES
  -- Vegetables
  ('11111111-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Tomato', 'Fresh red tomatoes suitable for processing or retail', 'Quintal'),
  ('11111111-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Onion', 'Nashik red onions, well cured', 'Quintal'),
  ('11111111-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Potato', 'Cold storage potatoes, large size', 'Quintal'),
  
  -- Fruits
  ('11111111-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Apple', 'Kashmiri Apples, Grade A', 'Box (20kg)'),
  ('11111111-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Mango', 'Alphonso Mangoes', 'Dozen'),

  -- Grains
  ('11111111-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Wheat', 'Sharbati Wheat, thoroughly cleaned', 'Quintal'),
  ('11111111-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Basmati Rice', 'Long grain basmati, aged 1 year', 'Quintal')
ON CONFLICT (id) DO NOTHING;
