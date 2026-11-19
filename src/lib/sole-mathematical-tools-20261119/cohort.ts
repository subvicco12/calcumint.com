import {matrixCalculator,type MatrixOutput} from '@/calculators/advanced-math/catalog-final';
import {seriesCalculator,type SeriesOutput} from '@/calculators/advanced-math/catalog-batch-10';
import {triangleCalculator,rightTriangleCalculator,type TriangleOutput} from '@/calculators/geometry/catalog-completion';
import {oddsCalculator} from '@/calculators/statistics/catalog-batch-4';
import type {CalculatorDefinition} from '@/calculators/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,number|string>,MatrixOutput | SeriesOutput | TriangleOutput | ReturnType<typeof oddsCalculator.calculate>>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
const matrixFields=['a11','a12','a21','a22','b11','b12','b21','b22'].map(key=>field(key,`Matrix ${key[0].toUpperCase()}, row ${key[1]}, column ${key[2]}`,''));
const rows=[
 [240,matrixCalculator,'dimensionless',[...matrixFields,{key:'operation',label:'Operation',kind:'select',options:['add','subtract','multiply']}],'Two 2 × 2 matrices with distinct left and right operand order.'],
 [250,seriesCalculator,'dimensionless',[{key:'expression',label:'Term expression in x',kind:'text'},field('start','First index',''),field('end','Last index','')],'Evaluates a finite inclusive range of at most 1,001 integer indices. The expression uses x as its index.'],
 [257,triangleCalculator,'square units',[field('a','Side a',''),field('b','Side b',''),field('c','Side c','')],'Side lengths must use the same unit and satisfy the strict triangle inequalities.'],
 [258,rightTriangleCalculator,'square units',[field('a','Perpendicular leg a',''),field('b','Perpendicular leg b','')],'Enter the two perpendicular legs in the same unit.'],
 [301,oddsCalculator,'dimensionless',[field('odds','Odds in favour',''),field('probability','Probability from 0 to 1','')],'Supply exactly one field and leave the other blank. Probability 1 has no finite odds value.'],
] as const satisfies readonly (readonly [number,unknown,string,readonly FactoryWorkbenchField[],string])[];
export const mathCaptureRevision='sole-mathematical-tools-20261119.1';
export const mathContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields,limitations])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map((f:FactoryWorkbenchField)=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations});
}));
export function mathContract(id:number){const row=mathContracts.find(x=>x.catalogId===id);if(!row)throw Error('Mathematical tools profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,c:ReturnType<typeof mathContract>){
 if(Object.keys(input).some(key=>!c.fields.some(field=>field.key===key))||(c.catalogId!==301&&c.fields.some(field=>!Object.hasOwn(input,field.key))))throw Error('Exact mathematical input fields required');
}
export function mathWorkflows(id:number){
 const c=mathContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${mathCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c);
  const input=Object.fromEntries(c.fields.flatMap((field):[string,string|number][]=>{
   const value=raw[field.key];
   if(c.catalogId===301&&(value===undefined||value.trim()===''))return [];
   if(field.kind==='select'||field.kind==='text')return [[field.key,value]];
   const number=requiredCalculatorNumber(value);
   if(!Number.isFinite(number))throw Error('Enter a finite number without decimal loss');
   return [[field.key,number]];
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
export function verifyMathematicalToolsPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact Mathematical tools packet required');
 return mathWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyMathematicalToolsSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact Mathematical tools snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=mathContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable Mathematical tools version unavailable');
 exactFields(snapshot.input,c);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('MathematicalTools snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareMathematicalToolsRecovery(value:unknown){
 const verified=verifyMathematicalToolsSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=mathWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
