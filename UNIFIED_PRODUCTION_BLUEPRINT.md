# The KPI Hub Unified Production Blueprint

Saved: 2026-06-23

## Executive Summary

The KPI Hub currently exists in two materially different forms:

1. A **Next.js product prototype** from the backup package
2. A **live Hostinger static/PHP production site** from `public_html (2).zip`

The best path is **not** to keep both architectures alive long-term.
The best path is to:

- keep the **product model and dashboard architecture** from the Next.js backup
- keep the **real production wiring** proven in the live Hostinger package
- migrate toward **one unified production application**

## Recommendation In One Line

Build the final product as a **single Next.js platform** with:

- public marketing pages
- authenticated dashboard app
- Supabase for auth + database
- Stripe for billing
- server-side API routes / server actions for secure operations
- staged deployment pipeline

The live Hostinger stack should be treated as a **source of truth for working production integrations**, but not as the final architecture to preserve indefinitely.

---

## 1. Current-State Comparison

### A. Next.js backup

Source:

- [PROJECT_HANDOFF_V3.md](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\PROJECT_HANDOFF_V3.md)
- [src/app/page.tsx](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\src\app\page.tsx)
- [src/app/dashboard/layout.tsx](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\src\app\dashboard\layout.tsx)

Strengths:

- strong product architecture
- modern component model
- shared UI system
- coherent dashboard information architecture
- explicit module contracts
- future-ready Decision -> Outcome -> Learning product direction
- cleaner long-term maintainability

Weaknesses:

- no production auth
- no backend/API layer
- no database integration
- no billing integration
- no real deployment hardening
- decision persistence still local-only

### B. Live Hostinger package

Source:

- [README.md](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\README.md)
- [docs/supabase-schema.sql](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\docs\supabase-schema.sql)
- [login.html](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\login.html)
- [register.html](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\register.html)
- [dashboard.html](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\dashboard.html)
- [stripe-session.php](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\stripe-session.php)
- [stripe-webhook.php](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\stripe-webhook.php)
- [pages/api/ai-gateway.php](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\pages\api\ai-gateway.php)
- [pages/api/open-wingman.php](C:\Users\Admin\AppData\Local\Temp\thekpihub-live-site\pages\api\open-wingman.php)

Strengths:

- real auth flow using Supabase
- real plan model and user profiles
- real billing flow using Stripe
- real webhook provisioning logic
- real gated AI proxy
- real deployment/security header patterns
- real CI/CD and automation artifacts

Weaknesses:

- static HTML/PHP architecture is harder to scale cleanly
- dashboard UX is much simpler and less differentiated than the Next.js product model
- duplicated page logic
- weak component reuse
- harder to evolve into the full Decision Intelligence product vision
- secrets handling is unsafe in the provided package

### Bottom-line comparison

| Dimension | Better source |
|---|---|
| Product architecture | Next.js backup |
| Dashboard experience | Next.js backup |
| Production auth/billing wiring | Hostinger package |
| Current real-world deployment knowledge | Hostinger package |
| Long-term maintainability | Next.js backup |
| Immediate operational clues | Hostinger package |

---

## 2. Final Target Architecture

## Frontend

- **Framework**: Next.js App Router
- **Public routes**:
  - `/`
  - `/pricing`
  - `/about`
  - `/contact`
  - `/get-audit`
  - `/updates`
- **Authenticated app routes**:
  - `/dashboard`
  - `/dashboard/intelligence-hub`
  - `/dashboard/opportunity-radar`
  - `/dashboard/executive-war-room`
  - `/dashboard/competitor-dna`
  - `/dashboard/market-shift`
  - `/dashboard/forecasting-center`
  - `/dashboard/recommendation-engine`

## Auth + Identity

- **Provider**: Supabase Auth
- **Auth methods**:
  - email/password
  - password reset
  - optional magic link / OAuth later
- **Identity model**:
  - `users` from Supabase Auth
  - `profiles` table extended from live schema
  - future `organizations` / `workspaces` table

## Database

