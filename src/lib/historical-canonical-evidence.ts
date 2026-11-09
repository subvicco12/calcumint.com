/** Historical technical evidence remains historical; guard admission grants no acceptance. */
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {copyCalculationData} from './calculation-snapshot';
import {prepareCanonicalContractEvidence,type CanonicalContractEvidence} from './canonical-evidence-preparation';
import {verifyFinancialSafetyBinding} from '../../scripts/financial-safety-lineage.mjs';
const revision='a955cdad7019a645b7ed2950299d0603ba1784a7';
const artifact='docs/full-product-batch14/contract-evidence.json';
const artifactBlob='5ea27acb1deb19a66ba614a50c84f0662a10c2fd';
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
const git=(args:string[])=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
/** Compare the immutable original against current metadata, admitting only exact proven guards. */
export function validateHistoricalCanonicalEvidence(raw:unknown):CanonicalContractEvidence{
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
 const currentFiles=current.implementationSourceSnapshot.files;
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

// Exact caller-only transitions. These Git blobs are retained by the repair commit;
// no runtime arithmetic, historical witnesses or governance claims are replaced.
const batch16Callers=[
 {path:'src/lib/batch16-requirement-evidence.ts',before:'bb2ff9241931287d195de096ebaf078771b50185',after:'79838d62faf69e9b2f8fddb23311388d98296558'},
 {path:'scripts/batch16-requirement-evidence.ts',before:'1cbb185058e2912e49689789bbbd35427fed49f5',after:'a4bc9c47c1df6761dfa43a3465e7884ddb5a2f14'},
] as const;
/** Fresh witnesses and every field must still reproduce the exact historical report. */
export function validateHistoricalBatch16Report<T extends {sourceHashes:Record<string,string>}>(current:T):T{
 const path='docs/full-product-batch16/requirements-540.json';
 const blob='4345098480416362f319abdd2a9910c94f9bd2f4';
 if(git(['rev-parse',revision+':'+path]).toString().trim()!==blob)throw Error('Historical Batch16 object differs');
 const originalText=git(['cat-file','blob',blob]).toString();
 if(readFileSync(path,'utf8')!==originalText)throw Error('Historical Batch16 artifact differs');
 const original=JSON.parse(originalText) as T;
 const clean=copyCalculationData({value:current},{}).input.value as T;
 const restored={...clean,sourceHashes:{...clean.sourceHashes}};
 for(const binding of batch16Callers){
  if(git(['rev-parse',revision+':'+binding.path]).toString().trim()!==binding.before)throw Error('Historical Batch16 caller differs');
  const before=git(['cat-file','blob',binding.before]);
  const after=git(['cat-file','blob',binding.after]);
  const bytes=readFileSync(binding.path);
  if(!bytes.equals(after)||original.sourceHashes[binding.path]!==hash(before.toString())||current.sourceHashes[binding.path]!==hash(bytes.toString()))throw Error('Exact Batch16 caller transition differs: '+binding.path);
  restored.sourceHashes[binding.path]=original.sourceHashes[binding.path];
 }
 if(JSON.stringify(restored)!==JSON.stringify(original))throw Error('Historical Batch16 current witnesses, sources or restrictions differ');
 return original;
}
