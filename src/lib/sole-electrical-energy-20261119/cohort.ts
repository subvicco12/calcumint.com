import {electricalLoadCalculator, voltageDropCalculator, resistorCalculator, hvacBtuCalculator, solarPanelRequirementCalculator} from '@/calculators/engineering-construction/catalog-batch-3';
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
const rows=[
 [362,electricalLoadCalculator,'VA',[field('voltageVolts','Voltage','V'),field('currentAmps','Current','A')],'Apparent power from supplied voltage and current. Real power, equipment selection and code compliance require separate inputs and checks.'],
 [363,voltageDropCalculator,'V',[field('currentAmps','Current','A'),field('oneWayLengthMeters','One-way length','m'),field('resistanceOhmsPerMeter','Resistance per metre','Ω/m'),field('conductors','Conductors in path','1 or 2')],'Uses supplied conductor resistance and path length. Temperature, reactance and code limits are outside this estimate.'],
 [364,resistorCalculator,'Ω',[field('voltageVolts','Voltage','V'),field('currentAmps','Current','A')],'Uses Ohm’s law with positive voltage and current. Component ratings, tolerance and power dissipation require separate checks.'],
 [365,hvacBtuCalculator,'BTU/h',[field('floorAreaSquareMeters','Floor area','m²'),field('ceilingHeightMeters','Ceiling height','m'),field('btuPerCubicMeter','Supplied volumetric load factor','BTU/h per m³')],'Planning estimate using your load factor. It does not infer climate, insulation, glazing or occupancy.'],
 [366,solarPanelRequirementCalculator,'panels',[field('dailyEnergyKwh','Daily energy demand','kWh/day'),field('panelWatts','Panel rating','W'),field('peakSunHours','Peak sun hours','h/day'),field('systemEfficiencyPercent','System efficiency','%')],'Estimates a whole-panel count from supplied demand and yield assumptions. The v1 near-integer rule is retained. Site design, electrical sizing and code compliance require separate checks.'],
] as const;
export const energyCaptureRevision='sole-electrical-energy-20261119.1';
export const energyContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields,limitations])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations});
}));
export function energyContract(id:number){const row=energyContracts.find(x=>x.catalogId===id);if(!row)throw Error('Electrical and energy systems profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact Electrical and energy systems input fields required');
}
export function energyWorkflows(id:number){
 const c=energyContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${energyCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{
   const text=raw[f.key];
   const value=requiredCalculatorNumber(text);
   if(!Number.isFinite(value))throw Error('Enter a finite number without decimal loss');
   return [f.key,value];
  }));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
 return Object.freeze({...flow,exportPacket:(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  const original=flow.exportPacket(packet,format,plan); // retained entitlement and exact packet checks
  if(format==='json')return original;
  const checked=flow.verify(packet);
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input,inputUnits:Object.fromEntries(c.fields.map(f=>[f.key,f.unit??'']))},{...checked.snapshot.output,outputUnit:c.unit});
 }});
}
export function verifyElectricalEnergyPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact Electrical and energy systems packet required');
 return energyWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyElectricalEnergySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact Electrical and energy systems snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=energyContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable Electrical and energy systems version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('ElectricalEnergy snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function energyResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyElectricalEnergyPacket(packet),c=energyContract(checked.identity.catalogId!);
 const value=checked.snapshot.output.value as number;
 return {primaryResult:{id:'value',label:c.title.replace(' Calculator',''),value,unit:c.unit},methodology:c.scope,sources:c.engine.sources,warnings:[c.limitations,'Uses the registered v1 numerical model. Source applicability and precision review are pending.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareElectricalEnergyRecovery(value:unknown){
 const verified=verifyElectricalEnergySnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=energyWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
