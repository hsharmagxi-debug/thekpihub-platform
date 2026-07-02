# KPI Hub — Production Fix Package
# Generated: 2026-04-21

## What's in this package

| File | Purpose |
|------|---------|
| `kpihub_patch.py` | One-shot patcher — fixes all existing HTML pages |
| `publish_articles.py` | Pipeline → Website article publisher |
| `new-files/robots.txt` | SEO crawler control, blocks admin pages |
| `new-files/sitemap.xml` | All 11 pages listed for Google indexing |
| `new-files/blog.html` | Full blog/article index page |
| `new-files/coming-soon.html` | Placeholder for Careers + Decision Reports |
| `new-files/article-template.html` | Template for each pipeline-generated article |

---

## STEP 1 — Setup (2 minutes)

Get your IDs:
1. **Google Analytics**: analytics.google.com → Admin → Data Streams → copy Measurement ID (G-XXXXXXXX)
2. **Formspree**: formspree.io → Sign up free → New Form → copy form ID for each:
   - Contact form
   - Waitlist form  
   - Blog subscribe form

Open `kpihub_patch.py` and fill in at the top:
```python
GA_MEASUREMENT_ID     = "G-XXXXXXXXXX"        ← paste your GA4 ID
FORMSPREE_CONTACT_ID  = "your_contact_id"      ← paste contact form ID
FORMSPREE_WAITLIST_ID = "your_waitlist_id"     ← paste waitlist form ID
FORMSPREE_BLOG_ID     = "your_blog_id"         ← paste blog subscribe ID
```

---

## STEP 2 — Run the patch (30 seconds)

```bash
# From your WSL terminal (nitr0@Nitro-Dust)

# Navigate to website repo
cd ~/kpihub-website

# Copy this entire kpihub-fixes folder here
cp -r ~/kpihub-fixes/* .

# Run the patcher
python3 kpihub_patch.py
```

The script will:
- Copy robots.txt, sitemap.xml, blog.html, coming-soon.html to repo root
- Create articles/ folder with template
- Fix all dead links across 9 pages
- Inject Google Analytics into every page <head>
- Wire contact/waitlist forms to Formspree
- Add Cookie Settings button to every footer

---

## STEP 3 — Deploy (1 command)

```bash
cd ~/kpihub-website
git add -A
git commit -m "fix: production readiness — SEO, forms, blog, dead links, GA"
git push origin main
```

GitHub Actions picks up → auto-deploys to Hostinger (~2 min)

---

## STEP 4 — Google Search Console (5 minutes, do once)

1. Go to: https://search.google.com/search-console
2. Add property → URL prefix → https://thekpihub.com
3. Verify via HTML file OR DNS TXT record
4. Left sidebar → Sitemaps → Add sitemap → type: sitemap.xml → Submit

---

## STEP 5 — DMARC upgrade in Hostinger DNS (3 minutes)

1. Login to Hostinger panel → Domains → Manage → DNS Zone
2. Find existing TXT record with _dmarc
3. Edit the value to:
   ```
   v=DMARC1; p=quarantine; rua=mailto:info@thekpihub.com; pct=100
   ```
4. Save (propagates in ~15 min)

---

## STEP 6 — Publish articles from pipeline

```bash
cd ~/kpihub-pipeline
python3 publish_articles.py
```

Then deploy:
```bash
cd ~/kpihub-website
git add articles/ blog.html sitemap.xml
git commit -m "feat: publish articles $(date +%Y-%m-%d)"
git push origin main
```

Add to crontab for daily automation:
```bash
# crontab -e
30 0 * * * cd /home/nitr0/kpihub-pipeline && python3 main.py && python3 publish_articles.py && cd /home/nitr0/kpihub-website && git add -A && git commit -m "auto: daily publish $(date +%Y-%m-%d)" && git push origin main
```

---

## What's still needed after this (next sprint)

| Task | Effort |
|------|--------|
| Connect Supabase Auth to login.html | 4–6 hrs |
| Build member dashboard (/dashboard.html) | 1 day |
| Protect admin-login.html with session guard | 2 hrs |
| Wire Intelligence Feed to live pipeline | 2–4 hrs |
| Build tool detail pages in directory | Full sprint |
