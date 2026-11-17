import {correlationCalculator} from '@/calculators/statistics/catalog-batch-3';
import {linearRegressionCalculator,weightedMeanCalculator,percentileCalculator} from '@/calculators/statistics/catalog-batch-4';
import type {CalculatorDefinition} from '@/calculators/types';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {sameRecordedJson} from '@/lib/recorded-json-equality';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {rational,add,multiply,divide,subtract,type Rational} from '@/calculators/exact-rational';

type Input=Record<string,number|number[]>;
type Output=Record<string,unknown>;
type Engine=CalculatorDefinition<Input,Output>;
const rows=[
 [292,correlationCalculator,'correlation'],[293,linearRegressionCalculator,'slope'],
 [294,weightedMeanCalculator,'weightedMean'],[295,percentileCalculator,'percentile'],
] as const;
const labels:Record<string,string>={xValues:'X observations (comma-separated)',yValues:'Y observations (paired comma-separated)',values:'Observations (comma-separated)',weights:'Positive weights (paired comma-separated)',percentile:'Requested percentile (0–100)'};
export const statisticsCaptureRevision='worker1-statistics-a-20261117.1';
export const statisticsContracts=Object.freeze(rows.map(([catalogId,definition,primaryKey])=>{
 const engine=definition as unknown as Engine;
 const fields:readonly FactoryWorkbenchField[]=Object.freeze(Object.entries(engine.examples[0].input).map(([key,value])=>Object.freeze({key,label:labels[key],kind:'text' as const,defaultValue:Array.isArray(value)?value.join(', '):String(value)})));
 return Object.freeze({catalogId,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,engine,primaryKey,fields,scope:engine.formulas.map(f=>f.description).join(' ')});
}));
export function statisticsContract(id:number){const c=statisticsContracts.find(c=>c.catalogId===id);if(!c)throw Error('Exact statistics profile unavailable');return c;}
function fieldsOnly(input:Record<string,unknown>,keys:readonly string[]){if(Object.keys(input).length!==keys.length||keys.some(k=>!Object.hasOwn(input,k)))throw Error('Exact statistics input fields required');}
/** Deliberately strict comma-separated decimal text; no missing-value imputation,
 * frequency inference, delimiter guessing or conversion to an alternative method. */
function parseRaw(id:number,raw:Readonly<Record<string,string>>){
 const c=statisticsContract(id),keys=c.fields.map(f=>f.key);fieldsOnly(raw,keys);
 const number=(s:string)=>{const n=requiredCalculatorNumber(s);if(!s.trim()||!Number.isFinite(n)||Math.abs(n)>1e50||(n!==0&&Math.abs(n)<1e-50))throw Error('Finite decimal capture inputs require zero or 1e-50 ≤ magnitude ≤ 1e50');return n;};
 const input=Object.fromEntries(keys.map(key=>{
  const text=raw[key];if(typeof text!=='string')throw Error('Original decimal text required');
  if(key==='percentile')return [key,number(text)];
  const tokens=text.split(',');if(tokens.length>10000)throw Error('At most 10000 observations per field');return [key,tokens.map(number)];
 }));return c.engine.inputSchema.parse(input);
}
function binary64(value:number):Rational{
 if(!Number.isFinite(value))throw Error('Finite witness value required');if(value===0)return rational(0n);
 const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,value);const bits=view.getBigUint64(0),e=Number((bits>>52n)&2047n),f=bits&((1n<<52n)-1n);
 const significand=(e===0?f:(1n<<52n)|f)*(value<0?-1n:1n),power=e===0?-1074:e-1075;
 return power>=0?rational(significand<<BigInt(power)):rational(significand,1n<<BigInt(-power));
}
const abs=(n:bigint)=>n<0n?-n:n;
/** Refusal witness only: never replaces the immutable engine result. The
 * 1e-12 relative agreement threshold is a private capture boundary, not a
 * mathematical certification or a newly imposed historical rounding policy. */
