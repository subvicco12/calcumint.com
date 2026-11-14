import {completionGitReader} from '../tests/parallel-source-20261110/git-reader.mjs';
import {verifyCompletionBinding} from './product-completion-stage8.mjs';
import {verifyFinancialSafetyBinding} from './financial-safety-lineage.mjs';
import {verifyN1PublicationBinding,n1PublicationSupplementalPath} from './n1-publication-lineage.mjs';
import {verifyFrequencyPresentationBinding,frequencyPresentationSupplementalPath} from './frequency-presentation-lineage.mjs';
import {readFileSync,lstatSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const predecessor='2f088187dd395fd26262c32195b427258f44fa44',caller='src/components/calculator-interactive.tsx',priorManifest='docs/calculator-first-20261105/execution-manifest.json';
const expectedPaths=[caller,'src/components/publication20-tool.tsx','src/components/publication20-batch.tsx','src/lib/publication20/batch.ts','src/lib/publication20/types.ts','src/lib/publication20/index.ts','src/lib/publication20/conversions.ts','src/lib/publication20/network.ts','src/lib/publication20/result-trust.ts','src/lib/registered-input-successor.ts','src/lib/publication-factory-contracts-input.ts','src/lib/registered-snapshot-replay.ts','src/calculators/conversion/catalog-batch-1.ts','src/calculators/conversion/catalog-batch-2.ts','src/calculators/conversion/catalog-batch-3.ts','src/calculators/technology-computing/catalog-batch-1.ts','src/calculators/units.ts','src/calculators/engine.ts','src/calculators/types.ts','src/calculators/precision.ts'].sort();
const hash=v=>createHash('sha256').update(v).digest('hex');
function safe(directory,name){if(path.posix.isAbsolute(name)||name.includes('\\')||name.split('/').some(p=>!p||p==='.'||p==='..'))throw Error('Unsafe caller binding path');let p=directory;if(lstatSync(p).isSymbolicLink())throw Error('Unsafe caller binding symlink');for(const part of name.split('/')){p=path.join(p,part);if(lstatSync(p).isSymbolicLink())throw Error('Unsafe caller binding symlink');}if(!lstatSync(p).isFile())throw Error('Caller binding must be a file');return readFileSync(p);}
/** Append-only successor proof; original manifests and predecessor checks are not rewritten. */
export function verifyPublication20CallerLineage(directory){
 const raw=safe(directory,'docs/shortest-publication-20/caller-lineage.json'),m=JSON.parse(raw);
 if(Object.keys(m).sort().join(',')!=='canonicalPromotion,kind,predecessorCallerSHA256,predecessorManifestSHA256,predecessorRef,releaseHold,sourceHashes'||m.kind!=='PUBLICATION20_CALLER_SUCCESSOR_ONLY'||m.predecessorRef!==predecessor||m.releaseHold!==true||m.canonicalPromotion!==false)throw Error('Caller predecessor/authority binding differs');
 if(JSON.stringify(Object.keys(m.sourceHashes??{}).sort())!==JSON.stringify(expectedPaths))throw Error('Caller source binding membership differs');
 // Reject unsafe declared source paths before deeper successor dependencies are read.
 // This preflight grants no source/hash admission; every original proof still follows.
 for(const name of [...expectedPaths,frequencyPresentationSupplementalPath,n1PublicationSupplementalPath])safe(directory,name);
 const git=completionGitReader((args,options={})=>execFileSync('git',args,{cwd:directory,maxBuffer:8*1024*1024,stdio:['pipe','pipe','pipe'],...options}));
 if(git(['rev-parse','--verify',predecessor+'^{commit}']).toString().trim()!==predecessor)throw Error('Exact caller predecessor unavailable');
 const oldCaller=git(['show',predecessor+':'+caller]),oldManifest=git(['show',predecessor+':'+priorManifest]);
 if(hash(oldCaller)!==m.predecessorCallerSHA256||hash(oldManifest)!==m.predecessorManifestSHA256||!safe(directory,priorManifest).equals(oldManifest))throw Error('Original predecessor source/manifest hash differs');
 for(const name of expectedPaths){
  const bytes=safe(directory,name);
  if(name===caller){
   try{
    if(verifyCompletionBinding(name,bytes,m.sourceHashes[name],git,p=>safe(directory,p))!==true)throw Error('Current technology caller source hash succession unavailable');
   }catch(error){
    if(error instanceof Error&&error.message==='Completion current successor differs')throw Error('Caller source hash differs: '+name,{cause:error});
    throw error;
   }
  }else if(name==='src/components/publication20-tool.tsx'){
   // Preserve the original frequency->N1 proof on its exact historical bytes.
   const historical=git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+name]);
   if(verifyN1PublicationBinding(name,historical,m.sourceHashes[name],git)!==true)throw Error('Historical converter source chain unavailable');
   // Independently admit only the reviewed current Final UI and target-tree dependencies.
   if(verifyCompletionBinding(name,bytes,hash(historical),git,p=>safe(directory,p))!==true)throw Error('Current converter Final source chain unavailable');
  }else if(!verifyFinancialSafetyBinding(name,bytes,m.sourceHashes[name],git)&&!verifyN1PublicationBinding(name,bytes,m.sourceHashes[name],git)&&!verifyFrequencyPresentationBinding(name,bytes,m.sourceHashes[name],git)&&(!/^[a-f0-9]{64}$/.test(m.sourceHashes[name])||hash(bytes)!==m.sourceHashes[name]))throw Error('Caller source hash differs: '+name);
  if((name.startsWith('src/calculators/')||['src/lib/registered-input-successor.ts','src/lib/publication-factory-contracts-input.ts'].includes(name))&&!bytes.equals(git(['show',predecessor+':'+name]))&&!verifyFinancialSafetyBinding(name,bytes,hash(git(['show',predecessor+':'+name])),git))throw Error('Frozen engine/parser predecessor differs: '+name);
 }
 verifyFrequencyPresentationBinding(frequencyPresentationSupplementalPath,safe(directory,frequencyPresentationSupplementalPath),undefined,git);
 verifyN1PublicationBinding(n1PublicationSupplementalPath,safe(directory,n1PublicationSupplementalPath),undefined,git);
 return {predecessorCallerBytes:oldCaller,currentCallerSHA256:m.sourceHashes[caller],sourceBindings:expectedPaths.length,supplementalSourceBindings:2};
}
