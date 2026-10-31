/** Exact audit receipts per verified runtime. No numerical tolerance or ignored field. */
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';import path from 'node:path';import os from 'node:os';
const names=['canonical-ledger.json','canonical-ledger.csv','canonical-discovery.json','work-queue.json'];
const allowed=new Set(['registeredAudit.210.cases.0.outputSHA256','registeredAudit.210.cases.1.outputSHA256','rows.245.numericalEvidence.0.cases.0.outputSHA256','rows.245.numericalEvidence.0.cases.1.outputSHA256']);
const sha=b=>createHash('sha256').update(b).digest('hex');
export async function prepareCanonicalExpected(directory,runtime,bindings){
 if(bindings.schemaVersion!==1||runtime.platform!=='linux'||runtime.arch!=='x64'||!['v24.19.0','v22.23.4'].includes(runtime.node))throw Error('Unsupported canonical audit runtime: '+JSON.stringify(runtime));
 const profile=bindings.profiles[runtime.node];if(!profile||!Array.isArray(profile.patches))throw Error('Missing exact runtime receipt');
 const buffers=Object.fromEntries(await Promise.all(names.map(async name=>{const b=await readFile(path.join(directory,name));if(sha(b)!==bindings.baseArtifactsSHA256[name])throw Error('Frozen canonical artifact drift: '+name);return [name,b];})));
 const patches=profile.patches;if(patches.length!==(runtime.node==='v24.19.0'?0:4)||new Set(patches.map(p=>p.path.join('.'))).size!==patches.length)throw Error('Wrong runtime receipt cardinality');
 if(!patches.length){if(sha(buffers['canonical-ledger.json'])!==profile.canonicalLedgerOutputSHA256)throw Error('Base receipt hash mismatch');return {directory,close:async()=>{}};}
 const ledger=JSON.parse(buffers['canonical-ledger.json']);
 for(const p of patches){if(!Array.isArray(p.path)||!allowed.has(p.path.join('.'))||!/^[a-f0-9]{64}$/.test(p.expectedBefore)||!/^[a-f0-9]{64}$/.test(p.expectedAfter))throw Error('Unsupported receipt field');let target=ledger;for(const key of p.path.slice(0,-1))target=target[key];const key=p.path.at(-1);if(target[key]!==p.expectedBefore)throw Error('Receipt preimage mismatch');target[key]=p.expectedAfter;}
 const encoded=Buffer.from(JSON.stringify(ledger,null,2)+'\n');if(sha(encoded)!==profile.canonicalLedgerOutputSHA256)throw Error('Exact patched receipt hash mismatch');buffers['canonical-ledger.json']=encoded;
 const temporary=await mkdtemp(path.join(os.tmpdir(),'calcumint-canonical-expected-'));try{await Promise.all(names.map(name=>writeFile(path.join(temporary,name),buffers[name])));}catch(error){await rm(temporary,{recursive:true,force:true});throw error;}
 return {directory:temporary,close:()=>rm(temporary,{recursive:true,force:true})};
}
