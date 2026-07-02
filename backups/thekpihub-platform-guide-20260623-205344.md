# The KPI Hub Platform Migration Guide

Saved: 2026-06-24

## Purpose

This guide records what was done today, why it was done, what files matter, and how to restore or continue the work.

The work focused on turning The KPI Hub from two separate realities into one future production path:

- the current live Hostinger static/PHP website
- the newer Next.js Decision Intelligence app backup

The chosen direction is to make `website-source/platform` the canonical Next.js platform app while preserving the current live site during migration.

## Source Materials Reviewed

### 1. Next.js app backup

Source file reviewed:

- `C:\Users\Admin\Downloads\thekpihub-complete-app\thekpihubfullbackup.tar.gz`

What it contained:

- a Next.js dashboard/product prototype
- Intelligence Hub
- Recommendation Engine
- server-ready module patterns
- Decision Card MVP
- localStorage-based decision persistence
- handoff docs describing the Decision -> Outcome -> Learning product direction

Why it mattered:

- It had the stronger long-term product architecture.
- It had the richer dashboard and Decision Intelligence logic.
- It did not yet have production auth, billing, database, or deployment wiring.

### 2. Live Hostinger site package

Source file reviewed:

- `C:\Users\Admin\Downloads\public_html (2).zip`

What it contained:

- the current live website source
- Supabase Auth
- Supabase `profiles` schema
- Stripe checkout/session/webhook PHP handlers
- plan-gated AI gateway PHP endpoint
- Wingman handoff endpoint
- GitHub workflow files
- Hostinger `.htaccess` deployment/security config

Why it mattered:

- It revealed the real production engineering direction currently used by the live site.
- It confirmed Supabase, Stripe, plan gating, and AI gateway patterns.
- It also exposed server-side secrets in `.htaccess`, so those credentials should be treated as compromised and rotated.

## Key Decision

Use the Next.js app as the future canonical product architecture, and port the useful production wiring from the live Hostinger package into it.

Reason:

- The static/PHP site has working production integrations, but it is harder to scale into the full Decision Intelligence product.
- The Next.js app has the right product model, but needed auth, database, billing, and server APIs.
- A single Next.js platform gives the best long-term maintainability.

## Documents Created

### `RECOVERY_MATRIX.md`

Path:

- `C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\RECOVERY_MATRIX.md`

Purpose:

- Separates what was recoverable from the backup, what was recoverable from the live website/package, what must be rebuilt, and what must be supplied by the owner/admin.

### `UNIFIED_PRODUCTION_BLUEPRINT.md`

Path:

- `C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\UNIFIED_PRODUCTION_BLUEPRINT.md`

Purpose:

- Defines the recommended final architecture:
  - Next.js app
  - Supabase Auth and Postgres
  - Stripe billing
  - server-side APIs
  - authenticated dashboard
  - Decision Intelligence modules

### `PHASED_EXECUTION_GUIDE.md`

Path:

- `C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\PHASED_EXECUTION_GUIDE.md`

Purpose:

- Converts the blueprint into a phased implementation plan.

### `TODAY_IMPLEMENTATION_GUIDE.md`

Path:

- `C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\TODAY_IMPLEMENTATION_GUIDE.md`

Purpose:

- This document. It records what was implemented today and why.

## Implementation Work Completed

All implementation work was placed inside:

- `C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\website-source\platform`

This keeps the current live static site intact while the new platform is built.

## Platform App Created

Created a new Next.js app foundation at:

- `website-source/platform`

Important files:

- `platform/package.json`
- `platform/package-lock.json`
- `platform/next.config.ts`
- `platform/tsconfig.json`
- `platform/.env.example`
- `platform/README.md`

Why:

- Gives the project a modern canonical app shell.
- Keeps the migration isolated from the existing Hostinger static/PHP site.
- Allows production auth, billing, dashboard, and APIs to move into one app.

## Supabase Auth Foundation

Created Supabase helpers:

- `platform/src/lib/supabase/client.ts`
- `platform/src/lib/supabase/server.ts`
- `platform/src/lib/supabase/middleware.ts`
- `platform/middleware.ts`

Created auth pages:

