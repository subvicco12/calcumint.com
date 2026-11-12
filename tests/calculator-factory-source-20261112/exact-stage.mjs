/** Additive proof primitive. Policy MUST come from independently pinned authority, never HEAD. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
const sha=b=>createHash('sha256').update(b).digest('hex');
const oid=/^[0-9a-f]{40}$/;
const paths=b=>b.toString().split('\0').filter(Boolean);
export function verifyExactStage({policy,captureBytes,git,read,root}){
 assert.match(policy.captureSHA256,/^[0-9a-f]{64}$/);assert.equal(sha(captureBytes),policy.captureSHA256,'Independent factory capture digest differs');
 const c=JSON.parse(captureBytes);assert.equal(c.kind,'EXACT_FACTORY_SOURCE_SUCCESSOR');
 for(const key of ['predecessorRef','codeRef']){assert.match(policy[key],oid);assert.equal(c[key],policy[key]);assert.equal(git(['rev-parse','--verify',c[key]+'^{commit}']).toString().trim(),c[key]);}
 assert.notEqual(c.predecessorRef,c.codeRef);assert.deepEqual(c.rows.map(r=>r.path),policy.paths);assert(policy.paths.length>0);assert.equal(new Set(policy.paths).size,policy.paths.length);
 for(const p of policy.paths)assert(/^src\/[A-Za-z0-9_./[\]-]+$/.test(p)&&!p.split('/').some(s=>s==='..'||s==='.'||s==='')&&!p.startsWith('src/calculators/'),'Exact safe non-mathematical source path required');
 assert.equal(git(['merge-base','--is-ancestor',c.predecessorRef,c.codeRef]).length,0,'Factory predecessor must be ancestor');
 assert.deepEqual(paths(git(['diff','--name-only','-z',c.predecessorRef,c.codeRef,'--','src'])),policy.paths,'Factory source delta differs from finite reviewed paths');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,oid);
 assert.equal(git(['merge-base','--is-ancestor',c.codeRef,head]).length,0,'Current HEAD must descend from frozen factory code');
 assert.equal(git(['diff','--name-only','-z',c.codeRef,head,'--','src']).length,0,'Unreviewed current source delta');
 assert.equal(git(['status','--porcelain','--untracked-files=all','--','src']).length,0,'Dirty or unknown current source');
 const prior=new Set(paths(git(['ls-tree','-rz','--name-only',c.predecessorRef,'--','src']))),result=new Map();
 function record(r,ref,path){assert.equal(r.path,path);assert.equal(r.ref,ref);assert.match(r.blob,oid);assert.equal(git(['rev-parse',ref+':'+path]).toString().trim(),r.blob);const bytes=git(['cat-file','blob',r.blob]);assert.equal(bytes.length,r.bytes);assert.equal(sha(bytes),r.sha256);return bytes;}
 for(const row of c.rows){const p=row.path;if(prior.has(p))record(row.predecessor,c.predecessorRef,p);else assert.equal(row.predecessor,null,'Added source has no predecessor');const bytes=record(row.current,c.codeRef,p);assert.equal(git(['rev-parse',head+':'+p]).toString().trim(),row.current.blob);const target=resolve(root,p),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target,'Redirected current source');assert(read(p).equals(bytes),'Current factory bytes differ');result.set(p,{predecessor:row.predecessor,current:row.current});}
 return result;
}
