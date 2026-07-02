# The KPI Hub Recovery Matrix

Saved: 2026-06-23

## Purpose

This document separates:

- what is already recoverable from the backup
- what can likely be recovered from the public website
- what cannot be recovered from either
- what must be rebuilt manually
- what must be provided by the owner/admin team

It is based on:

- the real backup package: `C:\Users\Admin\Downloads\thekpihub-complete-app\thekpihubfullbackup.tar.gz`
- the restored codebase extracted from that backup
- the public website: [thekpihub.com](https://thekpihub.com/)

## Evidence Summary

### Backup confirms

- A single Next.js codebase already contains both the public site and the dashboard app.
- The marketing homepage exists in the app router at `src/app/page.tsx`.
- The product app exists under `src/app/dashboard/*`.
- The dashboard route map is already defined centrally in `src/app/dashboard/layout.tsx`.
- The decision layer is still browser-persisted via `localStorage` in `src/lib/intelligence/modules/decisionStore.ts`.
- The handoff docs explicitly state there is no backend, no multi-user model, and no production deployment work completed yet.

### Public website confirms

- Live brand headline: "Decision-Grade Intelligence. Zero Fluff."
- Public nav labels visible on the homepage: `Platform`, `Roles`, `Features`, `Pricing`
- Public CTA visible on the homepage: `Get My KPI Audit`
- The live site appears JS-heavy and only partially accessible through static page extraction, so public recovery is possible but incomplete.

Sources:

- [thekpihub.com homepage](https://thekpihub.com/)
- [src/app/page.tsx](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\src\app\page.tsx)
- [src/app/dashboard/layout.tsx](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\src\app\dashboard\layout.tsx)
- [src/lib/intelligence/modules/decisionStore.ts](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\src\lib\intelligence\modules\decisionStore.ts)
- [PROJECT_HANDOFF_V3.md](C:\Users\Admin\AppData\Local\Temp\thekpihub-restored\PROJECT_HANDOFF_V3.md)

## Recovery Matrix

| Area | Present in backup | Recoverable from website | Must be rebuilt manually | Must be provided by owner/admin | Notes |
|---|---|---|---|---|---|
| Brand direction | Yes | Yes | No | No | Backup and live site both expose product positioning, but live site may reflect newer copy. |
| Marketing page structure | Partial | Yes | Partial | No | Backup homepage is simpler than live site nav, so website should be treated as the more current public IA reference. |
| Marketing copy | Partial | Yes | Partial | No | Public copy can be recovered by auditing the deployed site. |
| Visual design system | Partial | Partial | Yes | Possibly | Colors/components exist in code, but exact live visual parity may require deeper page inspection or design files. |
| Dashboard IA | Yes | Partial | No | No | Backup clearly defines route groups and product module layout. |
| Dashboard UI implementation | Yes | Partial | No | No | Backup contains the actual source for current dashboard pages. |
| Intelligence module interfaces | Yes | No | No | No | Module contracts already exist in source. |
| Intelligence module live data | No | No | Yes | Possibly | Current modules are mock-data driven; real data sources are absent. |
| Decision workflow UI | Yes | No | No | No | Accept/Snooze/Dismiss and outcome recording are already implemented. |
| Decision persistence | Partial | No | Yes | No | Only `localStorage` persistence exists; production persistence must be rebuilt server-side. |
| Recommendation Accuracy Engine | No | No | Yes | No | Explicitly marked not started in handoff docs. |
| Memory Loop / learning layer | No | No | Yes | No | Explicitly not started and intentionally deferred. |
| Auth / sign-in / sessions | No | No | Yes | Yes | No auth system appears in source or docs; provider and policy decisions are still needed. |
| Roles / permissions | No | No | Yes | Yes | Business rules are not present in backup or public website. |
| User / workspace model | No | No | Yes | Yes | No multi-user concept exists yet. |
| Database schema | No | No | Yes | Yes | Must be designed and approved. |
| API layer / server actions | No | No | Yes | No | No production data interface is present. |
| Environment variables / secrets | No | No | No | Yes | Cannot be recovered from backup or website safely. |
| Hosting / infra config | No | No | Partial | Yes | Platform choices and access credentials must come from the owner/admin team. |
| CI/CD pipeline | No | No | Yes | Yes | No production automation is present in the backup. |
| Monitoring / observability | No | No | Yes | Yes | No evidence of error tracking, uptime monitoring, or logs pipeline. |
| Analytics integration | No clear evidence | Partial | Yes | Yes | Website may reveal analytics tags; actual account access/config must come from owners. |
| Payments / billing | No | Partial | Yes | Yes | Public pricing may be visible, but payment provider and logic are absent. |
| Legal pages / policy content | Placeholder only | Partial | Yes | Yes | Backup has placeholder footer links, not final legal content. |
| SEO / metadata | Partial | Partial | Yes | Possibly | Public site can help recover current SEO intent; source implementation likely needs refresh. |
| Admin workflows | No | No | Yes | Yes | Not represented in current prototype. |
| Test suite for production workflows | No | No | Yes | No | Handoff mentions validation and Playwright verification, but no full product test harness is present in the backup. |
| Deployment readiness | No | No | Yes | Yes | This is a prototype/product foundation, not a production-ready SaaS. |

## What We Can Reliably Recover Now

### From the backup

- current app structure
- dashboard route map
- current marketing homepage source
- current component library
- current decision workflow UX
- module service contracts
- architecture intent
- handoff and roadmap context

### From the live website

- most current public messaging
- public navigation labels
- CTA wording
- likely pricing presentation
- likely public feature framing
- visible brand treatment and layout direction

## What We Cannot Reliably Recover

These are the highest-risk gaps because neither the backup nor the public website can supply them with enough confidence:

- real backend logic
- database structure and live records
- auth/session implementation
- tenant/workspace model
- production secrets
- deployment environment setup
- internal admin operations
- billing implementation
- monitoring/error reporting configuration
- role/permission policy

## Recommended Recovery Strategy

### Phase 1: Recover what already exists

1. Treat the backup as the canonical source for the current application code.
2. Treat the public website as the canonical source for current public-facing copy and site IA.
3. Diff backup marketing content against the live site and update the public pages accordingly.

### Phase 2: Design the missing production layer

1. Define auth strategy.
2. Define workspace/user model.
3. Design database schema.
4. Design API/server-action contracts.
5. Replace `localStorage` decision persistence with server persistence.

### Phase 3: Complete the product roadmap in the right order

1. Build Recommendation Accuracy Engine first.
2. Then build the persistence-backed Decision -> Outcome measurement layer.
3. Only after that, consider the later learning/memory loop phases.

### Phase 4: Production hardening

1. Add staging and production environments.
2. Add CI/CD.
3. Add monitoring, analytics, and alerting.
4. Add legal/compliance content and real support/contact flows.

## Owner/Admin Inputs Still Required

The following items must come from whoever owns the domain, hosting, product decisions, or business operations:

- hosting platform access
- DNS/domain access
- environment secrets
- database choice and access
- auth provider choice
- billing provider choice
- analytics account ownership
- legal/privacy/terms final content
- user role definitions
- workspace/org business rules
- support and admin process requirements

## Bottom Line

The backup is strong enough to recover the current application and its product direction.
The website is useful for recovering public-facing messaging and live brand presentation.
But neither source is enough to recover a production-ready backend, auth layer, data model, or infrastructure setup.

The right next move is not to guess those missing details from the website.
The right next move is to use the backup plus live-site audit for surface recovery, then explicitly design and implement the missing production layer.
