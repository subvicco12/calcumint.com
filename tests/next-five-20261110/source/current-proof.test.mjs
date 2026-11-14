import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyCurrentNextFiveSource,retained23Read,addedPaths,capturePath} from './current-proof.mjs';
const metadata='scripts/product-completion-lineage.mjs';
const read=path=>readFileSync(path);
const capture=()=>JSON.parse(read(capturePath));
test('reviewed R4 proves exact current source and original retained R3 separately',()=>assert.equal(verifyCurrentNextFiveSource(),true));
test('valid baseline metadata cannot replace the exact reviewed current delta',()=>assert.throws(()=>verifyCurrentNextFiveSource(path=>path===metadata?retained23Read(path):read(path)),/reviewed R4/));
for(const path of addedPaths)test('new cohort live source cannot drift '+path,()=>assert.throws(()=>verifyCurrentNextFiveSource(name=>name===path?Buffer.from('current cohort drift'):read(name)),/target source differs|target bytes differ/));
test('valid old caller bytes do not become current through historical proof',()=>{const path='src/components/calculator-interactive.tsx';assert.throws(()=>verifyCurrentNextFiveSource(name=>name===path?retained23Read(path):read(name)),/Current target source differs/);});
test('candidate capture cannot choose its own different helper or verifier authority',()=>{const value=capture();value.helperSource.ref='23f2860c16310385f6c37f7a2bc3c86890631c98';assert.throws(()=>verifyCurrentNextFiveSource(path=>path===capturePath?Buffer.from(JSON.stringify(value)):read(path)),/Fixed R4 capture differs/);});
test('missing Git objects cannot be replaced with plausible current files',()=>assert.throws(()=>verifyCurrentNextFiveSource(read,()=>{throw Error('Missing actual R4 provenance');}),/Missing actual R4 provenance/));
test('retained R3 executable bytes cannot be silently rewritten',()=>{const path='tests/next-five-20261110/source/retained-r3-stage.mjs';assert.throws(()=>verifyCurrentNextFiveSource(name=>name===path?Buffer.from('changed retained stage'):read(name)),/target bytes differ|Retained R3 source changed/);});
test('original R3 source capture remains exact historical evidence',()=>{const c=JSON.parse(read('docs/next-cohort-20261110/source-successors/caller-capture-revision3.json'));assert.equal(c.stageRevision,3);assert.equal(c.historicalRecordsEdited,false);assert.equal(c.productionWrites,false);});

test('retained R4 executable archive body cannot drift',()=>{const path='docs/next-five-20261110/source-successor/retained-r4/tests__next-five-20261110__source__current-proof.mjs.fixture';assert.throws(()=>verifyCurrentNextFiveSource(name=>name===path?Buffer.from('changed old proof'):read(name)),/Retained R4 archive/);});
test('retained failed R4 receipt cannot be rewritten into different evidence',()=>{const path='docs/next-five-20261110/source-successor/retained-r4/focused75-pass74-fail1.log';assert.throws(()=>verifyCurrentNextFiveSource(name=>name===path?Buffer.from('passed'):read(name)),/Retained R4 failed receipt/);});
test('byte changes to old R4 raw capture cannot hide behind unchanged canonical JSON',()=>{const path='docs/next-five-20261110/source-successor/capture.json';assert.throws(()=>verifyCurrentNextFiveSource(name=>name===path?Buffer.from(read(name).toString()+'\n'):read(name)),/Retained R4 raw capture bytes differ/);});
