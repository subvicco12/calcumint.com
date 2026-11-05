import test from 'node:test';
import assert from 'node:assert/strict';
import {copyFileSync,mkdirSync,mkdtempSync,readFileSync,rmSync,writeFileSync,symlinkSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {verifyCallerSuccessor} from '../../scripts/check-calculator-closure-history.mjs';
const root=path.resolve('.'),manifestPath='docs/calculator-first-20261105/execution-manifest.json';
function fixture(run){const dir=mkdtempSync(path.join(os.tmpdir(),'caller-successor-test-'));try{const m=JSON.parse(readFileSync(manifestPath));for(const p of [manifestPath,...Object.keys(m.callerSuccessorHashes)]){mkdirSync(path.dirname(path.join(dir,p)),{recursive:true});copyFileSync(path.join(root,p),path.join(dir,p));}return run(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
test('verifies exact successor and frozen predecessor guard sources without editing history',()=>{assert.equal(verifyCallerSuccessor().callerSuccessorVerified,true);});
test('rejects arbitrary caller changes',()=>fixture(dir=>{writeFileSync(path.join(dir,'src/components/calculator-interactive.tsx'),'unbound');assert.throws(()=>verifyCallerSuccessor(dir),/hash differs/);}));
test('rejects changes to the extracted caller implementation',()=>fixture(dir=>{writeFileSync(path.join(dir,'src/components/registered-launch-tool.tsx'),'unbound');assert.throws(()=>verifyCallerSuccessor(dir),/hash differs/);}));
test('rejects missing successor bindings',()=>fixture(dir=>{const p=path.join(dir,manifestPath),m=JSON.parse(readFileSync(p));delete m.callerSuccessorHashes['src/components/registered-launch-tool.tsx'];writeFileSync(p,JSON.stringify(m));assert.throws(()=>verifyCallerSuccessor(dir),/binding membership/);}));
test('rejects traversal and unrelated binding substitution',()=>fixture(dir=>{const p=path.join(dir,manifestPath),m=JSON.parse(readFileSync(p));m.callerSuccessorHashes['../escape']='0'.repeat(64);writeFileSync(p,JSON.stringify(m));assert.throws(()=>verifyCallerSuccessor(dir),/binding membership/);}));
test('rejects a symlinked caller',()=>fixture(dir=>{const p=path.join(dir,'src/components/calculator-interactive.tsx');rmSync(p);symlinkSync(path.join(root,'src/components/calculator-interactive.tsx'),p);assert.throws(()=>verifyCallerSuccessor(dir),/symlink/);}));
test('rejects an altered frozen guard',()=>fixture(dir=>{writeFileSync(path.join(dir,'scripts/check-historical-six-packets.mjs'),'unbound');assert.throws(()=>verifyCallerSuccessor(dir),/hash differs/);}));
for(const name of ['scripts/full-six/check-evidence.mjs','docs/full-six/execution-manifest.json'])test('rejects an altered full-six predecessor '+name,()=>fixture(dir=>{writeFileSync(path.join(dir,name),'unbound');assert.throws(()=>verifyCallerSuccessor(dir),/hash differs/);}));
test('rejects a different predecessor revision',()=>fixture(dir=>{const p=path.join(dir,manifestPath),m=JSON.parse(readFileSync(p));m.callerPredecessorRef='0'.repeat(40);writeFileSync(p,JSON.stringify(m));assert.throws(()=>verifyCallerSuccessor(dir),/predecessor binding differs/);}));
