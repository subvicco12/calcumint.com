import {makeGitReader} from '../parallel-source-20261110/git-reader.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {ensureNonSourceObjects} from '../parallel-source-20261110/bootstrap.mjs';
import {verifyNonSourceStage} from './non-source-stage2.mjs';
const predecessor='5008aa4cadd77f7a9a5dc1523cace694f3bbdf47';
const successor='345c6cd6ed42aff39635d5e92d4adb48989b78ac';
const immutableGit=makeGitReader(args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));
const real=args=>immutableGit(args);
function transport({missing=[predecessor],origin='https://github.com/subvicco12/calcumint.com.git',recover=true,substitute=false}={}){
 const absent=new Set(missing),fetches=[];
 const git=args=>{
  if(args[0]==='remote')return Buffer.from(origin+'\n');
  if(args[0]==='fetch'){assert.deepEqual(args.slice(0,4),['fetch','--no-tags','--depth=1','origin']);assert(args.length===5&&[predecessor,successor].includes(args[4]));fetches.push(args);if(recover)absent.delete(args[4]);return Buffer.alloc(0);}
  if(args[0]==='rev-parse'&&args[1]==='--verify'&&[predecessor,successor].some(ref=>args[2]===ref+'^{commit}')){if(absent.has(args[2].slice(0,40)))throw Error('Needed a single revision');if(substitute)return Buffer.from('0'.repeat(40)+'\n');}
  return real(args);
 };return {git,fetches};
}
test('retained NS reader retrieves its exact absent predecessor before proving immutable ancestry',()=>{
 const t=transport();assert.equal(ensureNonSourceObjects(t.git),true);assert.equal(verifyNonSourceStage({git:t.git}).size,4);assert.equal(t.fetches.length,1);assert.equal(t.fetches[0][4],predecessor);
});
test('available exact NS commits require no fetch',()=>{const t=transport({missing:[]});assert.equal(verifyNonSourceStage({git:t.git}).size,4);assert.equal(t.fetches.length,0);});
test('NS recovery refuses unknown origin, unavailable objects and substitution',()=>{
 const foreign=transport({missing:[],origin:'https://example.invalid/other.git'});assert.throws(()=>ensureNonSourceObjects(foreign.git));assert.equal(foreign.fetches.length,0);
 const missing=transport({recover:false});assert.throws(()=>ensureNonSourceObjects(missing.git));assert.equal(missing.fetches.length,1);
 const replaced=transport({missing:[],substitute:true});assert.throws(()=>ensureNonSourceObjects(replaced.git));assert.equal(replaced.fetches.length,0);
});
