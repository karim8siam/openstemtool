/**
 * OpenSTEMTool — Advanced Production SEO & Google Search Console Generator
 * Builds high-ranking, crawlable static HTML for all 155 scientific calculators.
 * Produces valid sitemap.xml, robots.txt, canonical URLs, and rich Schema.org markup.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tools,departments,categories} from '../assets/js/tools.js';

const root = resolve(import.meta.dirname, '..');
const template = await readFile(resolve(root, 'templates/index.template.html'), 'utf8');
const escape = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

// Production HTTPS origin: configurable via SITE_URL or defaults to official ecosystem domain
const defaultSite = 'https://openstemtool.org';
const rawSite = (process.env.SITE_URL || defaultSite).trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9][a-z0-9.-]+(?::[0-9]+)?$/i.test(rawSite) || /\.example$|example\.com|localhost|127\.0\.0\.1/i.test(rawSite)) {
  throw Error('SITE_URL must be a real owned HTTPS domain without path (e.g. https://openstemtool.org).');
}
const site = rawSite;
const today = new Date().toISOString().slice(0, 10);

const introMarker = /<main id="content" class="content" tabindex="-1">[\s\S]*?<\/main>/;
const jsonSafe = obj => JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
const catName = id => categories.find(c => c.id === id)?.label || id;
const deptName = id => departments.find(c => c.id === id)?.label || id;

function applyHead(html, title, description, url = '', jsonld = null) {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(description.slice(0, 160))}">`);

  let meta = [
    `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">`,
    `<meta property="og:site_name" content="OpenSTEMTool">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description.slice(0, 160))}">`,
    `<meta property="og:image" content="${escape(site)}/assets/icon.svg">`,
    `<meta property="og:image:type" content="image/svg+xml">`,
    `<meta property="og:image:width" content="512">`,
    `<meta property="og:image:height" content="512">`,
    `<meta property="og:image:alt" content="${escape(title)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:site" content="@openstem">`,
    `<meta name="twitter:title" content="${escape(title)}">`,
    `<meta name="twitter:description" content="${escape(description.slice(0, 160))}">`,
    `<meta name="twitter:image" content="${escape(site)}/assets/icon.svg">`,
    `<meta name="twitter:image:alt" content="${escape(title)}">`
  ];

  if (process.env.GOOGLE_SITE_VERIFICATION) {
    meta.push(`<meta name="google-site-verification" content="${escape(process.env.GOOGLE_SITE_VERIFICATION)}">`);
  }
  if (url) {
    meta.push(`<link rel="canonical" href="${escape(url)}">`);
    meta.push(`<meta property="og:url" content="${escape(url)}">`);
  }
  if (jsonld) {
    meta.push(`<script type="application/ld+json">${jsonSafe(jsonld)}</script>`);
  }

  return out.replace('</head>', meta.join('\n') + '\n</head>');
}

function readExample(t) {
  try {
    const v = Object.fromEntries(t.fields.map(f => [f.key, f.value]));
    return t.compute(v);
  } catch (e) {
    throw Error(`Tool ${t.id} default model failed during SEO build: ${e.message}`);
  }
}

const toolDirs = [];

for (const t of tools) {
  const result = readExample(t);
  
  // High CTR title optimized for search intent: "Projectile Motion Visualizer Calculator – Formula & Solver | OpenSTEMTool"
  const isCalc = /(calculator|studio|grapher|solver|converter|explorer)/i.test(t.title);
  const title = `${t.title}${isCalc ? '' : ' Calculator'} – Formula & Solver | OpenSTEMTool`;
  
  // High-converting meta description: 140-160 chars with action keywords and model specifics
  const desc = `Free online ${t.title.toLowerCase()} calculator: compute ${t.subtitle.toLowerCase()} with editable parameters, step-by-step formula and interactive chart export.`;

  const related = tools.filter(o => o.category === t.category && o.id !== t.id).slice(0, 6);
  const inputRows = t.fields.map(f => `<tr><th scope="row">${escape(f.label)}</th><td>${escape(f.value)}</td><td>${escape(f.unit || '—')}</td></tr>`).join('');
  const exampleRows = result.metrics.slice(0, 8).map(m => `<tr><th scope="row">${escape(m.label)}</th><td>${escape(m.value)}</td><td>${escape(m.unit || '—')}</td></tr>`).join('');
  const url = `${site}/tools/${t.id}/`;

  // FAQ content for rich SERP snippets
  const faq1Q = `How does the ${t.title} calculator work?`;
  const faq1A = `The calculator computes results locally in your browser using the established mathematical model: ${result.method || 'enter parameters to calculate outputs.'}`;
  
  const faq2Q = `What are the input parameters for ${t.title}?`;
  const faq2A = `The required parameters include: ${t.fields.map(f => `${f.label} (${f.unit || 'dimensionless'})`).join(', ')}.`;

  const faq3Q = `What assumptions apply to this ${t.title} model?`;
  const faq3A = (result.notes && result.notes.length)
    ? result.notes.join('. ')
    : 'Standard scientific and educational assumptions apply. Results are educational calculations performed locally.';

  const faq4Q = `Can I export results from this calculator?`;
  const faq4A = `Yes. OpenSTEMTool supports exporting publication-ready SVG charts, PNG graphics, raw CSV data tables, JSON parameter archives, and printable HTML/PDF scientific reports.`;

  const html = `<main id="content" class="content" tabindex="-1"><article class="seo-fallback">
  <nav class="seo-breadcrumb" aria-label="Breadcrumb">
    <ol style="list-style:none;padding:0;margin:0 0 16px;display:flex;flex-wrap:wrap;gap:6px;font-size:12px;color:var(--muted)">
      <li><a href="/" style="color:var(--accent);text-decoration:none">OpenSTEMTool</a> <span aria-hidden="true">/</span></li>
      <li><a href="/#/category/${escape(t.category)}" style="color:var(--accent);text-decoration:none">${escape(catName(t.category))}</a> <span aria-hidden="true">/</span></li>
      <li><a href="/#/department/${escape(t.department)}" style="color:var(--accent);text-decoration:none">${escape(deptName(t.department))}</a> <span aria-hidden="true">/</span></li>
      <li aria-current="page" style="color:var(--text-color)">${escape(t.title)}</li>
    </ol>
  </nav>

  <p class="eyebrow">OpenSTEMTool / ${escape(catName(t.category))} / ${escape(deptName(t.department))}</p>
  <h1>${escape(t.title)} – Free Online Scientific Calculator</h1>
  <p class="page-lead">${escape(t.description)}</p>
  <p><strong>Interactive &amp; 100% Free:</strong> Enter your values directly in the calculator above or change the default inputs below to compute outputs instantly in your browser. All computations run locally for immediate privacy and high performance.</p>

  <h2>What this tool calculates</h2>
  <p>${escape(t.subtitle)}. This computational model is built for university students, educators, lab researchers, and practicing engineers who need transparent, verified scientific calculations.</p>

  <h2>Calculation method and underlying formula</h2>
  <div style="background:var(--surface2);border:1px solid var(--border);border-left:4px solid var(--accent);padding:14px 18px;border-radius:8px;margin:16px 0">
    <p style="margin:0;font-weight:600;color:var(--text-color)">${escape(result.method || 'Enter numeric inputs and calculate the outputs.')}</p>
  </div>
  <p>The calculation evaluates relationships between input variables according to standard scientific principles. Inspect the editable parameter table below to test specific values.</p>

  <h2>Step-by-step calculation guide</h2>
  <ol style="padding-left:20px;line-height:1.8;color:var(--muted)">
    <li><strong>Input Parameters:</strong> Enter the required values into the parameter table below.</li>
    <li><strong>Model Evaluation:</strong> The system automatically evaluates the governing equations locally with high numerical precision.</li>
    <li><strong>Analyze &amp; Export:</strong> Review the calculated outputs, inspect the generated curve plot, and download publication-ready reports or CSV data.</li>
  </ol>

  <h2>Worked example: default input values</h2>
  <p>The default worked example demonstrates calculation with the following parameters. You can modify any value in the interactive panel to re-evaluate your specific scenario:</p>
  <div class="table-scroll"><table class="data-table"><thead><tr><th>Parameter</th><th>Example value</th><th>Unit</th></tr></thead><tbody>${inputRows}</tbody></table></div>

  <h2>Worked example results</h2>
  <p>Based on the default parameters entered above, the model computes the following quantities:</p>
  <div class="table-scroll"><table class="data-table"><thead><tr><th>Calculated quantity</th><th>Output value</th><th>Unit</th></tr></thead><tbody>${exampleRows}</tbody></table></div>

  <h2>Assumptions and interpretation</h2>
  <ul>${(result.notes || []).map(x => `<li>${escape(x)}</li>`).join('')}</ul>
  <p>Educational calculations are not substitutes for professional engineering design approvals, certified laboratory assays, clinical diagnostics, or peer-reviewed scientific publications. Always inspect units, verify physical domains, and evaluate boundary conditions.</p>

  <h2>Frequently asked questions (FAQ)</h2>
  <section class="seo-faq">
    <details style="margin:8px 0;padding:12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px">
      <summary style="font-weight:700;cursor:pointer">${escape(faq1Q)}</summary>
      <p style="margin:8px 0 0">${escape(faq1A)}</p>
    </details>
    <details style="margin:8px 0;padding:12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px">
      <summary style="font-weight:700;cursor:pointer">${escape(faq2Q)}</summary>
      <p style="margin:8px 0 0">${escape(faq2A)}</p>
    </details>
    <details style="margin:8px 0;padding:12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px">
      <summary style="font-weight:700;cursor:pointer">${escape(faq3Q)}</summary>
      <p style="margin:8px 0 0">${escape(faq3A)}</p>
    </details>
    <details style="margin:8px 0;padding:12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px">
      <summary style="font-weight:700;cursor:pointer">${escape(faq4Q)}</summary>
      <p style="margin:8px 0 0">${escape(faq4A)}</p>
    </details>
  </section>

  <h2>Other useful ${escape(catName(t.category))} tools</h2>
  <ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;padding:0;list-style:none">
    ${related.map(o => `<li><a href="/tools/${escape(o.id)}/" class="btn btn-outline btn-small" style="display:block;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">→ ${escape(o.title)}</a></li>`).join('')}
  </ul>

  <h2>Explore the OpenSTEM ecosystem</h2>
  <p><strong><a href="https://openstemfield.org/" target="_blank" rel="noopener">OpenSTEM Field</a></strong> is the flagship ecosystem platform for university scholarships, graduate funding, and research opportunities across 10 countries. <a href="https://openstemlibrary.com/" target="_blank" rel="noopener">OpenSTEM Library</a> provides open textbooks and theory derivations. <a href="https://openstemlab.org/" target="_blank" rel="noopener">OpenSTEM Lab</a> provides 895+ virtual laboratory experiments.</p>
  <p><a href="https://discord.com/invite/tBBKtvFJzW" target="_blank" rel="noopener">Join our Discord Community ↗</a> · <a href="mailto:shahriyarkarimsiam@gmail.com">Contact: shahriyarkarimsiam@gmail.com ✉</a></p>
  <p><a href="/">Browse all scientific calculators</a> · <a href="/#/departments">Browse academic departments</a></p>
</article></main>`;

  // Google Schema.org Multi-Type Graph: WebApplication, BreadcrumbList, FAQPage, HowTo
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t.title,
    headline: `${t.title} – Free Online Scientific Calculator`,
    description: t.description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.0.0',
    url: url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Interactive formula computation',
      'Step-by-step mathematical derivation',
      'Publication-ready SVG and PNG chart generation',
      'Instant CSV and JSON data export',
      'Local offline-first execution with zero tracking'
    ],
    author: {
      '@type': 'Organization',
      name: 'OpenSTEM Ecosystem',
      url: 'https://openstemfield.org/'
    },
    publisher: {
      '@type': 'Organization',
      name: 'OpenSTEM',
      url: 'https://openstemfield.org/',
      logo: {
        '@type': 'ImageObject',
        url: `${site}/assets/icon.svg`
      }
    }
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'OpenSTEMTool',
        item: site + '/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: catName(t.category),
        item: `${site}/#/category/${t.category}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t.title,
        item: url
      }
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: faq1Q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq1A
        }
      },
      {
        '@type': 'Question',
        name: faq2Q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq2A
        }
      },
      {
        '@type': 'Question',
        name: faq3Q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq3A
        }
      },
      {
        '@type': 'Question',
        name: faq4Q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq4A
        }
      }
    ]
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Calculate with the ${t.title} Calculator`,
    description: `Step-by-step procedure to calculate ${t.subtitle.toLowerCase()} with formula evaluation.`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Input Initial Parameters',
        text: `Enter the required variables: ${t.fields.map(f => `${f.label} (${f.unit || 'unitless'})`).join(', ')}.`,
        position: 1
      },
      {
        '@type': 'HowToStep',
        name: 'Compute Governing Formula',
        text: `The calculator evaluates the model: ${result.method || 'evaluates inputs numerically'}.`,
        position: 2
      },
      {
        '@type': 'HowToStep',
        name: 'Inspect Outputs and Charts',
        text: 'Review the calculated metrics, analyze the sensitivity curve, and export results in CSV, SVG, PNG, JSON, or printable PDF format.',
        position: 3
      }
    ]
  };

  const page = applyHead(template.replace(introMarker, html), title, desc, url, {
    '@context': 'https://schema.org',
    '@graph': [structured, breadcrumbs, faqSchema, howToSchema]
  });

  const folder = resolve(root, 'tools', t.id);
  await mkdir(folder, {recursive: true});
  await writeFile(resolve(folder, 'index.html'), page);
  toolDirs.push(`/tools/${t.id}/`);
}

// Homepage SEO Generation
const homeDesc = '155 free university scientific calculators, graphing tools, and numerical analyzers across 38 academic departments. 100% free, private browser-based computations.';
const links = categories.map(c => `<h2>${escape(c.label)}</h2><ul>${tools.filter(t => t.category === c.id).map(t => `<li><a href="/tools/${escape(t.id)}/">${escape(t.title)}</a> — ${escape(t.subtitle)}</li>`).join('')}</ul>`).join('');

const homepage = `<main id="content" class="content" tabindex="-1"><section class="seo-fallback">
<h1>OpenSTEMTool — Free University Scientific Calculators &amp; Graphing</h1>
<p>${escape(homeDesc)}</p>
<p>Perform accurate computations in mathematics, statistics, physics, chemistry, computer science, biology, and engineering. All numerical models execute locally in your browser with formula derivations, parameter tables, and export options.</p>
<p><a href="/#/catalog">Search all ${tools.length} calculators</a> · <a href="/#/departments">Explore ${departments.length} academic departments</a></p>
${links}
<h2>The OpenSTEM Ecosystem</h2>
<p><strong><a href="https://openstemfield.org/">OpenSTEM Field</a></strong> (Flagship Hub) — Discover university scholarships, graduate programs, and research funding across 10 countries with official source links.</p>
<p><strong><a href="https://openstemlab.org/">OpenSTEM Lab</a></strong> — 895+ virtual laboratory experiments and simulations.</p>
<p><strong><a href="https://openstemlibrary.com/">OpenSTEM Library</a></strong> — Open-access digital university textbooks and scientific theory.</p>
<h2>Community &amp; Contact</h2>
<p><a href="https://discord.com/invite/tBBKtvFJzW">OpenSTEM Discord Server ↗</a> · <a href="mailto:shahriyarkarimsiam@gmail.com">Direct Email: shahriyarkarimsiam@gmail.com ✉</a></p>
</section></main>`;

const homepageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'OpenSTEMTool',
      url: site + '/',
      description: homeDesc,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${site}/#/catalog?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      name: 'OpenSTEM Ecosystem',
      url: 'https://openstemfield.org/',
      logo: `${site}/assets/icon.svg`,
      sameAs: [
        'https://openstemfield.org/',
        'https://openstemlab.org/',
        'https://openstemlibrary.com/',
        'https://discord.com/invite/tBBKtvFJzW'
      ]
    }
  ]
};

await writeFile(
  resolve(root, 'index.html'),
  applyHead(
    template.replace(introMarker, homepage),
    'OpenSTEMTool — 155 Free University Scientific Calculators & Data Tools',
    homeDesc,
    site + '/',
    homepageSchema
  )
);

// High-Standard Google-Compliant Sitemap XML
const urls = [
  {loc: site + '/', priority: '1.0', changefreq: 'daily'},
  ...toolDirs.map(u => ({loc: site + u, priority: '0.8', changefreq: 'weekly'}))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(u => `  <url>
    <loc>${escape(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

await writeFile(resolve(root, 'sitemap.xml'), xml);

// Strict Google-Standard Robots.txt
const robotsTxt = `User-agent: *
Allow: /

# Canonical XML Sitemap for Google Search Console & Search Engines
Sitemap: ${site}/sitemap.xml
`;

await writeFile(resolve(root, 'robots.txt'), robotsTxt);

console.log(`✓ Successfully built ${tools.length} dedicated SEO pages and accessible homepage.`);
console.log(`✓ Generated Google-compliant sitemap.xml with ${urls.length} URLs (origin: ${site}).`);
console.log(`✓ Generated robots.txt pointing to ${site}/sitemap.xml.`);
