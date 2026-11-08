import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {roundFinancialDecimalCandidate as round} from './decimal-rounding-private';
import {compoundInterestDecimalSuccessor as compound,loanPaymentDecimalSuccessor as loan} from './decimal-rounding-private';
import {createFinancialDecimalSnapshot,exportFinancialDecimalSnapshot,replayFinancialDecimalSnapshot,previewFinancialDecimalAdoption} from './decimal-rounding-private';
import {createFinancialSuccessorSnapshot,exportFinancialSuccessorSnapshot,replayFinancialSuccessorSnapshot,loanPaymentExactGridSuccessor,compoundInterestExactGridSuccessor} from './exact-grid-private';
import {loanPaymentCalculator} from '../../calculators/finance/loan-payment';
import {createCalculationSnapshot} from '../calculation-snapshot';
import {verifyRegisteredSnapshot} from '../registered-snapshot-replay';
import type {RoundingMode} from '../../calculators/precision';
const witness=JSON.parse(readFileSync('docs/acceptance-closure-20261108/financial-rounding-witnesses.json','utf8')) as {cases:{input:string;digits:number;expected:Record<RoundingMode,string>}[]};
describe('proposed decimal financial successor exact rounding qualification',()=>{
 it.each(witness.cases)('independent decimal oracle $input at $digits digits',row=>{
  for(const mode of Object.keys(row.expected) as RoundingMode[])expect(round(Number(row.input),row.digits,mode),mode).toBe(Number(row.expected[mode])===0?0:Number(row.expected[mode]));
 });
 it('does not turn an off-grid zero-period/zero-rate principal into extra interest',()=>{
  const principal=1.0049999999999992;
  expect(compound.calculate({principal,annualRatePercent:0,years:0,compoundsPerYear:1})).toEqual({futureValue:1,totalInterest:0});
  expect(loan.calculate({principal,annualRatePercent:0,termMonths:1})).toEqual({monthlyPayment:1,totalPayment:1,totalInterest:0});
 });
 it('stabilizes the established loan formula at a tiny positive rate',()=>{
  expect(loan.calculate({principal:1000,annualRatePercent:1e-12,termMonths:12})).toEqual({monthlyPayment:83.33,totalPayment:999.96,totalInterest:-0.04});
 });
 it('preserves a zero principal even when the standalone growth factor overflows',()=>{
  expect(compound.calculate({principal:0,annualRatePercent:1000,years:200,compoundsPerYear:365})).toEqual({futureValue:0,totalInterest:0});
 });
 it('keeps explicit existing decimal half-away examples without broad epsilon bias',()=>{
  expect(round(1.005,2)).toBe(1.01);expect(round(-1.005,2)).toBe(-1.01);
  expect(round(1.0049999999999992,2)).toBe(1);expect(round(-1.0049999999999992,2)).toBe(-1);
 });
});

describe('private decimal successor safety and immutable adoption preview',()=>{
 it('matches independent high-precision formula witnesses with explicit comparison bounds',()=>{
  const rows=JSON.parse(readFileSync('docs/acceptance-closure-20261108/financial-rounding-witnesses.json','utf8')).engineCases as {engine:string;input:Record<string,string|number>;expected:Record<string,string>;comparison:string}[];
  for(const row of rows){
   const input=Object.fromEntries(Object.entries(row.input).map(([key,value])=>[key,Number(value)]));
   if(row.comparison.startsWith('reject')){expect(()=>(row.engine==='loan'?loan:compound).calculate(input)).toThrow(/precision/);continue;}
   const actual=(row.engine==='loan'?loan:compound).calculate(input) as Record<string,number>;
   for(const [key,value] of Object.entries(row.expected)){
    const expected=Number(value);
    expect(actual[key],key).toBe(expected===0?0:expected);
   }
  }
 });
 it('rejects invalid inputs and true overflow without blanket scale overflow',()=>{
  for(const value of [Infinity,-Infinity,NaN])expect(()=>round(value)).toThrow(RangeError);
  for(const digits of [-1,13,0.5,NaN,Infinity])expect(()=>round(1,digits)).toThrow(RangeError);
  expect(()=>round(1,2,'unknown' as RoundingMode)).toThrow();
  for(const mode of ['half-away-from-zero','floor','ceil','truncate'] as RoundingMode[]){expect(Object.is(round(-0,2,mode),-0)).toBe(false);expect(round(Number.MAX_VALUE,12,mode)).toBe(Number.MAX_VALUE);}
  for(const change of [{principal:-1},{principal:0},{principal:Infinity},{annualRatePercent:-1},{annualRatePercent:1001},{termMonths:0},{termMonths:1201},{termMonths:1.5}])expect(()=>loan.calculate({principal:1000,annualRatePercent:0,termMonths:12,...change})).toThrow();
  for(const change of [{principal:-1},{principal:NaN},{annualRatePercent:-100},{annualRatePercent:1001},{years:-1},{years:201},{compoundsPerYear:0},{compoundsPerYear:366},{compoundsPerYear:1.5}])expect(()=>compound.calculate({principal:1000,annualRatePercent:0,years:1,compoundsPerYear:12,...change})).toThrow();
  expect(()=>loan.calculate({principal:Number.MAX_VALUE,annualRatePercent:1000,termMonths:1200})).toThrow();
  expect(()=>compound.calculate({principal:Number.MAX_VALUE,annualRatePercent:1000,years:200,compoundsPerYear:365})).toThrow();
  expect(compound.calculate({principal:1e308,annualRatePercent:-50,years:10,compoundsPerYear:1})).toEqual({futureValue:9.765625e304,totalInterest:-9.990234375e307});
 });
});

