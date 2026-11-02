import {immutableFullSixArtifact,type FullSixArtifact} from '@/lib/full-six/result-contract';
import {copyCalculationData} from './calculation-snapshot';

export type FullSixSnapshot=Readonly<{schemaVersion:1;artifact:FullSixArtifact;sha256:string}>;
export type FullSixBinding=Pick<FullSixArtifact,'catalogId'|'engineId'|'baselineVersion'|'implementationRevision'|'contractSHA256'>;
function canonical(value:unknown):string{
 if(value===null||typeof value!=='object')return JSON.stringify(value);
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 return '{'+Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
}
async function digest(artifact:FullSixArtifact){
 const bytes=new TextEncoder().encode(canonical(artifact));
 return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
}
export async function createFullSixSnapshot(value:unknown):Promise<FullSixSnapshot>{
 const artifact=immutableFullSixArtifact(value);
 const snapshot=Object.freeze({schemaVersion:1,artifact,sha256:await digest(artifact)});
 if(serializeFullSixSnapshot(snapshot).length>2_000_000)throw Error('Snapshot size bound');
 return snapshot;
}
export function serializeFullSixSnapshot(snapshot:FullSixSnapshot):string{return JSON.stringify(snapshot,null,2);}
/** Digest is integrity evidence, never a signature, approval or proof of a legitimate computation. */
export async function readFullSixSnapshot(text:string,expected:FullSixBinding):Promise<FullSixSnapshot>{
 if(text.length>2_000_000)throw Error('Snapshot size bound');
 const raw:unknown=JSON.parse(text);
 const safe=copyCalculationData({value:raw},{}).input.value;
 if(!safe||typeof safe!=='object'||Array.isArray(safe))throw Error('Snapshot object required');
 const record=safe as Record<string,unknown>;
 if(Object.keys(record).sort().join(',')!=='artifact,schemaVersion,sha256'||record.schemaVersion!==1)throw Error('Unknown snapshot schema');
 const snapshot=await createFullSixSnapshot(record.artifact);
 if(record.sha256!==snapshot.sha256)throw Error('Snapshot digest mismatch');
 for(const key of ['catalogId','engineId','baselineVersion','implementationRevision','contractSHA256'] as const){
  if(snapshot.artifact[key]!==expected[key])throw Error('Unknown or mismatched exact implementation binding');
 }
 return snapshot;
}
/** Explicit recomputation is separate from read-only historical replay; never resolves latest. */
export async function verifyFullSixRecomputation(snapshot:FullSixSnapshot,expected:FullSixBinding,recompute:(artifact:FullSixArtifact)=>unknown|Promise<unknown>):Promise<void>{
 const recorded=await readFullSixSnapshot(serializeFullSixSnapshot(snapshot),expected);
 const actual=await createFullSixSnapshot(await recompute(recorded.artifact));
 if(actual.sha256!==recorded.sha256)throw Error('Recomputation differs from recorded artifact');
}
