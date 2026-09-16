# Kisan Direct — Development Phases

## Development Strategy

Kisan Direct must be built incrementally. Google Antigravity should work on **one phase at a time**.

Do not ask the AI agent to build the entire application in one prompt.

Each phase should finish with a working, testable application.

---

# Phase 0 — Project Foundation

### Goal

Create the base application.

### Tasks

- Initialize React + Vite + TypeScript.
- Configure Tailwind CSS.
- Configure routing.
- Create base layout.
- Create reusable UI components.
- Configure ESLint/type checking.
- Create `.env.example`.
- Connect Supabase client.
- Create initial documentation folder.

### Deliverable

Application starts successfully and connects to Supabase.

---

# Phase 1 — Authentication & Roles

### Goal

Build secure authentication.

### Tasks

- Supabase Auth.
- Login.
- Registration.
- Logout.
- Profile creation.
- Role selection.
- Protected routes.
- Role-based dashboard routing.

### Roles

```text
Farmer
FPO
Consumer
Bulk Buyer
Logistics Partner
Admin
```

### Deliverable

A user can authenticate and reach the correct dashboard.

---

# Phase 2 — Farmer/FPO Module

### Goal

Allow producers to publish agricultural produce.

### Tasks

- Producer dashboard.
- Add produce.
- Edit listing.
- Delete/deactivate listing.
- Inventory.
- Quantity.
- Price.
- Grade.
- Harvest/availability date.
- Location.
- Product image upload.

### Deliverable

Farmer/FPO can manage live marketplace listings.

---

# Phase 3 — Consumer Marketplace

### Goal

Create the direct marketplace.

### Tasks

- Product grid/list.
- Search.
- Filters.
- Product details.
- Seller/FPO information.
- Availability.
- Cart/order creation.
- Order history.

### Deliverable

Consumer can discover and order produce.

---

# Phase 4 — Bulk Buyer Module

### Goal

Enable demand-side procurement.

### Tasks

- Buyer dashboard.
- Create bulk requirement.
- Quantity.
- Product.
- Target location.
- Target date.
- Expected/max price.
- Requirement status.
- Requirement history.

### Deliverable

Bulk buyers can publish demand.

---

# Phase 5 — Matching Engine

### Goal

Connect supply to demand.

### Tasks

- Product matching.
- Quantity matching.
- Location distance.
- Price compatibility.
- Availability compatibility.
- Explainable match score.
- Match result UI.

### Example

```text
Match Score: 91%

Why?
✓ Product matches
✓ Quantity available
✓ Within target distance
✓ Price within range
```

### Deliverable

A buyer can discover suitable farmer/FPO listings.

---

# Phase 6 — Order Management

### Goal

Create reliable transaction workflows.

### Tasks

- Order creation.
- Order items.
- Seller acceptance/rejection.
- Buyer cancellation where permitted.
- Status tracking.
- Order history.
- Notifications.

### Status

```text
Pending
→ Accepted
→ Processing
→ Ready for Pickup
→ In Transit
→ Delivered
→ Completed
```

### Deliverable

End-to-end order lifecycle works.

---

# Phase 7 — Logistics Module

### Goal

Coordinate transportation.

### Tasks

- Vehicle registration.
- Vehicle capacity.
- Availability.
- Logistics job.
- Pickup/drop location.
- Assignment.
- Delivery status.
- Basic map.

### Deliverable

A completed order can generate and track a logistics job.

---

# Phase 8 — Route Optimization

### Goal

Optimize delivery routes.

### Tasks

- Collect pickup/drop points.
- Vehicle capacity.
- Delivery constraints.
- Calculate route.
- Display route on map.
- Show distance/time estimate.
- Support fallback demo route.

### Deliverable

The demo can show a measurable route optimization scenario.

---

# Phase 9 — AI Demand Forecasting

### Goal

Add demand intelligence.

### Tasks

- Prepare historical demo data.
- Define product/region/time features.
- Build baseline forecast.
- Add ML model if justified.
- Generate forecast.
- Store forecast.
- Dashboard visualization.
- Recommendation engine.

### Deliverable

Example:

```text
Tomato demand:
Current: 12.4 tonnes
Forecast: 14.7 tonnes
Trend: Increasing
```

---

# Phase 10 — Price Transparency & Smart Selling

### Goal

Help users understand the transaction economics.

### Tasks

- Price breakdown.
- Estimated logistics.
- Estimated platform/service cost if configured.
- Net farmer realization.
- Sell Smart recommendation.
- Clearly label estimates.

### Deliverable

Users can understand the expected economics of a transaction.

---

# Phase 11 — Admin Dashboard

### Goal

Provide centralized operational visibility.

### Tasks

- User counts.
- Produce volume.
- Orders.
- Buyers.
- Farmers/FPOs.
- Logistics jobs.
- Supply-demand charts.
- Forecast overview.
- Reports/issues.

### Deliverable

Admin can monitor the platform.

---

# Phase 12 — Notifications & Reliability

### Goal

Improve operational usability.

### Tasks

- In-app notifications.
- Order status notifications.
- Match notifications.
- Logistics notifications.
- Error handling.
- Empty states.
- Loading states.
- Retry mechanisms.

### Deliverable

The application feels complete and resilient.

---

# Phase 13 — Security & RLS Audit

### Goal

Verify Supabase security.

### Tasks

- Review every table.
- Enable RLS.
- Test SELECT policies.
- Test INSERT policies.
- Test UPDATE policies.
- Test DELETE policies.
- Test role restrictions.
- Check storage policies.
- Check server-side secrets.

### Deliverable

Unauthorized users cannot access protected records.

---

# Phase 14 — UI/UX Polish

### Goal

Prepare the application for judging.

### Tasks

- Responsive design.
- Accessibility improvements.
- Consistent spacing.
- Loading skeletons.
- Error messages.
- Empty states.
- Dashboard polish.
- Charts.
- Map polish.
- Navigation polish.

### Deliverable

Professional and consistent interface.

---

# Phase 15 — Demo & Deployment

### Goal

Prepare the SIH demo.

### Tasks

- Seed demo accounts/data.
- Verify end-to-end flow.
- Deploy frontend.
- Configure Supabase production settings.
- Test production environment.
- Prepare demo script.
- Prepare fallback screenshots/data.
- Test internet failure scenarios.

### Final Demo Flow

```text
Farmer
→ Add Produce
→ Buyer Requirement
→ AI Matching
→ Order
→ Logistics
→ Optimized Route
→ Delivery
→ Admin Analytics
→ Demand Forecast
```

---

## Phase Completion Rule

Do not start the next phase until:

- Current phase builds successfully.
- Core functionality works.
- No blocking errors remain.
- Relevant RLS/security is implemented.
- Existing features still work.
- Changes are committed to Git.
