/** Incremental native-observation and named-current-source repair; original capture stays literal. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {sourceStage10Policy} from './source-stage10-policy.mjs';
import {proveSourceStage10} from './source-stage10.mjs';
export function installNextSourceLint({guardRef}){
 assert.match(guardRef,/^[a-f0-9]{40}$/);const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024}),sha=b=>createHash('sha256').update(b).digest('hex');
 const record=path=>{const blob=git(['rev-parse',guardRef+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);assert(bytes.equals(readFileSync(path)),'Commit exact guard first: '+path);return{path,ref:guardRef,blob,bytes:bytes.length,sha256:sha(bytes)};};
 proveSourceStage10({root:process.cwd(),read:readFileSync,git});
 const paths=['scripts/fetch-source-lineage.mjs','tests/milestone100-20261114/source-preflight-stage8.mjs','tests/parallel-source-20261110/core.mjs','tests/parallel-source-20261110/bootstrap.mjs','tests/next-engineering-20261115/source-stage10.test.mjs','tests/next-engineering-20261115/source-availability.test.mjs','tests/next-engineering-20261115/source-admission-lint.mjs'].sort();
 const retainedPath='docs/next-engineering-20261115/source/guard-capture-deadline.json',retained=readFileSync(retainedPath);assert(retained.equals(git(['show','347c9e65:'+retainedPath])),'Reviewed predecessor capture changed');
 const capture=JSON.parse(retained),records=paths.map(record),byPath=new Map(capture.currentSources.map(row=>[row.path,row]));for(const row of records)byPath.set(row.path,row);capture.currentSources=[...byPath.values()];capture.sourceStage10={...capture.sourceStage10,guardPaths:[...new Set([...capture.sourceStage10.guardPaths,...paths])].sort()};capture.sourceStage10Lint={guardRef,guardPaths:paths,retainedCapturePath:retainedPath,retainedCaptureSHA256:sha(retained),scope:'Native observations and actual current named-source rows. No new cohort qualification.'};
 const output='docs/next-engineering-20261115/source/guard-capture-lint.json',bytes=Buffer.from(JSON.stringify(capture,null,2)+'\n');writeFileSync(output,bytes);records.push({path:output,blob:createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),sha256:sha(bytes)});
 const path='tests/parallel-source-20261110/authority.mjs';let source=readFileSync(path,'utf8');assert.equal(source.split('export const acceptedStage10Lint=Object.freeze([]);').length,2);source=source.replace('export const acceptedStage10Lint=Object.freeze([]);','export const acceptedStage10Lint=Object.freeze('+JSON.stringify(records.map(({path,blob,sha256})=>({path,blob,sha256})),null,2)+');').replace('export const additionalStage10LintBootstrapRefs=Object.freeze([]);','export const additionalStage10LintBootstrapRefs=Object.freeze('+JSON.stringify([guardRef,'13298943d7357e4593c25772c3e7d9db118db623'])+');');writeFileSync(path,source);return{guardRef,paths,captureSHA256:sha(bytes),qualified:false};
}
