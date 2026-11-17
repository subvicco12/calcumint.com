import {technologyFinalTwoCatalog} from '@/lib/native-delivery/technology-final-two-catalog';
import {validateTechnologyFinalTwoCapture} from '@/lib/technology-final-two-analysis';
import {z} from 'zod';
import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {technologyNextFiveCatalog} from '@/lib/native-delivery/technology-next-five-catalog';
import {validateTechnologyNextFiveCapture} from '@/lib/technology-next-five-analysis';
import {technologyNextCatalog} from '@/lib/native-delivery/technology-next-catalog';
import {validateTechnologyNextCapture} from '@/lib/technology-next-capture-trust';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
export const TECHNOLOGY_NEXT_SHARING_REVISION='technology-next-sharing-private-3';
const ids=new Set([374,377,378,379,382,383,384,385,369,375,380,381,387,368,376]);
export const technologyNextShareBindings=Object.freeze([...technologyNextCatalog,...technologyNextFiveCatalog,...technologyFinalTwoCatalog].filter(row=>ids.has(row.catalogId)).map(row=>Object.freeze({catalogId:row.catalogId,engineId:row.engineId,slug:row.slug,version:row.version})));
if(technologyNextShareBindings.length!==15||new Set(technologyNextShareBindings.map(row=>row.slug)).size!==15||technologyNextShareBindings.some(row=>row.version!==(row.catalogId===383?2:1)))throw Error('Exact next sharing tuple source changed; a new contract is required.');
export const technologyNextShareSlugs=Object.freeze(technologyNextShareBindings.map(row=>row.slug));
export function technologyNextSharingCapabilitySupports(capability:unknown,slug?:string){
 if(capability===TECHNOLOGY_NEXT_SHARING_REVISION)return slug===undefined||technologyNextShareSlugs.includes(slug);
 if(capability==='technology-next-sharing-private-2')return slug===undefined||technologyNextShareBindings.some(row=>row.slug===slug&&row.catalogId!==368&&row.catalogId!==376);
 return false;
}
const snapshotSchema=z.object({calculatorSlug:z.string(),calculatorVersion:z.number().int().positive(),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
const shareSchema=z.object({organizationId:z.uuid(),projectId:z.uuid(),clientWorkspaceId:z.uuid().nullable(),requestId:z.uuid(),title:z.string().trim().min(1).max(240),snapshot:snapshotSchema}).strict();
function verified(raw:unknown):CalculationSnapshot{
 const snapshot=createCalculationSnapshot(snapshotSchema.parse(copyCalculationData({value:raw},{}).input.value));
 const binding=technologyNextShareBindings.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!binding)throw Error('Exact next sharing calculator/version unavailable; no fallback or historical upgrade.');
 const proof=verifyRegisteredSnapshot(snapshot);if(proof.engineId!==binding.engineId||proof.engineVersion!==binding.version)throw Error('Exact registered engine binding differs.');
 return snapshot;
}
export function parseTechnologyNextShare(raw:unknown){
 const clean=shareSchema.parse(copyCalculationData({value:raw},{}).input.value);
 if(new TextEncoder().encode(JSON.stringify(clean)).length>65536)throw Error('Shared snapshot exceeds64KiB.');
 const snapshot=verified(clean.snapshot),binding=technologyNextShareBindings.find(row=>row.slug===snapshot.calculatorSlug)!;
 if(technologyFinalTwoCatalog.some(row=>row.engineId===binding.engineId))validateTechnologyFinalTwoCapture(binding.engineId,snapshot.input,snapshot.output as {value:number});
 else if(technologyNextFiveCatalog.some(row=>row.engineId===binding.engineId))validateTechnologyNextFiveCapture(binding.engineId,snapshot.input,snapshot.output as {value:number});
 else validateTechnologyNextCapture(binding.engineId,snapshot.input,snapshot.output as {value:number});
 const publication=getPublication20Definition(snapshot.calculatorSlug);if(publication)validatePublication20Result(publication,snapshot.input,snapshot.output);
 return Object.freeze({...clean,snapshot});
}
export function readTechnologyNextSharedSnapshot(raw:unknown):CalculationSnapshot{
 const row=z.object({calculator_slug:z.string(),calculator_version:z.number().int().positive(),input_data:z.record(z.string(),z.unknown()),output_data:z.record(z.string(),z.unknown())}).parse(raw);
 return verified({calculatorSlug:row.calculator_slug,calculatorVersion:row.calculator_version,input:row.input_data,output:row.output_data});
}
export function parseTechnologyNextSnapshotJson(text:string){if(typeof text!=='string'||new TextEncoder().encode(text).length>65536)throw Error('Snapshot JSON exceeds64KiB.');return verified(JSON.parse(text));}
