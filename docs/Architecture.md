# Kisan Direct — Architecture

## 1. Architecture Goal

Build a modular, secure and simple architecture suitable for an SIH 2026 MVP, using free/open-source or free-tier services wherever practical.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| UI Icons | Lucide React |
| Routing | React Router |
| Data Fetching | TanStack Query |
| Forms | React Hook Form |
| Validation | Zod |
| Backend | Supabase |
| Database | PostgreSQL via Supabase |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Server Logic | Supabase Edge Functions where required |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| AI/Forecast API | Python/FastAPI or a free-tier AI/API option where available |
| Optimization | OR-Tools where server-side optimization is required |
| Deployment | Vercel |
| Version Control | Git + GitHub |
| Development | Google Antigravity |

Use free tiers/open-source options first. Verify current limits before deployment because provider pricing and quotas can change.

---

## 3. High-Level Architecture

```text
                    KISAN DIRECT
                         |
                React Web Application
                         |
              React Router + Auth Guard
                         |
       +-----------------+-----------------+
       |                 |                 |
  Marketplace       Logistics          Dashboards
       |                 |                 |
       +-----------------+-----------------+
                         |
                 Service / Query Layer
                         |
                    Supabase Client
                         |
              +----------+----------+
              |                     |
          Supabase Auth         PostgreSQL
                                    |
                         +----------+----------+
                         |                     |
                    RLS Policies          Storage
                         |
                 Edge Functions / APIs
                         |
             +-----------+------------+
             |                        |
        AI Forecasting          Route Optimization
```

---

## 4. Application Flow

### Entry

```text
Landing Page
→ Browse public marketplace (where allowed)
→ Login/Register
→ Role-based Dashboard
```

### Role Routing

```text
Farmer/FPO       → Producer Dashboard
Consumer         → Consumer Marketplace
Bulk Buyer       → Buyer Dashboard
Logistics        → Logistics Dashboard
Admin            → Admin Dashboard
```

The frontend must never rely only on hidden UI elements for authorization. Database RLS is the final protection.

---

## 5. Recommended Folder Structure

```text
kisan-direct/
├── public/
│   ├── favicon.svg
│   └── assets/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── marketplace/
│   │   ├── orders/
│   │   ├── logistics/
│   │   ├── charts/
│   │   └── common/
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── farmer/
│   │   ├── fpo/
│   │   ├── consumer/
│   │   ├── buyer/
│   │   ├── logistics/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── marketplace/
│   │   ├── orders/
│   │   ├── matching/
│   │   ├── logistics/
│   │   ├── forecasting/
│   │   └── admin/
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── marketplace.service.ts
│   │   ├── orders.service.ts
│   │   ├── logistics.service.ts
│   │   ├── matching.service.ts
│   │   └── forecast.service.ts
│   │
│   ├── types/
│   ├── routes/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   │   ├── demand-forecast/
│   │   └── route-optimization/
│   └── seed.sql
│
├── docs/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Rules.md
│   ├── Phases.md
│   ├── Design.md
│   └── Database.md
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 6. Supabase Connection

Create a Supabase project using the free tier.

Frontend environment variables:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Use only the public/anon key in the browser.

Never expose:

- service role key
- database password
- private AI API key
- private server secrets

Server-side secrets belong in Supabase Edge Function secrets or the relevant deployment secret manager.

---

## 7. Supabase Client

Create one client:

```text
src/lib/supabase.ts
```

Use it from service/query layers rather than creating multiple clients throughout components.

---

## 8. Data Access Pattern

Preferred:

```text
Page
 ↓
Feature hook
 ↓
Service/query function
 ↓
Supabase
 ↓
PostgreSQL + RLS
```

Avoid placing large database queries directly inside UI components.

---

## 9. AI Integration

AI is a decision-support layer.

```text
Frontend
 ↓
forecast.service
 ↓
Supabase Edge Function / FastAPI
 ↓
Forecast model
 ↓
Forecast result
 ↓
Database
 ↓
Dashboard
```

For the first MVP, use a simple statistical/ML model with explainable inputs. Do not claim an AI model is accurate without validation.

---

## 10. Route Optimization

```text
Orders
+
Pickup locations
+
Drop locations
+
Vehicle capacity
+
Delivery constraints
 ↓
Optimization service
 ↓
Optimized route
 ↓
Map visualization
```

Use Leaflet for visualization and OR-Tools/server-side logic for optimization where feasible.

---

## 11. Error Handling

All async operations should provide:

```text
Loading
Empty
Success
Error
Retry
```

Database/API errors should be logged safely without exposing secrets or sensitive information.

---

## 12. Deployment Flow

```text
Local Development
 ↓
Git
 ↓
GitHub
 ↓
Vercel
 ↓
Production React App

Supabase
 ↓
Production Database/Auth/Storage
```

Use separate environment values for local and production environments.

---

## 13. Antigravity + Supabase MCP

Google Antigravity should be used as the primary development environment.

Supabase MCP may be used for:

- Inspecting database schema.
- Creating/altering tables.
- Applying migrations.
- Inspecting RLS policies.
- Testing database queries.
- Managing development data.

AI agents must follow `Database.md` and `Rules.md` before modifying the database.

Prefer migrations that are version-controlled in:

```text
supabase/migrations/
```

Do not rely on undocumented manual dashboard changes for important schema changes.

---

## 14. Architecture Principles

1. Modular.
2. Type-safe.
3. RLS-first security.
4. Mobile-responsive.
5. Explainable AI.
6. Free-tier conscious.
7. API/provider abstraction.
8. Minimal dependencies.
9. Graceful degradation when external services are unavailable.
10. Demo reliability over unnecessary complexity.
