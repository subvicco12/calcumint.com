import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {callerPaths,verifyCallerSuccessor,verifyRetainedCallerSuccessor} from './caller-successor.mjs';
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

// Pin the Business UI provenance independently of the verifier's allowlist.
test('Business API successor is the exact native frequency implementation Git object',()=>{
 const root=new URL('../../',import.meta.url);
 const path='src/app/business/api/page.tsx';
 const commit='a9f17d4f010355eb490318c3a868d445bf38f72f';
 const blob='749b321053ee8df70f5fadfb807fe982e6288930';
 assert.equal(execFileSync('git',['rev-parse','--verify',commit+':'+path],{cwd:root,encoding:'utf8'}).trim(),blob);
 const bytes=execFileSync('git',['cat-file','blob',blob],{cwd:root});
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'b55c1948dfceddc58bfa671421f97b5c3d384a212e8f3e7e7559aba95347887d');
 verifyRetainedCallerSuccessor(path,bytes,'9139a6fb155ae56b37b3b48738faf50197d1e3c5b1f7872391b53f495b2dcbc4');
 const historical=execFileSync('git',['cat-file','blob','28802b1b1655421ba90dbd3c78aa54d893d9e851'],{cwd:root});
 assert.throws(()=>verifyRetainedCallerSuccessor(path,historical,bindings[path]),/Exact draft-safety caller successor/);
 const changed=Buffer.from(bytes);changed[0]^=1;
 assert.throws(()=>verifyRetainedCallerSuccessor(path,changed,bindings[path]),/Exact draft-safety caller successor/);
});

test('shallow hosted CI explicitly retrieves all immutable caller provenance commits',()=>{
 const workflow=readFileSync(new URL('../../.github/workflows/ci.yml',import.meta.url),'utf8');
 assert.match(workflow,/git fetch --no-tags --depth=1 origin b1c606efd06930ae8363e98aa369298ed0c404aa 804028a913ee33021b14e67d0f40ee7893d896b6 a9f17d4f010355eb490318c3a868d445bf38f72f/);
});
