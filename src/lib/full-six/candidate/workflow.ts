import {z} from 'zod';
import {copyCalculationData} from '@/lib/calculation-snapshot';
import {boundedData} from '../statistics/worker-protocol';
import {calculateFullSlope,fullSlopeInputSchema,solveFullSlope,fullSlopeInverseSchema} from '../slope';
import {calculateFullVolume,fullVolumeInputSchema} from '../volume';
import {calculateFullGraph,fullGraphInputSchema} from '../graph-full';
import {calculateAdvancedStatistics,advancedStatisticsInputSchema} from '../statistics/advanced';
import {candidateBindings,candidateRevision,type CandidateCatalogId} from './bindings';
export type {CandidateCatalogId} from './bindings';
export const candidateIds=[235,251,275,276,282,283] as const;
const object=z.record(z.string(),z.unknown());
const schema=z.object({protocol:z.literal('six-candidate-private-1'),scope:z.literal('PRIVATE_EXPERIMENTAL'),catalogId:z.union([z.literal(235),z.literal(251),z.literal(275),z.literal(276),z.literal(282),z.literal(283)]),engineId:z.string(),baselineVersion:z.number().int(),contractSHA256:z.string().regex(/^[a-f0-9]{64}$/),implementationRevision:z.literal(candidateRevision),input:object,output:object}).strict();
export type CandidateArtifact=z.infer<typeof schema>;
export type CandidateSnapshot=Readonly<{protocol:'six-candidate-snapshot-1';artifact:CandidateArtifact;sha256:string}>;
function copied(value:unknown):unknown{return copyCalculationData({value},{}).input.value;}
function canonical(value:unknown):string{
 if(value===null||typeof value!=='object')return JSON.stringify(value);
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 return '{'+Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
}
export function validateCandidateArtifact(value:unknown):CandidateArtifact{
 const a=schema.parse(copied(value)),binding=candidateBindings[a.catalogId];
 for(const key of ['engineId','baselineVersion','contractSHA256'] as const)if(a[key]!==binding[key])throw Error('Candidate identity/contract mismatch');
 if(JSON.stringify(a).length>2_000_000)throw Error('Artifact exceeds snapshot budget');
 return copied(a) as CandidateArtifact;
}
export function calculateCandidate(catalogId:CandidateCatalogId,raw:unknown):CandidateArtifact{
 if(!candidateIds.includes(catalogId))throw Error('Unknown candidate identity');
 const input=copied(boundedData(raw)) as Record<string,unknown>;
 let output:unknown;
 if(catalogId===276){if(input.operation==='inverse'){const request=z.object({operation:z.literal('inverse'),request:z.unknown()}).strict().parse(input);fullSlopeInverseSchema.parse(request.request);const solved=solveFullSlope(request.request);output={...solved,status:solved.status==='unique'?'finite':solved.status,solverStatus:solved.status};}else{fullSlopeInputSchema.parse(input);output=calculateFullSlope(input);}}
 else if(catalogId===275){fullVolumeInputSchema.parse(input);output=calculateFullVolume(input);}
 else if(catalogId===235||catalogId===251){fullGraphInputSchema.parse(input);if(input.catalogId!==catalogId)throw Error('Graph identity mismatch');output=calculateFullGraph(input);}
 else{advancedStatisticsInputSchema.parse(input);output=calculateAdvancedStatistics(input);}
 return validateCandidateArtifact({protocol:'six-candidate-private-1',scope:'PRIVATE_EXPERIMENTAL',catalogId,...candidateBindings[catalogId],implementationRevision:candidateRevision,input,output});
}
async function digest(value:unknown){const bytes=new TextEncoder().encode(canonical(value));return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
export async function createCandidateSnapshot(value:unknown):Promise<CandidateSnapshot>{
 const artifact=validateCandidateArtifact(value);
 if(!['finite','vertical-line'].includes(String(artifact.output.status)))throw Error('Only successful calculations may be captured or exported');
 const snapshot=Object.freeze({protocol:'six-candidate-snapshot-1' as const,artifact,sha256:await digest(artifact)});
 if(new TextEncoder().encode(JSON.stringify(snapshot)).byteLength>2_000_000)throw Error('Complete snapshot exceeds 2 MB byte budget');
 return snapshot;
}
export async function readCandidateSnapshot(text:string,id:CandidateCatalogId):Promise<CandidateSnapshot>{
 if(text.length>2_000_000||new TextEncoder().encode(text).byteLength>2_000_000)throw Error('Snapshot exceeds size budget');
 const raw=copied(JSON.parse(text)) as Record<string,unknown>;
 if(!raw||Object.keys(raw).sort().join(',')!=='artifact,protocol,sha256'||raw.protocol!=='six-candidate-snapshot-1')throw Error('Unknown snapshot protocol');
 const snapshot=await createCandidateSnapshot(raw.artifact);
 if(snapshot.artifact.catalogId!==id)throw Error('Snapshot identity mismatch');
 if(raw.sha256!==snapshot.sha256)throw Error('Snapshot digest mismatch');
 return snapshot;
}
export async function replayCandidateSnapshot(text:string,id:CandidateCatalogId):Promise<CandidateSnapshot>{
 const original=await readCandidateSnapshot(text,id);
 const current=await createCandidateSnapshot(calculateCandidate(id,original.artifact.input));
 if(current.sha256!==original.sha256)throw Error('Exact-revision recomputation mismatch');
 return original;
}
