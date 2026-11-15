import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {sourceStage9Policy,sourceStage9CapturePath} from '../four-worker-integration-20261115/source-stage9-policy.mjs';
const read=p=>readFileSync(p),json=p=>JSON.parse(read(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{maxBuffer:16*1024*1024});
test('cumulative23 admits only the exact nine-path worker delta and retains every original Stage9 binding',()=>{
 const proposal=json('docs/remainder226-20261115/source-successor.json'),worker=json('docs/remainder226-20261115/source-policy.json');
 const original=json('docs/four-worker-integration-20261115/source-stage9.json'),current=json(sourceStage9CapturePath);
 assert.equal(sha(read('docs/remainder226-20261115/source-successor.json')),'c2b391ba9f64cf370858ea876df4266424c6790adac3f3fa664cc740f98a07aa');
 assert.equal(sha(read('docs/four-worker-integration-20261115/source-stage9.json')),'1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd');
 assert.equal(sourceStage9Policy.paths.length,23);assert.equal(worker.paths.length,9);
 assert.deepEqual([...new Set([...original.rows.map(r=>r.path),...worker.paths])].sort(),sourceStage9Policy.paths);
 assert.equal(current.codeRef,worker.codeRef);assert(current.ancestry.includes(worker.predecessorRef));assert(current.ancestry.includes(original.codeRef));
 const changed=new Map(proposal.rows.map(r=>[r.path,r]));
 for(const row of current.rows){const incoming=changed.get(row.path),old=original.rows.find(r=>r.path===row.path);assert.deepEqual(row.current,incoming?.current??{...old.current,ref:worker.codeRef});if(incoming?.predecessor)assert.equal(git(['rev-parse',worker.predecessorRef+':'+row.path]).toString().trim(),incoming.predecessor.blob);}
 assert.equal(git(['diff','--name-only',worker.predecessorRef,worker.codeRef,'--','src/calculators','supabase','.github','src/lib/calculator-factory/registry.ts','src/lib/registered-snapshot-verification.ts']).length,0);
});
