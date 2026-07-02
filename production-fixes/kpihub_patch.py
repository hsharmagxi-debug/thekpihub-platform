#!/usr/bin/env python3
"""
kpihub_patch.py — One-shot fix script for thekpihub.com
Run this from the root of your kpihub-website repo:

    python3 kpihub_patch.py

What it fixes:
  1. Dead footer links (Blog → /blog.html, Careers → /coming-soon.html, Decision Reports → /coming-soon.html)
  2. Adds Google Analytics gtag.js to every page <head>
  3. Adds Cookie Settings button to every footer
  4. Fixes contact form → Formspree action
  5. Fixes waitlist forms → Formspree action
  6. Adds newsletter forms → Formspree action
  7. Disallows admin/login in robots.txt (new file created separately)
"""

import os
import re

# ─── CONFIG — Replace these with your actual IDs ───────────────────────────
GA_MEASUREMENT_ID      = "G-XXXXXXXXXX"      # Your Google Analytics 4 Measurement ID
FORMSPREE_CONTACT_ID   = "REPLACE_CONTACT_FORM_ID"   # Formspree form ID for contact
FORMSPREE_WAITLIST_ID  = "REPLACE_WAITLIST_FORM_ID"  # Formspree form ID for waitlist
FORMSPREE_BLOG_ID      = "REPLACE_BLOG_FORM_ID"      # Formspree form ID for blog subscribe
# ────────────────────────────────────────────────────────────────────────────

PAGES = [
    "index.html",
    "intelligence.html",
    "pricing.html",
    "benchmarks.html",
    "directory.html",
    "about.html",
    "contact.html",
    "privacy.html",
    "terms.html",
    "cookies.html",
]

GA_SNIPPET = f"""
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_MEASUREMENT_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', '{GA_MEASUREMENT_ID}');
  </script>
  <!-- End Google Analytics -->
"""

COOKIE_SETTINGS_BTN = """<button onclick="resetCookieConsent()" style="font-family:'Syne',sans-serif;font-size:.68rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,244,239,.5);text-decoration:none;border:1px solid rgba(245,244,239,.08);padding:.3rem .75rem;border-radius:2px;background:none;cursor:pointer;" onmouseover="this.style.color='#E9A123';this.style.borderColor='rgba(233,161,35,.3)'" onmouseout="this.style.color='rgba(245,244,239,.5)';this.style.borderColor='rgba(245,244,239,.08)'">Cookie Settings</button>"""

COOKIE_RESET_JS = """
<script>
function resetCookieConsent() {
  document.cookie = 'cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  localStorage.removeItem('cookie_consent');
  window.location.reload();
}
</script>
"""

def patch_file(filename):
    if not os.path.exists(filename):
        print(f"  ⚠️  Skipped (not found): {filename}")
        return

    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    original = content
    changes = []

    # ── 1. Fix dead Blog link ──────────────────────────────────────────────
    # Matches href="#" with "Blog" as text (various quote styles)
    blog_patterns = [
        (r'<a\s+href=["\']#["\']>\s*Blog\s*</a>', '<a href="/blog.html">Blog</a>'),
        (r'href=["\']#["\'](\s*>Blog<)', r'href="/blog.html"\1'),
    ]
    for pattern, replacement in blog_patterns:
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        if new_content != content:
            content = new_content
            changes.append("Fixed dead Blog link")

    # ── 2. Fix dead Careers link ──────────────────────────────────────────
    careers_patterns = [
        (r'<a\s+href=["\']#["\']>\s*Careers\s*</a>', '<a href="/coming-soon.html">Careers</a>'),
    ]
    for pattern, replacement in careers_patterns:
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        if new_content != content:
            content = new_content
            changes.append("Fixed dead Careers link")

    # ── 3. Fix dead Decision Reports link ────────────────────────────────
    reports_patterns = [
        (r'<a\s+href=["\']#["\']>\s*Decision Reports\s*</a>', '<a href="/coming-soon.html">Decision Reports</a>'),
    ]
    for pattern, replacement in reports_patterns:
        new_content = re.sub(pattern, replacement, content, flags=re.IGNORECASE)
        if new_content != content:
            content = new_content
            changes.append("Fixed dead Decision Reports link")

    # ── 4. Inject Google Analytics before </head> ────────────────────────
    if GA_MEASUREMENT_ID not in content and "googletagmanager" not in content:
        content = content.replace("</head>", GA_SNIPPET + "\n</head>", 1)
        changes.append("Injected Google Analytics")
    else:
        changes.append("GA already present (skipped)")

    # ── 5. Add Cookie Settings button to footer ──────────────────────────
    if "resetCookieConsent" not in content:
        # Try to inject before </footer>
        if "</footer>" in content:
            content = content.replace(
                "</footer>",
                f"\n{COOKIE_SETTINGS_BTN}\n{COOKIE_RESET_JS}\n</footer>",
                1
            )
            changes.append("Added Cookie Settings button")
        else:
            # Inject before </body> as fallback
            content = content.replace("</body>", f"\n{COOKIE_SETTINGS_BTN}\n{COOKIE_RESET_JS}\n</body>", 1)
            changes.append("Added Cookie Settings button (body fallback)")

    # ── 6. Fix contact form → Formspree ──────────────────────────────────
    if filename == "contact.html" and "formspree" not in content.lower():
        # Look for <form> tag without action and add Formspree
        old_form = re.search(r'<form([^>]*?)>', content)
        if old_form:
            form_tag = old_form.group(0)
            if 'action=' not in form_tag:
                new_form_tag = form_tag.replace(
                    '<form',
                    f'<form action="https://formspree.io/f/{FORMSPREE_CONTACT_ID}" method="POST"'
                )
                content = content.replace(form_tag, new_form_tag, 1)
                changes.append("Wired contact form to Formspree")
            else:
                changes.append("Contact form already has action (skipped)")

    # ── 7. Fix intelligence/benchmarks newsletter forms ──────────────────
    if filename in ("intelligence.html", "benchmarks.html") and "formspree" not in content.lower():
        # Add action to any bare <form> tags
        old_form = re.search(r'<form([^>]*?)>', content)
        if old_form:
            form_tag = old_form.group(0)
            if 'action=' not in form_tag:
                new_form_tag = form_tag.replace(
                    '<form',
                    f'<form action="https://formspree.io/f/{FORMSPREE_BLOG_ID}" method="POST"'
                )
                content = content.replace(form_tag, new_form_tag, 1)
                changes.append(f"Wired newsletter form to Formspree")

    # ── 8. Fix waitlist form on index ────────────────────────────────────
    if filename == "index.html" and "formspree" not in content.lower():
        # Find the waitlist <form> near id="waitlist"
        waitlist_section = content.find('id="waitlist"')
        if waitlist_section > 0:
            form_pos = content.find('<form', waitlist_section)
            if form_pos > 0:
                form_end = content.find('>', form_pos) + 1
                form_tag = content[form_pos:form_end]
                if 'action=' not in form_tag and 'supabase' not in form_tag.lower():
                    new_form_tag = form_tag.replace(
                        '<form',
                        f'<form action="https://formspree.io/f/{FORMSPREE_WAITLIST_ID}" method="POST"'
                    )
                    content = content[:form_pos] + new_form_tag + content[form_end:]
                    changes.append("Wired waitlist form to Formspree")

    # ── Write file if changed ─────────────────────────────────────────────
    if content != original:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ✅ {filename}")
        for c in changes:
            print(f"     └─ {c}")
    else:
        print(f"  ─  {filename} (no changes needed)")


