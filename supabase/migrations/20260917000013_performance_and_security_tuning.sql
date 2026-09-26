-- Migration 13: Performance Indexes & Security Hardening
-- 1. Foreign Key Covering Indexes
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_buyer_id ON public.buyer_requirements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_product_id ON public.buyer_requirements(product_id);

CREATE INDEX IF NOT EXISTS idx_demand_forecasts_product_id ON public.demand_forecasts(product_id);

CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_product_id ON public.listings(product_id);

CREATE INDEX IF NOT EXISTS idx_logistics_jobs_order_id ON public.logistics_jobs(order_id);
CREATE INDEX IF NOT EXISTS idx_logistics_jobs_vehicle_id ON public.logistics_jobs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_logistics_jobs_partner_id ON public.logistics_jobs(logistics_partner_id);

CREATE INDEX IF NOT EXISTS idx_matches_requirement_id ON public.matches(requirement_id);
CREATE INDEX IF NOT EXISTS idx_matches_listing_id ON public.matches(listing_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_listing_id ON public.order_items(listing_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_requirement_id ON public.orders(requirement_id);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);

CREATE INDEX IF NOT EXISTS idx_routes_logistics_job_id ON public.routes(logistics_job_id);

CREATE INDEX IF NOT EXISTS idx_vehicles_owner_id ON public.vehicles(owner_id);

-- 2. Security: Set search_path on all SECURITY DEFINER functions to prevent path hijacking
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.get_current_user_role() SET search_path = public;
ALTER FUNCTION public.accept_order(UUID) SET search_path = public;
ALTER FUNCTION public.handle_order_ready() SET search_path = public;
ALTER FUNCTION public.notify_seller_on_new_order() SET search_path = public;
ALTER FUNCTION public.notify_buyer_on_order_update() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
