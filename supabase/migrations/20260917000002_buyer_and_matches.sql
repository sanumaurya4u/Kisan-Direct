-- 1. Create buyer_requirements
CREATE TABLE public.buyer_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    required_quantity NUMERIC NOT NULL,
    remaining_quantity NUMERIC NOT NULL,
    target_price_per_unit NUMERIC,
    target_location TEXT NOT NULL,
    target_latitude NUMERIC,
    target_longitude NUMERIC,
    required_by DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'partially_fulfilled', 'fulfilled', 'cancelled', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buyer_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open requirements viewable by anyone" 
    ON public.buyer_requirements FOR SELECT 
    USING (status = 'open' OR auth.uid() = buyer_id);

CREATE POLICY "Buyers can insert their own requirements" 
    ON public.buyer_requirements FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own requirements" 
    ON public.buyer_requirements FOR UPDATE 
    USING (auth.uid() = buyer_id)
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can delete their own requirements" 
    ON public.buyer_requirements FOR DELETE 
    USING (auth.uid() = buyer_id);

-- 2. Create matches
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id UUID REFERENCES public.buyer_requirements(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
    match_score NUMERIC NOT NULL,
    product_score NUMERIC NOT NULL,
    quantity_score NUMERIC NOT NULL,
    distance_score NUMERIC NOT NULL,
    price_score NUMERIC NOT NULL,
    availability_score NUMERIC NOT NULL,
    explanation JSONB,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Matches are viewable by the buyer who made the requirement or the seller who made the listing
-- Since RLS policies can't easily join in the USING clause without performance hits or complex functions,
-- we'll use a subquery check.
CREATE POLICY "Participants can view their matches"
    ON public.matches FOR SELECT
    USING (
        auth.uid() IN (
            SELECT buyer_id FROM public.buyer_requirements WHERE id = requirement_id
        ) OR
        auth.uid() IN (
            SELECT seller_id FROM public.listings WHERE id = listing_id
        )
    );

-- Only system/functions should ideally create/update matches, but for now we might need buyers to update status
CREATE POLICY "Participants can update match status"
    ON public.matches FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT buyer_id FROM public.buyer_requirements WHERE id = requirement_id
        ) OR
        auth.uid() IN (
            SELECT seller_id FROM public.listings WHERE id = listing_id
        )
    );
