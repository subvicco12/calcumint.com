import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {copyCalculationData} from '../src/lib/calculation-snapshot';
import {prepareCanonicalContractEvidence,type CanonicalContractEvidence} from '../src/lib/canonical-evidence-preparation';
import {verifyFinancialSafetyBinding} from './financial-safety-lineage.mjs';
import {reconcileBatch14Membership} from '../tests/nine-path-source-repair-20261122/proof.mjs';

const revision='a955cdad7019a645b7ed2950299d0603ba1784a7';
const artifact='docs/full-product-batch14/contract-evidence.json';
const artifactBlob='5ea27acb1deb19a66ba614a50c84f0662a10c2fd';
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
const git=(args:string[])=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});

// Scoped successor of the original historical verifier. The complete original
// comparison follows the exact membership projection and is still mandatory.
export function validateNinePathBatch14(rawBytes:Buffer):CanonicalContractEvidence{
 const raw:unknown=JSON.parse(rawBytes.toString());
 const clean=copyCalculationData({value:raw},{}).input.value;
 if(git(['rev-parse',revision+':'+artifact]).toString().trim()!==artifactBlob)throw Error('Historical canonical evidence object differs');
 const original=JSON.parse(git(['cat-file','blob',artifactBlob]).toString()) as CanonicalContractEvidence;
 if(JSON.stringify(clean)!==JSON.stringify(original))throw Error('Historical canonical evidence differs from original artifact');
 const current=prepareCanonicalContractEvidence();
 const oldFiles=original.implementationSourceSnapshot.files;
 // The current tree includes one explicitly captured presentation-only addition.
 // Preserve the original412-file membership; never ignore arbitrary new sources.
 const supplemental={path:'src/calculators/final-framework/technology-scalar-presentation.ts',
  ref:'7086b85437b025225f5736fb6b849415e518dc08',blob:'d0d4a738021a84e08984bad3b45333c57a8030e1',
  sha256:'bb82638b8347e696e9276fa5e9b062696b1808d3fe8ff82a001538af7c0d5330'};
 const currentFiles=reconcileBatch14Membership({git,read:readFileSync,root:process.cwd()},current.implementationSourceSnapshot.files,rawBytes);
 const expectedPaths=[...oldFiles.map(file=>file.path),supplemental.path].sort();
 if(JSON.stringify(currentFiles.map(file=>file.path))!==JSON.stringify(expectedPaths))throw Error('Historical canonical source membership differs');
 if(git(['rev-parse','--verify',supplemental.ref+'^{commit}']).toString().trim()!==supplemental.ref||
    git(['rev-parse',supplemental.ref+':'+supplemental.path]).toString().trim()!==supplemental.blob)throw Error('Historical canonical supplemental provenance differs');
 const supplementalBytes=git(['cat-file','blob',supplemental.blob]);
 if(hash(supplementalBytes.toString())!==supplemental.sha256||
    currentFiles.find(file=>file.path===supplemental.path)?.sha256!==supplemental.sha256||
    !readFileSync(supplemental.path).equals(supplementalBytes))throw Error('Historical canonical supplemental source differs');
 const files=currentFiles.filter(file=>file.path!==supplemental.path).map((file,index)=>{
  const old=oldFiles[index];
  if(!old||old.path!==file.path)throw Error('Historical canonical source membership differs');
  const admitted=verifyFinancialSafetyBinding(file.path,readFileSync(file.path),old.sha256,git);
  if(old.sha256!==file.sha256&&!admitted)throw Error('Historical canonical source differs: '+file.path);
  return admitted?old:file;
 });
 if(files.length!==oldFiles.length)throw Error('Historical canonical source membership differs');
 const {contentSHA256:discarded,...body}=current;
 void discarded;
 const restored={...body,implementationSourceSnapshot:{...body.implementationSourceSnapshot,files,sourceTreeSHA256:hash(JSON.stringify(files))}};
 const expected={...restored,contentSHA256:hash(JSON.stringify(restored))};
 if(JSON.stringify(expected)!==JSON.stringify(original))throw Error('Historical canonical evidence differs from current metadata, identities or restrictions');
 return original;
}
