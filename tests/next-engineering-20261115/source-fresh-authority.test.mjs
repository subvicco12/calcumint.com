import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {accepted,verifyParallelAuthority,verifyCurrentParallelAuthorityAndSourceView} from '../parallel-source-20261110/authority.mjs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';
const root=process.cwd();
test('fixed-current authority returns its exact fresh canonical view and checks every actual accepted source',()=>{
 const seen=new Set(),read=path=>{seen.add(path);return readFileSync(path);},p=provePinnedSourceStage8({root,read,git:sourceGit});seen.clear();
 assert.equal(verifyCurrentParallelAuthorityAndSourceView(p.historicalInput),p);
 for(const row of accepted)assert(seen.has(row.path),'Skipped actual accepted row '+row.path);
 assert.equal(verifyParallelAuthority(p.historicalInput.read,p.historicalInput.git),true,'Legacy boolean API remains true');
 assert.throws(()=>verifyCurrentParallelAuthorityAndSourceView({...p.historicalInput,skip:true}),/Only explicit/);
});
test('full current authority never accepts a changed guard or substituted root from an earlier source view',()=>{
 let changed=false;const target='tests/parallel-source-20261110/bootstrap.mjs',read=path=>changed&&path===target?Buffer.from('changed live guard'):readFileSync(path),p=provePinnedSourceStage8({root,read,git:sourceGit});
 changed=true;assert.throws(()=>verifyCurrentParallelAuthorityAndSourceView(p.historicalInput),error=>error.message==='Independent current target bytes differ: '+target);changed=false;
 assert.throws(()=>verifyCurrentParallelAuthorityAndSourceView({...p.historicalInput,root:root+'/other'}),/Historical Stage8 root differs/);
});
