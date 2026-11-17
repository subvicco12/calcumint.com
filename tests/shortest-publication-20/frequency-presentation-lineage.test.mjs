import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {verifyFrequencyPresentationBinding} from '../../scripts/frequency-presentation-lineage.mjs';
const name='src/components/publication20-tool.tsx';
const bytes=readFileSync(name);
const claim=JSON.parse(readFileSync('docs/shortest-publication-20/caller-lineage.json')).sourceHashes[name];
const immutableNativeGit=makeGitReader((args,options={})=>execFileSync('git',args,{...options}));
const git=immutableNativeGit;
test('requires independent successor Git object bytes even when current file matches its pinned SHA',()=>{
 assert.throws(()=>verifyFrequencyPresentationBinding(name,bytes,claim,args=>args[0]==='cat-file'&&args[2]==='d905119cbb745eee673b4215bcc59359d9692fe1'?Buffer.from('changed object'):git(args)),/source hash/);
});
test('requires exact predecessor path object even when historical SHA claim is unchanged',()=>{
 assert.throws(()=>verifyFrequencyPresentationBinding(name,bytes,claim,args=>args[0]==='rev-parse'&&args[1].includes(':')?Buffer.from('0'.repeat(40)):git(args)),/predecessor binding/);
});

test('full shortest-publication guard binds the current verifier and preserves historical caller claims',()=>{
 const receipt=JSON.parse(execFileSync(process.execPath,['scripts/check-shortest-publication20.mjs'],{encoding:'utf8'}));
 assert.equal(receipt.identities,20);
 assert.equal(receipt.publicationEligible,0);
 assert.equal(receipt.canonicalAccepted,0);
 assert.equal(receipt.releaseHold,true);
});
