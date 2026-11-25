import {z} from 'zod';
import {exportPrivateWorkflow} from '@/calculators/private-scenario-workflows';
import {parseFinalPrivateSnapshotText} from '@/lib/final-private-snapshot-text';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {createFactoryWorkflows} from '../workflows';

const limit=1799;
const reviewInput=z.object({
 currentAgeMonths:z.number().int().min(0).max(limit),
 currency:z.string().regex(/^[A-Z]{3}$/),
 initial:z.number().finite().nonnegative(),
 initialTarget:z.number().finite().nonnegative(),
 timing:z.enum(['begin','end']),
 steps:z.array(z.object({
  rate:z.number().finite().gt(-1).max(1),
  cashflow:z.number().finite(),
  target:z.number().finite().nonnegative(),
 }).strict()).max(120),
}).strict().refine(input=>input.currentAgeMonths+input.steps.length<=limit,'Age exceeds the proposed review range');

const identity={
 catalogId:82,engineId:'private.workflow.target-trajectory',
 calculatorSlug:'private-workflow-target-trajectory',calculatorVersion:2,
 sourceVersion:'private.review.retirement-age-monthly.20261124.1',
} as const;

/** Review only. The proposed successor is absent from active routes and dispatch. */
export const retirementAgeReview=createFactoryWorkflows({
 identity,
 execute(raw){
  if(Object.keys(raw).sort().join(',')!=='currency,currentAgeMonths,initial,initialTarget,steps,timing')throw Error('Supply exact retirement age review fields');
  const {currentAgeMonths,...monthly}=reviewInput.parse({
   ...raw,currentAgeMonths:requiredCalculatorNumber(raw.currentAgeMonths),
   initial:requiredCalculatorNumber(raw.initial),initialTarget:requiredCalculatorNumber(raw.initialTarget),
   steps:parseFinalPrivateSnapshotText(raw.steps),
  });
  const trajectory=exportPrivateWorkflow(identity.engineId,{...monthly,period:'month'}).calculation;
  const {firstTargetPeriod,firstShortfallPeriod}=trajectory.output;
  const attainedAge=(period:unknown)=>period===null?null:currentAgeMonths+z.number().int().min(0).max(monthly.steps.length).parse(period);
  return {
   calculatorSlug:identity.calculatorSlug,calculatorVersion:identity.calculatorVersion,
   input:{...trajectory.input,currentAgeMonths},
   output:{...trajectory.output,firstTargetAgeMonths:attainedAge(firstTargetPeriod),firstShortfallAgeMonths:attainedAge(firstShortfallPeriod)},
  };
 },
});
