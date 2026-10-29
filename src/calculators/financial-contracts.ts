import {z} from 'zod';
import Decimal from 'decimal.js';
import type {CalculatorDefinition} from './types';
import {runCalculator} from './engine';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
import register from '../../data/catalog/source-driven-2026-10-27/engineering-register.json';
import {basis,money,loanSchema,purchaseSchema,rentalSchema,finance,purchase,rental,ledger,compare,match,sum,ledgerDependency} from './financial-contract-core';

const schemas={
 21:z.object({...basis,existingLoans:z.array(loanSchema).min(1).max(20),consolidatedLoan:loanSchema,financedFee:money,upfrontFee:money}).strict(),
 32:z.object({...basis,purchase:purchaseSchema,rentUpfront:money,rentPayments:z.array(money).max(600),rentRefund:money}).strict(),
 36:z.object({...basis,rental:rentalSchema}).strict(),
 43:z.object({...basis,rental:rentalSchema}).strict(),
 46:z.object({...basis,purchase:purchaseSchema,rehabilitationCosts:z.array(money).max(600)}).strict(),
 49:z.object({...basis,rental:rentalSchema}).strict(),
 468:z.object({...basis,purchase:purchaseSchema,availableUpfrontCash:money,periodBudget:money}).strict(),
 470:z.object({...basis,purchase:purchaseSchema,leaseUpfront:money,leasePayments:z.array(money).max(600),leaseEndCharges:money}).strict(),
 472:z.object({...basis,purchase:purchaseSchema,cashUpfrontCosts:money}).strict(),
};
type Id=keyof typeof schemas;
type Output=Record<string,unknown>;
// Input numbers can span subnormal through 1e12. Preserve their declared
// decimal values when checking principal conservation; an epsilon would accept
// unexplained debt and binary equality rejects ordinary 0.1+0.2=0.3 inputs.
const PrincipalDecimal=Decimal.clone({precision:400});
function calculate(id:Id,raw:unknown):Output{
 switch(id){
  case 21:{
   const p=schemas[id].parse(raw),h=p.consolidatedLoan.steps.length;
   p.existingLoans.forEach(l=>match(l.steps.length,h));
   const principal=p.existingLoans.reduce((total,l)=>total.plus(l.openingDebt),new PrincipalDecimal(p.financedFee));
   if(!principal.equals(p.consolidatedLoan.openingDebt))throw Error('Consolidated principal must equal existing principal plus explicitly financed fee');
   const loans=p.existingLoans.map(finance),consolidated=finance(p.consolidatedLoan);
   const existing={terminalDebt:sum(loans.map(l=>l.terminalDebt)),totalPayments:sum(loans.map(l=>l.totalPayments)),loans};
   const left=ledger(p,h,Array.from({length:h},(_,i)=>({at:i+1,outflow:sum(loans.map(l=>l.financingRows[i].payment))})),existing.terminalDebt);
   const right=ledger(p,h,[{at:0,outflow:p.upfrontFee},...consolidated.financingRows.map(r=>({at:r.at,outflow:r.payment}))],consolidated.terminalDebt);
   return {existing,consolidated,comparison:compare(left,right,p)};
  }
  case 32:{
   const p=schemas[id].parse(raw),buy=purchase(p.purchase,p),h=p.rentPayments.length;match(h,p.purchase.loan.steps.length);
   const rent=ledger(p,h,[{at:0,outflow:p.rentUpfront},...p.rentPayments.map((outflow,i)=>({at:i+1,outflow}))],0,p.rentRefund);
   return {purchase:buy,comparison:compare(rent,buy.cashLedger,p)};
  }
  case 36:{const p=schemas[id].parse(raw);return rental(p.rental,p);}
  case 43:{const p=schemas[id].parse(raw);const r=rental(p.rental,p);return {totalContributions:r.totalContributions,totalDistributions:r.totalDistributions,profit:r.profit,totalReturnPercent:r.totalReturnPercent,rental:r};}
  case 46:{
   const p=schemas[id].parse(raw);match(p.rehabilitationCosts.length,p.purchase.loan.steps.length);
   const buy=purchase({...p.purchase,periodCosts:p.purchase.periodCosts.map((v,i)=>sum([v,p.rehabilitationCosts[i]]))},p);
   return {purchase:buy,rehabilitationTotal:sum(p.rehabilitationCosts),profit:-buy.nominalNetCost};
  }
  case 49:{
   const p=schemas[id].parse(raw),r=rental(p.rental,p);
   return {...r,totalPrincipalRepaid:sum(r.financingRows.map(row=>row.principalRepaid)),presentCost:compare(r.cashLedger,ledger(p,r.rows.length,[]),p).left};
  }
  case 468:{
   const p=schemas[id].parse(raw),buy=purchase(p.purchase,p);
   const upfrontShortfall=Math.max(sum([buy.initialEquityCash,-p.availableUpfrontCash]),0);
   const deficits=buy.periodOutflows.map(v=>Math.max(sum([v,-p.periodBudget]),0));
   const first=deficits.findIndex(v=>v>0),maxPeriodShortfall=Math.max(0,...deficits);
   return {purchase:buy,upfrontShortfall,maxPeriodShortfall,firstOverBudgetPeriod:first<0?null:first+1,withinSuppliedBudget:upfrontShortfall===0&&maxPeriodShortfall===0};
  }
  case 470:{
   const p=schemas[id].parse(raw),buy=purchase(p.purchase,p),h=p.leasePayments.length;match(h,p.purchase.loan.steps.length);
   const lease=ledger(p,h,[{at:0,outflow:p.leaseUpfront},...p.leasePayments.map((outflow,i)=>({at:i+1,outflow})),{at:h,outflow:p.leaseEndCharges}]);
   return {purchase:buy,comparison:compare(lease,buy.cashLedger,p)};
  }
  case 472:{
   const p=schemas[id].parse(raw),buy=purchase(p.purchase,p);
   const cash=purchase({...p.purchase,upfrontCosts:p.cashUpfrontCosts,loan:{openingDebt:0,steps:p.purchase.loan.steps.map(()=>({rate:0,payment:0}))}},p);
   return {purchase:buy,cash,comparison:compare(buy.cashLedger,cash.cashLedger,p)};
  }
 }
}
const common='Supplied currency and identical explicit period. Fractional rate per exact period, interest before end-period payment, capped payment, no APR conversion or invoice rounding. Finite IEEE-754 arithmetic, compensated sums and underflow/overflow rejection. No tax, depreciation, lender/provider/eligibility or source-effective-date decisions. RELEASE HOLD.';
const methods:Record<Id,string>={
 21:'Existing loan cashflows versus consolidated financing, including separately paid and capitalized fees. Principal must reconcile. Terminal debts included at the same horizon; positive difference favors consolidation.',
 32:'Rent upfront/payments less supplied terminal refund versus purchase equity/upfront costs/running costs/actual payments and terminal sale equity. Selling costs and debt payoff exactly once. Positive difference favors buying.',
 36:'Collected rent = scheduled minus uncollected. NOI excludes debt service, capex and reserves. Owner cashflow subtracts these separately. Unspent ring-fenced reserves remain an asset, returned once at exit. No taxable-income interpretation.',
 43:'Total holding-period return, not annualized or IRR: (distributions-contributions)/contributions. Contributions include initial equity and interim/exit cash deficits; distributions include positive owner cashflows and positive exit equity. Zero contributions yield null.',
 46:'Flip profit is terminal sale proceeds less acquisition equity, upfront costs, running/rehabilitation costs, actual financing payments, selling costs and remaining debt. Loan advance is excluded from equity paid, not subtracted again as a cost.',
 49:'Mortgage financing trace reconciles opening principal, interest, payment, principal change and terminal debt with rental NOI, capex and reserve flows. Remaining debt reduces terminal equity once; present cost discounts the derived ledger.',
 468:'Compare initial cash and recurring purchase outflows against explicitly supplied cash and per-period budgets. Shows first/max recurring deficit. Terminal sale/payoff is excluded from the budget test and shown separately; this is not underwriting or a maximum-price recommendation.',
 470:'Compare disclosed lease upfront, periodic and end charges with financed purchase and supplied terminal sale. No lease fee, residual, APR or money-factor inference. Positive difference favors buying.',
 472:'Compare financed purchase versus all-cash purchase with separately supplied upfront costs and otherwise identical running/sale assumptions. Positive difference means the loan scenario has greater present cost.',
};
const ids=Object.keys(schemas).map(Number) as Id[];
const sourceBindings=Object.freeze(Object.fromEntries(ids.map(id=>[id,Object.freeze(register.rows.find(r=>r.masterId===id)!.sourceEvidence.map(s=>Object.freeze({ordinal:s.ordinal,sha256:s.observationRecordSHA256})))])));
export const financialContracts:readonly CalculatorDefinition<unknown,Output>[]=Object.freeze(ids.map(id=>{
 const row=register.rows.find(r=>r.masterId===id)!;
 return Object.freeze({id:`private.financial.${id}`,slug:`private-financial-${id}`,title:row.title+' — supplied private contract',category:'private-financial-contracts',version:1,riskClass:'financial',reviewStatus:'draft',inputSchema:schemas[id],calculate:(raw:unknown)=>calculate(id,raw),
  formulas:Object.freeze([Object.freeze({id:`financial-${id}`,expression:'interest=openingDebt*rate; payment=min(requested,openingDebt+interest); closingDebt=openingDebt+interest-payment; PV=sum(outflow[t]/(1+r)^t)+(terminalDebt-terminalAsset)/(1+r)^H',description:methods[id]+' '+common})]),
  sources:Object.freeze(row.sourceEvidence.map(s=>Object.freeze({label:`Archived source observation ${s.ordinal}`,url:s.url,note:`Observation-record SHA256 ${s.observationRecordSHA256}; publisher bytes, normative version, full canonical contract and applicability unaccepted. Not a current-source or institutional approval.`}))),examples:Object.freeze([]),
 });
}));
function definition(id:string){const d=financialContracts.find(d=>d.id===id);if(!d)throw Error('Unknown private financial contract');return d;}
export function exportFinancialContract(id:string,input:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);
 const d=definition(id),run=runCalculator(d,input),masterId=Number(id.split('.').at(-1)) as Id;
 return Object.freeze({schemaVersion:1 as const,profileId:id,
  dependency:Object.freeze({id:ledgerDependency.id,version:ledgerDependency.version}),sources:sourceBindings[masterId],
  calculation:createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,input:run.input as Record<string,unknown>,output:run.output}),
 });
}
const envelope=z.object({schemaVersion:z.literal(1),profileId:z.string(),dependency:z.object({id:z.string(),version:z.literal(1)}).strict(),sources:z.array(z.object({ordinal:z.number().int(),sha256:z.string().regex(/^[0-9a-f]{64}$/)}).strict()).min(1).max(3),calculation:z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict()}).strict();
function equal(a:unknown,b:unknown):boolean{
 if(a===b)return true;
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(key=>Object.hasOwn(b,key)&&equal((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key]));
}
export function importFinancialContract(raw:unknown){
 const supplied=envelope.parse(copyCalculationData({envelope:raw},{}).input.envelope);
 const expected=exportFinancialContract(supplied.profileId,supplied.calculation.input);
 if(!equal(supplied,expected))throw Error('Financial snapshot does not match its source/dependency/version/actual-engine contract');
 return expected;
}

