import test from 'node:test';import assert from 'node:assert/strict';
import {runtimeImmutableTreeQueries,primeRuntimeImmutableTrees} from './source-runtime-immutable-trees.mjs';
import {immutableTreeQueryReader,isImmutableTreeQuery} from '../milestone100-20261114/source-immutable-queries.mjs';
import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
import {fetchSourceLineage} from '../../scripts/fetch-source-lineage.mjs';
test('the exact51 immutable availability queries use only already advertised full-OID identities',()=>{
 const refs=new Set();fetchSourceLineage(args=>{if(args[0]==='fetch'){args.slice(4).forEach(ref=>refs.add(ref));return Buffer.alloc(0);}const ref=args[2].slice(0,40);if(!refs.has(ref))throw Error('Unavailable');return Buffer.from(ref);});
 assert.equal(runtimeImmutableTreeQueries.length,51);assert(Object.isFrozen(runtimeImmutableTreeQueries));assert(runtimeImmutableTreeQueries.every(Object.isFrozen));for(const query of runtimeImmutableTreeQueries){assert(isImmutableTreeQuery(query));for(const arg of query)if(/^[0-9a-f]{40}$/.test(arg))assert(refs.has(arg),'Pinned query ref must be available: '+arg);}
});
test('private immutable transport priming caches only fixed queries; symbolic current observations stay live',()=>{
 const calls=[];const raw=args=>{calls.push(args);return Buffer.alloc(0);},git=completionGitReader(immutableTreeQueryReader(raw));primeRuntimeImmutableTrees(git);assert.equal(calls.length,51);primeRuntimeImmutableTrees(git);assert.equal(calls.length,51);
 for(const query of [['rev-parse','--verify','HEAD^{commit}'],['status','--porcelain','--','src'],['rev-parse','--show-toplevel'],['ls-files','-v','--','src']]){git(query);git(query);}assert.equal(calls.length,59);
 assert.throws(()=>primeRuntimeImmutableTrees(git,{queries:[]}),/Custom immutable tree/);assert.throws(()=>primeRuntimeImmutableTrees(()=>{throw Error('Missing immutable transport');}),/Missing immutable transport/);assert.throws(()=>primeRuntimeImmutableTrees(()=>''),/binary Git/);
});
