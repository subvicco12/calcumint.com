import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
test('verifies the delivered package and preserves unverified source/adoption gates',()=>{
 const output=execFileSync('python3',['scripts/verify-partial16-source.py','--check'],{encoding:'utf8'});assert.match(output,/53 member hashes/);
 const report=JSON.parse(readFileSync('docs/partial16-ci-recovery/source-audit.json','utf8'));assert.deepEqual(report.sourceCaptureCounts,{listed:48,verifiedDelivered:15,omittedNotVerifiable:33});assert.equal(report.implementationAdmitted,0);assert.deepEqual(report.sourcePartialIds,[19,120,128,129,130]);assert.equal(report.candidateCount,10);assert.equal(report.nationalProfile527.implementationAdmitted,false);
});
test('rejects altered archive bytes before accepting source assertions',()=>{
 const dir=mkdtempSync(path.join(os.tmpdir(),'partial16-corrupt-'));try{const bytes=readFileSync('docs/partial16-ci-recovery/input/source-resolution-16.zip');bytes[50]^=1;const file=path.join(dir,'altered.zip');writeFileSync(file,bytes);const result=spawnSync('python3',['scripts/verify-partial16-source.py','--input',file,'--check'],{encoding:'utf8'});assert.ifError(result.error);assert.notEqual(result.status,0);assert.match(result.stderr,/archive SHA256 mismatch/);}finally{rmSync(dir,{recursive:true,force:true});}
});
