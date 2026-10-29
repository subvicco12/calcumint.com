import {describe,expect,it} from 'vitest';
import {runCalculator} from './engine';
import {financialContracts,financialExamples,exportFinancialContract,importFinancialContract} from './financial-contracts';

const loan={openingDebt:600,steps:[{rate:0.1,payment:200},{rate:0.1,payment:200}]};
const b={currency:'USD',period:'month',scope:'supplied-cashflows-no-tax',discountRate:0};
const purchase={price:1000,upfrontCosts:50,loan,periodCosts:[10,20],terminalValue:1200,sellingCosts:60};
const rental={price:1000,upfrontCosts:50,loan,terminalValue:1200,sellingCosts:60,periods:[{scheduledRent:200,uncollectedRent:20,operatingCosts:30,capex:10,reserveContribution:20},{scheduledRent:300,uncollectedRent:0,operatingCosts:40,capex:0,reserveContribution:30}]};
const inputs:Record<number,unknown>={
 21:{...b,existingLoans:[{openingDebt:600,steps:[{rate:0.1,payment:100}]},{openingDebt:400,steps:[{rate:0.1,payment:100}]}],consolidatedLoan:{openingDebt:1050,steps:[{rate:0,payment:200}]},financedFee:50,upfrontFee:10},
 32:{...b,purchase,rentUpfront:20,rentPayments:[250,250],rentRefund:10},
 36:{...b,rental},43:{...b,rental},49:{...b,rental},
 46:{...b,purchase,rehabilitationCosts:[100,0]},
 468:{...b,purchase,availableUpfrontCash:450,periodBudget:200},
 470:{...b,purchase,leaseUpfront:20,leasePayments:[150,150],leaseEndCharges:30},
 472:{...b,purchase,cashUpfrontCosts:50},
};
const id=(n:number)=>`private.financial.${n}`;
const calc=(n:number,input=inputs[n]):Record<string,unknown>=>runCalculator(financialContracts.find(d=>d.id===id(n))!,input).output;

