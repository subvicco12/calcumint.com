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
export const applicationBaselineRef='cef0352fca135b252b981b959c3529170b1f0c81';
export const applicationSuccessorRef='25b56970c05aaffaad2dd856809aaf077ab70554';
export const capturePath='docs/parallel-source-20261110/capture-revision29.json';
const root=fileURLToPath(new URL('../../',import.meta.url)),hash=b=>createHash('sha256').update(b).digest('hex');
const immutableCaches=new WeakMap();
function currentGit(source){
 const head=source(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 let cache=immutableCaches.get(source);if(!cache){cache=new Map();immutableCaches.set(source,cache);}
 return args=>{if(args[0]==='status')return source(args);const exact=args.map(a=>a.startsWith('HEAD:')?head+a.slice(4):a);if(exact.some(a=>a==='HEAD'||a.startsWith('HEAD^')))return source(exact);const key=JSON.stringify(exact);if(!cache.has(key))cache.set(key,source(exact));return cache.get(key);};
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
/** Historical objects are validated as historical; they never fill a current reader. */
function immutableRecord(record,git){
 assert.equal(typeof record.path,'string');assert(!isAbsolute(record.path)&&!record.path.split('/').includes('..'));
 assert.match(record.ref,/^[0-9a-f]{40}$/);assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
 assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);
 const bytes=git(['cat-file','blob',record.blob]);assert.equal(bytes.length,record.bytes);assert.equal(hash(bytes),record.sha256);return bytes;
}
function applicationSuccession(capture,read,git){
 assert.equal(capture.applicationBaselineRef,applicationBaselineRef);assert.equal(capture.applicationSuccessorRef,applicationSuccessorRef);
 assert.equal(capture.applicationSuccessionKind,'EXACT_FINAL_TWO_APP_AND_TEST_SUCCESSOR_NOT_CANONICAL_ACCEPTANCE');
 const changed=git(['diff','--name-only',applicationBaselineRef,applicationSuccessorRef,'--','src']).toString().trim().split('\n');
 assert.equal(changed.length,21);assert.deepEqual(capture.applicationSuccessors.map(r=>r.path),changed);
 assert.equal(git(['diff','--name-only',applicationBaselineRef,applicationSuccessorRef,'--','src/calculators']).toString().trim(),'','Historical mathematical engines must remain immutable');
 const appPaths=changed.filter(p=>!(/\.test\.(?:ts|tsx)$/.test(p)));
 assert.equal(appPaths.length,14);assert.deepEqual(git(['diff','--name-only',applicationBaselineRef,'HEAD','--','src']).toString().trim().split('\n').filter(p=>p&&!(/\.test\.(?:ts|tsx)$/.test(p))),appPaths,'Only the named current app delta may change non-test source');
 assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).toString().trim(),'','Committed current src required; unknown or dirty app source is not admission');
 const parentPaths=new Set(git(['ls-tree','-r','--name-only',applicationBaselineRef,'--','src']).toString().trim().split('\n'));
 const originalPaths=new Set(git(['ls-tree','-r','--name-only',appRef,'--','src']).toString().trim().split('\n'));
 const result=new Map();
 for(const row of capture.applicationSuccessors){
  assert(row.path.startsWith('src/')&&!row.path.startsWith('src/calculators/'));assert.equal(row.current.path,row.path);assert.equal(row.current.ref,applicationSuccessorRef);
  if(parentPaths.has(row.path)){assert.equal(row.parent.path,row.path);assert.equal(row.parent.ref,applicationBaselineRef);immutableRecord(row.parent,git);}else assert.equal(row.parent,null);
  if(originalPaths.has(row.path)){assert.equal(row.historical.path,row.path);assert.equal(row.historical.ref,appRef);immutableRecord(row.historical,git);}else assert.equal(row.historical,null);
  sourceRecord(row.current,read,git);result.set(row.path,row);
 }
 return result;
}
export const sevenTestRef='f68c077b63b1dfabbe9ca3f21e4f195ef645ad97';
export const sevenTestPaths=Object.freeze(['src/app/business/shared/[id]/page.test.tsx','src/lib/native-delivery/technology-next-composition.test.ts','src/lib/thirteen-program-evidence.test.ts']);
function sevenTestSuccession(capture,read,git){
 assert.equal(capture.sevenTestRef,sevenTestRef);assert.deepEqual(capture.sevenTestSuccessors.map(r=>r.path),sevenTestPaths);
 const result=new Map();for(const row of capture.sevenTestSuccessors){
  assert.equal(row.current.path,row.path);assert.equal(row.current.ref,sevenTestRef);assert.equal(row.predecessor.path,row.path);
  assert.equal(row.predecessor.ref,row.path==='src/lib/thirteen-program-evidence.test.ts'?'05129e2a74e70e23160578c63a984c4bf035ed0f':appRef);
  immutableRecord(row.predecessor,git);sourceRecord(row.current,read,git);result.set(row.path,{path:row.path,current:row.current});
 }return result;
}
export function assertSevenTestSuccessor(file,claim,currentBytes,read=readFileSync,git=sourceGit){
 assert(sevenTestPaths.includes(file),'Only three exact seven-failure test successors');git=currentGit(git);
 // Reject altered buffers before the complete successful-claim proof, with no cache of mutable bytes.
 assert(currentBytes.equals(git(['show',sevenTestRef+':'+file])),'Exact seven-failure current test bytes required');
 verifyParallelAuthority(read,git);const capture=JSON.parse(read(capturePath));ensureParallelSources(capture,git);sevenTestSuccession(capture,read,git);
 const row=capture.sevenTestSuccessors.find(r=>r.path===file);assert.equal(claim,row.predecessor.sha256,'Exact immutable test predecessor claim required');
 return {successorGit:sevenTestRef,successorSHA256:row.current.sha256,testOnly:true};
}
/** One invocation proves all named current bytes; callers must not retain this proof across reads. */
export function proveNamedCurrentContext(read=readFileSync,git=sourceGit){
 git=currentGit(git);verifyParallelAuthority(read,git);const capture=JSON.parse(read(capturePath));ensureParallelSources(capture,git);
 const rows=new Map([...applicationSuccession(capture,read,git),...sevenTestSuccession(capture,read,git)]);
 return new Map([...rows].map(([path,row])=>{const original=capture.sevenTestSuccessors.find(r=>r.path===path)?.predecessor??row.historical;return[path,{current:row.current,recordedSHA256:original?.sha256}];}));
}
export function assertNamedApplicationSuccessor(file,recordedSHA256,currentBytes,read=readFileSync,git=sourceGit){
 git=currentGit(git);
 verifyParallelAuthority(read,git);const capture=JSON.parse(read(capturePath));ensureParallelSources(capture,git);
 const row=applicationSuccession(capture,read,git).get(file);assert(row&&row.historical,'Only an exact historical named final-two source claim is admitted');
 assert.equal(recordedSHA256,row.historical.sha256,'Exact original F042 source claim required');assert.equal(hash(currentBytes),row.current.sha256,'Current named application successor differs');assert(currentBytes.equals(immutableRecord(row.current,git)));
 return {file,recordedApplicationGit:appRef,currentApplicationGit:applicationSuccessorRef,historicalEvidenceOnly:true};
}
export function assertFinalTwoScopeTestSuccessor(file,intermediateBytes,currentBytes,git=sourceGit){
 assert(['src/components/technology-five-delivery.test.tsx','src/components/technology-next-native.test.tsx'].includes(file),'Only two named native test successors');
 // Reject malformed supplied bytes before expensive full-graph proof; successful claims still prove every edge below.
 assert(currentBytes.equals(git(['show',applicationSuccessorRef+':'+file])),'Current final-two scope test differs from exact reviewed Git');
 verifyParallelAuthority(readFileSync,git);const capture=JSON.parse(readFileSync(capturePath));ensureParallelSources(capture,git);
 const row=applicationSuccession(capture,readFileSync,git).get(file);assert(row?.parent);const prior='a1014a3914977af8a8d9e85aa2bf08269fccf504';
 assert.equal(git(['rev-parse','--verify',prior+'^{commit}']).toString().trim(),prior);assert(intermediateBytes.equals(git(['show',prior+':'+file])),'Original exact A101 test stage must remain proved');
 assert(intermediateBytes.equals(immutableRecord(row.parent,git)),'Prior current test stage must match the frozen baseline');
 assert.equal(hash(currentBytes),row.current.sha256,'Current final-two scope test differs from exact reviewed Git');assert(currentBytes.equals(immutableRecord(row.current,git)));
 return {successorGit:applicationSuccessorRef,successorSHA256:row.current.sha256};
}
export function verifyParallelSource(read=readFileSync,git=sourceGit,suppliedRows){
 const actualGit=git;
 git=currentGit(git);
 verifyParallelAuthority(read,git);
 const capture=JSON.parse(read(capturePath));assert.equal(capture.baselineRef,baselineRef);assert.equal(capture.appRef,appRef);assert.equal(capture.productionWrites,false);assert.equal(capture.historicalRecordsEdited,false);
 ensureParallelSources(capture);
 if(actualGit===sourceGit)sourceGit.preloadBlobs([...capture.currentSources,...capture.applicationSources,...capture.guardSources].map(r=>r.blob));
 const delta=new Map([...applicationSuccession(capture,read,git),...sevenTestSuccession(capture,read,git)]);
 const baseline=retainedA7Proof();assert.deepEqual(capture.retainedReads,baseline.rows,'Original R5 read closure differs');
 const appPaths=git(['diff','--name-only',baselineRef,appRef,'--','src']).toString().trim().split('\n');assert.equal(appPaths.length,27);assert.deepEqual(capture.applicationSources.map(r=>r.path),appPaths);
 for(const row of capture.applicationSources){assert.equal(row.ref,appRef);if(delta.has(row.path)){immutableRecord(row,git);sourceRecord(delta.get(row.path).current,read,git);}else sourceRecord(row,read,git);}
 const guardPaths=['tests/next-five-20261110/source/current-proof.mjs','tests/publication-workflows-20261109/source-evolution.test.mjs','tests/first-five-20261109/crossed-dependency-source.test.mjs','tests/acceptance-closure-20261108/converter-final-source.test.mjs'];
 assert.deepEqual(capture.guardSources.map(r=>r.path),guardPaths,'Only the exact historical-test and proof entry successors may advance');
 for(const row of capture.guardSources)sourceRecord(row,read,git);
 const all=[...capture.currentSources,...capture.applicationSources];assert.equal(new Set(capture.currentSources.map(r=>r.path)).size,capture.currentSources.length);
 for(const row of capture.currentSources)sourceRecord(row,read,git);
 // Every byte observed by the old complete proof remains guarded in the new view.
 for(const row of baseline.rows)assert(all.some(r=>r.path===row.path),'Unbound original current source: '+row.path);
 const metadata='scripts/product-completion-lineage.mjs',old=git(['show',baselineRef+':'+metadata]).toString(),current=read(metadata).toString();
 const historicalTail=old.slice(old.indexOf('export const completionSourceRefs'));
 const insertion=" if(claim!==b.predecessorSHA256)throw Error('Completion predecessor claim differs: '+name);";
 assert.equal(historicalTail.split(insertion).length,2,'Exact unchanged guard insertion preimage required');
 assert.equal(current.slice(current.indexOf('export const completionSourceRefs')),historicalTail.replace(insertion,insertion+'\n git=completionGitReader(git);'),'Only the independently bound immutable Git transport insertion may extend the unchanged executable guard');
 const before=parseRows(old),after=parseRows(current);assert.deepEqual(after.map(r=>r.path),before.map(r=>r.path));if(suppliedRows)assert.deepEqual(suppliedRows,after,'Only the reviewed parallel source rows are admitted');
 const apps=new Map(capture.applicationSources.map(r=>[r.path,delta.get(r.path)?.current??r]));for(const [path,row]of delta)apps.set(path,row.current);
 const evolutions=new Map([...apps,...capture.guardSources.map(r=>[r.path,r])]);
 const reviewedPath='src/lib/execution-recovery-evidence.test.ts',reviewedRef='05129e2a74e70e23160578c63a984c4bf035ed0f';
 const reviewed=capture.currentSources.find(r=>r.path===reviewedPath);assert(reviewed,'Reviewed exact test successor must remain captured');
 assert.equal(git(['rev-parse',reviewedRef+':'+reviewedPath]).toString().trim(),reviewed.blob);
 assert.equal(hash(git(['show',reviewedRef+':'+reviewedPath])),reviewed.sha256);
 const owners=before.filter(b=>b.supplementalSources?.some(d=>d.path===reviewedPath)).map(b=>b.path).sort();
 assert.deepEqual(owners,['scripts/publication20-caller-lineage.mjs','tests/acceptance-closure-20261108/receipt-source-path.mjs']);
 evolutions.set(reviewedPath,{...reviewed,ref:reviewedRef});
 const nodePath='tests/shortest-publication-20/caller-lineage.test.mjs',nodeRef='756922bebd73e66a2900a35a92a3854ad2813d73';
 const nodeRecord=capture.currentSources.find(r=>r.path===nodePath);assert(nodeRecord,'Exact current caller-tamper test must remain captured');
 assert.equal(git(['rev-parse',nodeRef+':'+nodePath]).toString().trim(),nodeRecord.blob);assert.equal(hash(git(['show',nodeRef+':'+nodePath])),nodeRecord.sha256);
 assert.deepEqual(before.filter(b=>b.supplementalSources?.some(d=>d.path===nodePath)).map(b=>b.path),['scripts/publication20-caller-lineage.mjs']);
 const ownedEvolutions=new Map(apps);ownedEvolutions.set(nodePath,{...nodeRecord,ref:nodeRef});evolutions.set(nodePath,{...nodeRecord,ref:nodeRef});
 const diagnosticPath='tests/product-completion-lineage.test.mjs',diagnosticRef='a963ef7aaa04664d07709cc431d6214511bc0573';
 const diagnostic=capture.currentSources.find(r=>r.path===diagnosticPath);assert(diagnostic,'Exact reviewed Git diagnostic successor must remain captured');
 assert.equal(git(['rev-parse',diagnosticRef+':'+diagnosticPath]).toString().trim(),diagnostic.blob);assert.equal(hash(git(['show',diagnosticRef+':'+diagnosticPath])),diagnostic.sha256);
 assert.deepEqual(before.filter(b=>b.supplementalSources?.some(d=>d.path===diagnosticPath)).map(b=>b.path),['scripts/check-current-six-candidate-evidence.mjs']);
 evolutions.set(diagnosticPath,{...diagnostic,ref:diagnosticRef});
 const receiptPath='tests/acceptance-closure-20261108/receipt-source-path.mjs',receiptRef='71f285544bd85b46e51da109897c12bfff7b798f';
 const receipt=capture.currentSources.find(r=>r.path===receiptPath);assert(receipt,'Exact fresh-receipt claim verifier successor must remain captured');
 assert.equal(git(['rev-parse',receiptRef+':'+receiptPath]).toString().trim(),receipt.blob);assert.equal(hash(git(['show',receiptRef+':'+receiptPath])),receipt.sha256);
 assert.deepEqual(before.filter(b=>b.supplementalSources?.some(d=>d.path===receiptPath)).map(b=>b.path),['scripts/publication20-caller-lineage.mjs']);
 assert.equal(before.filter(b=>b.path===receiptPath).length,1,'Exact owned receipt verifier predecessor required');
 ownedEvolutions.set(receiptPath,{...receipt,ref:receiptRef});evolutions.set(receiptPath,{...receipt,ref:receiptRef});
 const allowedExtras=new Map(apps);
 const retainedPaths=['src/components/technology-bounded-analysis.test.tsx','src/components/technology-bounded-analysis.tsx','src/components/technology-next-five-integration.test.tsx','src/lib/native-delivery/technology-next-five-catalog.ts','src/lib/native-delivery/technology-next-five-contract.test.ts','src/lib/native-delivery/technology-next-five-contract.ts','src/lib/technology-next-five-analysis.test.ts','src/lib/technology-next-five-analysis.ts'];
 for(const path of retainedPaths){const bytes=git(['show',baselineRef+':'+path]);allowedExtras.set(path,{path,ref:baselineRef,blob:git(['rev-parse',baselineRef+':'+path]).toString().trim(),sha256:hash(bytes)});}
 const short=r=>({path:r.path,ref:r.ref,blob:r.blob,sha256:r.sha256});
 for(let i=0;i<before.length;i++){
  const prior=before[i],now=after[i],expected=structuredClone(prior),app=ownedEvolutions.get(prior.path);
  if(app){expected.intermediateSources??=[];if(prior.path===receiptPath){const ref='881c62c140d881b8c7fe70ce9bd5dcc187b54c32',bytes=git(['show',ref+':'+receiptPath]);expected.intermediateSources.push({ref:prior.successorRef,blob:prior.successorBlob,sha256:prior.successorSHA256});expected.intermediateSources.push({ref,blob:git(['rev-parse',ref+':'+receiptPath]).toString().trim(),sha256:hash(bytes)});}if(prior.path!==receiptPath)expected.intermediateSources.push({ref:prior.successorRef,blob:prior.successorBlob,sha256:prior.successorSHA256});Object.assign(expected,{successorRef:app.ref,successorBlob:app.blob,successorSHA256:app.sha256});}
  if(expected.supplementalSources)expected.supplementalSources=expected.supplementalSources.map(d=>evolutions.has(d.path)?short(evolutions.get(d.path)):d);
  const count=expected.supplementalSources?.length??0,extras=(now.supplementalSources??[]).slice(count);for(const d of extras){assert(allowedExtras.has(d.path),'Unreviewed supplemental source');assert.deepEqual(d,short(allowedExtras.get(d.path)));}
  if(extras.length)expected.supplementalSources=[...(expected.supplementalSources??[]),...extras];assert.deepEqual(now,expected,'Only named app/data successors may advance: '+prior.path);
 }
 // A separately captured current file must also be the exact byte target of
 // every declared live dependency edge; detached historical proofs cannot fill it.
 const checkedEdges=new Set();
 for(const row of after)for(const dep of row.supplementalSources??[]){
  const identity=dep.ref+':'+dep.path+':'+dep.blob;if(checkedEdges.has(identity))continue;checkedEdges.add(identity);
  const bytes=git(['cat-file','blob',dep.blob]);sourceRecord({...dep,bytes:bytes.length},read,git);
 }
 for(const r of apps.values())assert(after.some(b=>b.path===r.path||b.supplementalSources?.some(d=>d.path===r.path)),'Application dependency missing from current binding graph');
 return true;
}