describe('financial successor explicit revision separation',()=>{
 it('previews adoption without mutating or relabelling either historical private artifact',()=>{
  for(const [legacy,current,input] of [
   [loanPaymentExactGridSuccessor,loan,{principal:1.0049999999999992,annualRatePercent:0,termMonths:1}],
   [compoundInterestExactGridSuccessor,compound,{principal:1.0049999999999992,annualRatePercent:0,years:0,compoundsPerYear:1}]
  ] as const){
   const original=createFinancialSuccessorSnapshot(legacy.id,input),text=exportFinancialSuccessorSnapshot(original);
   const preview=previewFinancialDecimalAdoption(text);
   expect(preview.source).toEqual(original);expect(preview.candidate).toEqual(createFinancialDecimalSnapshot(current.id,input));
   expect(preview.outputChanged).toBe(true);expect(preview.adoptionAuthorized).toBe(false);expect(preview.allocatedSuccessorVersion).toBe(null);
   expect(Object.isFrozen(preview)).toBe(true);expect(exportFinancialSuccessorSnapshot(original)).toBe(text);
   expect(replayFinancialSuccessorSnapshot(text)).toEqual(original);
   const candidateText=exportFinancialDecimalSnapshot(preview.candidate);
   expect(replayFinancialDecimalSnapshot(candidateText)).toEqual(preview.candidate);
   expect(()=>replayFinancialDecimalSnapshot(text)).toThrow();expect(()=>replayFinancialSuccessorSnapshot(candidateText)).toThrow();
  }
 });
 it('exports deeply immutable exact-revision snapshots and refuses policy/identity/output tampering',()=>{
  const input={principal:1000,annualRatePercent:1e-12,termMonths:12};
  const artifact=createFinancialDecimalSnapshot(loan.id,input);input.principal=2;
  expect(Object.isFrozen(artifact)).toBe(true);expect(Object.isFrozen(artifact.snapshot.input)).toBe(true);expect(Object.isFrozen(artifact.snapshot.output)).toBe(true);
  expect(artifact.snapshot.input.principal).toBe(1000);expect(artifact.snapshot.output.monthlyPayment).toBe(83.33);
  const text=exportFinancialDecimalSnapshot(artifact);
  for(const mutate of [
   (r:Record<string,unknown>)=>{r.roundingContract='binary-rational';},
   (r:Record<string,unknown>)=>{r.implementationRevision='latest';},
   (r:Record<string,unknown>)=>{r.baselineEngineVersion=2;},
   (r:Record<string,unknown>)=>{r.baselineEngineId='finance.compound-interest';},
   (r:Record<string,unknown>)=>{(r.snapshot as {output:Record<string,number>}).output.monthlyPayment=83.34;},
   (r:Record<string,unknown>)=>{(r.snapshot as {input:Record<string,number>}).input.unapprovedFee=1;},
   (r:Record<string,unknown>)=>{(r.snapshot as {calculatorSlug:string}).calculatorSlug='loan-payment-calculator';}
  ]){const changed=JSON.parse(text);mutate(changed);expect(()=>replayFinancialDecimalSnapshot(JSON.stringify(changed))).toThrow();}
  expect(()=>replayFinancialDecimalSnapshot(text.replace('"calculatorVersion": 1','"calculatorVersion": 1.0000000000000001'))).toThrow();
  expect(()=>replayFinancialDecimalSnapshot(text.replace('"termMonths": 12','"termMonths": 12.0000000000000001'))).toThrow();
  expect(()=>replayFinancialDecimalSnapshot(text.replace('"principal": 1000','"principal": 1e-999'))).toThrow();
  expect(()=>replayFinancialDecimalSnapshot(JSON.stringify(artifact.snapshot))).toThrow();
  expect(()=>exportFinancialDecimalSnapshot(artifact.snapshot as unknown as typeof artifact)).toThrow();
  expect(()=>replayFinancialDecimalSnapshot(' '.repeat(2_000_001))).toThrow();
 });
});

