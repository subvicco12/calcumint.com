import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {acceptedStage8,acceptedStage8V3} from '../parallel-source-20261110/authority.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {isImmutableTreeQuery,immutableTreeQueryReader} from './source-immutable-queries.mjs';
const a='a'.repeat(40),b='b'.repeat(40);
test('only literal immutable commit/tree operands may share query bytes',()=>{
 for(const args of [['diff','--name-only','-z',a,b,'--','src'],['diff','--name-only',a,b],['ls-tree','-rz','--name-only',a,'--','src']])assert(isImmutableTreeQuery(args));
 for(const args of [['diff','--name-only',a,'HEAD','--','src'],['diff','--name-only',a,'HEAD~1'],['ls-tree','-rz','--name-only','HEAD'],['status','--porcelain'],['remote','get-url','--all','origin'],['rev-parse','--verify','HEAD^{commit}']])assert.equal(isImmutableTreeQuery(args),false);
});
test('immutable results are copied and shared without reusing current state',()=>{
 const calls=[],source=args=>{calls.push(args);return Buffer.from('result'+calls.length);},reader=immutableTreeQueryReader(source),query=['diff','--name-only','-z',a,b,'--','src'];
 const first=reader(query);first.fill(0);assert.equal(reader(query).toString(),'result1');assert.equal(calls.length,1);assert.equal(immutableTreeQueryReader(source),reader);
 for(const args of [['status','--porcelain'],['rev-parse','--verify','HEAD^{commit}'],['diff','--name-only',a,'HEAD','--','src'],['remote','get-url','--all','origin']])assert.notDeepEqual(reader(args),reader(args));
});
test('options requests and only original capabilities pass through unchanged',()=>{
 let observed;const options={input:Buffer.from('opaque')},source=(args,opts)=>{observed=opts;return Buffer.from('x');},reader=immutableTreeQueryReader(source);
 reader(['ls-tree','-rz',a],options);assert.equal(observed,options);assert.equal(reader.preloadCommits,undefined);
 const calls=[];source.preloadBlobs=ids=>calls.push(ids);const other=immutableTreeQueryReader((args,opts)=>source(args,opts));assert.equal(other.preloadBlobs,undefined);
 const capable=args=>Buffer.from('x');capable.preloadBlobs=ids=>calls.push(ids);const owned=immutableTreeQueryReader(capable),ids=[a];owned.preloadBlobs(ids);assert.equal(calls[0],ids);
});

test('different full-OID operands never reuse an old diff or tree result',()=>{
 const calls=[],reader=immutableTreeQueryReader(args=>{calls.push(args);return Buffer.from(JSON.stringify(args));}),c='c'.repeat(40);
 assert.notDeepEqual(reader(['diff','--name-only',a,b,'--','src']),reader(['diff','--name-only',a,c,'--','src']));
 assert.notDeepEqual(reader(['ls-tree','-rz','--name-only',a]),reader(['ls-tree','-rz','--name-only',b]));assert.equal(calls.length,4);
 for(const args of [['ls-tree','--','src',a],['ls-tree','-rz','--name-only',a,'--','../outside'],['diff','--name-only',a,b,'--','HEAD'],['diff','--name-only',a,b,'--','src','--output=unsafe']])assert.equal(isImmutableTreeQuery(args),false);
});

test('installed capture70 and both authority overlays remain literal beneath query successor',()=>{
 const ref='1f8898e4afdc88f0c13f49f5fb41c9891517efc7',path='docs/parallel-source-20261110/capture-revision70.json';
 assert(readFileSync(path).equals(sourceGit(['show',ref+':'+path])));
 const previous=sourceGit(['show',ref+':tests/parallel-source-20261110/authority.mjs']);
 assert(previous.equals(readFileSync('docs/milestone100-20261114/source-qualified-authority70.mjs')));
 for(const [name,actual,count]of [['acceptedStage8',acceptedStage8,115],['acceptedStage8V3',acceptedStage8V3,9]]){const literal=JSON.parse(previous.toString().split('export const '+name+'=Object.freeze(')[1].split('\n]);')[0]+'\n]');assert.equal(literal.length,count);assert.deepEqual(actual,literal);}
});

test('fresh public proof facades share only the stable original immutable query cache',()=>{
 const calls=[],root=args=>{calls.push(args);return Buffer.from('result'+calls.length);},stable=immutableTreeQueryReader(root),query=['diff','--name-only','-z',a,b,'--','src'];
 for(let index=0;index<4;index++){const facade=(args,options)=>stable(args,options),proof=immutableTreeQueryReader(facade);assert.equal(proof(query).toString(),'result1');}
 assert.equal(calls.length,1);
 for(let index=0;index<2;index++){const facade=(args,options)=>stable(args,options),proof=immutableTreeQueryReader(facade);for(const args of [['rev-parse','--verify','HEAD^{commit}'],['status','--porcelain'],['remote','get-url','--all','origin']])proof(args);}
 assert.equal(calls.length,7);
});
