import {z} from 'zod';
import Decimal from 'decimal.js';
import type {RoundingMode} from '../../calculators/precision';
import {loanPaymentCalculator} from '../../calculators/finance/loan-payment';
import {compoundInterestCalculator} from '../../calculators/finance/compound-interest';
import {rational} from '../../calculators/exact-rational';
import {createCalculationSnapshot,type CalculationSnapshot} from '../calculation-snapshot';
import {parsePublicationFactoryInput} from '../publication-factory-contracts-input';
import {sameRecordedJson} from '../recorded-json-equality';
import {replayFinancialSuccessorSnapshot} from './exact-grid-private';

/** Proposed private methodology, not a registered mathematical version or approval. */
export const privateFinancialDecimalRevision='private-financial-decimal-rounding-20261108.1';
export const privateFinancialDecimalContract='shortest-roundtrip-decimal/exact-rational-cent-verification/half-away-from-zero';

/**
 * Round the shortest decimal spelling of a finite binary64 result. Existing
 * 1.005 -> 1.01 examples are retained without a magnitude-dependent epsilon.
 * This explicitly differs from rounding the exact binary rational. Financial
 * review must accept the interpretation before any canonical adoption.
 */
export function roundFinancialDecimalCandidate(value:number,digits=2,mode:RoundingMode='half-away-from-zero'):number{
 if(!Number.isFinite(value))throw new RangeError('Cannot round a non-finite number');
 if(!Number.isInteger(digits)||digits<0||digits>12)throw new RangeError('digits must be an integer between 0 and 12');
 if(!['half-away-from-zero','floor','ceil','truncate'].includes(mode))throw new RangeError('Unknown rounding mode');
 if(value===0)return 0;
 const negative=value<0;
 const [mantissa,exponent='0']=Math.abs(value).toString().split('e');
 const [whole,fraction='']=mantissa.split('.');
 const coefficient=BigInt(whole+fraction),shift=Number(exponent)-fraction.length+digits;
 if(shift>=0)return value;
 const divisor=10n**BigInt(-shift),remainder=coefficient%divisor;
 let rounded=coefficient/divisor;
 if((mode==='half-away-from-zero'&&remainder*2n>=divisor)||
    (mode==='floor'&&negative&&remainder!==0n)||
    (mode==='ceil'&&!negative&&remainder!==0n))rounded++;
 const raw=rounded.toString().padStart(digits+1,'0');
 const decimal=digits===0?raw:raw.slice(0,-digits)+'.'+raw.slice(-digits);
 const result=Number((negative?'-':'')+decimal);
 if(!Number.isFinite(result))throw new RangeError('Rounding exceeds supported numeric range');
 return result===0?0:result;
}

