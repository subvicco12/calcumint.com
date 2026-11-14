import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {verifyExactStage} from './exact-stage.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
function fixture(run){const root=mkdtempSync(join(tmpdir(),'factory-stage-'));try{const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe']});git(['init','-q']);git(['config','user.name','Fixture']);git(['config','user.email','fixture@example.invalid']);mkdirSync(join(root,'src'));const p='src/factory.ts';writeFileSync(join(root,p),'old');git(['add','.']);git(['commit','-qm','prior']);const predecessorRef=git(['rev-parse','HEAD']).toString().trim();writeFileSync(join(root,p),'new');git(['add','.']);git(['commit','-qm','factory']);const codeRef=git(['rev-parse','HEAD']).toString().trim();const record=ref=>{const b=git(['show',ref+':'+p]);return{path:p,ref,blob:git(['rev-parse',ref+':'+p]).toString().trim(),bytes:b.length,sha256:sha(b)};};const capture={ancestry:[codeRef,predecessorRef],kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef,codeRef,rows:[{path:p,predecessor:record(predecessorRef),current:record(codeRef)}]};const captureBytes=Buffer.from(JSON.stringify(capture)),policy={predecessorRef,codeRef,paths:[p],captureSHA256:sha(captureBytes)};run({root,git,read:p=>readFileSync(join(root,p)),policy,captureBytes,capture,p});}finally{rmSync(root,{recursive:true,force:true});}}
test('exact immutable stage and later source-neutral commit pass',()=>fixture(o=>{assert.equal(verifyExactStage(o).size,1);writeFileSync(join(o.root,'note'),'later');o.git(['add','.']);o.git(['commit','-qm','metadata']);assert.equal(verifyExactStage(o).size,1);}));
test('capture substitution fails independent pin',()=>fixture(o=>assert.throws(()=>verifyExactStage({...o,captureBytes:Buffer.from('{}')}),/digest/)));
test('mutable byte substitution fails on every invocation',()=>fixture(o=>{verifyExactStage(o);assert.throws(()=>verifyExactStage({...o,read:()=>Buffer.from('tamper')}),/bytes/);}));
test('working source tamper and unknown source reject',()=>fixture(o=>{writeFileSync(join(o.root,o.p),'tamper');assert.throws(()=>verifyExactStage(o),/Dirty/);writeFileSync(join(o.root,o.p),'new');writeFileSync(join(o.root,'src/unknown.ts'),'unknown');assert.throws(()=>verifyExactStage(o),/Dirty/);}));
test('committed reversion rejects',()=>fixture(o=>{writeFileSync(join(o.root,o.p),'old');o.git(['add','.']);o.git(['commit','-qm','revert']);assert.throws(()=>verifyExactStage(o),/Unreviewed/);}));
test('committed additional source rejects',()=>fixture(o=>{writeFileSync(join(o.root,'src/unknown.ts'),'unknown');o.git(['add','.']);o.git(['commit','-qm','unknown']);assert.throws(()=>verifyExactStage(o),/Unreviewed/);}));
test('claimed predecessor substitution rejects even after capture repin',()=>fixture(o=>{o.capture.rows[0].predecessor=o.capture.rows[0].current;const captureBytes=Buffer.from(JSON.stringify(o.capture));assert.throws(()=>verifyExactStage({...o,captureBytes,policy:{...o.policy,captureSHA256:sha(captureBytes)}}));}));

test('independently repinned false parent chain rejects',()=>fixture(o=>{o.capture.ancestry=[o.policy.codeRef,'1'.repeat(40),o.policy.predecessorRef];const captureBytes=Buffer.from(JSON.stringify(o.capture));assert.throws(()=>verifyExactStage({...o,captureBytes,policy:{...o.policy,captureSHA256:sha(captureBytes)}}),/parent chain/);}));
test('commit substitution rejects even through supplied Git adapter',()=>fixture(o=>assert.throws(()=>verifyExactStage({...o,git:args=>args[0]==='cat-file'&&args[1]==='commit'?Buffer.from('substitute'):o.git(args)}),/Commit content address/)));
