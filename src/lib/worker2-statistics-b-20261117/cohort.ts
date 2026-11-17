import {quartileCalculator,interquartileRangeCalculator,expectedValueCalculator} from '@/calculators/statistics/catalog-batch-4';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows,type FactoryExecutionPacket,type FactoryRaw} from '@/lib/calculator-factory/workflows';
import type {ScopedEngineeringMetadata} from '@/lib/calculator-factory/completion/scoped-engineering-metadata';
import {createCalculationSnapshot,copyCalculationData,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {parseFinalPrivateSnapshotText} from '@/lib/final-private-snapshot-text';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {rational,add,subtract,multiply,type Rational} from '@/calculators/exact-rational';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';

type Engine=CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
export const statisticsCaptureRevision='worker2-statistics-b-20261117.1';
const quantileSource='https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html';
const expectationSource='https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation';
export const statisticsContracts=Object.freeze([
 {catalogId:296,engine:quartileCalculator,primaryKey:'quartile',scope:'Sample quartile Q1/Q2/Q3 using the retained linear-position convention h=(k/4)(n-1), equivalent to type7; no method substitution.',publisher:quantileSource},
 {catalogId:297,engine:interquartileRangeCalculator,primaryKey:'interquartileRange',scope:'Sample IQR=Q3-Q1 using the retained type7 linear interpolation; not Tukey hinges or an outlier decision.',publisher:quantileSource},
 {catalogId:299,engine:expectedValueCalculator,primaryKey:'expectedValue',scope:'Finite supplied discrete distribution; outcome/probability arrays must pair exactly, probabilities in[0,1] and their binary64 sum exactly1. No normalization, risk/causal or distribution-fit inference.',publisher:expectationSource},
].map(row=>{
 const engine=row.engine as unknown as Engine;
 const fields:FactoryWorkbenchField[]=Object.entries(engine.examples[0].input).map(([key,value])=>({key,label:key==='values'?'Observed values (JSON array)':key==='outcomes'?'Outcomes (JSON array)':key==='probabilities'?'Probabilities (JSON array)':'Quartile number',kind:Array.isArray(value)?'text':'select',...(Array.isArray(value)?{}:{options:['1','2','3']}),defaultValue:Array.isArray(value)?JSON.stringify(value):String(value),unit:key==='probabilities'?'probability (0–1)':key==='quartileNumber'?'index':'supplied common unit'}));
 return Object.freeze({...row,engine,engineId:engine.id,slug:engine.slug,version:engine.version,title:engine.title,unit:'supplied common unit',fields:Object.freeze(fields),limitations:Object.freeze(['Private bounded profile; canonical mapping, source adoption, competent review and publication remain pending.','Input values |x|≤1e50; nonzero magnitudes≥1e-50;1–10000 observations and shared64KiB raw-entry bound.','New capture refuses error above2^-40 relative to exact normalized binary64 formula; zero must agree exactly. This is capture policy, not a full-domain precision certificate.','Historical replay retains the full original engine domain and bypasses new capture guards.'])});
}));
export function statisticsContract(id:number){const row=statisticsContracts.find(c=>c.catalogId===id);if(!row)throw Error('Statistics profile unavailable;298 source/ownership decision remains blocked');return row;}
function fields(input:Record<string,unknown>,keys:readonly string[]){if(Object.keys(input).length!==keys.length||Object.keys(input).some(k=>!keys.includes(k)))throw Error('Exact statistics fields required');}
function binary(value:number):Rational{
 const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,value);const bits=view.getBigUint64(0),e=Number((bits>>52n)&2047n),m=(bits&((1n<<52n)-1n))+(e?1n<<52n:0n),n=bits>>63n?-m:m,p=e?e-1075:-1074;
 return p>=0?rational(n<<BigInt(p)):rational(n,1n<<BigInt(-p));
}
function quartileExact(values:number[],k:number){const s=[...values].sort((a,b)=>a-b),position=k*(s.length-1),i=Math.floor(position/4),r=position%4;return add(multiply(binary(s[i]),rational(BigInt(4-r),4n)),multiply(binary(s[Math.min(i+1,s.length-1)]),rational(BigInt(r),4n)));}
function precision(id:number,input:Record<string,unknown>,actual:number){
 let expected:Rational;
 if(id===296)expected=quartileExact(input.values as number[],input.quartileNumber as number);
 else if(id===297)expected=subtract(quartileExact(input.values as number[],3),quartileExact(input.values as number[],1));
 else expected=(input.outcomes as number[]).reduce((s,x,i)=>add(s,multiply(binary(x),binary((input.probabilities as number[])[i]))),rational(0n));
 const n=BigInt(expected.numerator),d=BigInt(expected.denominator),a=binary(actual),an=BigInt(a.numerator),ad=BigInt(a.denominator),abs=(x:bigint)=>x<0n?-x:x;
 if(n===0n?an!==0n:abs(an*d-n*ad)*(1n<<40n)>abs(n*ad))throw Error('Capture precision/cancellation guard failed; immutable historical output remains unchanged');
}
export function statisticsWorkflows(id:number){
 const c=statisticsContract(id),identity={catalogId:id,engineId:c.engineId,calculatorSlug:c.slug,calculatorVersion:c.version,sourceVersion:`${statisticsCaptureRevision}/${c.engineId}@${c.version}`};
 const metadata:ScopedEngineeringMetadata={schemaVersion:1,identity,scope:c.scope,primaryKey:c.primaryKey,fields:c.fields.map(({key,label,unit})=>({key,label,unit})),outputs:Object.fromEntries(Object.entries(c.engine.examples[0].expected).filter(([,v])=>typeof v==='number').map(([key])=>[key,{label:key,unit:['count','position','quartileNumber'].includes(key)?'index/count':c.unit}])),sourceEvidence:[c.publisher,'docs/worker2-statistics-b-20261117/SOURCES.md'],publisherSources:[c.publisher],limitations:c.limitations,authority:'Private engineering scope only; not canonical, certification or publication approval.'};
 return createFactoryWorkflows({identity,scopedMetadata:metadata,execute(raw:FactoryRaw){
  fields(raw,c.fields.map(f=>f.key));
  const input=Object.fromEntries(c.fields.map(f=>{const value=f.key==='quartileNumber'?requiredCalculatorNumber(raw[f.key]):parseFinalPrivateSnapshotText(raw[f.key]);if(f.key!=='quartileNumber'&&(!Array.isArray(value)||value.some(x=>typeof x!=='number')))throw Error('Explicit numeric JSON arrays required');return[f.key,value];}));
  const numbers=Object.values(input).flatMap(v=>Array.isArray(v)?v:[v]);
  if(numbers.some(v=>typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>1e50||(v!==0&&Math.abs(v)<1e-50)))throw Error('Outside bounded statistics capture range');
  const parsed=c.engine.inputSchema.parse(input);
  if(id===299&&(parsed.probabilities as number[]).reduce((s,p)=>s+p,0)!==1)throw Error('Probabilities must sum exactly1 in binary64; no normalization');
  const output=c.engine.calculate(parsed,{}),primary=output[c.primaryKey];
  if(typeof primary!=='number'||!Number.isFinite(primary))throw Error('Finite statistics result required');
  precision(id,parsed,primary);
  // All three graph points (including IQR's displayed Q1/Q3 metrics) must satisfy
  // the same refusal policy. A precise difference can hide bad quartile terms.
  if(id!==299)for(const k of [1,2,3]){
   const qInput={values:parsed.values as number[],quartileNumber:k as 1|2|3};
   precision(296,qInput,quartileCalculator.calculate(qInput,{}).quartile);
  }
  return createCalculationSnapshot({calculatorSlug:c.slug,calculatorVersion:c.version,input:parsed,output});
 }});
}
export function verifyStatisticsPacket(raw:unknown){const p=copyCalculationData({raw},{}).input.raw as FactoryExecutionPacket;if(!p||typeof p.identity?.catalogId!=='number')throw Error('Exact statistics packet required');return statisticsWorkflows(p.identity.catalogId).verify(p);}
export function verifyStatisticsSnapshot(raw:unknown){
 const clean=copyCalculationData({raw},{}).input.raw;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Exact statistics snapshot required');
 const snapshot=createCalculationSnapshot(clean as CalculationSnapshot),c=statisticsContracts.find(c=>c.slug===snapshot.calculatorSlug&&c.version===snapshot.calculatorVersion);if(!c)throw Error('Exact immutable statistics version unavailable');
 fields(snapshot.input,c.fields.map(f=>f.key));const input=c.engine.inputSchema.parse(snapshot.input),output=c.engine.calculate(input,{});
 if(!equalCompletionJson(input,snapshot.input)||!equalCompletionJson(output,snapshot.output))throw Error('Statistics snapshot differs from immutable engine');
 return {catalogId:c.catalogId,engineId:c.engineId,engineVersion:c.version,snapshot};
}
export function prepareStatisticsRecovery(raw:unknown){const result=verifyStatisticsSnapshot(raw),entered=Object.fromEntries(Object.entries(result.snapshot.input).map(([k,v])=>[k,Array.isArray(v)?JSON.stringify(v):String(v)]));try{const packet=statisticsWorkflows(result.catalogId).execute(entered);if(!equalCompletionJson(packet.snapshot,result.snapshot))throw Error('Historical mismatch');return {...result,currentCaptureAvailable:true as const};}catch{return {...result,currentCaptureAvailable:false as const};}}
export function statisticsResult(packet:FactoryExecutionPacket):StructuredCalculationResult{
 const p=verifyStatisticsPacket(packet),c=statisticsContract(p.identity.catalogId!);
 const points=c.catalogId===299?(p.snapshot.input.outcomes as number[]).slice(0,100).map((value,i)=>({x:i+1,y:value*(p.snapshot.input.probabilities as number[])[i]})):[1,2,3].map(k=>({x:'Q'+k,y:quartileCalculator.calculate({values:p.snapshot.input.values as number[],quartileNumber:k as 1|2|3},{}).quartile}));
 return {primaryResult:{id:c.primaryKey,label:c.title.replace(' Calculator',''),value:p.snapshot.output[c.primaryKey] as number,unit:c.unit},metrics:Object.entries(p.snapshot.output).filter(([k,v])=>k!==c.primaryKey&&typeof v==='number').map(([id,value])=>({id,label:id,value:value as number})),series:[{id:'discrete-engine-values',label:c.catalogId===299?'Outcome contributions (first100; full arrays retained in exports)':'Three discrete immutable-engine quartile values',points,unit:c.unit}],methodology:c.scope,sources:[{label:c.publisher,url:c.publisher}],warnings:[...c.limitations,'Discrete graph points are deterministic summaries of supplied data, not fitted distributions, confidence intervals or a continuous accuracy guarantee.']};
}
