/** Named exact-Git successor. Historical R5 executes unchanged; current targets never use its view. */
import assert from 'node:assert/strict';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {retainedA7Proof,sourceGit,baselineRef} from './baseline-runtime.mjs';
import {verifyParallelAuthority} from './authority.mjs';
import {ensureParallelSources} from './bootstrap.mjs';
export const appRef='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
export const capturePath='docs/parallel-source-20261110/capture-revision8.json';
const root=fileURLToPath(new URL('../../',import.meta.url)),hash=b=>createHash('sha256').update(b).digest('hex');
const immutableCaches=new WeakMap();
function currentGit(source){
 const head=source(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 let cache=immutableCaches.get(source);if(!cache){cache=new Map();immutableCaches.set(source,cache);}
 return args=>{const exact=args.map(a=>a.startsWith('HEAD:')?head+a.slice(4):a);if(exact.some(a=>a==='HEAD'||a.startsWith('HEAD^')))return source(exact);const key=JSON.stringify(exact);if(!cache.has(key))cache.set(key,source(exact));return cache.get(key);};
}
export function parseRows(text){const match=/const bindings=(\[[\s\S]*?\n\]);/.exec(text);assert(match,'Exact completion bindings required');return JSON.parse(match[1]);}
function sourceRecord(record,read,git){
 assert.equal(typeof record.path,'string');assert(!isAbsolute(record.path)&&!record.path.split('/').includes('..'));
 assert.match(record.ref,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
 assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob,'Exact reviewed source object differs: '+record.path);
 assert.equal(git(['rev-parse','HEAD:'+record.path]).toString().trim(),record.blob,'Current HEAD source object differs: '+record.path);
 const expected=git(['cat-file','blob',record.blob]);assert.equal(expected.length,record.bytes);assert.equal(hash(expected),record.sha256);
 const target=resolve(root,record.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current source required: '+record.path);assert.equal(realpathSync(target),target,'Current source path was redirected');
 assert(read(record.path).equals(expected),'Current target source differs; Independent current target bytes differ: '+record.path);
}
export function verifyParallelSource(read=readFileSync,git=sourceGit,suppliedRows){
 const actualGit=git;
 git=currentGit(git);
 verifyParallelAuthority(read,git);
 const capture=JSON.parse(read(capturePath));assert.equal(capture.baselineRef,baselineRef);assert.equal(capture.appRef,appRef);assert.equal(capture.productionWrites,false);assert.equal(capture.historicalRecordsEdited,false);
 ensureParallelSources(capture);
 if(actualGit===sourceGit)sourceGit.preloadBlobs([...capture.currentSources,...capture.applicationSources,...capture.guardSources].map(r=>r.blob));
 const baseline=retainedA7Proof();assert.deepEqual(capture.retainedReads,baseline.rows,'Original R5 read closure differs');
 const appPaths=git(['diff','--name-only',baselineRef,appRef,'--','src']).toString().trim().split('\n');assert.equal(appPaths.length,27);assert.deepEqual(capture.applicationSources.map(r=>r.path),appPaths);
 for(const row of capture.applicationSources){assert.equal(row.ref,appRef);sourceRecord(row,read,git);}
 const guardPaths=['tests/next-five-20261110/source/current-proof.mjs','tests/publication-workflows-20261109/source-evolution.test.mjs','tests/first-five-20261109/crossed-dependency-source.test.mjs','tests/acceptance-closure-20261108/converter-final-source.test.mjs'];
 assert.deepEqual(capture.guardSources.map(r=>r.path),guardPaths,'Only the exact historical-test and proof entry successors may advance');
 for(const row of capture.guardSources)sourceRecord(row,read,git);
 const all=[...capture.currentSources,...capture.applicationSources];assert.equal(new Set(capture.currentSources.map(r=>r.path)).size,capture.currentSources.length);
 for(const row of capture.currentSources)sourceRecord(row,read,git);
 // Every byte observed by the old complete proof remains guarded in the new view.
 for(const row of baseline.rows)assert(all.some(r=>r.path===row.path),'Unbound original current source: '+row.path);
 const metadata='scripts/product-completion-lineage.mjs',old=git(['show',baselineRef+':'+metadata]).toString(),current=read(metadata).toString();
 assert.equal(current.slice(current.indexOf('export const completionSourceRefs')),old.slice(old.indexOf('export const completionSourceRefs')),'Completion executable guard changed');
 const before=parseRows(old),after=parseRows(current);assert.deepEqual(after.map(r=>r.path),before.map(r=>r.path));if(suppliedRows)assert.deepEqual(suppliedRows,after,'Only the reviewed parallel source rows are admitted');
 const apps=new Map(capture.applicationSources.map(r=>[r.path,r])),evolutions=new Map([...apps,...capture.guardSources.map(r=>[r.path,r])]);
 const allowedExtras=new Map(apps);
 const retainedPaths=['src/components/technology-bounded-analysis.test.tsx','src/components/technology-bounded-analysis.tsx','src/components/technology-next-five-integration.test.tsx','src/lib/native-delivery/technology-next-five-catalog.ts','src/lib/native-delivery/technology-next-five-contract.test.ts','src/lib/native-delivery/technology-next-five-contract.ts','src/lib/technology-next-five-analysis.test.ts','src/lib/technology-next-five-analysis.ts'];
 for(const path of retainedPaths){const bytes=git(['show',baselineRef+':'+path]);allowedExtras.set(path,{path,ref:baselineRef,blob:git(['rev-parse',baselineRef+':'+path]).toString().trim(),sha256:hash(bytes)});}
 const short=r=>({path:r.path,ref:r.ref,blob:r.blob,sha256:r.sha256});
 for(let i=0;i<before.length;i++){
  const prior=before[i],now=after[i],expected=structuredClone(prior),app=apps.get(prior.path);
  if(app){expected.intermediateSources??=[];expected.intermediateSources.push({ref:prior.successorRef,blob:prior.successorBlob,sha256:prior.successorSHA256});Object.assign(expected,{successorRef:app.ref,successorBlob:app.blob,successorSHA256:app.sha256});}
  if(expected.supplementalSources)expected.supplementalSources=expected.supplementalSources.map(d=>evolutions.has(d.path)?short(evolutions.get(d.path)):d);
  const count=expected.supplementalSources?.length??0,extras=(now.supplementalSources??[]).slice(count);for(const d of extras){assert(allowedExtras.has(d.path),'Unreviewed supplemental source');assert.deepEqual(d,short(allowedExtras.get(d.path)));}
  if(extras.length)expected.supplementalSources=[...(expected.supplementalSources??[]),...extras];assert.deepEqual(now,expected,'Only named app/data successors may advance: '+prior.path);
 }
 for(const r of capture.applicationSources)assert(after.some(b=>b.path===r.path||b.supplementalSources?.some(d=>d.path===r.path)),'Application dependency missing from current binding graph');
 return true;
}
