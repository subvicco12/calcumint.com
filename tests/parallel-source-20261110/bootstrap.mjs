/** Object availability only. The caller must first verify the independently pinned capture. */
import assert from 'node:assert/strict';
import {makeGitReader} from './git-reader.mjs';
import {appStage5Policy} from '../completion-wave-20261113/source-app-stage5-policy.mjs';
import {testStage6Policy} from '../completion-wave-20261113/source-test-stage6-policy.mjs';
import {balancePolicy} from '../ci-balance-20261113/policy.mjs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {factoryPolicy} from '../calculator-factory-source-20261112/policy.mjs';
import {withSourceObjectLock} from './source-object-lock.mjs';
import {completionPolicy} from '../completion-first-20261112/policy.mjs';
import {workflowPolicy} from '../completion-first-20261112/workflows-policy.mjs';
import {nonSourcePolicy} from '../completion-first-20261112/non-source-policy.mjs';
import {testStagePolicy} from '../completion-first-20261112/test-stage-policy.mjs';
import {personalPolicy} from '../completion-first-20261112/personal-policy.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const allowed=new Set(['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git']);
const invoke=(args,options={})=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{cwd:root,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:options.stdio??['ignore','pipe','pipe'],timeout:options.timeout??60000,maxBuffer:options.maxBuffer??4*1024*1024,...(options.input===undefined?{}:{input:options.input})});
const appStage5AvailabilityReader=makeGitReader(invoke),testStage6AvailabilityReader=makeGitReader(invoke);
let ready=false,nonSourceReady=false,testStageReady=false,appStage5Ready=false,testStage6Ready=false;
/** Standalone retained workflow readers run before the larger parallel bootstrap.
 * Retrieve only the two independently pinned NS commits, never a caller-nominated ref.
 * Availability does not replace the caller's complete content/ancestry/source proof.
 */
