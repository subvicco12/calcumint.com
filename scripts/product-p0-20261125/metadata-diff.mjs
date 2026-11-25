/** Offline diagnostics only; no provider, SQL execution, grant or assertion rewriting. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const hash=x=>createHash('sha256').update(x).digest('hex');
const sections={relations:['id'],columns:['table','name'],functions:['id'],triggers:['table','id'],constraints:['table','name'],indexes:['id'],policies:['schemaname','tablename','policyname'],provider:['id'],defaultAcls:['role','schema','objectType']};
const stable=x=>JSON.stringify(canonical(x));
function canonical(x){if(Array.isArray(x))return x.map(canonical);if(x&&typeof x==='object')return Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])]));if(typeof x==='number')assert(Number.isSafeInteger(x),'Unsafe metadata number');return x;}
function rowCanonical(row){const copy=canonical(row);if(Array.isArray(copy.acl))copy.acl=copy.acl.map(canonical).sort((a,b)=>stable(a).localeCompare(stable(b)));return copy;}
function normalized(capture){
 assert.equal(typeof capture.raw,'string','Exact metadata_json text required');assert.match(capture.sha256,/^[0-9a-f]{64}$/);assert.equal(hash(capture.raw),capture.sha256,'Metadata bytes differ from pin');
 const data=JSON.parse(capture.raw);assert.deepEqual(Object.keys(data).sort(),['major',...Object.keys(sections)].sort(),'Captured scope differs');assert.equal(data.major,17,'Only retained PostgreSQL17 projection supported');
 const out={major:17};
 for(const [section,keys] of Object.entries(sections)){
  assert(Array.isArray(data[section]),'Missing section: '+section);const rows=new Map();
  for(const row of data[section]){assert(row&&typeof row==='object'&&!Array.isArray(row));for(const k of keys)assert.equal(typeof row[k],'string','Missing identity: '+section+'.'+k);const key=keys.map(k=>row[k]).join('|');assert(!rows.has(key),'Duplicate metadata identity');rows.set(key,rowCanonical(row));}
  out[section]=Object.fromEntries([...rows].sort(([a],[b])=>a.localeCompare(b)));
 }
 return out;
}
export function compareMetadata(before,after){
 const a=normalized(before),b=normalized(after),changes=[];
 for(const section of Object.keys(sections))for(const key of [...new Set([...Object.keys(a[section]),...Object.keys(b[section])])].sort()){
  const x=a[section][key],y=b[section][key];if(stable(x)===stable(y))continue;
  const kind=x===undefined?'added':y===undefined?'removed':'changed';const changedFields=kind==='changed'?[...new Set([...Object.keys(x),...Object.keys(y)])].sort().filter(k=>stable(x[k])!==stable(y[k])):[];
  changes.push({section,key,kind,changedFields,beforeSHA256:x===undefined?null:hash(stable(x)),afterSHA256:y===undefined?null:hash(stable(y))});
 }
 return{kind:'OFFLINE_METADATA_DIFF_NOT_ADMISSION',beforeRawSHA256:before.sha256,afterRawSHA256:after.sha256,rawEqual:before.raw===after.raw,beforeNormalizedSHA256:hash(stable(a)),afterNormalizedSHA256:hash(stable(b)),normalizedEqual:stable(a)===stable(b),changes,activationAuthorized:false,independentProductionVerification:false,warning:'Normalized equality never substitutes for exact raw preimage assertions. No successor is approved or executable by this report.'};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 assert.equal(process.argv.length,4,'Two capture JSON files required; no connection or activation flags');
 const [before,after]=await Promise.all(process.argv.slice(2).map(async p=>JSON.parse(await readFile(p,'utf8'))));console.log(JSON.stringify(compareMetadata(before,after),null,2));
}
