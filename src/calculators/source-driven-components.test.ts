import { describe, expect, it } from 'vitest';
import { compareSuppliedLedgers, projectSuppliedBalance, suppliedRatioPercent, suppliedLeaseBase, suppliedHeatSavings, suppliedWeightedMean } from './source-driven-components';
const basis = { currency: 'USD', period: 'month', horizon: 2 };
describe('unregistered supplied-input arithmetic', () => {
  it('compares matched cashflows and terminal debt exactly once', () => {
    const a = { ...basis, flows: [{ at: 0, outflow: 100 }, { at: 1, outflow: 20 }], terminalDebt: 50, terminalAsset: 80 };
    const b = { ...basis, flows: [{ at: 0, outflow: 90 }], terminalDebt: 80, terminalAsset: 80 };
    expect(compareSuppliedLedgers(a,b,0)).toEqual({ left: 90, right: 90, difference: 0 });
    expect(compareSuppliedLedgers(a,{ ...b, terminalDebt: 70 },0).difference).toBe(10);
    expect(() => compareSuppliedLedgers(a,{ ...b, horizon: 3 },0)).toThrow();
    expect(() => compareSuppliedLedgers(a,{ ...b, currency: 'EUR' },0)).toThrow();
  });
  it('discounts explicit timing including negative rates without hidden upfront duplication', () => {
    const a = { ...basis, flows: [{at: 0,outflow: 100},{at: 2,outflow: 81}], terminalDebt: 0, terminalAsset: 0 };
    expect(compareSuppliedLedgers(a,{...a,flows: []},-.1).difference).toBeCloseTo(200,12);
    expect(() => compareSuppliedLedgers({...a,flows:[{at:3,outflow:1}]},a,0)).toThrow();
    expect(() => compareSuppliedLedgers({...a,terminalDebt:Number.MAX_VALUE},a,-.999)).toThrow();
  });
  it('projects beginning and end deposits with explicit per-period returns', () => {
    expect(projectSuppliedBalance({currency:'USD',period:'year',initial:100, timing:'end', steps:[{rate:.1,cashflow:10}]}).balance).toBeCloseTo(120,12);
    expect(projectSuppliedBalance({currency:'USD',period:'year',initial:100, timing:'begin', steps:[{rate:.1,cashflow:10}]}).balance).toBeCloseTo(121,12);
    expect(projectSuppliedBalance({currency:'USD',period:'year',initial:100, timing:'end', steps:[{rate:-.1,cashflow:0}]}).balance).toBe(90);
  });
  it('separates exact zero and first insufficient withdrawal with a finite horizon', () => {
    const p = {currency:'USD',period:'year',initial:100,timing:'end' as const,steps:[{rate:0,cashflow:-100},{rate:0,cashflow:-1}]};
    expect(projectSuppliedBalance(p)).toEqual({balance:0,exactZeroPeriod:1,firstShortfallPeriod:2});
    expect(projectSuppliedBalance({...p,steps:[{rate:.1,cashflow:-10}]}).balance).toBeCloseTo(100,12);
    expect(() => projectSuppliedBalance({...p,initial:Number.MAX_VALUE,steps:[{rate:1,cashflow:0}]})).toThrow();
    expect(() => projectSuppliedBalance({...p,steps:[{rate:-1,cashflow:0}]})).toThrow();
  });
  it('computes a supplied ratio without defining statutory income or taxes', () => {
    expect(suppliedRatioPercent({currency:'USD',period:'2026',numerator:25,denominator:200})).toBe(12.5);
    expect(() => suppliedRatioPercent({currency:'USD',period:'2026',numerator:0,denominator:0})).toThrow();
  });
  it('preserves disclosed lease arithmetic without inventing display rounding', () => {
    expect(suppliedLeaseBase({currency:'USD',period:'month',capitalized:18800,residual:12350,rentCharge:5295,payments:48})).toBe(244.6875);
  });
  it('balances useful heat and external auxiliary energy on supplied annual tariffs', () => {
    const h = {currency:'GBP',period:'year',usefulHeatKWh:10000,baselineEfficiency:1,scop:4,baselinePricePerKWh:.1,heatPumpPricePerKWh:.3,auxiliaryKWh:0};
    expect(suppliedHeatSavings(h)).toBe(250);
    expect(suppliedHeatSavings({...h,auxiliaryKWh:100})).toBe(220);
    expect(() => suppliedHeatSavings({...h,scop:0})).toThrow();
  });
  it('uses caller-selected eligible grade points and credits only', () => {
    expect(suppliedWeightedMean([{value:2.7,weight:3},{value:3.7,weight:4},{value:3.3,weight:3}])).toBeCloseTo(3.28,12);
    expect(suppliedWeightedMean([{value:4,weight:1},{value:0,weight:1}])).toBe(2);
    expect(suppliedWeightedMean([{value:4,weight:1}])).toBe(4);
    expect(() => suppliedWeightedMean([{value:4,weight:0}])).toThrow();
  });
  it('rejects nonfinite values, missing basis, excessive work and overflow', () => {
    expect(() => suppliedWeightedMean([{value:Infinity,weight:1}])).toThrow();
    expect(() => suppliedWeightedMean(Array.from({length:10001},()=>({value:1,weight:1})))).toThrow();
    expect(() => suppliedWeightedMean([{value:Number.MAX_VALUE,weight:2}])).toThrow();
    expect(() => suppliedRatioPercent({currency:'',period:'year',numerator:1,denominator:1})).toThrow();
  });
});

