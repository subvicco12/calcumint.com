/** Old R3 capture is historical; current bytes require independent R4 authority. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCurrentNextFiveSource,retained23Read} from '../../next-five-20261110/source/current-proof.mjs';
import {verifyFixedCallerStageAnchor as retainedAnchor} from '../../next-five-20261110/source/retained-r3-anchor.mjs';
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function verifyFixedCallerStageAnchor(capture,read=readFileSync,git=sourceGit){
 assert.equal(createHash('sha256').update(JSON.stringify(capture)).digest('hex'),'57e0936a33aca1bd3d1a68cf900f8be21a30627c758faffa9fff57c902094c0a','Fixed next caller capture differs');
 assert.equal(verifyCurrentNextFiveSource(read,git),true);
 return retainedAnchor(capture,path=>retained23Read(path,git),git);
}
