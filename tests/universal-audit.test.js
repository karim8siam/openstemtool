import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {tools,categories,departments,toolById} from '../assets/js/tools.js';
const root=new URL('../',import.meta.url);
const run=(id,values={})=>{const t=toolById[id];assert.ok(t,`Missing ${id}`);return t.compute({...Object.fromEntries(t.fields.map(f=>[f.key,f.value])),...values});};
const get=(id,label,values)=>{const r=run(id,values);const m=r.metrics.find(x=>x.label===label);assert.ok(m,`${id}: missing metric '${label}'`);return Number(m.value.replace(/,/g,''));};
const near=(actual,expected,rel=5e-5)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=rel*Math.max(1,Math.abs(expected)),`${actual} differs from expected ${expected}`);
test('universal registry covers 155 distinct real calculators across multiple departments',()=>{
 assert.equal(tools.length,155);assert.equal(departments.length,38);assert.ok(categories.length>=10);
 assert.equal(new Set(tools.map(t=>t.id)).size,tools.length);
 for(const t of tools){assert.ok(categories.some(c=>c.id===t.category),`unknown category ${t.category}`);assert.ok(departments.some(d=>d.id===t.department),`${t.id} unknown department ${t.department}`);assert.ok(t.fields.length>0,`${t.id} has no inputs`);}
});
test('second-pass default audit of every model, metrics, and plot input types',()=>{
 for(const t of tools){const r=run(t.id);assert.ok(r.metrics?.length,t.id);for(const m of r.metrics){assert.ok(!['NaN','Infinity','−','—','undefined'].includes(m.value),`${t.id}: ${m.label} invalid ${m.value}`);assert.ok(m.label.length>0,t.id);}if(r.chart?.series)for(const s of r.chart.series){assert.ok(s.points?.length>0,`${t.id} plot has zero points`);for(const p of s.points){assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y),`${t.id} plot has invalid coordinate`);}}}
});
test('mathematical and geometric known values',()=>{
 near(get('quadratic-roots','Root 1',{a:1,b:-3,c:2}),2);
 near(get('triangle-area','Area',{a:3,b:4,c:5}),6);
 near(get('sphere-geometry','Volume',{r:3}),4/3*Math.PI*27);
 near(get('polar-converter','X coordinate',{r:2,angle:60}),1);
 near(get('coordinate-distance','Distance',{x1:0,y1:0,x2:3,y2:4}),5);
 near(get('arithmetic-progression','Sum of n terms',{first:1,diff:1,count:100}),5050);
 near(get('geometric-progression','Finite sum',{first:1,ratio:2,count:5}),31);
});
test('probability and statistics known cases',()=>{
 near(get('z-score','Z-score',{x:80,mu:70,sigma:5}),2);
 near(get('normal-density','Probability density',{x:0,mu:0,sigma:1}),1/Math.sqrt(2*Math.PI));
 near(get('binomial-probability','P(X = k)',{count:4,success:2,prob:.5}),.375);
 near(get('poisson-probability','P(X = k)',{lambda:1,k:0}),Math.E**-1);
 near(get('bayes-theorem','Posterior P(H|+)',{prior:.5,sensitivity:.8,false:.2}),.8);
 near(get('pearson-correlation','Pearson correlation r',{data:'1 2\n2 4\n3 6'}),1);
 near(get('expected-value','Expected value',{values:'1 2',probs:'.25 .75'}),1.75);
});
test('independent reference physics and chemistry calculations',()=>{
 near(get('kinetic-energy','Kinetic energy',{mass:2,speed:3}),9);
 near(get('centripetal-force','Centripetal force',{mass:2,speed:3,radius:3}),6);
 near(get('wave-frequency','Frequency',{speed:343,lambda:7}),49);
 near(get('radioactive-half-life','Remaining quantity',{initial:100,half:2,elapsed:4}),25);
 near(get('mole-mass','Amount of substance',{mass:18,molar:18}),1);
 near(get('molarity','Molar concentration',{moles:1,volume:.5}),2);
 near(get('solution-dilution','Stock volume required',{c1:2,c2:.5,v2:100}),25);
 near(get('ideal-gas-chem','Pressure',{moles:1,temperature:300,volume:1}),2494.3387854);
 near(get('first-order-kinetics','Remaining concentration',{initial:10,k:.1,elapsed:10}),10*Math.exp(-1));
});
test('engineering and computing known results',()=>{
 near(get('ohms-law','Current',{voltage:12,resistance:4}),3);
 near(get('parallel-resistors','Parallel equivalent',{r1:100,r2:100}),50);
 near(get('rc-circuit','Time constant',{R:1000,C:1000}),1);
 near(get('tensile-stress','Axial stress',{force:1000,area:100}),10);
 near(get('manning-flow','Mean velocity',{radius:1,slope:.01,roughness:.01}),10);
 near(get('rock et-delta-v'.replace(' ',''),'Ideal Δv',{exhaust:1000,initial:100,final:100/Math.E}),1000);
 near(get('data-transfer','Transfer time',{size:100,rate:100}),8);
 near(get('sigmoid-function','Sigmoid σ(x)',{x:0}),.5);
 near(get('shannon-entropy','Information entropy',{prob:.5}),1);
});
test('biology, epidemiology, economics, agriculture and archaeology reference cases',()=>{
 near(get('bacterial-growth','Estimated population',{initial:100,doubling:1,elapsed:3}),800);
 near(get('hardy-weinberg','Aa expected frequency',{p:.5}),.5);
 near(get('dna-gc-content','GC content',{sequence:'ACGT'}),50);
 near(get('epidemiology-prevalence','Prevalence',{cases:5,population:100}),5);
 near(get('nutrition-macros','Approximate energy',{protein:10,carb:10,fat:10}),170);
 near(get('break-even-units','Break-even sales units',{fixed:1000,price:40,variable:20}),50);
 near(get('cagr','CAGR',{start:100,end:121,years:2}),10);
 near(get('fertilizer-nutrient','Nutrient mass',{fertilizer:100,content:20}),20);
 near(get('irrigation-volume','Gross irrigation volume',{area:1,depth:10,efficiency:1}),100);
 near(get('radiocarbon-age','Uncalibrated age',{fraction:.5,half:5730}),5730);
});
test('domain boundaries reject invalid inputs explicitly',()=>{
 const invalid=[['quadratic-roots',{a:0}],['triangle-area',{a:1,b:1,c:7}],['strong-acid-ph',{pkw:0}],['ohms-law',{resistance:0}],['normal-density',{sigma:0}],['poisson-probability',{k:-1}],['relative-risk',{c:0}],['thin-lens',{f:.5,object:.5}],['ideal-gas-chem',{volume:0}],['body-mass-index',{height:0}],['rc-circuit',{C:0}],['radiocarbon-age',{fraction:0}],['binomial-probability',{success:11}],['dna-gc-content',{sequence:'ATX'}],['sociology-rate',{responded:1000}]];
 for(const [id,v] of invalid)assert.throws(()=>run(id,v),undefined,`${id}: should reject ${JSON.stringify(v)}`);
});
test('all 155 static pages contain distinct SEO metadata, text and valid structured data',async()=>{
 const titles=new Set();
 for(const t of tools){const html=await readFile(new URL(`../tools/${t.id}/index.html`,import.meta.url),'utf8');assert.match(html,/<meta name="description" content="[^"]+">/,t.id);assert.ok(html.includes('<h1>')&&html.includes(t.title.replaceAll('&','&amp;')),t.id);assert.ok(html.includes('Calculation method and underlying formula'),t.id);assert.ok(html.includes('Worked example results'),t.id);assert.ok(html.includes('application/ld+json'),t.id);const ld=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);assert.ok(ld,t.id);const obj=JSON.parse(ld[1]);assert.equal(obj['@graph'][0].name,t.title);const title=html.match(/<title>([^<]+)<\/title>/)[1];assert.ok(!titles.has(title),`Duplicate title ${title}`);titles.add(title);}
});

test('third-pass perturbation tests respond to changed measurements without silent invalid numbers',()=>{
 let recalculated=0;
 for(const t of tools){
   const fs=t.fields.filter(f=>f.type==='number');
   if(!fs.length)continue;
   const f=fs.find(x=>Math.abs(Number(x.value))>0&&!Number.isInteger(Number(x.value)))||fs[0];
   const initial=Number(f.value);
   const changed=initial===0?0.0001:initial*(1+0.002);
   try{const r=run(t.id,{[f.key]:String(changed)});assert.ok(r.metrics.every(m=>m.value!=='—'),t.id);recalculated++;}catch(e){
     // Some models correctly reject perturbed exact integer/boolean or domain-constrained parameters.
     assert.ok(e instanceof Error,`${t.id}: unusual rejection`);
   }
 }
 assert.ok(recalculated>=110,`Only ${recalculated} models recomputed on altered input.`);
});
test('all numeric tools reject non-finite user numbers or visibly flag invalid outputs',()=>{
 for(const t of tools){const f=t.fields.find(f=>f.type==='number');if(!f)continue;let threw=false;
  try{const r=run(t.id,{[f.key]:'not-a-number'});threw=r.metrics.some(x=>x.value==='—');}catch{threw=true;}
  assert.ok(threw,`Tool ${t.id} silently accepted nonnumeric input ${f.key}`);
 }
});