- `platform/src/app/login/page.tsx`
- `platform/src/app/register/page.tsx`
- `platform/src/app/reset-password/page.tsx`

Created auth components:

- `platform/src/components/auth/AuthShell.tsx`
- `platform/src/components/auth/LoginForm.tsx`
- `platform/src/components/auth/RegisterForm.tsx`
- `platform/src/components/auth/ResetPasswordForm.tsx`

Why:

- The live Hostinger site already uses Supabase Auth.
- Porting Supabase into the canonical app preserves the working auth direction.
- Dashboard routes need protected access before production data can be trusted.

## Protected Dashboard Shell

Created:

- `platform/src/app/dashboard/layout.tsx`
- `platform/src/app/dashboard/page.tsx`
- `platform/src/components/dashboard/Sidebar.tsx`

Why:

- Establishes `/dashboard/*` as the authenticated app space.
- Provides a base shell for porting Intelligence Hub and other modules.
- Keeps the user experience aligned with the richer Next.js product backup.

## Unified Database Migration Draft

Created:

- `platform/supabase/migrations/0001_unified_core.sql`

Tables included:

- `organizations`
- `profiles`
- `organization_members`
- `recommendations`
- `decisions`
- `decision_outcomes`
- `recommendation_accuracy`
- `module_snapshots`
- `subscriptions`
- `activity_events`

Why:

- The live site only had a small `profiles` table.
- The product roadmap needs decision persistence, outcomes, recommendation accuracy, organizations, subscriptions, and audit events.
- The SQL draft gives the platform a production-shaped data model.

Important correction made:

- Recommendation IDs were changed from UUID to text IDs.

Reason:

- The existing product logic uses stable text IDs such as `rec-pricing-corridor`.
- Keeping text IDs avoids unnecessary translation between mock/product recommendation IDs and database records.

## API Surface Added

Created profile API:

- `platform/src/app/api/profile/route.ts`

Created decision APIs:

- `platform/src/app/api/decisions/route.ts`
- `platform/src/app/api/decisions/[id]/status/route.ts`
- `platform/src/app/api/decisions/[id]/outcome/route.ts`

Created billing APIs:

- `platform/src/app/api/billing/checkout/route.ts`
- `platform/src/app/api/billing/webhook/route.ts`

Created Intelligence Hub API:

- `platform/src/app/api/intelligence-hub/route.ts`

Created Recommendation API:

- `platform/src/app/api/recommendations/route.ts`

Why:

- The old Decision Card stored state in `localStorage`.
- The new platform needs server-backed decisions and outcomes.
- Stripe billing from the live site needed a Next.js route-handler equivalent.
- Recommendation accuracy needs a server-side shape before it can become a real product metric.

## Intelligence Hub Ported

Created:

- `platform/src/lib/intelligence/types.ts`
- `platform/src/lib/intelligence/mockIntelligenceHub.ts`
- `platform/src/app/dashboard/intelligence-hub/page.tsx`

Why:

- Intelligence Hub is the center of the Decision Intelligence product.
- It needed to move from the prototype into the canonical platform shell.
- It now reads from `/api/intelligence-hub`.

## Server-Backed Decision Card Ported

Created:

- `platform/src/components/dashboard/DecisionCard.tsx`

What changed:

- The Decision Card no longer relies on `localStorage`.
- It creates decision records through `/api/decisions`.
- It updates decision status through `/api/decisions/[id]/status`.
- It records outcomes through `/api/decisions/[id]/outcome`.

Why:

- Server persistence is required for multi-device, multi-user, and future accuracy scoring.
- This is the bridge from Decision -> Outcome -> Learning.

## Recommendation Engine Ported

Created:

- `platform/src/lib/intelligence/mockRecommendationEngine.ts`
- `platform/src/app/dashboard/recommendation-engine/page.tsx`

What changed:

- Recommendations now expose accuracy-ready metadata.
- `/api/recommendations` calculates a first-pass accuracy score from recorded decision outcomes.

Accuracy shape:

- `success_count`
- `partial_success_count`
- `failed_count`
- `total_scored`
- `score`

Why:

