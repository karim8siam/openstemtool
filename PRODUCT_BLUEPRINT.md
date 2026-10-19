# OpenSTEMTool Universal v2.0 — Product Blueprint

This new version supersedes the former 20-tool-only design. See `README.md` for the active implementation, `docs/TOOLS_CATALOG.csv` for all 155 tools, `docs/DEPARTMENT_COVERAGE.md` for 38 departments, and `docs/CRITICISM_ENGINE.md` for quality gates.

---

# OpenSTEMTool — Implemented Product Blueprint and Next Releases

## Scope and delivered product

This project is a standalone static scientific computing application: HTML, CSS, vanilla JavaScript, no production npm dependencies, and no server-side computation. All 20 initial scientific tools are functional at their documented scope. The tools intentionally share calculation, visualization, CSV import, project storage, and export infrastructure.

### User problems addressed

1. Students cannot easily convert basic experimental data into properly labeled graphs and interpretable results.
2. Basic coursework often requires numerical scientific calculations and visual explorations without an expensive numerical software license.
3. Students need to preserve assumptions, intermediate input datasets, and methods when exporting results.
4. OpenSTEM users should transition from theoretical content and experiments to computational work with minimal friction.

### Initial audience

University students taking physics, mathematics, statistics, chemistry, engineering, and compulsory quantitative laboratory courses. Small numbers of instructors and student researchers can provide critical early validation.

## Information architecture

```text
Homepage
├── All tools (search and category filters)
│   ├── Data & Research (6)
│   ├── Mathematics (7)
│   ├── Physics (4)
│   ├── Engineering (2)
│   └── Chemistry (1)
├── Scientific tool pages (20; each with input/output/methodology/export)
├── Saved projects (local)
└── Getting started
```

## Functional user journeys

- **Laboratory**: OpenSTEM Lab → export CSV readings → OpenSTEMTool data import → graph/regression/uncertainty → HTML report → browser print to PDF.
- **Mathematics**: OpenSTEM Library → read theory → linked tool → adjust expression or vectors → evaluate numeric/visual output → export SVG/JSON.
- **Self-study**: Search OpenSTEMTool → solve a scientific problem → inspect methods/assumptions → save browser project → return later.
- **Academic development**: Build a small portfolio of reproducible analyses → follow education/research opportunities on OpenSTEM Field (no automatic scholarship qualification or profile matching).

## Design system

- Background: pale cool gray (#f5f8f8), card white (#ffffff), side navigation midnight teal (#112733).
- Primary accent: scientific teal (#087e80); supporting warm orange (#ef9951) for comparative series.
- Typography: system UI stack, readable variable size. Dark theme uses the same surface hierarchy.
- Desktop: fixed sidebar + sticky-height topbar + responsive card grid + tool input/output workspace.
- Mobile: drawer menu; single-column scientific workspaces; graph SVG responsive to viewport.
- Accessibility: programmatic labels for input controls, keyboard-focus styling, tab controls, alt descriptions in primary graph SVG, data table for many plotted analyses.

## Computation and validation architecture

```text
UI forms (app.js)
  → input validation and numerical kernels (core.js)
  → tool-specific calculations (tools.js)
  → chart SVG rendering (plots.js)
  → metrics, method and assumptions
  → CSV / SVG / PNG / JSON / printable report
```

`compileExpression` parses a restricted grammar and never passes expressions to arbitrary JavaScript evaluation. The first implementation uses bounded sizes and local computations; move heavy workloads to Web Workers if actual profiling demonstrates need. Numerical methods and approximations should be reviewed against authoritative references before academic/research adoption.

## Planned external data schema

`integrations/experiment-exchange.schema.json` defines a PROPOSED future shared format; it is not presently a live integration on the existing OpenSTEM sites. It distinguishes simulated, physical, and synthetic data, includes columns and units, and declares a target analysis template. First release intentionally supports CSV import and related links, which don't require changes to the existing sites.

## SEO and deployment

20 separate static paths in `/tools/<slug>/` are pre-generated from the source catalog, including original model explanations and limitations. The root path is `/`. SEO sitemap generation uses a real deployment domain via `SITE_URL` — there is no made-up production URL. Page indexing and AdSense approval remain independent of a working website.

## Release gates and objective metrics

| Release | Requirements | Measured checkpoint |
|---|---|---|
| Internal build | 20 mathematically functional tools | All known numeric reference tests pass; no known critical default errors |
| Limited public beta | Accessible, responsive tool navigation and exports | 30–50 university beta users; representative task completion target ≥80% |
| Production launch | Cross-browser acceptance QA, content review, reliability | No known severe math defects; stable page behavior on modern desktop/mobile browsers |
| Scale | University and cross-platform use | Meaningful repeat use rather than only total page impressions |

The initial beta quality targets are planning objectives, not achieved metrics.

## Post-release priorities

1. **Quality before volume**: independent reference datasets, error handling and performance tests per tool, especially curve fitting and scientific uncertainty.
2. **CSV column mapping and unit checks**: user-selectable columns, units metadata, and robust large-file sampling.
3. **Graph interaction**: better tooltip/crosshair, zoom/pan, annotations, confidence intervals, and customizable color/line semantics.
4. **3D fidelity**: true 3D library for dense meshes if research-grade visualization becomes necessary.
5. **Formal cross-site integration**: implement an explicit opt-in exchange with OpenSTEM Lab, preserving origin/provenance and avoiding auto-upload of private observations.
6. **Accessibility**: keyboard-driven chart inspection and WCAG-oriented audits.
7. **Institutional features**: consider class datasets and instructor workspaces only after actual adoption.
8. **Monetization**: only test after real traffic and policy review; do not assume calculator pages are ad eligible.

## Honest limitations of this implementation

It is functional software, not a certified scientific instrument. The UI has passed a mocked-DOM rendering smoke test, but the development environment prevented an automated Chromium visual acceptance run. A real-device browser review is still required. This release deliberately excludes login, hosted storage, payments, collaboration, realtime Lab API, full symbolic computer algebra, general weak acid-base chemistry, and full electric field-line integration.