type Fraction=Readonly<{n:bigint;d:bigint}>;
function fraction(n:bigint,d=1n):Fraction{
 const normalized=rational(n,d);
 return {n:BigInt(normalized.numerator),d:BigInt(normalized.denominator)};
}
function decimalFraction(value:number):Fraction{
 if(!Number.isFinite(value))throw new RangeError('Finite decimal input required');
 const [mantissa,exponent='0']=value.toString().split('e');
 const [whole,tail='']=mantissa.split('.'),shift=Number(exponent)-tail.length;
 const coefficient=BigInt(whole+tail);
 return shift>=0?fraction(coefficient*10n**BigInt(shift)):fraction(coefficient,10n**BigInt(-shift));
}
const maximum=decimalFraction(Number.MAX_VALUE);
const maximumCents=maximum.n*100n/maximum.d;
function fromCents(cents:bigint,label:string){
 const negative=cents<0n,absolute=negative?-cents:cents;
 if(absolute>maximumCents)throw new RangeError(label+' exceeds supported numeric range');
 const raw=absolute.toString().padStart(3,'0');
 const value=Number((negative?'-':'')+raw.slice(0,-2)+'.'+raw.slice(-2));
 const output=decimalFraction(value);
 if(output.n*100n!==cents*output.d)throw new RangeError(label+' cannot preserve decimal precision');
 return {cents,value:value===0?0:value};
}
function money(numerator:bigint,denominator:bigint,label:string){
 if(denominator<=0n)throw new RangeError('Positive financial denominator required');
 const negative=numerator<0n,scaled=(negative?-numerator:numerator)*100n;
 let cents=scaled/denominator;
 if((scaled%denominator)*2n>=denominator)cents++;
 return fromCents(negative?-cents:cents,label);
}
// Computational qualification bound, not a commercial or financial limit.
// Checked before every power; unproved work never produces a capture.
const maximumPowerWorkBits=4_000_000n;
function checkPowers(terms:readonly (readonly [bigint,bigint])[]){
 let work=0n;
 for(const [base,power] of terms){
  if(power<0n||base<0n)throw new RangeError('Nonnegative exact powers required');
  work+=BigInt(base.toString(2).length)*power;
  if(work>maximumPowerWorkBits)throw new RangeError('Exact financial qualification work bound exceeded');
 }
}
// Decimal is only a cent-candidate estimator for rational exponents. Exact
// rational half-cent inequalities decide acceptance, never an epsilon.
const FinancialDecimal=Decimal.clone({precision:768,rounding:Decimal.ROUND_HALF_UP});
function fractionalCompound(p:Fraction,base:Fraction,period:Fraction){
 const terms=[[p.n,period.d],[p.d,period.d],[base.n,period.n],[base.d,period.n]] as const;
 checkPowers(terms);
 const approximate=new FinancialDecimal(p.n.toString()).div(p.d.toString())
  .times(new FinancialDecimal(base.n.toString()).div(base.d.toString())
   .pow(new FinancialDecimal(period.n.toString()).div(period.d.toString())));
 if(!approximate.isFinite())throw new RangeError('Future value exceeds supported numeric range');
 let cents=BigInt(approximate.times(100).toDecimalPlaces(0,Decimal.ROUND_HALF_UP).toFixed(0));
 if(cents>maximumCents)throw new RangeError('Future value exceeds supported numeric range');
 const leftN=p.n**period.d*base.n**period.n,leftD=p.d**period.d*base.d**period.n;
 const compare=(threshold:bigint)=>{
  if(threshold<=0n)return 1;
  checkPowers([...terms,[threshold,period.d],[200n,period.d]]);
  const left=leftN*200n**period.d,right=leftD*threshold**period.d;
  return left<right?-1:left>right?1:0;
 };
 for(let adjustment=0;adjustment<3;adjustment++){
  if(compare(2n*cents-1n)<0){cents--;continue;}
  if(compare(2n*cents+1n)>=0){cents++;continue;}
  return fromCents(cents,'Future value');
 }
 throw new RangeError('Fractional-period cent result cannot be qualified');
}

export const loanPaymentDecimalSuccessor=Object.freeze({
 id:'finance.loan-payment.decimal-rounding-private',slug:'loan-payment-decimal-rounding-private',
 originalEngineId:loanPaymentCalculator.id,originalEngineVersion:1,allocatedSuccessorVersion:null,
 inputSchema:loanPaymentCalculator.inputSchema,
 calculate(input:unknown){
  const {principal,annualRatePercent,termMonths}=loanPaymentCalculator.inputSchema.parse(input);
  const p=decimalFraction(principal),annual=decimalFraction(annualRatePercent);
  const rate=fraction(annual.n,annual.d*1200n),period=BigInt(termMonths);
  let monthly;
  if(rate.n===0n)monthly=money(p.n,p.d*period,'Loan payment');
  else{
   const base=rate.d+rate.n;
   checkPowers([[base,period],[rate.d,period]]);
   const growth=base**period,old=rate.d**period;
   monthly=money(p.n*rate.n*growth,p.d*rate.d*(growth-old),'Loan payment');
  }
  const total=fromCents(monthly.cents*period,'Total loan payment');
  return {monthlyPayment:monthly.value,totalPayment:total.value,totalInterest:money(total.cents*p.d-p.n*100n,100n*p.d,'Total loan interest').value};
 }
});

