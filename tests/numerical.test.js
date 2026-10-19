import test from 'node:test';
import assert from 'node:assert/strict';
import {tools,toolById} from '../assets/js/tools.js';
import {compileExpression,mean,variance,describe,linearFit,polynomialFit,integrateSimpson,derivative,parseCSV,pairs,determinant,solveLinear,eigen2,rowsToCSV} from '../assets/js/core.js';
const near=(a,b,tol=1e-6)=>assert.ok(Math.abs(a-b)<=tol,`Expected ${a} ≈ ${b} (±${tol})`);
const run=(id,changes={})=>{const t=toolById[id];const values=Object.fromEntries(t.fields.map(f=>[f.key,f.value]));return t.compute({...values,...changes});};
const num=(result,name)=>{const m=result.metrics.find(x=>x.label===name);assert.ok(m,`Missing metric: ${name}`);return Number(String(m.value).replace(/,/g,''));};
test('registry includes more than 100 unique, named, working tools',()=>{
 assert.ok(tools.length>=120);assert.equal(new Set(tools.map(x=>x.id)).size,tools.length);
 for(const t of tools){const result=run(t.id);assert.ok(result.metrics?.length,`${t.id}: no metrics`);for(const metric of result.metrics)assert.notEqual(metric.value,'—',`${t.id}: ${metric.label} undefined`);}
});
test('parser respects precedence and is sandboxed',()=>{
 near(compileExpression('-2^2')({}),-4);
 near(compileExpression('2^3^2')({}),512);
 near(compileExpression('sin(pi/2)+2*x')({x:4}),9);
 assert.throws(()=>compileExpression('window.alert(1)'));
 assert.throws(()=>compileExpression('constructor'));
 assert.throws(()=>compileExpression('2x'));
 assert.throws(()=>compileExpression('sin(x'),/parenthesis/);
});
test('descriptive statistics use sample SD',()=>{const s=describe([1,2,3,4,5]);near(s.mean,3);near(s.median,3);near(s.variance,2.5);near(s.sem,Math.sqrt(.5));});
test('known linear and quadratic regression solutions',()=>{
 const f=linearFit([{x:1,y:5},{x:2,y:8},{x:3,y:11},{x:4,y:14}]);near(f.slope,3);near(f.intercept,2);near(f.r2,1);
 const xs=[-3,-2,-1,0,1,2,3];const q=polynomialFit(xs.map(x=>({x,y:1+2*x+3*x*x})),2);near(q.predict(5),86,1e-8);near(q.r2,1);
 assert.throws(()=>linearFit([{x:1,y:2},{x:1,y:3}]),/vary/);
});
test('csv import handles headers, quoting and CRLF',()=>{
 const csv=parseCSV('Length,Time,Note\r\n0.5,1.42,"a,b"\r\n0.6,1.56,c');assert.deepEqual(csv.headers,['Length','Time','Note']);assert.deepEqual(csv.rows[0],['0.5','1.42','a,b']);
 const exportText=rowsToCSV(['x','note'],[[2,'a,b']]);assert.match(exportText,/"a,b"/);
 assert.equal(pairs('1 2\n3 4').length,2);assert.equal(parseCSV('Length\tTime\n0.2\t0.9').rows[0][1],'0.9');assert.equal(parseCSV('1 2\n3 4').rows[1][0],'3');
});
test('calculus core known integral and derivative',()=>{
 const f=x=>x*x;near(integrateSimpson(f,0,3),9,1e-8);near(derivative(f,4),8,1e-8);
});
test('matrix solver and eigenvalues',()=>{
 const A=[[2,1],[1,3]];near(determinant(A),5);const x=solveLinear(A,[1,2]);near(x[0],.2);near(x[1],.6);
 const eig=eigen2([[2,0],[0,3]]);near(eig.values[0],3);near(eig.values[1],2);
 assert.throws(()=>solveLinear([[1,1],[2,2]],[2,4]),/singular/);
});
test('uncertainty first order and correlation',()=>{
 const r=run('uncertainty',{op:'multiply',x:'2',sx:'0.1',y:'3',sy:'0.2',rho:'0'});
 near(num(r,'Calculated f'),6);near(num(r,'Standard uncertainty'),.5,1e-6);
 assert.throws(()=>run('uncertainty',{rho:'2'}),/Correlation|Uncertainties/);
});
test('pendulum period and projectile range reference cases',()=>{
 const r=run('pendulum',{length:'1',g:String(4*Math.PI*Math.PI),theta:'2'});
 near(num(r,'Small-angle period'),1,1e-6);
 const p=run('projectile',{speed:'20',angle:'45',g:'10',height:'0'});
 near(num(p,'Horizontal displacement'),40,1e-5);near(num(p,'Maximum height'),10,1e-5);
});
test('RLC resonance physical scales',()=>{
 const r=run('rlc',{R:'100',L:'0.1',C:'10'});
 near(num(r,'Resonance frequency'),159.154943,1e-3);
 near(num(r,'Impedance at resonance'),100);
});
test('double slit intensity is normalized',()=>{
 const r=run('diffraction',{mode:'double'});
 const series=r.chart.series[0].points;assert.ok(series.every(p=>p.y>=0&&p.y<=1+1e-9));
});
test('electric field respects inverse-square law',()=>{
 const r=run('electric-field',{q1:'1',x1:'0',y1:'0',q2:'0',x2:'10',y2:'0',px:'1',py:'0'});
 near(num(r,'|E| at probe'),8.9875517923,1e-5);
});
test('heat transfer conduction standard formula',()=>{
 const r=run('heat-transfer',{k:'2',area:'1',thickness:'.5',hot:'80',cold:'30'});
 near(num(r,'Conduction heat rate'),200);
});
test('strong acid/strong base titration pH correct at equivalence',()=>{
 const r=run('titration',{acidM:'0.1',acidV:'25',baseM:'0.1',maxBaseV:'55'});
 near(num(r,'Equivalence volume'),25);near(num(r,'pH at equivalence'),7);assert.ok(num(r,'Final displayed pH')>11.5);
 assert.ok(r.chart.series[0].points.every(p=>Number.isFinite(p.y)));
});
test('function graphs and numerical surface domain restrictions',()=>{
 assert.ok(run('function-grapher',{expr:'sin(x)'}).chart.series[0].points.length>200);
 assert.ok(run('surface').chart.grid.length===29);
 assert.throws(()=>run('surface',{xmin:'5',xmax:'1'}));
});
test('regression rejects wrong-length and nonpositive uncertainties',()=>{
 assert.throws(()=>run('regression',{sigma:'0.1 0.2'}));
 assert.throws(()=>run('regression',{sigma:'0.1 0.2 0.3 0.4 0.0 0.2'}));
});
