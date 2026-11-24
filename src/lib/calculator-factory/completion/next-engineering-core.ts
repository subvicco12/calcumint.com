import type {CalculatorDefinition} from '@/calculators/types';
import type {FactoryContract} from '../registry';
import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from '../../calculation-snapshot';
import {requiredCalculatorNumber} from '../../registered-input-successor';
import {sameRecordedJson} from '../../recorded-json-equality';

export type EngineeringContract=FactoryContract&Readonly<{verifyHistorical:(snapshot:CalculationSnapshot)=>Readonly<{snapshot:CalculationSnapshot;engineId:string;engineVersion:number;scope:string}>}>;
export type EngineeringOptions<I,O>={catalogId:number;primaryKey:keyof O&string;unit:string;scope:string;sourceEvidence:readonly string[];fieldUnits?:Readonly<Record<string,string>>;fieldOptions?:Readonly<Record<string,readonly string[]>>;validate?:(input:I,output:O)=>void};
/** Private captures reuse immutable engines. Historical replay deliberately bypasses capture-only guards. */
export function createEngineeringContract<I extends object,O extends object>(engine:CalculatorDefinition<I,O>,options:EngineeringOptions<I,O>):EngineeringContract{
 const example=engine.examples[0]?.input;
 if(!example)throw Error('An explicit immutable example is required');
 const keys=Object.keys(example);
 const exampleValues=example as Record<string,unknown>;
 const fieldOptions=options.fieldOptions??{};
 if(Object.keys(fieldOptions).some(key=>!keys.includes(key))||keys.some(key=>{
  const choices=fieldOptions[key];
  return choices?typeof exampleValues[key]!=='string'||!choices.includes(exampleValues[key]):typeof exampleValues[key]!=='number';
 }))throw Error('Exact numeric or declared choice fields required');
 const parse=(raw:unknown)=>{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Exact engine input required');
  const clean=copyCalculationData(raw as Record<string,unknown>,{}).input;
  if(Object.keys(clean).length!==keys.length||Object.keys(clean).some(key=>!keys.includes(key)))throw Error('Exact engine input fields required');
  return engine.inputSchema.parse(clean);
 };
 const record=(input:I,output:O)=>createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:engine.version,input:input as Record<string,unknown>,output:output as Record<string,unknown>});
 return Object.freeze({catalogId:options.catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,registered:true,captureRevision:'private.next-engineering.20261115.1',primaryKey:options.primaryKey,unit:options.unit,scope:options.scope,sourceEvidence:Object.freeze([...options.sourceEvidence]),limitations:Object.freeze(['Private engineering contract; canonical acceptance, certification and publication remain pending.','Capture uses binary64 finite inputs |x| ≤ 1e50; nonzero magnitudes ≥ 1e-50. Original historical domain is preserved.']),fields:Object.freeze(keys.map(key=>Object.freeze({key,label:key,...(fieldOptions[key]?{kind:'select' as const,options:fieldOptions[key]}:{kind:'number' as const}),defaultValue:String(exampleValues[key]),...(options.fieldUnits?.[key]?{unit:options.fieldUnits[key]}:{})}))),
 execute(raw){
  const clean=copyCalculationData(raw,{}).input;
  if(Object.values(clean).some(value=>typeof value!=='string'))throw Error('Explicit numeric text fields required');
  const values=Object.fromEntries(Object.entries(clean).map(([key,value])=>{
   const text=value as string,choices=fieldOptions[key];
   if(choices){
    if(!choices.includes(text))throw Error('Unsupported calculator choice');
    return [key,text];
   }
   const number=requiredCalculatorNumber(text);
   if(!Number.isFinite(number)||Math.abs(number)>1e50||(number!==0&&Math.abs(number)<1e-50))throw Error('Outside bounded engineering capture range');
   return [key,number];
  }));
  const input=parse(values),output=engine.calculate(input,{});
  options.validate?.(input,output);
  // Preserve all structured fields. The snapshot copier rejects nonfinite/exotic data recursively.
  const snapshot=record(input,output);
  const primary=snapshot.output[options.primaryKey];
  if(typeof primary!=='number'||!Number.isFinite(primary)||(primary!==0&&Math.abs(primary)<2**-1022))throw Error('Primary result outside finite normal range');
  return snapshot;
 },
 verifyHistorical(raw){
  const clean=copyCalculationData({snapshot:raw},{}).input.snapshot;
  if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).length!==4||!['calculatorSlug','calculatorVersion','input','output'].every(key=>Object.hasOwn(clean,key)))throw Error('Exact historical snapshot shape required');
  const snapshot=createCalculationSnapshot(clean as CalculationSnapshot);
  if(snapshot.calculatorSlug!==engine.slug||snapshot.calculatorVersion!==engine.version)throw Error('Exact historical identity/version unavailable');
  const input=parse(snapshot.input),expected=record(input,engine.calculate(input,{}));
  if(!sameRecordedJson(snapshot,expected))throw Error('Stored result differs from immutable historical engine');
  return Object.freeze({snapshot,engineId:engine.id,engineVersion:engine.version,scope:'Exact historical forward agreement; no certification or publication authority.'});
 }});
}
