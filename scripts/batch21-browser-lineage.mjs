/** Exact, append-only admission of the reviewed Batch21 browser harness successor. */
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {lstatSync,readFileSync} from 'node:fs';
import path from 'node:path';
export const batch21BrowserPath='tests/batch21-calculator-wave/browser.mjs';
const predecessor='6d2960c2fac7817741b08877ebd3b611720923b7';
const frozen='c1c7371ac4f284ff7b6371a90fb3296c632396f9';
const successor='815fa75177ff4348b64502d6745a8fc294c65fed';
const oldBlob='0249ae4743a0ddc7387b99b64f7b7104c47f30c8';
const oldSHA='42ead9e3ca6ccb3491230cde760a462f1bc9292e364a5fab97b363dbdccb836d';
const bindings={
 'browser.mjs':['45b920157091642f5d36afe0c94ff1aa002f9591','f3a0f846466e1ef7cb58ed04724351202e873a0d1c6926e49167364141887b60'],
 'failure-diagnostics.mjs':['ced72a6ba9a5fe88d45285783067d5bba6f1d295','e74969be1d5e048464d6021214d61a39359a54cc65a029790873f0fc100f5221'],
 'journey-readiness.mjs':['66fe732edce61707f75ef5a2eca9ad9da98db2c1','7a90c6fd87a5b294b50723d9923aa395b8e6bf05d21db4b11c88fbb48cd95fcc'],
 'journey-lifecycle.mjs':['471b57cbb914162c325f65cd3ecf1abbb52a1a41','e942f81e4c42890782236c529737897eeb529e3c05e31614325c2311ab4b4d47'],
};
const hash=b=>createHash('sha256').update(b).digest('hex');
function readSafe(root,name){
 if(typeof name!=='string'||name.includes('\\')||name.includes('\0')||path.posix.isAbsolute(name)||name.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe Batch21 path');
 let full=root;
 if(lstatSync(full).isSymbolicLink()||!lstatSync(full).isDirectory())throw Error('Unsafe Batch21 root');
 for(const part of name.split('/')){full=path.join(full,part);if(lstatSync(full).isSymbolicLink())throw Error('Unsafe Batch21 symlink: '+name);}
 if(!lstatSync(full).isFile())throw Error('Unsafe Batch21 file: '+name);
 return readFileSync(full);
}
/** git override exists solely for deterministic negative provenance tests. */
export function verifyBatch21BrowserLineage(root,originalClaim,git=args=>execFileSync('git',args,{cwd:root,maxBuffer:128*1024*1024,stdio:['pipe','pipe','pipe']})){
 if(originalClaim!==oldSHA)throw Error('Batch21 historical claim differs');
 for(const ref of [predecessor,frozen,successor]){
  let resolved;try{resolved=git(['rev-parse','--verify',ref+'^{commit}']).toString().trim();}catch{throw Error('Exact Batch21 commit unavailable: '+ref);}
  if(resolved!==ref)throw Error('Exact Batch21 commit unavailable: '+ref);
 }
 const blob=(ref,name,expected,sha)=>{
  const entries=git(['ls-tree','-z',ref,'--',name]).toString().split('\0').filter(Boolean);
  if(entries.length!==1||entries[0]!==`100644 blob ${expected}\t${name}`)throw Error('Batch21 Git membership/type/blob differs: '+name);
  const bytes=git(['cat-file','blob',expected]);
  if(hash(bytes)!==sha)throw Error('Batch21 Git object SHA differs: '+name);
  return bytes;
 };
 const old=blob(predecessor,batch21BrowserPath,oldBlob,oldSHA);
 if(!blob(frozen,batch21BrowserPath,oldBlob,oldSHA).equals(old))throw Error('Batch21 frozen predecessor differs');
 for(const [base,[object,sha]] of Object.entries(bindings)){
  const name='tests/batch21-calculator-wave/'+base;
  const pinned=blob(successor,name,object,sha),current=readSafe(root,name);
  if(hash(current)!==sha||!current.equals(pinned))throw Error('Batch21 current successor differs: '+name);
 }
 return {predecessorBrowserBytes:old,browserSuccessorRef:successor,browserPredecessorRef:predecessor,browserBindingsVerified:4};
}
