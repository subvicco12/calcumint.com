import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {runCalculator} from './engine';
import {privateSuppliedDefinitions} from './private-supplied-contracts';
import {createCalculationSnapshot, copyCalculationData} from '../lib/calculation-snapshot';
import {divideFinite, multiplyFinite, sumFinite} from './owner-model-support';

// New, unregistered engineering profiles. The seven original definitions and
// their historical hashes remain unchanged. No policy, tax or age model inferred.
const amount=z.number().finite().nonnegative();
const basis={currency:z.string().trim().min(1).max(160),period:z.string().trim().min(1).max(160)};
const leaseSchema=z.object({...basis,capitalized:amount,residual:amount,rentCharge:amount,payments:z.number().int().min(1).max(10000),disclosedChargePerPayment:amount}).strict();
const heatSchema=z.object({...basis,usefulHeatKWh:amount,baselineEfficiency:amount.positive().max(1),scop:amount.positive(),baselinePricePerKWh:amount,heatPumpPricePerKWh:amount,auxiliaryKWh:amount}).strict();
const targetSchema=z.object({...basis,initial:amount,initialTarget:amount,timing:z.enum(['begin','end']),steps:z.array(z.object({rate:z.number().finite().gt(-1),cashflow:z.number().finite(),target:amount}).strict()).max(10000)}).strict();
type Output=Record<string,unknown>;
type Definition=CalculatorDefinition<unknown,Output>;
const dependency=(id:string)=>{
 const d=privateSuppliedDefinitions.find(d=>d.id===`private.${id}`);
 if(!d)throw Error('Missing private arithmetic dependency');
 return d;
};
const leaseDependency=dependency('supplied-lease-base');
const heatDependency=dependency('supplied-heat-balance');
const targetDependency=dependency('supplied-balance-projection');

function disclosedLease(raw:unknown):Output{
 const p=leaseSchema.parse(raw);
 const {disclosedChargePerPayment,...base}=p;
 const {basePayment}=runCalculator(leaseDependency,base).output as {basePayment:number};
 const depreciationTotal=sumFinite([p.capitalized,-p.residual]);
 const baseTotal=sumFinite([p.capitalized,-p.residual,p.rentCharge]);
 const disclosedChargesTotal=multiplyFinite(disclosedChargePerPayment,p.payments);
 return {depreciationTotal,basePayment,disclosedChargePerPayment,totalPayment:sumFinite([basePayment,disclosedChargePerPayment]),baseTotal,disclosedChargesTotal,totalPayments:sumFinite([baseTotal,disclosedChargesTotal])};
}
function heatCosts(raw:unknown):Output{
 const p=heatSchema.parse(raw);
 const {savings}=runCalculator(heatDependency,p).output as {savings:number};
 const baselineInputKWh=divideFinite(p.usefulHeatKWh,p.baselineEfficiency);
 const heatPumpCoreKWh=divideFinite(p.usefulHeatKWh,p.scop);
 const heatPumpTotalKWh=sumFinite([heatPumpCoreKWh,p.auxiliaryKWh]);
 const baselineCost=multiplyFinite(baselineInputKWh,p.baselinePricePerKWh);
 const heatPumpCost=multiplyFinite(heatPumpTotalKWh,p.heatPumpPricePerKWh);
 return {baselineInputKWh,heatPumpCoreKWh,heatPumpTotalKWh,baselineCost,heatPumpCost,savings,breakEvenElectricityPrice:heatPumpTotalKWh===0?null:divideFinite(baselineCost,heatPumpTotalKWh)};
}
function targetTrajectory(raw:unknown):Output{
 const p=targetSchema.parse(raw);
 let balance=p.initial, firstTargetPeriod:number|null=balance>=p.initialTarget?0:null;
 let exactZeroPeriod:number|null=balance===0?0:null, firstShortfallPeriod:number|null=null;
 const rows=[{at:0,balance,target:p.initialTarget,reached:balance>=p.initialTarget,shortfall:0}];
 for(const [index,step] of p.steps.entries()){
  // One actual dependency step per period keeps work linear, without repeating
  // an entire growing prefix or treating an initial-zero flag as a later event.
  const available=p.timing==='end'?multiplyFinite(balance,1+step.rate):balance;
  const shortfall=step.cashflow<0&&-step.cashflow>available?sumFinite([-step.cashflow,-available]):0;
  const result=runCalculator(targetDependency,{currency:p.currency,period:p.period,initial:balance,timing:p.timing,steps:[{rate:step.rate,cashflow:step.cashflow}]}).output as {balance:number};
  balance=result.balance;
  const at=index+1,reached=balance>=step.target;
  if(firstTargetPeriod===null&&reached)firstTargetPeriod=at;
  if(exactZeroPeriod===null&&balance===0)exactZeroPeriod=at;
  if(firstShortfallPeriod===null&&shortfall>0)firstShortfallPeriod=at;
  rows.push({at,balance,target:step.target,reached,shortfall});
 }
 return {balance,firstTargetPeriod,exactZeroPeriod,firstShortfallPeriod,horizon:p.steps.length,rows};
}

