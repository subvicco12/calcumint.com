import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';

export function validateDeliveryCases(bytes,expectedSHA256){
 assert.match(expectedSHA256??'',/^[a-f0-9]{64}$/,'BUSINESS_CASES_SHA256 must pin root-approved exact cohort bytes');
 assert.equal(createHash('sha256').update(bytes).digest('hex'),expectedSHA256,'Exact cohort changed after coordination');
 const cases=JSON.parse(bytes);assert(Array.isArray(cases)&&cases.length>0);
 assert.equal(new Set(cases.map(row=>row.id)).size,cases.length,'Duplicate catalog identity');
 for(const row of cases){
  assert(Number.isSafeInteger(row.id)&&row.id>0);assert.equal(row.version,1);
  for(const key of ['slug','engine'])assert.match(row[key]??'',/^[a-z0-9][a-z0-9.-]*$/,'Unsafe exact tuple '+key);
  for(const key of ['input','edit']){
   assert(row[key]&&typeof row[key]==='object'&&!Array.isArray(row[key]));assert(Object.keys(row[key]).length>0);
   for(const [field,value]of Object.entries(row[key])){assert.match(field,/^[a-zA-Z][a-zA-Z0-9_]*$/);assert.equal(typeof value,'string');}
  }
  for(const key of Object.keys(row.edit))assert(Object.hasOwn(row.input,key),'Edit field must exist in baseline');
 }
 return cases;
}
export async function loadDeliveryCases(env=process.env){
 assert(env.BUSINESS_CASES_INPUT,'Root-approved BUSINESS_CASES_INPUT required');
 return validateDeliveryCases(await readFile(env.BUSINESS_CASES_INPUT),env.BUSINESS_CASES_SHA256);
}
