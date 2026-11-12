/** Object availability only. The caller must first verify the independently pinned capture. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {factoryPolicy} from '../calculator-factory-source-20261112/policy.mjs';
import {withSourceObjectLock} from './source-object-lock.mjs';
import {completionPolicy} from '../completion-first-20261112/policy.mjs';
import {workflowPolicy} from '../completion-first-20261112/workflows-policy.mjs';
import {nonSourcePolicy} from '../completion-first-20261112/non-source-policy.mjs';
import {personalPolicy} from '../completion-first-20261112/personal-policy.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const allowed=new Set(['https://github.com/subvicco12/calcumint.com','https://github.com/subvicco12/calcumint.com.git']);
const invoke=args=>execFileSync('git',['-c','protocol.file.allow=never','-c','protocol.ext.allow=never',...args],{cwd:root,env:{...process.env,GIT_TERMINAL_PROMPT:'0'},stdio:['ignore','pipe','pipe'],timeout:60000,maxBuffer:4*1024*1024});
let ready=false;
export function ensureParallelSources(capture,git=invoke){
 assert.equal(capture.baselineRef,'a7bab5b5534d51cea25ba5ffe4aa9b3630176909');assert.equal(capture.appRef,'f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5');assert.match(capture.codeRef,/^[0-9a-f]{40}$/);
 assert.equal(capture.guardSources.length,4);assert.equal(new Set(capture.guardSources.map(r=>r.ref)).size,1);
 for(const row of capture.guardSources)assert.match(row.ref,/^[0-9a-f]{40}$/);
 const selected=new Set(['a5cfb96af4564d90c6367ba0ee1f7c773e0f201b','61bcbae72341a2f4979d9a1abee2cdf154554a19','9e82c27f1c9c3c0edb92f209bcbd987cd5d9d7a8','64fbafa674bc3a41017abe60ce95e50e42fbbaa4','a4b3a560af11dedc65dd6f7a97c5c6829c91de59','f4fa576cb070a31a3408f46c267c13b1e7b1f4eb',...factoryPolicy.ancestry,...completionPolicy.ancestry,completionPolicy.auxiliaryRef,...personalPolicy.ancestry,...personalPolicy.auxiliaryAncestry,...workflowPolicy.ancestry,...workflowPolicy.guardAncestry,...nonSourcePolicy.ancestry,'0b0e9c25c888463d2bbe5937eb1059cf10cdf7b8',capture.baselineRef,capture.appRef,capture.codeRef,'f68c077b63b1dfabbe9ca3f21e4f195ef645ad97','cef0352fca135b252b981b959c3529170b1f0c81','25b56970c05aaffaad2dd856809aaf077ab70554','71f285544bd85b46e51da109897c12bfff7b798f','a1014a3914977af8a8d9e85aa2bf08269fccf504','881c62c140d881b8c7fe70ce9bd5dcc187b54c32','02d1a7eac0d7853197a4410520f548f0ce8b335f','224b9f6684d7e27a923c69d140ddc0104f1e58e7','05129e2a74e70e23160578c63a984c4bf035ed0f','b2f12b04b6ded9e84bb07d4d6c170ac157f8cad3','756922bebd73e66a2900a35a92a3854ad2813d73','a963ef7aaa04664d07709cc431d6214511bc0573','d7eb23e22d2357af838b6d4ba983971090ed8713',...capture.guardSources.map(r=>r.ref)]);
 for(const row of [...capture.currentSources,...capture.applicationSources])assert(selected.has(row.ref),'Unreviewed source revision outside approved exact source and finite test-successor revisions');
 const availability=()=>{
 if(git===invoke&&ready)return true;
 const urls=git(['remote','get-url','--all','origin']).toString().trim().split('\n');assert(urls.length===1&&allowed.has(urls[0]),'Exact HTTPS CalcuMint repository origin required');
 function requireObject(ref){assert.match(ref,/^[0-9a-f]{40}$/);const present=()=>{let found;try{found=git(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{return false;}assert.equal(found,ref,'Source commit was substituted');return true;};if(!present())git(['fetch','--no-tags','--depth=1','origin',ref]);assert(present(),'Exact source unavailable after one bounded fetch');}
 for(const ref of selected)requireObject(ref);
 // Derive only predecessor object IDs from the literal, already-governed A7 metadata.
 // No executable code is evaluated and no current HEAD/candidate nominates predecessors.
 const original=git(['show',capture.baselineRef+':scripts/product-completion-lineage.mjs']).toString(),match=/const bindings=(\[[\s\S]*?\n\]);/.exec(original);assert(match);
 const rows=JSON.parse(match[1]),refs=new Set(rows.flatMap(r=>[r.predecessorRef,r.successorRef,...(r.intermediateSources??[]).map(s=>s.ref),...(r.supplementalSources??[]).map(s=>s.ref)]));assert(rows.length===28&&refs.size<120);
 for(const ref of refs)requireObject(ref);
 if(git===invoke)ready=true;return true;
 };
 // Wrapped real Git readers share the same shallow metadata as the default reader.
 // Resolve coordination through the actual repository, not an adapter-controlled path.
 const common=resolve(root,invoke(['rev-parse','--git-common-dir']).toString().trim());
 return withSourceObjectLock(common,availability);
}
