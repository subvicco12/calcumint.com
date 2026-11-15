/** Fixed negative argument checks only; no current source admission or successful claim is returned. */
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {realpathSync} from 'node:fs';import {resolve} from 'node:path';
import {accepted} from '../parallel-source-20261110/authority.mjs';import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';import {sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';
const paths=Object.freeze(['src/app/business/shared/[id]/page.test.tsx','src/lib/native-delivery/technology-next-composition.test.ts','src/lib/thirteen-program-evidence.test.ts']);
const capturePath='docs/parallel-source-20261110/capture-revision68.json',sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function rejectWrongSevenTestArguments(input,file,claim,currentBytes){
 const view=sourceStage8HistoricalView(input.git);if(!view&&input.git!==sourceGit)return;
 if(view){assert.equal(input.read,view.historicalInput.read,'Historical Stage8 reader capability differs');assert.equal(resolve(input.root),resolve(view.historicalInput.root),'Historical Stage8 root differs');}
 const actual=view?.actualInput??input;assert.equal(resolve(actual.root),realpathSync(process.cwd()),'Actual workspace root required');
 assert(paths.includes(file),'Only three exact seven-failure test successors');
 const record=accepted.find(row=>row.path===capturePath);assert(record,'Independent seven-test capture required');const bytes=actual.read(capturePath);assert(Buffer.isBuffer(bytes)&&sha(bytes)===record.sha256,'Independent current target bytes differ: '+capturePath);
 const capture=JSON.parse(bytes);assert.deepEqual(capture.sevenTestSuccessors.map(row=>row.path),paths);assert.equal(capture.sevenTestRef,'f68c077b63b1dfabbe9ca3f21e4f195ef645ad97');
 const row=capture.sevenTestSuccessors.find(row=>row.path===file);assert.equal(row.current.path,file);assert.equal(row.current.ref,capture.sevenTestRef);assert.equal(row.predecessor.path,file);
 const latest=accepted.find(record=>record.path===file)??row.current;
 assert(Buffer.isBuffer(currentBytes)&&sha(currentBytes)===latest.sha256,'Exact seven-failure current test bytes required');assert.equal(claim,row.predecessor.sha256,'Exact immutable test predecessor claim required');
}
