# OpenSTEMTool — Scientific Workspace v2.0

[![CI Test Suite](https://github.com/karim8siam/openstemtool/actions/workflows/ci.yml/badge.svg)](https://github.com/karim8siam/openstemtool/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/karim8siam/openstemtool/actions/workflows/deploy.yml/badge.svg)](https://github.com/karim8siam/openstemtool/actions/workflows/deploy.yml)
[![Tools](https://img.shields.io/badge/STEM%20Tools-155%20Calculators-blue.svg)](https://openstemtool.org/)
[![Departments](https://img.shields.io/badge/Academic%20Departments-38-emerald.svg)](https://openstemtool.org/)
[![Offline First](https://img.shields.io/badge/Architecture-100%25%20Offline--First-orange.svg)](https://openstemtool.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Manifest%20%26%20Mobile%20Ready-purple.svg)](https://openstemtool.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **155 independently executable scientific tools • 38 academic departments • 13 STEM subject domains • 100% client-side vanilla JavaScript & modern CSS.**

OpenSTEMTool is an open, offline-first scientific workspace engineered for university students, educators, researchers, and lab practitioners. It provides instant, reproducible computations with interactive sensitivity graphs, step-by-step mathematical formulas, CSV/JSON data export, and publication-ready SVG/PNG chart generation—with zero server tracking, zero external dependencies, and zero login barriers.

---

## 🌐 OpenSTEM Ecosystem

OpenSTEMTool operates as part of the broader **OpenSTEM** open-science initiative:

* 🏛️ **[OpenSTEM Field](https://openstemfield.org/)** — **Flagship Ecosystem Hub**: Global directory of scientific research programs, graduate scholarships, and university fellowships.
* 🔬 **[OpenSTEM Lab](https://openstemlab.org/)** — Virtual scientific simulations, interactive lab experiments, and hands-on modules.
* 📚 **[OpenSTEM Library](https://openstemlibrary.com/)** — Open university textbooks, academic monographs, and fundamental scientific theory.
* 💬 **[Discord Community](https://discord.com/invite/tBBKtvFJzW)** — Connect with STEM students, researchers, and contributors.
* ✉️ **Direct Contact**: [`shahriyarkarimsiam@gmail.com`](mailto:shahriyarkarimsiam@gmail.com)

---

## 🚀 Quick Start (Local Development)

The platform is built with modern ES Modules and native web standards. Run a local HTTP server from the project directory:

### Using Python (recommended)
```bash
python3 -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Using Node.js
```bash
npm start
```

---

## 🧪 Testing & Validation

The project includes an automated test suite verifying mathematical accuracy, boundary condition handling, structured Schema.org data, and DOM rendering:

```bash
# Run the complete test suite (29 test cases across all 155 tools)
npm test

# Build production static pages, canonical tags, and XML sitemap
npm run build
```

---

## 📦 Project Structure

```text
openstemtool/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Node.js matrix CI pipeline (Node 18, 20, 22)
│       └── deploy.yml                 # Automated build, test & deploy to GitHub Pages
├── 404.html                           # Client-side SPA fallback for deep routing
├── manifest.json                      # Progressive Web App (PWA) manifest
├── vercel.json                        # 1-Click Vercel configuration & security headers
├── netlify.toml                       # 1-Click Netlify configuration & redirect rules
├── sitemap.xml                        # Google-compliant XML sitemap (156 URLs)
├── robots.txt                         # Search engine directives pointing to sitemap.xml
├── index.html                         # Crawlable, accessible homepage
├── assets/
│   ├── css/
│   │   └── styles.css                 # Responsive stylesheet & theme tokens
│   ├── js/
│   │   ├── app.js                     # Core application shell & client-side router
│   │   ├── core.js                    # Numerical algorithms & statistical math engine
│   │   ├── plots.js                   # SVG graph renderer & image exporters
│   │   ├── tools.js                   # Foundational 20 tool implementations
│   │   └── expanded-tools.js          # 135 expanded department calculators
│   └── icon.svg                       # High-resolution vector emblem & app icon
├── tools/
│   └── <id>/
│       └── index.html                 # 155 statically pre-rendered SEO entry pages
├── templates/
│   └── index.template.html            # Static HTML generation source template
├── scripts/
│   └── build-pages.mjs                # Static page, metadata & sitemap compiler
├── tests/                             # Mathematical & structural test suites
├── samples/                           # Public scientific test datasets
└── docs/                              # QA checklists, SEO guides, and department index
```

---

## 🔍 SEO & Google Search Console (GSC) Setup

OpenSTEMTool is built from the ground up for search engine discovery and rich snippet eligibility:

### 1. Schema.org Rich Snippets
Every tool page features a multi-type JSON-LD `@graph` containing:
- **`WebApplication`**: Declares pricing (`$0`), free access, feature list, and author/publisher.
- **`BreadcrumbList`**: Hierarchical path (`OpenSTEMTool > Department > Tool Name`).
- **`FAQPage`**: 4 structured FAQs per tool covering formula, inputs, assumptions, and export options.
- **`HowTo`**: Step-by-step instructions for inputting parameters, computing, and analyzing output.

### 2. Custom Domain Configuration
To generate your XML sitemap and canonical links for a specific domain:

```bash
SITE_URL=https://your-custom-domain.com npm run build
```

### 3. Google Search Console Checklist
1. Deploy the site to your hosting provider (GitHub Pages, Vercel, Netlify, or Cloudflare Pages).
2. Open [Google Search Console](https://search.google.com/search-console).
3. Add your property (Domain or URL Prefix).
4. Verify ownership via DNS TXT record or HTML meta tag.
5. In the **Sitemaps** section, submit `https://your-domain.com/sitemap.xml`.
6. Use the **URL Inspection** tool and **Rich Results Test** to verify structured data.

---

## 🚢 Deployment Options

### Option 1: GitHub Pages (Automated CI/CD)
The repository includes `.github/workflows/deploy.yml`. To activate:
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every push to `main` will automatically test, compile, and deploy the site.

### Option 2: Vercel
Import the repository into [Vercel](https://vercel.com). The included `vercel.json` automatically configures route fallbacks and security headers.

### Option 3: Netlify
Deploy via [Netlify](https://netlify.com). The included `netlify.toml` handles build commands and single-page application rewrites.

---

## 📄 License & Attribution

Distributed under the **MIT License**. See `LICENSE` for details.
Part of the **OpenSTEM Ecosystem** — Open tools. Reproducible results.
