import {z} from 'zod';
import {runCalculator} from './engine';
import {sourceBoundProfiles,profileSourceBindings} from './source-bound-profiles';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
export type ReviewPlan='free'|'pro'|'business';
export function exportSourceProfile(id:string,input:unknown,plan:ReviewPlan='free'){
 // Plan controls no mathematical input or precision. Reject unknown review plans.
 z.enum(['free','pro','business']).parse(plan);
 const d=sourceBoundProfiles.find(d=>d.id===id);if(!d)throw Error('Unknown source profile');
 const run=runCalculator(d,input);
 return Object.freeze({schemaVersion:1 as const,profileId:id,sources:profileSourceBindings[id],calculation:createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,input:run.input as Record<string,unknown>,output:run.output})});
}
const schema=z.object({schemaVersion:z.literal(1),profileId:z.string(),sources:z.array(z.object({id:z.string(),sha256:z.string().regex(/^[0-9a-f]{64}$/)}).strict()).min(1).max(3),calculation:z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict()}).strict();
function equal(a:unknown,b:unknown):boolean{
 if(a===b)return true;
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(key=>Object.hasOwn(b,key)&&equal((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key]));
}
export function importSourceProfile(raw:unknown){
 const supplied=schema.parse(copyCalculationData({envelope:raw},{}).input.envelope);
 const expected=exportSourceProfile(supplied.profileId,supplied.calculation.input);
 if(!equal(supplied,expected))throw Error('Source profile does not match its pinned source/version/engine contract');
 return expected;
}
