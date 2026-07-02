# The KPI Hub — Go/No-Go Readiness Report (Corrected)
**Session date:** 2026-06-14
**Supersedes:** earlier version of this file written same-day, which was based on incomplete information (see "What changed" below).

## TL;DR

The site is **already live on Hostinger** with a far more advanced build than `website-source/` — including a **live Razorpay payment link** (you confirmed this was your own deploy from today). The de-aging work done in `website-source/` this session (commit `db065e2`) was correct in intent but applied to a **stale, disconnected fork** — production already has it done, plus more. The real open issue is **two sets of live credentials sitting unencrypted in OneDrive-synced folders**, never rotated despite being flagged in a Session-1 audit doc that was since deleted.

## What changed vs. the earlier report

| Earlier report said | Actual finding |
|---|---|
| Step 1 (hosting) unresolved — sandbox blocked | **Resolved.** Real network check (DNS + headers from your machine) confirms **Hostinger**: `platform: hostinger`, `panel: hpanel`, `Server: hcdn`. IPs (`91.108.106.32`, `93.127.173.19`, `2a02:4780::/29`) are Hostinger ranges. |
| `website-source/` is canonical | **Incorrect.** Live `thekpihub.com` runs a completely different React-SPA build (`landing/hero.js`, `sections-a..f.js`, `app.js`, "Sign In →" nav) that matches `origin/main` on GitHub byte-for-byte in the files checked. `website-source/` is **45 commits behind** and not what's deployed. |
| Razorpay = open/placeholder, by design | **Live in production.** `get-audit.html` on `thekpihub.com` contains `PAYMENT_LINK_URL = "https://rzp.io/rzp/hLRfwonD"` (₹2,999), identical to `origin/main`. You confirmed this was your intentional deploy today. |
| De-aging commit `db065e2` is the fix | **Redundant.** Production's `get-audit.html`/funnel already has the de-aged CTAs *and* a live payment link — `db065e2` was applied to a copy nobody is serving. |
| `deploy.yml` → GitHub Pages is the pipeline | **Doesn't match reality.** `origin/main:.github/workflows/deploy.yml` targets GitHub Pages with `CNAME=thekpihub.com`, but live DNS points to Hostinger, not GitHub Pages' IP ranges (`185.199.108-111.x`). The live deploy to Hostinger happened **outside** this workflow (manual/hPanel, presumably as part of today's push). |

## Real open vulnerabilities found

| # | Item | Where | Risk |
|---|---|---|---|
| 1 | **Google OAuth client secret in plaintext** — `client_id` ending `...apps.googleusercontent.com`, `client_secret: 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`, redirect to a Supabase `auth/v1/callback` | `incoming-review/client_secret_161840024483-...json` (OneDrive-synced, **not** in git) | Anyone with OneDrive access to this folder (or any tool granted folder access) can read this and impersonate the OAuth client. **Not rotated** — the Session-1 audit doc that flagged this was deleted, but the file itself is still here. |
| 2 | **API key screenshots** — `sendgrid API Key.png`, `appsflyer_thekpihub_dev_key.png` | `screenshots-reference/` (OneDrive-synced) | Same exposure pattern — real-looking keys in image form, still sitting in a synced folder. |
| 3 | **Local git repo (`website-source/`) is stale and diverged** — `db065e2` (local) vs. 45 unrelated commits on `origin/main` | `website-source/.git` | Don't push `db065e2` — it'll conflict and is redundant. Repo needs reconciliation: either reset `website-source/` to track `origin/main` or retire it as a working copy. |
| 4 | **`.git` repo inside OneDrive sync** (carried over from Session 1, still unaddressed) | `website-source/` | Sync-conflict corruption risk on a live git repo. |

## What's confirmed safe (checked, not just assumed)

- `https://thekpihub.com/.env` → 404, `/.htaccess` → 403, `/.git/config` → 403 — no server-side secret exposure.
- `config.js` (live) — Supabase anon key + Stripe **test** publishable key only, both intentionally public per the file's own comments. No service-role or secret keys present.
- `config.example.js`, `.env.example` on `origin/main` — placeholders only, no real values.
- `CREDENTIAL_AUDIT.md` / `LAUNCH_MODE_CREDENTIAL_MAP.md` / `SECRET_ROTATION_CHECKLIST.md` — confirmed deleted from `origin/main`, but (per #1/#2 above) deletion of the *doc* did not mean the underlying secrets were rotated or removed.

## Recommended next actions (in order)

1. **Rotate the Google OAuth client secret** in Google Cloud Console (the project tied to `client_id 161840024483-...`), then delete `incoming-review/client_secret_...json`.
2. **Rotate the SendGrid and AppsFlyer keys** shown in `screenshots-reference/*.png` if those are real/active, then delete or move those screenshots out of the OneDrive-synced folder.
3. **Reconcile `website-source/`** with `origin/main` — either `git fetch && git reset --hard origin/main` (discarding the now-redundant `db065e2`) or archive `website-source/` and treat the GitHub repo as the single working copy going forward.
4. **Move the git working copy out of OneDrive** to avoid sync-conflict corruption on a live repo.
5. Confirm the Razorpay account (`rzp.io/rzp/hLRfwonD`) is connected to a fulfillment process you're actually running — since real ₹2,999 payments can land starting now.

## Steps 1–6 from the original task — final status

| Step | Result |
|---|---|
| 1. Hosting truth | **Hostinger**, confirmed via live DNS + headers. |
| 2. Canonical source | `origin/main` on GitHub (deployed to Hostinger), **not** `website-source/`. |
| 3. Safety net | `website-source/` history preserved (`3c829f0`, `db065e2`); no push performed, no data lost. |
| 4. De-age funnel | Done locally (`db065e2`) but **moot** — production is already de-aged and beyond. |
| 5. Click-through test | Passed locally on the stale copy; production funnel (with live Razorpay) was not re-tested this session. |
| 6. Go/no-go report | This document. |
