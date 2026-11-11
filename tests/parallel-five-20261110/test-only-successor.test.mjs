import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assertTestOnlySuccessor,testOnlySuccessorPaths,exactRetainedWrapperTransformation,exactSecondPreviewTransformation} from './test-only-successor.mjs';
const root='docs/parallel-five-20261110/authenticated/',source=JSON.parse(readFileSync(root+'final-source-version.json'));
for(const file of testOnlySuccessorPaths)test('only exact committed test successor is admitted: '+file,async()=>{
 const baseline=source.currentBlobBindings[file].recordedBuildSourceSHA256,bytes=readFileSync(file);
 assert.equal((await assertTestOnlySuccessor(file,baseline,bytes)).testOnly,true);
 await assert.rejects(assertTestOnlySuccessor(file,baseline,Buffer.concat([bytes,Buffer.from('\n// unrelated change')])));
 await assert.rejects(assertTestOnlySuccessor(file,'0'.repeat(64),bytes));
 if(file.startsWith('src/lib/'))await assert.rejects(assertTestOnlySuccessor(file,baseline,bytes,()=>{throw Error('missing exact Git source')}),/missing exact Git source/);
});
test('no generic test path, missing original block or extra original assertion change is allowed',async()=>{
 await assert.rejects(assertTestOnlySuccessor('src/lib/unlisted.test.ts','0'.repeat(64),Buffer.from('')),/Only nine exact/);
 const binding=JSON.parse(readFileSync(root+'test-only-successor/retained-a7-wrappers/binding.json'));
 for(const row of binding.rows){const old=readFileSync(root+'test-only-successor/retained-a7-wrappers/'+row.baseline.archive,'utf8'),next=readFileSync(root+'test-only-successor/retained-a7-wrappers/'+row.successor.archive,'utf8');assert.equal(await exactRetainedWrapperTransformation(row.path,old),next);await assert.rejects(exactRetainedWrapperTransformation(row.path,old+'\n// changed assertion'),/Exact F042/);}
});

test('preview admission preserves every case body and both original setup and case limits',()=>{
 const dir=root+'test-only-successor/preview-readiness/',binding=JSON.parse(readFileSync(dir+'binding.json')),before=readFileSync(dir+'baseline.fixture','utf8'),after=readFileSync(dir+'successor.fixture','utf8');
 assert.equal(binding.rows.length,1);assert.equal(before.split(binding.replacement.from).length,2);assert.equal(before.replace(binding.replacement.from,binding.replacement.to),after);
 assert.equal(before.slice(before.indexOf('afterAll(')),after.slice(after.indexOf('afterAll(')));assert.equal((after.match(/it\('/g)||[]).length,4);assert.equal(binding.replacement.from,';},30000);');assert(binding.replacement.to.endsWith(';},30000);'));
});


test('two finite preview admissions retain security cases, default 5s limits and 30s setup',async()=>{
 const dir=root+'test-only-successor/second-preview-readiness/',binding=JSON.parse(readFileSync(dir+'binding.json'));
 assert.equal(binding.rows.length,2);assert.equal(testOnlySuccessorPaths.length,9);
 for(const row of binding.rows){
  const before=readFileSync(dir+row.baseline.archive,'utf8'),after=readFileSync(dir+row.successor.archive,'utf8');
  assert.equal(await exactSecondPreviewTransformation(row.path,before),after);
  await assert.rejects(exactSecondPreviewTransformation(row.path,before+'\n// changed expectation'),/Exact F042/);
  const cases=s=>s.slice(s.indexOf("it('")),third="it('isolates concurrent ephemeral servers and credentials'";
  assert.equal(cases(before).slice(0,cases(before).indexOf(third)),cases(after).slice(0,cases(after).indexOf(third)),'Both original route/auth/header/method/sensitive-file cases remain byte-identical');
  for(const text of [before,after]){assert.equal((text.match(/^it\('/gm)||[]).length,3);assert.equal((text.match(/^\}\);$/gm)||[]).length,3,'All cases keep implicit default 5s timeout');assert.equal((text.match(/,30000\);/g)||[]).length,1,'Exactly original 30s setup remains');assert(!/testTimeout|setConfig|,\s*(?:10000|30000|60000)\s*\);\s*$/.test(cases(text)));}
  const setup=after.slice(after.indexOf('beforeAll('),after.indexOf('afterAll('));assert(setup.includes('fixture=await m.start'));assert(setup.includes('other=await m.start'));assert(setup.includes('for(const server of [fixture,other])'));assert(setup.includes('expect(ready.status).toBe(200);await ready.text();'));
  assert(after.includes('Promise.allSettled([fixture?.close(),other?.close()])'));assert(after.includes("throw new AggregateError(failures,'Private fixture cleanup failed')"));
  const concurrent=after.slice(after.indexOf(third));assert(concurrent.includes('expect(other.origin).not.toBe(fixture.origin)'));assert(concurrent.includes('headers:{Authorization:fixture.authorization}'));assert(concurrent.includes('expect(response.status).toBe(401);await response.text()'));assert(!concurrent.includes('startFirst20Preview'));assert(!concurrent.includes('startCalculatorClosurePreview'));
 }
 await assert.rejects(exactSecondPreviewTransformation('src/lib/unlisted.test.ts',''),/Only two named/);
});
