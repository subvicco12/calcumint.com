import {assertSourceStage8HeadStable} from '../tests/milestone100-20261114/source-stage8.mjs';
import {immutableTreeQueryReader} from '../tests/milestone100-20261114/source-immutable-queries.mjs';
import {accepted,verifyParallelAuthority} from '../tests/parallel-source-20261110/authority.mjs';
import {completionGitReader} from '../tests/parallel-source-20261110/git-reader.mjs';
import {guardSuccessors} from '../tests/milestone100-20261114/source-stage8-guard-policy.mjs';
/** Explicit current successor adapter; the original graph and verifier remain literal. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {verifyCompletionBinding as retainedVerify,completionBindingDependencies as retainedDependencies} from './product-completion-lineage.mjs';
import {provePinnedSourceStage8,sourceStage8Policy,sourceStage8CapturePath} from '../tests/milestone100-20261114/source-stage8-activation.mjs';
const legacyBindingPaths=Object.freeze(["src/calculators/finance/compound-interest.test.ts", "src/components/full-six/candidate-workbench.tsx", ".github/workflows/ci.yml", "scripts/publication20-caller-lineage.mjs", "scripts/check-shortest-publication20.mjs", "src/calculators/source-acceptance-evidence.test.ts", "src/calculators/source-driven-evidence.test.ts", "src/components/final-private-workbench.tsx", "src/calculators/completion-manifest.test.ts", "src/components/catalog-engineering-review.tsx", "src/components/remaining-engineering-review.tsx", "src/components/remaining-engineering-review.lossless.test.tsx", "src/components/component-engineering-review.tsx", "src/components/private-workflow-review.tsx", "src/components/source-profile-review.tsx", "src/components/financial-contract-review.tsx", "src/components/publication20-tool.tsx", "src/components/publication20-tool.test.tsx", "tests/adoption1535/lineage.test.mjs", "tests/shortest-publication-20/caller-lineage.test.mjs", "tests/calculator-sprint-20261108/first-two-packet.test.mjs", "src/components/calculator-interactive.tsx", "src/lib/registered-snapshot-verification.ts", "tests/acceptance-closure-20261108/receipt-source-path.mjs", "scripts/check-current-six-candidate-evidence.mjs", "src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts", "tests/full-product-batch17/workflow.test.mjs", "src/components/technology-five-analysis.tsx"]);
const caller='src/components/calculator-interactive.tsx',guard='scripts/publication20-caller-lineage.mjs';
const guardV6='tests/shortest-publication-20/caller-lineage.test.mjs';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const needsStage8=name=>name===caller||name===guard||name===guardV6||sourceStage8Policy.paths.includes(name)||guardSuccessors.some(row=>row.path===name)||retainedDependencies(name).some(path=>path===guardV6||sourceStage8Policy.paths.includes(path)||guardSuccessors.some(row=>row.path===path));
function assertCurrentCallerBytes(bytes,git,read){
 const captureBytes=read(sourceStage8CapturePath);assert.equal(sha(captureBytes),sourceStage8Policy.captureSHA256,'Independent caller capture differs');
 const capture=JSON.parse(captureBytes),row=capture.rows.find(row=>row.path===caller)?.current;assert(row);assert.equal(row.ref,sourceStage8Policy.codeRef);assert.equal(row.path,caller);
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(git(['rev-parse',row.ref+':'+caller]).toString().trim(),row.blob);
 const current=git(['cat-file','blob',row.blob]);assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);
 if(!Buffer.isBuffer(bytes)||!bytes.equals(current))throw Error('Completion current successor differs');
}
/** An additional single import successor, separate from the five literal G2 guards. */
function shortestGuardPredecessor(git,read){
 const capture=JSON.parse(read('docs/parallel-source-20261110/capture-revision73.json'));assert(capture.sourceStage8V6.guardPaths.includes(guardV6),'Exact reviewed shortest guard scope required');
 const row=capture.currentSources.find(row=>row.path===guardV6);assert(row);assert.equal(row.ref,capture.sourceStage8V6.guardRef);
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(git(['rev-parse',row.ref+':'+guardV6]).toString().trim(),row.blob);
 const current=git(['cat-file','blob',row.blob]);assert.equal(current.length,row.bytes);assert.equal(sha(current),row.sha256);assert.equal(git(['rev-parse','HEAD:'+guardV6]).toString().trim(),row.blob);assert(read(guardV6).equals(current),'Current shortest guard successor differs');
 const previous=git(['show',sourceStage8Policy.predecessorRef+':'+guardV6]);
 const before="'../../scripts/product-completion-lineage.mjs'",after="'../../scripts/product-completion-stage8.mjs'",text=previous.toString();assert.equal(text.split(before).length,2);
 assert(Buffer.from(text.replace(before,after)).equals(current),'Only the exact dependency-reader import may change');return {previous,current};
}
export const completionBindingDependencies=name=>legacyBindingPaths.includes(name)?Object.freeze([...new Set([...retainedDependencies(name),...sourceStage8Policy.paths,sourceStage8CapturePath,'tests/milestone100-20261114/receipt-source-path-stage8.mjs','tests/milestone100-20261114/source-stage8-activation.mjs','tests/milestone100-20261114/source-stage8-policy.mjs','tests/milestone100-20261114/source-stage8-guard-policy.mjs','scripts/product-completion-stage8.mjs',...accepted.map(row=>row.path),...guardSuccessors.map(row=>row.path)])]):retainedDependencies(name);
export function verifyCompletionBinding(name,bytes,claim,git,read=readFileSync){
 if(!legacyBindingPaths.includes(name))return retainedVerify(name,bytes,claim,git,read);
 const affected=needsStage8(name);
 if(!affected){const valid=retainedVerify(name,bytes,claim,git,read);if(!valid)return false;}
 const supplied=git;git=immutableTreeQueryReader(completionGitReader(git));
 // Refuse this exact path before the broader proof so existing caller-hash diagnostics stay precise.
 // This negative precheck grants no positive admission; the complete current proof still follows.
 if(name===caller)assertCurrentCallerBytes(bytes,git,read);
 const proofGit=(args,options)=>git(args,options);
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof supplied[name]==='function')proofGit[name]=values=>supplied[name](values);
 const proof=provePinnedSourceStage8({read,git:proofGit,root:fileURLToPath(new URL('../',import.meta.url))});
 verifyParallelAuthority(read,proofGit);
 const finish=result=>{assertSourceStage8HeadStable(proof);return result;};
 if(!affected)return finish(true);
 const guardV6Proof=name===guardV6||retainedDependencies(name).includes(guardV6)?shortestGuardPredecessor(git,read):undefined;
 let historicalBytes=bytes;
 const sourceRow=proof.live.get(name);
 if(sourceRow){assert(bytes.equals(git(['cat-file','blob',sourceRow.current.blob])),'Completion current successor differs');if(!sourceRow.predecessor)return finish(false);historicalBytes=proof.historicalInput.read(name);}
 if(guardSuccessors.some(row=>row.path===name)||retainedDependencies(name).some(path=>guardSuccessors.some(row=>row.path===path))){
  assert.deepEqual(guardSuccessors.map(row=>row.path),['scripts/check-current-six-candidate-evidence.mjs','scripts/check-shortest-publication20.mjs','scripts/publication20-caller-lineage.mjs','tests/cohort22-closure-20261109/caller-source.test.mjs','tests/execution-recovery-20261109/source-lineage.test.mjs'],'Exact reviewed guard successors required');
  for(const record of guardSuccessors){
   assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
   assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);
   const expected=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(expected).digest('hex'),record.sha256);
   assert(read(record.path).equals(expected),'Completion supplemental source bytes differ: '+record.path);
   if(record.path===name)assert(bytes.equals(expected),'Completion current successor differs');
  }
  if(guardSuccessors.some(row=>row.path===name))historicalBytes=git(['show',sourceStage8Policy.predecessorRef+':'+name]);
 }
 if(name===guardV6){assert(Buffer.isBuffer(bytes)&&bytes.equals(guardV6Proof.current),'Completion current successor differs');historicalBytes=guardV6Proof.previous;}
 const historicalRead=path=>path===guardV6&&guardV6Proof?Buffer.from(guardV6Proof.previous):guardSuccessors.some(row=>row.path===path)?git(['show',sourceStage8Policy.predecessorRef+':'+path]):proof.historicalInput.read(path);
 return finish(retainedVerify(name,historicalBytes,claim,git,historicalRead));
}
