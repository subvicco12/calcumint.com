import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assertTestOnlySuccessor,testOnlySuccessorPaths,exactRetainedWrapperTransformation} from './test-only-successor.mjs';
const root='docs/parallel-five-20261110/authenticated/',source=JSON.parse(readFileSync(root+'final-source-version.json'));
for(const file of testOnlySuccessorPaths)test('only exact committed test successor is admitted: '+file,async()=>{
 const baseline=source.currentBlobBindings[file].recordedBuildSourceSHA256,bytes=readFileSync(file);
 assert.equal((await assertTestOnlySuccessor(file,baseline,bytes)).testOnly,true);
 await assert.rejects(assertTestOnlySuccessor(file,baseline,Buffer.concat([bytes,Buffer.from('\n// unrelated change')])));
 await assert.rejects(assertTestOnlySuccessor(file,'0'.repeat(64),bytes));
 if(file.startsWith('src/lib/'))await assert.rejects(assertTestOnlySuccessor(file,baseline,bytes,()=>{throw Error('missing exact Git source')}),/missing exact Git source/);
});
test('no generic test path, missing original block or extra original assertion change is allowed',async()=>{
 await assert.rejects(assertTestOnlySuccessor('src/lib/unlisted.test.ts','0'.repeat(64),Buffer.from('')),/Only seven exact/);
 const binding=JSON.parse(readFileSync(root+'test-only-successor/retained-a7-wrappers/binding.json'));
 for(const row of binding.rows){const old=readFileSync(root+'test-only-successor/retained-a7-wrappers/'+row.baseline.archive,'utf8'),next=readFileSync(root+'test-only-successor/retained-a7-wrappers/'+row.successor.archive,'utf8');assert.equal(await exactRetainedWrapperTransformation(row.path,old),next);await assert.rejects(exactRetainedWrapperTransformation(row.path,old+'\n// changed assertion'),/Exact F042/);}
});

test('preview admission preserves every case body and both original setup and case limits',()=>{
 const dir=root+'test-only-successor/preview-readiness/',binding=JSON.parse(readFileSync(dir+'binding.json')),before=readFileSync(dir+'baseline.fixture','utf8'),after=readFileSync(dir+'successor.fixture','utf8');
 assert.equal(binding.rows.length,1);assert.equal(before.split(binding.replacement.from).length,2);assert.equal(before.replace(binding.replacement.from,binding.replacement.to),after);
 assert.equal(before.slice(before.indexOf('afterAll(')),after.slice(after.indexOf('afterAll(')));assert.equal((after.match(/it\('/g)||[]).length,4);assert.equal(binding.replacement.from,';},30000);');assert(binding.replacement.to.endsWith(';},30000);'));
});
