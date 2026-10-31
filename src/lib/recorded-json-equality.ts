import {copyCalculationData} from './calculation-snapshot';
/** Exact validated JSON-data equality; key order is irrelevant and signed zero follows standard JSON. */
export function sameRecordedJson(a:unknown,b:unknown):boolean{
 const clean=copyCalculationData({a,b},{}).input;
 const canonical=(value:unknown):string=>Array.isArray(value)?'['+value.map(canonical).join(',')+']':value!==null&&typeof value==='object'?'{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical((value as Record<string,unknown>)[key])).join(',')+'}':JSON.stringify(value);
 return canonical(clean.a)===canonical(clean.b);
}
