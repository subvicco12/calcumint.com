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
 const git=args=>execFileSync('git',args,{cwd:directory,maxBuffer:8*1024*1024,stdio:['pipe','pipe','pipe']});
 if(git(['rev-parse','--verify',predecessor+'^{commit}']).toString().trim()!==predecessor)throw Error('Exact caller predecessor unavailable');
 const oldCaller=git(['show',predecessor+':'+caller]),oldManifest=git(['show',predecessor+':'+priorManifest]);
 if(hash(oldCaller)!==m.predecessorCallerSHA256||hash(oldManifest)!==m.predecessorManifestSHA256||!safe(directory,priorManifest).equals(oldManifest))throw Error('Original predecessor source/manifest hash differs');
 for(const name of expectedPaths){
  const bytes=safe(directory,name);
  if(!/^[a-f0-9]{64}$/.test(m.sourceHashes[name])||hash(bytes)!==m.sourceHashes[name])throw Error('Caller source hash differs: '+name);
  if((name.startsWith('src/calculators/')||['src/lib/registered-input-successor.ts','src/lib/publication-factory-contracts-input.ts'].includes(name))&&!bytes.equals(git(['show',predecessor+':'+name])))throw Error('Frozen engine/parser predecessor differs: '+name);
 }
 return {predecessorCallerBytes:oldCaller,currentCallerSHA256:m.sourceHashes[caller],sourceBindings:expectedPaths.length};
}
