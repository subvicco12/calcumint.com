/** Closed tests of the actual private negative filter and catalog join; no proof capability escapes. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex');
const core=readFileSync('tests/parallel-source-20261110/core.mjs','utf8');
const body=/function rejectChangedUnchangedFactoryBytes\(currentRead\)\{([\s\S]*?)\n\}\nfunction rejectChangedCurrentAuthorityBytes/.exec(core)[1];
function fixture({roster=['src/later.ts'],rows=roster,codeRef='later'}={}){
 const keep=Buffer.from('keep'),old=Buffer.from('old'),files=new Map([['src/keep.ts',keep],['src/later.ts',old]]),calls=[];
 const factory={rows:[...files].map(([path,bytes])=>({path,current:{path,ref:'factory',blob:'a'.repeat(40),sha256:hash(bytes),bytes:bytes.length}}))};
 const bytes=Buffer.from(JSON.stringify(factory)),policy={paths:[...files.keys()],codeRef:'factory',captureSHA256:hash(bytes)};files.set('factory-capture',bytes);
 const stage=Buffer.from(JSON.stringify({predecessorRef:'base',codeRef,rows:rows.map(path=>({path}))}));
 const empty=Buffer.from(JSON.stringify({predecessorRef:'base',codeRef:'empty',rows:[]}));
 files.set('stage9',empty);files.set('stage32',stage);
 const later={paths:roster,predecessorRef:'base',codeRef:'later',captureSHA256:hash(stage)},p9={paths:[],predecessorRef:'base',codeRef:'empty',captureSHA256:hash(empty)};
 const names=['completionPolicy','workflowPolicy','personalPolicy','testStagePolicy','appStage5Policy','testStage6Policy','sourceStage7Policy','sourceStage8Policy'];
 const run=new Function('assert','hash','Buffer','factoryPolicy','factoryCapturePath',...names,'sourceStage9Policy','sourceStage9CapturePath','sourceStage10Policy','sourceStage10CapturePath','return function(currentRead){'+body+'\n}')(assert,hash,Buffer,policy,'factory-capture',...names.map(()=>({paths:[]})),p9,'stage9',later,'stage32');
 const read=path=>{calls.push(path);return files.get(path);};return{files,calls,run:()=>run(read),read};
}
test('later nomination requires both independent capture digests before an old factory path is excluded',()=>{
 for(const path of ['stage9','stage32'])for(const value of [Buffer.from('{}'),'not bytes']){const f=fixture();f.files.set(path,value);assert.throws(f.run,/Independent later factory capture differs/);assert(!f.calls.includes('src/keep.ts'));assert(!f.calls.includes('src/later.ts'));}
});
test('hashed captures cannot nominate paths outside fixed policy, duplicate rows, or a different code identity',()=>{
 for(const options of [{rows:['src/unreviewed.ts']},{rows:['src/later.ts','src/later.ts']},{codeRef:'forged'}])assert.throws(fixture(options).run);
});
test('only the authenticated later path is excluded; unknown factory drift and repeated reads still refuse',()=>{
 const f=fixture();f.files.set('src/later.ts',Buffer.from('admitted later owner'));assert.equal(f.run(),undefined);assert(!f.calls.includes('src/later.ts'));f.files.set('src/keep.ts',Buffer.from('tamper'));assert.throws(f.run,/Current factory bytes differ/);assert.equal(f.calls.filter(p=>p==='stage32').length,2);
});
test('current32 workflows tamper and valid old factory reversion still refuse in the preceding full current-byte filter',async()=>{
 const {rejectChangedCurrentStageSourceBytes}=await import('../milestone100-20261114/source-stage8-negative-current-src.mjs');
 const p='src/lib/calculator-factory/workflows.ts',factory=JSON.parse(readFileSync('docs/calculator-factory/source-stage-20261112.json')),old=factory.rows.find(row=>row.path===p).current;
 const {execFileSync}=await import('node:child_process');const previous=execFileSync('git',['cat-file','blob',old.blob]);
 for(const bytes of [Buffer.from('tamper'),previous])assert.throws(()=>rejectChangedCurrentStageSourceBytes(path=>path===p?bytes:readFileSync(path)),/Independent current target bytes differ/);
});

const catalogSource=readFileSync('scripts/software-closure-evidence.mjs','utf8');
const catalogBody=/export function verifyPreservedSource\(name,current,historical,git\)\{([\s\S]*?)\n\}\nfunction retainedVerifyPreservedSource/.exec(catalogSource)[1];
async function catalogFixture({changeRow=()=>{},changeGit=(args,run)=>run(args)}={}){
 const {execFileSync}=await import('node:child_process');
 const {sourceStage10Policy:current32Policy}=await import('./source-stage10-current32-policy.mjs');
 const {sourceStage10Policy:retained26Policy,sourceStage10CapturePath:retained26CapturePath}=await import('./source-stage10-current26-policy.mjs');
 const name='src/calculators/catalog-reviewed-standard-evidence.test.ts',current=readFileSync(name),native=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']}),historical=native(['show','b96b1ac89971cb8418d2389fbd7c9571a57491f1:'+name]);
 const row=structuredClone(JSON.parse(readFileSync('docs/next-engineering-20261115/source/stage10-current32.json')).rows.find(row=>row.path===name));changeRow(row);
 const events=[],proof={live:new Map([[name,row]])};
 const run=new Function('assert','hash','createHash','completionGitReader','proveSourceStage10','assertSourceStage10Stable','readFileSync','current32Policy','retained26Policy','retained26CapturePath','retainedVerifyPreservedSource','return function(name,current,historical,git){'+catalogBody+'\n}')(assert,hash,createHash,git=>git,()=>{events.push('fresh-current32');return proof;},view=>{assert.equal(view,proof);events.push('final-stable');},readFileSync,current32Policy,retained26Policy,retained26CapturePath,()=>{throw Error('Other protected route retained');});
 const git=args=>changeGit(args,native);return{run:()=>run(name,current,historical,git),events,historical};
}
test('catalog exact same-byte32 join preserves literal26 and original corpus identities after fresh proof',async()=>{
 const f=await catalogFixture();assert.equal(f.run(),'ee95ed2dfaad9660c4e1891bd2013b6a3629969ab0905deb463850a5c13d0fc2');assert.deepEqual(f.events,['fresh-current32','final-stable']);
});
test('catalog same-hash arbitrary ref or changed row tuple cannot replace the one fixed32 join',async()=>{
 for(const changeRow of [row=>{row.current.ref='a'.repeat(40);},row=>{row.current.ref='29bbd941128fe79c825450f0541f630b45b995d8';},row=>{row.current.blob='b'.repeat(40);},row=>{row.current.bytes++;}]){const f=await catalogFixture({changeRow});assert.throws(f.run,/fixed current32 diagnostic ref-only join/);assert.deepEqual(f.events,['fresh-current32','final-stable']);}
});
test('catalog independently refuses retained26 capture or either immutable path substitution',async()=>{
 const name='src/calculators/catalog-reviewed-standard-evidence.test.ts';
 for(const changeGit of [
  (args,run)=>args[0]==='cat-file'&&args[2]==='a13975d31655865a5b21244ea3a6ef9d560829e0'?Buffer.from('{}'):run(args),
  ...['29bbd941128fe79c825450f0541f630b45b995d8','50240fb1d59a1f8d298718f85e58bd55b4b990c2'].map(ref=>(args,run)=>args[0]==='rev-parse'&&args[1]===ref+':'+name?Buffer.from('f'.repeat(40)+'\n'):run(args))
 ]){const f=await catalogFixture({changeGit});assert.throws(f.run,/retained26 diagnostic capture differs|diagnostic immutable path differs/);assert.deepEqual(f.events,['fresh-current32','final-stable']);}
});
