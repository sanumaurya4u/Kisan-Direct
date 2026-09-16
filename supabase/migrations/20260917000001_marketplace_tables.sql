-- 1. Create product_categories
CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.product_categories FOR SELECT USING (true);

-- 2. Create products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- 3. Create listings
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity NUMERIC NOT NULL,
    available_quantity NUMERIC NOT NULL,
    price_per_unit NUMERIC NOT NULL,
    grade TEXT,
    harvest_date DATE,
    available_from DATE,
    location_name TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    image_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'sold_out', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings viewable by everyone if active or owned" 
    ON public.listings FOR SELECT 
    USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Sellers can insert their own listings" 
    ON public.listings FOR INSERT 
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own listings" 
    ON public.listings FOR UPDATE 
    USING (auth.uid() = seller_id)
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own listings" 
    ON public.listings FOR DELETE 
    USING (auth.uid() = seller_id);

-- 4. Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public Image Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 5. Seed Data
INSERT INTO public.product_categories (id, name, description) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Vegetables', 'Fresh vegetables'),
    ('00000000-0000-0000-0000-000000000002', 'Fruits', 'Fresh fruits'),
    ('00000000-0000-0000-0000-000000000003', 'Grains', 'Cereals and grains')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.products (id, category_id, name, unit) VALUES
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Tomato', 'kg'),
    ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'Potato', 'kg'),
    ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000001', 'Onion', 'kg'),
    ('11111111-1111-1111-1111-111111111114', '00000000-0000-0000-0000-000000000003', 'Wheat', 'quintal'),
    ('11111111-1111-1111-1111-111111111115', '00000000-0000-0000-0000-000000000003', 'Rice', 'quintal')
ON CONFLICT (id) DO NOTHING;
