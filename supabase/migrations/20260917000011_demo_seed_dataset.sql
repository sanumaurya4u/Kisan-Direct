-- Phase 15+: Comprehensive SIH 2026 Demo Dataset
-- Seeds all core personas, listings, requirements, orders, vehicles, logistics jobs, forecasts, and notifications.

DO $$
DECLARE
  v_farmer_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_fpo_id UUID    := 'a0000000-0000-0000-0000-000000000002';
  v_buyer_id UUID  := 'a0000000-0000-0000-0000-000000000003';
  v_logistics_id UUID := 'a0000000-0000-0000-0000-000000000004';
  v_admin_id UUID  := 'a0000000-0000-0000-0000-000000000005';
  v_consumer_id UUID := 'a0000000-0000-0000-0000-000000000006';

  v_cat_veg UUID   := '00000000-0000-0000-0000-000000000001';
  v_cat_fruit UUID := '00000000-0000-0000-0000-000000000002';
  v_cat_grain UUID := '00000000-0000-0000-0000-000000000003';

  v_prod_tomato UUID := '11111111-0000-0000-0000-000000000001';
  v_prod_onion  UUID := '11111111-0000-0000-0000-000000000002';
  v_prod_potato UUID := '11111111-0000-0000-0000-000000000003';
  v_prod_apple  UUID := '11111111-0000-0000-0000-000000000004';
  v_prod_mango  UUID := '11111111-0000-0000-0000-000000000005';
  v_prod_wheat  UUID := '11111111-0000-0000-0000-000000000006';
  v_prod_rice   UUID := '11111111-0000-0000-0000-000000000007';

  v_list1 UUID := '22222222-0000-0000-0000-000000000001';
  v_list2 UUID := '22222222-0000-0000-0000-000000000002';
  v_list3 UUID := '22222222-0000-0000-0000-000000000003';
  v_list4 UUID := '22222222-0000-0000-0000-000000000004';
  v_list5 UUID := '22222222-0000-0000-0000-000000000005';
  v_list6 UUID := '22222222-0000-0000-0000-000000000006';

  v_req1 UUID := '33333333-0000-0000-0000-000000000001';
  v_req2 UUID := '33333333-0000-0000-0000-000000000002';
  v_req3 UUID := '33333333-0000-0000-0000-000000000003';

  v_order1 UUID := '44444444-0000-0000-0000-000000000001';
  v_order2 UUID := '44444444-0000-0000-0000-000000000002';
  v_order3 UUID := '44444444-0000-0000-0000-000000000003';

  v_veh1 UUID := '55555555-0000-0000-0000-000000000001';
  v_veh2 UUID := '55555555-0000-0000-0000-000000000002';
  v_veh3 UUID := '55555555-0000-0000-0000-000000000003';

  v_job1 UUID := '66666666-0000-0000-0000-000000000001';
  v_job2 UUID := '66666666-0000-0000-0000-000000000002';
