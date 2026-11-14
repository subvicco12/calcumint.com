import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=readFileSync(new URL('../parallel-source-20261110/core.mjs',import.meta.url),'utf8');
const body=/function rejectChangedCurrentAuthorityBytes\(read,git\)\{([\s\S]*?)\n\}/.exec(source)?.[1];assert(body);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(historical=false){
 const files=new Map([['guard-a',Buffer.from('a')],['guard-b',Buffer.from('b')]]),events=[];
 const actual=path=>{events.push(path);assert(files.has(path),'Undeclared target '+path);return files.get(path);};
 const old=()=>{throw Error('Historical bytes cannot supply actual source');},git=()=>{throw Error('Git cannot run during negative filter');};
 const view=historical?{historicalInput:{read:old},actualInput:{read:actual}}:undefined;
 let expandedError;
 const run=new Function('assert','hash','sourceStage8HistoricalView','accepted','rejectChangedCurrentStageSourceBytes','rejectChangedUnchangedFactoryBytes','return function(read,git){'+body+'\n}')(assert,hash,()=>view,[...files].map(([path,bytes])=>({path,sha256:hash(bytes)})),read=>{assert.equal(read,actual);events.push('expanded');if(expandedError)throw expandedError;},read=>{assert.equal(read,actual);events.push('factory');});
 return{files,events,actual,old,git,run,invoke:()=>run(historical?old:actual,git),setError:error=>{expandedError=error;}};
}
test('native inputs retain early SRC refusal then every original authority and factory check',()=>{const f=fixture();assert.equal(f.invoke(),undefined);assert.deepEqual(f.events,['expanded','guard-a','guard-b','factory']);});
test('historical capabilities first consume their same actual closed authority reader',()=>{const f=fixture(true);assert.equal(f.invoke(),undefined);assert.deepEqual(f.events,['guard-a','guard-b','expanded','factory']);});
test('changed historical guard refuses without requiring undeclared expanded SRC or Git',()=>{const f=fixture(true);f.files.set('guard-a',Buffer.from('changed'));f.setError(Error('Undeclared expanded SRC'));assert.throws(()=>f.invoke(),error=>error.message==='Independent current target bytes differ: guard-a');assert.deepEqual(f.events,['guard-a']);});
test('historical reader substitution fails before touching any supplied byte endpoint',()=>{const f=fixture(true);assert.throws(()=>f.run(f.actual,f.git),/Historical Stage8 reader capability differs/);assert.deepEqual(f.events,[]);});
test('native early refusal cannot produce a proof or skip through to authority after failure',()=>{const f=fixture();f.setError(Error('Exact SRC refusal'));assert.throws(()=>f.invoke(),/Exact SRC refusal/);assert.deepEqual(f.events,['expanded']);});
test('a prior valid historical read is not cached for a later current guard mutation',()=>{const f=fixture(true);f.invoke();f.events.length=0;f.files.set('guard-b',Buffer.from('later'));assert.throws(()=>f.invoke(),error=>error.message==='Independent current target bytes differ: guard-b');assert.deepEqual(f.events,['guard-a','guard-b']);});
const namedBody=/export function assertNamedApplicationSuccessor\(file,recordedSHA256,currentBytes,read=readFileSync,git=sourceGit\)\{([^\n]+)\}/.exec(source)?.[1];assert(namedBody);
function namedFixture(){const events=[],nativeRead=()=>{},nativeGit=()=>{};const run=new Function('rejectWrongWorkflowClaim','currentStage8Input','completeStage8','readFileSync','sourceGit','return function(file,recordedSHA256,currentBytes,read=readFileSync,git=sourceGit){'+namedBody+'}')(function(file,claim,read){events.push('negative');assert.equal(read,nativeRead);if(claim==='wrong')throw Error('Exact original F042 source claim required');},function(read,git){events.push('full actual');assert.equal(typeof read,'function');assert.equal(typeof git,'function');throw Error('Original complete actual proof reached');},()=>{throw Error('Unreachable complete');},nativeRead,nativeGit);return{events,run,nativeRead,nativeGit};}
test('native false workflow claim refuses early but a valid claim still reaches the original complete proof',()=>{const f=namedFixture();assert.throws(()=>f.run('known','wrong',Buffer.from('')),/Exact original F042 source claim required/);assert.deepEqual(f.events,['negative']);f.events.length=0;assert.throws(()=>f.run('known','valid',Buffer.from('')),/Original complete actual proof reached/);assert.deepEqual(f.events,['negative','full actual']);});
test('custom source or Git readers retain their original proof without entering the native claim precheck',()=>{for(const custom of ['read','git']){const f=namedFixture();assert.throws(()=>f.run('known','wrong',Buffer.from(''),custom==='read'?()=>{}:f.nativeRead,custom==='git'?()=>{}:f.nativeGit),/Original complete actual proof reached/);assert.deepEqual(f.events,['full actual']);}});
