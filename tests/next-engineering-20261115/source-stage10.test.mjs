import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,mkdtempSync,symlinkSync,rmSync,writeFileSync} from 'node:fs';
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
 assert.throws(()=>proveSourceStage10({...input,git:args=>args.join(' ')==='rev-parse --show-toplevel'?Buffer.from('/tmp/forged-root\n'):git(args)}),/Git workspace root differs/);
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

test('delegated HEAD cannot replace the native workspace commit',()=>{
 const transport=args=>JSON.stringify(args)===JSON.stringify(['rev-parse','--verify','HEAD^{commit}'])?Buffer.from(policy.codeRef+'\n'):git(args);
 assert.notEqual(git(['rev-parse','HEAD']).toString().trim(),policy.codeRef);assert.throws(()=>proveSourceStage10({...input,git:transport}),/Native HEAD moved or supplied HEAD differs/);
});
test('isolated physical extra source, dirty tracked source and same-byte symlinks refuse concealed status and reads',()=>{
 const dir=mkdtempSync(join(tmpdir(),'stage10-physical-')),tree=join(dir,'tree');let added=false;
 try{
  git(['worktree','add','--detach',tree,'HEAD']);added=true;
  const stage10Module=new URL('./source-stage10.mjs',import.meta.url).href;
  const script=`import assert from 'node:assert/strict';import {readFileSync,writeFileSync,rmSync,renameSync,symlinkSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {proveSourceStage10} from ${JSON.stringify(stage10Module)};
   const root=process.cwd(),path='src/components/calculator-factory-portal.tsx',original=readFileSync(path),git=a=>execFileSync('git',a,{stdio:['ignore','pipe','pipe'],maxBuffer:64000000}),hidden=a=>a[0]==='status'?Buffer.alloc(0):git(a),input={root,git:hidden,read:p=>p===path?original:readFileSync(p)};
   writeFileSync('src/.unexpected-stage10-source','untracked');assert.throws(()=>proveSourceStage10(input),/native dirty or unknown source/);rmSync('src/.unexpected-stage10-source');
   writeFileSync(path,'changed actual tracked bytes');assert.throws(()=>proveSourceStage10(input),/native dirty or unknown source/);writeFileSync(path,original);
   renameSync(path,path+'.held');symlinkSync('calculator-factory-portal.tsx.held',path);assert.throws(()=>proveSourceStage10(input),/native dirty or unknown source/);rmSync(path);renameSync(path+'.held',path);`;
  execFileSync(process.execPath,['--input-type=module','-'],{cwd:tree,input:script,stdio:['pipe','pipe','pipe'],timeout:15000,maxBuffer:1000000});
 }finally{try{if(added)git(['worktree','remove','--force',tree]);}finally{rmSync(dir,{recursive:true,force:true});}}
});