BEGIN

  -- 1. Create Auth Users
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES
    (v_farmer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'farmer@kisandirect.com', crypt('Demo@1234', gen_salt('bf')), now(), '{"provider":"email"}', '{"full_name":"Ramesh Patel (Farmer)","role":"farmer"}', now(), now()),
    (v_fpo_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'fpo@kisandirect.com', crypt('Demo@1234', gen_salt('bf')), now(), '{"provider":"email"}', '{"full_name":"Sahyadri Kisan FPO","role":"fpo"}', now(), now()),
    (v_buyer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'buyer@kisandirect.com', crypt('Demo@1234', gen_salt('bf')), now(), '{"provider":"email"}', '{"full_name":"Arvind Sharma (FreshRetail)","role":"bulk_buyer"}', now(), now()),
    (v_logistics_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'logistics@kisandirect.com', crypt('Demo@1234', gen_salt('bf')), now(), '{"provider":"email"}', '{"full_name":"Vikram Singh (Kisan Express)","role":"logistics_partner"}', now(), now()),
    (v_admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@kisandirect.com', crypt('Demo@1234', gen_salt('bf')), now(), '{"provider":"email"}', '{"full_name":"Dr. Rajesh Verma (SIH Admin)","role":"admin"}', now(), now()),
    (v_consumer_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'consumer@kisandirect.com', crypt('Demo@1234', gen_salt('bf')), now(), '{"provider":"email"}', '{"full_name":"Anita Deshmukh (Consumer)","role":"consumer"}', now(), now())
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('Demo@1234', gen_salt('bf')),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- 2. Update/Insert Profiles
  INSERT INTO public.profiles (id, full_name, email, role, phone)
  VALUES
    (v_farmer_id, 'Ramesh Patel (Farmer)', 'farmer@kisandirect.com', 'farmer', '+91 98220 12345'),
    (v_fpo_id, 'Sahyadri Kisan Producer Co.', 'fpo@kisandirect.com', 'fpo', '+91 94220 54321'),
    (v_buyer_id, 'Arvind Sharma (FreshRetail Corp)', 'buyer@kisandirect.com', 'bulk_buyer', '+91 98110 99887'),
    (v_logistics_id, 'Vikram Singh (Kisan Express)', 'logistics@kisandirect.com', 'logistics_partner', '+91 98765 43210'),
    (v_admin_id, 'Dr. Rajesh Verma (Platform Admin)', 'admin@kisandirect.com', 'admin', '+91 99999 00000'),
    (v_consumer_id, 'Anita Deshmukh (Retail Buyer)', 'consumer@kisandirect.com', 'consumer', '+91 91234 56789')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone;

  -- 3. Role-specific Profiles
  INSERT INTO public.farmer_profiles (user_id, farm_name, location_name, latitude, longitude, verification_status)
  VALUES (v_farmer_id, 'Patel Agro Farms (5.5 Acres)', 'Nashik, Maharashtra', 19.9975, 73.7898, 'verified')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.fpo_profiles (user_id, organization_name, description, location_name, latitude, longitude, verification_status)
  VALUES (v_fpo_id, 'Sahyadri Kisan Producer Co-op', 'Federation of 420 smallholder farmers in Junnar/Pune belt', 'Pune, Maharashtra', 18.5204, 73.8567, 'verified')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.buyer_profiles (user_id, business_name, buyer_type, location_name, latitude, longitude, verification_status)
  VALUES (v_buyer_id, 'FreshRetail Hypermarkets Ltd', 'Retail Chain & Food Processor', 'Azadpur Mandi, Delhi', 28.7041, 77.1025, 'verified')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.logistics_profiles (user_id, company_name, service_area, verification_status)
  VALUES (v_logistics_id, 'Kisan Express Cold-Chain Logistics', 'Delhi NCR, Haryana, Western UP, Punjab Corridor', 'verified')
  ON CONFLICT (user_id) DO NOTHING;

  -- 4. Active Produce Listings
  INSERT INTO public.listings (id, seller_id, product_id, quantity, available_quantity, price_per_unit, grade, harvest_date, available_from, location_name, latitude, longitude, image_url, status)
  VALUES
    (v_list1, v_farmer_id, v_prod_tomato, 50, 45, 2000, 'Grade A (Hybrid Red)', CURRENT_DATE - 2, CURRENT_DATE, 'Nashik, Maharashtra', 19.9975, 73.7898, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60', 'active'),
    (v_list2, v_farmer_id, v_prod_onion, 80, 80, 2400, 'Grade A (Nashik Pink Cured)', CURRENT_DATE - 5, CURRENT_DATE, 'Lasalgaon, Nashik', 20.1472, 74.2272, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60', 'active'),
    (v_list3, v_farmer_id, v_prod_potato, 120, 100, 1500, 'Grade A (Kufri Jyoti)', CURRENT_DATE - 10, CURRENT_DATE, 'Pune, Maharashtra', 18.5204, 73.8567, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60', 'active'),
    (v_list4, v_fpo_id, v_prod_wheat, 250, 250, 2800, 'Sharbati Premium Cleaned', CURRENT_DATE - 15, CURRENT_DATE, 'Sehore, MP / Pune Hub', 23.2032, 77.0844, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60', 'active'),
    (v_list5, v_fpo_id, v_prod_apple, 100, 75, 1200, 'Royal Delicious Grade 1', CURRENT_DATE - 3, CURRENT_DATE, 'Shimla Hub / Delhi Depot', 31.1048, 77.1734, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60', 'active'),
    (v_list6, v_fpo_id, v_prod_rice, 150, 150, 7500, 'Traditional 1121 Basmati Aged', CURRENT_DATE - 30, CURRENT_DATE, 'Karnal, Haryana', 29.6857, 76.9905, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60', 'active')
  ON CONFLICT (id) DO NOTHING;

  -- 5. Buyer Requirements
  INSERT INTO public.buyer_requirements (id, buyer_id, product_id, required_quantity, remaining_quantity, target_price_per_unit, target_location, target_latitude, target_longitude, required_by, status)
  VALUES
    (v_req1, v_buyer_id, v_prod_tomato, 40, 40, 2200, 'Azadpur Mandi, Delhi', 28.7041, 77.1025, CURRENT_DATE + 5, 'open'),
    (v_req2, v_buyer_id, v_prod_onion, 60, 60, 2500, 'Sahibabad Hub, Ghaziabad', 28.6712, 77.3621, CURRENT_DATE + 7, 'open'),
    (v_req3, v_buyer_id, v_prod_wheat, 100, 100, 2900, 'Okhla Industrial Area, Delhi', 28.5355, 77.2699, CURRENT_DATE + 10, 'open')
  ON CONFLICT (id) DO NOTHING;

  -- 6. Orders
  INSERT INTO public.orders (id, buyer_id, seller_id, subtotal, estimated_logistics_cost, platform_fee, total_amount, currency, delivery_address, delivery_latitude, delivery_longitude, status, created_at)
  VALUES
    (v_order1, v_buyer_id, v_farmer_id, 30000, 3200, 0, 33200, 'INR', 'FreshRetail Central Warehouse, Sonipat Kundli Border, Delhi NCR', 28.8955, 77.1105, 'in_transit', now() - interval '1 day'),
    (v_order2, v_buyer_id, v_farmer_id, 15000, 1800, 0, 16800, 'INR', 'FreshRetail Distribution Hub, Vashi, Navi Mumbai', 19.0760, 72.8777, 'ready_for_pickup', now() - interval '4 hours'),
    (v_order3, v_consumer_id, v_farmer_id, 4000, 350, 0, 4350, 'INR', 'Flat 402, Green Meadows, Andheri West, Mumbai', 19.1363, 72.8277, 'delivered', now() - interval '3 days')
  ON CONFLICT (id) DO NOTHING;

  -- Order Items
  INSERT INTO public.order_items (order_id, listing_id, product_id, quantity, unit_price, total_price)
  VALUES
    (v_order1, v_list1, v_prod_tomato, 15, 2000, 30000),
    (v_order2, v_list3, v_prod_potato, 10, 1500, 15000),
    (v_order3, v_list1, v_prod_tomato, 2, 2000, 4000)
  ON CONFLICT (id) DO NOTHING;

  -- 7. Logistics Vehicles
  INSERT INTO public.vehicles (id, owner_id, vehicle_number, vehicle_type, capacity_kg, current_latitude, current_longitude, availability_status)
  VALUES
    (v_veh1, v_logistics_id, 'HR-10-AJ-4491', 'Tata 407 Reefer (Cold Storage)', 4000, 28.8955, 77.1105, 'busy'),
    (v_veh2, v_logistics_id, 'DL-01-LB-8822', 'Mahindra Bolero Maxi Truck Plus', 1500, 28.7041, 77.1025, 'available'),
    (v_veh3, v_logistics_id, 'MH-15-EG-3012', 'Eicher Pro 2049 Insulated', 5000, 19.9975, 73.7898, 'available')
  ON CONFLICT (id) DO NOTHING;

  -- 8. Logistics Jobs
  INSERT INTO public.logistics_jobs (id, order_id, vehicle_id, logistics_partner_id, pickup_location, pickup_latitude, pickup_longitude, drop_location, drop_latitude, drop_longitude, estimated_distance_km, estimated_duration_minutes, status)
  VALUES
    (v_job1, v_order1, v_veh1, v_logistics_id, 'Patel Farms, Sonipat Rural, Haryana', 28.9931, 77.0151, 'FreshRetail Central Warehouse, Delhi NCR', 28.7041, 77.1025, 48, 80, 'in_transit'),
    (v_job2, v_order2, NULL, NULL, 'Patel Agro Hub, Nashik, Maharashtra', 19.9975, 73.7898, 'FreshRetail Distribution Hub, Vashi, Navi Mumbai', 19.0760, 72.8777, 165, 230, 'pending')
  ON CONFLICT (id) DO NOTHING;

  -- 9. Routes
  INSERT INTO public.routes (logistics_job_id, distance_km, duration_minutes, optimization_method, is_demo)
  VALUES
    (v_job1, 48.5, 82, 'Fastest Corridor via NH44 - Capacity Optimized', true)
  ON CONFLICT (id) DO NOTHING;

  -- 10. AI Demand Forecasts
  INSERT INTO public.demand_forecasts (product_id, region, forecast_date, forecast_period_start, forecast_period_end, predicted_quantity, unit, confidence, trend, is_demo)
  VALUES
    (v_prod_tomato, 'Delhi NCR', CURRENT_DATE, CURRENT_DATE, CURRENT_DATE + 30, 4800, 'Quintal', 0.92, 'increasing', true),
    (v_prod_onion, 'Delhi NCR', CURRENT_DATE, CURRENT_DATE, CURRENT_DATE + 30, 6200, 'Quintal', 0.89, 'increasing', true),
    (v_prod_potato, 'Delhi NCR', CURRENT_DATE, CURRENT_DATE, CURRENT_DATE + 30, 8500, 'Quintal', 0.94, 'stable', true),
    (v_prod_wheat, 'Punjab', CURRENT_DATE, CURRENT_DATE, CURRENT_DATE + 30, 14200, 'Quintal', 0.95, 'increasing', true),
    (v_prod_tomato, 'Maharashtra', CURRENT_DATE, CURRENT_DATE, CURRENT_DATE + 30, 9500, 'Quintal', 0.91, 'increasing', true),
    (v_prod_apple, 'Delhi NCR', CURRENT_DATE, CURRENT_DATE, CURRENT_DATE + 30, 3100, 'Box (20kg)', 0.88, 'decreasing', true)
  ON CONFLICT (id) DO NOTHING;

  -- 11. Notifications
  INSERT INTO public.notifications (user_id, title, message, type, is_read, created_at)
  VALUES
    (v_farmer_id, 'New Order Received (#KD1024)', 'Arvind Sharma from FreshRetail placed an order for 15 Quintals of Tomato (₹30,000).', 'order', false, now() - interval '20 minutes'),
    (v_farmer_id, 'High Demand Alert for Tomato', 'AI Market Insight: Regional tomato procurement demand in Delhi NCR is up +18.5%. Prepare additional stock.', 'alert', false, now() - interval '2 hours'),
    (v_buyer_id, 'AI Match Found (Score: 94%)', 'Ramesh Patel in Nashik matched your requirement for 40 Quintals Tomato at ₹2000/Quintal.', 'match', false, now() - interval '1 hour'),
    (v_logistics_id, 'New Dispatch Job Assigned (#LG1024)', 'Shipment #LG1024 is ready for pickup from Sonipat to Delhi Central Hub (48 km).', 'logistics', false, now() - interval '45 minutes'),
    (v_admin_id, 'Platform Milestone: ₹1.42L Traded', 'Daily transaction volume crossed 500 Quintals across Western & Northern corridors.', 'system', false, now() - interval '3 hours')
  ON CONFLICT (id) DO NOTHING;

END $$;
