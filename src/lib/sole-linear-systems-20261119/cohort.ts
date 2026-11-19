import {linearEquationCalculator,quadraticFormulaCalculator,matrixDeterminantCalculator,type LinearEquationOutput,type QuadraticOutput,type DeterminantOutput} from '@/calculators/advanced-math/catalog-batch-5';
import {systemOfEquationsCalculator,matrixInverseCalculator,complexNumberCalculator,type System2Output,type MatrixInverseOutput,type ComplexOutput} from '@/calculators/advanced-math/catalog-batch-6';
import type {CalculatorDefinition} from '@/calculators/types';
import {createFactoryWorkflows,type FactoryRaw,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,number|string>,LinearEquationOutput | QuadraticOutput | DeterminantOutput | System2Output | MatrixInverseOutput | ComplexOutput>;
const field=(key:string,label:string,unit:string):FactoryWorkbenchField=>Object.freeze({key,label,unit,kind:'number'});
const coefficient=(key:string)=>field(key,'Coefficient '+key,'');
const matrixFields=['a','b','c','d'].map((key,i)=>field(key,`Row ${1+Math.floor(i/2)}, column ${1+i%2}`,''));
const rows=[
 [237,linearEquationCalculator,'dimensionless',['a','b'].map(coefficient),'Solves ax + b = 0 for nonzero a.'],
 [238,quadraticFormulaCalculator,'dimensionless',['a','b','c'].map(coefficient),'Solves ax² + bx + c = 0 for nonzero a and reports the vertex.'],
 [239,systemOfEquationsCalculator,'dimensionless',['a','b','c','d','e','f'].map(coefficient),'Solves ax + by = c and dx + ey = f with one unique solution.'],
 [241,matrixDeterminantCalculator,'dimensionless',matrixFields,'Computes the determinant for a fixed 2 × 2 matrix. A singular matrix has determinant zero.'],
 [242,matrixInverseCalculator,'dimensionless',matrixFields,'Computes the inverse of a nonsingular 2 × 2 matrix.'],
 [244,complexNumberCalculator,'dimensionless',[field('a','First real part',''),field('b','First imaginary part',''),field('c','Second real part',''),field('d','Second imaginary part',''),{key:'operation',label:'Operation',kind:'select',options:['add','subtract','multiply','divide']}],'Uses rectangular complex inputs and reports the argument in radians.'],
] as const satisfies readonly (readonly [number,unknown,string,readonly FactoryWorkbenchField[],string])[];
export const linearCaptureRevision='sole-linear-systems-20261119.1';
export const linearContracts=Object.freeze(rows.map(([catalogId,definition,unit,fields,limitations])=>{
 const engine=definition as unknown as Engine;
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit,engine,scope:engine.formulas.map(f=>f.description).join(' '),fields:Object.freeze(fields.map((f:FactoryWorkbenchField)=>Object.freeze({...f,defaultValue:engine.examples[0].input[f.key]}))),limitations});
}));
export function linearContract(id:number){const row=linearContracts.find(x=>x.catalogId===id);if(!row)throw Error('Linear systems profile unavailable');return row;}
function exactFields(input:Record<string,unknown>,c:ReturnType<typeof linearContract>){
 if(Object.keys(input).length!==c.fields.length||c.fields.some(field=>!Object.hasOwn(input,field.key)))throw Error('Exact mathematical input fields required');
}
export function linearWorkflows(id:number){
 const c=linearContract(id);
 const flow=createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${linearCaptureRevision}/${c.engineId}@${c.version}`},execute:(raw:FactoryRaw)=>{
  exactFields(raw,c);
  const input=Object.fromEntries(c.fields.map((field):[string,string|number]=>{
   const value=raw[field.key];
   if(field.kind==='select'||field.kind==='text')return [field.key,value];
   const number=requiredCalculatorNumber(value);
   if(!Number.isFinite(number))throw Error('Enter a finite number without decimal loss');
   return [field.key,number];
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
export function verifyLinearSystemsPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Exact Linear systems packet required');
 return linearWorkflows(clean.identity.catalogId).verify(clean);
}
/** Historical numerical verification is deliberately independent of new capture limits. */
export function verifyLinearSystemsSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact Linear systems snapshot fields required');
 const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
 const c=linearContracts.find(row=>row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable Linear systems version unavailable');
 exactFields(snapshot.input,c);
 const parsed=c.engine.inputSchema.parse(snapshot.input),expected=c.engine.calculate(parsed,{});
 if(!equalCompletionJson(parsed,snapshot.input)||!equalCompletionJson(expected,snapshot.output))throw Error('LinearSystems snapshot differs from immutable engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,scope:c.scope,snapshot});
}
/** A readable immutable record need not qualify as a new capture. */
export function prepareLinearSystemsRecovery(value:unknown){
 const verified=verifyLinearSystemsSnapshot(value);
 const raw=Object.fromEntries(Object.entries(verified.snapshot.input).map(([k,v])=>[k,typeof v==='number'&&Object.is(v,-0)?'-0':String(v)]));
 let current:FactoryExecutionPacket;
 try{current=linearWorkflows(verified.catalogId).execute(raw);}catch{return {...verified,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(current.snapshot,verified.snapshot))throw Error('Historical result differs from current capture');
 return {...verified,currentCaptureAvailable:true as const};
}