export function ensureNonSourceObjects(git=invoke){
 const refs=['345c6cd6ed42aff39635d5e92d4adb48989b78ac','5008aa4cadd77f7a9a5dc1523cace694f3bbdf47'];
 assert.deepEqual(nonSourcePolicy.ancestry,refs,'Exact independently governed NS ancestry required');
 if(git===invoke&&nonSourceReady)return true;
 const common=resolve(root,invoke(['rev-parse','--git-common-dir']).toString().trim());
 const result=withSourceObjectLock(common,()=>{
  const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');
  assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
  for(const ref of refs){
   const present=()=>{let found;try{found=git(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(found,ref,'NS source commit was substituted');return true;};
   if(!present())git(['fetch','--no-tags','--depth=1','origin',ref]);
   assert(present(),'Exact NS source unavailable after one bounded fetch');
  }
  return true;
 });
 if(git===invoke)nonSourceReady=true;return result;
}
/** Only the independently pinned test-only predecessor chain may be retrieved. */
export function ensureTestStageObjects(){
 const refs=["0c74b8135cca8892548a90eb497c46bdf022b228", "c4372902a6664cd3adafb98cce9e5e15ff9e5e4d", "29dd0aaee461e6ac1510cce6e92917545b3852d3", "257546f29b7915b10b6dcc7b6b0d3195f55db73d", "50ac069ef8be504db29658d729339b4f3f1cf39b", "8e46f2b9fa48285595dfe583bc45b454956abbca", "f75693d0d9987964ea105464050aa3966e377c55", "32f6c2a11efd9daf3207def406b1f2f8452c92d7", "79eb54a70bd7ec2e98bf058501d95f039e59966c"];
 assert.deepEqual(testStagePolicy.ancestry,refs,'Exact test-only source ancestry required');
 if(testStageReady)return true;
 const common=resolve(root,invoke(['rev-parse','--git-common-dir']).toString().trim());
 const result=withSourceObjectLock(common,()=>{
  const urls=invoke(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
  for(const ref of refs){const present=()=>{let found;try{found=invoke(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(found,ref,'Test-only source commit was substituted');return true;};if(!present())invoke(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Exact test-only source unavailable after one bounded fetch');}
  return true;
 });
 testStageReady=true;return result;
}
/** Internal availability primitive: only independently pinned refs; not a source proof. */
function preparePinnedCommits(refs,git,objects){
 const finite=new Set(refs),recovered=new Set();
 assert(refs.length>=2&&refs.length<=64&&finite.size===refs.length);for(const ref of refs)assert.match(ref,/^[a-f0-9]{40}$/);
 const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
 for(;;){try{objects.preloadCommits(refs);return objects;}catch(error){const missing=error?.missingCommit;if(!finite.has(missing)||recovered.has(missing))throw error;recovered.add(missing);git(['fetch','--no-tags','--depth=1','origin',missing]);}}
}
export function prepareAppStage5Commits(git,objects=makeGitReader(git)){return preparePinnedCommits(appStage5Policy.ancestry,git,objects);}
/** Availability for independently pinned Stage5 ancestry only; never derive refs from HEAD/capture. */
export function ensureAppStage5Objects(git=invoke){
 assert.match(appStage5Policy.codeRef??'',/^[a-f0-9]{40}$/,'Stage5 application policy remains unarmed');
 const refs=appStage5Policy.ancestry;
 assert(refs.length>=2&&refs.length<=64&&new Set(refs).size===refs.length,'Finite Stage5 ancestry required');
 assert.equal(refs[0],appStage5Policy.codeRef);assert.equal(refs.at(-1),'0c74b8135cca8892548a90eb497c46bdf022b228');
 if(git===invoke&&appStage5Ready)return true;
 const common=resolve(root,invoke(['rev-parse','--git-common-dir']).toString().trim());
 const result=withSourceObjectLock(common,()=>{
  const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
  const available=git===invoke?prepareAppStage5Commits(invoke,appStage5AvailabilityReader):git;
  for(const ref of refs){assert.match(ref,/^[a-f0-9]{40}$/);const present=()=>{let found;try{found=available(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(found,ref,'Stage5 commit was substituted');return true;};if(!present())git(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Exact Stage5 source unavailable after bounded fetch');}
  return true;
 });
 // Cache immutable object availability only after lock release; custom transports always recheck.
 if(git===invoke)appStage5Ready=true;return result;
}
/** Independently pinned test-only Stage6 availability; never admits current bytes. */
export function ensureTestStage6Objects(git=invoke){
 const refs=testStage6Policy.ancestry;assert.equal(refs[0],testStage6Policy.codeRef);assert.equal(refs.at(-1),'8cbf39c4fd62e4c4a5cf08447cd669171ae32e79');assert(refs.length>=2&&refs.length<=64&&new Set(refs).size===refs.length);if(git===invoke&&testStage6Ready)return true;
 const common=resolve(root,invoke(['rev-parse','--git-common-dir']).toString().trim());
 const result=withSourceObjectLock(common,()=>{
  const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
  const available=git===invoke?preparePinnedCommits(refs,invoke,testStage6AvailabilityReader):git;
  for(const ref of refs){assert.match(ref,/^[a-f0-9]{40}$/);const present=()=>{let found;try{found=available(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(found,ref,'Stage6 commit was substituted');return true;};if(!present())git(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Exact Stage6 source unavailable after bounded fetch');}
  return true;
 });
 if(git===invoke)testStage6Ready=true;return result;
}
export function ensureParallelSources(capture,git=invoke,options={}){
 assert.equal(capture.baselineRef,'a7bab5b5534d51cea25ba5ffe4aa9b3630176909');assert.equal(capture.appRef,'f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5');assert.match(capture.codeRef,/^[0-9a-f]{40}$/);
 assert.equal(capture.guardSources.length,4);assert.equal(new Set(capture.guardSources.map(r=>r.ref)).size,1);
 for(const row of capture.guardSources)assert.match(row.ref,/^[0-9a-f]{40}$/);
 const selected=new Set(['0180f2f3c70e16f2a26972a74b32d672c468e2ef','d19788388bf011e59ad1c739f8dd5b68cceae3f6','3267e2ae2ca2e23ab939fcb8f4287c22cc86c1ff','89aa138eec173fef8284bcc6575eca8edfd4a729','a1531e10a1a959d63c30639d4a3e48305d2e3ce2','f41a510170877b9932ee9268c0bacc69e9dba839','f3b0a158b62edb3f099b7d9d8aaac9d1d7dd62a5','f3056fc30174acaf9dc9ddc78453b53f245d1a58','b73db91a4a89173925b4bf422c7233dca419eff7','982e294f1a0d6413f857d9fed069fda40a916d42',balancePolicy.predecessorRef,balancePolicy.codeRef,'10aea22d673a1b201455aadb894d127359fa3741','f85b2fbcfd3c97e4de0805a7065c38d5f2ec6736','ff693a438dedffbf35312b4e4aa244dc7e027dee','c7b25d34566a6a206acf07ef2cb4c9bed71a212e','469e856824c4f752be1024b96519a0571a1a7632','471fcde43fb64be784220e9e4a3e5cc92f80b04f','a5cfb96af4564d90c6367ba0ee1f7c773e0f201b','61bcbae72341a2f4979d9a1abee2cdf154554a19','9e82c27f1c9c3c0edb92f209bcbd987cd5d9d7a8','64fbafa674bc3a41017abe60ce95e50e42fbbaa4','a4b3a560af11dedc65dd6f7a97c5c6829c91de59','f4fa576cb070a31a3408f46c267c13b1e7b1f4eb',...factoryPolicy.ancestry,...completionPolicy.ancestry,completionPolicy.auxiliaryRef,...personalPolicy.ancestry,...personalPolicy.auxiliaryAncestry,...workflowPolicy.ancestry,...workflowPolicy.guardAncestry,...nonSourcePolicy.ancestry,...testStagePolicy.ancestry,...appStage5Policy.ancestry,...testStage6Policy.ancestry,'0b0e9c25c888463d2bbe5937eb1059cf10cdf7b8',capture.baselineRef,capture.appRef,capture.codeRef,'f68c077b63b1dfabbe9ca3f21e4f195ef645ad97','cef0352fca135b252b981b959c3529170b1f0c81','25b56970c05aaffaad2dd856809aaf077ab70554','71f285544bd85b46e51da109897c12bfff7b798f','a1014a3914977af8a8d9e85aa2bf08269fccf504','881c62c140d881b8c7fe70ce9bd5dcc187b54c32','02d1a7eac0d7853197a4410520f548f0ce8b335f','224b9f6684d7e27a923c69d140ddc0104f1e58e7','05129e2a74e70e23160578c63a984c4bf035ed0f','b2f12b04b6ded9e84bb07d4d6c170ac157f8cad3','756922bebd73e66a2900a35a92a3854ad2813d73','a963ef7aaa04664d07709cc431d6214511bc0573','d7eb23e22d2357af838b6d4ba983971090ed8713',...capture.guardSources.map(r=>r.ref)]);
 for(const row of [...capture.currentSources,...capture.applicationSources])assert(selected.has(row.ref),'Unreviewed source revision outside approved exact source and finite test-successor revisions');
 const availability=()=>{
 if(git===invoke&&ready)return true;
 const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
 function requireObject(ref){assert.match(ref,/^[0-9a-f]{40}$/);const present=()=>{let found;try{found=git(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(found,ref,'Source commit was substituted');return true;};if(!present())git(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Exact source unavailable after one bounded fetch');}
 function preloadAvailability(refs){
  if(options.defaultRetainedCommitBatch!==true)return;
  assert.equal(typeof git.preloadCommits,'function','Default immutable commit batch reader required');const finite=new Set(refs);for(const ref of finite)assert.match(ref,/^[0-9a-f]{40}$/);const recovered=new Set();
  for(;;){try{git.preloadCommits([...finite]);return;}catch(error){const missing=error?.missingCommit;if(!finite.has(missing)||recovered.has(missing))throw error;recovered.add(missing);requireObject(missing);}}
 }
 preloadAvailability(selected);
 for(const ref of selected)requireObject(ref);
 // Derive only predecessor object IDs from the literal, already-governed A7 metadata.
 // No executable code is evaluated and no current HEAD/candidate nominates predecessors.
 const original=git(['show',capture.baselineRef+':scripts/product-completion-lineage.mjs']).toString(),match=/const bindings=(\[[\s\S]*?\n\]);/.exec(original);assert(match);
 const rows=JSON.parse(match[1]),refs=new Set(rows.flatMap(r=>[r.predecessorRef,r.successorRef,...(r.intermediateSources??[]).map(s=>s.ref),...(r.supplementalSources??[]).map(s=>s.ref)]));assert(rows.length===28&&refs.size<120);
 preloadAvailability(refs);
 for(const ref of refs)requireObject(ref);
 if(git===invoke)ready=true;return true;
 };
 // Wrapped real Git readers share the same shallow metadata as the default reader.
 // Resolve coordination through the actual repository, not an adapter-controlled path.
 const common=resolve(root,invoke(['rev-parse','--git-common-dir']).toString().trim());
 return withSourceObjectLock(common,availability);
}
