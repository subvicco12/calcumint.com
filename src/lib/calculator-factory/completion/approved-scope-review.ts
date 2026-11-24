import {z} from 'zod';
import {exportPrivateWorkflow} from '@/calculators/private-scenario-workflows';
import {roundTo} from '@/calculators/precision';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '../workflows';
import {serializeCalculationPdf} from '@/lib/calculation-export-pdf';
import {retirementAgeReview} from './retirement-age-review';

const money=z.number().finite().nonnegative().max(1e12).refine(value=>value===0||value>=0.01,'Enter zero or at least 0.01 units');
const contributionInput=z.object({
 initial:money,
 contribution:money.refine(value=>value>0,'Enter a positive recurring contribution'),
 contributionEveryMonths:z.number().int().min(1).max(12),
 monthlyRatePercent:z.number().finite().min(-10).max(10),
 durationMonths:z.number().int().min(1).max(600),
 timing:z.enum(['begin','end']),
 currency:z.string().regex(/^[A-Z]{3}$/),
}).strict().refine(input=>input.contributionEveryMonths<=input.durationMonths,'Include at least one complete contribution interval');

export const contributionProjectionScope='Supplied constant monthly effective rate. Compounds monthly. Contributions occur at the beginning or end of each complete selected interval. No contribution is added for a partial interval. Outputs are model amounts rounded once to two decimals, independent of currency minor units. Taxes, fees and investment recommendations are outside this model.';

const contributionIdentity={
 catalogId:57,engineId:'private.review.recurring-contributions',
 calculatorSlug:'private-review-recurring-contributions',calculatorVersion:1,
 sourceVersion:'private.review.recurring-contributions.20261124.1',
} as const;

/** Proposed capture identity only. The historical #57 lump-sum binding stays active. */
export const contributionProjectionReview=createFactoryWorkflows({
 identity:contributionIdentity,
 execute(raw){
  const {initial,contribution,contributionEveryMonths,monthlyRatePercent,durationMonths,timing,currency}=contributionInput.parse({
   ...raw,initial:requiredCalculatorNumber(raw.initial),contribution:requiredCalculatorNumber(raw.contribution),
   contributionEveryMonths:requiredCalculatorNumber(raw.contributionEveryMonths),
   monthlyRatePercent:requiredCalculatorNumber(raw.monthlyRatePercent),durationMonths:requiredCalculatorNumber(raw.durationMonths),
  });
  const contributionCount=Math.floor(durationMonths/contributionEveryMonths);
  const completeMonths=contributionCount*contributionEveryMonths;
  const steps=Array.from({length:durationMonths},(_,month)=>{
   const contributionBoundary=timing==='begin'?month:month+1;
   const due=month<completeMonths&&contributionBoundary%contributionEveryMonths===0;
   return {rate:monthlyRatePercent/100,target:0,cashflow:due?contribution:0};
  });
  const projected=exportPrivateWorkflow('private.workflow.target-trajectory',{currency,period:'month',initial,initialTarget:0,timing,steps}).calculation.output;
  const balance=z.number().finite().positive().max(1e12).parse(projected.balance);
  const totalContributions=contributionCount*contribution;
  const finalBalance=roundTo(balance,2);
  if(finalBalance===0)throw Error('Positive balance is below the displayed resolution');
  return {
   calculatorSlug:contributionIdentity.calculatorSlug,calculatorVersion:contributionIdentity.calculatorVersion,
   input:{initial,contribution,contributionEveryMonths,monthlyRatePercent,durationMonths,timing,currency},
   output:{contributionCount,totalContributions:roundTo(totalContributions,2),projectedGrowth:roundTo(balance-initial-totalContributions,2),finalBalance},
  };
 },
});

export const retirementAgeProjectionScope='Supplied monthly effective rates and cash flows. Ten-year limit (120 months). This projection does not determine retirement eligibility or provide investment recommendations.';

/** Add delivery labels to the retained review without changing its packet or v1. */
export const retirementAgeDeliveryReview=createFactoryWorkflows({
 identity:{...retirementAgeReview.identity,sourceVersion:'private.review.retirement-age-delivery.20261124.1'},
 execute(raw){
  const {snapshot}=retirementAgeReview.execute(raw);
  const {firstTargetPeriod,firstShortfallPeriod}=snapshot.output;
  return {...snapshot,output:{...snapshot.output,
   targetStatus:firstTargetPeriod===0?'already-met':firstTargetPeriod===null?'target-not-met':'target-met',
   withdrawalStatus:firstShortfallPeriod===null?'no-shortfall':'unfunded-withdrawal',
  }};
 },
});

const reviewContracts={
 57:{workflow:contributionProjectionReview,title:'Recurring contribution projection',scope:contributionProjectionScope},
 82:{workflow:retirementAgeDeliveryReview,title:'Bounded retirement-age projection',scope:retirementAgeProjectionScope},
} as const;

/** Local review exports. A caller's plan selection does not grant an account entitlement. */
export function exportApprovedScopeReview(
 catalogId:keyof typeof reviewContracts,packet:FactoryExecutionPacket,format:'json'|'csv'|'pdf',plan:'free'|'pro'|'business',
){
 const {workflow,title,scope}=reviewContracts[catalogId];
 if(format!=='pdf')return workflow.exportPacket(packet,format,plan);
 const verified=workflow.replay(workflow.exportPacket(packet,'json',plan));
 return serializeCalculationPdf(verified.snapshot,{title,methodology:scope});
}
