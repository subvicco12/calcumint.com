import {describe, expect, it} from 'vitest';
import {runCalculator} from './engine';
import {privateWorkflowDefinitions, exportPrivateWorkflow, importPrivateWorkflow} from './private-scenario-workflows';

const basis = {currency:'USD', period:'month'};
const lease = {...basis, capitalized:18800, residual:12350, rentCharge:5295, payments:48, disclosedChargePerPayment:12.25};
const heat = {...basis, usefulHeatKWh:10000, baselineEfficiency:1, scop:4, baselinePricePerKWh:0.1, heatPumpPricePerKWh:0.3, auxiliaryKWh:100};
const target = {...basis, initial:100, initialTarget:150, timing:'end', steps:[{rate:0.1, cashflow:10, target:125},{rate:0, cashflow:10, target:130},{rate:0, cashflow:-200, target:1}]};
const calculate = (id:string, input:unknown) => runCalculator(privateWorkflowDefinitions.find(d=>d.id===`private.workflow.${id}`)!, input).output;

describe('private disclosed lease reconciliation',()=>{
 it('reconciles the Fed observation without inventing invoice rounding',()=>{
  const out=calculate('disclosed-lease',lease);
  expect(out).toMatchObject({depreciationTotal:6450, basePayment:11745/48, disclosedChargePerPayment:12.25, totalPayment:12333/48, baseTotal:11745, disclosedChargesTotal:588, totalPayments:12333});
  // 256.9375 unrounded is distinct from a source-displayed rounded invoice 256.94.
  expect(out.totalPayment).toBe(256.9375);
 });
 it('supports one payment and negative disclosed depreciation without clipping',()=>{
  expect(calculate('disclosed-lease',{...lease,capitalized:0,residual:10,rentCharge:12,payments:1,disclosedChargePerPayment:0})).toMatchObject({depreciationTotal:-10,basePayment:2,totalPayments:2});
 });
 it.each([{payments:0},{payments:10001},{payments:1.5},{disclosedChargePerPayment:-1},{taxRate:0.1},{rentCharge:Infinity}])('rejects invalid or inferred fields %j',change=>{
  expect(()=>calculate('disclosed-lease',{...lease,...change})).toThrow();
 });
 it('rejects overflowing charge totals',()=>expect(()=>calculate('disclosed-lease',{...lease,disclosedChargePerPayment:Number.MAX_VALUE})).toThrow());
 it('retains small disclosed base totals during large-component cancellation',()=>{
  expect(calculate('disclosed-lease',{...lease,capitalized:1,residual:1e16,rentCharge:1e16,payments:1,disclosedChargePerPayment:0})).toMatchObject({basePayment:1,totalPayment:1,baseTotal:1,totalPayments:1});
 });
});

describe('private supplied heat cost breakdown',()=>{
 it('exposes matched energy and cost boundaries with external auxiliary once',()=>{
  expect(calculate('heat-costs',heat)).toEqual({baselineInputKWh:10000,heatPumpCoreKWh:2500,heatPumpTotalKWh:2600,baselineCost:1000,heatPumpCost:780,savings:220,breakEvenElectricityPrice:5/13});
 });
 it('retains negative savings and computes zero-heat boundary without dividing by zero',()=>{
  expect(calculate('heat-costs',{...heat,heatPumpPricePerKWh:1})).toMatchObject({savings:-1600});
  expect(calculate('heat-costs',{...heat,usefulHeatKWh:0,auxiliaryKWh:0})).toMatchObject({savings:0,breakEvenElectricityPrice:null});
  expect(calculate('heat-costs',{...heat,usefulHeatKWh:0,auxiliaryKWh:10})).toMatchObject({heatPumpCost:3,savings:-3,breakEvenElectricityPrice:0});
 });
 it.each([{scop:0},{baselineEfficiency:1.01},{auxiliaryKWh:-1},{period:''},{usefulHeatKWh:NaN},{steps:[]}])('rejects incompatible domains %j',change=>expect(()=>calculate('heat-costs',{...heat,...change})).toThrow());
 it('rejects energy overflow and nonzero underflow',()=>{
  expect(()=>calculate('heat-costs',{...heat,scop:Number.MIN_VALUE})).toThrow();
  expect(()=>calculate('heat-costs',{...heat,usefulHeatKWh:Number.MIN_VALUE,scop:4})).toThrow();
 });
});

