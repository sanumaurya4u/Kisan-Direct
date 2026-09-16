# Kisan Direct — Design System

## 1. Design Direction

Kisan Direct should feel:

- Trustworthy.
- Agricultural.
- Modern.
- Professional.
- Accessible.
- Clean.
- Data-driven.

Avoid making it look like a generic grocery e-commerce site.

The visual language should communicate:

```text
Agriculture
+
Technology
+
Trust
+
Transparency
+
Logistics
```

---

# 2. Theme

Primary theme:

**Modern Natural + Enterprise Dashboard**

Use a light-first interface with optional dark-mode support only if it can be implemented without compromising MVP speed.

---

# 3. Color System

Use CSS variables/Tailwind tokens rather than hard-coding colors throughout components.

### Primary

```text
Agriculture Green
#166534
```

### Primary Light

```text
#DCFCE7
```

### Secondary

```text
Earth / Warm Amber
#D97706
```

### Background

```text
#F8FAFC
```

### Surface

```text
#FFFFFF
```

### Text

```text
Primary: #0F172A
Secondary: #475569
Muted: #64748B
```

### Semantic

```text
Success: #16A34A
Warning: #D97706
Danger: #DC2626
Info: #2563EB
```

Do not scatter arbitrary colors. Use the design tokens consistently.

---

# 4. Typography

Preferred font:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

### Scale

```text
Display: 40–48px
H1: 32px
H2: 24px
H3: 20px
Body: 16px
Small: 14px
Caption: 12px
```

Use responsive sizing where appropriate.

---

# 5. Layout

Desktop dashboard:

```text
┌───────────────────────────────────────────────┐
│ Header                                        │
├────────────┬──────────────────────────────────┤
│ Sidebar    │ Main Content                     │
│            │                                  │
│ Dashboard  │ Page Header                      │
│ Marketplace│                                  │
│ Orders     │ Cards / Charts / Tables          │
│ Logistics  │                                  │
│ Analytics  │                                  │
└────────────┴──────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│ Main Content        │
│                     │
│ Cards               │
│ Charts              │
│ Lists               │
└─────────────────────┘
```

Use a responsive sidebar/drawer.

---

# 6. Navigation

### Public

```text
Home
Marketplace
How It Works
About
Login
Register
```

### Farmer/FPO

```text
Dashboard
My Produce
Marketplace
Orders
Logistics
Demand Insights
Earnings
Profile
```

### Consumer

```text
Home
Marketplace
Orders
Track Delivery
Profile
```

### Bulk Buyer

```text
Dashboard
Find Produce
My Requirements
Orders
Logistics
Profile
```

### Logistics

```text
Dashboard
Jobs
Routes
Vehicles
History
Profile
```

### Admin

```text
Overview
Users
Marketplace
Orders
Logistics
Demand & Supply
Forecasts
Reports
Settings
```

---

# 7. Components

Create reusable components:

```text
Button
Input
Select
Textarea
Modal
Dialog
Card
Badge
Table
DataTable
Tabs
Dropdown
Toast
Alert
Skeleton
EmptyState
ErrorState
Pagination
SearchBar
FilterBar
StatCard
ChartCard
MapCard
```

Do not rebuild these separately on every page.

---

# 8. Marketplace Cards

Product cards should show:

```text
[Image]

Tomato
Grade A

₹32/kg

Available: 1,500 kg

Farmer/FPO
Location

[View Details]
```

Keep the primary CTA clear.

---

# 9. Dashboard Cards

Example:

```text
┌────────────────────────┐
│ Total Produce          │
│ 24.8 T                 │
│ ↑ 12%                  │
└────────────────────────┘
```

Use semantic indicators rather than decorative noise.

---

# 10. AI Insight Component

AI recommendations should visually differ from ordinary data.

Example:

```text
┌─────────────────────────────────┐
│ ✨ AI Market Insight            │
│                                 │
│ Tomato demand may increase      │
│ during the next forecast period.│
│                                 │
│ Recommendation: prepare supply  │
│ for upcoming buyer demand.      │
│                                 │
│ Based on: 90 days of demo data  │
└─────────────────────────────────┘
```

Always provide an understandable basis when possible.

---

# 11. Price Transparency Component

```text
Transaction Price
₹32/kg

Farmer/FPO realization
₹27/kg

Estimated logistics
₹4/kg

Platform/service
₹1/kg
```

Use labels such as:

```text
Estimated
```

where values are not actual settled amounts.

---

# 12. Status Badges

Use consistent status labels:

```text
Pending
Accepted
Processing
Ready
In Transit
Delivered
Completed
Cancelled
Rejected
```

Status colors should be semantic and accessible.

Do not rely on color alone; include text.

---

# 13. Forms

Forms should:

- Use clear labels.
- Show required fields.
- Validate inline.
- Explain errors.
- Preserve entered data when possible.
- Disable submit during processing.
- Show success confirmation.

---

# 14. Maps

Map cards should show:

- Pickup marker.
- Destination marker.
- Route line.
- Distance.
- Estimated travel time.
- Vehicle information.

Always distinguish:

```text
Live route
```

from

```text
Demo/estimated route
```

when applicable.

---

# 15. Charts

Preferred charts:

- Line chart → demand forecast.
- Bar chart → supply vs demand.
- Donut chart → order status.
- Area chart → produce volume over time.

Charts must have:

- Clear labels.
- Units.
- Time range.
- Empty state.
- Accessible textual summary.

---

# 16. Imagery

Use agricultural imagery sparingly.

Prefer:

- Realistic farm imagery.
- Produce photography.
- Subtle agricultural textures.

Do not make the interface visually crowded.

---

# 17. Motion

Use subtle transitions:

```text
150–250ms
```

Avoid:

- Excessive animation.
- Large parallax effects.
- Constant motion.
- Animation that interferes with data entry.

---

# 18. Accessibility

Target WCAG-conscious design:

- Keyboard navigation.
- Visible focus.
- Sufficient contrast.
- Semantic HTML.
- Labels for forms.
- Alt text for meaningful images.
- Do not rely only on color.
- Reasonable touch targets.

---

# 19. Responsive Breakpoints

Use Tailwind's responsive system.

Design for:

```text
Mobile
Tablet
Laptop
Desktop
```

Farmer and logistics interfaces should be particularly mobile-friendly.

---

# 20. Brand Tone

UI copy should be:

- Simple.
- Direct.
- Trustworthy.
- Farmer-friendly.

Prefer:

```text
Add Produce
```

instead of:

```text
Initialize Inventory Asset
```

Prefer:

```text
Find Buyers
```

instead of:

```text
Initiate Demand Discovery
```

---

# 21. Design Principle

> **Make agricultural trade data easy to understand, even for a user who is not technically experienced.**
