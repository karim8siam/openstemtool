# OpenSTEMTool Universal — Scientific Workspace v2.0

**155 independently executable tools • 38 academic departments • 13 scientific subject areas • HTML, CSS, vanilla JavaScript.**

OpenSTEMTool Universal expands the previous 20-tool application with **135 additional, formula-based calculators**. The original twenty include richer plotting and scientific data workflows. The 135 new tools each perform a specific mathematical calculation; many also have a parameter-sensitivity graph. This is a **working educational alpha/beta project**, not a claim that all 155 models have been externally peer-reviewed or tested in every possible browser and input condition.

### Quick start (Mac / Windows / Linux)

The website uses modern browser ES modules. **Run a local HTTP server rather than opening `index.html` directly:**

```bash
cd OpenSTEMTool_Universal
python3 -m http.server 8080
```

Visit **http://localhost:8080**. You do not need to install Node, npm dependencies, a database, or any paid AI API to use the pre-generated pages.

### Included experiences

- Responsive dashboard and 13 subject sections.
- **38 academic departments** in a filter and directory; seven deliberately have no standalone calculator because a reliable, useful model was not added.
- **155 tool workspaces**, each with editable inputs, computed results, method and limitations, and numerical table export.
- Parameter-sweep line plots in numerous formula calculators; established graph studio, vector/field graphs and other visualizations remain.
- Search, department filtering, theme toggle, favourites, saved work in browser local storage, sample CSV data, basic CSV import into applicable tools.
- JSON/CSV export and downloadable, **printable HTML** reports; supported graph pages also offer SVG/PNG downloads. **The report is not automatically a binary PDF**: open the HTML in your browser and choose Print → Save as PDF.
- Link integration with OpenSTEM Library (https://openstemlibrary.com/), OpenSTEM Lab (https://openstemlab.org/) and OpenSTEM Field (https://openstemfield.org/). **No account-connected API integration** is implemented.

### Directory map

```text
OpenSTEMTool_Universal/
  index.html                      Generated crawlable homepage
  assets/css/styles.css           Responsive stylesheet, light/dark themes
  assets/js/app.js                Browser UI, routing and buttons
  assets/js/core.js               Shared statistical/numerical helpers
  assets/js/plots.js              SVG plot renderer and image exporters
  assets/js/tools.js              First 20 tools and combined catalog
  assets/js/expanded-tools.js     135 added model calculators + departments
  tools/<id>/index.html           155 generated HTML entry pages
  templates/index.template.html   Source HTML template (do not edit generated copy)
  scripts/build-pages.mjs         Static landing page + SEO generation
  samples/                       Public example datasets
  integrations/                  Example exchange files (not a live API)
  tests/                         Mathematical, SEO and simulated-DOM test suite
  docs/                          Department list, limitations, QA and SEO instructions
  package.json                    Optional Node build/test scripts
  robots.txt                      Crawl permission (no fake domain)
```

### Testing — repeatable criticism engine

Requires **Node.js 22+** only for automated checks and generating production sitemap. From the project folder:

```bash
npm test
npm run build
npm test
```

There are currently **29 automated test cases**, covering 155 default calculations, changed inputs, invalid inputs, known scientific reference cases, uniqueness of every generated tool page, structured data, rendering and an action-simulation DOM harness. These are **not** 29 tests *per tool*, and they cannot guarantee no errors. Real Chromium end-to-end UI automation could not be completed in the execution environment because Chromium blocked local-page navigation; perform the manual cross-browser checks in `docs/MANUAL_QA_CHECKLIST.md` before going live.

### IMPORTANT: configure the real domain before public deployment

A correct production sitemap and canonical tags **require the actual HTTPS domain that you own and have deployed**. This domain has not yet been supplied. To generate for your real domain:

```bash
SITE_URL=https://YOUR-ACTUAL-DOMAIN.com npm run build
```

Replace the example hostname **with a domain you own**. This generates `sitemap.xml`, adds absolute canonical URLs to all 156 indexable pages (homepage plus tools), and updates `robots.txt`. Review the exact URLs **before uploading**. Re-run `npm test` afterward.

If `SITE_URL` is missing, the builder intentionally removes `sitemap.xml` and does not emit fake canonical URLs. This ZIP is packaged in that safe **domain-unconfigured** state. See `docs/SEO_DEPLOYMENT.md` for specific instructions for Google Search Console and canonical checks. A sitemap helps discovery; **it does not guarantee ranking, indexation or AdSense acceptance**.

### Production deployment

Deploy the **contents** of this folder as a static website at the domain root so `/tools/<id>/` resolves to `/tools/<id>/index.html`. You can use GitHub with a static deployment platform (Cloudflare Pages, Netlify, Vercel static). Do not use a subdirectory deployment without adjusting the absolute links and `<base href="/">`.

### Technical limits and integrity

- All calculations happen locally. Upload a dataset only after ensuring appropriate confidentiality; browser file-reading logic does not send it to an external computation API.
- You are responsible for verifying scientific assumptions and units. Complex professional domains (medicine, civil engineering, aerospace, law, finance) are **educational models, not professional tools**.
- The 155 separate tools are a **large beta catalog**; it should be released with quality gates, user feedback and professional review of higher-impact topics rather than marketed as infallible.
- The unconfigured ZIP does not promise real-world search placement. The site must be published on your verified domain and inspected with Google Search Console.

Source license: see LICENSE. The project is pure HTML/CSS/JS without an npm installation requirement at runtime.
