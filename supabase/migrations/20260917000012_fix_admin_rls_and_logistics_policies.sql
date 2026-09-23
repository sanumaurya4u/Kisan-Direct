-- Fix Admin RLS Infinite Recursion and Enable Logistics Access
-- 1. Helper function to check if current user is admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Update Admin policies across tables to use is_admin()
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all listings" ON public.listings;
CREATE POLICY "Admins can view all listings"
    ON public.listings FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all logistics jobs" ON public.logistics_jobs;
CREATE POLICY "Admins can view all logistics jobs"
    ON public.logistics_jobs FOR SELECT
    USING (public.is_admin());

-- 3. Ensure profiles are publicly viewable for marketplace & logistics display
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are publicly viewable" ON public.profiles;
CREATE POLICY "Profiles are publicly viewable"
    ON public.profiles FOR SELECT
    USING (true);

-- 4. Ensure fleet vehicles can be viewed
DROP POLICY IF EXISTS "Logistics partners can view their own vehicles" ON public.vehicles;
CREATE POLICY "Logistics partners can view their own vehicles"
    ON public.vehicles FOR SELECT
    USING (true);

-- 5. Ensure logistics jobs are viewable
DROP POLICY IF EXISTS "Pending or assigned jobs are viewable" ON public.logistics_jobs;
CREATE POLICY "Pending or assigned jobs are viewable"
    ON public.logistics_jobs FOR SELECT
    USING (true);

-- 6. Ensure orders with logistics jobs can be viewed by logistics partners
DROP POLICY IF EXISTS "Logistics partners can view orders with logistics jobs" ON public.orders;
CREATE POLICY "Logistics partners can view orders with logistics jobs"
    ON public.orders FOR SELECT
    USING (
        auth.uid() = buyer_id 
        OR auth.uid() = seller_id 
        OR EXISTS (
            SELECT 1 FROM public.logistics_jobs lj
            WHERE lj.order_id = orders.id
        )
        OR public.is_admin()
    );
