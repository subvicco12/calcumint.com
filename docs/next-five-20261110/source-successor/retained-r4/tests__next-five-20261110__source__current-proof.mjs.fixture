/** Reviewed exact next-five caller delta; retained R3 never attests new execution. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import * as r3 from './retained-r3-stage.mjs';
import {verifyFixedR4Anchor} from './fixed-anchor.mjs';
import {verifyAcceptedR4Authority} from './accepted-authority.mjs';
export const baselineRef="23f2860c16310385f6c37f7a2bc3c86890631c98";
export const appRef="2188237e0900b27620bc832ade902d895d085cec";
export const capturePath='docs/next-five-20261110/source-successor/capture.json';
const metadata='scripts/product-completion-lineage.mjs',caller='src/components/calculator-interactive.tsx',helper='tests/acceptance-closure-20261108/receipt-source-path.mjs';
export const addedPaths=Object.freeze(['src/components/technology-bounded-analysis.test.tsx','src/components/technology-bounded-analysis.tsx','src/components/technology-next-five-integration.test.tsx','src/lib/native-delivery/technology-next-five-catalog.ts','src/lib/native-delivery/technology-next-five-contract.test.ts','src/lib/native-delivery/technology-next-five-contract.ts','src/lib/technology-next-five-analysis.test.ts','src/lib/technology-next-five-analysis.ts']);
export const proofPaths=Object.freeze(['tests/next-five-20261110/source/current-proof.mjs','tests/next-five-20261110/source/retained-r3-stage.mjs','tests/next-five-20261110/source/retained-r3-anchor.mjs']);
const facade='tests/next-cohort-20261110/source/current-caller-stage.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
export const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const caches=new WeakMap();
function immutableGit(source){let cache=caches.get(source);if(!cache){cache=new Map();caches.set(source,cache);}return args=>{if(args.some(arg=>arg==='HEAD'||arg.startsWith('HEAD:')||arg.startsWith('HEAD^')))return source(args);const key=JSON.stringify(args);if(!cache.has(key))cache.set(key,source(args));return cache.get(key);};}
export function retained23Read(path,git=sourceGit){return git(['show',baselineRef+':'+path]);}
export function verifyCurrentNextFiveSource(read=readFileSync,source=sourceGit,suppliedRows){
 const git=immutableGit(source);verifyAcceptedR4Authority(read,git);const capture=JSON.parse(read(capturePath));
 verifyFixedR4Anchor(capture,read,git);
 assert.equal(capture.stageRevision,4);assert.equal(capture.baselineRef,baselineRef);assert.equal(capture.appRef,appRef);assert.equal(capture.historicalRecordsEdited,false);assert.equal(capture.productionWrites,false);
 const old=name=>retained23Read(name,git),base=old(metadata);assert.equal(hash(base),"8adc887a9997b0b0d61df1ee6127564b20b128810264af83c5b07874d68b9a7d");
 for(const [current,previous,digest]of [['tests/next-five-20261110/source/retained-r3-stage.mjs','tests/next-cohort-20261110/source/current-caller-stage.mjs',"95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"],['tests/next-five-20261110/source/retained-r3-anchor.mjs','tests/next-cohort-20261110/source/current-anchor.mjs',"2f92fd4568a085c7bc54de8b340c5215490bee58bc4bdb74dc9afcd934fb02ca"]]){assert.equal(hash(read(current)),digest);assert(read(current).equals(old(previous)),'Retained R3 source changed');}
 // Execute the original complete proof with its literal historical source view.
 // Cached Git blobs are immutable; every current target below is read live.
 r3.verifyNextCallerStage(r3.parseStageRows(base.toString()),old,git);
 const expected=r3.parseStageRows(base.toString()),row=expected.find(r=>r.path===caller),previous={ref:row.successorRef,blob:row.successorBlob,sha256:row.successorSHA256};
 assert.deepEqual(capture.callerPrevious,previous);assert.equal(capture.callerSource.path,caller);assert.equal(capture.callerSource.ref,appRef);
 row.intermediateSources.push(previous,{...previous,ref:baselineRef});Object.assign(row,{successorRef:capture.callerSource.ref,successorBlob:capture.callerSource.blob,successorSHA256:capture.callerSource.sha256});
 assert.deepEqual(capture.addedSources.map(s=>s.path),addedPaths);for(const record of capture.addedSources){assert.equal(record.ref,appRef);assert(!row.supplementalSources.some(s=>s.path===record.path));row.supplementalSources.push(record);}
 const crossed=expected.filter(r=>(r.supplementalSources??[]).some(s=>s.path===caller));assert.deepEqual(crossed.map(r=>r.path).sort(),['src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts',helper].sort());for(const r of crossed)for(const d of r.supplementalSources)if(d.path===caller)Object.assign(d,capture.callerSource);
 const h=expected.find(r=>r.path===helper),prior={ref:h.successorRef,blob:h.successorBlob,sha256:h.successorSHA256};assert.deepEqual(capture.helperPrevious,prior);assert.equal(capture.helperSource.path,helper);h.intermediateSources.push(prior,{...prior,ref:baselineRef});Object.assign(h,{successorRef:capture.helperSource.ref,successorBlob:capture.helperSource.blob,successorSHA256:capture.helperSource.sha256});
 const outer=expected.find(r=>r.path==='scripts/publication20-caller-lineage.mjs');assert.equal(capture.facadeSource.path,facade);assert.equal(capture.facadeSource.ref,capture.helperSource.ref);for(const d of outer.supplementalSources){if(d.path===helper)Object.assign(d,capture.helperSource);if(d.path===facade)Object.assign(d,capture.facadeSource);}
 assert.deepEqual(capture.proofSources.map(s=>s.path),proofPaths);for(const record of capture.proofSources){assert.equal(record.ref,capture.helperSource.ref);assert(!outer.supplementalSources.some(s=>s.path===record.path));outer.supplementalSources.push(record);}
 const actual=r3.parseStageRows(read(metadata).toString());assert.deepEqual(actual,expected,'Only the reviewed R4 caller delta may advance');if(suppliedRows)assert.deepEqual(suppliedRows,expected,'Only the reviewed R4 caller delta may advance');assert.equal(read(metadata).toString().slice(read(metadata).toString().indexOf('export const completionSourceRefs')),base.toString().slice(base.toString().indexOf('export const completionSourceRefs')));
 for(const r of actual){for(const s of [{ref:r.predecessorRef,blob:r.predecessorBlob,sha256:r.predecessorSHA256},{ref:r.successorRef,blob:r.successorBlob,sha256:r.successorSHA256},...r.intermediateSources??[]])object(s,r.path,false);assert(read(r.path).equals(git(['show',r.successorRef+':'+r.path])),'Current target source differs: '+r.path);for(const d of r.supplementalSources??[])object(d,d.path,true);}
 return true;
 function object(s,path,current){assert.equal(git(['rev-parse','--verify',s.ref+'^{commit}']).toString().trim(),s.ref);assert.equal(git(['rev-parse',s.ref+':'+path]).toString().trim(),s.blob);const bytes=git(['cat-file','blob',s.blob]);assert.equal(hash(bytes),s.sha256);if(current)assert(read(path).equals(bytes),'Current target source differs; Independent current target bytes differ: '+path);}
}
