/** Reproduce the immutable1497 ledger from its exact Git tree, independent of new application revisions. */
import {execFileSync} from 'node:child_process';import {mkdtemp,symlink,rm,readFile} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
export async function assertFrozenCurrentFiles(repository,root,tracked){for(const file of tracked){const [historical,current]=await Promise.all([readFile(path.join(root,file)),readFile(path.join(repository,file))]);if(!historical.equals(current))throw Error('Immutable legacy implementation/dependency changed: '+file);}}
export async function frozenCanonicalSource(repository,sha){
 if(sha!=='7eff39b23a52953c028852d50d5571211a3f8a44')throw Error('Unknown frozen canonical revision');
 const resolved=execFileSync('git',['rev-parse',sha+'^{commit}'],{cwd:repository,encoding:'utf8'}).trim();if(resolved!==sha)throw Error('Frozen source identity mismatch');
 const root=await mkdtemp(path.join(os.tmpdir(),'calcumint-canonical-frozen-'));
 try{const archive=execFileSync('git',['archive','--format=tar',sha],{cwd:repository,maxBuffer:128*1024*1024});execFileSync('tar',['-xf','-','-C',root],{input:archive,maxBuffer:1024*1024});const tracked=execFileSync('git',['ls-tree','-r','--name-only',sha],{cwd:repository,encoding:'utf8'}).trim().split('\n').filter(p=>p.startsWith('src/calculators/')&&!p.includes('.test.')||p==='package-lock.json');await assertFrozenCurrentFiles(repository,root,tracked);
 await symlink(path.join(repository,'node_modules'),path.join(root,'node_modules'),'dir');return {root,close:()=>rm(root,{recursive:true,force:true})};}catch(error){await rm(root,{recursive:true,force:true});throw error;}
}
