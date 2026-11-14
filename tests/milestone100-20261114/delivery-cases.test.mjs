import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {validateDeliveryCases} from '../../scripts/milestone100-20261114/delivery-cases.mjs';
const row={id:999,version:1,engine:'fixture.example',slug:'fixture-example',input:{x:'2'},edit:{x:'3'}};
const bytes=rows=>Buffer.from(JSON.stringify(rows));
const hash=value=>createHash('sha256').update(value).digest('hex');
test('root-approved exact cohort bytes are required before fixture setup',()=>{
 const value=bytes([row]);assert.deepEqual(validateDeliveryCases(value,hash(value)),[row]);
 assert.throws(()=>validateDeliveryCases(value),/must pin/);
 assert.throws(()=>validateDeliveryCases(value,'0'.repeat(64)),/changed/);
});
test('duplicate and unsafe SQL-bound tuple identities refuse before fixture setup',()=>{
 for(const rows of [[row,row],[{...row,engine:"fixture'); DROP TABLE profiles;--"}],[{...row,edit:{other:'3'}}]]){
  const value=bytes(rows);assert.throws(()=>validateDeliveryCases(value,hash(value)));
 }
});
