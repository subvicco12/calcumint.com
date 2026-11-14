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
const caller='src/components/calculator-interactive.tsx',guard='scripts/publication20-caller-lineage.mjs';
const needsStage8=name=>name===caller||name===guard||sourceStage8Policy.paths.includes(name)||retainedDependencies(name).some(path=>sourceStage8Policy.paths.includes(path));
export const completionBindingDependencies=name=>needsStage8(name)?Object.freeze([...new Set([...retainedDependencies(name),...sourceStage8Policy.paths,sourceStage8CapturePath,...accepted.map(row=>row.path),...(name===guard?guardSuccessors.map(row=>row.path):[])])]):retainedDependencies(name);
export function verifyCompletionBinding(name,bytes,claim,git,read=readFileSync){
 if(!needsStage8(name))return retainedVerify(name,bytes,claim,git,read);
 const supplied=git;git=completionGitReader(git);
 const proofGit=(args,options)=>git(args,options);
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof supplied[name]==='function')proofGit[name]=values=>supplied[name](values);
 const proof=provePinnedSourceStage8({read,git:proofGit,root:fileURLToPath(new URL('../',import.meta.url))});
 verifyParallelAuthority(read,proofGit);
 let historicalBytes=bytes;
 const sourceRow=proof.live.get(name);
 if(sourceRow){assert(bytes.equals(git(['cat-file','blob',sourceRow.current.blob])),'Completion current successor differs');if(!sourceRow.predecessor)return false;historicalBytes=proof.historicalInput.read(name);}
 if(name===guard){
  assert.deepEqual(guardSuccessors.map(row=>row.path),['scripts/publication20-caller-lineage.mjs','tests/cohort22-closure-20261109/caller-source.test.mjs','tests/execution-recovery-20261109/source-lineage.test.mjs'],'Exact reviewed guard successors required');
  for(const record of guardSuccessors){
   assert.equal(git(['rev-parse','--verify',record.ref+'^{commit}']).toString().trim(),record.ref);
   assert.equal(git(['rev-parse',record.ref+':'+record.path]).toString().trim(),record.blob);
   const expected=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(expected).digest('hex'),record.sha256);
   assert(read(record.path).equals(expected),'Completion supplemental source bytes differ: '+record.path);
   if(record.path===name)assert(bytes.equals(expected),'Completion current successor differs');
  }
  historicalBytes=git(['show',sourceStage8Policy.predecessorRef+':'+name]);
 }
 const historicalRead=path=>name===guard&&guardSuccessors.some(row=>row.path===path)?git(['show',sourceStage8Policy.predecessorRef+':'+path]):proof.historicalInput.read(path);
 return retainedVerify(name,historicalBytes,claim,git,historicalRead);
}
