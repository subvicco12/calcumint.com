/** Experimental descriptive analysis; historical engines and registered versions remain unchanged. */
import Decimal from 'decimal.js';
import {z} from 'zod';
import {computeDecimalStatistics,type DecimalStatisticsResult} from './decimal-descriptive';
import {boundedData} from './worker-protocol';
export const ADVANCED_STATISTICS_REVISION='decimal50-advanced-exact-rational-v1' as const;
const D=Decimal.clone({precision:100,rounding:Decimal.ROUND_HALF_EVEN,minE:-1000,maxE:1000,toExpNeg:-7,toExpPos:12});
const token=z.string().max(128);
const row=z.object({value:token.nullish(),frequency:token.optional(),missing:z.boolean().optional()}).strict();
const dataset=z.object({mode:z.enum(['population','sample']),encoding:z.enum(['raw','frequency']),rows:z.array(row).min(1).max(10000),missingPolicy:z.enum(['reject','omit']).optional(),unit:z.string().max(40).optional()}).strict();
const analysis=z.discriminatedUnion('kind',[
 z.object({kind:z.literal('scale-sweep'),shift:token}).strict(),
 z.object({kind:z.literal('affine'),scale:token,shift:token}).strict(),
 z.object({kind:z.literal('target-scale'),metric:z.enum(['variance','standardDeviation']),target:token,shift:token}).strict(),
 z.object({kind:z.literal('observation-sweep'),rowIndex:z.number().int().nonnegative(),minimum:token,maximum:token,steps:z.number().int().min(2).max(101)}).strict(),
]);
export const advancedStatisticsInputSchema=z.object({dataset,bins:z.number().int().min(1).max(100).optional(),analysis:analysis.optional()}).strict();
export type AdvancedStatisticsInput=z.infer<typeof advancedStatisticsInputSchema>;
type Fraction={n:bigint;d:bigint};
export type ExactRational={numerator:string;denominator:string;decimal:string};
type ValueRow={index:number;value:string;f:number;x:bigint};
export type AdvancedHistogram={definition:'equal-width-exact-rational-v1';effectiveN:number;requestedBins:number;constant:boolean;finalRightClosed:true;bins:{lower:ExactRational;upper:ExactRational;count:number}[]};
export type AdvancedContribution={index:number;value:string;frequency:number;deviation:ExactRational;squaredDeviation:ExactRational;weightedSquaredDeviation:ExactRational};
type ForwardSummary={mode:'sample'|'population';effectiveN:number;denominator:number;metrics:Record<'sum'|'mean'|'centeredM2'|'variance'|'standardDeviation'|'minimum'|'maximum'|'range',string>};
type TransformProvenance={baseDatasetRetained:true;manualInputCapAppliedToDerived:false;precisionDigits:100;authoritativeRepresentation:'base-plus-transform';approximateScale:boolean};
type DerivedRow={index:number;value:string;frequency:number};
type AffineAnalysis={kind:'affine';scale:string;shift:string;forward:ForwardSummary;derivedRows:DerivedRow[];provenance:TransformProvenance};
type TargetAnalysis={kind:'target-scale';metric:'variance'|'standardDeviation';target:string;scale:string;shift:string;branch:'nonnegative';signedAbsoluteResidual:string;relativeResidual:string;forward:ForwardSummary;derivedRows:DerivedRow[];provenance:TransformProvenance};
type ScaleSweepAnalysis={kind:'scale-sweep';shift:string;points:({status:'finite';scale:string;forward:ForwardSummary}|{status:'precision-unavailable';scale:string;message:string})[]};
type SweepAnalysis={kind:'observation-sweep';rowIndex:number;replacementScope:'single-raw-observation'|'single-effective-observation-from-frequency-row';fixedMode:'sample'|'population';points:({status:'finite';value:string;exactReplacement:ExactRational;metrics:ForwardSummary['metrics']}|{status:'precision-unavailable';value:string;exactReplacement:ExactRational;message:string})[];interpretation:'Deterministic fixed-dataset scenarios, not uncertainty or causal confidence.'};
export type AdvancedStatisticsFinite={status:'finite';revision:typeof ADVANCED_STATISTICS_REVISION;summary:DecimalStatisticsResult;histogram:AdvancedHistogram;contributions:AdvancedContribution[];contributionUnits:{deviation:string;squaredDeviation:string};analysis:AffineAnalysis|TargetAnalysis|SweepAnalysis|ScaleSweepAnalysis|null;limits:{storedRows:10000;effectiveN:10000000;bins:100;sweepRowOperations:100000};warnings:string[]};
export type AdvancedStatisticsResult=AdvancedStatisticsFinite|{status:'domain-error'|'precision-unavailable'|'no-solution'|'underdetermined'|'budget-exhausted';message:string};
class Refusal extends Error{constructor(readonly status:Exclude<AdvancedStatisticsResult['status'],'finite'>,message:string){super(message);}}
function refuse(status:Exclude<AdvancedStatisticsResult['status'],'finite'>,message:string):never{throw new Refusal(status,message);}
const abs=(x:bigint)=>x<0n?-x:x;
function gcd(a:bigint,b:bigint):bigint{a=abs(a);while(b){const t=a%b;a=b;b=t;}return a||1n;}
function fraction(n:bigint,d=1n):Fraction{if(d===0n)throw Error('Zero denominator');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{n:n/g,d:d/g};}
function add(a:Fraction,b:Fraction){return fraction(a.n*b.d+b.n*a.d,a.d*b.d);}
function multiply(a:Fraction,b:Fraction){return fraction(a.n*b.n,a.d*b.d);}
function asDecimal(f:Fraction){return f.n===0n?'0':new D(f.n.toString()).div(f.d.toString()).toString();}
function publicFraction(f:Fraction):ExactRational{const r=fraction(f.n,f.d);return{numerator:r.n.toString(),denominator:r.d.toString(),decimal:asDecimal(r)};}
function parseExact(value:string):Fraction{
 if(value.length>2048||!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value))throw Error('Invalid derived decimal');
 const [m,e='0']=value.toLowerCase().split('e'),s=m.startsWith('-')?-1n:1n,[w,f='']=m.replace(/^[+-]/,'').split('.');
 const exponent=Number(e)-f.length;if(!Number.isSafeInteger(exponent)||Math.abs(exponent)>1000)throw Error('Derived decimal exponent budget');
 const n=BigInt((w||'0')+f)*s;
 return exponent>=0?fraction(n*10n**BigInt(exponent)):fraction(n,10n**BigInt(-exponent));
}
function exactDecimal(value:Fraction):string{
 const r=fraction(value.n,value.d);if(r.n===0n)return'0';let denominator=r.d,twos=0,fives=0;
 while(denominator%2n===0n){denominator/=2n;twos++;}while(denominator%5n===0n){denominator/=5n;fives++;}
 if(denominator!==1n)throw Error('Nonterminating derived observation');
 const places=Math.max(twos,fives),n=r.n*2n**BigInt(places-twos)*5n**BigInt(places-fives);
 if(places>1000)refuse('precision-unavailable','Derived observation exceeds exact decimal structural envelope');
 const digits=abs(n).toString().padStart(places+1,'0');
 const result=places?`${digits.slice(0,-places)}.${digits.slice(-places)}`.replace(/0+$/,'').replace(/\.$/,''):digits;
 return(n<0n?'-':'')+result;
}
function userScalar(text:string,name:string,nonnegative=false):{raw:string;fraction:Fraction}{
 const result=computeDecimalStatistics({mode:'population',encoding:'raw',rows:[{value:text}]});
 if(result.status!=='finite')refuse('domain-error',`${name}: ${result.message}`);
 const raw=result.rows[0].normalized!,f=parseExact(raw);if(nonnegative&&f.n<0n)refuse('domain-error',`${name} must be nonnegative`);return{raw,fraction:f};
}
const S=10n**133n;
function valueRows(summary:DecimalStatisticsResult):ValueRow[]{return summary.rows.filter(r=>r.disposition==='valid').map(r=>{const f=parseExact(r.normalized!);const n=f.n*S;if(n%f.d!==0n)throw Error('Source lattice mismatch');return{index:r.index,value:r.normalized!,f:r.frequency,x:n/f.d};});}
function histogram(rows:ValueRow[],n:number,k:number):AdvancedHistogram{
 const min=rows.reduce((a,r)=>r.x<a?r.x:a,rows[0].x),max=rows.reduce((a,r)=>r.x>a?r.x:a,rows[0].x);
 if(min===max){const edge=publicFraction(fraction(min,S));return{definition:'equal-width-exact-rational-v1',effectiveN:n,requestedBins:k,constant:true,finalRightClosed:true,bins:[{lower:edge,upper:edge,count:n}]};}
 const width=max-min,counts=Array<number>(k).fill(0);
 for(const r of rows){const bin=r.x===max?k-1:Number((r.x-min)*BigInt(k)/width);counts[bin]+=r.f;}
 const edge=(j:number)=>publicFraction(fraction(min*BigInt(k)+BigInt(j)*width,BigInt(k)*S));
 return{definition:'equal-width-exact-rational-v1',effectiveN:n,requestedBins:k,constant:false,finalRightClosed:true,bins:counts.map((count,j)=>({lower:edge(j),upper:edge(j+1),count}))};
}
function contributionTable(rows:ValueRow[],n:number):AdvancedContribution[]{const N=BigInt(n),sum=rows.reduce((s,r)=>s+r.x*BigInt(r.f),0n);return rows.map(r=>{const delta=N*r.x-sum,square=fraction(delta*delta,N*N*S*S);return{index:r.index,value:r.value,frequency:r.f,deviation:publicFraction(fraction(delta,N*S)),squaredDeviation:publicFraction(square),weightedSquaredDeviation:publicFraction(fraction(square.n*BigInt(r.f),square.d))};});}
/** Derived values never pass through the source-only 34-significant-digit cap. */
function forward(rows:DerivedRow[],mode:'sample'|'population'):ForwardSummary{
 const rational=rows.map(r=>({...r,q:parseExact(r.value)}));
 let lattice=1n;for(const r of rational)while(lattice%r.q.d!==0n)lattice*=10n;
 const values=rational.map(r=>({...r,x:r.q.n*(lattice/r.q.d)})),n=values.reduce((s,r)=>s+r.frequency,0),N=BigInt(n),den=mode==='sample'?n-1:n;
 let sum=0n,squares=0n,min=values[0].x,max=min;
 for(const r of values){sum+=r.x*BigInt(r.frequency);squares+=r.x*r.x*BigInt(r.frequency);if(r.x<min)min=r.x;if(r.x>max)max=r.x;}
 const m2=N*squares-sum*sum;if(m2<0n||den<1)throw Error('Invalid exact forward moments');
 const variance=asDecimal(fraction(m2,N*BigInt(den)*lattice*lattice));
 return{mode,effectiveN:n,denominator:den,metrics:{sum:exactDecimal(fraction(sum,lattice)),mean:asDecimal(fraction(sum,N*lattice)),centeredM2:asDecimal(fraction(m2,N*lattice*lattice)),variance,standardDeviation:new D(variance).sqrt().toString(),minimum:exactDecimal(fraction(min,lattice)),maximum:exactDecimal(fraction(max,lattice)),range:exactDecimal(fraction(max-min,lattice))}};
}
function transformRows(rows:ValueRow[],scale:Fraction,shift:Fraction):DerivedRow[]{return rows.map(r=>{const value=exactDecimal(add(multiply(fraction(r.x,S),scale),shift));const decimal=new D(value);if(!decimal.isZero()&&(decimal.e < -100||decimal.e>100))refuse('precision-unavailable','Transformed observation exceeds adjusted-exponent -100..100 envelope; base inputs retained');return{index:r.index,value,frequency:r.f};});}
const provenance=(approximateScale:boolean):TransformProvenance=>({baseDatasetRetained:true,manualInputCapAppliedToDerived:false,precisionDigits:100,authoritativeRepresentation:'base-plus-transform',approximateScale});
function runAnalysis(input:AdvancedStatisticsInput,summary:DecimalStatisticsResult,rows:ValueRow[]):AdvancedStatisticsFinite['analysis']{
 const a=input.analysis;if(!a)return null;
 if(a.kind==='observation-sweep'){
  const selected=rows.find(r=>r.index===a.rowIndex);if(!selected)refuse('domain-error','Selected sweep row is absent, omitted, or zero-frequency');
  if(rows.length*a.steps>100000)refuse('budget-exhausted','Sweep exceeds 100000 stored-row operations; reduce steps or stored rows');
  const low=userScalar(a.minimum,'Sweep minimum').fraction,high=userScalar(a.maximum,'Sweep maximum').fraction;
  if(low.n*high.d>high.n*low.d)refuse('domain-error','Sweep minimum must not exceed maximum');
  const width=add(high,{n:-low.n,d:low.d}),points=[];
  for(let i=0;i<a.steps;i++){
   const q=add(low,multiply(width,fraction(BigInt(i),BigInt(a.steps-1)))),qString=asDecimal(q);
   const derived=rows.flatMap(r=>r.index===a.rowIndex?[...(r.f>1?[{index:r.index,value:r.value,frequency:r.f-1}]:[]),{index:r.index,value:qString,frequency:1}]:[{index:r.index,value:r.value,frequency:r.f}]);
   if(new D(qString).isZero()||(new D(qString).e>=-100&&new D(qString).e<=100))points.push({status:'finite' as const,value:qString,exactReplacement:publicFraction(q),metrics:forward(derived,input.dataset.mode).metrics});
   else points.push({status:'precision-unavailable' as const,value:qString,exactReplacement:publicFraction(q),message:'Derived replacement outside adjusted-exponent -100..100 envelope'});
  }
  return{kind:'observation-sweep',rowIndex:a.rowIndex,replacementScope:input.dataset.encoding==='frequency'?'single-effective-observation-from-frequency-row':'single-raw-observation',fixedMode:input.dataset.mode,points,interpretation:'Deterministic fixed-dataset scenarios, not uncertainty or causal confidence.'};
 }
 const shift=userScalar(a.shift,'Shift');
 if(a.kind==='scale-sweep'){
  const points:ScaleSweepAnalysis['points']=[];
  for(const scale of ['0','0.5','1','1.5','2']){try{const derived=transformRows(rows,parseExact(scale),shift.fraction);points.push({status:'finite',scale,forward:forward(derived,input.dataset.mode)});}catch(error){if(error instanceof Refusal&&error.status==='precision-unavailable')points.push({status:'precision-unavailable',scale,message:error.message});else throw error;}}
  return{kind:'scale-sweep',shift:shift.raw,points};
 }
 if(a.kind==='affine'){
  const scale=userScalar(a.scale,'Scale'),derivedRows=transformRows(rows,scale.fraction,shift.fraction);
  return{kind:'affine',scale:scale.raw,shift:shift.raw,forward:forward(derivedRows,input.dataset.mode),derivedRows,provenance:provenance(false)};
 }
 const target=userScalar(a.target,'Target',true),base=new D(summary.metrics[a.metric]),goal=new D(target.raw);
 if(base.isZero())refuse(goal.isZero()?'underdetermined':'no-solution',goal.isZero()?'A constant baseline and zero target admit infinitely many nonnegative scales':'A constant baseline cannot reach positive dispersion by affine scaling');
 const scale=goal.isZero()?new D(0):a.metric==='variance'?goal.div(base).sqrt():goal.div(base);
 if(!scale.isFinite())refuse('precision-unavailable','Scale computation exceeded decimal envelope');
 const derivedRows=transformRows(rows,parseExact(scale.toString()),shift.fraction),result=forward(derivedRows,input.dataset.mode),achieved=new D(result.metrics[a.metric]);
 const signed=achieved.minus(goal),relative=goal.isZero()?new D(0):signed.div(goal);
 if(goal.isZero()?!achieved.isZero():relative.abs().gt('1e-40'))refuse('precision-unavailable','Forward target residual exceeds the 1e-40 relative budget');
 return{kind:'target-scale',metric:a.metric,target:target.raw,scale:scale.toString(),shift:shift.raw,branch:'nonnegative',signedAbsoluteResidual:signed.toString(),relativeResidual:relative.toString(),forward:result,derivedRows,provenance:provenance(!scale.isZero())};
}
/** Bounded synchronous kernel for off-main-thread callers; no p95/mobile performance claim. */
export function calculateAdvancedStatistics(value:unknown):AdvancedStatisticsResult{
 try{
  const input=advancedStatisticsInputSchema.parse(boundedData(value)),summary=computeDecimalStatistics({...input.dataset,rows:input.dataset.rows.map(r=>({...r,value:r.value}))});
  if(summary.status!=='finite')refuse('domain-error',`${summary.code}: ${summary.message}`);
  const rows=valueRows(summary),k=input.bins??Math.min(20,Math.ceil(Math.sqrt(summary.counts.effectiveN))),analysis=runAnalysis(input,summary,rows);
  return{status:'finite',revision:ADVANCED_STATISTICS_REVISION,summary,histogram:histogram(rows,summary.counts.effectiveN,k),contributions:contributionTable(rows,summary.counts.effectiveN),contributionUnits:{deviation:summary.unit,squaredDeviation:summary.unit?`${summary.unit}^2`:''},analysis,limits:{storedRows:10000,effectiveN:10000000,bins:100,sweepRowOperations:100000},warnings:['Private experimental advanced statistics; no canonical, qualified-review or publication acceptance.','Histogram binning is descriptive presentation and does not establish normality or representativeness.','Contribution decimals are display approximations; rational numerators/denominators reconcile without last-row adjustment.','Transform/target outputs are derived scenario summaries; full advanced export/report/physical-device acceptance remains separate.','Nonterminating sensitivity replacements retain exact rational points; forward auxiliary observations use100significant digits, not manual34digit truncation.']};
 }catch(error){return error instanceof Refusal?{status:error.status,message:error.message}:{status:'domain-error',message:'Invalid or unsupported bounded advanced statistics input'};}
}
