#!/usr/bin/env python3
"""
publish_articles.py — KPI Hub Article Pipeline → Website Publisher

Usage (from kpihub-pipeline repo):
    python3 publish_articles.py

Reads:    ./output/articles.json   (your existing pipeline output)
Writes:   ../kpihub-website/articles/[slug].html
Updates:  ../kpihub-website/blog.html  (injects article cards)
Updates:  ../kpihub-website/sitemap.xml (appends new URLs)
"""

import json
import os
import re
import shutil
from datetime import datetime
from pathlib import Path

# ─── CONFIG ────────────────────────────────────────────────────────────────
PIPELINE_OUTPUT    = Path("./output/articles.json")   # adjust if different
WEBSITE_ROOT       = Path("../kpihub-website")         # adjust if different
ARTICLES_DIR       = WEBSITE_ROOT / "articles"
BLOG_PAGE          = WEBSITE_ROOT / "blog.html"
SITEMAP            = WEBSITE_ROOT / "sitemap.xml"
TEMPLATE           = ARTICLES_DIR / "template.html"
# ────────────────────────────────────────────────────────────────────────────

CATEGORY_ICONS = {
    "Funding":    "💰",
    "Product":    "🚀",
    "M&A":        "🤝",
    "Benchmarks": "📊",
    "People":     "👥",
    "Regulation": "⚖️",
    "Analysis":   "🔍",
}

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text[:80]

