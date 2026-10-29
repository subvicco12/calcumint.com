import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {businessContracts,businessExamples,exportBusinessContract,importBusinessContract} from './business-contracts';
const b={currency:'USD',period:'month',measurementBasis:'explicit supplied boundary',scope:'supplied-business-no-policy'};
const calc=(id:number,p:Record<string,unknown>)=>runCalculator(businessContracts.find(d=>d.id===`private.business.${id}`)!,{...b,...p}).output;
const cases:readonly [number,Record<string,unknown>,number][]=[
 [139,{revenue:80,directCosts:100},-25], [140,{netIncome:-9,revenue:60},-15],
 [141,{cost:24,markupPercent:50},36],[142,{unitPrice:12,variableUnitCost:15},-3],
 [143,{fixedCosts:18,targetProfit:3,unitPrice:10,variableUnitCost:4},3.5],
 [144,{revenue:7,costs:10},-3],[148,{ebitda:-12,revenue:80},-15],
 [149,{currentAssets:45,currentLiabilities:30},1.5],[151,{currentAssets:0,currentLiabilities:9},-9],
 [152,{costOfGoodsSold:72,averageInventory:8},9],[153,{netCreditSales:72,averageReceivables:12},6],
 [164,{previousMrr:80,currentMrr:60},-25],
 [165,{openingMrr:50,newMrr:9,expansionMrr:4,reactivationMrr:2,contractionMrr:7,churnMrr:3},55],
 [166,{startingCustomers:80,lostCustomers:12},15],
 [167,{startingCustomers:80,newCustomers:20,endingCustomers:80},75],
 [169,{openingRevenue:80,churnRevenue:12,contractionRevenue:8},75],
 [171,{revenue:72,accounts:8},9],[174,{lifetimeValue:21,acquisitionCost:6},3.5],
 [175,{acquisitionCost:30,grossProfitPerMonth:8},3.75],
 [176,{period:'quarter',currentQuarterRevenue:60,previousQuarterRevenue:80,priorQuarterMarketingSpend:40},-2],
 [178,{cashOutflow:120,cashInflow:75},45],[180,{recurringRevenue:80,serviceCosts:100},-25],
 [182,{existingCustomerOnly:true,entries:[{id:'x',amount:0.1},{id:'y',amount:0.2}]},0.3],
 [183,{cohortBoundary:'disjoint-at-same-observation',cohorts:[{id:'x',starting:20,retained:10},{id:'y',starting:80,retained:70}]},80],
 [185,{contributionMarginFraction:0.125},8],[186,{attributedValue:30,marketingSpend:40},-25],
 [187,{acquisitionSpend:72,acquisitions:8},9],[188,{clickCost:3,clicks:8},0.375],
 [189,{spend:12,impressions:8000},1.5],[190,{clicks:3,impressions:80},3.75],
 [192,{revenue:72,orders:8},9],[193,{totalRevenue:30,totalMarketingSpend:8},3.75],
 [196,{conversions:3,emailDenominator:80,denominatorBasis:'supplied unique recipients'},3.75],
 [197,{eligibleSales:72,commissionPercent:12.5},9],
 [202,{unitPrice:20,unitCost:12,discountPercent:50,baselineQuantity:3,discountedQuantity:5},-34],
 [207,{baseValue:-24,percentage:-12.5},3],
];
describe('independent business numerical witnesses',()=>{
 it.each(cases)('%i independently calculated supplied business result',(id,p,value)=>expect(calc(id,p).value).toBeCloseTo(value,10));
 it('MRR cancellation retains small disjoint movements',()=>{
  expect(calc(165,{openingMrr:1e12,newMrr:0.001,expansionMrr:0,reactivationMrr:0,contractionMrr:1e12,churnMrr:0})).toMatchObject({value:0.001});
 });
 it('cohort totals retain zero rows without turning undefined percentages into zero',()=>{
  const p={cohortBoundary:'disjoint-at-same-observation',cohorts:[{id:'empty',starting:0,retained:0},{id:'full',starting:8,retained:2}]};
  expect(calc(183,p)).toMatchObject({value:25,starting:8,retained:2,cohorts:[{retentionPercent:null},{retentionPercent:25}]});
  expect(calc(183,{...p,cohorts:[p.cohorts[0]]}).value).toBeNull();
 });
 it('zero customer bases have no fabricated rate and membership must reconcile',()=>{
  expect(calc(167,{startingCustomers:0,newCustomers:5,endingCustomers:5})).toMatchObject({value:null,retained:0});
  expect(()=>calc(167,{startingCustomers:10,newCustomers:5,endingCustomers:4})).toThrow();
  expect(()=>calc(183,{cohortBoundary:'disjoint-at-same-observation',cohorts:[{id:'bad',starting:0,retained:1}]})).toThrow();
 });
 it.each([[149,{currentAssets:1,currentLiabilities:0}],[175,{acquisitionCost:1,grossProfitPerMonth:0}],[185,{contributionMarginFraction:0}],[188,{clickCost:1,clicks:0}],[193,{totalRevenue:1,totalMarketingSpend:0}]])('%i rejects undefined denominators',(id,p)=>expect(()=>calc(Number(id),p as Record<string,unknown>)).toThrow());
 it('negative discounted contribution cannot supply break-even volume',()=>{
  expect(calc(202,{unitPrice:20,unitCost:12,discountPercent:50,baselineQuantity:3,discountedQuantity:5})).toMatchObject({discountedPrice:10,baselineTotal:24,discountedTotal:-10,breakEvenDiscountedQuantity:null});
 });
 it('binds selected identity even when another profile accepts the same input fields',()=>{
  const s=JSON.parse(JSON.stringify(exportBusinessContract(139,businessExamples[139])));
  s.profileId='private.business.180';s.calculation.calculatorSlug='private-business-180';
  expect(()=>importBusinessContract(s)).toThrow();
 });
});
