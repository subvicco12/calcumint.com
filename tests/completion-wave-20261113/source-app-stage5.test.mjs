import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {proveAppStage5AndHistoricalInputs,stage4SourceRef} from './source-app-stage5.mjs';
import {appStage5PolicyTemplate} from './source-app-stage5-policy-template.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const run=(cwd,args)=>execFileSync('git',args,{cwd,stdio:['ignore','pipe','pipe'],maxBuffer:16000000});
const repo=resolve(new URL('../../',import.meta.url).pathname);
function fixture(){
 const root=mkdtempSync(join(tmpdir(),'stage5-proof-'));const git=args=>run(root,args);
 git(['init','-q']);git(['config','user.name','Stage5 Fixture']);git(['config','user.email','stage5-fixture@example.invalid']);
 const common=run(repo,['rev-parse','--git-common-dir']).toString().trim();mkdirSync(join(root,'.git/objects/info'),{recursive:true});writeFileSync(join(root,'.git/objects/info/alternates'),resolve(repo,common,'objects')+'\n');
 git(['update-ref','refs/heads/master',stage4SourceRef]);git(['config','core.sparseCheckout','true']);mkdirSync(join(root,'.git/info'),{recursive:true});
 const file='src/lib/thirteen-program-evidence.test.ts',added='src/lib/completion-wave-20261113/fixture.ts';writeFileSync(join(root,'.git/info/sparse-checkout'),file+'\n'+added+'\n');git(['read-tree','-mu','HEAD']);
 writeFileSync(join(root,file),Buffer.concat([readFileSync(join(root,file)),Buffer.from('\n// exact Stage5 test fixture\n')]));mkdirSync(join(root,'src/lib/completion-wave-20261113'),{recursive:true});writeFileSync(join(root,added),'export const boundedFixture = 1;\n');git(['add','--sparse',file,added]);git(['commit','-qm','Exact finite fixture']);
 const codeRef=git(['rev-parse','HEAD']).toString().trim(),paths=[added,file].sort();
 function record(ref,path){const blob=git(['rev-parse',ref+':'+path]).toString().trim(),bytes=git(['cat-file','blob',blob]);return{path,ref,blob,bytes:bytes.length,sha256:sha(bytes)};}
 const capture={kind:'EXACT_FACTORY_SOURCE_SUCCESSOR',predecessorRef:stage4SourceRef,codeRef,ancestry:[codeRef,stage4SourceRef],rows:paths.map(path=>({path,predecessor:path===added?null:record(stage4SourceRef,path),current:record(codeRef,path)}))};
 const bytes=Buffer.from(JSON.stringify(capture)),policy={captureSHA256:sha(bytes),predecessorRef:stage4SourceRef,codeRef,paths,ancestry:capture.ancestry},capturePath='stage5-capture.json';writeFileSync(join(root,capturePath),bytes);
 return{root,git,file,added,capture,bytes,policy,capturePath,read:path=>readFileSync(join(root,path))};
}
function withFixture(fn){const f=fixture();try{fn(f);}finally{rmSync(f.root,{recursive:true,force:true});}}
test('Stage5 template fails closed before capture or Git access',()=>assert.throws(()=>proveAppStage5AndHistoricalInputs({policy:appStage5PolicyTemplate,read:()=>{throw Error('must not read');}}),/pinned capture/));
test('real Git full SRC proof precedes literal Stage4 projection; new paths cannot masquerade as history',()=>withFixture(f=>{
 const proved=proveAppStage5AndHistoricalInputs(f);assert.equal(proved.live.size,2);assert.equal(proved.historicalInput.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim(),stage4SourceRef);assert(proved.historicalInput.read(f.file).equals(f.git(['show',stage4SourceRef+':'+f.file])));assert.throws(()=>proved.historicalInput.read(f.added),/no Stage4 input/);
 f.git(['commit','--allow-empty','-qm','Metadata only']);assert.equal(proveAppStage5AndHistoricalInputs(f).live.size,2);
}));
test('capture substitution, ancestry substitution, blob substitution fail closed',()=>withFixture(f=>{
 assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,read:path=>path===f.capturePath?Buffer.from('{}'):f.read(path)}),/capture digest/);
 assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,policy:{...f.policy,ancestry:[f.policy.codeRef]}}),/finite ancestry/);
 assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,git:args=>args[0]==='rev-parse'&&args[1]===f.policy.codeRef+':'+f.file?Buffer.from('0'.repeat(40)+'\n'):f.git(args)}));
}));
test('tamper, retained-valid revert, dirty and extra current SRC fail closed',()=>withFixture(f=>{
 for(const replacement of [Buffer.from('tampered'),f.git(['show',stage4SourceRef+':'+f.file])])assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,read:path=>path===f.file?replacement:f.read(path)}),/bytes differ/);
 writeFileSync(join(f.root,f.file),'dirty');assert.throws(()=>proveAppStage5AndHistoricalInputs(f),/Dirty or unknown/);f.git(['checkout','--',f.file]);
 writeFileSync(join(f.root,'src/unauthorized.ts'),'extra');assert.throws(()=>proveAppStage5AndHistoricalInputs(f),/Dirty or unknown/);f.git(['add','--sparse','src/unauthorized.ts']);f.git(['commit','-qm','Unreviewed source']);assert.throws(()=>proveAppStage5AndHistoricalInputs(f),/Unreviewed current source delta/);
}));
test('actual filesystem symlink cannot replace verified current source',()=>withFixture(f=>{
 const path=join(f.root,f.file),bytes=f.read(f.file);rmSync(path);writeFileSync(join(f.root,'substitute'),bytes);symlinkSync(join(f.root,'substitute'),path);assert.throws(()=>proveAppStage5AndHistoricalInputs(f));
}));
test('parent-content substitution, altered row hashes and undeclared finite paths fail closed',()=>withFixture(f=>{
 assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,git:args=>args[0]==='cat-file'&&args[1]==='commit'&&args[2]===f.policy.codeRef?Buffer.from('tree '+'0'.repeat(40)+'\n\nsubstituted\n'):f.git(args)}),/content address/);
 const changed=structuredClone(f.capture);changed.rows[0].current.sha256='0'.repeat(64);const bytes=Buffer.from(JSON.stringify(changed));assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,policy:{...f.policy,captureSHA256:sha(bytes)},read:path=>path===f.capturePath?bytes:f.read(path)}));
 assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,policy:{...f.policy,paths:[f.file]}}),/finite paths/);
}));
test('owned immutable preload retains all raw content checks and receives only pinned ancestry',()=>withFixture(f=>{
 let calls=0;f.git.preloadCommits=refs=>{calls++;assert.deepEqual(refs,f.policy.ancestry);};assert.equal(proveAppStage5AndHistoricalInputs(f).live.size,2);assert.equal(calls,1);
 const substituted=args=>args[0]==='cat-file'&&args[1]==='commit'&&args[2]===f.policy.codeRef?Buffer.from('substituted after preload'):f.git(args);substituted.preloadCommits=f.git.preloadCommits;
 assert.throws(()=>proveAppStage5AndHistoricalInputs({...f,git:substituted}),/content address/);assert.equal(calls,2);
}));
