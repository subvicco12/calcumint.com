import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,mkdtempSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {proveSourceStage10,assertSourceStage10Stable} from './source-stage10.mjs';
import {sourceStage10Policy as policy,sourceStage10CapturePath} from './source-stage10-policy.mjs';
import {proveSourceStage9,assertSourceStage9Stable} from '../four-worker-integration-20261115/source-stage9.mjs';
const root=process.cwd(),git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:64*1024*1024}),read=readFileSync;
const input={root,read,git};
test('exact23 immutable source rows precede historical projection; final nested proofs retain current HEAD',()=>{
 const p=proveSourceStage10(input);assert.equal(p.live.size,23);const copy=p.live;copy.clear();assert.equal(p.live.size,23);
 for(const [path,row]of p.live){if(row.predecessor)assert(p.historicalInput.read(path).equals(git(['cat-file','blob',row.predecessor.blob])));else assert.throws(()=>p.historicalInput.read(path),/no historical bytes/);}
 assertSourceStage10Stable(p);assert.throws(()=>assertSourceStage10Stable({...p}),/Private verified/);
 const prior=proveSourceStage9(input);assert.equal(prior.nativeHead,p.nativeHead);assertSourceStage9Stable(prior);
});
test('all changed and added source bytes reject tamper and predecessor reversion',()=>{
 const capture=JSON.parse(read(sourceStage10CapturePath));
 for(const row of capture.rows)for(const bytes of [Buffer.from('tamper'),row.predecessor?git(['cat-file','blob',row.predecessor.blob]):Buffer.from('unadopted addition')])assert.throws(()=>proveSourceStage10({...input,read:path=>path===row.path?bytes:read(path)}),/Current factory bytes differ/);
});
test('capture and physical root cannot be replaced by supplied reader data',()=>{
 assert.throws(()=>proveSourceStage10({...input,read:p=>p===sourceStage10CapturePath?Buffer.from('{}'):read(p)}),/capture digest/);
 assert.throws(()=>proveSourceStage10({...input,root:root+'/other'}),/Actual workspace root/);
 assert.throws(()=>proveSourceStage10({...input,extra:true}),/Only explicit/);
 const p=proveSourceStage10(input);assert.throws(()=>proveSourceStage10({...p.historicalInput,read}),/historical reader differs/);assert.throws(()=>proveSourceStage10({...p.historicalInput,root:root+'/other'}),/root differs/);
});
test('dirty or additional source paths, forged Git paths, versions and missing Git refuse',()=>{
 for(const status of ['?? src/extra.ts\n',' M src/lib/calculator-factory/registry.ts\n'])assert.throws(()=>proveSourceStage10({...input,git:args=>args[0]==='status'?Buffer.from(status):git(args)}),/Committed current src/);
 assert.throws(()=>proveSourceStage10({...input,git:args=>args[0]==='diff'&&args.includes(policy.predecessorRef)?Buffer.from('src/unreviewed.ts\0'):git(args)}),/source delta differs/);
 const file=policy.paths[0];assert.throws(()=>proveSourceStage10({...input,git:args=>args[0]==='rev-parse'&&args[1]===policy.codeRef+':'+file?Buffer.from('0'.repeat(40)+'\n'):git(args)}));
 assert.throws(()=>proveSourceStage10({...input,git:()=>{throw Error('Missing actual Git');}}),/Missing actual Git/);
});
test('stale historical capabilities and actual HEAD movement fail before nested projection',()=>{
 let tamper=false;const provider=p=>tamper&&p===policy.paths[0]?Buffer.from('tamper'):read(p);
 const p=proveSourceStage10({...input,read:provider});tamper=true;assert.throws(()=>assertSourceStage10Stable(p),/Current factory bytes differ/);assert.throws(()=>proveSourceStage9(p.historicalInput),/Current factory bytes differ/);
 let move=false;const transport=args=>move&&JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(policy.predecessorRef+'\n'):git(args);
 const stable=proveSourceStage10({...input,git:transport});move=true;assert.throws(()=>assertSourceStage10Stable(stable),/HEAD moved/);
});
test('redirected root and omitted closed reader dependencies refuse',()=>{
 const dir=mkdtempSync(join(tmpdir(),'next-source-root-'));try{symlinkSync(root,join(dir,'alias'));assert.throws(()=>proveSourceStage10({...input,root:join(dir,'alias')}),/Actual workspace root/);}finally{rmSync(dir,{recursive:true,force:true});}
 const names=new Set([sourceStage10CapturePath,...policy.paths]);assert.throws(()=>proveSourceStage10({...input,read:p=>{assert(names.has(p)&&p!==policy.paths[0],'Missing closed dependency');return read(p);}}),/Missing closed dependency/);
});
