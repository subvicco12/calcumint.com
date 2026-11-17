import assert from 'node:assert/strict';
// Independently reviewed API receipt path universe; no receipt may widen this set.
export const apiEvidencePaths=Object.freeze([
 "docs/first-five-native-20261109/embed-integrity-successor.sql",
 "docs/first-five-native-20261109/embed-metering-proposal.sql",
 "docs/first-five-native-20261109/jobs-webhooks-proposal.sql",
 "docs/five-native-auth-20261109/build-source-sha256.json",
 "docs/five-native-auth-20261109/final-schema/build-source-sha256.json",
 "docs/five-native-auth-20261109/final-schema/identity-correction-equivalence.json",
 "docs/five-native-auth-20261109/final-schema/receipt-identity-corrected.json",
 "docs/five-native-auth-20261109/final-schema/receipt.json",
 "docs/five-native-auth-20261109/final-schema/source-version.json",
 "docs/five-native-auth-20261109/identity-correction-equivalence.json",
 "docs/five-native-auth-20261109/receipt-identity-corrected.json",
 "docs/five-native-auth-20261109/receipt.json",
 "docs/five-native-auth-20261109/source-version.json",
 "docs/native440/quota-readiness-wrapper.sql",
 "next.config.ts",
 "src/app/api/business/technology-embeds/route.ts",
 "src/app/api/technology-embed/[grant]/calculate/route.ts",
 "src/app/api/v1/technology/batch/route.ts",
 "src/app/api/v1/technology/calculate/route.ts",
 "src/app/embed/technology/[grant]/page.tsx",
 "src/calculators/publication-authority.ts",
 "src/calculators/registry.ts",
 "src/components/technology-five-embed.tsx",
 "src/lib/api/auth.ts",
 "src/lib/native-delivery/authorization.ts",
 "src/lib/native-delivery/technology-five-catalog.ts",
 "src/lib/native-delivery/technology-five-contract.ts",
 "src/lib/native-delivery/technology-five-embed-request.ts",
 "src/lib/native-delivery/technology-five-frame-policy.ts",
 "src/lib/native-delivery/technology-five-grant.ts",
 "src/lib/native-delivery/technology-five-job-storage.ts",
 "src/lib/native-delivery/technology-five-jobs.ts",
 "src/lib/native-delivery/technology-five-metering.ts",
 "src/lib/native-delivery/technology-five-publication.ts",
 "src/lib/native-delivery/technology-five-webhook-storage.ts",
 "src/lib/native-delivery/technology-five-webhook-transport.ts",
 "src/lib/native-delivery/technology-five-webhook-worker.ts",
 "src/lib/publication-manifest.ts",
 "src/proxy.ts",
 "tests/five-native-auth-20261109/evidence-sanitizer.mjs",
 "tests/gotrue-full-schema/schema.mjs",
 "tests/gotrue-runtime/acceptance.mjs",
 "tests/gotrue-runtime/fixture.mjs",
 "tests/gotrue-runtime/schema.mjs",
 "tests/native440/acceptance.mjs",
 "tests/native440/business-workflow.mjs",
 "tests/native440/production-runtime.mjs",
 "tests/native440/quota-bindings.mjs",
 "tests/native440/quota-initializer.mjs",
 "tests/native440/quota.mjs",
 "tests/native440/schema-readiness-proof.mjs",
 "tests/native440/schema-readiness.mjs"
]);
export function assertAPIEvidencePaths(paths){assert.deepEqual([...paths].sort(),[...apiEvidencePaths],'Exact closed API52 evidence paths required');}
// Lifecycle primitive only: this module grants no repository/source authority.
// The retained runtime supplies its private, default-reader proof hooks.
let activeScope=null;
export function runClosedSynchronousBatch(paths,run,hooks,...extra){
 if(activeScope){const error=Error('A nested evidence batch is forbidden');activeScope.poison??=error;throw error;}
 assert.equal(extra.length,0,'Unexpected evidence batch arguments');
 assert(Array.isArray(paths)&&paths.length>0&&paths.length<=128,'A finite evidence path declaration is required');
 const allowed=new Set();
 for(const path of paths){assert.equal(typeof path,'string');assert(path.length>0&&path.length<=1024&&!path.startsWith('/')&&!/[\0\r\n\\]/.test(path)&&path.split('/').every(part=>part&&part!=='.'&&part!=='..'),'A normalized relative evidence path is required');assert(!allowed.has(path),'Duplicate declared evidence path');allowed.add(path);}
 assert.equal(typeof run,'function');assert(hooks&&Object.keys(hooks).length===3&&['begin','read','end'].every(key=>typeof hooks[key]==='function'),'Private proof hooks required');
 const scope={active:false,poison:null};activeScope=scope;let token,opened=false;const failures=[];
 const reject=error=>{scope.poison??=error;throw error;};
 const reader=(path,encoding,...argumentsAfterEncoding)=>{
  if(!scope.active)throw Error('Evidence batch reader expired');
  if(scope.poison)throw scope.poison;
  try{
   assert.equal(argumentsAfterEncoding.length,0,'Unexpected evidence reader arguments');assert(allowed.has(path),'Evidence path was not declared');assert(encoding===undefined||encoding==='utf8'||encoding==='utf-8','Evidence reader encoding must be UTF8 or Buffer');
   const bytes=hooks.read(path,token);assert(Buffer.isBuffer(bytes),'Evidence reader must return checked binary bytes');const copy=Buffer.from(bytes);return encoding===undefined?copy:copy.toString('utf8');
  }catch(error){return reject(error);}
 };
 try{token=hooks.begin(Object.freeze([...allowed]));opened=true;scope.active=true;const result=run(reader);assert.equal(result,undefined,'Evidence batch callback must be synchronous and return undefined');}
 catch(error){failures.push(error);}
 finally{
  scope.active=false;
  try{if(opened)hooks.end(token);}catch(error){failures.push(error);}
  finally{if(scope.poison)failures.push(scope.poison);token=undefined;activeScope=null;}
 }
 const unique=[...new Set(failures)];if(unique.length===1)throw unique[0];if(unique.length>1)throw new AggregateError(unique,'Evidence batch validation failed: '+unique.map(error=>error.message).join('; '));
}
