import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,mkdtempSync,rmSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {tmpdir} from 'node:os';import {join} from 'node:path';
import {verifyExactStage} from '../calculator-factory-source-20261112/exact-stage.mjs';import {verifyExactCurrent26} from './source-exact-current26.mjs';import {sourceStage10Policy as policy,sourceStage10CapturePath} from './source-stage10-current26-policy.mjs';
const root=process.cwd(),git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']}),captureBytes=readFileSync(sourceStage10CapturePath),input={read:readFileSync,git,root,captureBytes};
test('fixed26 admits only the two exact reviewed test changes while the original API still forbids calculator paths',()=>{
 assert.equal(verifyExactCurrent26(input).size,26);
 assert.throws(()=>verifyExactStage({...input,policy}),/Exact safe non-mathematical source path required/);
 assert.throws(()=>verifyExactCurrent26({...input,policy}),/Only explicit fixed26 source inputs allowed/);
 for(const path of ['src/calculators/unreviewed-engine.ts','src/calculators/unreviewed.test.ts']){const c=JSON.parse(captureBytes);c.rows[0].path=path;assert.throws(()=>verifyExactCurrent26({...input,captureBytes:Buffer.from(JSON.stringify(c))}),/Independent factory capture digest differs/);}
});
test('original23 and24 captures/policies remain literal and both diagnostic parent edges are exact',()=>{
 for(const path of ['docs/next-engineering-20261115/source/stage10.json','tests/next-engineering-20261115/source-stage10-policy.mjs','docs/next-engineering-20261115/source/stage10-current24.json','tests/next-engineering-20261115/source-stage10-current-policy.mjs'])assert(readFileSync(path).equals(git(['show','0d497eb2683b88418c4820a73f2bf1d3f99810d7:'+path])));
 assert.deepEqual(git(['diff','--name-only','822743dd987bc2f07e52ab07a3c2ef4ab05f625f','3374da0e4421c30bd34d5b93b9ac71746f6fc699','--','src']).toString().trim().split('\n'),['src/calculators/catalog-reviewed-standard-evidence.test.ts']);
 assert.deepEqual(git(['diff','--name-only','3374da0e4421c30bd34d5b93b9ac71746f6fc699',policy.codeRef,'--','src']).toString().trim().split('\n'),['src/lib/five-full-contract-evidence.test.ts']);
});
test('new calculator engine or other test paths remain refused by native whole-source proof',()=>{
 const dir=mkdtempSync(join(tmpdir(),'calcumint-current26-')),tree=join(dir,'tree');
 try{execFileSync('git',['clone','--shared','--no-checkout',root,tree],{stdio:['ignore','pipe','pipe']});execFileSync('git',['checkout','--detach','HEAD'],{cwd:tree,stdio:['ignore','pipe','pipe']});
 const script="import assert from'node:assert/strict';import{readFileSync,writeFileSync,rmSync}from'node:fs';import{execFileSync}from'node:child_process';import{proveSourceStage10}from'./tests/next-engineering-20261115/source-stage10.mjs';const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']}),input={root:process.cwd(),read:readFileSync,git};assert.equal(proveSourceStage10(input).live.size,26);for(const path of ['src/calculators/unreviewed-engine.ts','src/calculators/unreviewed.test.ts']){writeFileSync(path,'export const unexpected=1;');assert.throws(()=>proveSourceStage10(input),/native dirty or unknown source/);rmSync(path);}assert.equal(proveSourceStage10(input).live.size,26);";
 execFileSync(process.execPath,['--input-type=module','-e',script],{cwd:tree,stdio:['ignore','pipe','pipe'],maxBuffer:4000000});
 }finally{rmSync(dir,{recursive:true,force:true});}
});
