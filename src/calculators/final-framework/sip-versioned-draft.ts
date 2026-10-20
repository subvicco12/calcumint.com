/** Offline draft workspace only. Never register this dispatcher as a public route
 * or a persisted financial scenario re-evaluation contract without review. */
import { runCalculator } from '../engine';
import { sipCalculator } from '../finance/sip';
import { sipV2Candidate } from '../finance/sip-v2-candidate';
import { createCalculationSnapshot, type CalculationSnapshot } from '../../lib/calculation-snapshot';
function technicalVersion(value: unknown): 1 | 2 {
 if(value!==1&&value!==2)throw new Error('Unsupported explicit SIP technical version');
 return value;
}
function plainRecord(value: unknown): Record<string,unknown> {
 if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw new Error('Invalid SIP draft record');
 const descriptors=Object.getOwnPropertyDescriptors(value);
 if(Object.values(descriptors).some(field=>!field.enumerable||!('value' in field))||Object.getOwnPropertySymbols(value).length)throw new Error('Invalid SIP draft record fields');
 return value as Record<string,unknown>;
}
/** Fresh explicit-version request; no captured result is ever upgraded/replayed. */
export function calculateSipDraftSnapshot(version: unknown, rawInput: unknown): CalculationSnapshot {
 const selected=technicalVersion(version);
 const run=selected===1?runCalculator(sipCalculator,rawInput):runCalculator(sipV2Candidate,rawInput);
 return createCalculationSnapshot({calculatorSlug:run.slug,calculatorVersion:run.version,input:run.input,output:run.output});
}
/** Captured values remain as recorded. This validates JSON/identity, not their
 * mathematical correctness, certification or permission to re-evaluate them. */
export function readSipCapturedSnapshot(expectedVersion: unknown, raw: unknown): CalculationSnapshot {
 const version=technicalVersion(expectedVersion),record=plainRecord(raw);
 if(Object.keys(record).some(key=>!['calculatorSlug','calculatorVersion','input','output'].includes(key)))throw new Error('Unexpected SIP snapshot field');
 if(record.calculatorSlug!=='sip-calculator'||record.calculatorVersion!==version)throw new Error('SIP captured identity mismatch');
 return createCalculationSnapshot({calculatorSlug:'sip-calculator',calculatorVersion:version,input:plainRecord(record.input),output:plainRecord(record.output)});
}
type DraftScenarioRequest = Readonly<{id:string;input:unknown}>;
type DraftScenario = Readonly<{id:string;status:'ready';snapshot:CalculationSnapshot}>|Readonly<{id:string;status:'unavailable';reason:string}>;
/** New unsaved A/B/C input requests only. Existing financial persistence and
 * certified-standard-risk re-evaluation allowlists are deliberately untouched. */
export function evaluateSipDraftScenarios(version: unknown, requests: readonly DraftScenarioRequest[]): readonly DraftScenario[] {
 const selected=technicalVersion(version);
 if(!Array.isArray(requests)||requests.length<1||requests.length>3)throw new Error('Provide one to three SIP draft scenarios');
 const ids=requests.map(request=>plainRecord(request).id);
 if(ids[0]!=='A'||ids.some(id=>!['A','B','C'].includes(id as string))||new Set(ids).size!==ids.length)throw new Error('Invalid SIP draft scenario identity');
 return Object.freeze(requests.map((request,index)=>{
  try{return Object.freeze({id:request.id,status:'ready' as const,snapshot:calculateSipDraftSnapshot(selected,request.input)});}
  catch(error){if(index===0)throw error;return Object.freeze({id:request.id,status:'unavailable' as const,reason:'Draft input or supported numerical precision is unavailable.'});}
 }));
}

/** These presentation adapters are deliberately reachable only through an
 * explicit v2 request. They never upgrade a v1 capture or registry entry. */
import { buildSipV2DraftProjection, type SipV2DraftProjection } from './sip-v2-projection';
import { buildSipV2DraftAnalytics } from './sip-v2-analytics';
export function buildSipV2DraftWorkspace(version: unknown, rawInput: unknown, context: SipV2DraftProjection['context'] = {}) {
 if(technicalVersion(version)!==2)throw new Error('Draft v2 workspace requires explicit version 2');
 const projection=buildSipV2DraftProjection(rawInput,context);
 const snapshot=calculateSipDraftSnapshot(2,projection.input);
 const analytics=buildSipV2DraftAnalytics(projection.input);
 // Fail closed if adapters ever disagree about the authoritative baseline.
 for(const key of ['futureValue','investedAmount','estimatedGain'] as const){
  if(!Object.is(projection.output[key],snapshot.output[key])||!Object.is(projection.output[key],analytics.baseline.output[key]))throw new Error('SIP v2 workspace baseline mismatch');
 }
 return {identity:projection.identity,reviewStatus:'draft' as const,snapshot,projection,analytics};
}