describe('exact decimal formula half-cent boundaries',()=>{
 it('does not let the one-period loan formula cross a half-cent before rounding',()=>{
  expect(loan.calculate({principal:1.01,annualRatePercent:600,termMonths:1})).toEqual({monthlyPayment:1.52,totalPayment:1.52,totalInterest:0.51});
  expect(loan.calculate({principal:0.29,annualRatePercent:600,termMonths:1})).toEqual({monthlyPayment:0.44,totalPayment:0.44,totalInterest:0.15});
 });
 it('does not let ordinary annual compound arithmetic cross a half-cent',()=>{
  expect(compound.calculate({principal:0.15,annualRatePercent:10,years:1,compoundsPerYear:1})).toEqual({futureValue:0.17,totalInterest:0.02});
 });
 it('refuses an exact rounded amount that cannot be retained by its Number output schema',()=>{
  expect(()=>compound.calculate({principal:1e-300,annualRatePercent:1000,years:100,compoundsPerYear:365})).toThrow(/precision/);
 });
});

describe('recurring-rate exact rational half-cent boundaries',()=>{
 it.each([
  [{principal:0.03,annualRatePercent:200,termMonths:1},{monthlyPayment:0.04,totalPayment:0.04,totalInterest:0.01}],
  [{principal:0.39,annualRatePercent:200,termMonths:2},{monthlyPayment:0.25,totalPayment:0.5,totalInterest:0.11}],
  [{principal:1.17,annualRatePercent:200,termMonths:2},{monthlyPayment:0.74,totalPayment:1.48,totalInterest:0.31}]
 ])('rounds recurring-rate formula at an exact tie', (input,expected)=>{expect(loan.calculate(input)).toEqual(expected);});
});

describe('bounded exact financial domain and explicit refusal',()=>{
 it('keeps subnormal rates without cancellation when the exact cent output is representable',()=>{
  expect(loan.calculate({principal:1e308,annualRatePercent:Number.MIN_VALUE,termMonths:1})).toEqual({monthlyPayment:1e308,totalPayment:1e308,totalInterest:0});
  expect(loan.calculate({principal:1e308,annualRatePercent:Number.MIN_VALUE,termMonths:2})).toEqual({monthlyPayment:5e307,totalPayment:1e308,totalInterest:0});
 });
 it('bounds power work before evaluating pathological input exponents',()=>{
  expect(()=>compound.calculate({principal:1e308,annualRatePercent:Number.MIN_VALUE,years:200,compoundsPerYear:365})).toThrow(/work bound/);
  expect(()=>compound.calculate({principal:1000,annualRatePercent:1000,years:Number.MIN_VALUE,compoundsPerYear:365})).toThrow(/work bound/);
  expect(compound.calculate({principal:0,annualRatePercent:1000,years:Number.MIN_VALUE,compoundsPerYear:365})).toEqual({futureValue:0,totalInterest:0});
 });
 it('proves fractional-period half-cent equality and negative interest exactly',()=>{
  expect(compound.calculate({principal:0.03,annualRatePercent:125,years:0.5,compoundsPerYear:1})).toEqual({futureValue:0.05,totalInterest:0.02});
  expect(compound.calculate({principal:0.15,annualRatePercent:-51,years:0.5,compoundsPerYear:1})).toEqual({futureValue:0.11,totalInterest:-0.04});
 });
 it('does not authorize or rewrite unchanged or unsupported predecessor captures',()=>{
  const input={principal:100000,annualRatePercent:6,termMonths:360};
  const old=exportFinancialSuccessorSnapshot(createFinancialSuccessorSnapshot(loanPaymentExactGridSuccessor.id,input));
  const preview=previewFinancialDecimalAdoption(old);expect(preview.outputChanged).toBe(false);expect(preview.adoptionAuthorized).toBe(false);
  const large=exportFinancialSuccessorSnapshot(createFinancialSuccessorSnapshot(loanPaymentExactGridSuccessor.id,{...input,principal:1e17}));
  expect(()=>previewFinancialDecimalAdoption(large)).toThrow(/precision/);
  expect(exportFinancialSuccessorSnapshot(replayFinancialSuccessorSnapshot(large))).toBe(large);
 });
});

it('keeps registered historical replay exact and refuses private revision relabelling',()=>{
 const input={principal:12000000000000.25,annualRatePercent:0,termMonths:1};
 const historical=createCalculationSnapshot({calculatorSlug:loanPaymentCalculator.slug,calculatorVersion:1,input,output:loanPaymentCalculator.calculate(input,{})});
 expect(historical.output).toEqual({monthlyPayment:12000000000000.26,totalPayment:12000000000000.27,totalInterest:0.02});
 expect(verifyRegisteredSnapshot(historical).snapshot).toEqual(historical);
 const candidate=createFinancialDecimalSnapshot(loan.id,input);
 expect(candidate.snapshot.output).toEqual({monthlyPayment:12000000000000.25,totalPayment:12000000000000.25,totalInterest:0});
 expect(()=>verifyRegisteredSnapshot(candidate.snapshot)).toThrow();
 expect(()=>verifyRegisteredSnapshot({...candidate.snapshot,calculatorSlug:historical.calculatorSlug})).toThrow();
 expect(verifyRegisteredSnapshot(historical).snapshot).toEqual(historical);
});
