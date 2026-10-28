import {describe,expect,it} from 'vitest';
import {runCalculator} from './engine';
import {exportPrivateSuppliedRun,privateSuppliedDefinitions,suppliedCaseBindings} from './private-supplied-contracts';

// Independent per-case supplied-input witnesses. These deliberately do not
// purport to supply missing product/provider/legal/eligibility contracts.
const b={currency:'USD',period:'year'};
const ledger=(flows:readonly [number,number][],debt=0,asset=0)=>({...b,horizon:2,flows:flows.map(([at,outflow])=>({at,outflow})),terminalDebt:debt,terminalAsset:asset});
const comparison=(left:ReturnType<typeof ledger>,right:ReturnType<typeof ledger>,discountRate=0)=>({left,right,discountRate});
const witnesses=[
 {id:21,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,20],[1,100],[2,100]],50),ledger([[0,40],[1,90],[2,90]],70)),expected:{left:270,right:290,difference:-20}},
 {id:32,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,20],[1,100],[2,100]]),ledger([[0,100],[1,50],[2,50]],200,400)),expected:{left:220,right:0,difference:220}},
 {id:36,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,100],[1,-20],[2,-20]],40,140),ledger([])),expected:{left:-40,right:0,difference:-40}},
 {id:43,contract:'supplied-ratio-percent',input:{...b,numerator:30,denominator:200},expected:{percent:15}},
 {id:46,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,100],[1,25],[2,10]],0,120),ledger([])),expected:{left:15,right:0,difference:15}},
 {id:49,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,100],[1,-10],[2,-10]],60,200),ledger([])),expected:{left:-60,right:0,difference:-60}},
 {id:80,contract:'supplied-ledger-comparison',input:comparison(ledger([[1,110],[2,121]]),ledger([]),0.1),expected:{left:200,right:0,difference:200}},
 {id:81,contract:'supplied-balance-projection',input:{...b,initial:100,timing:'begin',steps:[{rate:0.25,cashflow:20},{rate:0,cashflow:20}]},expected:{balance:170,exactZeroPeriod:null,firstShortfallPeriod:null}},
 {id:84,contract:'supplied-balance-projection',input:{...b,initial:100,timing:'end',steps:[{rate:0.25,cashflow:0}]},expected:{balance:125,exactZeroPeriod:null,firstShortfallPeriod:null}},
 {id:85,contract:'supplied-balance-projection',input:{...b,initial:100,timing:'end',steps:[{rate:0.25,cashflow:-125}]},expected:{balance:0,exactZeroPeriod:1,firstShortfallPeriod:null}},
 {id:86,contract:'supplied-balance-projection',input:{...b,initial:100,timing:'begin',steps:[{rate:0,cashflow:-100},{rate:0,cashflow:-1}]},expected:{balance:0,exactZeroPeriod:1,firstShortfallPeriod:2}},
 {id:125,contract:'supplied-price-factor',input:{...b,amount:80,rate:0.125,mode:'exclusive'},expected:{net:80,tax:10,gross:90}},
 {id:126,contract:'supplied-price-factor',input:{...b,amount:115,rate:0.15,mode:'inclusive'},expected:{net:100,tax:15,gross:115}},
 {id:127,contract:'supplied-price-factor',input:{...b,amount:120,rate:0.2,mode:'inclusive'},expected:{net:100,tax:20,gross:120}},
 {id:134,contract:'supplied-ratio-percent',input:{...b,numerator:15,denominator:200},expected:{percent:7.5}},
 {id:198,contract:'supplied-ledger-comparison',input:comparison(ledger([[1,10],[2,-2]]),ledger([[1,8]])),expected:{left:8,right:8,difference:0}},
 {id:199,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,20],[1,-50],[2,5]]),ledger([])),expected:{left:-25,right:0,difference:-25}},
 {id:468,contract:'supplied-ledger-comparison',input:comparison(ledger([[1,100],[2,100]]),ledger([[1,90],[2,90]])),expected:{left:200,right:180,difference:20}},
 {id:469,contract:'supplied-lease-base',input:{...b,capitalized:18800,residual:12350,rentCharge:5295,payments:48},expected:{basePayment:244.6875}},
 {id:470,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,20],[1,20],[2,30]]),ledger([[0,100]],20,60)),expected:{left:70,right:60,difference:10}},
 {id:472,contract:'supplied-ledger-comparison',input:comparison(ledger([[0,100]]),ledger([[1,50],[2,50]],20)),expected:{left:100,right:120,difference:-20}},
 {id:488,contract:'supplied-heat-balance',input:{...b,usefulHeatKWh:10000,baselineEfficiency:1,scop:4,baselinePricePerKWh:0.1,heatPumpPricePerKWh:0.3,auxiliaryKWh:0},expected:{savings:250}},
 {id:516,contract:'supplied-weighted-mean',input:{rows:[{value:2.7,weight:3},{value:3.7,weight:4},{value:3.3,weight:3}]},expected:{mean:3.28}},
];
describe('23 case-associated actual private-engine witnesses; no canonical acceptance',()=>{
 it('covers exactly the preserved component-support cohort without adopting scopes',()=>{
  expect(witnesses.map(x=>x.id)).toEqual(suppliedCaseBindings.map(x=>x.masterId));
  expect(suppliedCaseBindings.every(x=>!x.canonicalScopeAdopted&&!x.publicationAuthorized)).toBe(true);
 });
 it.each(witnesses)('case $id validates engine and immutable export for $contract',w=>{
  const definition=privateSuppliedDefinitions.find(d=>d.id===`private.${w.contract}`)!;
  expect(suppliedCaseBindings.find(b=>b.masterId===w.id)!.contractIds).toContain(definition.id);
  const run=runCalculator(definition,w.input);
  for(const [key,value] of Object.entries(w.expected)){
   if(typeof value==='number')expect(run.output[key]).toBeCloseTo(value,10);
   else expect(run.output[key]).toBe(value);
  }
  const snapshot=exportPrivateSuppliedRun(definition,run.input,run.output);
  expect(snapshot.calculatorVersion).toBe(1);
  expect(Object.isFrozen(snapshot.input)).toBe(true);
  expect(Object.isFrozen(snapshot.output)).toBe(true);
 });
});
