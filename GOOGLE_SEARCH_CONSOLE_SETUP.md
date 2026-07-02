# Google Search Console Setup for The KPI Hub

## Overview
Google Search Console helps your site appear in Google search results and monitors performance.

## Setup Steps

### Step 1: Access Google Search Console

1. Go to: https://search.google.com/search-console
2. Sign in with your Google account (hsharma.gxi@gmail.com recommended)
3. Click **"Start now"**

### Step 2: Add Your Property

1. Choose **"URL prefix"** (easier verification method)
2. Enter: `https://thekpihub.com`
3. Click **"Continue"**

### Step 3: Verify Ownership

You'll be prompted to verify. Choose ONE method:

#### Option A: HTML File Upload (Recommended)
1. Download the HTML verification file
2. Upload to your Hostinger root directory (`/public_html/`)
3. Click "Verify" in Google Search Console
4. You can delete the file after verification

#### Option B: DNS TXT Record
1. Go to Hostinger DNS settings
2. Add TXT record with value provided by Google
3. Wait for DNS propagation (~15 min)
4. Click "Verify" in Google Search Console

#### Option C: Google Analytics
If you have Google Analytics set up:
1. Click "Google Analytics" tab
2. Verify using your GA4 property
3. Click "Verify"

### Step 4: Submit Sitemap

Once verified:

1. Left sidebar → **Sitemaps**
2. Click **"New sitemap"**
3. Enter: `sitemap.xml`
4. Click **"Submit"**

### Step 5: Monitor Performance

After sitemap is submitted (give it 24-48 hours):

1. Go to **Performance** section
2. You'll see:
   - Click-through rate
   - Impressions in search
   - Average position
   - Queries driving traffic
   - Pages indexed

### Step 6: Mobile Usability (Optional but Recommended)

1. Left sidebar → **Mobile usability**
2. Check for any mobile issues
3. Fix any flagged problems

### Step 7: Coverage Report (To Monitor)

1. Left sidebar → **Coverage**
2. Check for:
   - ✓ Valid pages (should be green)
   - Excluded pages (usually OK)
   - ✗ Error pages (fix if any)

## Important Notes

- **Sitemap.xml**: Must exist at `https://thekpihub.com/sitemap.xml` (included in production-fixes)
- **robots.txt**: Must exist at `https://thekpihub.com/robots.txt` (included in production-fixes)
- **Verification**: Takes 1-2 days to complete
- **Indexing**: Takes 3-7 days for Google to crawl and index pages
- **HTTPS required**: Only secure sites (https://) can be submitted

## After Production-Fixes Are Applied

Once you've run the production-fixes patch, the sitemap will be automatically updated with all your pages. Re-submit in GSC to refresh the index.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't verify domain | Check that DNS/HTML file is properly configured |
| Sitemap rejected | Ensure sitemap.xml exists and is valid XML |
| Pages not indexed | Wait 7 days, then request indexing via GSC |
| Mobile errors | Fix issues in production-fixes or manually in HTML |

## Next Steps in GSC After 48 Hours

1. Request indexing for key pages
2. Monitor queries and clicks
3. Monitor rankings in Performance report
4. Set up email alerts for issues

---

**Status**: GSC setup is manual and requires browser interaction.
**Timeline**: Verification (1-2 days) → Indexing (3-7 days) → Full crawl (2-4 weeks)
