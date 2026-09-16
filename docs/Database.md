# Kisan Direct — Database & Supabase RLS

## 1. Database Goal

Use **Supabase PostgreSQL** as the primary application database.

The database must support:

- Authentication.
- Role-based access.
- Farmers/FPOs.
- Buyers.
- Consumers.
- Produce listings.
- Inventory.
- Requirements.
- Matching.
- Orders.
- Logistics.
- Vehicles.
- Routes.
- Forecasts.
- Notifications.
- Reviews.
- Administrative analytics.

---

# 2. Database Principles

1. PostgreSQL is the source of truth for transactional data.
2. Every protected table must use RLS.
3. `auth.users` manages authentication identity.
4. Application profile data belongs in application tables.
5. Do not store unnecessary sensitive identity information.
6. Foreign keys should enforce relationships.
7. Use timestamps for auditability.
8. Use enums/check constraints where they improve data integrity.
9. Important schema changes should be version-controlled migrations.
10. Service-role access must remain server-side.

---

# 3. Authentication Model

Supabase Auth:

```text
auth.users
     |
     v
profiles
     |
     +---- role
     |
     +---- farmer_profile
     +---- fpo_profile
     +---- buyer_profile
     +---- logistics_profile
```

Consumers may only require the common profile initially.

---

# 4. Main Tables

## 4.1 profiles

```text
id UUID PK → auth.users.id
full_name TEXT
phone TEXT nullable
email TEXT nullable
role TEXT
avatar_url TEXT nullable
is_active BOOLEAN
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Role:

```text
farmer
fpo
consumer
bulk_buyer
logistics_partner
admin
```

Do not allow ordinary users to arbitrarily update their own role.

---

## 4.2 farmer_profiles

```text
id UUID PK
user_id UUID FK profiles.id UNIQUE
farm_name TEXT nullable
location_name TEXT
latitude NUMERIC nullable
longitude NUMERIC nullable
verification_status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## 4.3 fpo_profiles

```text
id UUID PK
user_id UUID FK profiles.id UNIQUE
organization_name TEXT
description TEXT nullable
location_name TEXT
latitude NUMERIC nullable
longitude NUMERIC nullable
verification_status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## 4.4 buyer_profiles

```text
id UUID PK
user_id UUID FK profiles.id UNIQUE
business_name TEXT
buyer_type TEXT
location_name TEXT
latitude NUMERIC nullable
longitude NUMERIC nullable
verification_status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## 4.5 logistics_profiles

```text
id UUID PK
user_id UUID FK profiles.id UNIQUE
company_name TEXT nullable
service_area TEXT nullable
verification_status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 5. Marketplace Tables

## 5.1 product_categories

```text
id UUID PK
name TEXT UNIQUE
description TEXT nullable
created_at TIMESTAMPTZ
```

---

## 5.2 products

This is the master product catalog.

```text
id UUID PK
category_id UUID FK
name TEXT
description TEXT nullable
unit TEXT
created_at TIMESTAMPTZ
```

Example:

```text
Tomato
Potato
Onion
Wheat
Rice
```

---

## 5.3 listings

A seller's marketplace listing.

```text
id UUID PK
seller_id UUID FK profiles.id
product_id UUID FK products.id
quantity NUMERIC
available_quantity NUMERIC
price_per_unit NUMERIC
grade TEXT nullable
harvest_date DATE nullable
available_from DATE nullable
location_name TEXT
latitude NUMERIC nullable
longitude NUMERIC nullable
image_url TEXT nullable
status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Status:

```text
active
paused
sold_out
expired
```

---

# 6. Bulk Requirements

## 6.1 buyer_requirements

