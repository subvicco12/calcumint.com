import {tripCostCalculator} from '@/calculators/travel/catalog-batch-2';
import {hotelCostSplitCalculator,groupExpenseSplitCalculator,tipSplitCalculator} from '@/calculators/travel/catalog-batch-1';
import {householdUtilityCostCalculator,movingCostCalculator} from '@/calculators/travel/catalog-batch-3';
import {runningPaceCalculator,cyclingSpeedCalculator,swimmingPaceCalculator} from '@/calculators/sports/catalog-batch-1';
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
const currency='entered currency units';
const rows=[
 [508,tripCostCalculator,currency,[field('transportCost','Transport cost',currency),field('lodgingCost','Lodging cost',currency),field('foodCost','Food cost',currency),field('otherCost','Other cost',currency)]],
 [513,hotelCostSplitCalculator,currency+'/person',[field('totalHotelCost','Total hotel cost',currency),field('people','People','whole people')]],
 [514,groupExpenseSplitCalculator,currency+'/person',[field('totalExpense','Total expense',currency),field('people','People','whole people')]],
 [515,tipSplitCalculator,currency+'/person',[field('billAmount','Bill amount',currency),field('tipPercent','Tip percentage','%'),field('people','People','whole people')]],
 [519,householdUtilityCostCalculator,currency,[field('electricity','Electricity',currency),field('water','Water',currency),field('gas','Gas',currency),field('internet','Internet',currency),field('other','Other',currency)]],
 [520,movingCostCalculator,currency,[field('transport','Transport',currency),field('packing','Packing',currency),field('labor','Labor',currency),field('storage','Storage',currency),field('other','Other',currency)]],
 [521,runningPaceCalculator,'min/km',[field('distanceKm','Distance','km'),field('timeMinutes','Elapsed time','min')]],
 [523,cyclingSpeedCalculator,'km/h',[field('distanceKm','Distance','km'),field('timeHours','Elapsed time','h')]],
 [524,swimmingPaceCalculator,'min/100 m',[field('distanceMeters','Distance','m'),field('timeMinutes','Elapsed time','min')]],
] as const;
export const everydayCaptureRevision='worker3-everyday-sports-20261118.1';
export const everydayContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations:(catalogId>=521?'Average from supplied distance and elapsed time only; not a physiological or predictive model.':'Amounts must use one common entered currency. Unrounded arithmetic only; no FX or cent-allocation/settlement guarantee.')+' Canonical applicability and competent review remain pending.'});
}));
export function everydayContract(id:number){const row=everydayContracts.find(x=>x.catalogId===id);if(!row)throw Error('Everyday profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact everyday input fields required');
}
export function everydayWorkflows(id:number){
 const c=everydayContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${everydayCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{if(raw[f.key].trim().length>128)throw Error('Decimal input exceeds capture length');const value=requiredCalculatorNumber(raw[f.key]);if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022))throw Error('Complete finite normal decimal inputs required');return [f.key,value];}));
  const parsed=c.engine.inputSchema.parse(input),output=c.engine.calculate(parsed,{});
  if([513,514,515].includes(id)&&(!Number.isSafeInteger(parsed.people)||parsed.people<1))throw Error('Positive safe whole people required for new capture; historical v1 is preserved');
  const positiveExpected=id>=521||(id===513?parsed.totalHotelCost>0:id===514?parsed.totalExpense>0:id===515?parsed.billAmount>0:Object.values(parsed).some(v=>v>0));
  if(!Number.isFinite(output.value)||output.value<0||(output.value!==0&&output.value<2**-1022)||(positiveExpected&&output.value===0))throw Error('Result outside supported normal capture range');
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
 return Object.freeze({...flow,exportPacket:(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  const original=flow.exportPacket(packet,format,plan); // retained entitlement and exact packet checks
  if(format==='json')return original;
  const checked=flow.verify(packet);
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input,inputUnits:Object.fromEntries(c.fields.map(f=>[f.key,f.unit??'']))},{...checked.snapshot.output,outputUnit:c.unit});
 }});
}
export function verifyEverydayPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact everyday packet required');
 return everydayWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyEverydaySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact everyday snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=everydayContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable everyday version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('Everyday snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function everydayResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyEverydayPacket(packet),c=everydayContract(checked.identity.catalogId!);
 const output=checked.snapshot.output as unknown as {value:number;steps:readonly string[]};
 return {...{primaryResult:{id:'value',label:c.title.replace(' Calculator',''),value:output.value,unit:c.unit},methodology:c.scope,sources:c.engine.sources},warnings:[c.limitations,'Binary64 calculation; original decimal text remains in source-bound JSON. No independent certification or publication approval.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareEverydayRecovery(value:unknown){
 const verified=verifyEverydaySnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=everydayWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical everyday result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}