describe('private finite same-period target trajectory',()=>{
 it('finds the first crossing even when a later withdrawal misses the target',()=>{
  const out=calculate('target-trajectory',target);
  expect(out).toMatchObject({balance:0,firstTargetPeriod:2,exactZeroPeriod:3,firstShortfallPeriod:3,horizon:3});
  expect(out.rows).toEqual([
   {at:0,balance:100,target:150,reached:false,shortfall:0},
   {at:1,balance:120.00000000000001,target:125,reached:false,shortfall:0},
   {at:2,balance:130,target:130,reached:true,shortfall:0},
   {at:3,balance:0,target:1,reached:false,shortfall:70},
  ]);
 });
 it('distinguishes begin/end timing and identical-period targets',()=>{
  const p={...basis,initial:100,initialTarget:200,steps:[{rate:0.25,cashflow:20,target:150}]};
  expect(calculate('target-trajectory',{...p,timing:'begin'})).toMatchObject({balance:150,firstTargetPeriod:1});
  expect(calculate('target-trajectory',{...p,timing:'end'})).toMatchObject({balance:145,firstTargetPeriod:null});
 });
 it('handles initial success, empty horizon and exact depletion before shortfall',()=>{
  expect(calculate('target-trajectory',{...target,initialTarget:100,steps:[]})).toMatchObject({balance:100,firstTargetPeriod:0,horizon:0,exactZeroPeriod:null,firstShortfallPeriod:null});
  expect(calculate('target-trajectory',{...target,initial:0,initialTarget:1,steps:[]})).toMatchObject({firstTargetPeriod:null,exactZeroPeriod:0});
  expect(calculate('target-trajectory',{...target,steps:[{rate:0,cashflow:-100,target:1},{rate:0,cashflow:-1,target:1}]})).toMatchObject({exactZeroPeriod:1,firstShortfallPeriod:2});
 });
 it('accepts the bounded 10000-period horizon without unbounded search',()=>{
  const out=calculate('target-trajectory',{...target,steps:Array.from({length:10000},()=>({rate:0,cashflow:1,target:10100}))});
  expect(out).toMatchObject({balance:10100,firstTargetPeriod:10000,horizon:10000});
  expect(out.rows).toHaveLength(10001);
 });
 it.each([{timing:'annual'},{initialTarget:-1},{initial:-1},{steps:[{rate:0,cashflow:0,target:1,age:65}]},{steps:[{rate:-1,cashflow:0,target:1}]},{steps:[{rate:0,cashflow:0}]}])('rejects ambiguous/incomplete profiles %j',change=>expect(()=>calculate('target-trajectory',{...target,...change})).toThrow());
 it('rejects excessive work and overflowing trajectories',()=>{
  expect(()=>calculate('target-trajectory',{...target,steps:Array(10001).fill({rate:0,cashflow:0,target:1})})).toThrow();
  expect(()=>calculate('target-trajectory',{...target,initial:Number.MAX_VALUE,steps:[{rate:1,cashflow:0,target:1}]})).toThrow();
 });
});

describe('version-bound immutable private workflow exchange',()=>{
 it.each([['disclosed-lease',lease],['heat-costs',heat],['target-trajectory',target]] as const)('round-trips the actual %s engine with dependencies', (id,input)=>{
  const snapshot=exportPrivateWorkflow(`private.workflow.${id}`,input);
  expect(snapshot.schemaVersion).toBe(1);
  expect(snapshot.calculation.calculatorVersion).toBe(1);
  expect(snapshot.dependencies.length).toBeGreaterThan(0);
  expect(Object.isFrozen(snapshot)).toBe(true);
  expect(Object.isFrozen(snapshot.calculation.input)).toBe(true);
  expect(Object.isFrozen(snapshot.calculation.output)).toBe(true);
  expect(importPrivateWorkflow(JSON.parse(JSON.stringify(snapshot)))).toEqual(snapshot);
 });
 it('detaches nested inputs and outputs and freezes trace rows',()=>{
  const input=structuredClone(target), snapshot=exportPrivateWorkflow('private.workflow.target-trajectory',input);
  input.steps[0].cashflow=999;
  expect((snapshot.calculation.input.steps as typeof target.steps)[0].cashflow).toBe(10);
  expect(Object.isFrozen(snapshot.calculation.output.rows)).toBe(true);
  expect(Object.isFrozen((snapshot.calculation.output.rows as unknown[])[0])).toBe(true);
 });
 it.each(['output','version','identity','dependency','extra','schema'])('rejects forged %s',kind=>{
  const s=JSON.parse(JSON.stringify(exportPrivateWorkflow('private.workflow.disclosed-lease',lease)));
  if(kind==='output')s.calculation.output.totalPayment=0;
  if(kind==='version')s.calculation.calculatorVersion=2;
  if(kind==='identity')s.workflowId='finance.auto-lease';
  if(kind==='dependency')s.dependencies[0].version=2;
  if(kind==='extra')s.accepted=true;
  if(kind==='schema')s.schemaVersion=2;
  expect(()=>importPrivateWorkflow(s)).toThrow();
 });
 it('accepts reordered JSON object keys but rejects unknown nested output fields',()=>{
  const s=JSON.parse(JSON.stringify(exportPrivateWorkflow('private.workflow.disclosed-lease',lease)));
  s.calculation.output=Object.fromEntries(Object.entries(s.calculation.output).reverse());
  expect(importPrivateWorkflow(s).calculation.output.totalPayments).toBe(12333);
  s.calculation.output.accepted=true;
  expect(()=>importPrivateWorkflow(s)).toThrow();
 });
 it('has exactly three unregistered draft definitions and rejects unknown identity',()=>{
  expect(privateWorkflowDefinitions).toHaveLength(3);
  expect(privateWorkflowDefinitions.every(d=>d.reviewStatus==='draft'&&d.version===1)).toBe(true);
  expect(()=>exportPrivateWorkflow('finance.auto-lease',lease)).toThrow();
 });
});
