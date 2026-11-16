import {writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const target='file:///workspace/calcumint-worker3-recovery/tests/completion-first-20261112/personal-stage.test.mjs';
const originalLoop=" for(const row of JSON.parse(readFileSync(personalCapturePath)).rows){const path=row.path;retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs');for(const bytes of [Buffer.from('changed after immutable warm'),sourceGit(['cat-file','blob',row.predecessor.blob])])assert.throws(()=>retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs',p=>p===path?bytes:readFileSync(p)),/Current factory bytes differ/);}";
const strongerLoop=` for(const row of JSON.parse(readFileSync(personalCapturePath)).rows){
  const path=row.path;
  for(const bytes of [Buffer.from('changed after immutable warm'),sourceGit(['cat-file','blob',row.predecessor.blob])]){
   let visited=false;
   assert.throws(()=>retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs',p=>{if(p===path){visited=true;return bytes;}return readFileSync(p);}),error=>error instanceof Error&&/Current factory bytes differ/.test(error.message)&&error.message.includes(path),'Each personal source must fail at its exact changed path');
   assert.equal(visited,true,'Personal source substitution was not observed: '+path);
  }
 }
 assert(retainedRuntimeBytes(nsPath).equals(nsOld),'Default NS historical bytes recover after every personal source refusal');`;
const hash=value=>createHash('sha256').update(value).digest('hex');
export async function load(url,context,nextLoad){
 const result=await nextLoad(url,context);if(url!==target)return result;
 const original=result.source.toString();if(original.split(originalLoop).length!==2)throw Error('Exact unique original personal loop required');
 const transformed=original.replace(originalLoop,strongerLoop);
 if(transformed.replace(strongerLoop,originalLoop)!==original||!transformed.includes('assert(retainedRuntimeBytes(nsPath).equals(nsOld));')||!transformed.includes(' verifyCurrentRuntimeContext();'))throw Error('Stronger fixture literal boundary refused');
 const base='/tmp/worker3-personal-redundant-warmup-diagnostic/';writeFileSync(base+'stronger-personal-stage.test.mjs',transformed);
 writeFileSync(base+'stronger-loader-manifest.json',JSON.stringify({diagnosticOnly:true,qualification:false,target,originalSHA256:hash(original),transformedSHA256:hash(transformed),originalLoopSHA256:hash(originalLoop),strongerLoopSHA256:hash(strongerLoop),restoresOriginalExactly:transformed.replace(strongerLoop,originalLoop)===original,originalLoopDefaultRuntimeCalls:2,replacementDefaultRuntimeCalls:1,loopNegativeRuntimeCalls:4,earlierAssertedNSPositiveRetained:true,finalVerifyContextRetained:true,exactPathAndCallbackVisitAssertionsAdded:true,postNegativeDefaultNSByteEqualityAdded:true,originalLoop,strongerLoop},null,2));return {...result,source:transformed};
}
