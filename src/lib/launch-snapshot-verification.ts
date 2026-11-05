/** Exact v1 arithmetic agreement only; never rewrite historical records or grant approval. */
import {z} from 'zod';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';

// Explicit reviewed engineering cohort; do not auto-enroll future definitions or versions.
// #214 method policy, #217 identity and #268 successor adoption remain excluded.
export const launchReplaySlugs:readonly string[]=Object.freeze([
 "percentage-increase-calculator",
 "percentage-decrease-calculator",
 "square-calculator",
 "cube-calculator",
 "square-root-calculator",
 "cube-root-calculator",
 "reciprocal-calculator",
 "hypotenuse-calculator",
 "triangle-area-calculator",
 "rectangle-area-calculator",
 "rectangle-perimeter-calculator",
 "square-area-calculator",
 "square-perimeter-calculator",
 "circle-diameter-calculator",
 "parallelogram-area-calculator",
 "trapezoid-area-calculator",
 "rectangular-prism-volume-calculator",
 "pythagorean-theorem-calculator",
 "degrees-to-radians-calculator",
 "radians-to-degrees-calculator",
 "percentage-change-calculator",
 "ratio-calculator",
 "proportion-calculator",
 "fraction-calculator",
 "fraction-to-decimal-calculator",
 "average-two-numbers-calculator",
 "gcf-calculator",
 "factor-calculator",
 "circle-area-calculator",
 "circle-circumference-calculator",
 "sphere-volume-calculator",
 "sphere-surface-area-calculator",
 "cylinder-volume-calculator",
 "cone-volume-calculator",
 "exponent-calculator",
 "logarithm-calculator",
 "remainder-calculator",
 "lcm-calculator",
 "scientific-notation-calculator",
 "percent-error-calculator",
 "rounding-calculator"
]);
const shape=z.object({calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyLaunchSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean));
 const definition=launchDefinitions.find(row=>row.slug===snapshot.calculatorSlug&&row.version===1);
 if(!launchReplaySlugs.includes(snapshot.calculatorSlug)||!definition||definition.id!==`launch-${snapshot.calculatorSlug}`)throw Error('Exact launch v1 contract unavailable; no current-engine fallback or historical upgrade is applied.');
 const input=definition.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Recorded input contains unsupported fields; original history is unchanged.');
 const output=runCalculator(definition,input).output;
 if(!sameRecordedJson(output,snapshot.output))throw Error('Recorded output does not agree with its exact immutable engine; original history is unchanged.');
 return Object.freeze({snapshot,engineId:definition.id,engineVersion:1,scope:'Exact recorded launch v1 forward-engine arithmetic agreement only. No canonical mapping, full-domain proof, source authentication, qualified review, certification or publication approval is established.'});
}
