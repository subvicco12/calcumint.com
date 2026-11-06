import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {callerPaths,verifyCallerSuccessor} from './caller-successor.mjs';
const bindings=JSON.parse(readFileSync(new URL('../../docs/p0-decision-contracts/writers-acl.json',import.meta.url))).sourceBindings;
for(const callerPath of callerPaths){
const bytes=readFileSync(new URL('../../'+callerPath,import.meta.url));
const original=bindings[callerPath];
test(callerPath+': caller successor verifies original and successor Git objects',()=>{verifyCallerSuccessor(callerPath,bytes,original);});
test(callerPath+': tampered caller is rejected with original historical claim',()=>{assert.throws(()=>verifyCallerSuccessor(callerPath,Buffer.concat([bytes,Buffer.from('\n// tampered\n')]),original),/Exact draft-safety caller successor/);});
test(callerPath+': rewriting claimed hash cannot authorize tampered caller',()=>{const tampered=Buffer.concat([bytes,Buffer.from('\n// tampered\n')]);const rewritten=createHash('sha256').update(tampered).digest('hex');assert.throws(()=>verifyCallerSuccessor(callerPath,tampered,rewritten),/Original decision caller binding/);});
test(callerPath+': rewriting historical claim to current bytes is rejected',()=>{const rewritten=createHash('sha256').update(bytes).digest('hex');assert.throws(()=>verifyCallerSuccessor(callerPath,bytes,rewritten),/Original decision caller binding/);});
}
test('unlisted closure path cannot use successor exception',()=>{assert.throws(()=>verifyCallerSuccessor('src/unknown.ts',Buffer.from('tampered'),'rewritten'),/Explicit caller successor path required/);});
