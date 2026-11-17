import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export const compositionSourceEvidenceClaims=Object.freeze([
  {
    "path": "src/app/api/business/native-embeds/route.ts",
    "sha256": "311a3ef8b63c62dab1f0b8221d238fccf8727535236666d3472e1e5f9c03cf81"
  },
  {
    "path": "src/app/api/business/technology-embeds/route.ts",
    "sha256": "44bacb14cb8c86c6ce7b207b7cdda570527c1f9663b78e90be2513db0163fe25"
  },
  {
    "path": "src/app/api/internal/technology-webhooks/process/route.ts",
    "sha256": "1846fbe6ee282ce58f3d3e1ec85180f19f1f2ee2b4deace26ee2fabfa1e14e4f"
  },
  {
    "path": "src/app/api/native-embed/[grant]/calculate/route.ts",
    "sha256": "f980cff31f2d5a3755b60f800a119a5983c505534bad85c286a11a2e1441a57f"
  },
  {
    "path": "src/app/business/projects/[id]/page.test.tsx",
    "sha256": "f0635df7a7fa341835e14aae0022f03f4396a9a14233fa2c60f1a7b09f32e6ef"
  },
  {
    "path": "src/app/business/projects/[id]/page.tsx",
    "sha256": "91b2546a1469aa40bec4a042f21aa4560ca2c1bc0bef1a30d6013d3ddc970b2e"
  },
  {
    "path": "src/app/business/shared/[id]/page.test.tsx",
    "sha256": "28b0bbb1530e616a34c7aa1c281401d4e29e4bc4718679acaa47f0fcb33a6c16"
  },
  {
    "path": "src/app/business/shared/[id]/page.tsx",
    "sha256": "e020d51eed26293dc846a5049a82b45489d178c8fb772a41b5b733bba04e29b3"
  },
  {
    "path": "src/app/embed/native/[grant]/page.tsx",
    "sha256": "f94b3085c978897f6f71ffc77d8609d74046b4d2b5f1baec7cffc7eebee08b0d"
  },
  {
    "path": "src/components/calculator-interactive.tsx",
    "sha256": "c6296c137d66ab2a731f9144ab58efb3cb2f25dce2f7f31223b0b9a508d93755"
  },
  {
    "path": "src/components/native-embed-grant-form.tsx",
    "sha256": "d9bd714530c6fa17c69095f59f540866be6fd558668fc6c2b0902c1b15226de5"
  },
  {
    "path": "src/components/native-frequency-embed.tsx",
    "sha256": "8bfcf8d1cb96129779bb8ac7083afaa3b4f9f7898f873a1e29502dda0fe09bfa"
  },
  {
    "path": "src/components/saved-calculation-actions.tsx",
    "sha256": "eb10109b0dfc8a73b0ed4043d35da898cd11a3eace9e711755d8de5179928529"
  },
  {
    "path": "src/components/technology-five-embed.tsx",
    "sha256": "22b14b98203501372e3ef5b9b53977c2c4afc57cf8367e22b8d47d23dfe59e98"
  },
  {
    "path": "src/components/technology-five-share-form.tsx",
    "sha256": "7ed40e28d9dbbba689e9fd71c5b935dffad49fc490f2249f8daf0a9c9cd3404d"
  },
  {
    "path": "src/lib/business/technology-next-sharing-server.ts",
    "sha256": "f31775fd30611577a9e2714c385b1277c1ab479f3cb5e53476c322bcb7bd8b40"
  },
  {
    "path": "src/lib/business/technology-next-sharing.ts",
    "sha256": "55fb98218fd867a88344fcaee43f546f010515f18114ac14e6d5f0c4d938545f"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "sha256": "1efda4fdcfeb758603e9d2c546a243c3f2684a421d4c071a77624c98677c3313"
  },
  {
    "path": "src/lib/native-delivery/contract.test.ts",
    "sha256": "f8b22dfdf220ab7db02f7820009050a9726ed2609668a64e504dd3cb6df7b627"
  },
  {
    "path": "src/lib/native-delivery/contract.ts",
    "sha256": "5631913ed6c15382962f6d60a8b38b301987bdf51439cead21b48ff98bacdebb"
  },
  {
    "path": "src/lib/native-delivery/embed-request.ts",
    "sha256": "f5db6b32438022baaeacae9a500f38e1483f65bc2a0caed683b46cd88be2a2f7"
  },
  {
    "path": "src/lib/native-delivery/grant.ts",
    "sha256": "620eeafcdbe6bf528fd2ea1d6b28fd1b933922d798248846fd5dc78e385c0dba"
  },
  {
    "path": "src/lib/native-delivery/metering.ts",
    "sha256": "12291c2cb45bbd9d795abf643875b97218f72d2551d6e8c3e12f0fa05d8da29e"
  },
  {
    "path": "src/lib/native-delivery/publication.ts",
    "sha256": "a6cff7abd772c51999d6a32116d6b592f55338d1b4fdd4c30e0f9187b15bcfd8"
  },
  {
    "path": "src/lib/native-delivery/technology-five-catalog.ts",
    "sha256": "9c043fbdb5cca8dbd3bc79ebc2356225551719b03e4dd495321ca7019d4a460d"
  },
  {
    "path": "src/lib/native-delivery/technology-five-contract.ts",
    "sha256": "1df758ea71a6f86e4db51290e959ee305c8a426b497ba87ad97f7230f72c25cf"
  },
  {
    "path": "src/lib/native-delivery/technology-five-job-storage.ts",
    "sha256": "32ae836e0ab3dfa6e3ce7bc82107e05bc89a031fe1c04f7e371b9f0ef11c32f0"
  },
  {
    "path": "src/lib/native-delivery/technology-five-webhook-worker.ts",
    "sha256": "9ea8e2235cce7924a58fffee2eaa8c5e71f4c0090fb80f3ced4ec734d15ecea1"
  },
  {
    "path": "src/lib/native-delivery/technology-native-schema.ts",
    "sha256": "e1a7d88868b956857b9b66a5ed5a37066716ce42fd5f61d170a4e665853d008d"
  },
  {
    "path": "src/lib/native-delivery/technology-next-composition.test.ts",
    "sha256": "b34138e4006fb27130ea80a2f54fe7688f9edd3fdee41fffcf4f9f1a6cc66625"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "sha256": "24bf6f31ef7283d9fc319598268c1047ff1c58cd95bda787d55b396e9e3bde4c"
  }
].map(row=>Object.freeze(row)));
const originalRef='f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5';
let active=null;
export function assertCompositionPhysicalSource(file){const absolute=resolve(file),stat=lstatSync(absolute);assert(stat.isFile()&&!stat.isSymbolicLink(),'Composition source must be a regular file');assert.equal(realpathSync(absolute),absolute,'Composition source physical path differs');}
/** Pure lifecycle implementation; only the core entry binds the actual source prover. */
export function runCompositionSourceEvidenceBatch({prove,git,read,physical=assertCompositionPhysicalSource,claims=compositionSourceEvidenceClaims},run,suppliedArity=1){
 if(active){const error=Error('Nested composition source batches forbidden');active.poison??=error;throw error;}
 assert.equal(suppliedArity,1,'Only the synchronous composition callback is accepted');assert.equal(typeof run,'function');const state={poison:null,open:true},seen=new Set();active=state;
 const deny=error=>{state.poison??=error;throw error;};
 const rawState=()=>{const head=git(['rev-parse','--verify','HEAD^{commit}']),status=git(['status','--porcelain=v1','--untracked-files=all']);assert(Buffer.isBuffer(head)&&Buffer.isBuffer(status),'Binary raw source state required');assert.match(head.toString().trim(),/^[a-f0-9]{40}$/);return{head:Buffer.from(head),status:Buffer.from(status)};};
 const checkState=before=>{const after=rawState();assert(after.head.equals(before.head),'Composition actual HEAD changed');assert(after.status.equals(before.status),'Composition actual status changed');};
 const cloneRows=rows=>{assert(rows instanceof Map,'Full named current context required');return new Map([...rows].map(([file,row])=>[file,JSON.parse(JSON.stringify(row))]));};
 let before,rows;
 try{
  before=rawState();rows=cloneRows(prove());checkState(before);const declared=new Map(claims.map(row=>[row.path,row.sha256]));assert.equal(declared.size,claims.length,'Unique composition declaration required');
  const verify=function(file,claim,loaded){if(!state.open)return deny(Error('Composition reader expired'));if(state.poison)throw state.poison;try{assert.equal(arguments.length,3,'Only exact composition operands accepted');assert(declared.has(file),'Unknown composition source path');assert(!seen.has(file),'Duplicate composition source path');assert.equal(claim,declared.get(file),'Exact original composition source claim required');assert(Buffer.isBuffer(loaded),'Loaded composition bytes required');const supplied=Buffer.from(loaded),row=rows.get(file);assert(row?.current,'Explicit admitted composition row required');
   const head=git(['rev-parse','--verify','HEAD^{commit}']);assert(Buffer.isBuffer(head)&&head.equals(before.head),'Composition actual HEAD changed');try{
    physical(file);const current=read(file);assert(Buffer.isBuffer(current)&&current.equals(supplied),'Fresh current composition source differs');assert.equal(hash(current),row.current.sha256);assert.equal(current.length,row.current.bytes);assert.equal(row.current.path,file);assert.match(row.current.ref,/^[a-f0-9]{40}$/);assert.match(row.current.blob,/^[a-f0-9]{40}$/);
    assert.equal(git(['rev-parse','--verify',originalRef+'^{commit}']).toString().trim(),originalRef);const oldBlob=git(['rev-parse',originalRef+':'+file]).toString().trim();assert.match(oldBlob,/^[a-f0-9]{40}$/);const old=git(['cat-file','blob',oldBlob]);assert(Buffer.isBuffer(old));assert.equal(hash(old),claim,'Original F042 source bytes differ');
    assert.equal(git(['rev-parse','--verify',row.current.ref+'^{commit}']).toString().trim(),row.current.ref);assert.equal(git(['rev-parse',row.current.ref+':'+file]).toString().trim(),row.current.blob);assert.equal(git(['rev-parse','HEAD:'+file]).toString().trim(),row.current.blob);const immutable=git(['cat-file','blob',row.current.blob]);assert(Buffer.isBuffer(immutable)&&immutable.equals(current),'Immutable current composition bytes differ');seen.add(file);
   }finally{const after=git(['rev-parse','--verify','HEAD^{commit}']);assert(Buffer.isBuffer(after)&&after.equals(before.head),'Composition actual HEAD changed');}
  }catch(error){return deny(error);}};
  const result=run(verify);assert.equal(result,undefined,'Composition callback must be synchronous and return undefined');if(state.poison)throw state.poison;assert.equal(seen.size,claims.length,'Exact composition coverage required');
 }catch(error){state.poison??=error;throw error;}finally{
  state.open=false;try{if(before){const closing=cloneRows(prove());if(rows)assert.deepEqual(closing,rows,'Composition closing current context differs');checkState(before);}}catch(error){state.poison??=error;}finally{active=null;}if(state.poison)throw state.poison;
 }
}

/** Bounded asynchronous transport only; no source proof spans these awaits. */
export async function loadCompositionBindingBytes(paths,read){
 const entries=new Array(paths.length);let next=0,failed=false,firstError;
 await Promise.allSettled(Array.from({length:Math.min(16,paths.length)},async()=>{while(!failed&&next<paths.length){const index=next++,file=paths[index];try{const bytes=await read(file);assert(Buffer.isBuffer(bytes),'Composition binding transport must return bytes');entries[index]=[file,Buffer.from(bytes)];}catch(error){if(!failed){failed=true;firstError=error;}throw error;}}}));
 if(failed)throw firstError;return new Map(entries);
}
