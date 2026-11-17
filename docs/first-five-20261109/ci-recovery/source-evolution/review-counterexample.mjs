/** Manual historical engineering-review reproduction only; no mandatory CI/bootstrap input. */
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const guard='tests/acceptance-closure-20261108/converter-final-source.test.mjs';
const reviewed='f41f3255facac47406be9c94912edade5cce760f',redirect='cd46039215693bcc3ad451cda970522b73be7e93';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}),hash=b=>createHash('sha256').update(b).digest('hex');
const original=git(['show',reviewed+':'+guard]),source=original.toString();
assert.equal(hash(original),'369bb6a02a04aaf3f3a6b319c26ff8550e6fd0a4cb9fa0478f129f4e88262d19');
const parseBindings=s=>JSON.parse(s.slice(s.indexOf('const bindings=')+'const bindings='.length,s.indexOf('\n];\nexport const completionSourceRefs')+2));
// Use immutable de32 metadata/capture, so later fixes cannot rewrite this observation.
const reviewHead='de32bd48abc033a953f4b1be12dad9d9f93a4dae';
const evidence=JSON.parse(git(['show',reviewHead+':docs/first-five-20261109/ci-recovery/source-evolution/capture.json']));
assert.equal(evidence.capture,reviewed);
const bytes=git(['show',redirect+':'+guard]);
evidence.capture=redirect;evidence.guardBlob=git(['rev-parse',redirect+':'+guard]).toString().trim();evidence.guardSHA256=hash(bytes);
const metadata=git(['show',reviewHead+':scripts/product-completion-lineage.mjs']);
const rows=parseBindings(metadata.toString());let changed=0;
for(const row of rows)for(const dep of row.supplementalSources??[])if(dep.path===guard){Object.assign(dep,{ref:redirect,blob:evidence.guardBlob,sha256:evidence.guardSHA256});changed++;}
assert.equal(changed,1);
const start=source.indexOf('function proveCurrentSourceEvolution('),end=source.indexOf("\ntest('current first-five source evolution",start);assert(start>=0&&end>start);
// Execute the actual unchanged historical proof function with only in-memory target readers.
const factory=new Function('assert','json','hash','parseBindings','retainedCohortRef','readFileSync','git',source.slice(start,end)+';return proveCurrentSourceEvolution;');
const read=name=>name===guard?bytes:name==='scripts/product-completion-lineage.mjs'?metadata:readFileSync(name);
const prove=factory(assert,()=>evidence,hash,parseBindings,'00651cc382be5dcbd596882071787fd6702c13d3',read,git);
prove(rows,read,git);
console.log(JSON.stringify({kind:'FINITE_HISTORICAL_ENGINEERING_REVIEW_COUNTEREXAMPLE_NOT_ACCEPTANCE',reviewHead,proofSource:reviewed,proofSourceSha256:hash(original),redirectedGuard:redirect,changedMetadataFields:['ref','blob','sha256'],changedConsumerCount:changed,outcome:'HISTORICAL_PROOF_ACCEPTED_COUPLED_REDIRECTION',filesModified:false,productionAccess:false,scope:'Only the historical f41 function was exercised; no claim about the later independent mandatory anchor.'},null,2));
