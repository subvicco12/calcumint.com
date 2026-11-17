import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('43 authority records retain exact source hashes and resolvable prerequisites without approvals',()=>{
 const packet=JSON.parse(readFileSync('docs/calculator-sprint-20261108/authority-43.json'));
 const sources=Object.create(null);
 for(const [id,binding] of Object.entries(packet.sourceHashes)){
  assert(!binding.path.startsWith('/')&&!binding.path.split('/').includes('..'));
  const raw=readFileSync(binding.path);assert.equal(createHash('sha256').update(raw).digest('hex'),binding.sha256,binding.path);
  assert.match(binding.hashScope,/not original publisher bytes/);if(binding.path.endsWith('.json'))sources[id]=JSON.parse(raw);
 }
 let checked=0;
 function visit(value){
  if(!value||typeof value!=='object')return;
  if(typeof value.sourceId==='string'&&typeof value.jsonPointer==='string'){
   assert(Object.hasOwn(sources,value.sourceId));let current=sources[value.sourceId];
   for(const key of value.jsonPointer.split('/').slice(1).map(x=>x.replaceAll('~1','/').replaceAll('~0','~'))){assert(current!==null&&typeof current==='object'&&Object.hasOwn(current,key),value.jsonPointer);current=current[key];}checked++;
  }
  for(const item of Object.values(value))visit(item);
 }
 visit(packet);assert(checked>600);assert.equal(packet.rows.length,43);assert.equal(new Set(packet.rows.map(r=>r.masterId)).size,43);
 assert.equal(packet.summary.fullProductPromotions,0);assert.equal(packet.summary.provenDuplicateAliasResolutions,0);assert.equal(packet.summary.categoryCountsOverlap,true);
});
