# The KPI Hub Phased Execution Guide

Saved: 2026-06-23

This guide turns the unified blueprint into a concrete execution sequence.

Primary reference:

- [UNIFIED_PRODUCTION_BLUEPRINT.md](C:\Users\Admin\OneDrive\10-projects\11-The KPI Hub\UNIFIED_PRODUCTION_BLUEPRINT.md)

## Phase 0: Secure The Existing Estate

Goal: eliminate immediate risk before any migration work.

### Tasks

1. Rotate all secrets exposed in the live-site package.
2. Regenerate:
   - Supabase service role key
   - Stripe secret and webhook secrets if needed
   - Anthropic key
   - OpenRouter key
   - Telegram bot token if exposed
   - Wingman handoff secret
3. Remove secrets from any checked-in or exported files.
4. Reissue server-side env vars in secure hosting controls only.
5. Audit service logs for suspicious use after exposure.

### Definition of done

- all exposed secrets rotated
- production env inventory documented
- no secrets remain in distributable files

## Phase 1: Establish The Canonical Codebase

Goal: decide what becomes the future product foundation.

### Decision

Use the **Next.js backup architecture** as the canonical app base.

### Tasks

1. Restore the Next.js app into a clean working repo.
2. Bring over the latest live public content and messaging.
3. Create migration branch:
   - `migration/unified-production`
4. Add architecture docs and recovery docs into the repo.

### Definition of done

- one canonical repo selected
- migration branch created
- public content differences documented

## Phase 2: Rebuild Auth On The Canonical App

Goal: port the working live auth model into Next.js.

### Tasks

1. Add Supabase client/server setup.
2. Implement login page.
3. Implement register page.
4. Implement password reset page.
5. Add middleware protection for `/dashboard/*`.
6. Port `profiles` table and RLS baseline.

### Validation

1. user can sign up
2. user gets a profile row
3. user can sign in
4. protected dashboard routes require auth
5. password reset works

### Definition of done

- auth works end-to-end in staging
- profile creation is reliable

## Phase 3: Rebuild Billing On The Canonical App

Goal: port the live Stripe model into Next.js route handlers.

### Tasks

1. Create billing route handler for checkout sessions.
2. Create billing webhook route handler.
3. Persist subscription status and plan in database.
4. Add upgrade UI in the app.
5. Add success/cancel handling.

### Validation

1. starter user can open checkout
2. successful payment upgrades plan
3. webhook is idempotent
4. plan state appears correctly in UI

### Definition of done

- paid upgrade works in test mode
- webhook updates are reliable

## Phase 4: Replace Local Decision Storage

Goal: move the differentiating product loop onto real persistence.

### Tasks

1. Create `decisions` table.
2. Create `decision_outcomes` table.
3. Replace `decisionStore.ts` local-only storage with server-backed reads/writes.
4. Update Decision Card flow to work per user.
5. Preserve existing UX where possible.

### Validation

1. accepted decision persists across reloads
2. decision persists across devices
3. outcome notes persist
4. users cannot see other users' decisions

### Definition of done

- Decision Card is fully server-backed
- `localStorage` is no longer the source of truth

## Phase 5: Build Recommendation Accuracy Engine

Goal: complete the next approved product milestone.

### Tasks

1. Define recommendation-to-outcome linkage.
2. Add accuracy aggregation rules.
3. Add database structure for accuracy snapshots if needed.
4. Expose accuracy in UI.
5. Keep this phase measurement-only.

### Validation

1. accepted recommendations with outcomes affect scores
2. score calculations are deterministic
3. UI reflects updated accuracy cleanly

### Definition of done

- Phase 4 milestone from the product roadmap is complete

## Phase 6: Port AI Gateway

Goal: preserve gated AI capability in the new stack.

### Tasks

1. Implement authenticated AI route in Next.js.
2. Recreate plan-based model access rules.
3. Move provider keys to server env only.
4. Add basic request logging and error tracing.
5. Optionally add rate limiting.

### Validation

1. starter sees starter-allowed models only
2. growth and enterprise plans unlock expected models
3. secrets never reach client

### Definition of done

- AI gateway works securely inside canonical app

## Phase 7: Unify Public Site And Dashboard Experience

Goal: finish the single-product experience.

### Tasks

1. Align public marketing pages with live-site copy.
2. Rebuild public routes in Next.js if not already present.
3. Replace static live dashboard concept with the richer Next.js dashboard.
4. Make plan-aware CTAs consistent across public and app experiences.

### Validation

1. homepage and pricing reflect current business positioning
2. login/register/upgrade flows feel visually consistent
3. public-to-product conversion path is coherent

### Definition of done

- one cohesive product experience exists

## Phase 8: Production Hardening

Goal: make the unified app safe to ship.

### Tasks

1. Add error monitoring.
2. Add analytics.
3. Add structured logs.
4. Add CI:
   - lint
   - typecheck
   - tests
   - build
5. Add staging environment.
6. Add smoke-test checklist.

### Validation

1. staging deploy succeeds
2. core flows pass before production release
3. failures are observable quickly

### Definition of done

- app is releasable with confidence

## Suggested Work Order By Week

### Week 1

- Phase 0
- Phase 1

### Week 2

- Phase 2

### Week 3

- Phase 3

### Week 4

- Phase 4

### Week 5

- Phase 5

### Week 6

- Phase 6

### Week 7

- Phase 7

### Week 8

- Phase 8

## Critical Rules

1. Do not build new dashboard breadth before core persistence and accuracy are done.
2. Do not preserve exposed-secret patterns from the Hostinger package.
3. Do not let the static/PHP implementation become the long-term canonical product stack.
4. Do not ship billing or AI changes without staging verification.

## First Engineering Sprint Recommendation

If starting immediately, the strongest first sprint is:

1. rotate secrets
2. stand up canonical Next.js repo
3. port Supabase auth
4. port `profiles` schema
5. protect `/dashboard/*`

That sequence creates the foundation everything else depends on.
