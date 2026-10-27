import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {calculatorRegistry} from './registry';
import {privateSuppliedDefinitions, exportPrivateSuppliedRun, suppliedCaseBindings} from './private-supplied-contracts';

const basis={currency:'USD',period:'month'};
const ledger={...basis,horizon:2,flows:[{at:0,outflow:100},{at:2,outflow:121}],terminalDebt:0,terminalAsset:0};
const cases=[
 ['supplied-ledger-comparison',{left:ledger,right:{...ledger,flows:[]},discountRate:.1},{left:200,right:0,difference:200}],
 ['supplied-balance-projection',{...basis,initial:100,timing:'end',steps:[{rate:0,cashflow:-100},{rate:0,cashflow:-1}]},{balance:0,exactZeroPeriod:1,firstShortfallPeriod:2}],
 ['supplied-ratio-percent',{...basis,numerator:25,denominator:200},{percent:12.5}],
 ['supplied-lease-base',{...basis,capitalized:18800,residual:12350,rentCharge:5295,payments:48},{basePayment:244.6875}],
 ['supplied-heat-balance',{...basis,usefulHeatKWh:10000,baselineEfficiency:1,scop:4,baselinePricePerKWh:.1,heatPumpPricePerKWh:.3,auxiliaryKWh:100},{savings:220}],
 ['supplied-weighted-mean',{rows:[{value:4,weight:1},{value:0,weight:1}]},{mean:2}],
 ['supplied-price-factor',{...basis,amount:100,rate:.15,mode:'exclusive'},{net:100,tax:15,gross:115}],
] as const;
const definition=(component:string)=>privateSuppliedDefinitions.find(d=>d.id===`private.${component}`)!;
describe('private supplied-input calculator contracts',()=>{
 it.each(cases)('%s executes independent literal goldens through the actual engine',(component,input,expected)=>{
  const d=definition(component),run=runCalculator(d,input);
  for(const [key,value] of Object.entries(expected)){
   if(typeof value==='number')expect((run.output as Record<string,unknown>)[key]).toBeCloseTo(value,10);
   else expect((run.output as Record<string,unknown>)[key]).toBe(value);
  }
  expect(d.reviewStatus).toBe('draft');expect(d.version).toBe(1);
  expect(calculatorRegistry.getById(d.id)).toBeUndefined();
  expect(()=>runCalculator(d,{...input,unexpected:true})).toThrow();
  expect(()=>d.calculate({...input,unexpected:true},{})).toThrow();
 });
 it('records exactly the 23 component cases without canonical acceptance',()=>{
  expect(suppliedCaseBindings.map(b=>b.masterId)).toEqual([21,32,36,43,46,49,80,81,84,85,86,125,126,127,134,198,199,468,469,470,472,488,516]);
  for(const b of suppliedCaseBindings){expect(b.canonicalScopeAdopted).toBe(false);expect(b.publicationAuthorized).toBe(false);expect(b.contractIds.length).toBeGreaterThan(0);}
 });
 it.each(cases)('%s exports detached immutable versioned input/output',(component,input)=>{
  const d=definition(component),run=runCalculator(d,input);
  const snapshot=exportPrivateSuppliedRun(d,run.input,run.output);
  expect(Object.isFrozen(snapshot)).toBe(true);expect(Object.isFrozen(snapshot.input)).toBe(true);expect(Object.isFrozen(snapshot.output)).toBe(true);
  expect(snapshot.calculatorVersion).toBe(1);expect(snapshot.calculatorSlug).toBe(d.slug);
  expect(JSON.parse(JSON.stringify(snapshot)).output).toEqual(run.output);
  if('left' in snapshot.input){const left=snapshot.input.left as typeof ledger;expect(Object.isFrozen(left.flows[0])).toBe(true);expect(()=>{left.flows[0].outflow=999;}).toThrow();}
 });
 it('rejects invalid nested domains and unsupported work before numerical execution',()=>{
  expect(()=>runCalculator(definition('supplied-ledger-comparison'),{left:ledger,right:{...ledger,period:'year'},discountRate:0})).toThrow();
  expect(()=>runCalculator(definition('supplied-ledger-comparison'),{left:{...ledger,flows:[{at:3,outflow:1}]},right:ledger,discountRate:0})).toThrow();
  for(const denominator of [0,-1,Infinity,NaN])expect(()=>runCalculator(definition('supplied-ratio-percent'),{...basis,numerator:1,denominator})).toThrow();
  expect(()=>runCalculator(definition('supplied-balance-projection'),{...basis,initial:1,timing:'end',steps:Array.from({length:10001},()=>({rate:0,cashflow:0}))})).toThrow();
  expect(()=>runCalculator(definition('supplied-weighted-mean'),{rows:[{value:1,weight:1,eligible:true}]})).toThrow();
 });
 it('refuses forged output and definitions during export',()=>{
  const d=definition('supplied-ratio-percent'),input={...basis,numerator:25,denominator:200};
  expect(()=>exportPrivateSuppliedRun(d,input,{percent:999})).toThrow('Output does not match');
  expect(()=>exportPrivateSuppliedRun({...d},input,{percent:12.5})).toThrow('Unknown private');
 });
});
