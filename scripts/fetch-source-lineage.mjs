import {sourceStage8Policy} from '../tests/milestone100-20261114/source-stage8-policy.mjs';
/** Fetch only immutable source revisions required by the existing exact guards. */
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {financialSafetySourceRefs} from './financial-safety-lineage.mjs';
import {completionSourceRefs} from './product-completion-lineage.mjs';
import {appStage5Policy} from '../tests/completion-wave-20261113/source-app-stage5-policy.mjs';
import {testStage6Policy} from '../tests/completion-wave-20261113/source-test-stage6-policy.mjs';
import {sourceStage7Policy} from '../tests/milestone60-20261113/source-stage7-policy-v6.mjs';
import {additionalBootstrapRefs,additionalStage7BootstrapRefs,additionalStage8BootstrapRefs,additionalStage8V3BootstrapRefs,additionalStage8V4BootstrapRefs,additionalStage8V5BootstrapRefs,additionalStage8V6BootstrapRefs,additionalStage8V7BootstrapRefs,additionalStage8V8BootstrapRefs,additionalStage8V9BootstrapRefs,additionalStage8V10BootstrapRefs,additionalStage8V11BootstrapRefs,additionalStage8V12BootstrapRefs,additionalStage8V13BootstrapRefs,additionalStage8V14BootstrapRefs} from '../tests/parallel-source-20261110/authority.mjs';
// Actual governing predecessor refs consumed by the frequency and N1 verifiers.
// These are provenance requirements, not fabricated completion successor stages.
const governedPublicationRefs=Object.freeze(['761b850479ea36b2b4ebf8039664d8400c762555','ee3d0a70cf5a908ce3588bb02b67bbb86576a8a7']);
const refs=Object.freeze([...new Set([...financialSafetySourceRefs,...completionSourceRefs,...governedPublicationRefs,...appStage5Policy.ancestry,...testStage6Policy.ancestry,...sourceStage7Policy.ancestry,...sourceStage8Policy.ancestry,...additionalBootstrapRefs,...additionalStage7BootstrapRefs,...additionalStage8BootstrapRefs,...additionalStage8V3BootstrapRefs,...additionalStage8V4BootstrapRefs,...additionalStage8V5BootstrapRefs,...additionalStage8V6BootstrapRefs,...additionalStage8V7BootstrapRefs,...additionalStage8V8BootstrapRefs,...additionalStage8V9BootstrapRefs,...additionalStage8V10BootstrapRefs,...additionalStage8V11BootstrapRefs,...additionalStage8V12BootstrapRefs,...additionalStage8V13BootstrapRefs,...additionalStage8V14BootstrapRefs])].sort());
const invoke=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],timeout:60_000,maxBuffer:1024*1024});
export function fetchSourceLineage(git=invoke){
 if(!refs.length||refs.some(ref=>!/^[a-f0-9]{40}$/.test(ref)))throw Error('Invalid exact source revision');
 const present=ref=>{try{return git(['rev-parse','--verify',ref+'^{commit}']).toString().trim()===ref;}catch{return false;}};
 const missing=refs.filter(ref=>!present(ref));
 if(missing.length)git(['fetch','--no-tags','--depth=1','origin',...missing]);
 if(refs.some(ref=>!present(ref)))throw Error('Exact source lineage unavailable after bounded fetch');
 return {sourceRevisions:refs.length,fetched:missing.length,releaseHold:true,productionWrites:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(fetchSourceLineage()));