- **Provider**: Supabase Postgres
- **Core tables**:
  - `profiles`
  - `organizations`
  - `organization_members`
  - `decisions`
  - `decision_outcomes`
  - `recommendations`
  - `recommendation_accuracy`
  - `module_snapshots`
  - `activity_events`
  - optional `subscriptions`

## Billing

- **Provider**: Stripe
- **Flow**:
  - client initiates checkout
  - server creates checkout session
  - Stripe webhook updates subscription/plan state
  - UI reads plan from database

## Backend

- **Implementation**: Next.js route handlers and/or server actions
- **Replace**:
  - PHP billing handlers
  - PHP AI gateway
  - PHP handoff bridge
- **Keep conceptually**:
  - plan-gated model access
  - secure server-side key usage
  - webhook-driven subscription provisioning

## AI Layer

- **Inference providers**:
  - Anthropic
  - OpenRouter
- **Gateway pattern**:
  - authenticated requests only
  - plan-aware model access
  - usage logging
  - optional rate limiting
  - future KPI-context injection

## Deployment

- **Preferred**: Vercel + Supabase + Stripe
- **Alternative**: Hostinger VPS or other Node-capable hosting
- **Environments**:
  - local
  - staging
  - production

---

## 3. What To Reuse From Each System

### Reuse from Next.js backup

- dashboard route structure
- module service interfaces
- decision card UX
- intelligence hub layout
- shared dashboard primitives
- product direction and roadmap

### Reuse from live Hostinger package

- Supabase provider choice
- `profiles` table starting point
- Stripe billing flow
- plan model
- webhook logic concept
- AI gateway plan gating logic
- Wingman handoff integration concept
- deployment/security header checklist

### Do not preserve as-is

- static HTML dashboard as final app shell
- PHP endpoints as the long-term backend
- secrets in `.htaccess`
- duplicated page-specific client logic

---

## 4. Migration Strategy

## Phase 0: Security containment

Do this first.

1. Rotate all exposed secrets from the Hostinger package.
2. Treat the provided zip as compromised material.
3. Move all secret handling to proper environment management.
4. Audit external services for misuse:
   - Supabase
   - Stripe
   - Anthropic
   - OpenRouter
   - Telegram
   - any Railway/Wingman backend

## Phase 1: Canonical repo decision

1. Use the **Next.js codebase** as the future canonical app.
2. Create a migration branch specifically for live-production integration.
3. Treat the Hostinger package as a reference implementation, not the final base.

## Phase 2: Port real production wiring into Next.js

1. Add Supabase auth to Next.js.
2. Port login/register/reset flows.
3. Port the `profiles` data model and extend it.
4. Port Stripe checkout creation to route handlers.
5. Port Stripe webhook logic to server endpoints.
6. Port AI gateway logic to authenticated server routes.
7. Port Wingman handoff flow if still required.

## Phase 3: Replace prototype persistence

1. Replace `localStorage` decision persistence with database-backed persistence.
2. Add user-scoped decision records.
3. Add outcome records.
4. Add recommendation accuracy aggregation.

## Phase 4: Unify the user experience

1. Bring live public-site copy and IA into the Next.js marketing pages.
2. Replace the simple static `dashboard.html` experience with the richer Next.js dashboard.
3. Preserve plan gating and billing status in the new dashboard UI.

## Phase 5: Production hardening

1. Add middleware-based route protection.
2. Add server-side validation and error handling.
3. Add analytics and monitoring.
4. Add CI:
   - lint
   - typecheck
   - tests
   - build
5. Add staging deployment.
6. Validate upgrade and webhook flows end-to-end.

---

## 5. Recommended Database Expansion

The live schema is a good start but too small for the product vision.

### Keep

- `profiles`
  - `id`
  - `email`
  - `first_name`
  - `last_name`
  - `org`
  - `role`
  - `plan`

### Add

- `organizations`
  - `id`
  - `name`
  - `created_at`
- `organization_members`
  - `organization_id`
  - `user_id`
  - `role`
- `decisions`
  - `id`
  - `user_id`
  - `organization_id`
  - `module_id`
  - `headline`
  - `category`
  - `severity`
  - `status`
  - `source_payload`
  - `created_at`
  - `updated_at`