```text
id UUID PK
buyer_id UUID FK profiles.id
product_id UUID FK products.id
required_quantity NUMERIC
remaining_quantity NUMERIC
target_price_per_unit NUMERIC nullable
target_location TEXT
target_latitude NUMERIC nullable
target_longitude NUMERIC nullable
required_by DATE
status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Status:

```text
open
partially_fulfilled
fulfilled
cancelled
expired
```

---

# 7. Matching

## 7.1 matches

```text
id UUID PK
requirement_id UUID FK buyer_requirements.id
listing_id UUID FK listings.id
match_score NUMERIC
product_score NUMERIC
quantity_score NUMERIC
distance_score NUMERIC
price_score NUMERIC
availability_score NUMERIC
explanation JSONB
status TEXT
created_at TIMESTAMPTZ
```

`explanation` may contain:

```json
{
  "reasons": [
    "Product matches",
    "Quantity available",
    "Within target distance",
    "Price within target"
  ]
}
```

---

# 8. Orders

## 8.1 orders

```text
id UUID PK
buyer_id UUID FK profiles.id
seller_id UUID FK profiles.id
requirement_id UUID FK buyer_requirements.id nullable
subtotal NUMERIC
estimated_logistics_cost NUMERIC nullable
platform_fee NUMERIC nullable
total_amount NUMERIC
currency TEXT DEFAULT 'INR'
delivery_address TEXT
delivery_latitude NUMERIC nullable
delivery_longitude NUMERIC nullable
status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Status:

```text
pending
accepted
rejected
processing
ready_for_pickup
in_transit
delivered
completed
cancelled
```

---

## 8.2 order_items

```text
id UUID PK
order_id UUID FK orders.id
listing_id UUID FK listings.id
product_id UUID FK products.id
quantity NUMERIC
unit_price NUMERIC
total_price NUMERIC
created_at TIMESTAMPTZ
```

---

# 9. Logistics

## 9.1 vehicles

```text
id UUID PK
owner_id UUID FK profiles.id
vehicle_number TEXT
vehicle_type TEXT
capacity_kg NUMERIC
current_latitude NUMERIC nullable
current_longitude NUMERIC nullable
availability_status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

## 9.2 logistics_jobs

```text
id UUID PK
order_id UUID FK orders.id
vehicle_id UUID FK vehicles.id nullable
logistics_partner_id UUID FK profiles.id nullable
pickup_location TEXT
pickup_latitude NUMERIC nullable
pickup_longitude NUMERIC nullable
drop_location TEXT
drop_latitude NUMERIC nullable
drop_longitude NUMERIC nullable
estimated_distance_km NUMERIC nullable
estimated_duration_minutes INTEGER nullable
status TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Status:

```text
pending
assigned
picked_up
in_transit
delivered
cancelled
```

---

## 9.3 routes

```text
id UUID PK
logistics_job_id UUID FK logistics_jobs.id
route_geometry JSONB nullable
distance_km NUMERIC
duration_minutes INTEGER
optimization_method TEXT
is_demo BOOLEAN DEFAULT false
created_at TIMESTAMPTZ
```

---

# 10. AI Forecasting

## 10.1 demand_forecasts

```text
id UUID PK
product_id UUID FK products.id
region TEXT
forecast_date DATE
forecast_period_start DATE
forecast_period_end DATE
predicted_quantity NUMERIC
unit TEXT
confidence NUMERIC nullable
model_name TEXT
input_summary JSONB
is_demo BOOLEAN DEFAULT true
created_at TIMESTAMPTZ
```

Do not expose private model details or sensitive information unnecessarily.

---

# 11. Notifications

## 11.1 notifications

```text
id UUID PK
user_id UUID FK profiles.id
title TEXT
message TEXT
type TEXT
reference_id UUID nullable
is_read BOOLEAN DEFAULT false
created_at TIMESTAMPTZ
```

---

# 12. Reviews

## 12.1 reviews

```text
id UUID PK
order_id UUID FK orders.id
reviewer_id UUID FK profiles.id
reviewee_id UUID FK profiles.id
rating INTEGER
comment TEXT nullable
created_at TIMESTAMPTZ
```

Constraints:

```text
rating BETWEEN 1 AND 5
```

Prevent duplicate reviews for the same reviewer/order/reviewee combination where appropriate.

---

# 13. Reports / Issues

## 13.1 reports