def copy_new_files():
    """Copy new files from the new-files directory if it exists alongside this script."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    new_files_dir = os.path.join(script_dir, "new-files")

    if not os.path.exists(new_files_dir):
        print("  ⚠️  new-files/ directory not found — skip copy step")
        return

    import shutil
    files_to_root = ["robots.txt", "sitemap.xml", "coming-soon.html", "blog.html"]
    for fname in files_to_root:
        src = os.path.join(new_files_dir, fname)
        dst = os.path.join(os.getcwd(), fname)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"  📄 Copied: {fname}")

    # Create articles directory
    articles_dir = os.path.join(os.getcwd(), "articles")
    os.makedirs(articles_dir, exist_ok=True)
    template_src = os.path.join(new_files_dir, "article-template.html")
    template_dst = os.path.join(articles_dir, "template.html")
    if os.path.exists(template_src) and not os.path.exists(template_dst):
        shutil.copy2(template_src, template_dst)
        print(f"  📄 Copied: articles/template.html")

    # Create .gitkeep so articles/ gets tracked
    gitkeep = os.path.join(articles_dir, ".gitkeep")
    if not os.path.exists(gitkeep):
        open(gitkeep, 'w').close()


def main():
    print("=" * 60)
    print("  KPI Hub — Production Fix Patcher")
    print("  Run from root of kpihub-website repo")
    print("=" * 60)
    print()

    # Validate we're in the right directory
    if not os.path.exists("index.html"):
        print("❌ index.html not found.")
        print("   Run this script from the ROOT of your kpihub-website repo.")
        print("   Example: cd ~/kpihub-website && python3 kpihub_patch.py")
        return

    # Check config
    warnings = []
    if GA_MEASUREMENT_ID == "G-XXXXXXXXXX":
        warnings.append("⚠️  GA_MEASUREMENT_ID not set — get it from analytics.google.com")
    if "REPLACE" in FORMSPREE_CONTACT_ID:
        warnings.append("⚠️  FORMSPREE_CONTACT_ID not set — sign up at formspree.io (free)")
    if "REPLACE" in FORMSPREE_WAITLIST_ID:
        warnings.append("⚠️  FORMSPREE_WAITLIST_ID not set — create a second Formspree form")

    if warnings:
        print("📋 CONFIG WARNINGS (fix these before running for production):")
        for w in warnings:
            print(f"   {w}")
        print()

    print("📂 Copying new files...")
    copy_new_files()
    print()

    print("🔧 Patching existing pages...")
    for page in PAGES:
        patch_file(page)

    print()
    print("=" * 60)
    print("✅ Patch complete!")
    print()
    print("NEXT STEPS:")
    print("  1. Open kpihub_patch.py and fill in GA_MEASUREMENT_ID + Formspree IDs")
    print("  2. Re-run the script once IDs are set")
    print("  3. Verify locally: open index.html in browser")
    print("  4. Deploy:")
    print('     git add -A')
    print('     git commit -m "fix: production readiness — SEO, forms, blog, dead links"')
    print('     git push origin main')
    print()
    print("  5. Submit sitemap to Google Search Console:")
    print("     https://search.google.com/search-console")
    print("     → Add property → thekpihub.com → Sitemaps → sitemap.xml")
    print()
    print("  6. DMARC upgrade in Hostinger DNS panel:")
    print("     TXT @  v=DMARC1; p=quarantine; rua=mailto:info@thekpihub.com; pct=100")
    print("=" * 60)


if __name__ == "__main__":
    main()
