import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {proveSourceStage10} from './source-stage10.mjs';
import {sourceStage10Policy,sourceStage10CapturePath} from './source-stage10-current-policy.mjs';
const root=process.cwd();
test('Stage10 batches only the supplied fixed immutable capabilities before the unchanged complete proof',()=>{
 const calls=[],git=(args,options)=>sourceGit(args,options);
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])git[name]=values=>{calls.push([name,values]);return sourceGit[name](values);};
 const proof=proveSourceStage10({root,read:readFileSync,git});assert.equal(proof.live.size,24);
 assert.deepEqual(calls.find(([name])=>name==='preloadCommits')[1],sourceStage10Policy.ancestry);
 const paths=calls.filter(([name])=>name==='preloadPaths').flatMap(([,values])=>values),capture=JSON.parse(readFileSync(sourceStage10CapturePath));
 for(const row of capture.rows)for(const record of [row.predecessor,row.current].filter(Boolean))assert(paths.some(value=>value.ref===record.ref&&value.path===record.path&&value.blob===record.blob));
 assert(paths.every(row=>/^[0-9a-f]{40}$/.test(row.ref)&&/^[0-9a-f]{40}$/.test(row.blob)));
});
test('an opaque reader gains no preload bypass and every original immutable query remains observable',()=>{
 const calls=[],git=(args,options)=>{calls.push(args);return sourceGit(args,options);};
 assert.equal(proveSourceStage10({root,read:readFileSync,git}).live.size,24);
 for(const ref of sourceStage10Policy.ancestry)assert(calls.some(args=>args[0]==='cat-file'&&args[1]==='commit'&&args[2]===ref));
 assert(calls.some(args=>args[0]==='status'));assert.equal(git.preloadCommits,undefined);
});
