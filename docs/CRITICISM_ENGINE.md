# Criticism Engine — repeatable quality gates

This term denotes a repeatable TEST/AUDIT workflow, not an artificial-intelligence validator and not a guarantee of correctness.

1. **Registry integrity:** all tool slugs unique, associated with real fields, category and department.
2. **Default computation:** every model must return finite, readable metrics and chart coordinates.
3. **Reference comparison:** representative models compared to independent known calculations (not just code agreeing with itself).
4. **Input perturbation:** numeric inputs changed; models recompute and must not silently produce NaN.
5. **Invalid-domain checks:** division by zero, negative area, invalid probability, physically invalid assumptions must fail visibly.
6. **Static SEO checks:** dedicated landing pages include titles, descriptions, real model methodology, examples and valid application schema.
7. **Simulated interaction checks:** catalog keyword search, department filter, theme, favorites, project storage, reset and exports.
8. **Browser/manual gate still required:** normal real-browser navigation, mobile controls, CSV import, SVG/PNG downloads, actual file content and external links.
9. **Publication gate:** ownership-verified HTTPS domain, correctly generated 156-URL sitemap, successful HTTP response and direct-tool URLs.
10. **Monitoring:** bug report pipeline, failing test reproduction, update golden reference cases, rerun build and all tests after changes.

Commands:

```bash
npm run build
npm test
# set the actual domain on launch:
SITE_URL=https://YOUR-ACTUAL-DOMAIN.com npm run build
npm test
```

Known limits: browser end-to-end automation blocked in authoring environment; not all possible parameter combinations were audited; no external clinical or engineering certification; real deployment and Google Search Console were not accessed.
