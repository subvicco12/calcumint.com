/** Fixed diagnostic-test successor only; the original generic exact-stage API remains unchanged. */
import {sourceStage10Policy as fixedPolicy} from './source-stage10-current26-policy.mjs';
import {sourceStage10Policy as retained24Policy,sourceStage10CapturePath as retained24CapturePath} from './source-stage10-current-policy.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
const sha=b=>createHash('sha256').update(b).digest('hex');
const oid=/^[0-9a-f]{40}$/;
const paths=b=>b.toString().split('\0').filter(Boolean);
const diagnosticTestPath='src/calculators/catalog-reviewed-standard-evidence.test.ts',apiTestPath='src/lib/five-full-contract-evidence.test.ts',loggingCodeRef='3374da0e4421c30bd34d5b93b9ac71746f6fc699';
export function verifyExactCurrent26(input){
 assert.deepEqual(Object.keys(input).sort(),['captureBytes','git','read','root'],'Only explicit fixed26 source inputs allowed');
 return verifyFixedStage({...input,policy:fixedPolicy});
}
function verifyFixedStage({policy,captureBytes,git,read,root}){
 assert.match(policy.captureSHA256,/^[0-9a-f]{64}$/);assert.equal(sha(captureBytes),policy.captureSHA256,'Independent factory capture digest differs');
 const c=JSON.parse(captureBytes);assert.equal(c.kind,'EXACT_FACTORY_SOURCE_SUCCESSOR');
 for(const key of ['predecessorRef','codeRef']){assert.match(policy[key],oid);assert.equal(c[key],policy[key]);assert.equal(git(['rev-parse','--verify',c[key]+'^{commit}']).toString().trim(),c[key]);}
 assert.notEqual(c.predecessorRef,c.codeRef);assert.deepEqual(c.rows.map(r=>r.path),policy.paths);assert(policy.paths.length>0);assert.equal(new Set(policy.paths).size,policy.paths.length);
 assert.equal(retained24Policy.codeRef,'822743dd987bc2f07e52ab07a3c2ef4ab05f625f');assert.equal(policy.predecessorRef,retained24Policy.predecessorRef);
 assert.deepEqual(policy.paths,[...retained24Policy.paths,diagnosticTestPath,apiTestPath].sort(),'Only the two exact reviewed tests may extend the retained24 source roster');
 assert.deepEqual(c.ancestry,[policy.codeRef,loggingCodeRef,...retained24Policy.ancestry],'Diagnostic and API code must retain their two exact parent edges');
 assert.deepEqual(paths(git(['diff','--name-only','-z',retained24Policy.codeRef,policy.codeRef,'--','src'])),[diagnosticTestPath,apiTestPath],'Only the two exact tests may change after retained24');
 assert.deepEqual(paths(git(['diff','--name-only','-z',retained24Policy.codeRef,loggingCodeRef,'--','src'])),[diagnosticTestPath]);
 assert.deepEqual(paths(git(['diff','--name-only','-z',loggingCodeRef,policy.codeRef,'--','src'])),[apiTestPath]);
 assert((c.retainedStages??[]).some(stage=>stage.capture?.path===retained24CapturePath&&stage.capture?.sha256===retained24Policy.captureSHA256),'Exact original24 capture must remain retained');
 for(const p of policy.paths)assert(/^src\/[A-Za-z0-9_./[\]-]+$/.test(p)&&!p.split('/').some(s=>s==='..'||s==='.'||s==='')&&(!p.startsWith('src/calculators/')||p===diagnosticTestPath),'Exact safe source or the single reviewed diagnostic test required');
 assert(Array.isArray(c.ancestry)&&c.ancestry.length>=2&&c.ancestry.length<=64,'Finite factory ancestry required');assert.equal(c.ancestry[0],c.codeRef);assert.equal(c.ancestry.at(-1),c.predecessorRef);assert.equal(new Set(c.ancestry).size,c.ancestry.length);
 for(let i=0;i<c.ancestry.length;i++){const ref=c.ancestry[i];assert.match(ref,oid);const raw=git(['cat-file','commit',ref]);assert.equal(createHash('sha1').update(Buffer.from(`commit ${raw.length}\0`)).update(raw).digest('hex'),ref,'Commit content address differs');if(i<c.ancestry.length-1){const header=raw.toString().split('\n\n',1)[0];assert(header.split('\n').includes('parent '+c.ancestry[i+1]),'Factory parent chain differs');}}
 assert.deepEqual(paths(git(['diff','--name-only','-z',c.predecessorRef,c.codeRef,'--','src'])),policy.paths,'Factory source delta differs from finite reviewed paths');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,oid);
 // Current source equality is established below; no shallow-sensitive ancestry inference from HEAD.
 assert.equal(git(['diff','--name-only','-z',c.codeRef,head,'--','src']).length,0,'Unreviewed current source delta');
 assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0,'Committed current src required; Dirty or unknown current source');
 const prior=new Set(paths(git(['ls-tree','-rz','--name-only',c.predecessorRef,'--','src']))),result=new Map();
 function record(r,ref,path){assert.equal(r.path,path);assert.equal(r.ref,ref);assert.match(r.blob,oid);assert.equal(git(['rev-parse',ref+':'+path]).toString().trim(),r.blob);const bytes=git(['cat-file','blob',r.blob]);assert.equal(bytes.length,r.bytes);assert.equal(sha(bytes),r.sha256);return bytes;}
 for(const retainedStage of c.retainedStages??(c.retainedStage?[c.retainedStage]:[])){for(const r of Object.values(retainedStage))record(r,r.ref,r.path);const retained=JSON.parse(git(['cat-file','blob',retainedStage.capture.blob]));assert.equal(retained.predecessorRef,c.predecessorRef);assert(c.ancestry.includes(retained.codeRef),'Original factory code must remain in finite ancestry');assert(retained.rows.every(r=>policy.paths.includes(r.path)),'Original finite factory paths remain retained');for(const row of retained.rows){if(prior.has(row.path))record(row.predecessor,c.predecessorRef,row.path);else assert.equal(row.predecessor,null);record(row.current,retained.codeRef,row.path);}}
 for(const row of c.rows){const p=row.path;if(prior.has(p))record(row.predecessor,c.predecessorRef,p);else assert.equal(row.predecessor,null,'Added source has no predecessor');const bytes=record(row.current,c.codeRef,p);assert.equal(git(['rev-parse',head+':'+p]).toString().trim(),row.current.blob);const target=resolve(root,p),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target,'Redirected current source');assert(read(p).equals(bytes),'Current factory bytes differ');result.set(p,{predecessor:row.predecessor,current:row.current});}
 return result;
}