import { SUPPLIED_COMPONENT_CONTRACTS } from './source-driven-components';
it('publishes versioned internal contracts without registering calculator identities', () => {
  expect(SUPPLIED_COMPONENT_CONTRACTS.map(c=>c.id)).toEqual(['supplied-price-factor','supplied-ledger-comparison','supplied-balance-projection','supplied-ratio-percent','supplied-lease-base','supplied-heat-balance','supplied-weighted-mean']);
  expect(SUPPLIED_COMPONENT_CONTRACTS.every(c=>c.version==='1.0.0' && c.status==='UNREGISTERED' && c.assumptions.length>0)).toBe(true);
});
it('handles zero horizon and terminal values at their declared boundary', () => {
  const a = {...basis,horizon:0,flows:[{at:0,outflow:5}],terminalDebt:3,terminalAsset:2};
  expect(compareSuppliedLedgers(a,{...a,flows:[],terminalDebt:0,terminalAsset:0},.1)).toEqual({left:6,right:0,difference:6});
  const end = {...basis,flows:[],terminalDebt:121,terminalAsset:0};
  expect(compareSuppliedLedgers(end,{...end,terminalDebt:0},.1).difference).toBeCloseTo(100,12);
  expect(projectSuppliedBalance({currency:'USD',period:'year',initial:0,timing:'begin',steps:[]})).toEqual({balance:0,exactZeroPeriod:0,firstShortfallPeriod:null});
});
it('does not accrue returns on a beginning-period withdrawal already paid', () => {
  expect(projectSuppliedBalance({currency:'USD',period:'year',initial:100,timing:'begin',steps:[{rate:.1,cashflow:-50}]}).balance).toBeCloseTo(55,12);
  expect(projectSuppliedBalance({currency:'USD',period:'year',initial:50,timing:'begin',steps:[{rate:1,cashflow:-100}]})).toEqual({balance:0,exactZeroPeriod:1,firstShortfallPeriod:1});
});
it('rejects unsupported timing, mismatched periods and invalid weights or counts', () => {
  const a={...basis,flows:[],terminalDebt:0,terminalAsset:0};
  expect(()=>compareSuppliedLedgers(a,{...a,period:'year'},0)).toThrow();
  expect(()=>compareSuppliedLedgers({...a,horizon:1.5},a,0)).toThrow();
  expect(()=>suppliedWeightedMean([{value:4,weight:-1}])).toThrow();
  expect(()=>suppliedLeaseBase({currency:'USD',period:'month',capitalized:1,residual:0,rentCharge:0,payments:0})).toThrow();
  expect(()=>suppliedHeatSavings({currency:'USD',period:'year',usefulHeatKWh:1,baselineEfficiency:2,scop:1,baselinePricePerKWh:1,heatPumpPricePerKWh:1,auxiliaryKWh:0})).toThrow();
});

it('preserves small ledger cashflows through cancellation and rejects nonzero underflow', () => {
 const a={...basis,flows:[{at:0,outflow:1e16},{at:0,outflow:1},{at:0,outflow:-1e16}],terminalDebt:0,terminalAsset:0};
 expect(compareSuppliedLedgers(a,{...a,flows:[]},0).difference).toBe(1);
 expect(()=>compareSuppliedLedgers({...a,flows:[{at:2,outflow:Number.MIN_VALUE}]},{...a,flows:[]},1)).toThrow();
 expect(()=>projectSuppliedBalance({currency:'USD',period:'year',initial:Number.MIN_VALUE,timing:'end',steps:[{rate:-.5,cashflow:0}]})).toThrow();
 expect(()=>suppliedRatioPercent({currency:'USD',period:'year',numerator:Number.MIN_VALUE,denominator:10})).toThrow();
 expect(()=>suppliedWeightedMean([{value:Number.MIN_VALUE,weight:.1}])).toThrow();
 expect(suppliedWeightedMean([{value:1e16,weight:1},{value:1,weight:1},{value:-1e16,weight:1}])).toBeCloseTo(1/3,15);
});

import { suppliedPriceFactor } from './source-driven-components';
it('reconciles explicit exclusive and inclusive supplied price factors without selecting tax rules', () => {
 const p={currency:'NZD',period:'2026',amount:100,rate:.15,mode:'exclusive' as const};
 expect(suppliedPriceFactor(p)).toEqual({net:100,tax:15,gross:115});
 const included=suppliedPriceFactor({...p,amount:115,mode:'inclusive'});
 expect(included.net).toBeCloseTo(100,12);
 expect(included.tax).toBeCloseTo(15,12);
 expect(included.gross).toBe(115);
 expect(suppliedPriceFactor({...p,rate:0})).toEqual({net:100,tax:0,gross:100});
 expect(suppliedPriceFactor({...p,amount:0,mode:'inclusive'})).toEqual({net:0,tax:0,gross:0});
});
it('rejects invalid supplied price domains and nonrepresentable arithmetic', () => {
 const p={currency:'NZD',period:'2026',amount:100,rate:.15,mode:'exclusive' as const};
 for (const rate of [-.1,Infinity,NaN]) expect(()=>suppliedPriceFactor({...p,rate})).toThrow();
 expect(()=>suppliedPriceFactor({...p,amount:-1})).toThrow();
 expect(()=>suppliedPriceFactor({...p,currency:''})).toThrow();
 expect(()=>suppliedPriceFactor({...p,amount:Number.MAX_VALUE,rate:1})).toThrow();
 expect(()=>suppliedPriceFactor({...p,amount:Number.MIN_VALUE,rate:.1})).toThrow();
 expect(()=>suppliedPriceFactor({...p,mode:'inclusive',amount:Number.MIN_VALUE,rate:1})).toThrow();
});
