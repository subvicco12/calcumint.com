/** Isolated admission proposal only. Does not modify or replace any active policy. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';
const root=path.resolve(new URL('../..',import.meta.url).pathname);
const base='dc8544422dbb4ebccfc96e03431e64ebcf871fc9';
const ref=process.env.WORKER_A_INTAKE_CODE_REF;
assert.match(ref??'',/^[0-9a-f]{40}$/,'Explicit reviewed code commit required');
const git=args=>execFileSync('git',args,{cwd:root,maxBuffer:16*1024*1024});
assert.equal(git(['rev-parse','HEAD']).toString().trim(),ref);
assert.equal(git(['status','--porcelain','--','src']).toString().trim(),'');
const paths=[
 'src/components/remainder-capture-successor.test.tsx',
 'src/components/remainder-capture-successor.tsx',
 'src/lib/calculator-factory/completion/business.ts',
 'src/lib/calculator-factory/completion/math-worker-a.integration.test.ts',
 'src/lib/calculator-factory/completion/remainder-business-recovery.test.ts',
 'src/lib/calculator-factory/completion/remainder-capture-successor.test.ts',
 'src/lib/calculator-factory/completion/remainder-capture-successor.ts'
].sort();
assert.deepEqual(git(['diff','--name-only','-z',base,ref,'--','src']).toString().split('\0').filter(Boolean).sort(),paths);
assert.equal(git(['diff',base,ref,'--','src/calculators','src/lib/calculator-factory/registry.ts','.github','supabase','tests/milestone100-20261114','scripts/source-acceptance']).length,0);
const sha=b=>createHash('sha256').update(b).digest('hex');
const record=(at,p)=>{if(!git(['ls-tree','--name-only',at,'--',p]).toString().trim())return null;const blob=git(['rev-parse',at+':'+p]).toString().trim();const bytes=git(['cat-file','blob',blob]);return{path:p,ref:at,blob,bytes:bytes.length,sha256:sha(bytes)};};
const ancestry=[];let cursor=ref;while(true){ancestry.push(cursor);if(cursor===base)break;assert(ancestry.length<64);cursor=git(['rev-parse',cursor+'^']).toString().trim();}
const capture={kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef:base,codeRef:ref,ancestry,rows:paths.map(p=>({path:p,predecessor:record(base,p),current:record(ref,p)}))};
const bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n'),policy={predecessorRef:base,codeRef:ref,paths,captureSHA256:sha(bytes)};
const read=p=>readFileSync(path.join(root,p));
assert.equal(verifyExactStage({policy,captureBytes:bytes,git,read,root}).size,7);
assert.throws(()=>verifyExactStage({policy,captureBytes:Buffer.from('{}'),git,read,root}));
assert.throws(()=>verifyExactStage({policy,captureBytes:bytes,git,read:p=>p===paths[2]?Buffer.from('unauthorized'):read(p),root}),/Current factory bytes differ/);
assert.throws(()=>verifyExactStage({policy,captureBytes:bytes,git:args=>args.join(' ')==='rev-parse --verify HEAD^{commit}'?Buffer.from(base+'\n'):git(args),read,root}),/Unreviewed current source delta/);
const out=process.env.WORKER_A_INTAKE_ARTIFACTS||'/workspace/artifacts/worker-a-intake-20261115';mkdirSync(out,{recursive:true});
writeFileSync(path.join(out,'recovery-source-proposal.json'),bytes);
writeFileSync(path.join(out,'recovery-source-receipt.json'),JSON.stringify({codeRef:ref,predecessor:base,captureSHA256:sha(bytes),paths,checksPassed:4,activePolicyChanged:false,historicalArtifactsChanged:false,registeredEnginesChanged:false,sourceAdmission:'ISOLATED_PROPOSAL_VERIFIED_NOT_ACTIVATED',integration:'HELD_AT_SHARED_MANIFEST_BOUNDARY',releaseHold:true},null,2)+'\n');
console.log(JSON.stringify({codeRef:ref,checksPassed:4,sourceAdmission:'PROPOSAL_ONLY',captureSHA256:sha(bytes)}));
