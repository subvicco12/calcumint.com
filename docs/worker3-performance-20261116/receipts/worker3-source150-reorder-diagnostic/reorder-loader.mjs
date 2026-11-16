import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const target='file:///workspace/calcumint-worker3-recovery/tests/parallel-source-20261110/current.test.mjs';
const blockTitle="test('mandatory source guard regressions exercise exact source and immutable availability without skips',async context=>{";
const beforeTitle="test('actual current execution passes while unchanged R5 executes at literal A7',async context=>{";
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function load(url,context,nextLoad){
 const result=await nextLoad(url,context);
 if(url!==target)return result;
 const original=result.source.toString();
 if(original.split(blockTitle).length!==2||original.split(beforeTitle).length!==2)throw Error('Exact unique source test registration boundaries required');
 const insert=original.indexOf(beforeTitle),start=original.indexOf(blockTitle);
 if(start<=insert)throw Error('Expected mandatory block to be the final registration');
 const prefix=original.slice(0,insert),middle=original.slice(insert,start),block=original.slice(start);
 if(!block.endsWith('});\n'))throw Error('Exact final mandatory block terminator required');
 const transformed=prefix+block+middle;
 const finalPosition=transformed.indexOf(blockTitle);
 const exactParts=transformed.slice(0,finalPosition)===prefix&&transformed.slice(finalPosition,finalPosition+block.length)===block&&transformed.slice(finalPosition+block.length)===middle;
 if(!exactParts||prefix+middle+block!==original)throw Error('Nonliteral scheduling transformation refused');
 const base='/tmp/worker3-source150-reorder-diagnostic/';
 writeFileSync(base+'transformed-current.test.mjs',transformed);
 writeFileSync(base+'original-current.test.mjs',original);
 writeFileSync(base+'loader-manifest.json',JSON.stringify({diagnosticOnly:true,qualification:false,target,originalSHA256:hash(original),transformedSHA256:hash(transformed),blockSHA256:hash(block),prefixSHA256:hash(prefix),middleSHA256:hash(middle),originalBytes:Buffer.byteLength(original),transformedBytes:Buffer.byteLength(transformed),blockBytes:Buffer.byteLength(block),exactParts,restoresOriginalExactly:prefix+middle+block===original,unchangedFinalBlock:true,blockTitle,beforeTitle},null,2));
 return {...result,source:transformed};
}
