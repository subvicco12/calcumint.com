import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {businessContracts,businessExamples,exportBusinessContract,importBusinessContract} from './business-contracts';
const b={currency:'USD',period:'month',measurementBasis:'supplied disjoint accounting totals',scope:'supplied-business-no-policy'};
const cases:readonly [number,Record<string,unknown>,number][]=[
 [139,{revenue:100,directCosts:70},30],[140,{netIncome:20,revenue:100},20],[141,{cost:80,markupPercent:25},100],
 [142,{unitPrice:50,variableUnitCost:30},20],[143,{fixedCosts:10000,targetProfit:5000,unitPrice:50,variableUnitCost:30},750],[144,{revenue:100,costs:70},30],
 [148,{ebitda:25,revenue:100},25],[149,{currentAssets:100,currentLiabilities:40},2.5],[151,{currentAssets:100,currentLiabilities:120},-20],
 [152,{costOfGoodsSold:1000,averageInventory:200},5],[153,{netCreditSales:1000,averageReceivables:250},4],
 [164,{previousMrr:100,currentMrr:125},25],[165,{openingMrr:100,newMrr:20,expansionMrr:10,reactivationMrr:5,contractionMrr:4,churnMrr:11},120],
 [166,{startingCustomers:100,lostCustomers:5},5],[167,{startingCustomers:100,newCustomers:20,endingCustomers:110},90],
 [169,{openingRevenue:100,churnRevenue:10,contractionRevenue:5},85],[171,{revenue:1000,accounts:20},50],
 [174,{lifetimeValue:600,acquisitionCost:100},6],[175,{acquisitionCost:100,grossProfitPerMonth:25},4],
 [176,{period:'quarter',currentQuarterRevenue:100,previousQuarterRevenue:80,priorQuarterMarketingSpend:40},2],
 [178,{cashOutflow:100,cashInflow:120},0],[180,{recurringRevenue:100,serviceCosts:30},70],
 [182,{existingCustomerOnly:true,entries:[{id:'a',amount:10},{id:'b',amount:20}]},30],
 [183,{cohortBoundary:'disjoint-at-same-observation',cohorts:[{id:'a',starting:100,retained:80},{id:'b',starting:50,retained:40}]},80],
 [185,{contributionMarginFraction:0.25},4],[186,{attributedValue:150,marketingSpend:100},50],[187,{acquisitionSpend:120,acquisitions:4},30],
 [188,{clickCost:50,clicks:100},0.5],[189,{spend:20,impressions:10000},2],[190,{clicks:20,impressions:1000},2],
 [192,{revenue:1000,orders:20},50],[193,{totalRevenue:1000,totalMarketingSpend:200},5],
 [196,{conversions:5,emailDenominator:50,denominatorBasis:'unique delivered'},10],
 [197,{eligibleSales:200,commissionPercent:10},20],[202,{unitPrice:100,unitCost:60,discountPercent:20,baselineQuantity:10,discountedQuantity:15},-100],
 [207,{baseValue:250,percentage:20},50],
];
const calculate=(id:number,p:Record<string,unknown>)=>runCalculator(businessContracts.find(d=>d.id===`private.business.${id}`)!,{...b,...p}).output;
describe('complete private business contracts',()=>{
 it.each(cases)('%i runs a literal independently derived product golden',(id,input,value)=>expect(calculate(id,input)).toMatchObject({value}));
 it('supports loss margins and below-cost contribution without clipping them',()=>{
  expect(calculate(140,{netIncome:-20,revenue:100})).toMatchObject({value:-20});
  expect(calculate(142,{unitPrice:20,variableUnitCost:30})).toMatchObject({value:-10,contributionPercent:-50});
 });
 it('distinguishes undefined growth/customer denominators from zero rates',()=>{
  expect(calculate(164,{previousMrr:0,currentMrr:100})).toMatchObject({value:null,status:'no-positive-base'});
  expect(calculate(166,{startingCustomers:0,lostCustomers:0})).toMatchObject({value:null});
  expect(calculate(166,{startingCustomers:100,lostCustomers:0})).toMatchObject({value:0});
 });
 it('rejects impossible customer membership and revenue retention losses',()=>{
  expect(()=>calculate(166,{startingCustomers:5,lostCustomers:6})).toThrow();
  expect(()=>calculate(167,{startingCustomers:10,newCustomers:0,endingCustomers:11})).toThrow();
  expect(()=>calculate(169,{openingRevenue:10,churnRevenue:8,contractionRevenue:3})).toThrow();
 });
 it('MRR movement reconciles each signed flow and rejects a negative closing balance',()=>{
  expect(calculate(165,{openingMrr:100,newMrr:20,expansionMrr:10,reactivationMrr:5,contractionMrr:4,churnMrr:11})).toMatchObject({value:120,grossAdditions:35,totalReductions:15,netMovement:20});
  expect(()=>calculate(165,{openingMrr:10,newMrr:0,expansionMrr:0,reactivationMrr:0,contractionMrr:11,churnMrr:0})).toThrow();
 });
 it('cohort total is denominator-weighted rather than an average of percentages',()=>{
  const out=calculate(183,{cohortBoundary:'disjoint-at-same-observation',cohorts:[{id:'a',starting:100,retained:50},{id:'b',starting:10,retained:10}]});
  expect(out.value).toBeCloseTo(54.54545454545454,10);
 });
 it('rejects duplicate expansion/cohort identities and noninteger counts',()=>{
  expect(()=>calculate(182,{existingCustomerOnly:true,entries:[{id:'a',amount:1},{id:'a',amount:2}]})).toThrow();
  expect(()=>calculate(183,{cohortBoundary:'disjoint-at-same-observation',cohorts:[{id:'a',starting:10,retained:5},{id:'a',starting:10,retained:5}]})).toThrow();
  expect(()=>calculate(190,{clicks:1.5,impressions:10})).toThrow();
 });
 it('discount comparison retains losses and does not fabricate break-even volume',()=>{
  expect(calculate(202,{unitPrice:100,unitCost:60,discountPercent:50,baselineQuantity:10,discountedQuantity:15})).toMatchObject({value:-550,discountedContribution:-10,breakEvenDiscountedQuantity:null});
 });
 it('enforces month/quarter units and rejects inferred policy fields',()=>{
  expect(()=>calculate(175,{period:'year',acquisitionCost:100,grossProfitPerMonth:25})).toThrow();
  expect(()=>calculate(176,{period:'month',currentQuarterRevenue:100,previousQuarterRevenue:80,priorQuarterMarketingSpend:40})).toThrow();
  expect(()=>calculate(139,{revenue:100,directCosts:70,taxRate:0})).toThrow();
 });
 it.each(cases)('%i replays immutable actual dependency results across every plan',id=>{
  const s=exportBusinessContract(id,businessExamples[id],'free');
  expect(exportBusinessContract(id,businessExamples[id],'pro')).toEqual(s);expect(exportBusinessContract(id,businessExamples[id],'business')).toEqual(s);
  expect(importBusinessContract(JSON.parse(JSON.stringify(s)))).toEqual(s);
  expect(Object.isFrozen(s.calculation.input)).toBe(true);expect(Object.isFrozen(s.calculation.output)).toBe(true);
 });
 it.each(['id','version','output','dependency','extra'])('rejects replay tampering: %s',kind=>{
  const s=JSON.parse(JSON.stringify(exportBusinessContract(139,businessExamples[139])));
  if(kind==='id')s.masterId=140;if(kind==='version')s.calculation.calculatorVersion=2;
  if(kind==='output')s.calculation.output.value=999;if(kind==='dependency')s.dependencies[0].version=2;if(kind==='extra')s.certified=true;
  expect(()=>importBusinessContract(s)).toThrow();
 });
 it('pins the preserved reconciliation source record and rejects a changed evidence binding',()=>{
  const s=exportBusinessContract(139,businessExamples[139]);
  expect(s.evidence).toEqual({path:'data/catalog/reconciliation-2026-10-25/nonfinancial-decisions.json',sha256:'2fda65b4c594e7dc54716f989d261a019cc9dd5ac3a74218030d09fc0d7b302b'});
  const forged=JSON.parse(JSON.stringify(s));forged.evidence.sha256='0'.repeat(64);expect(()=>importBusinessContract(forged)).toThrow();
 });
});
