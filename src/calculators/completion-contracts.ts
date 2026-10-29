import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {runCalculator} from './engine';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
import register from '../../data/catalog/source-driven-2026-10-27/engineering-register.json';
import {retirementSchemas,retirementMethods,calculateRetirement} from './retirement-contracts';
import {accountingSchemas,accountingMethods,calculateAccounting} from './accounting-completion-contracts';

const schemas={...retirementSchemas,...accountingSchemas};
const methods={...retirementMethods,...accountingMethods};
type Id=keyof typeof schemas;
const ids=Object.keys(schemas).map(Number) as Id[];
function calculate(id:Id,raw:unknown){return id in retirementSchemas?calculateRetirement(id as keyof typeof retirementSchemas,raw):calculateAccounting(id as keyof typeof accountingSchemas,raw);}
const sourceBindings=Object.freeze(Object.fromEntries(ids.map(id=>[id,Object.freeze(register.rows.find(r=>r.masterId===id)!.sourceEvidence.map(s=>Object.freeze({ordinal:s.ordinal,sha256:s.observationRecordSHA256})))])));
const limits='Exact rational numerator/denominator string output. Decimal strings: at most12 integer/6 fractional digits, nonnegative money; explicit period effective rates/inflation in(-1,1]. Maximum600 periods/lines and50 employer tranches. No annual/monthly conversion, display rounding or default policy. Scope and unknown fields validated. RELEASE HOLD.';
export const completionContracts:readonly CalculatorDefinition<unknown,Record<string,unknown>>[]=Object.freeze(ids.map(id=>{
 const row=register.rows.find(r=>r.masterId===id)!;
 return Object.freeze({id:`private.completion.${id}`,slug:`private-completion-${id}`,title:row.title+' — supplied private profile',category:'private-completion-contracts',version:1,riskClass:[125,127,134].includes(id)?'tax':'financial',reviewStatus:'draft',inputSchema:schemas[id],calculate:(raw:unknown)=>calculate(id,raw),
  formulas:Object.freeze([Object.freeze({id:`completion-${id}`,expression:methods[id],description:methods[id]+' '+limits})]),
  sources:Object.freeze(row.sourceEvidence.map(s=>Object.freeze({label:`Preserved source observation ${s.ordinal}`,url:s.url,note:`Observation SHA256 ${s.observationRecordSHA256}. This hashes an archived observation, not publisher bytes. Original governing version, full-product selection and applicability/qualified decisions remain unresolved.`}))),examples:Object.freeze([])});
}));
function definition(masterId:number){const d=completionContracts.find(d=>d.id===`private.completion.${masterId}`);if(!d)throw Error('Unknown completion contract');return d;}
export function exportCompletion(masterId:number,input:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);const d=definition(masterId),run=runCalculator(d,input);
 return Object.freeze({schemaVersion:1 as const,masterId,profileId:d.id,sources:sourceBindings[masterId],
  calculation:createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,input:run.input as Record<string,unknown>,output:run.output})});
}
const envelope=z.object({schemaVersion:z.literal(1),masterId:z.number().int(),profileId:z.string(),sources:z.array(z.object({ordinal:z.number().int(),sha256:z.string().regex(/^[a-f0-9]{64}$/)}).strict()).min(1).max(3),calculation:z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict()}).strict();
export function equalCompletionJson(a:unknown,b:unknown):boolean{
 if(a===b)return true;
 if(a===null||b===null||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(key=>Object.hasOwn(b,key)&&equalCompletionJson((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key]));
}
export function importCompletion(raw:unknown){
 const supplied=envelope.parse(copyCalculationData({envelope:raw},{}).input.envelope),expected=exportCompletion(supplied.masterId,supplied.calculation.input);
 if(!equalCompletionJson(supplied,expected))throw Error('Completion snapshot does not match pinned source/identity/version/engine');return expected;
}
const b={currency:'USD',period:'year',scope:'supplied-scenario-no-policy',timing:'end'};
const fire=(spendingProfile:string)=>({...b,spendingProfile,targetBasis:'constant-supplied-nominal',annualSpending:'100',withdrawalFraction:'0.1',initial:'900',steps:[{returnRate:'0',contribution:'100'}]});
const rawExamples={
 35:{currency:'USD',scope:'supplied-closing-lines-no-eligibility',price:'1000',baseLoan:'800',financedCosts:'50',deposit:'100',sellerCredit:'0',lenderCredit:'10',otherCredit:'0',lines:[{id:'fee',category:'loan-cost',amount:'100',paidBefore:'20'},{id:'escrow',category:'escrow',amount:'50',paidBefore:'0'}]},
 80:{...b,terminalReserve:'0',steps:[{returnRate:'0.1',spending:'110',benefit:'0'}]},
 81:{...b,initial:'100',steps:[{returnRate:'0.1',contribution:'10',inflationRate:'0.2'}]},
 84:{...b,baseSpending:'100',terminalReserve:'0',steps:[{returnRate:'0.1',inflationRate:'0.1',benefit:'0'},{returnRate:'0.1',inflationRate:'0.1',benefit:'0'}]},
 85:{...b,initial:'100',steps:[{returnRate:'0.1',spending:'110',benefit:'0'}]},
 86:{...b,initial:'100',steps:[{returnRate:'0',spending:'50',benefit:'0'},{returnRate:'0',spending:'50',benefit:'0'},{returnRate:'0',spending:'10',benefit:'0'}]},
 88:fire('supplied'),89:{...b,contributionPolicy:'none',target:'121',initial:'100',returns:['0.1','0.1']},90:fire('lean'),91:fire('fat'),
 96:{...b,employeeBalance:'100',tranches:[{id:'a',balance:'100',vestedFraction:'0.5'}],steps:[{returnRate:'0.1',employeeContribution:'10',tranches:[{id:'a',contribution:'20',vestedFraction:'0.75'}]}]},
 125:{currency:'USD',period:'invoice',scope:'supplied-classifications-no-rule-selection',lines:[{id:'a',amount:'100',priceBasis:'exclusive',classification:'taxable',rateFraction:'0.15'}]},
 127:{currency:'GBP',period:'invoice',scope:'supplied-classifications-no-rule-selection',lines:[{id:'a',amount:'120',priceBasis:'inclusive',classification:'taxable',rateFraction:'0.2'}]},
 134:{currency:'USD',period:'year',scope:'supplied-liability-ratio-no-statutory-definition',denominatorBasis:'selected gross',denominator:'200',liabilities:[{id:'a',amount:'10'},{id:'b',amount:'15'}]},
};
export const completionExamples:Readonly<Record<number,Record<string,unknown>>>=copyCalculationData(rawExamples,{}).input as Record<number,Record<string,unknown>>;
