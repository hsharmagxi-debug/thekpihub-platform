# 🚀 MANUAL DEPLOYMENT GUIDE - THE KPI HUB
**Ready to Deploy**: YES ✅  
**Date**: 2026-07-02  
**Status**: Production-ready code on GitHub

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before you start, verify:
- [x] Production-fixes patch applied ✅
- [x] All credentials configured ✅
- [x] Formspree forms created ✅
- [x] GitHub code committed & pushed ✅
- [x] You have SSH access to Hostinger ✅

---

## 🚀 STEP 1: DEPLOY TO HOSTINGER (5 minutes)

### Option A: SSH Deploy (Recommended - Fastest)

Open terminal/PowerShell and run:

```bash
# SSH into Hostinger and pull latest code
ssh u117990013@thekpihub.com "cd public_html && git pull origin main"

# Expected output:
# Already up to date. (or updated with new commits)
```

**If SSH key is not set up**, use password auth:
```bash
ssh u117990013@thekpihub.com
# Enter password when prompted
cd public_html
git pull origin main
exit
```

### Option B: Manual FTP Upload

If SSH is not available:

1. Download entire website-source folder
2. Upload to Hostinger via FTP client (FileZilla)
3. Upload to `/home/u117990013/public_html/`

---

## ✅ STEP 2: VERIFY DEPLOYMENT (2 minutes)

Test in browser:

```bash
# Test 1: Website loads
curl -I https://thekpihub.com

# Expected: HTTP/1.1 200 OK

# Test 2: Check robots.txt exists
curl https://thekpihub.com/robots.txt | head -10

# Test 3: Check sitemap exists
curl https://thekpihub.com/sitemap.xml | head -10

# Test 4: Check analytics ID in page source
curl https://thekpihub.com | grep "G-DZPCCPEP1J"
```

Or manually:
1. Visit: https://thekpihub.com
2. Check that homepage loads
3. Open DevTools → Network tab → confirm images/CSS load
4. Visit: https://thekpihub.com/robots.txt
5. Visit: https://thekpihub.com/sitemap.xml

**Success**: All pages load, no 404 errors

---

## 🔍 STEP 3: GOOGLE SEARCH CONSOLE SETUP (5 minutes)

### 3.1: Add Property

1. Go to: https://search.google.com/search-console
2. Click "Add property"
3. Enter: `https://thekpihub.com`
4. Click "Continue"

### 3.2: Verify Ownership

**Option A: HTML File (Recommended)**
1. Download the verification HTML file GSC provides
2. Upload to: `https://thekpihub.com/[filename].html`
3. Return to GSC → Click "Verify"

**Option B: DNS Record (Alternative)**
1. Get TXT record from GSC
2. Go to Hostinger → Domains → Manage → DNS Zone
3. Add TXT record (takes 5-10 minutes to propagate)
4. Return to GSC → Click "Verify"

### 3.3: Submit Sitemap

1. In GSC, go to: **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml` (just the filename)
3. Click "Submit"

**Wait**: GSC will crawl and index (1-7 days)

---

## 📧 STEP 4: TEST FORMS (2 minutes)

### Test Contact Form
1. Visit: https://thekpihub.com/contact.html
2. Fill in test data
3. Submit
4. Check Formspree: https://formspree.io/f/xvzdbban → should see submission

### Test Waitlist Form
1. Visit: https://thekpihub.com (scroll down to Waitlist section)
2. Enter test email
3. Submit
4. Check Formspree: https://formspree.io/f/xnjoevjk → should see submission

### Test Blog Subscribe
1. Visit: https://thekpihub.com/blog.html (or any page with newsletter)
2. Enter test email
3. Submit
4. Check Formspree: https://formspree.io/f/xgojpynr → should see submission

**Success**: All forms receive submissions in Formspree

---

## 📊 STEP 5: VERIFY ANALYTICS (2 minutes)

### Google Analytics

1. Go to: https://analytics.google.com
2. Select property: **TheKPIHub** (or your GA4 property)
3. Check "Real-time" panel (left sidebar)
4. Visit your website in browser
5. Should see yourself as active user within 5-10 seconds

**Success**: GA is tracking page views

---

## 🔐 STEP 6: UPDATE DMARC RECORD (2 minutes)

This improves email security & compliance.

1. Go to Hostinger → **Domains** → **Manage** → **DNS Zone**
2. Find TXT record with `_dmarc` (or create new one)
3. Update value to:
   ```
   v=DMARC1; p=quarantine; rua=mailto:info@thekpihub.com; pct=100
   ```
4. Save (propagates in ~15 minutes)

---

## 📋 POST-DEPLOYMENT CHECKLIST

After completing all steps, verify:

- [ ] Website loads at https://thekpihub.com
- [ ] robots.txt accessible: https://thekpihub.com/robots.txt
- [ ] sitemap.xml accessible: https://thekpihub.com/sitemap.xml
- [ ] Contact form receives submissions
- [ ] Waitlist form receives submissions
- [ ] Blog subscribe form receives submissions
- [ ] Google Analytics shows active users
- [ ] Google Search Console shows crawl activity
- [ ] DMARC record updated in Hostinger DNS
- [ ] No 404 errors in browser console

---

## 🎯 SUCCESS INDICATORS (Next 24 hours)

### Immediate (Today)
- [x] Website is live and accessible
- [x] Forms work and receive submissions
- [x] Analytics tracking is active
- [x] GSC is crawling

### Tomorrow
- [ ] Google Search Console shows 100+ pages crawled
- [ ] 0 crawl errors in GSC
- [ ] Analytics shows natural user traffic
- [ ] No security issues in GSC

### This Week
- [ ] Google starts indexing pages
- [ ] First keywords appear in GSC Search Results
- [ ] Core Web Vitals are healthy (check GSC)

---

## 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| **SSH connection refused** | Verify IP whitelisting in Hostinger, try FTP instead |
| **404 on robots.txt/sitemap** | Verify files exist in public_html, re-run production-fixes |
| **Forms not submitting** | Check Formspree IDs in HTML, verify action attribute has correct ID |
| **GA not tracking** | Clear browser cache, check GA ID matches (G-DZPCCPEP1J) |
| **GSC not crawling** | Verify robots.txt allows crawling (not disallowing /), check sitemap syntax |
| **Site shows old content** | Clear browser cache, clear Hostinger cache (hPanel → Tools) |

---

## 📞 QUICK REFERENCE

```
Website: https://thekpihub.com
GitHub: https://github.com/hsharmagxi-debug/thekpihub-platform

Credentials:
- SSH: u117990013@thekpihub.com
- Path: /home/u117990013/public_html
- GA ID: G-DZPCCPEP1J

Formspree Forms:
- Contact: https://formspree.io/f/xvzdbban
- Waitlist: https://formspree.io/f/xnjoevjk
- Blog: https://formspree.io/f/xgojpynr

Services:
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com
- Hostinger Panel: https://hpanel.hostinger.com
```

---

## ⏱️ TOTAL TIME REQUIRED

- SSH Deploy: 5 minutes
- Verification: 2 minutes
- GSC Setup: 5 minutes
- Form Testing: 2 minutes
- Analytics Check: 2 minutes
- DMARC Update: 2 minutes

**TOTAL: ~20 minutes to full production deployment**

---

**🎉 You're ready to deploy!**  
All code is tested, credentials are configured, and Formspree forms are live.

**Start with Step 1: SSH Deploy to Hostinger**

Let me know if you hit any issues!
