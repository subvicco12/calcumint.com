import {coffeeRatioCalculator,waterToRiceRatioCalculator} from '@/calculators/food/catalog-batch-2';
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
 [504,coffeeRatioCalculator,'g',[field('waterGrams','Water mass','g'),field('waterToCoffeeRatio','Water-to-coffee mass ratio','g/g')],'Enter grams of water and grams of water per gram of coffee. No water volume-to-mass conversion or brewing recommendation is applied.'],
 [505,waterToRiceRatioCalculator,'same measure as rice',[field('riceAmount','Rice amount','chosen measure'),field('waterPerRiceUnit','Water per rice unit','same measure/same measure')],'Use a consistent measure for rice and water, such as cups with cups. No volume-to-mass, cup-size, rice-type or cooking adjustments are applied.'],
] as const;
export const ratioCaptureRevision='worker1-food-ratios-20261119.1';
export const ratioContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields,limitations])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations});
}));
export function ratioContract(id:number){const row=ratioContracts.find(x=>x.catalogId===id);if(!row)throw Error('FoodRatio profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact food ratio input fields required');
}
export function ratioWorkflows(id:number){
 const c=ratioContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${ratioCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{
   const text=raw[f.key];
   const value=requiredCalculatorNumber(text);
   const significand=text.trim().split(/[eE]/,1)[0];
   if(!Number.isFinite(value)||value<0||(value===0&&/[1-9]/.test(significand))||(value!==0&&value<2**-1022))throw Error('Enter a finite nonnegative amount without numeric underflow');
   if(f.key==='waterToCoffeeRatio'&&value===0)throw Error('Water-to-coffee ratio must be greater than zero');
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
export function verifyFoodRatioPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact food ratio packet required');
 return ratioWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyFoodRatioSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact food ratio snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=ratioContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable food ratio version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('FoodRatio snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function ratioResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyFoodRatioPacket(packet),c=ratioContract(checked.identity.catalogId!);
 const output=checked.snapshot.output as {value:number;steps:readonly string[]};
 return {primaryResult:{id:'value',label:c.catalogId===504?'Coffee mass':'Water amount',value:output.value,unit:c.unit},methodology:c.scope,sources:c.engine.sources,warnings:[c.limitations,'Uses the registered v1 Binary64 calculation and six-decimal rounding. A positive amount can round to zero.']};

}
/** A readable immutable record need not qualify as a new capture. */
export function prepareFoodRatioRecovery(value:unknown){
 const verified=verifyFoodRatioSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=ratioWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical ratio result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
