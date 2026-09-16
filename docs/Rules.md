# Kisan Direct — AI Development Rules

## 1. Purpose

These rules are mandatory instructions for AI coding agents working on Kisan Direct in Google Antigravity.

The AI must preserve the project's architecture, security, design system, database integrity and SIH problem scope.

---

## 2. Core Rule

> **Do not change existing functionality unless the current phase explicitly requires the change.**

Before modifying code:

1. Inspect the existing implementation.
2. Identify dependencies.
3. Make the smallest required change.
4. Test the affected feature.
5. Do not rewrite unrelated modules.

---

## 3. Approved Core Stack

Prefer:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form
- Zod
- Supabase
- PostgreSQL
- Leaflet
- Recharts
- Lucide React

Use additional libraries only when they solve a clear requirement.

---

## 4. Avoid Unnecessary Libraries

Do not add a library for functionality that can be implemented simply with existing tools.

Avoid:

- Duplicate UI frameworks.
- Multiple state-management libraries.
- Heavy animation libraries for basic transitions.
- Unmaintained packages.
- Paid-only dependencies.
- Libraries that require a paid API for core MVP functionality.

Before adding a dependency, check whether an existing project dependency can solve the problem.

---

## 5. Free-First Rule

The project has a **₹0 planned development budget**.

Prefer:

- Open-source software.
- Free tiers.
- Local computation.
- Static/demo datasets.
- OpenStreetMap-based mapping.
- Free Supabase capabilities where sufficient.
- Free Vercel deployment where sufficient.

Do not introduce a paid service without explicit approval.

---

## 6. No Fabricated Integrations

Never pretend an integration exists when it does not.

Examples:

- Government API.
- Aadhaar verification.
- GST verification.
- Real payment settlement.
- Real-time market data.
- Real-time transport tracking.

If unavailable, use:

```text
Demo / Mock Integration
```

and clearly label it.

---

## 7. Security Rules

Never:

- Hard-code secrets.
- Commit `.env`.
- Expose service-role keys.
- Disable RLS for convenience.
- Use client-side authorization as the only security mechanism.
- Trust user-supplied role fields for authorization.
- Return unnecessary personal data.

Use:

```text
Supabase Auth
+
PostgreSQL RLS
+
Server-side secrets
```

---

## 8. Database Rules

Before changing the database:

1. Read `Database.md`.
2. Inspect current schema through Supabase MCP.
3. Prefer migration files.
4. Add/modify RLS policies when access changes.
5. Test authorized and unauthorized access.
6. Avoid destructive changes unless explicitly requested.

Never delete production-like data merely to solve a development error.

---

## 9. Authentication Rules

Authentication determines identity.

Authorization determines what the user can do.

Use both.

Example:

```text
Authenticated User
        ↓
Profile
        ↓
Role
        ↓
Allowed Application Routes
        +
Database RLS
```

Never trust a frontend role check as database security.

---

## 10. AI Rules

AI must assist users, not silently make high-impact decisions.

AI output must be:

- Explainable where practical.
- Clearly labeled as forecast/recommendation.
- Based on known input data.
- Robust to missing data.
- Accompanied by sensible fallback behavior.

Do not claim:

- Guaranteed prices.
- Guaranteed demand.
- Guaranteed profit.
- Guaranteed route savings.
- Perfect prediction accuracy.

---

## 11. Forecasting Rules

For demand forecasting:

- Keep training/demo data identifiable.
- Record model/input assumptions.
- Display forecast date/period.
- Display confidence/quality only when it is meaningfully calculated.
- Handle insufficient historical data.
- Fall back to a simple baseline when needed.

Example:

```text
Insufficient historical data.
Showing baseline estimate.
```

is preferable to inventing confidence.

---

## 12. Matching Rules

Matching should be explainable.

Recommended scoring factors:

```text
Product Compatibility
Quantity Fit
Distance
Price Fit
Availability
Reliability
```

The UI should be able to explain why a match was suggested.

---

## 13. Logistics Rules

Never calculate a route using fake distance while presenting it as real.

If an external routing service is unavailable:

```text
Demo route
```

must be shown.

Vehicle capacity must be respected.

Do not assign a 2,000 kg order to a 1,000 kg vehicle unless split shipments are explicitly supported.

---

## 14. UI Rules

Every important screen must include:

- Loading state.
- Empty state.
- Error state.
- Success feedback.
- Responsive layout.

Do not create desktop-only layouts.

---

## 15. Code Quality Rules

Use:

- TypeScript types.
- Small components.
- Reusable UI components.
- Clear naming.
- Feature-based organization.
- Environment variables for configuration.

Avoid:

- `any` unless unavoidable.
- Huge components.
- Duplicate code.
- Inline database logic throughout UI.
- Dead code.
- Unused imports.
- Temporary console logging in production.

---

## 16. Error Messages

User-facing errors should be understandable.

Bad:

```text
PGRST116
```

Better:

```text
We couldn't load this order. Please try again.
```

Technical details may be logged safely for developers.

---

## 17. Data Rules

Use realistic demo data, but never represent demo users/data as real government-verified identities.

Do not collect sensitive information unless genuinely required.

---

## 18. Git Rules

Commit changes in logical units.

Examples:

```text
feat: add farmer marketplace
feat: add buyer requirements
fix: correct order status transition
feat: add demand forecast dashboard
chore: update database migration
```

Do not commit:

- `.env`
- secrets
- generated credentials
- unnecessary build files

---

## 19. AI Agent Workflow

For every task:

```text
1. Read relevant docs.
2. Inspect existing code.
3. Identify affected files.
4. Plan the change.
5. Implement.
6. Run validation.
7. Fix errors.
8. Summarize changes.
```

The AI must not jump directly into rewriting the application.

---

## 20. Scope Protection

Do not add unrelated features such as:

- Social networking.
- Cryptocurrency.
- Blockchain without a demonstrated need.
- Complex gamification.
- Unrelated AI chat features.
- Excessive animations.
- Features outside the SIH problem statement.

---

## 21. Final Rule

**Functionality, security, explainability and demo reliability are more important than visual complexity or feature count.**
