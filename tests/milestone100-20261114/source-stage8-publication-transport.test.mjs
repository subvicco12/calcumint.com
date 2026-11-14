import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sourceGit} from '../parallel-source-20261110/baseline-runtime.mjs';
import {expectedPublicationTransport,publicationTransportArgumentBytes,publicationTransportPath} from './source-stage8-publication-transport.mjs';
const oldRef='11d38597565922ac12d1a06678288ee7d6daf863';
test('publication transport differs from literal G2 only by the native transport and negative declared-path safety preflight',()=>{
 const old=sourceGit(['show',oldRef+':'+publicationTransportPath]).toString();assert.equal(readFileSync(publicationTransportPath,'utf8'),expectedPublicationTransport(old));assert(publicationTransportArgumentBytes(sourceGit).equals(readFileSync(publicationTransportPath)));
});
test('missing, duplicated, or altered predecessor constructor and substituted old Git identity refuse',()=>{
 const old=sourceGit(['show',oldRef+':'+publicationTransportPath]).toString();for(const bytes of [old.replace('const git=args=>','const git=(args,opts)=>'),old+old,expectedPublicationTransport(old)])assert.throws(()=>expectedPublicationTransport(bytes));
 assert.throws(()=>publicationTransportArgumentBytes(()=>Buffer.from('0'.repeat(40))));assert.throws(()=>publicationTransportArgumentBytes(()=>{throw Error('missing Git')}),/missing Git/);
});

test('path preflight preserves the exact historical membership guard and cannot broaden it',()=>{
 const old=sourceGit(['show',oldRef+':'+publicationTransportPath]).toString();
 for(const text of [old.replace("Object.keys(m.sourceHashes??{}).sort()","Object.keys(m.sourceHashes??{})"),old+old])assert.throws(()=>expectedPublicationTransport(text));
});
