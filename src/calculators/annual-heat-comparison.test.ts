import {describe,expect,it} from 'vitest';
import {runCalculator} from './engine';
import {annualHeatComparison,exportAnnualHeatComparison,importAnnualHeatComparison} from './annual-heat-comparison';

const input={methodSnapshot:'2026-10-29',currency:'GBP',heatBoundary:'same-annual-space-heat',auxiliaryBoundary:'outside-scop-only',usefulHeatKwh:'12000',existingEfficiency:'0.8',scop:'3',outsideAuxiliaryKwh:'0',fuelTariff:'0.08',electricityTariff:'0.25',incrementalInstalledCost:'4000'};
const q=(numerator:string,denominator='1')=>({numerator,denominator});
const calculate=(patch:Record<string,unknown>={})=>runCalculator(annualHeatComparison,{...input,...patch}).output;

describe('supplied annual heat comparison',()=>{
 it('reproduces the independent 200 annual savings and 20 year simple-payback witness',()=>{
  expect(calculate()).toMatchObject({existingInputKwh:q('15000'),heatPumpBaseKwh:q('4000'),heatPumpTotalKwh:q('4000'),existingCost:q('1200'),heatPumpCost:q('1000'),annualSavings:q('200'),simplePaybackYears:q('20'),paybackStatus:'positive-savings'});
 });
 it('adds only the explicitly outside-SCOP auxiliary, reducing savings to175',()=>{
  expect(calculate({outsideAuxiliaryKwh:'100'})).toMatchObject({heatPumpTotalKwh:q('4100'),heatPumpCost:q('1025'),annualSavings:q('175'),simplePaybackYears:q('160','7')});
 });
 it.each([
  [{electricityTariff:'0.3'},'0'],
  [{electricityTariff:'0.5'},'-800'],
 ])('does not fabricate payback for nonpositive savings %j',(patch,savings)=>{
  expect(calculate(patch)).toMatchObject({annualSavings:q(savings),simplePaybackYears:null,paybackStatus:'no-positive-savings'});
 });
 it('zero cost with positive savings is immediate, not missing payback',()=>{
  expect(calculate({incrementalInstalledCost:'0'})).toMatchObject({simplePaybackYears:q('0'),paybackStatus:'zero-cost'});
 });
 it('zero demand still accounts for explicitly supplied auxiliary electricity',()=>{
  expect(calculate({usefulHeatKwh:'0',outsideAuxiliaryKwh:'100'})).toMatchObject({existingCost:q('0'),heatPumpCost:q('25'),annualSavings:q('-25'),simplePaybackYears:null});
 });
 it('retains repeating energy and currency fractions without display rounding',()=>{
  expect(calculate({usefulHeatKwh:'1',existingEfficiency:'1',scop:'3',fuelTariff:'1',electricityTariff:'1',incrementalInstalledCost:'1'})).toMatchObject({heatPumpBaseKwh:q('1','3'),annualSavings:q('2','3'),simplePaybackYears:q('3','2')});
 });
 it.each([
  {existingEfficiency:'0'},{existingEfficiency:'1.000001'},{scop:'0'},
  {usefulHeatKwh:'-1'},{fuelTariff:'1e3'},{electricityTariff:0.25},
  {scop:'3.1234567'},{usefulHeatKwh:'1000000000000'},
  {heatBoundary:'hot-water'},{auxiliaryBoundary:'already-in-scop'},
  {methodSnapshot:'2026-10-28'},{currency:'gbp'},{maintenance:'100'},
 ])('rejects unsupported or ambiguous contract inputs %j',patch=>expect(()=>calculate(patch)).toThrow());
 it.each(['heatBoundary','auxiliaryBoundary','scop','outsideAuxiliaryKwh','incrementalInstalledCost'])('requires explicit %s',key=>{
  const raw:Record<string,unknown>={...input};delete raw[key];
  expect(()=>runCalculator(annualHeatComparison,raw)).toThrow();
 });
 it('retains six-place small positive divisors and zero tariffs',()=>{
  expect(calculate({existingEfficiency:'0.000001',scop:'0.000001',fuelTariff:'0',electricityTariff:'0'})).toMatchObject({existingInputKwh:q('12000000000'),heatPumpBaseKwh:q('12000000000'),annualSavings:q('0'),simplePaybackYears:null});
 });
 it('exports identical immutable results for every review plan and replays parsed JSON',()=>{
  const free=exportAnnualHeatComparison(input,'free');
  expect(exportAnnualHeatComparison(input,'pro')).toEqual(free);
  expect(exportAnnualHeatComparison(input,'business')).toEqual(free);
  expect(importAnnualHeatComparison(JSON.parse(JSON.stringify(free)))).toEqual(free);
  expect(Object.isFrozen(free.calculation.output)).toBe(true);
  expect(Object.isFrozen(free.sources)).toBe(true);
  expect(Object.isFrozen(free.sources[0])).toBe(true);
  const raw={...input};const snapshot=exportAnnualHeatComparison(raw);raw.scop='9';
  expect(snapshot.calculation.input.scop).toBe('3');
 });
 it.each(['output','input','source','version','identity','extra'])('rejects forged %s during replay',kind=>{
  const snapshot=JSON.parse(JSON.stringify(exportAnnualHeatComparison(input)));
  if(kind==='output')snapshot.calculation.output.annualSavings=q('201');
  if(kind==='input')snapshot.calculation.input.scop='4';
  if(kind==='source')snapshot.sources[0].sha256='0'.repeat(64);
  if(kind==='version')snapshot.calculation.calculatorVersion=2;
  if(kind==='identity')snapshot.profileId='private.profile.nz-gst-prices';
  if(kind==='extra')snapshot.certified=true;
  expect(()=>importAnnualHeatComparison(snapshot)).toThrow();
 });
 it('rejects unknown review plans',()=>expect(()=>exportAnnualHeatComparison(input,'enterprise' as 'free')).toThrow());
});
