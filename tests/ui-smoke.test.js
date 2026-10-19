import test from 'node:test';
import assert from 'node:assert/strict';
import {tools,toolById} from '../assets/js/tools.js';
// Minimal DOM harness catches rendering and wiring exceptions without a browser engine.
test('dashboard, catalog, guide, projects, and all registered tool views render without script exceptions', async ()=>{
 const elements=new Map();let handler;
 const get=id=>{if(!elements.has(id))elements.set(id,{id,innerHTML:'',textContent:'',value:'',dataset:{},classList:{add(){},remove(){},toggle(){}},style:{},addEventListener(){},querySelectorAll(){return []},focus(){},click(){},get elements(){const t=toolById[location.hash.split('/').pop()];return t?Object.fromEntries(t.fields.map(f=>[f.key,{value:f.value}])):{};}});return elements.get(id);};
 globalThis.document={querySelector(s){return get(s)},getElementById(id){return get('#'+id)},documentElement:{dataset:{}},addEventListener(){}};
 const events={};globalThis.window={addEventListener(event,fn){events[event]=fn;},scrollTo(){}};
 globalThis.location={hash:'#/home',pathname:'/'};
 const db=new Map();globalThis.localStorage={getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,v)};
 await import('../assets/js/app.js');
 assert.match(get('#content').innerHTML,/Your ideas deserve/);
 for(const path of ['#/catalog','#/category/math','#/projects','#/guide']){location.hash=path;events.hashchange();assert.ok(get('#content').innerHTML.length>150);}
 for(const t of tools){location.hash='#/tool/'+t.id;events.hashchange();assert.ok(get('#content').innerHTML.includes(t.title.replaceAll('&','&amp;')));assert.ok(get('#tool-results').innerHTML.length>100,`missing result panel for ${t.id}`);assert.ok(!get('#tool-results').innerHTML.includes('Unable to calculate'),`calculation failed ${t.id}`);}
});