describe('explicit private financial contracts',()=>{
 it('debt consolidation includes capitalized fee and unequal terminal debt exactly once',()=>{
  expect(calc(21)).toMatchObject({existing:{terminalDebt:900,totalPayments:200},consolidated:{terminalDebt:850,totalPayments:200},comparison:{left:1100,right:1060,difference:40}});
 });
 it('rent/buy compares same horizon and sale equity with no duplicate down payment',()=>{
  expect(calc(32)).toMatchObject({purchase:{initialEquityCash:450,terminalEquity:834,totalInterest:106,terminalDebt:306},comparison:{left:510,right:46,difference:464}});
 });
 it('rental NOI excludes debt service, capex and reserve transfers',()=>{
  expect(calc(36)).toMatchObject({totalNoi:410,totalDebtService:400,totalCapex:10,terminalReserves:50,totalOwnerCashflow:-50,terminalEquity:884});
 });
 it('ROI denominator includes interim owner injections and numerator reconciles distributions',()=>{
  const out=calc(43);
  expect(out).toMatchObject({totalContributions:530,totalDistributions:914,profit:384});
  expect(out.totalReturnPercent).toBeCloseTo(72.45283018867924,10);
 });
 it('flip profit includes rehab and all financing costs once',()=>expect(calc(46)).toMatchObject({profit:-146,rehabilitationTotal:100,purchase:{totalInterest:106}}));
 it('combined mortgage/rental exposes interest, principal and remaining debt',()=>{
  expect(calc(49)).toMatchObject({totalInterest:106,totalPrincipalRepaid:294,terminalDebt:306,terminalEquity:884});
 });
 it('car affordability uses the supplied budget and exposes a deficit',()=>{
  expect(calc(468)).toMatchObject({withinSuppliedBudget:false,upfrontShortfall:0,maxPeriodShortfall:20,firstOverBudgetPeriod:1});
  expect(calc(468,{...inputs[468] as object,periodBudget:220})).toMatchObject({withinSuppliedBudget:true,firstOverBudgetPeriod:null});
 });
 it('lease/buy accepts disclosed lease charges without deriving a money factor',()=>expect(calc(470)).toMatchObject({comparison:{left:350,right:46,difference:304}}));
 it('loan/cash difference is financing interest when other costs and sale assumptions match',()=>expect(calc(472)).toMatchObject({comparison:{left:46,right:-60,difference:106}}));
 it('caps final requested payment and retains negative amortization',()=>{
  const p={...purchase,loan:{openingDebt:600,steps:[{rate:0.1,payment:20},{rate:0,payment:1000}]}};
  expect(calc(472,{...b,purchase:p,cashUpfrontCosts:50})).toMatchObject({purchase:{terminalDebt:0,totalPayments:660,totalInterest:60,financingRows:[{at:1,interest:60,payment:20,closingDebt:640,principalRepaid:-40},{at:2,interest:0,payment:640,closingDebt:0,principalRepaid:640}]}});
 });
 it('negative exit equity becomes an owner contribution in the ROI denominator',()=>{
  const r={...rental,terminalValue:0,sellingCosts:0,periods:rental.periods.map(p=>({...p,scheduledRent:0,uncollectedRent:0,operatingCosts:0,capex:0,reserveContribution:0}))};
  expect(calc(43,{...b,rental:r})).toMatchObject({totalContributions:1156,totalDistributions:0,profit:-1156,totalReturnPercent:-100});
 });
 it('zero investment produces null return, not infinite or fabricated ROI',()=>{
  expect(calc(43,{...b,rental:{price:0,upfrontCosts:0,loan:{openingDebt:0,steps:[]},terminalValue:0,sellingCosts:0,periods:[]}})).toMatchObject({totalReturnPercent:null,profit:0});
 });
 it('rejects mismatched horizons and unexplained financed principal',()=>{
  expect(()=>calc(32,{...inputs[32] as object,rentPayments:[250]})).toThrow();
  expect(()=>calc(472,{...b,purchase:{...purchase,periodCosts:[]},cashUpfrontCosts:50})).toThrow();
  expect(()=>calc(21,{...inputs[21] as object,financedFee:49})).toThrow();
 });
 it('rejects rent losses greater than scheduled rent',()=>expect(()=>calc(36,{...b,rental:{...rental,periods:[{...rental.periods[0],uncollectedRent:201},rental.periods[1]]}})).toThrow());
 it.each([NaN,Infinity,-1,1e13])('rejects unsupported money value %s',price=>expect(()=>calc(472,{...b,purchase:{...purchase,price},cashUpfrontCosts:50})).toThrow());
 it('rejects inferred policy inputs, invalid rate bounds and excessive horizons',()=>{
  expect(()=>calc(472,{...inputs[472] as object,taxRate:0})).toThrow();
  expect(()=>calc(472,{...b,purchase:{...purchase,loan:{...loan,steps:[{rate:-0.01,payment:0},{rate:0,payment:0}]}},cashUpfrontCosts:50})).toThrow();
  expect(()=>calc(472,{...b,purchase:{...purchase,loan:{...loan,steps:Array.from({length:601},()=>({rate:0,payment:0}))}},cashUpfrontCosts:50})).toThrow();
 });
 it('preserves tiny cashflow cancellation instead of losing the small cost',()=>{
  expect(calc(472,{...b,purchase:{price:1e12,upfrontCosts:0.001,loan:{openingDebt:0,steps:[]},periodCosts:[],terminalValue:1e12,sellingCosts:0},cashUpfrontCosts:0.001})).toMatchObject({comparison:{difference:0}});
 });
 it.each(Object.keys(inputs).map(Number))('complete #%i examples execute with plan parity and immutable replay',n=>{
  const actual=exportFinancialContract(id(n),inputs[n],'free');
  expect(exportFinancialContract(id(n),inputs[n],'pro')).toEqual(actual);
  expect(exportFinancialContract(id(n),inputs[n],'business')).toEqual(actual);
  expect(importFinancialContract(JSON.parse(JSON.stringify(actual)))).toEqual(actual);
  expect(Object.isFrozen(actual.calculation.input)).toBe(true);
  expect(Object.isFrozen(actual.calculation.output)).toBe(true);
  expect(Object.isFrozen(actual.sources)).toBe(true);
  expect(financialExamples[id(n)]).toBeDefined();
 });
 it.each(['output','input','identity','version','dependency','source','extra'])('rejects replay tampering: %s',kind=>{
  const s=JSON.parse(JSON.stringify(exportFinancialContract(id(472),inputs[472])));
  if(kind==='output')s.calculation.output.comparison.difference=0;
  if(kind==='input')s.calculation.input.discountRate=0.1;
  if(kind==='identity')s.profileId=id(32);
  if(kind==='version')s.calculation.calculatorVersion=2;
  if(kind==='dependency')s.dependency.version=2;
  if(kind==='source')s.sources[0].sha256='0'.repeat(64);
  if(kind==='extra')s.approved=true;
  expect(()=>importFinancialContract(s)).toThrow();
 });
});