const provenance='Archived observations only: data/catalog/source-driven-2026-10-27/engineering-register.json. No publisher-byte capture, canonical acceptance, qualified approval or publication authority. RELEASE HOLD.';
function definition(id:string,title:string,inputSchema:z.ZodType,calculate:(input:unknown)=>Output,expression:string,description:string,url:string):Definition{
 return Object.freeze({id:`private.workflow.${id}`,slug:`private-workflow-${id}`,title,category:'private-scenario-workflows',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,calculate,
  formulas:Object.freeze([{id,expression,description}]),sources:Object.freeze([{label:'Limited source observation; engineering scenario only',url,note:provenance}]),examples:Object.freeze([])});
}
export const privateWorkflowDefinitions:readonly Definition[]=Object.freeze([
 definition('disclosed-lease','Disclosed lease payment reconciliation',leaseSchema,disclosedLease,
  'base=(capitalized-residual+rentCharge)/payments; totalPayment=base+disclosedChargePerPayment',
  'Caller supplies disclosed costs and a uniform additional charge per payment. Totals exclude upfront/end charges. Unrounded IEEE-754, not invoice rounding, tax calculation or a money-factor model. A negative disclosed depreciation is retained, not clipped.',
  'https://www.federalreserve.gov/pubs/leasing/formce/description.htm'),
 definition('heat-costs','Supplied heat energy and cost breakdown',heatSchema,heatCosts,
  'baselineEnergy=Q/efficiency; electricity=Q/SCOP+auxiliary; breakEvenPrice=baselineCost/electricity',
  'Same useful heat kWh, currency and period; auxiliary electricity external to SCOP. Break-even tariff holds all supplied quantities fixed; null when electricity is zero. No installed-performance, tariff eligibility or safety inference. Unrounded IEEE-754.',
  'https://etl.energysecurity.gov.uk/products/heat-pumps/air-water-heat-pumps'),
 definition('target-trajectory','Supplied finite target trajectory',targetSchema,targetTrajectory,
  'B[t]=supplied balance projection step; firstTargetPeriod=min{t:B[t]>=suppliedTarget[t]}',
  'Period zero uses initialTarget; each step supplies the target at that exact period end. Begin/end controls cashflow timing. Withdrawals capped at available balance; unmet requested withdrawal is shortfall. At most 10000 steps, no age selection, annualization, target recommendation or retirement safety claim. Unrounded IEEE-754.',
  'https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator'),
]);
const dependencies:Readonly<Record<string,readonly Definition[]>>=Object.freeze({
 'private.workflow.disclosed-lease':Object.freeze([leaseDependency]),
 'private.workflow.heat-costs':Object.freeze([heatDependency]),
 'private.workflow.target-trajectory':Object.freeze([targetDependency]),
});
const workflow=(id:string)=>{
 const d=privateWorkflowDefinitions.find(d=>d.id===id);
 if(!d)throw Error('Unknown private workflow');
 return d;
};
export function exportPrivateWorkflow(id:string,input:unknown){
 const d=workflow(id),run=runCalculator(d,input);
 const calculation=createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,input:run.input as Record<string,unknown>,output:run.output});
 return Object.freeze({schemaVersion:1 as const,workflowId:id,dependencies:Object.freeze(dependencies[id].map(d=>Object.freeze({id:d.id,version:d.version}))),calculation});
}
const envelopeSchema=z.object({schemaVersion:z.literal(1),workflowId:z.string(),dependencies:z.array(z.object({id:z.string(),version:z.literal(1)}).strict()).length(1),calculation:z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict()}).strict();
// JSON object order is immaterial. Arrays and every field/value remain exact.
function equalJson(a:unknown,b:unknown):boolean{
 if(a===b)return true;
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const left=Object.keys(a),right=Object.keys(b);
 return left.length===right.length&&left.every(key=>Object.hasOwn(b,key)&&equalJson((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key]));
}
export function importPrivateWorkflow(raw:unknown){
 // Reject accessors, non-JSON prototypes, cycles and non-finite values before
 // parsing. Replay never trusts caller-supplied identity metadata or outputs.
 const safe=copyCalculationData({envelope:raw},{}).input.envelope;
 const supplied=envelopeSchema.parse(safe);
 const expected=exportPrivateWorkflow(supplied.workflowId,supplied.calculation.input);
 if(!equalJson(supplied,expected))throw Error('Private workflow export does not match its version-bound engine result');
 return expected;
}