```text
id UUID PK
reporter_id UUID FK profiles.id
order_id UUID FK orders.id nullable
type TEXT
description TEXT
status TEXT
admin_notes TEXT nullable
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

---

# 14. Storage

Recommended Supabase Storage buckets:

```text
product-images
avatars
documents
```

Keep private documents in a private bucket.

Public product images may use a public bucket only if there is no sensitive content.

Storage policies must also be considered part of the security model.

---

# 15. RLS Strategy

## Golden Rule

> A user should only be able to access data they are authorized to access.

---

## 15.1 profiles

### User

Can:

- Read own profile.
- Update allowed profile fields.

Cannot:

- Change own role.
- Read arbitrary private profiles unless the application requires it.

### Admin

Can:

- Read/manage platform profiles as required.

---

## 15.2 listings

### Public/Marketplace

Can read:

```text
active listings
```

### Seller

Can:

- Create own listing.
- Read own listings.
- Update own listings.
- Deactivate own listings.

Cannot:

- Modify another seller's listing.

### Admin

Can manage listings.

---

## 15.3 buyer_requirements

### Buyer

Can:

- Create own requirements.
- Read own requirements.
- Update/cancel own requirements.

### Producers

Can read open requirements where the marketplace requires discovery.

### Admin

Can manage.

---

## 15.4 orders

### Buyer

Can read orders where:

```text
orders.buyer_id = auth.uid()
```

### Seller

Can read orders where:

```text
orders.seller_id = auth.uid()
```

### Logistics partner

Should only access logistics/order information necessary for assigned jobs.

### Admin

Can access operational records as required.

---

## 15.5 vehicles

### Logistics partner

Can CRUD only their own vehicles.

### Admin

Can manage all vehicles.

---

## 15.6 logistics_jobs

A logistics partner can access jobs assigned to them.

Buyers/sellers can access jobs connected to their orders.

Admins can manage all jobs.

---

## 15.7 demand_forecasts

Forecasts intended for marketplace users may be readable according to application requirements.

Only authorized server-side processes/admin roles should create or modify official forecast records.

---

# 16. Recommended Helper Functions

Supabase PostgreSQL helper functions may be used for:

```text
get_current_user_role()
is_admin()
is_order_participant(order_id)
```

Keep authorization logic centralized where practical.

---

# 17. Important RLS Warning

Do not create policies such as:

```sql
USING (true)
```

for sensitive tables merely to make the application work.

If a table must be public-readable, explicitly limit what is exposed.

---

# 18. Indexes

Recommended indexes:

```text
profiles(role)

listings(seller_id)
listings(product_id)
listings(status)
listings(location_name)

buyer_requirements(buyer_id)
buyer_requirements(product_id)
buyer_requirements(status)

orders(buyer_id)
orders(seller_id)
orders(status)

order_items(order_id)

vehicles(owner_id)
vehicles(availability_status)

logistics_jobs(order_id)
logistics_jobs(logistics_partner_id)
logistics_jobs(status)

demand_forecasts(product_id, region, forecast_date)
```

Add geospatial indexing only if/when the implementation actually uses PostGIS.

---

# 19. Transaction Integrity

Order creation should avoid overselling.

When an order is accepted:

```text
Check available_quantity
→ Reserve/decrement quantity atomically
→ Create order
→ Create order_items
```

Do not depend solely on frontend checks.

Use database functions/transactions where concurrency requires them.

---

# 20. Data Lifecycle

Potential lifecycle:

```text
Listing created
→ Active
→ Partially sold
→ Sold out
→ Archived/expired
```

Orders should remain for reporting/history rather than being casually deleted.

Use status changes for business lifecycle.

---

# 21. Seed Data

Create demo data for:

- Farmers.
- FPOs.
- Consumers.
- Bulk buyers.
- Logistics partners.
- Products.
- Listings.
- Requirements.
- Orders.
- Vehicles.
- Forecasts.

All seed/demo data should be clearly identified as demo data where appropriate.

---

# 22. Supabase MCP Workflow

When using Supabase MCP in Google Antigravity:

```text
1. Inspect existing schema.
2. Read Database.md.
3. Create/modify migration.
4. Apply migration.
5. Verify tables.
6. Verify foreign keys.
7. Verify indexes.
8. Verify RLS enabled.
9. Verify policies.
10. Test authenticated access.
11. Test unauthorized access.
12. Update Database.md if schema intentionally changes.
```

Do not make uncontrolled schema changes through an AI agent.

---

# 23. Database Definition of Done

Database implementation is complete when:

- All required tables exist.
- Foreign keys work.
- Constraints exist.
- Indexes exist for important query paths.
- RLS is enabled on protected tables.
- Policies work for every role.
- Storage policies work.
- Seed data loads successfully.
- No secrets are stored in database source files.
- Order quantity cannot be incorrectly oversold through normal concurrent flows.
- AI/forecast data is labeled appropriately.
