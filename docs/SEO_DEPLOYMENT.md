# Google Search Console (GSC) & Sitemap XML — Master Optimization Guide

This document details every rule, standard, and technical implementation required to achieve **top-tier Google search rankings** for all 155 calculators on OpenSTEMTool.

---

## 1. Google Search Console & Sitemap Rules

### Rule 1: Canonical URL & Origin Consistency
* Every URL in `sitemap.xml` **must** match the `<link rel="canonical">` tag on the page character-for-character.
* All URLs must use `https://`, have consistent trailing slashes (`/tools/ohms-law/`), and use a consistent domain (no mixing of `www` and non-`www`).
* OpenSTEMTool automatically generates self-referential canonical tags on all 155 tool pages and the homepage.

### Rule 2: Valid XML Standard & Namespaces
* Must use standard UTF-8 encoding: `<?xml version="1.0" encoding="UTF-8"?>`.
* Must declare standard namespace: `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`.
* Limit: Under 50,000 URLs and under 50 MB per file (OpenSTEMTool has 156 URLs, ~28 KB, well within limits).

### Rule 3: Valid W3C Datetime in `<lastmod>`
* Google respects `<lastmod>` only when it reflects genuine, accurate page content updates in W3C ISO 8601 format (`YYYY-MM-DD`).
* OpenSTEMTool generates `<lastmod>` based on actual build timestamps.

### Rule 4: Clean HTTP 200 Status Codes Only
* Google strictly penalizes sitemaps that submit 404s, 500s, or 301/302 redirects.
* Every single URL in `sitemap.xml` is pre-rendered into static HTML (`/tools/<id>/index.html`) so static web servers return direct **HTTP 200 OK**.

### Rule 5: robots.txt Accessibility
* Googlebot must have uninhibited access to CSS and JavaScript assets to evaluate Core Web Vitals and client-side rendering.
* `robots.txt` must explicitly reference the canonical sitemap:
  ```txt
  User-agent: *
  Allow: /

  Sitemap: https://openstemtool.org/sitemap.xml
  ```

---

## 2. Google Ranking Strategy for High Search Positions

Google's Helpful Content System and Quality Rater Guidelines (E-E-A-T) rank calculators based on **immediate utility, depth of methodology, and trust**:

| Ranking Dimension | What Google Expects | OpenSTEMTool Implementation |
|---|---|---|
| **Immediate Utility (Above-the-Fold)** | Fast interactive calculation without aggressive ads or scrolling | Interactive calculation panel loads instantly above the fold; client-side evaluation executes in < 5ms |
| **Search Query Alignment** | Matching high-intent keywords like *"projectile motion calculator"*, *"RLC resonance formula"* | Titles and H1 tags dynamically include high-volume keywords: `${title} Calculator – Free Online ${category} Tool` |
| **Formula & Method Transparency** | Explicit mathematical derivations rather than "black-box" outputs | Dedicated formula section explaining exact equations, variables, and physics/math principles |
| **Step-by-Step Worked Examples** | Real parameter tables with realistic inputs and computed outputs | Crawlable parameter tables containing worked input examples and exact calculated metric results |
| **Model Limitations (E-E-A-T)** | Boundary conditions, small-angle approximations, domain validity | Transparent scientific caveats preventing inaccurate usage and establishing high academic authority |
| **Rich Snippets (SERP Features)** | Search dropdown FAQs, software application badges, breadcrumb trails | JSON-LD `@graph` containing `WebApplication`, `BreadcrumbList`, and `FAQPage` with 4 high-value Q&As per page |
| **Core Web Vitals** | LCP < 1.2s, CLS = 0, INP < 50ms | Lightweight static HTML + vanilla ES modules. Zero heavy frameworks (React/Vue/Next). 99+ Lighthouse score |
| **Topic Cluster Linking** | Internal contextual cross-links | 6 related tools linked on every page + categorical taxonomy + direct ecosystem links to OpenSTEM Field, Lab, and Library |

---

## 3. Deployment & Domain Configuration

To build with your production domain, run:

```bash
SITE_URL=https://your-domain.com npm run build
npm test
```

If `SITE_URL` is omitted, the build defaults to `https://openstemtool.org`.

### Google Site Verification
To automatically inject your Google Search Console verification meta tag into every page during build:

```bash
GOOGLE_SITE_VERIFICATION="your-verification-code-from-gsc" SITE_URL=https://your-domain.com npm run build
```

---

## 4. Step-by-Step Google Search Console Checklist

1. **Verify Domain Property in GSC**:
   * Open [Google Search Console](https://search.google.com/search-console).
   * Choose **Domain** verification (adds a DNS `TXT` record at your domain registrar). This covers both `https://`, `http://`, `www`, and non-`www` automatically.
   * Alternatively, use **URL prefix** with HTML meta tag or HTML file upload.
2. **Submit Sitemap**:
   * In GSC, navigate to **Indexing > Sitemaps**.
   * Enter: `sitemap.xml` and click **Submit**.
   * Status should read **Success** with 156 discovered pages.
3. **Inspect Key URLs**:
   * Use the **URL Inspection** bar at the top to test:
     * `https://your-domain.com/`
     * `https://your-domain.com/tools/graph-studio/`
     * `https://your-domain.com/tools/projectile/`
     * `https://your-domain.com/tools/rlc/`
   * Click **Test Live URL**.
   * Confirm that Googlebot renders the page properly with structured data detected.
   * Click **Request Indexing**.
4. **Test Rich Results**:
   * Run your URL through Google's official [Rich Results Test](https://search.google.com/test/rich-results).
   * Confirm valid detection of:
     * `SoftwareApplication` / `WebApplication`
     * `BreadcrumbList`
     * `FAQ`
5. **Monitor Performance**:
   * Check **Performance > Search Results** to track impressions, click-through rates (CTR), and average keyword positions.
   * Review **Page indexing** reports to confirm 100% of tool pages are indexed without crawl issues.