def load_articles() -> list:
    """Load articles from pipeline output JSON."""
    if not PIPELINE_OUTPUT.exists():
        # Try alternate paths
        alternates = [
            Path("./data/articles.json"),
            Path("./articles.json"),
            Path("./output/signals.json"),
            Path("./data/signals.json"),
        ]
        for alt in alternates:
            if alt.exists():
                print(f"  📂 Found articles at: {alt}")
                with open(alt, "r", encoding="utf-8") as f:
                    return json.load(f)

        print(f"❌ No articles.json found at {PIPELINE_OUTPUT}")
        print("   Expected format: list of objects with keys:")
        print('   { "title", "slug"(optional), "category", "summary", "body", "source", "published_at" }')
        return []

    with open(PIPELINE_OUTPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Handle both list and dict-wrapped formats
    if isinstance(data, dict):
        data = data.get("articles", data.get("signals", data.get("items", [])))

    return data

def generate_article_html(article: dict) -> str:
    """Generate full article HTML from template."""
    if not TEMPLATE.exists():
        raise FileNotFoundError(f"Template not found at {TEMPLATE}. Run kpihub_patch.py first.")

    with open(TEMPLATE, "r", encoding="utf-8") as f:
        template = f.read()

    slug = article.get("slug") or slugify(article.get("title", "untitled"))
    body = article.get("body", article.get("content", ""))

    # Convert plain text body to HTML paragraphs if needed
    if body and "<p>" not in body and "<h2>" not in body:
        paragraphs = [p.strip() for p in body.split("\n\n") if p.strip()]
        body = "".join(f"<p>{p}</p>" for p in paragraphs)

    html = template
    html = html.replace("{{TITLE}}", article.get("title", "Untitled"))
    html = html.replace("{{SLUG}}", slug)
    html = html.replace("{{CATEGORY}}", article.get("category", "Analysis"))
    html = html.replace("{{SUMMARY}}", article.get("summary", "")[:160])
    html = html.replace("{{BODY}}", body)
    html = html.replace("{{SOURCE}}", article.get("source", "KPI Hub Research"))
    html = html.replace("{{DATE}}", article.get("published_at", datetime.today().strftime("%Y-%m-%d")))

    return html, slug

def build_blog_card(article: dict) -> str:
    """Generate a single article card HTML for blog.html injection."""
    slug = article.get("slug") or slugify(article.get("title", "untitled"))
    category = article.get("category", "Analysis")
    icon = CATEGORY_ICONS.get(category, "📌")
    date = article.get("published_at", "")
    try:
        date_fmt = datetime.strptime(date, "%Y-%m-%d").strftime("%b %d, %Y")
    except:
        date_fmt = date

    return f"""
    <a class="article-card" href="/articles/{slug}.html" data-category="{category}">
      <div class="card-cat">{icon} {category}</div>
      <div class="card-title">{article.get('title', 'Untitled')}</div>
      <div class="card-summary">{article.get('summary', '')[:140]}{'…' if len(article.get('summary','')) > 140 else ''}</div>
      <div class="card-footer">
        <span class="card-date">{date_fmt}</span>
        <span class="card-arrow">Read →</span>
      </div>
    </a>"""

def update_blog_html(articles: list):
    """Inject article cards into blog.html between ARTICLES_INJECT_HERE markers."""
    if not BLOG_PAGE.exists():
        print(f"  ⚠️  {BLOG_PAGE} not found — run kpihub_patch.py first")
        return

    with open(BLOG_PAGE, "r", encoding="utf-8") as f:
        blog_html = f.read()

    # Build all cards sorted by date (newest first)
    sorted_articles = sorted(
        articles,
        key=lambda x: x.get("published_at", "0000-00-00"),
        reverse=True
    )
    cards_html = "\n".join(build_blog_card(a) for a in sorted_articles)

    # Remove empty state if articles exist
    updated = re.sub(
        r'<!-- ARTICLES_INJECT_HERE -->.*?(?=\s*</div>\s*</div>)',
        f'<!-- ARTICLES_INJECT_HERE -->\n{cards_html}',
        blog_html,
        flags=re.DOTALL
    )

    # Also replace the empty-state div
    updated = re.sub(
        r'<div class="empty-state"[^>]*>.*?</div>',
        '',
        updated,
        flags=re.DOTALL
    )

    # Update article count in hero
    updated = re.sub(
        r'id="article-count">[^<]*<',
        f'id="article-count">{len(articles)}<',
        updated
    )

    with open(BLOG_PAGE, "w", encoding="utf-8") as f:
        f.write(updated)

    print(f"  ✅ Updated blog.html with {len(articles)} article cards")

def update_sitemap(slugs: list):
    """Append new article URLs to sitemap.xml."""
    if not SITEMAP.exists():
        print(f"  ⚠️  sitemap.xml not found — skipping sitemap update")
        return

    with open(SITEMAP, "r", encoding="utf-8") as f:
        sitemap = f.read()

    today = datetime.today().strftime("%Y-%m-%d")
    new_urls = ""
    for slug in slugs:
        url = f"https://thekpihub.com/articles/{slug}.html"
        if url not in sitemap:
            new_urls += f"""  <url>
    <loc>{url}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n"""

    if new_urls:
        sitemap = sitemap.replace("</urlset>", new_urls + "</urlset>")
        with open(SITEMAP, "w", encoding="utf-8") as f:
            f.write(sitemap)
        print(f"  ✅ Added {len(slugs)} URLs to sitemap.xml")

def main():
    print("=" * 60)
    print("  KPI Hub — Article Publisher")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M IST')}")
    print("=" * 60)
    print()

    # Load articles
    print("📥 Loading articles from pipeline...")
    articles = load_articles()
    if not articles:
        print("❌ No articles to publish. Exiting.")
        return

    print(f"  Found: {len(articles)} articles")
    print()

    # Ensure articles dir exists
    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)

    # Generate article HTML pages
    print("📝 Generating article pages...")
    published_slugs = []
    for article in articles:
        try:
            html, slug = generate_article_html(article)
            output_path = ARTICLES_DIR / f"{slug}.html"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html)
            published_slugs.append(slug)
            print(f"  ✅ /articles/{slug}.html")
        except Exception as e:
            print(f"  ❌ Failed: {article.get('title', 'unknown')} — {e}")

    print()

    # Update blog.html
    print("🗞️  Updating blog.html...")
    update_blog_html(articles)
    print()

    # Update sitemap
    print("🗺️  Updating sitemap.xml...")
    update_sitemap(published_slugs)
    print()

    print("=" * 60)
    print(f"✅ Published {len(published_slugs)} articles")
    print()
    print("DEPLOY COMMAND (run from kpihub-website root):")
    print()
    print('  cd ../kpihub-website && \\')
    print('  git add articles/ blog.html sitemap.xml && \\')
    print(f'  git commit -m "feat: publish {len(published_slugs)} articles {datetime.today().strftime("%Y-%m-%d")}" && \\')
    print('  git push origin main')
    print()
    print("After push: GitHub Actions auto-deploys to Hostinger (~2 min)")
    print("=" * 60)


if __name__ == "__main__":
    main()
