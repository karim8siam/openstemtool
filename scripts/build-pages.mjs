/** Build crawlable static HTML for the real numerical calculators. 
 * SITE_URL must be your owned and deployed HTTPS origin to write sitemap/canonical URLs.
 * Do not submit a sitemap using a domain you do not control.
 */
import {readFile,writeFile,mkdir,rm,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {tools,departments,categories} from '../assets/js/tools.js';
const root=resolve(import.meta.dirname,'..');
const template=await readFile(resolve(root,'templates/index.template.html'),'utf8');
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const site=(process.env.SITE_URL||'').trim().replace(/\/+$/,'');
if(site&&(!/^https:\/\/[a-z0-9][a-z0-9.-]+(?::[0-9]+)?$/i.test(site)||/\.example$|example\.com|localhost|127\.0\.0\.1/i.test(site)))throw Error('SITE_URL must be a real owned HTTPS domain without path.');
const introMarker=/<main id="content" class="content" tabindex="-1">[\s\S]*?<\/main>/;
const jsonSafe=obj=>JSON.stringify(obj).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');
const catName=id=>categories.find(c=>c.id===id)?.label||id;
const deptName=id=>departments.find(c=>c.id===id)?.label||id;
function applyHead(html,title,description,url='',jsonld=null){
 let out=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(description.slice(0,165))}">`);
 let meta=`<meta name="robots" content="index,follow,max-image-preview:large">\n<meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description.slice(0,180))}"><meta name="twitter:card" content="summary">`;
 if(url)meta+=`\n<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}">`;
 if(jsonld)meta+=`\n<script type="application/ld+json">${jsonSafe(jsonld)}</script>`;
 return out.replace('</head>',meta+'\n</head>');
}
function readExample(t){try{const v=Object.fromEntries(t.fields.map(f=>[f.key,f.value]));return t.compute(v);}catch(e){throw Error(`Tool ${t.id} default model failed during SEO build: ${e.message}`);}}
const toolDirs=[];
for(const t of tools){
 const result=readExample(t),title=`${t.title} – Free Interactive ${catName(t.category)} Tool | OpenSTEMTool`;
 const desc=`${t.description} Free university-level calculator with editable parameters, formula explanation and downloadable results.`;
 const related=tools.filter(o=>o.category===t.category&&o.id!==t.id).slice(0,5);
 const inputRows=t.fields.map(f=>`<tr><th scope="row">${escape(f.label)}</th><td>${escape(f.value)}</td><td>${escape(f.unit||'—')}</td></tr>`).join('');
 const exampleRows=result.metrics.slice(0,8).map(m=>`<tr><th scope="row">${escape(m.label)}</th><td>${escape(m.value)}</td><td>${escape(m.unit||'—')}</td></tr>`).join('');
 const html=`<main id="content" class="content" tabindex="-1"><article class="seo-fallback">
 <p class="eyebrow">OpenSTEMTool / ${escape(catName(t.category))} / ${escape(deptName(t.department))}</p>
 <h1>${escape(t.title)} – Free Online Scientific Calculator</h1>
 <p>${escape(t.description)}</p><p><strong>Interactive and free:</strong> change the example inputs, calculate results in your browser, and export the numerical result or a graph when available. This application requires JavaScript.</p>
 <h2>What this tool calculates</h2><p>${escape(t.subtitle)}. The calculation is performed locally with the model documented below. Use it to explore relationships between scientific quantities and to check your own classroom calculations.</p>
 <h2>Calculation method and underlying formula</h2><p>${escape(result.method||'Enter numeric inputs and calculate the outputs.')}</p>
 <h2>Worked example: default input values</h2><p>The default worked example uses the following editable inputs. Change any input after the application loads to recalculate the output rather than relying on this example for your own problem.</p>
 <div class="table-scroll"><table class="data-table"><thead><tr><th>Input</th><th>Example value</th><th>Unit</th></tr></thead><tbody>${inputRows}</tbody></table></div>
 <h2>Worked example results</h2><div class="table-scroll"><table class="data-table"><thead><tr><th>Quantity</th><th>Calculated result</th><th>Unit</th></tr></thead><tbody>${exampleRows}</tbody></table></div>
 <h2>Assumptions and interpretation</h2><ul>${(result.notes||[]).map(x=>`<li>${escape(x)}</li>`).join('')}</ul><p>Educational calculations are not substitutes for professional verification, clinical assessment, engineering design approval, or published scientific quality assurance. Always inspect units, domains and model suitability.</p>
 <h2>Other useful ${escape(catName(t.category))} tools</h2><ul>${related.map(o=>`<li><a href="/tools/${escape(o.id)}/">${escape(o.title)}</a></li>`).join('')}</ul>
 <h2>Explore the OpenSTEM ecosystem</h2><p><a href="https://openstemlibrary.com/">OpenSTEM Library</a> explains underlying topics. <a href="https://openstemlab.org/">OpenSTEM Lab</a> includes experiments and measurements. <a href="https://openstemfield.org/">OpenSTEM Field</a> covers academic opportunities.</p>
 <p><a href="/">Browse all scientific tools</a> · <a href="/#/departments">Browse academic departments</a></p></article></main>`;
 const url=site?`${site}/tools/${t.id}/`:'';
 const structured={'@context':'https://schema.org','@type':'WebApplication',name:t.title,description:t.description,applicationCategory:'EducationalApplication',operatingSystem:'Any',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},...(url?{url}:{})};
 const breadcrumbs={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'OpenSTEMTool',item:site?site+'/':'/'},{'@type':'ListItem',position:2,name:t.title,item:url||`/tools/${t.id}/`}]};
 const page=applyHead(template.replace(introMarker,html),title,desc,url,{'@context':'https://schema.org','@graph':[structured,breadcrumbs]});
 const folder=resolve(root,'tools',t.id);await mkdir(folder,{recursive:true});await writeFile(resolve(folder,'index.html'),page);toolDirs.push(`/tools/${t.id}/`);
}
const homeDesc='155 free university scientific tools with interactive graphing, statistical analysis, physics and engineering calculations across 38 academic departments.';
const links=categories.map(c=>`<h2>${escape(c.label)}</h2><ul>${tools.filter(t=>t.category===c.id).map(t=>`<li><a href="/tools/${escape(t.id)}/">${escape(t.title)}</a> — ${escape(t.subtitle)}</li>`).join('')}</ul>`).join('');
const homepage=`<main id="content" class="content" tabindex="-1"><section class="seo-fallback"><h1>OpenSTEMTool — Free University Scientific Calculators and Graphing</h1><p>${escape(homeDesc)}</p><p>Use working mathematics, statistics, physics, chemistry, computer science, biology, and engineering tools for numerical learning and data analysis. Scientific outputs are computed locally in your browser.</p><p><a href="/#/catalog">Search all ${tools.length} tools</a> · <a href="/#/departments">Explore ${departments.length} academic departments</a></p>${links}<h2>Learn, analyze and explore</h2><p><a href="https://openstemlibrary.com/">OpenSTEM Library</a> · <a href="https://openstemlab.org/">OpenSTEM Lab</a> · <a href="https://openstemfield.org/">OpenSTEM Field</a></p></section></main>`;
const homepageSchema={'@context':'https://schema.org','@type':'WebSite',name:'OpenSTEMTool',description:homeDesc,...(site?{url:site+'/'}:{})};
await writeFile(resolve(root,'index.html'),applyHead(template.replace(introMarker,homepage),'OpenSTEMTool — Free Scientific Calculators, Graphs & Data Tools',homeDesc,site?site+'/':'',homepageSchema));
if(site){
 const urls=['/',...toolDirs];const xml=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${escape(site+u)}</loc></url>`).join('\n')}\n</urlset>\n`;
 await writeFile(resolve(root,'sitemap.xml'),xml);
 await writeFile(resolve(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
} else {
 await rm(resolve(root,'sitemap.xml'),{force:true});await writeFile(resolve(root,'robots.txt'),'User-agent: *\nAllow: /\n');
}
console.log(`Built ${tools.length} dedicated SEO pages and accessible homepage.${site?' Production sitemap and canonical URLs generated.':' Sitemap not generated: set SITE_URL to your real owned HTTPS domain.'}`);
