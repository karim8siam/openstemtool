# Browser acceptance checklist — required before claiming a production release

The automated runtime was not permitted to load local URLs in Chromium. **This manual browser audit is still outstanding** and must be completed on a normal computer before publishing.

## Device and browser matrix

[ ] Chrome on Mac/Windows desktop
[ ] Safari on macOS/iOS
[ ] Firefox desktop
[ ] Chrome Android / small mobile viewport
[ ] Keyboard-only navigation and large text accessibility

## Primary actions

[ ] Homepage loads without console errors or misplaced cards
[ ] Top search opens full catalog; typing narrows cards; clearing restores them
[ ] Every category and department selector filters as labeled; 0-tool departments show a useful empty state
[ ] Sidebar opens and closes correctly on mobile; backdrop and Escape dismiss it
[ ] From catalog open a numerical calculator using actual direct URL
[ ] Edit inputs, Calculate, see updated output; clear a required input and see actionable error
[ ] Reset restores default values; invalid input does not persist as an apparently valid result
[ ] Save project, visit projects, reopen it and verify restored input values
[ ] Toggle favorite, verify state persists after reloading
[ ] Switch dark/light mode, refresh and verify preference is retained
[ ] Download JSON and CSV, inspect actual file contents
[ ] Download SVG and PNG from Graph Studio, open in browser/image app
[ ] Download HTML Report, open and print to PDF; note the exported file is HTML
[ ] Import CSV on data-capable tools; test comma-separated, quoted values, malformed rows and 5 MB limit
[ ] Check charts and data tables at mobile width; ensure no horizontal page overflow
[ ] Check direct URLs for at least 20 randomly selected tools in different subjects
[ ] Check link integration to OpenSTEM Library / Lab / Field
[ ] Inspect network for unexpected background data uploads; calculations should be local

## Risk-based mathematical checking

[ ] Verify numerical examples independently for physics, chemistry, statistics, economics and engineering
[ ] Test division-by-zero, impossible geometry, zero/negative physical dimensions, noninteger event counts
[ ] Test ambiguous units and very large numbers for error messaging and stable output
[ ] Check that medical / pharmaceutical calculators do not imply diagnosis or dose recommendations
[ ] Validate PDF-printed report, graph axes, SVG line visibility in light and dark mode

File issues with tool ID, URL, browser, inputs, observed output, expected output and reference calculation.
