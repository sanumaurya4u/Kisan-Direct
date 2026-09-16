# Kisan Direct — Product Requirements Document

## 1. Product Overview

**Product Name:** Kisan Direct  
**Category:** Agriculture / FoodTech / Rural Development  
**Problem Statement:** SIH 2026 — PS ID 26033  
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution  
**Department:** Department of Consumer Affairs (DoCA)

### Vision

Kisan Direct is a centralized digital marketplace that reduces unnecessary intermediation in agricultural trade by directly connecting **Farmers/FPOs** with **Consumers and Bulk Buyers**, while providing intelligent logistics coordination, demand forecasting, transparent pricing, and administrative insights.

### Core Value Proposition

> **Connect the right produce to the right buyer at the right time, with transparent pricing and optimized logistics.**

This is an MVP/prototype for SIH 2026. Production integrations such as government identity systems, real payments, verified market feeds, and large-scale logistics APIs must not be fabricated; they can be represented with clearly labeled mock/demo flows.

---

## 2. Problem

The traditional agricultural supply chain may contain multiple intermediaries between producer and final buyer. This can create:

- Lower farmer price realization.
- Higher consumer prices.
- Limited visibility into demand.
- Inefficient transportation.
- Produce spoilage and delayed selling.
- Information asymmetry between producers and buyers.
- Difficulty for small farmers to reach reliable bulk buyers.

Kisan Direct addresses these issues through a centralized digital workflow.

---

## 3. Target Users

### 3.1 Farmer

Needs to:

- List produce.
- Manage quantity and availability.
- Discover buyers.
- Receive orders.
- Request logistics.
- Track sales and earnings.
- View demand insights.

### 3.2 FPO

Acts as an organized producer group.

Needs to:

- Manage aggregated inventory.
- Publish bulk quantities.
- Respond to buyer requirements.
- Coordinate multiple farmers.
- View orders and settlements.

### 3.3 Consumer

Needs to:

- Discover available produce.
- Compare price and availability.
- Place orders.
- Track delivery.
- See transparent seller/product information.

### 3.4 Bulk Buyer

Examples: restaurants, retailers, processors, institutions and other eligible business buyers.

Needs to:

- Post purchase requirements.
- Find matching farmers/FPOs.
- Place bulk orders.
- Coordinate delivery.
- Track order status.

### 3.5 Logistics Partner

Needs to:

- Register available vehicles.
- View assigned jobs.
- Receive pickup/drop locations.
- Update delivery status.

### 3.6 Administrator

Needs to:

- Monitor users, products, orders and logistics.
- Review reported issues.
- View aggregate supply/demand analytics.
- Manage platform configuration.

---

## 4. Product Goals

### Primary Goals

1. Provide a centralized farm-to-market marketplace.
2. Connect farmers/FPOs directly with consumers and bulk buyers.
3. Make agricultural product and price information more transparent.
4. Provide demand forecasting as an AI-assisted decision-support feature.
5. Provide route/logistics optimization as an AI/algorithm-assisted feature.
6. Give administrators a high-level operational dashboard.
7. Build the MVP using free/low-cost tools.

### Non-Goals for MVP

- Becoming a regulated payment institution.
- Replacing all physical intermediaries.
- Real-time nationwide logistics infrastructure.
- Direct government identity verification without authorized access.
- Guaranteed market-price prediction.
- Fully autonomous AI decision making.

---

## 5. MVP Features

### A. Authentication & Roles

- Sign up/login.
- Role selection.
- Role-based routing.
- Farmer, FPO, Consumer, Bulk Buyer, Logistics Partner and Admin roles.
- Protected dashboards.
- Logout and session handling.

### B. Farmer/FPO Marketplace

- Create product listing.
- Product category.
- Quantity.
- Unit.
- Expected/selling price.
- Grade/quality.
- Harvest/availability date.
- Pickup location.
- Product image.
- Inventory management.
- Listing active/inactive state.

