/** Offline qualification only; this module never installs source authority. */
import {verifyExactStage} from './exact-stage.mjs';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(process.argv[2]);
const git=args=>execFileSync(process.env.BOOTSTRAP_GIT??'/usr/bin/git',['-C',root,...args],{env:{PATH:'/usr/bin:/bin',HOME:'/nonexistent',GIT_CONFIG_NOSYSTEM:'1',GIT_CONFIG_GLOBAL:'/dev/null'},timeout:15000});
assert.equal(git(['rev-parse','HEAD']).toString().trim(),'1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e','Wrong exact head');
assert.equal(git(['rev-parse','HEAD^{tree}']).toString().trim(),'209982b9a81d7bf9f4783228505b5a274563391f');
const rows=verifyExactStage({policy:JSON.parse(readFileSync(new URL('./policy.json',import.meta.url))),captureBytes:readFileSync(new URL('./capture.json',import.meta.url)),git,read:p=>readFileSync(resolve(root,p)),root});
assert.equal(rows.size,2);
assert.equal(git(['rev-parse','HEAD:src/calculators/conversion/catalog-batch-3.ts']).toString().trim(),'d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3','Immutable engine differs');
console.log(JSON.stringify({candidate:git(['rev-parse','HEAD']).toString().trim(),verifiedPaths:[...rows.keys()],admitted:false,activated:false}));