function agreement(actual:number,expected:Rational){
 const difference=subtract(binary64(actual),expected);
 if(abs(BigInt(difference.numerator))*BigInt(expected.denominator)*1000000000000n>abs(BigInt(expected.numerator))*BigInt(difference.denominator))throw Error('Statistics precision differs from exact normalized-input witness; immutable v1 history is preserved');
}
function weightedPrecision(input:Input,output:Output){
 const values=input.values as number[],weights=input.weights as number[];let sum=rational(0n),weight=rational(0n);
 for(let i=0;i<values.length;i++){const w=binary64(weights[i]);weight=add(weight,w);sum=add(sum,multiply(binary64(values[i]),w));}
 agreement(output.weightedMean as number,divide(sum,weight));
 agreement(output.totalWeight as number,weight);
}
function pairedPrecision(id:number,input:Input,output:Output){
 const xs=input.xValues as number[],ys=input.yValues as number[],n=rational(BigInt(xs.length));
 let sx=rational(0n),sy=rational(0n),sxx=rational(0n),sxy=rational(0n),syy=rational(0n);
 for(let i=0;i<xs.length;i++){const x=binary64(xs[i]),y=binary64(ys[i]);sx=add(sx,x);sy=add(sy,y);sxx=add(sxx,multiply(x,x));sxy=add(sxy,multiply(x,y));syy=add(syy,multiply(y,y));}
 const xx=subtract(multiply(n,sxx),multiply(sx,sx)),xy=subtract(multiply(n,sxy),multiply(sx,sy)),yy=subtract(multiply(n,syy),multiply(sy,sy));
 if(BigInt(xx.numerator)<=0n)throw Error('Positive X variance required');
 if(id===293){const slope=divide(xy,xx);agreement(output.slope as number,slope);agreement(output.intercept as number,divide(subtract(sy,multiply(slope,sx)),n));}
 else{agreement(output.meanX as number,divide(sx,n));agreement(output.meanY as number,divide(sy,n));}
 if(BigInt(yy.numerator)===0n){if(id===292)throw Error('Positive Y variance required');agreement(output.correlation as number,rational(0n));return;}
 const r=output.correlation as number;
 if((r>0&&BigInt(xy.numerator)<0n)||(r<0&&BigInt(xy.numerator)>0n))throw Error('Correlation precision sign differs from exact witness');
 const squared=divide(multiply(xy,xy),multiply(xx,yy));
 agreement(r*r,squared);if(id===293)agreement(output.rSquared as number,squared);
}
function percentilePrecision(input:Input,output:Output){
 const sorted=[...(input.values as number[])].sort((a,b)=>a-b),position=divide(multiply(binary64(input.percentile as number),rational(BigInt(sorted.length-1))),rational(100n));
 const lo=Number(BigInt(position.numerator)/BigInt(position.denominator)),hi=Math.min(lo+1,sorted.length-1),fraction=subtract(position,rational(BigInt(lo)));
 agreement(output.percentile as number,add(binary64(sorted[lo]),multiply(subtract(binary64(sorted[hi]),binary64(sorted[lo])),fraction)));
 agreement(output.position as number,position);
}
export function statisticsWorkflows(id:number){
 const c=statisticsContract(id);
 return createFactoryWorkflows({identity:{catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${statisticsCaptureRevision}/${c.engineId}@${c.version}`},execute(raw){
  const input=parseRaw(id,raw),output=c.engine.calculate(input,{});
  for(const value of Object.values(output))if(typeof value==='number'&&(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022)))throw Error('Statistics output outside finite normal capture range');
  if(id===294)weightedPrecision(input,output);
  if(id===295)percentilePrecision(input,output);
  if(id===292||id===293)pairedPrecision(id,input,output);
  if((id===292||id===293)&&Math.abs(output.correlation as number)>1+8*Number.EPSILON)throw Error('Correlation outside numerical range');
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input,output});
 }});
}
export function verifyStatisticsPacket(value:unknown){
 const clean=copyCalculationData({value},{}).input.value as FactoryExecutionPacket;
 if(typeof clean?.identity?.catalogId!=='number')throw Error('Exact statistics packet required');
 return statisticsWorkflows(clean.identity.catalogId).verify(clean);
}
/** Legacy normalized snapshots are verified against v1, independently of all
 * current capture boundaries; neither input nor output is silently rewritten. */
export function verifyStatisticsSnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact historical statistics snapshot required');
 const snapshot=createCalculationSnapshot(clean as CalculationSnapshot),c=statisticsContracts.find(c=>c.slug===snapshot.calculatorSlug&&c.version===snapshot.calculatorVersion);
 if(!c)throw Error('Exact immutable statistics version unavailable');fieldsOnly(snapshot.input,c.fields.map(f=>f.key));
 const input=c.engine.inputSchema.parse(snapshot.input),expected=createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input,output:c.engine.calculate(input,{})});
 if(!sameRecordedJson(snapshot,expected))throw Error('Statistics snapshot differs from immutable v1 engine');
 return Object.freeze({catalogId:c.catalogId,engineId:c.engineId,snapshot});
}
export function statisticsResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const checked=verifyStatisticsPacket(packet),c=statisticsContract(checked.identity.catalogId!);
 return {primaryResult:{id:c.primaryKey,label:c.title.replace(' Calculator',''),value:checked.snapshot.output[c.primaryKey] as number},metrics:Object.entries(checked.snapshot.output).filter(([k,v])=>k!==c.primaryKey&&typeof v==='number').map(([id,value])=>({id,label:id,value:value as number})),methodology:c.scope,sources:c.engine.sources,warnings:['Private binary64 engineering capture; no canonical acceptance, independent certification or source-applicability approval.','No inference of causality, frequency weighting or alternate percentile convention. Raw decimal text is retained; inputs are normalized to binary64.']};
}
