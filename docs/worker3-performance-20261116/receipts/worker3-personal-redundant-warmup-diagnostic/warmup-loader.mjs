import {writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const target='file:///workspace/calcumint-worker3-recovery/tests/completion-first-20261112/personal-stage.test.mjs';
const removed="retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs');";
const boundary="const path=row.path;"+removed+"for(const bytes of [Buffer.from('changed after immutable warm'),sourceGit(['cat-file','blob',row.predecessor.blob])])";
const hash=value=>createHash('sha256').update(value).digest('hex');
export async function load(url,context,nextLoad){
 const result=await nextLoad(url,context);if(url!==target)return result;
 const original=result.source.toString();if(original.split(boundary).length!==2)throw Error('Exact unique personal warmup loop required');
 const position=original.indexOf(boundary)+"const path=row.path;".length;
 const prefix=original.slice(0,position),suffix=original.slice(position+removed.length),transformed=prefix+suffix;
 if(prefix+removed+suffix!==original||!transformed.includes('assert(retainedRuntimeBytes(nsPath).equals(nsOld));'))throw Error('Literal warmup-only transformation refused');
 const negative="assert.throws(()=>retainedRuntimeBytes('tests/gotrue-runtime/acceptance.mjs',p=>p===path?bytes:readFileSync(p)),/Current factory bytes differ/);";
 if(original.split(negative).length!==2||transformed.split(negative).length!==2)throw Error('Original custom-reader negatives must remain literal');
 const base='/tmp/worker3-personal-redundant-warmup-diagnostic/';writeFileSync(base+'original-personal-stage.test.mjs',original);writeFileSync(base+'transformed-personal-stage.test.mjs',transformed);
 writeFileSync(base+'loader-manifest.json',JSON.stringify({diagnosticOnly:true,qualification:false,target,removed,removedOccurrences:1,removedRuntimeInvocations:2,originalSHA256:hash(original),transformedSHA256:hash(transformed),removedSHA256:hash(removed),prefixSHA256:hash(prefix),suffixSHA256:hash(suffix),restoresOriginalExactly:prefix+removed+suffix===original,earlierAssertedNSPositiveRetained:true,customReaderNegativeExpressionRetainedExactly:true,allFourLoopNegativeRuntimeInvocationsRetained:true},null,2));return {...result,source:transformed};
}
