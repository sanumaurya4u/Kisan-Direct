-- 1. Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    requirement_id UUID REFERENCES public.buyer_requirements(id) ON DELETE SET NULL,
    subtotal NUMERIC NOT NULL,
    estimated_logistics_cost NUMERIC,
    platform_fee NUMERIC,
    total_amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    delivery_address TEXT,
    delivery_latitude NUMERIC,
    delivery_longitude NUMERIC,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'processing', 'ready_for_pickup', 'in_transit', 'delivered', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create order_items table
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.listings(id) ON DELETE RESTRICT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity NUMERIC NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders RLS
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Participants can update their orders"
    ON public.orders FOR UPDATE
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
    WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Order Items RLS
CREATE POLICY "Users can view their own order items"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
        )
    );

CREATE POLICY "Buyers can insert order items"
    ON public.order_items FOR INSERT
    WITH CHECK (
        order_id IN (
            SELECT id FROM public.orders WHERE buyer_id = auth.uid()
        )
    );

-- 3. Atomic accept_order function
CREATE OR REPLACE FUNCTION public.accept_order(target_order_id UUID)
RETURNS VOID AS $$
DECLARE
    item RECORD;
    current_available NUMERIC;
BEGIN
    -- Check if order is pending
    IF NOT EXISTS (SELECT 1 FROM public.orders WHERE id = target_order_id AND status = 'pending') THEN
        RAISE EXCEPTION 'Order is not in pending state or does not exist.';
    END IF;

    -- Ensure caller is the seller
    IF NOT EXISTS (SELECT 1 FROM public.orders WHERE id = target_order_id AND seller_id = auth.uid()) THEN
        RAISE EXCEPTION 'Not authorized to accept this order.';
    END IF;

    -- Iterate through items and deduct quantity
    FOR item IN SELECT listing_id, quantity FROM public.order_items WHERE order_id = target_order_id LOOP
        -- Lock row for update
        SELECT available_quantity INTO current_available 
        FROM public.listings 
        WHERE id = item.listing_id 
        FOR UPDATE;

        IF current_available < item.quantity THEN
            RAISE EXCEPTION 'Insufficient quantity available for listing %', item.listing_id;
        END IF;

        UPDATE public.listings 
        SET available_quantity = available_quantity - item.quantity,
            status = CASE WHEN available_quantity - item.quantity <= 0 THEN 'sold_out' ELSE status END
        WHERE id = item.listing_id;
    END LOOP;

    -- Update order status
    UPDATE public.orders 
    SET status = 'accepted', updated_at = now()
    WHERE id = target_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