const b={currency:'USD',period:'month',scope:'supplied-cashflows-no-tax',discountRate:0};
const loan={openingDebt:600,steps:[{rate:0.1,payment:200},{rate:0.1,payment:200}]};
const p={price:1000,upfrontCosts:50,loan,periodCosts:[10,20],terminalValue:1200,sellingCosts:60};
const r={price:1000,upfrontCosts:50,loan,terminalValue:1200,sellingCosts:60,periods:[{scheduledRent:200,uncollectedRent:20,operatingCosts:30,capex:10,reserveContribution:20},{scheduledRent:300,uncollectedRent:0,operatingCosts:40,capex:0,reserveContribution:30}]};
const examples={
 21:{...b,existingLoans:[{openingDebt:600,steps:[{rate:0.1,payment:100}]},{openingDebt:400,steps:[{rate:0.1,payment:100}]}],consolidatedLoan:{openingDebt:1050,steps:[{rate:0,payment:200}]},financedFee:50,upfrontFee:10},
 32:{...b,purchase:p,rentUpfront:20,rentPayments:[250,250],rentRefund:10},36:{...b,rental:r},43:{...b,rental:r},46:{...b,purchase:p,rehabilitationCosts:[100,0]},49:{...b,rental:r},468:{...b,purchase:p,availableUpfrontCash:450,periodBudget:200},470:{...b,purchase:p,leaseUpfront:20,leasePayments:[150,150],leaseEndCharges:30},472:{...b,purchase:p,cashUpfrontCosts:50},
};
export const financialExamples:Readonly<Record<string,Record<string,unknown>>>=copyCalculationData(Object.fromEntries(ids.map(id=>[`private.financial.${id}`,examples[id]])),{}).input as Record<string,Record<string,unknown>>;
