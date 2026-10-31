/** Recover a separate working copy; never mutate recorded history or trust imported authority claims. */
import {z} from 'zod';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {captureScenario,type CapturedScenario} from './scenario-set';
import {validateScenarioDisplayMetadata,type ScenarioDisplayMetadata} from './scenario-display-metadata';
import {verifyRegisteredSnapshot} from './registered-snapshot-replay';
const record=z.record(z.string(),z.unknown());
const displayField=z.object({label:z.string().min(1).max(300),unit:z.string().max(120).optional()}).strict();
const display=z.object({schemaVersion:z.literal(1),calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),inputs:z.record(z.string(),displayField),outputs:z.record(z.string(),displayField)}).strict();
const row=z.object({slot:z.enum(['A','B','C']),notes:z.string().max(1200),input:record,output:record,displayMetadata:display.optional(),methodology:z.string().max(20000).optional()}).strict();
const schema=z.object({schemaVersion:z.literal(1),calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),baseline:z.literal('A'),scenarios:z.array(row).min(1).max(3)}).strict();
export const MAX_SCENARIO_RECOVERY_BYTES=8*1024*1024;
export function recoverScenarioSet(raw:unknown,identity:{calculatorSlug:string;calculatorVersion:number}):readonly CapturedScenario[]{
 const value=copyCalculationData({value:raw},{}).input.value,p=schema.parse(value);
 if(p.calculatorSlug!==identity.calculatorSlug||p.calculatorVersion!==identity.calculatorVersion)throw Error('Scenario set belongs to a different calculator or immutable version.');
 if(p.scenarios[0].slot!=='A')throw Error('Baseline A must be first.');
 let rows:readonly CapturedScenario[]=[];const slots=new Set<string>();
 for(const entry of p.scenarios){if(slots.has(entry.slot))throw Error('Duplicate scenario slot');slots.add(entry.slot);
  const snapshot=createCalculationSnapshot({calculatorSlug:p.calculatorSlug,calculatorVersion:p.calculatorVersion,input:entry.input,output:entry.output});verifyRegisteredSnapshot(snapshot);
  let metadata:ScenarioDisplayMetadata|undefined=entry.displayMetadata===undefined?undefined:validateScenarioDisplayMetadata(entry.displayMetadata,snapshot);
  if(snapshot.calculatorSlug==='unit-conversion-calculator'){
   const from=String(snapshot.input.fromUnit),to=String(snapshot.input.toUnit);
   if(metadata?.inputs.value?.unit!==undefined&&metadata.inputs.value.unit!==from||metadata?.outputs.result?.unit!==undefined&&metadata.outputs.result.unit!==to)throw Error('Conversion display units differ from the recorded engine inputs.');
   // A recovered copy can restore explicit unit context absent in an old export; the file remains unchanged.
   metadata={schemaVersion:1,calculatorSlug:snapshot.calculatorSlug,calculatorVersion:snapshot.calculatorVersion,inputs:{...metadata?.inputs,value:{label:metadata?.inputs.value?.label??'Value',unit:from}},outputs:{...metadata?.outputs,result:{label:metadata?.outputs.result?.label??'Converted value',unit:to}}};
  }
  rows=captureScenario(rows,entry.slot,snapshot,entry.notes,metadata,entry.methodology);
 }
 return rows;
}
export function recoverScenarioSetJson(text:string,identity:{calculatorSlug:string;calculatorVersion:number}){if(typeof text!=='string'||new TextEncoder().encode(text).byteLength>MAX_SCENARIO_RECOVERY_BYTES)throw Error('Scenario file exceeds the 8 MiB recovery limit.');return recoverScenarioSet(JSON.parse(text),identity);}
