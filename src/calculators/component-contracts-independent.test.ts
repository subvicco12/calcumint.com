import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {calculatorRegistry} from './registry';
const run=(slug:string,input:unknown)=>runCalculator(calculatorRegistry.getBySlug(slug)!,input).output;
describe('independent underlying component mathematics',()=>{
 it('fixed monthly amortization uses interest before each capped payment',()=>{
  expect(run('loan-emi-calculator',{principal:210,annualRatePercent:120,termMonths:2,extraMonthlyPayment:0})).toMatchObject({scheduledPayment:121,totalPayment:242,totalInterest:32,payoffMonths:2,amortization:[{payment:121,interest:21,principal:100,balance:110},{payment:121,interest:11,principal:110,balance:0}]});
  expect(run('loan-emi-calculator',{principal:210,annualRatePercent:120,termMonths:2,extraMonthlyPayment:100})).toMatchObject({monthlyPayment:221,totalPayment:232,totalInterest:22,amortization:[{payment:221,balance:10},{payment:11,balance:0}]});
 });
 it('fixed requested payoff caps the final payment',()=>{
  expect(run('credit-card-payoff-calculator',{balance:210,annualAprPercent:120,monthlyPayment:121,extraMonthlyPayment:0})).toMatchObject({payoffMonths:2,totalPaid:242,totalInterest:32,firstMonthInterest:21});
 });
 it('affordability uses caller target, zero-clips payment capacity and preserves the down payment',()=>{
  expect(run('loan-affordability-calculator',{grossMonthlyIncome:1000,existingMonthlyDebt:100,targetDtiPercent:30,annualRatePercent:120,termMonths:2,downPayment:50})).toMatchObject({currentDtiPercent:10,availableMonthlyLoanPayment:200,maximumLoanPrincipal:347.11,maximumPurchasePrice:397.11,modeledPaymentAtMaximumPrincipal:200});
 });
 it('refinance separates lifetime interest savings from simple payment break-even',()=>{
  expect(run('loan-refinance-calculator',{remainingBalance:210,currentAnnualRatePercent:120,currentRemainingMonths:2,newAnnualRatePercent:0,newTermMonths:3,refinanceCosts:5})).toMatchObject({currentMonthlyPayment:121,newMonthlyPayment:70,currentRemainingInterest:32,newLoanInterest:0,grossInterestSavings:32,netLifetimeSavings:27,breakEvenMonths:1});
 });
 it.each([['avalanche',165,15,['A','B']],['snowball',175,25,['B','A']]] as const)('debt %s rolls the original payment budget to remaining balances',(strategy,totalPaid,totalInterest,payoffOrder)=>{
  expect(run('debt-payoff-calculator',{debts:[{name:'A',balance:100,annualRatePercent:120,minimumPayment:0},{name:'B',balance:50,annualRatePercent:0,minimumPayment:0}],extraMonthlyPayment:60,strategy})).toMatchObject({monthsToPayoff:3,totalPaid,totalInterest,payoffOrder});
 });
});

