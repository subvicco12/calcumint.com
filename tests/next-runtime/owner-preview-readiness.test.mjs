import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {ownerPreviewReadyScript} from './owner-preview-readiness.mjs';
const model={slug:'private-owner-44',title:'Vacancy Impact Calculator'};
function ready(html,pathname){const dom=new JSDOM(html,{url:'http://127.0.0.1'+pathname,runScripts:'outside-only'});try{return dom.window.eval(ownerPreviewReadyScript(model));}finally{dom.window.close();}}
const directory='<main><h1>Private calculator review</h1><form><button type="submit">Search calculators</button></form></main>';
const calculator='<main><h1>Vacancy Impact Calculator</h1><section aria-label="Engine contract preview"><form><button type="submit">Calculate preview</button></form></section></main>';
test('directory submit and intermediate client-navigation states never satisfy owner calculation readiness',()=>{
 assert.equal(ready(directory,'/account/calculators'),false);
 assert.equal(ready(directory,'/account/calculators/private-owner-44'),false);
 assert.equal(ready(calculator.replace('Vacancy Impact Calculator','Revenue Calculator'),'/account/calculators/private-owner-44'),false);
});
test('only the target path heading and real calculation control satisfy readiness',()=>{
 assert.equal(ready(calculator,'/account/calculators/private-owner-44'),true);
 assert.equal(ready(calculator,'/account/calculators/private-owner-145'),false);
 assert.equal(ready(calculator.replace('Calculate preview','Search calculators'),'/account/calculators/private-owner-44'),false);
});
