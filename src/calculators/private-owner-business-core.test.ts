import {describe,it,expect} from 'vitest';
import {privateOwnerBusinessCore} from './private-owner-business-core';
const calc=(id:number,input:unknown)=>privateOwnerBusinessCore.find(x=>x.masterId===id)!.definition.calculate(input,{});
describe('owner business scopes',()=>{
 it('contains only seven draft private bindings with executable mode examples',()=>{
  expect(privateOwnerBusinessCore.map(x=>x.masterId)).toEqual([145,156,157,158,161,177,181]);
  for(const {definition:d} of privateOwnerBusinessCore){expect(d.reviewStatus).toBe('draft');for(const e of d.examples)expect(d.calculate(e.input,{})).toEqual(e.expected);}
 });
 it('sums gross supplied sales',()=>expect(calc(145,{currency:'USD',period:'2026',lines:[{price:12,quantity:3},{price:4,quantity:5}]})).toEqual({currency:'USD',period:'2026',grossSales:56}));
 it('reports separate project profit and margin',()=>{
  expect(calc(156,{mode:'profit',currency:'USD',period:'Q1',revenue:80,costs:100})).toEqual({currency:'USD',period:'Q1',profit:-20});
  expect(calc(156,{mode:'margin',currency:'USD',period:'Q1',revenue:80,costs:60})).toEqual({currency:'USD',period:'Q1',profit:20,marginPercent:25});
 });
 it('discounts dated signed flows using explicit ACT365F annual effective rate',()=>expect(calc(156,{mode:'dated-npv',currency:'USD',valuationDate:'2025-01-01',dayCount:'ACT365F',annualEffectiveRatePercent:10,cashflows:[{date:'2025-01-01',amount:-100},{date:'2026-01-01',amount:121}]})).toEqual({currency:'USD',dayCount:'ACT365F',valuationDate:'2025-01-01',npv:9.999999999999986}));
 it('divides supplied annual target by hours',()=>expect(calc(157,{currency:'USD',annualPeriod:'2026',annualRevenueTarget:90000,billableHours:1500})).toEqual({currency:'USD',annualPeriod:'2026',hourlyRevenue:60}));
 it.each([158,181])('distinguishes markup from margin for %i',id=>{
  expect(calc(id,{mode:'markup',currency:'USD',period:'month',cost:80,markupPercent:25})).toEqual({currency:'USD',period:'month',price:100});
  expect(calc(id,{mode:'target-margin',currency:'USD',period:'month',cost:80,targetMarginPercent:20})).toEqual({currency:'USD',period:'month',price:100});
 });
 it('keeps contribution and acquisition ratio explicitly selected',()=>{
  const common={currency:'USD',unit:'order',costBoundary:'variable fulfillment',cohortPeriod:'October',unitRevenue:50,unitCost:30};
  expect(calc(161,{...common,mode:'contribution'})).toEqual({...common,contribution:20});
  expect(calc(161,{...common,mode:'acquisition-ratio',acquisitionCostPerUnit:10})).toEqual({...common,contribution:20,contributionToAcquisitionRatio:2});
 });
 it('adds percentage points with matching period and explicit basis',()=>expect(calc(177,{growthPeriod:'2026',profitabilityPeriod:'2026',profitabilityBasis:'operating margin',growthPercent:30,profitabilityPercent:-5})).toEqual({period:'2026',profitabilityBasis:'operating margin',scorePercent:25}));
 it('rejects unknown keys, denominators, missing conventions, bad dates and mismatched periods',()=>{
  const bad:[number,unknown][]=[ [157,{currency:'USD',annualPeriod:'2026',annualRevenueTarget:1,billableHours:0}], [158,{mode:'target-margin',currency:'USD',period:'Q1',cost:1,targetMarginPercent:100}], [156,{mode:'margin',currency:'USD',period:'Q1',revenue:0,costs:1}], [177,{growthPeriod:'2025',profitabilityPeriod:'2026',profitabilityBasis:'net',growthPercent:1,profitabilityPercent:2}], [145,{currency:'USD',period:'year',lines:[{price:1,quantity:1}],hidden:1}]];
  for(const date of ['2025-02-29','2025-13-01','January 1'])bad.push([156,{mode:'dated-npv',currency:'USD',valuationDate:date,dayCount:'ACT365F',annualEffectiveRatePercent:10,cashflows:[{date:'2026-01-01',amount:1}]}]);
  for(const [id,input] of bad)expect(()=>calc(id,input)).toThrow();
 });
 it('uses actual leap-year day counts and signed dates without changing the day-count basis',()=>{
  const input={mode:'dated-npv',currency:'EUR',valuationDate:'2024-01-01',dayCount:'ACT365F',annualEffectiveRatePercent:100,cashflows:[{date:'2025-01-01',amount:8}]};
  expect(calc(156,input)).toMatchObject({npv:8/2**(366/365)});
  expect(calc(156,{...input,valuationDate:'2025-01-01',cashflows:[{date:'2024-01-02',amount:8}]})).toMatchObject({npv:16});
 });
 it('rejects missing NPV conventions, invalid flow dates, singular rates and acquisition denominators',()=>{
  const npv={mode:'dated-npv',currency:'USD',valuationDate:'2025-01-01',dayCount:'ACT365F',annualEffectiveRatePercent:0,cashflows:[{date:'2026-01-01',amount:1}]};
  for(const patch of [{dayCount:undefined},{dayCount:'ACT360'},{annualEffectiveRatePercent:-100},{cashflows:[{date:'2026-02-30',amount:1}]}])expect(()=>calc(156,{...npv,...patch})).toThrow();
  expect(()=>calc(161,{currency:'USD',unit:'order',costBoundary:'all',cohortPeriod:'Q1',unitRevenue:1,unitCost:0,mode:'acquisition-ratio',acquisitionCostPerUnit:0})).toThrow();
 });
 it('rejects overflowing sums, ratios and discount factors',()=>{
  expect(()=>calc(145,{currency:'USD',period:'year',lines:[{price:1e308,quantity:1},{price:1e308,quantity:1}]})).toThrow();
  expect(()=>calc(157,{currency:'USD',annualPeriod:'year',annualRevenueTarget:1e308,billableHours:1e-308})).toThrow();
  expect(()=>calc(156,{mode:'dated-npv',currency:'USD',valuationDate:'0001-01-01',dayCount:'ACT365F',annualEffectiveRatePercent:100,cashflows:[{date:'9999-01-01',amount:1}]})).toThrow();
 });
 it('rejects arithmetic overflow',()=>expect(()=>calc(145,{currency:'USD',period:'year',lines:[{price:1e308,quantity:1e308}]})).toThrow());
});
