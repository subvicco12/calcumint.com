import {z} from 'zod';
import type {CalculatorDefinition,CalculatorExample,CalculatorRiskClass} from './types';
import approval from '../../data/catalog/scope-policy-decisions-2026-10-25/owner-selections-2026-10-26.json';
export type OwnerBinding={masterId:number;definition:CalculatorDefinition<unknown,unknown>};
export const amount=z.number().finite().nonnegative();
export const positive=z.number().finite().positive();
export const label=z.string().trim().min(1).max(160);
export function finiteNumber(value:number){if(!Number.isFinite(value))throw new RangeError('Result exceeds supported finite arithmetic');return value;}
export function sumFinite(values:readonly number[]){return values.reduce((total,value)=>finiteNumber(total+finiteNumber(value)),0);}
export function isoDay(value:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))throw new RangeError('Explicit YYYY-MM-DD required');const time=Date.parse(value+'T00:00:00Z');if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==value)throw new RangeError('Valid Gregorian date required');return time;}
function finiteOutput(value:unknown):void{if(typeof value==='number')finiteNumber(value);else if(Array.isArray(value))value.forEach(finiteOutput);else if(value&&typeof value==='object')Object.values(value).forEach(finiteOutput);}
export function ownerModel<T>(masterId:number,schema:z.ZodType<T>,calculate:(input:T)=>unknown,examples:readonly CalculatorExample<T,unknown>[],method:{expression:string;description:string},riskClass:CalculatorRiskClass='financial'):OwnerBinding{
 const selected=approval.selected.find(x=>x.masterId===masterId);if(!selected||selected.selection!=='OWNER_APPROVED_BOUNDED_SCOPE')throw Error('No owner approval for this scope');
 const definition:CalculatorDefinition<unknown,unknown>={id:`private.owner.${masterId}`,slug:`private-owner-${masterId}`,title:selected.title,category:'private-owner-scopes',version:1,riskClass,reviewStatus:'draft',inputSchema:schema,calculate:raw=>{const result=calculate(schema.parse(raw));finiteOutput(result);return result;},examples,formulas:[{id:`owner-${masterId}`,expression:method.expression,description:method.description+' Approved bounded scope: '+selected.selectedDomainPolicy}],sources:[{label:'Explicit owner-approved bounded product scope; not specialist or certification approval',url:'https://github.com/subvicco12/calcumint.com/blob/2a351a99fdcd3861beaed453db4ca11cccebb684/data/catalog/scope-policy-decisions-2026-10-25/owner-selections-2026-10-26.json',note:'One deterministic supplied-input profile. Owner scope approval is effective; canonical identity validation, independent source/math review, specialist requirements, certification and publication remain separate. RELEASE HOLD.'}]};return{masterId,definition};
}