import {componentContracts,componentExamples,exportComponentContract,importComponentContract} from './component-contracts';
const basis={currency:'USD',scope:'supplied-fixed-monthly-no-policy'};
const component=(id:number,input:Record<string,unknown>)=>runCalculator(componentContracts.find(d=>d.id===`private.component.${id}`)!,{...(id<400?basis:{scope:'named-unit-conversion'}),...input}).output;
describe('independent selected private component contracts',()=>{
 it.each([3,5,6,7,8,22,27,29])('%i exposes the actual monthly schedule without changing its totals',id=>{
  expect(component(id,{principal:210,annualRatePercent:120,termMonths:2,extraMonthlyPayment:100})).toMatchObject({value:121,scheduledPayment:121,monthlyPayment:221,totalPayment:232,totalInterest:22,payoffMonths:2,amortization:[{payment:221,interest:21,principal:200,balance:10},{payment:11,interest:1,principal:10,balance:0}]});
 });
 it.each([4,11,28])('%i models fixed monthly payoff, not a calendar date',id=>{
  expect(component(id,{balance:210,annualAprPercent:120,monthlyPayment:121,extraMonthlyPayment:0})).toMatchObject({value:2,payoffMonths:2,totalPaid:242,totalInterest:32});
 });
 it.each([12,30,104,105])('%i retains user-supplied DTI and inverse-loan boundaries',id=>{
  expect(component(id,{grossMonthlyIncome:1000,existingMonthlyDebt:100,targetDtiPercent:30,annualRatePercent:120,termMonths:2,downPayment:50})).toMatchObject({value:347.11,currentDtiPercent:10,availableMonthlyLoanPayment:200,maximumPurchasePrice:397.11});
 });
 it('13 calculates debt/income as a percent independently of a lender threshold',()=>expect(component(13,{grossMonthlyIncome:800,existingMonthlyDebt:120})).toMatchObject({value:15}));
 it.each([[14,'avalanche',165,15],[15,'snowball',175,25],[16,'avalanche',165,15],[17,'avalanche',165,15]] as const)('%i enforces its selected strategy and rolls the fixed budget',(id,strategy,totalPaid,totalInterest)=>{
  const out=component(id,{debts:[{name:'A',balance:100,annualRatePercent:120,minimumPayment:0},{name:'B',balance:50,annualRatePercent:0,minimumPayment:0}],extraMonthlyPayment:60});
  expect(out).toMatchObject({value:3,strategy,totalPaid,totalInterest});
  if(id===17)expect(out).toMatchObject({avalanche:{totalPaid:165,totalInterest:15},snowball:{totalPaid:175,totalInterest:25}});
 });
 it.each([24,33])('%i distinguishes payment break-even from net lifetime savings',id=>{
  expect(component(id,{remainingBalance:210,currentAnnualRatePercent:120,currentRemainingMonths:2,newAnnualRatePercent:0,newTermMonths:3,refinanceCosts:5})).toMatchObject({value:id===24?27:1,currentMonthlyPayment:121,newMonthlyPayment:70,grossInterestSavings:32,netLifetimeSavings:27,breakEvenMonths:1});
 });
 it('31 keeps supplied down payment and remaining principal disjoint',()=>expect(component(31,{price:800,downPaymentPercent:12.5})).toMatchObject({value:100,remainingPrincipal:700}));
 it('426 preserves named mass conversion and excludes force',()=>{
  expect(component(426,{value:1,fromUnit:'lb',toUnit:'g'})).toMatchObject({value:453.59237,unit:'g'});
  expect(()=>component(426,{value:1,fromUnit:'N',toUnit:'kg'})).toThrow();
 });
 it('506 uses the actual approximate US volume table, not ingredient density',()=>{
  expect(component(506,{value:2,fromUnit:'cup_us',toUnit:'fl_oz_us'})).toMatchObject({value:16,unit:'fl_oz_us'});
  expect(()=>component(506,{value:100,fromUnit:'g',toUnit:'cup_us'})).toThrow();
 });
 it('rejects subclosure principals, unrepresentable rates, nonamortizing payments and undeclared policy',()=>{
  expect(()=>component(3,{principal:0.001,annualRatePercent:0,termMonths:2,extraMonthlyPayment:0})).toThrow();
  expect(()=>component(12,{grossMonthlyIncome:1000,existingMonthlyDebt:0,targetDtiPercent:20,annualRatePercent:1e-20,termMonths:2,downPayment:0})).toThrow();
  expect(()=>component(4,{balance:210,annualAprPercent:120,monthlyPayment:21,extraMonthlyPayment:0})).toThrow();
  expect(()=>component(13,{grossMonthlyIncome:0,existingMonthlyDebt:0})).toThrow();
  expect(()=>component(14,{debts:[{name:'A',balance:100,annualRatePercent:0,minimumPayment:1}],extraMonthlyPayment:1,strategy:'snowball'})).toThrow();
  expect(componentContracts.some(d=>d.id==='private.component.25')).toBe(false);
 });
 it('exported methodology and dependency identities are detached and deeply immutable',()=>{
  const s=exportComponentContract(3,componentExamples[3]);
  expect(Object.isFrozen(s.methodology)).toBe(true);
  expect(Object.isFrozen(s.methodology.formulas[0])).toBe(true);
  expect(Object.isFrozen(s.methodology.sources)).toBe(true);
  expect(Object.isFrozen(s.dependencies)).toBe(true);
  expect(Object.isFrozen(s.dependencies[0])).toBe(true);
 });
 it('replay rejects swapping a valid original dependency payload to a different private identity',()=>{
  const s=JSON.parse(JSON.stringify(exportComponentContract(3,componentExamples[3])));
  s.masterId=5;
  expect(()=>importComponentContract(s)).toThrow();
 });
});