export const compoundInterestDecimalSuccessor=Object.freeze({
 id:'finance.compound-interest.decimal-rounding-private',slug:'compound-interest-decimal-rounding-private',
 originalEngineId:compoundInterestCalculator.id,originalEngineVersion:1,allocatedSuccessorVersion:null,
 inputSchema:compoundInterestCalculator.inputSchema,
 calculate(input:unknown){
  const {principal,annualRatePercent,years,compoundsPerYear}=compoundInterestCalculator.inputSchema.parse(input);
  const p=decimalFraction(principal),annual=decimalFraction(annualRatePercent),time=decimalFraction(years);
  const rate=fraction(annual.n,annual.d*100n*BigInt(compoundsPerYear));
  if(rate.n<=-rate.d)throw new RangeError('Periodic rate must be greater than -100%');
  const base=fraction(rate.d+rate.n,rate.d),period=fraction(time.n*BigInt(compoundsPerYear),time.d);
  let future;
  if(p.n===0n||period.n===0n||rate.n===0n)future=money(p.n,p.d,'Future value');
  else if(period.d===1n){
   checkPowers([[base.n,period.n],[base.d,period.n]]);
   future=money(p.n*base.n**period.n,p.d*base.d**period.n,'Future value');
  }else future=fractionalCompound(p,base,period);
  return {futureValue:future.value,totalInterest:money(future.cents*p.d-p.n*100n,100n*p.d,'Total interest').value};
 }
});

const successors=[loanPaymentDecimalSuccessor,compoundInterestDecimalSuccessor] as const;
export type FinancialDecimalSuccessorId=(typeof successors)[number]['id'];
export type PrivateFinancialDecimalArtifact=Readonly<{
 transportVersion:1;implementationRevision:typeof privateFinancialDecimalRevision;
 roundingContract:typeof privateFinancialDecimalContract;
 baselineEngineId:string;baselineEngineVersion:1;snapshot:CalculationSnapshot;
}>;

export function createFinancialDecimalSnapshot(id:FinancialDecimalSuccessorId,input:unknown):PrivateFinancialDecimalArtifact{
 const engine=successors.find(row=>row.id===id);
 if(!engine)throw new Error('Unknown private financial decimal successor');
 const parsed=engine.inputSchema.parse(input);
 return Object.freeze({transportVersion:1,implementationRevision:privateFinancialDecimalRevision,roundingContract:privateFinancialDecimalContract,
  baselineEngineId:engine.originalEngineId,baselineEngineVersion:1,
  // calculatorVersion=1 identifies private transport shape, not a version allocation.
  snapshot:createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:1,input:parsed,output:engine.calculate(parsed)})});
}

export function replayFinancialDecimalSnapshot(text:string):PrivateFinancialDecimalArtifact{
 if(text.length>2_000_000)throw new Error('Financial snapshot size bound');
 const envelope=z.object({transportVersion:z.literal(1),implementationRevision:z.literal(privateFinancialDecimalRevision),roundingContract:z.literal(privateFinancialDecimalContract),baselineEngineId:z.string(),baselineEngineVersion:z.literal(1),snapshot:z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict()}).strict().parse(parsePublicationFactoryInput(text));
 const engine=successors.find(row=>row.slug===envelope.snapshot.calculatorSlug);
 if(!engine)throw new Error('Unknown private financial decimal successor');
 const expected=createFinancialDecimalSnapshot(engine.id,envelope.snapshot.input);
 if(!sameRecordedJson(expected,envelope))throw new Error('Financial decimal snapshot input/output mismatch');
 return expected;
}

export function exportFinancialDecimalSnapshot(artifact:PrivateFinancialDecimalArtifact):string{
 return JSON.stringify(replayFinancialDecimalSnapshot(JSON.stringify(artifact)),null,2);
}

/** Read-only comparison. Never rewrites, relabels or adopts the old capture. */
export function previewFinancialDecimalAdoption(text:string){
 const source=replayFinancialSuccessorSnapshot(text);
 const engine=successors.find(row=>row.originalEngineId===source.baselineEngineId);
 if(!engine)throw new Error('Unknown predecessor financial engine');
 const candidate=createFinancialDecimalSnapshot(engine.id,source.snapshot.input);
 return Object.freeze({source,candidate,outputChanged:!sameRecordedJson(source.snapshot.output,candidate.snapshot.output),adoptionAuthorized:false,allocatedSuccessorVersion:null});
}
