/** Producer only. Retains the qualified canonical capture as an explicit immutable stage. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {captureStage7} from './source-capture-stage7.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function captureStage7V6({root,codeRef}){
 const capturePath='docs/milestone60-20261113/source-stage7-v6.json',policyPath='tests/milestone60-20261113/source-stage7-policy-v6.mjs';
 const predecessorRef='2d5d105892134f8af46fc2a02edd5932c431b845';
 const retainedRef='f00acbfdb882688eb1d0c22bc68305eb4984ac41';
 const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:64*1024*1024});
 const record=path=>{const bytes=git(['show',retainedRef+':'+path]);assert(bytes.equals(readFileSync(resolve(root,path))),'Qualified predecessor bytes changed: '+path);return {path,ref:retainedRef,blob:git(['rev-parse',retainedRef+':'+path]).toString().trim(),bytes:bytes.length,sha256:sha(bytes)};};
 const retainedCapture=record('docs/milestone60-20261113/source-stage7.json');
 assert.equal(retainedCapture.sha256,'599f8d6d88519cd0051d656dd9756b8880d19008ed5bc0f28a99ac1f1fc467a7');
 const retainedPolicy=record('tests/milestone60-20261113/source-stage7-policy.mjs');
 const policy=captureStage7({root,predecessorRef,codeRef,capturePath,policyPath});
 const capture=JSON.parse(readFileSync(resolve(root,capturePath)));
 capture.retainedStages=[{capture:retainedCapture,policy:retainedPolicy}];
 const bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(resolve(root,capturePath),bytes);policy.captureSHA256=sha(bytes);
 writeFileSync(resolve(root,policyPath),'// Generated v6 candidate; independent review owns admission.\nexport const sourceStage7CapturePath = '+JSON.stringify(capturePath)+';\nexport const sourceStage7Policy = Object.freeze('+JSON.stringify(policy,null,2)+');\nObject.freeze(sourceStage7Policy.paths);\nObject.freeze(sourceStage7Policy.ancestry);\n');
 return policy;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const[root,codeRef]=process.argv.slice(2);assert(root&&codeRef,'Arguments: root codeRef');console.log(JSON.stringify(captureStage7V6({root,codeRef}),null,2));}
