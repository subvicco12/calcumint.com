import {z} from 'zod';
import {decimal,rational,add,multiply,zero,type Rational} from './exact-rational';
export {decimal as d,add,multiply,subtract,zero} from './exact-rational';
export type {Rational} from './exact-rational';
export const one=rational(1n);
export function compare(a:Rational,b:Rational){const n=BigInt(a.numerator)*BigInt(b.denominator)-BigInt(b.numerator)*BigInt(a.denominator);return n<0n?-1:n>0n?1:0;}
export function signed(value:string){return value.startsWith('-')?multiply(decimal(value.slice(1)),rational(-1n)):decimal(value);}
export function sum(values:readonly Rational[]){return values.reduce(add,zero);}
export function minimum(a:Rational,b:Rational){return compare(a,b)<0?a:b;}
export function nonnegative(a:Rational){return compare(a,zero)<0?zero:a;}
export const amount=z.string().regex(/^(0|[1-9]\d{0,11})(\.\d{1,6})?$/);
export const positiveAmount=amount.refine(s=>compare(decimal(s),zero)>0,'Positive quantity required');
export const rate=z.string().regex(/^-?(0|1)(\.\d{1,6})?$/).refine(s=>compare(signed(s),one)<=0&&compare(signed(s),rational(-1n))>0,'Rate must lie in (-1,1]');
export const fraction=amount.refine(s=>compare(decimal(s),one)<=0,'Fraction must not exceed one');
export const positiveFraction=fraction.refine(s=>compare(decimal(s),zero)>0,'Positive supplied fraction required');
export const label=z.string().trim().min(1).max(160);
export const retirementBasis={currency:label,period:label,scope:z.literal('supplied-scenario-no-policy'),timing:z.enum(['begin','end'])};
export function unique(ids:readonly string[]){if(new Set(ids).size!==ids.length)throw Error('Duplicate record identity');}
