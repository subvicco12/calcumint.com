import {rrefCalculator,vectorCalculator,sequenceCalculator,type RrefOutput,type VectorOutput,type SequenceOutput} from '@/calculators/advanced-math/catalog-batch-7';
import {equationSolverCalculator,polynomialCalculator,type EquationOutput,type CubicOutput} from '@/calculators/advanced-math/catalog-batch-8';
import type {CalculatorDefinition} from '@/calculators/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,number>,RrefOutput | VectorOutput | SequenceOutput | EquationOutput | CubicOutput>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
const coefficient=(key:string)=>field(key,'Coefficient '+key,'');
const rows=[
 [236,equationSolverCalculator,[coefficient('a'),coefficient('b'),coefficient('c')],'Solves ax² + bx + c = 0. Set a to zero for a linear equation.'],
 [243,rrefCalculator,['a','b','c','d','e','f'].map((key,index)=>field(key,`Row ${1+Math.floor(index/3)}, column ${1+index%3}`,'')),'Reduces a fixed 2 × 3 matrix and reports its rank.'],
 [245,vectorCalculator,['ax','ay','az','bx','by','bz'].map(key=>field(key,key[0].toUpperCase()+' '+key[1]+' component','')),'Uses three-dimensional Euclidean vectors. The angle is undefined when either vector is zero.'],
 [249,sequenceCalculator,[field('first','First term',''),field('difference','Common difference',''),field('n','Term number','1–1000')],'Arithmetic progressions only. The preview contains at most the first 20 terms.'],
 [253,polynomialCalculator,[coefficient('a'),coefficient('b'),coefficient('c'),coefficient('d')],'Finds distinct real roots of ax³ + bx² + cx + d = 0 with nonzero a.'],
] as const;
export const algebraCaptureRevision='sole-bounded-algebra-20261119.1';
export const algebraContracts=Object.freeze(rows.map(([catalogId,definition,fields,limitations])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit:"dimensionless",engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map(f=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations});
}));
export function algebraContract(id:number){const row=algebraContracts.find(x=>x.catalogId===id);if(!row)throw Error('Bounded algebra profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(input).length!==fields.length||fields.some(f=>!Object.hasOwn(input,f.key)))throw Error('Exact Bounded algebra input fields required');
}
export function algebraWorkflows(id:number){
 const c=algebraContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${algebraCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
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
export function verifyBoundedAlgebraPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact Bounded algebra packet required');
 return algebraWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyBoundedAlgebraSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact Bounded algebra snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=algebraContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable Bounded algebra version unavailable');
 exactFields(snapshot.input,c.fields);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('BoundedAlgebra snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareBoundedAlgebraRecovery(value:unknown){
 const verified=verifyBoundedAlgebraSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=algebraWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
