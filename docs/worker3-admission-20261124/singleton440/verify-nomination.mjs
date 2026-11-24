/** Read-only nomination preflight using the unchanged existing exact-stage primitive.
 * This program cannot admit, activate, dispatch, publish or alter source.
 */
import assert from 'node:assert/strict';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const here=path.dirname(fileURLToPath(import.meta.url));
const hash=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.length!==4||process.argv[2]!=='--verify'){
 console.error('Only --verify CHECKOUT is available. Admission/activation requires a separately reviewed trusted authority successor; it is not implemented by this diagnostic.');process.exit(2);
}
const root=realpathSync(process.argv[3]);
const checked=(name,digest)=>{const p=path.join(here,name);assert(lstatSync(p).isFile()&&!lstatSync(p).isSymbolicLink());const b=readFileSync(p);assert.equal(hash(b),digest,'Package source digest differs: '+name);return b;};
const policy=JSON.parse(checked('policy-proposal.json','c797bb66645088e9bc95dd5a31278cca266e6a48255e65ba33ac0af80079eaca'));
const captureBytes=checked('capture-proposal.json','715eb6258064342f269193fcea24325b1fb2c3faff41218b1b330b642db07346');
checked('retained-exact-stage.mjs','427dcad7727bd28d26ecfe40df5b780b79c94a7b2a35930b40417e07d5ac347a');
const git=args=>execFileSync('git',['-c','core.hooksPath=/dev/null','-C',root,...args],{maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const candidate='1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e',tree='209982b9a81d7bf9f4783228505b5a274563391f',base='49ea243b5be7e1ee9f3cd8af7f936ab784402cf7';
assert.equal(git(['rev-parse','HEAD']).toString().trim(),candidate,'Exact singleton HEAD required');
assert.equal(git(['rev-parse','HEAD^{tree}']).toString().trim(),tree,'Exact singleton tree required');
assert.equal(git(['diff','--name-only','-z','0fd467880b5b0142898d3010c4d3ab9fe1b64958',base,'--','src']).length,0,'Baseline no longer equals the retained reviewed application');
const {verifyExactStage}=await import(pathToFileURL(path.join(here,'retained-exact-stage.mjs')).href);
const rows=verifyExactStage({policy,captureBytes,git,read:p=>readFileSync(path.join(root,p)),root});
assert.equal(rows.size,2);
const engine='src/calculators/conversion/catalog-batch-3.ts';
assert.equal(hash(git(['show',candidate+':'+engine])),'8605a98cbc051450fbd71089d77f174f961ea56d5ee6b743e38c8a473b87c165');
assert.equal(git(['diff','--name-only','-z',base,candidate,'--','src/calculators']).length,0,'Immutable engine tree changed');
assert.equal(hash(readFileSync(path.join(root,engine))),'8605a98cbc051450fbd71089d77f174f961ea56d5ee6b743e38c8a473b87c165','Current immutable engine bytes differ');
verifyExactStage({policy,captureBytes,git,read:p=>readFileSync(path.join(root,p)),root});
assert.equal(git(['rev-parse','HEAD']).toString().trim(),candidate,'HEAD moved during verification');
console.log(JSON.stringify({kind:'READ_ONLY_EXACT_NOMINATION_VERIFICATION',candidate,tree,base,paths:[...rows.keys()],captureSha256:hash(captureBytes),diagnosticOnly:true,approvalAuthenticated:false,admitted:false,activated:false,launcherExecuted:false,workflowDispatched:false,releaseHold:true}));
