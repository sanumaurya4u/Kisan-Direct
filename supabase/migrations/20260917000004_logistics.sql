-- 1. Create vehicles table
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vehicle_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    capacity_kg NUMERIC NOT NULL,
    current_latitude NUMERIC,
    current_longitude NUMERIC,
    availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'busy', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logistics partners can view their own vehicles"
    ON public.vehicles FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Logistics partners can insert their own vehicles"
    ON public.vehicles FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Logistics partners can update their own vehicles"
    ON public.vehicles FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- 2. Create logistics_jobs table
CREATE TABLE public.logistics_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    logistics_partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    pickup_location TEXT NOT NULL,
    pickup_latitude NUMERIC,
    pickup_longitude NUMERIC,
    drop_location TEXT NOT NULL,
    drop_latitude NUMERIC,
    drop_longitude NUMERIC,
    estimated_distance_km NUMERIC,
    estimated_duration_minutes INTEGER,
    status TEXT NOT NULL CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.logistics_jobs ENABLE ROW LEVEL SECURITY;

-- Anyone can see pending jobs, or jobs assigned to them
CREATE POLICY "Pending or assigned jobs are viewable"
    ON public.logistics_jobs FOR SELECT
    USING (status = 'pending' OR auth.uid() = logistics_partner_id);

CREATE POLICY "Logistics partners can update jobs assigned to them or accept pending"
    ON public.logistics_jobs FOR UPDATE
    USING (status = 'pending' OR auth.uid() = logistics_partner_id)
    WITH CHECK (auth.uid() = logistics_partner_id);

-- 3. Trigger to create logistics job automatically when order is ready_for_pickup
CREATE OR REPLACE FUNCTION public.handle_order_ready()
RETURNS TRIGGER AS $$
DECLARE
    seller_loc TEXT;
BEGIN
    IF NEW.status = 'ready_for_pickup' AND OLD.status != 'ready_for_pickup' THEN
        -- Get the seller's location from the first listing in the order
        SELECT l.location_name INTO seller_loc
        FROM public.order_items oi
        JOIN public.listings l ON oi.listing_id = l.id
        WHERE oi.order_id = NEW.id
        LIMIT 1;

        -- Create pending logistics job
        INSERT INTO public.logistics_jobs (
            order_id, 
            pickup_location, 
            drop_location, 
            status
        ) VALUES (
            NEW.id,
            COALESCE(seller_loc, 'Unknown Pickup Location'),
            COALESCE(NEW.delivery_address, 'Unknown Drop Location'),
            'pending'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_ready
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_ready();
