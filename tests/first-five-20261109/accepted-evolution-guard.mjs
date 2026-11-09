import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
// Intentionally outside the self-checked converter guard: a mutable capture
// and metadata cannot select a different earlier or later guard together.
const fixed=Object.freeze({capture:'f41f3255facac47406be9c94912edade5cce760f',guardPath:'tests/acceptance-closure-20261108/converter-final-source.test.mjs',guardBlob:'741df068f39832a6a6c64581d08a2ac2459a5342',guardSHA256:'369bb6a02a04aaf3f3a6b319c26ff8550e6fd0a4cb9fa0478f129f4e88262d19'});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function assertAcceptedEvolutionGuard({evidence,rows,guardBytes},git=sourceGit){
 assert.deepEqual(Object.fromEntries(Object.keys(fixed).map(key=>[key,evidence[key]])),fixed,'Fixed reviewed guard capture differs');
 assert.deepEqual(evidence.guardConsumers,['scripts/publication20-caller-lineage.mjs'],'Fixed reviewed guard consumers differ');
 const consumers=rows.filter(row=>row.path===evidence.guardConsumers[0]);assert.equal(consumers.length,1,'Fixed reviewed guard consumer required');
 const dependencies=consumers[0].supplementalSources.filter(dep=>dep.path===fixed.guardPath);assert.deepEqual(dependencies,[{path:fixed.guardPath,ref:fixed.capture,blob:fixed.guardBlob,sha256:fixed.guardSHA256}],'Fixed reviewed guard dependency differs');
 assert.equal(git(['rev-parse','--verify',fixed.capture+'^{commit}']).toString().trim(),fixed.capture,'Fixed reviewed guard provenance differs');
 assert.equal(git(['rev-parse',fixed.capture+':'+fixed.guardPath]).toString().trim(),fixed.guardBlob,'Fixed reviewed guard Git blob differs');
 const bytes=git(['cat-file','blob',fixed.guardBlob]);assert.equal(hash(bytes),fixed.guardSHA256,'Fixed reviewed guard Git bytes differ');
 assert(Buffer.isBuffer(guardBytes)&&guardBytes.equals(bytes),'Fixed reviewed guard current bytes differ');
}
