import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const hash=b=>createHash('sha256').update(b).digest('hex');
const archive=JSON.parse(readFileSync('docs/next-cohort-20261110/source-successors/retained-stage1/manifest.json'));
test('superseded stage1 code and context bytes remain exact historical records',()=>{assert.equal(archive.hostedCIVerified,false);for(const row of archive.sources){const bytes=readFileSync(row.fixture);assert.equal(hash(bytes),row.sha256);if(row.mainSourceRef)assert(bytes.equals(execFileSync('git',['show',row.mainSourceRef+':'+row.path],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024})));}});
test('superseded source capture and all original local proof receipts remain byte-identical',()=>{assert.equal(archive.canonicalApproval,false);assert.equal(archive.publicationApproval,false);for(const row of archive.originalEvidenceFilesUnchanged)assert.equal(hash(readFileSync(row.path)),row.sha256);});

const archive2=JSON.parse(readFileSync('docs/next-cohort-20261110/source-successors/retained-stage2/manifest.json'));
test('superseded revision2 code/context remains exact historical source',()=>{for(const row of archive2.sources){const b=readFileSync(row.fixture);assert.equal(hash(b),row.sha256);if(row.mainSourceRef)assert(b.equals(execFileSync('git',['show',row.mainSourceRef+':'+row.path],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024})));}});
test('revision2 capture and95-proof receipts remain byte-identical',()=>{for(const row of archive2.originalEvidenceFilesUnchanged)assert.equal(hash(readFileSync(row.path)),row.sha256);});
