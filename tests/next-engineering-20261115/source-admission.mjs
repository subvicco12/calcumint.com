/** Produce reviewable additive authority; never a certification or completion-count decision. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {sourceStage10Policy,sourceStage10CapturePath} from './source-stage10-policy.mjs';
import {proveSourceStage10} from './source-stage10.mjs';
export function installNextSourceAuthority({guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024});
 const sha=b=>createHash('sha256').update(b).digest('hex');
 const record=path=>{const blob=git(['rev-parse',guardRef+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(bytes.equals(readFileSync(path)),'Commit exact guard first: '+path);return{path,ref:guardRef,blob,bytes:bytes.length,sha256:sha(bytes)};};
 const paths=[
 'tests/next-engineering-20261115/source-stage10-policy.mjs',
 'tests/next-engineering-20261115/source-stage10.mjs',
 'tests/next-engineering-20261115/source-stage10.test.mjs',
 'tests/next-engineering-20261115/source-admission.mjs',
 sourceStage10CapturePath,
 'docs/next-engineering-20261115/source/authority-retained.mjs',
 'tests/four-worker-integration-20261115/source-stage9.mjs',
 'tests/parallel-source-20261110/core.mjs',
 'tests/parallel-source-20261110/bootstrap.mjs',
 'tests/milestone100-20261114/source-stage8-guard-selection.mjs',
 'tests/milestone100-20261114/source-stage8-live.test.mjs',
 'scripts/fetch-source-lineage.mjs',
 ].sort();
 const retainedPath='docs/parallel-source-20261110/capture-revision112.json',retained=readFileSync(retainedPath);assert(retained.equals(git(['show',sourceStage10Policy.predecessorRef+':'+retainedPath])),'Retained capture changed');
 const oldAuthority=readFileSync('docs/next-engineering-20261115/source/authority-retained.mjs');assert(oldAuthority.equals(git(['show',sourceStage10Policy.predecessorRef+':tests/parallel-source-20261110/authority.mjs'])),'Retained authority changed');
 const p=proveSourceStage10({root:process.cwd(),read:readFileSync,git}),records=paths.map(record),capture=JSON.parse(retained),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));
 for(const row of records)byPath.set(row.path,row);capture.currentSources=[...byPath.values()];capture.sourceStage10={guardRef,guardPaths:paths,retainedCapturePath:retainedPath,retainedCaptureSHA256:sha(retained),scope:'Exact engineering source admission only. Historical evidence retains its original calculator scopes; no new cohort qualification.',capturePath:sourceStage10CapturePath,captureSHA256:sourceStage10Policy.captureSHA256,predecessorRef:sourceStage10Policy.predecessorRef,codeRef:sourceStage10Policy.codeRef,paths:sourceStage10Policy.paths};
 const output='docs/next-engineering-20261115/source/guard-capture.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(output,bytes);records.push({path:output,blob:createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),sha256:sha(bytes)});
 const sourceRecords=[...p.live.values()].map(row=>row.current),authorityPath='tests/parallel-source-20261110/authority.mjs';let source=readFileSync(authorityPath,'utf8');assert.equal(source.split('export const acceptedStage10=Object.freeze([]);').length,2,'Only unarmed additive Stage10 overlay may be populated');
 source=source.replace('export const acceptedStage10=Object.freeze([]);','export const acceptedStage10=Object.freeze('+JSON.stringify([...records,...sourceRecords].map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');');
 source=source.replace('export const additionalStage10BootstrapRefs=Object.freeze([]);','export const additionalStage10BootstrapRefs=Object.freeze('+JSON.stringify([...new Set([guardRef,...sourceStage10Policy.ancestry])].sort())+');');writeFileSync(authorityPath,source);
 return{guardRef,paths,sourcePaths:sourceStage10Policy.paths,captureSHA256:sha(bytes),engineeringOnly:true,qualified:false};
}
