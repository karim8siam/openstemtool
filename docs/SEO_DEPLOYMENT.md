# Google Search Console & SEO — practical production instructions

## Critical prerequisite: use the real domain

Sitemap URLs MUST use your deployed, owned HTTPS origin. Before launch, run (replacing with YOUR domain):

```bash
SITE_URL=https://YOUR-ACTUAL-DOMAIN.com npm run build
npm test
```

Generated assets:
- `/index.html` with crawlable headings and links to all working tools
- `/tools/<tool-id>/index.html` for all 155 tools, including a distinct title, meta description, formula description, default data example, method, limitations, related tools and JSON-LD `WebApplication` / breadcrumb objects
- `/sitemap.xml` with 156 fully qualified URLs (home + each of the 155 tools)
- `/robots.txt` with `Sitemap: https://your-real-domain/sitemap.xml`
- `<link rel="canonical">` on every indexable URL

**Never submit a sitemap whose domain was invented or is an example domain.**

## After deployment

1. Check `https://your-real-domain/` loads and actually shows the interactive catalog.
2. Check `https://your-real-domain/tools/ohms-law/` loads the calculator on direct entry, not a blank app shell.
3. Check `https://your-real-domain/sitemap.xml` returns HTTP 200 and XML with 156 URLs; check `https://your-real-domain/robots.txt`.
4. Verify the domain property in Google Search Console by following Google's domain ownership verification.
5. Submit **only your genuine deployed** sitemap URL in the Sitemaps section.
6. Use URL Inspection to test real rendering of the homepage and 3–5 tool URLs. Request indexing when appropriate.
7. Monitor Pages/Indexing reports, canonical choices, crawl problems, Core Web Vitals and search queries.
8. Periodically revise explanations with original examples and factual corrections instead of mass-creating shallow clones.

## SEO constraints

- Sitemap XML improves discovery and informs canonical discovery; **does not guarantee indexing or ranking**.
- JSON-LD Software/WebApplication markup describes the actual browser-based tool; **does not guarantee rich results**.
- Only pages with useful unique content should be indexed; this build emits individual formula, inputs, actual example outputs and limitations rather than empty placeholder landing pages.
- Avoid stock SEO claims, fabricated ratings, fabricated FAQ markup and fake testimonials.
- Use no `lastmod` unless modification times are genuine.
- If you deploy at a new domain, rebuild with the new URL first. Do not mix http/https or www/non-www.
- Static routes require hosting support for directory `index.html` behavior. Avoid broad single-page rewrites that replace all standalone tool HTML.

## References

- Google Search Central: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central structured data for apps: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Google Search Central AI-generated/scaled pages: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