- `decision_outcomes`
  - `id`
  - `decision_id`
  - `result`
  - `notes`
  - `recorded_at`
- `recommendations`
  - `id`
  - `module_id`
  - `title`
  - `rank`
  - `confidence`
  - `impact`
  - `effort`
  - `metadata`
- `recommendation_accuracy`
  - `id`
  - `recommendation_id`
  - `success_count`
  - `failure_count`
  - `partial_success_count`
  - `score`
  - `updated_at`
- `subscriptions`
  - `user_id`
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `plan`
  - `status`
- `activity_events`
  - audit trail for decision actions and billing-relevant state changes

---

## 6. Target Folder Shape

Suggested unified application structure:

```text
src/
  app/
    (marketing)/
      page.tsx
      pricing/page.tsx
      about/page.tsx
      contact/page.tsx
      get-audit/page.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
      reset-password/page.tsx
    dashboard/
      layout.tsx
      page.tsx
      intelligence-hub/page.tsx
      opportunity-radar/page.tsx
      executive-war-room/page.tsx
      competitor-dna/page.tsx
      market-shift/page.tsx
      forecasting-center/page.tsx
      recommendation-engine/page.tsx
    api/
      billing/checkout/route.ts
      billing/webhook/route.ts
      ai/gateway/route.ts
      integrations/wingman/route.ts
  components/
  hooks/
  lib/
    supabase/
    stripe/
    ai/
    intelligence/
    auth/
```

---

## 7. Deployment-Ready Execution Guide

## Step 1: Stabilize secrets and ownership

1. Rotate exposed credentials.
2. Document all service owners.
3. Recreate environment variables securely in:
   - hosting platform
   - GitHub Actions
   - Supabase/Stripe integrations

## Step 2: Stand up the canonical Next.js environment

1. Restore the Next.js repo as the working base.
2. Add current live-site copy/content where needed.
3. Configure env files using placeholders only.

## Step 3: Connect Supabase

1. Add Supabase client/server setup.
2. Implement auth middleware.
3. Port login/register/reset flows.
4. Apply schema migrations.

## Step 4: Connect billing

1. Create Stripe products/prices cleanly.
2. Port checkout session logic.
3. Port webhook logic.
4. Persist plan state in database.

## Step 5: Replace local-only decision storage

1. Add `decisions` and `decision_outcomes` tables.
2. Update Decision Card data flow to use server persistence.
3. Verify reload, multi-device, and multi-user behavior.

## Step 6: Build the next real product milestone

1. Implement Recommendation Accuracy Engine.
2. Compute accuracy from stored outcomes.
3. Surface scores in the dashboard.

## Step 7: Port AI gateway

1. Build authenticated AI endpoint.
2. Enforce plan-based model access.
3. Log usage and errors.
4. Add safeguards and rate limiting.

## Step 8: Validate end-to-end

1. Auth flows
2. Billing flows
3. Webhook flows
4. Decision persistence
5. Recommendation accuracy
6. Protected routes
7. AI gateway access by plan

## Step 9: Deploy in stages

1. local
2. staging
3. private beta
4. production

---

## 8. Risks To Avoid

- Do not keep secrets in shipped files.
- Do not split marketing and app into separate stacks unless truly necessary.
- Do not preserve PHP endpoints if the canonical app is Next.js.
- Do not build learning/adaptation before accuracy measurement exists.
- Do not migrate UI first and backend later; auth/data/billing must land early.

---

## 9. Recommended Immediate Priority Order

1. Rotate exposed secrets
2. Choose the Next.js repo as canonical
3. Port Supabase auth
4. Port Stripe billing
5. Replace decision `localStorage`
6. Build Recommendation Accuracy Engine
7. Port AI gateway
8. Stage and deploy

---

## Final Call

The strongest final product is:

- the **Next.js app architecture**
- powered by the **live site's proven Supabase + Stripe + gated-AI production model**
- shipped as **one unified platform**

That gives The KPI Hub the best chance of becoming both maintainable and genuinely production-ready.
