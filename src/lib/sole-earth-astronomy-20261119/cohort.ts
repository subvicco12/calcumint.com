import {orbitalPeriodCalculator,escapeVelocityCalculator} from '@/calculators/astronomy/catalog-batch-1';
import {astronomicalDistanceConverter} from '@/calculators/astronomy/catalog-batch-2';
import {dewPointCalculator,windChillCalculator} from '@/calculators/earth-science/catalog-batch-1';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,string|number>,Record<string,unknown>>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
const units=['km','au','ly','pc'] as const;
const unit=(key:string,label:string):FactoryWorkbenchField=>({key,label,kind:'select',options:units});
const rows=[
 [532,orbitalPeriodCalculator,'value','years',[field('semiMajorAxisAu','Semi-major axis','au'),field('centralMassSolar','Central mass','solar masses')],'Two-body approximation with negligible orbiting mass.'],
 [533,escapeVelocityCalculator,'value','km/s',[field('massKg','Body mass','kg'),field('radiusM','Body radius','m')],'Spherical-body model without rotation or an atmosphere.'],
 [534,astronomicalDistanceConverter,'result',null,[field('value','Distance','source unit'),unit('fromUnit','Source unit'),unit('toUnit','Target unit')],'Fixed unit factors from the registered v1 contract. The result uses the selected target unit.'],
 [538,windChillCalculator,'value','°C',[field('temperatureC','Air temperature','°C'),field('windSpeedKmh','Wind speed','km/h')],'Wind-chill index in the registered range. For weather and exposure decisions, use your local meteorological authority.'],
 [540,dewPointCalculator,'value','°C',[field('temperatureC','Air temperature','°C'),field('relativeHumidity','Relative humidity','%')],'Magnus approximation using relative humidity as a percentage.'],
] as const;
export const earthCaptureRevision='sole-earth-astronomy-20261119.1';
export const earthContracts=Object.freeze(rows.map(([catalogId,definition,resultKey,fixedUnit,fields,limitations])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,resultKey,outputUnit:(input:Record<string,unknown>)=>fixedUnit??String(input.toUnit),engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations});
}));
export function earthContract(id:number){const row=earthContracts.find(x=>x.catalogId===id);if(!row)throw Error('Earth and astronomy profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact Earth and astronomy input fields required');
}
export function earthWorkflows(id:number){
 const c=earthContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${earthCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{
   const text=raw[f.key];
   if(f.kind==='select'){
    if(!f.options?.includes(text))throw Error('Select a supported distance unit');
    return [f.key,text];
   }
   const value=requiredCalculatorNumber(text);
   if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022))throw Error('Enter a finite number without numeric underflow or decimal loss');
   return [f.key,value];
  }));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  const result=output[c.resultKey];
  const mustBePositive=[532,533].includes(c.catalogId)||(c.catalogId===534&&Number(parsed.value)>0);
  if(typeof result!=='number'||!Number.isFinite(result)||(mustBePositive&&result<=0))throw Error('Result is outside the supported capture precision; the registered engine and historical replay are unchanged');
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
 return Object.freeze({...flow,exportPacket:(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  const original=flow.exportPacket(packet,format,plan); // retained entitlement and exact packet checks
  if(format==='json')return original;
  const checked=flow.verify(packet);
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input,inputUnits:Object.fromEntries(c.fields.filter(f=>f.unit).map(f=>[f.key,f.key==='value'?checked.snapshot.input.fromUnit:f.unit]))},{...checked.snapshot.output,outputUnit:c.outputUnit(checked.snapshot.input)});
 }});
}
export function verifyEarthAstronomyPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact Earth and astronomy packet required');
 return earthWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyEarthAstronomySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact Earth and astronomy snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=earthContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable Earth and astronomy version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('EarthAstronomy snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function earthResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyEarthAstronomyPacket(packet),c=earthContract(checked.identity.catalogId!);
 const value=checked.snapshot.output[c.resultKey] as number;
 return {primaryResult:{id:c.resultKey,label:c.title.replace(' Calculator',''),value,unit:c.outputUnit(checked.snapshot.input)},methodology:c.scope,sources:c.engine.sources,warnings:[c.limitations,'Uses the registered v1 numerical model. Source applicability and precision review are pending.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareEarthAstronomyRecovery(value:unknown){
 const verified=verifyEarthAstronomySnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=earthWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
