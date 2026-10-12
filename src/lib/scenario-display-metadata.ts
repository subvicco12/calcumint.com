import {copyCalculationData,type CalculationSnapshot} from './calculation-snapshot';
import type {ResultMetric,StructuredCalculationResult} from '@/calculators/final-framework/types';
export type ScenarioFieldDisplay=Readonly<{label:string;unit?:string}>;
export type ScenarioDisplayMetadata=Readonly<{schemaVersion:1;calculatorSlug:string;calculatorVersion:number;inputs:Readonly<Record<string,ScenarioFieldDisplay>>;outputs:Readonly<Record<string,ScenarioFieldDisplay>>}>;
type Identity=Pick<CalculationSnapshot,'calculatorSlug'|'calculatorVersion'>|{slug:string;version:number};
/** Only explicit key/metric bindings and the caller's existing UI labels supply display context. */
export function scenarioMetadataForResult(identity:Identity,input:Record<string,unknown>,output:Record<string,unknown>,result:Pick<StructuredCalculationResult,'primaryResult'|'metrics'>,bindings:{inputs:Readonly<Record<string,string>>;outputs:Readonly<Record<string,string>>;inputMetrics?:Readonly<Record<string,string>>}):ScenarioDisplayMetadata{
 const metrics=[result.primaryResult,...result.metrics??[]];
 const display=(metric:ResultMetric):ScenarioFieldDisplay=>({label:metric.label,...(metric.unit!==undefined?{unit:metric.unit}:{})});
 const inputs=Object.fromEntries(Object.entries(bindings.inputs).filter(([key])=>Object.hasOwn(input,key)).map(([key,label])=>{const metric=metrics.find(row=>row.id===bindings.inputMetrics?.[key]);return [key,{label,...(metric?.unit!==undefined?{unit:metric.unit}:{})}];}));
 const outputs=Object.fromEntries(Object.entries(bindings.outputs).flatMap(([key,id])=>{const metric=metrics.find(row=>row.id===id);return Object.hasOwn(output,key)&&metric?[[key,display(metric)]]:[];}));
 return {schemaVersion:1,calculatorSlug:'slug' in identity?identity.slug:identity.calculatorSlug,calculatorVersion:'version' in identity?identity.version:identity.calculatorVersion,inputs,outputs};
}
export function validateScenarioDisplayMetadata(value:unknown,snapshot:CalculationSnapshot):ScenarioDisplayMetadata{
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid scenario display metadata');
 const metadata=copyCalculationData({},value as Record<string,unknown>).output;
 if(metadata.schemaVersion!==1||metadata.calculatorSlug!==snapshot.calculatorSlug||metadata.calculatorVersion!==snapshot.calculatorVersion)throw new Error('Scenario display identity mismatch');
 for(const [group,field] of [['inputs','input'],['outputs','output']] as const){
  const mapping=metadata[group];if(!mapping||typeof mapping!=='object'||Array.isArray(mapping))throw new Error('Invalid scenario display fields');
  for(const [key,entry] of Object.entries(mapping)){if(!Object.hasOwn(snapshot[field],key)||!entry||typeof entry!=='object'||Array.isArray(entry))throw new Error('Scenario display field mismatch');const row=entry as Record<string,unknown>;if(typeof row.label!=='string'||!row.label.trim()||(row.unit!==undefined&&typeof row.unit!=='string'))throw new Error('Invalid scenario display label or unit');}
 }
 return metadata as unknown as ScenarioDisplayMetadata;
}
