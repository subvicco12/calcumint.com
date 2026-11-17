import {z} from 'zod';
import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {validateTechnologyCapture} from '@/lib/technology-capture-trust';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
export const TECHNOLOGY_FIVE_SHARING_REVISION='technology-five-sharing-private-1';
export const technologyFiveShareSlugs=Object.freeze(['base64-size-calculator','bandwidth-calculator','download-time-calculator','upload-time-calculator','data-transfer-calculator']);
const snapshotSchema=z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
const shareSchema=z.object({organizationId:z.uuid(),projectId:z.uuid(),clientWorkspaceId:z.uuid().nullable(),requestId:z.uuid(),title:z.string().trim().min(1).max(240),snapshot:snapshotSchema}).strict();
function verified(raw:unknown):CalculationSnapshot{
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(snapshotSchema.parse(clean));
 if(!technologyFiveShareSlugs.includes(snapshot.calculatorSlug))throw Error('This sharing contract supports only the five declared calculators.');
 verifyRegisteredSnapshot(snapshot);
 return snapshot;
}
export function parseTechnologyFiveShare(raw:unknown){
 const clean=shareSchema.parse(copyCalculationData({value:raw},{}).input.value);
 if(JSON.stringify(clean).length>65536)throw Error('Shared snapshot exceeds 64 KiB.');
 const snapshot=verified(clean.snapshot),proof=verifyRegisteredSnapshot(snapshot),entry=getPublication20Definition(snapshot.calculatorSlug);
 if(entry)validatePublication20Result(entry,snapshot.input,snapshot.output);
 else validateTechnologyCapture(proof.engineId,snapshot.input,snapshot.output as {value:number});
 return Object.freeze({...clean,snapshot});
}
export function readTechnologyFiveSharedSnapshot(raw:unknown):CalculationSnapshot{
 const row=z.object({calculator_slug:z.string(),calculator_version:z.literal(1),input_data:z.record(z.string(),z.unknown()),output_data:z.record(z.string(),z.unknown())}).parse(raw);
 return verified({calculatorSlug:row.calculator_slug,calculatorVersion:row.calculator_version,input:row.input_data,output:row.output_data});
}
export function parseTechnologyFiveSnapshotJson(text:string):CalculationSnapshot{
 if(typeof text!=='string'||new TextEncoder().encode(text).length>65536)throw Error('Snapshot JSON exceeds 64 KiB.');
 return verified(JSON.parse(text));
}
