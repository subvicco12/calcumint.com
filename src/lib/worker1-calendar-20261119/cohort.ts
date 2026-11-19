import {ageCalculator,dateDifferenceCalculator,dateAddSubtractCalculator,dayCounterCalculator,dayOfWeekCalculator} from '@/calculators/date-time/catalog-batch-1';
import {weekNumberCalculator} from '@/calculators/date-time/catalog-batch-2';
import {ninetyDayCalculator,thirtyDayCalculator,sixtyDayCalculator} from '@/calculators/date-time/catalog-batch-3';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,string|number>,Record<string,string|number>>;
const day=(key:string,label:string):FactoryWorkbenchField=>Object.freeze({key,label,unit:'YYYY-MM-DD',kind:'text'});
const offset=(key:string,label:string):FactoryWorkbenchField=>Object.freeze({key,label,unit:key,kind:'number'});
const date=day('date','Calendar date'),range=[day('startDate','Start date'),day('endDate','End date')];
const rows=[
 [443,ageCalculator,'years','years',[day('birthDate','Birth date'),day('asOfDate','As-of date')]],
 [444,dateDifferenceCalculator,'days','days',range],
 [445,dateAddSubtractCalculator,'date','YYYY-MM-DD',[date,offset('years','Year offset'),offset('months','Month offset'),offset('days','Day offset')]],
 [446,dayCounterCalculator,'days','days',range],
 [451,dayOfWeekCalculator,'dayName','weekday',[date]],
 [452,weekNumberCalculator,'weekNumber','ISO week',[date]],
 [455,ninetyDayCalculator,'date','YYYY-MM-DD',[date]],
 [456,thirtyDayCalculator,'date','YYYY-MM-DD',[date]],
 [457,sixtyDayCalculator,'date','YYYY-MM-DD',[date]],
] as const;
export const calendarCaptureRevision='worker1-calendar-20261119.1';
export const calendarContracts=Object.freeze(rows.map(([catalogId,definition,resultKey,unit,fields])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,resultKey,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations:'Date-only Gregorian arithmetic with no timezone, holiday or inclusive-day adjustment. Canonical applicability and competent review remain pending.'});
}));
export function calendarContract(id:number){const row=calendarContracts.find(x=>x.catalogId===id);if(!row)throw Error('Calendar profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact calendar input fields required');
}
export function calendarWorkflows(id:number){
 const c=calendarContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${calendarCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c.fields);
  const input=Object.fromEntries(c.fields.map(f=>{
   const text=raw[f.key];
   if(f.kind==='text'){if(!/^\d{4}-\d{2}-\d{2}$/.test(text))throw Error('Enter a calendar date in YYYY-MM-DD format');return [f.key,text];}
   if(!/^[+-]?\d{1,16}$/.test(text))throw Error('Enter a complete signed integer offset');
   const value=requiredCalculatorNumber(text);
   if(!Number.isSafeInteger(value))throw Error('Date offsets must be safe integers');
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
export function verifyCalendarPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact calendar packet required');
 return calendarWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyCalendarSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact calendar snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=calendarContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable calendar version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('Calendar snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
export function calendarResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyCalendarPacket(packet),c=calendarContract(checked.identity.catalogId!);
 const output=checked.snapshot.output as Record<string,string|number>;
 return {...{primaryResult:{id:c.resultKey,label:c.title.replace(' Calculator',''),value:output[c.resultKey],unit:c.unit},metrics:Object.entries(output).filter(([key])=>key!==c.resultKey).map(([key,value])=>({id:key,label:({weekYear:'ISO week-year',dayIndex:'Weekday index',months:'Months',days:'Days'} as Record<string,string>)[key]??key,value})),methodology:c.scope,sources:c.engine.sources},warnings:[c.limitations,'Date and integer fields retain their original text in source-bound JSON. No independent certification or publication approval.']};
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareCalendarRecovery(value:unknown){
 const verified=verifyCalendarSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=calendarWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical calendar result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
