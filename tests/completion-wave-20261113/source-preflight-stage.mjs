/** Exact additive preflight successor; historical audit remains literal after current proof. */
import assert from 'node:assert/strict';import{createHash}from'node:crypto';
import{lstatSync,realpathSync}from'node:fs';import{resolve}from'node:path';import{fileURLToPath}from'node:url';
import{accepted,verifyParallelAuthority}from'../parallel-source-20261110/authority.mjs';
import{sourcePreflightCapturePath,sourcePreflightPolicy as policy}from'./source-preflight-policy.mjs';
const sourceRoot=fileURLToPath(new URL('../../',import.meta.url)),paths=['scripts/fetch-source-lineage.mjs','tests/source-lineage-bootstrap.test.mjs'];
const hash=b=>createHash('sha256').update(b).digest('hex');
function replaceOnce(text,before,after){assert.equal(text.split(before).length,2,'Exact preflight insertion preimage required');return text.replace(before,after);}
export function expectedStage6PreflightSource(previous){
 const imports="import {completionSourceRefs} from './product-completion-lineage.mjs';";
 return replaceOnce(replaceOnce(previous,imports,imports+"\nimport {appStage5Policy} from '../tests/completion-wave-20261113/source-app-stage5-policy.mjs';\nimport {testStage6Policy} from '../tests/completion-wave-20261113/source-test-stage6-policy.mjs';\nimport {additionalBootstrapRefs} from '../tests/parallel-source-20261110/authority.mjs';"),'...completionSourceRefs,...governedPublicationRefs])','...completionSourceRefs,...governedPublicationRefs,...appStage5Policy.ancestry,...testStage6Policy.ancestry,...additionalBootstrapRefs])');
}
export function expectedPreflightSource(previous){
 const retained=expectedStage6PreflightSource(previous);
 const imports="import {testStage6Policy} from '../tests/completion-wave-20261113/source-test-stage6-policy.mjs';";
 const extended=replaceOnce(replaceOnce(retained,imports,imports+"\nimport {sourceStage7Policy} from '../tests/milestone60-20261113/source-stage7-policy-v6.mjs';"),'...testStage6Policy.ancestry,...additionalBootstrapRefs','...testStage6Policy.ancestry,...sourceStage7Policy.ancestry,...additionalBootstrapRefs,...additionalStage7BootstrapRefs');
 return replaceOnce(extended,"import {additionalBootstrapRefs} from '../tests/parallel-source-20261110/authority.mjs';","import {additionalBootstrapRefs,additionalStage7BootstrapRefs} from '../tests/parallel-source-20261110/authority.mjs';");
}
export function expectedPreflightAudit(previous){
 const imports="import {fetchSourceLineage} from '../scripts/fetch-source-lineage.mjs';";
 return replaceOnce(replaceOnce(previous,imports,imports+"\nimport {proveSourcePreflightAndHistoricalInputs} from './completion-wave-20261113/source-preflight-stage.mjs';"),'function verifyBootstrapSuccession(read=readFileSync,git=sourceGit){','function verifyBootstrapSuccession(read=readFileSync,git=sourceGit){\n const proved=proveSourcePreflightAndHistoricalInputs({read,git});\n read=proved.historicalInput.read;git=proved.historicalInput.git;');
}
export function proveSourcePreflightAndHistoricalInputs({read,git,root=sourceRoot}){
 assert.match(policy.captureSHA256??'',/^[a-f0-9]{64}$/,'Independently pinned preflight capture required');const bytes=read(sourcePreflightCapturePath);assert.equal(hash(bytes),policy.captureSHA256,'Independent preflight capture digest differs');const capture=JSON.parse(bytes);
 assert.equal(capture.kind,'EXACT_TWO_PATH_PREFLIGHT_SUCCESSOR');assert.equal(capture.predecessorRef,policy.predecessorRef);assert.equal(capture.codeRef,policy.codeRef);assert.deepEqual(capture.rows.map(row=>row.path),paths);
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 for(const ref of [head,policy.predecessorRef]){assert.equal(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);const raw=git(['cat-file','commit',ref]);assert.equal(createHash('sha1').update(Buffer.from(`commit ${raw.length}\0`)).update(raw).digest('hex'),ref,'Preflight commit content address differs');}
 const prior=new Map(),current=new Map();
 for(const row of capture.rows){
  for(const [key,ref]of [['predecessor',policy.predecessorRef],['current',policy.codeRef]]){const record=row[key];assert.equal(record.path,row.path);assert.equal(record.ref,ref);assert.match(record.blob,/^[a-f0-9]{40}$/);if(key==='predecessor')assert.equal(git(['rev-parse',ref+':'+row.path]).toString().trim(),record.blob);const retained=git(['cat-file','blob',record.blob]);assert.equal(retained.length,record.bytes);assert.equal(hash(retained),record.sha256);const live=key==='current'&&row.path===paths[0]?accepted.find(r=>r.path===row.path):record;assert(live,'Independently pinned current preflight source required');if(key==='current')assert.equal(git(['rev-parse','HEAD:'+row.path]).toString().trim(),live.blob,'Exact current HEAD source object differs');const content=git(['cat-file','blob',live.blob]);assert.equal(hash(content),live.sha256);if(key==='predecessor')prior.set(row.path,{record,bytes:content});else{const target=resolve(root,row.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink());assert.equal(realpathSync(target),target);assert(read(row.path).equals(content),'Exact current bootstrap source bytes differ');current.set(row.path,content);}}
 }
 assert.equal(current.get(paths[0]).toString(),expectedPreflightSource(prior.get(paths[0]).bytes.toString()),'Only exact policy import and ancestry union may extend preflight');
 assert.equal(current.get(paths[1]).toString(),expectedPreflightAudit(prior.get(paths[1]).bytes.toString()),'Only exact current proof wrapper may extend historical audit');
 // The original pair remains historical; the exact additive current script is independently HEAD-pinned.
 // Central authority consumes the original live inputs, never the projected historical view.
 verifyParallelAuthority(read,git);
 const historicalRead=path=>prior.has(path)?Buffer.from(prior.get(path).bytes):read(path);
 const historicalGit=(args,options)=>args.length===2&&args[0]==='rev-parse'&&args[1].startsWith('HEAD:')&&prior.has(args[1].slice(5))?Buffer.from(prior.get(args[1].slice(5)).record.blob+'\n'):git(args,options);
 return{historicalInput:{read:historicalRead,git:historicalGit,root},livePaths:[...paths]};
}
