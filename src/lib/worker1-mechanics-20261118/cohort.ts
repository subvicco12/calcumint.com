import {physicsBatch1Definitions} from '@/calculators/physics/catalog-batch-1';
import {momentumCalculator} from '@/calculators/physics/catalog-batch-2';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,number>,{value:number;steps:readonly string[]}>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
const distance=field('distance','Distance','m'),time=field('time','Elapsed time','s'),speed=field('speed','Speed','m/s'),mass=field('mass','Mass','kg');
const velocity=field('velocity','Velocity','m/s'),acceleration=field('acceleration','Acceleration','m/s²'),work=field('work','Work','J');
const specs=[
 ['m/s',[distance,time]],['m/s',[field('displacement','Signed displacement','m'),time]],
 ['m/s²',[field('initialVelocity','Initial velocity','m/s'),field('finalVelocity','Final velocity','m/s'),time]],
 ['m',[speed,time]],['N',[mass,acceleration]],['J',[field('force','Force magnitude','N'),distance,field('angleDegrees','Angle between force and displacement','°')]],
 ['W',[work,time]],['J',[mass,field('velocity','Speed magnitude','m/s')]],['J',[mass,field('gravity','Supplied gravity','m/s²'),field('height','Signed height relative to datum','m')]],
 ['kg·m/s',[mass,velocity]],
] as const;
const rows=[...physicsBatch1Definitions,momentumCalculator].map((engine,index)=>[302+index,engine,...specs[index]] as const);
export const mechanicsCaptureRevision='worker1-mechanics-20261118.1';
export const mechanicsContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations:'Uses supplied SI quantities and the displayed scalar or one-dimensional model. Canonical applicability and competent review remain pending.'});
}));
export function mechanicsContract(id:number){const row=mechanicsContracts.find(x=>x.catalogId===id);if(!row)throw Error('Mechanics profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact mechanics input fields required');
}
export function mechanicsWorkflows(id:number){
 const c=mechanicsContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${mechanicsCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{if(raw[f.key].trim().length>128)throw Error('Decimal input exceeds capture length');const value=requiredCalculatorNumber(raw[f.key]);if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<1e-90))throw Error('Enter finite decimal quantities with nonzero magnitude at least 1e-90');return [f.key,value];}));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  if(id===307&&parsed.angleDegrees===90&&output.value!==0)throw Error('Perpendicular force does exactly zero work; this v1 residual cannot be saved as a new capture');
  if(!Number.isFinite(output.value)||(output.value!==0&&Math.abs(output.value)<2**-1022))throw Error('Result outside finite normal capture range');
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
 return Object.freeze({...flow,exportPacket:(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  const original=flow.exportPacket(packet,format,plan); // retained entitlement and exact packet checks
  if(format==='json')return original;
  const checked=flow.verify(packet);
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input,inputUnits:Object.fromEntries(c.fields.map(f=>[f.key,f.unit??'']))},{...checked.snapshot.output,outputUnit:c.unit});
 }});
}
export function verifyMechanicsPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact mechanics packet required');
 return mechanicsWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyMechanicsSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact mechanics snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=mechanicsContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable mechanics version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('Mechanics snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function mechanicsResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyMechanicsPacket(packet),c=mechanicsContract(checked.identity.catalogId!);
 const output=checked.snapshot.output as unknown as {value:number;steps:readonly string[]};
 return {...{primaryResult:{id:'value',label:c.title.replace(' Calculator',''),value:output.value,unit:c.unit},methodology:c.scope,sources:c.engine.sources},warnings:[c.limitations,'Binary64 calculation; original decimal text remains in source-bound JSON. No independent certification or publication approval.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareMechanicsRecovery(value:unknown){
 const verified=verifyMechanicsSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=mechanicsWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical mechanics result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