- The handoff docs identified Recommendation Accuracy Engine as the next approved product milestone.
- This gives the app a first working server-side shape for that milestone.

## Runtime Enablement Completed

Inside:

- `website-source/platform`

Commands run:

```powershell
npm install
npm run typecheck
npm run build
npm run dev -- --port 3001
```

Results:

- `npm install` completed.
- `npm run typecheck` passed.
- `npm run build` passed.
- Dev server started successfully at `http://localhost:3001`.

Smoke-tested routes:

- `/`
- `/login`
- `/register`
- `/reset-password`
- `/api/intelligence-hub`

All returned HTTP 200.

## Build Issues Fixed

### 1. Supabase cookie typings

Files:

- `platform/src/lib/supabase/server.ts`
- `platform/src/lib/supabase/middleware.ts`

Reason:

- Strict TypeScript rejected implicit `any` values in Supabase cookie callbacks.

### 2. Next.js typed route errors

Files:

- `platform/src/components/auth/LoginForm.tsx`
- `platform/src/components/dashboard/Sidebar.tsx`

Reason:

- Next.js typed routes rejected arbitrary strings passed to route helpers and links.

### 3. `useSearchParams()` Suspense requirement

File:

- `platform/src/app/login/page.tsx`

Reason:

- Next.js requires `useSearchParams()` inside a Suspense boundary for static rendering.

### 4. Dashboard prerender and missing Supabase env

File:

- `platform/src/app/dashboard/layout.tsx`

Reason:

- Authenticated routes need request-time rendering, not static prerendering.

### 5. Auth forms creating Supabase client too early

Files:

- `platform/src/components/auth/LoginForm.tsx`
- `platform/src/components/auth/RegisterForm.tsx`
- `platform/src/components/auth/ResetPasswordForm.tsx`

Reason:

- Browser Supabase client creation during prerender failed when env values were not present.
- Moving client creation into submit handlers allowed production build to complete.

## Current Local URL

The local dev server was running at:

- `http://localhost:3001`

Important pages:

- `http://localhost:3001/login`
- `http://localhost:3001/register`
- `http://localhost:3001/reset-password`
- `http://localhost:3001/api/intelligence-hub`

Note:

- Authenticated dashboard pages need real Supabase env values before full sign-in testing.

## Important Security Note

The Hostinger package included secrets in `.htaccess`.

Those secrets should be treated as compromised and rotated:

- Supabase service role key
- Stripe secrets
- Anthropic key
- OpenRouter key
- Telegram token
- Wingman handoff secret
- any other exposed server-side key

Reason:

- Any archive containing server-side secrets should be treated as sensitive and unsafe to redistribute.

## Restore Instructions

To restore this backup:

1. Extract the backup zip.
2. Open `website-source/platform`.
3. Run:

```powershell
npm install
```

4. Create `.env.local` from `.env.example`.
5. Fill in Supabase and Stripe values.
6. Run:

```powershell
npm run dev -- --port 3001
```

7. Open:

```text
http://localhost:3001
```

## Validation Commands

Use these after restore:

```powershell
npm run typecheck
npm run build
```

Expected result:

- both commands pass

## Not Included In Backup

The backup intentionally excludes generated or heavy files:

- `platform/node_modules`
- `platform/.next`
- `platform/tsconfig.tsbuildinfo`
- temporary dev-server logs

Reason:

- These can be regenerated.
- Excluding them keeps the backup portable and avoids unnecessary size.

## Suggested Next Work

1. Add real `platform/.env.local` values.
2. Apply the Supabase migration to a staging Supabase project.
3. Test register/login/dashboard session flow.
4. Test server-backed Decision Card with real authenticated user.
5. Persist recommendations into the database.
6. Store calculated recommendation accuracy in `recommendation_accuracy`.
7. Port remaining live dashboard modules.
8. Add CI for `platform` typecheck/build.

## Current Status

The platform foundation is running and build-clean.

The project now has:

- a canonical Next.js app path
- Supabase auth scaffolding
- protected dashboard routing
- server-backed decision APIs
- Intelligence Hub port
- Recommendation Engine port
- first recommendation accuracy model
- portable SQL migration draft

This is ready for the next migration phase.
