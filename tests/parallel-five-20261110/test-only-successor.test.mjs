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
 await assert.rejects(assertTestOnlySuccessor('src/lib/unlisted.test.ts','0'.repeat(64),Buffer.from('')),/Only six exact/);
 const binding=JSON.parse(readFileSync(root+'test-only-successor/retained-a7-wrappers/binding.json'));
 for(const row of binding.rows){const old=readFileSync(root+'test-only-successor/retained-a7-wrappers/'+row.baseline.archive,'utf8'),next=readFileSync(root+'test-only-successor/retained-a7-wrappers/'+row.successor.archive,'utf8');assert.equal(await exactRetainedWrapperTransformation(row.path,old),next);await assert.rejects(exactRetainedWrapperTransformation(row.path,old+'\n// changed assertion'),/Exact F042/);}
});