### C. Buyer Marketplace

- Browse produce.
- Search and filter.
- View seller/FPO.
- View quantity, price, grade and availability.
- Place order.
- View order history.
- Track order status.

### D. Bulk Buyer Requirements

- Create a requirement.
- Product.
- Required quantity.
- Target location.
- Maximum/expected price.
- Required date.
- Requirement status.
- Matching seller recommendations.

### E. Matching Engine

Match supply and demand using:

- Product compatibility.
- Quantity.
- Distance.
- Price.
- Availability date.
- Seller/buyer reliability data where available.

The initial implementation may use a transparent weighted scoring algorithm rather than a complex ML model.

### F. Logistics

- Vehicle registration.
- Vehicle capacity.
- Availability.
- Pickup/drop details.
- Shipment assignment.
- Delivery status.
- Basic route display.
- Route distance/time estimate.

### G. AI Demand Forecasting

MVP:

- Use historical demo transaction/order data.
- Generate regional/product demand forecasts.
- Display forecast and confidence/quality indicator.
- Provide recommendations.

The UI must distinguish between **forecast/demo data** and verified external market data.

### H. Price Transparency

Show a breakdown where applicable:

- Buyer/consumer price.
- Estimated logistics cost.
- Platform/service cost if configured.
- Farmer/FPO expected net realization.

Any estimated figure must be labeled as estimated.

### I. Admin Dashboard

- Total users.
- Active farmers/FPOs.
- Buyers.
- Orders.
- Produce volume.
- Logistics jobs.
- Supply/demand summary.
- Basic charts.
- Reported issues.

---

## 6. Core User Flows

### Farmer → Buyer

```text
Login
→ Farmer Dashboard
→ Add Produce
→ Publish Listing
→ Buyer discovers listing
→ Buyer places order
→ Farmer accepts
→ Logistics assigned
→ Pickup
→ Delivery
→ Order completed
```

### Bulk Buyer → Farmer/FPO

```text
Login
→ Create Bulk Requirement
→ Matching Engine
→ View Matches
→ Select seller/FPO
→ Confirm order
→ Logistics
→ Delivery
→ Completion
```

### Logistics

```text
Job Created
→ Vehicle Matching
→ Route Generated
→ Driver/Partner Assigned
→ Pickup
→ In Transit
→ Delivered
```

### AI

```text
Historical Orders
+ Current Demand
+ Product/Region
+ Time/Season Features
→ Forecast
→ Dashboard Insight
→ Farmer/Buyer Recommendation
```

---

## 7. Success Metrics for Prototype

The prototype should measure:

- Number of registered users by role.
- Number of active listings.
- Number of matched supply-demand pairs.
- Orders completed.
- Produce volume traded.
- Estimated logistics distance saved.
- Estimated farmer realization.
- Forecast generation success rate.

These are prototype metrics, not claims of real-world impact.

---

## 8. Constraints

- Development budget: **₹0 / no planned investment**.
- Prefer free/open-source tools and free tiers.
- Development environment: **Google Antigravity**.
- Backend/database: **Supabase**.
- Frontend: **React + Vite + TypeScript**.
- Deployment target: **Vercel free tier**, subject to its current limits.
- Maps/routing: prefer OpenStreetMap/Leaflet and free/open routing services for the MVP.
- Secrets must never be committed to Git.

---

## 9. Definition of Done

The MVP is ready for SIH demo when:

- Authentication works for demo roles.
- Farmer can publish produce.
- Buyer can discover/order produce.
- Bulk buyer can create requirements.
- Matching produces explainable matches.
- Logistics job can be assigned and tracked.
- Route can be displayed/calculated.
- Demand forecast can be demonstrated.
- Admin can view platform metrics.
- Supabase RLS prevents unauthorized data access.
- Loading, empty, success and error states exist.
- Application can be deployed and demonstrated reliably.
