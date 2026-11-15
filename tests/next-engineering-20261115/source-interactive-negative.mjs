/** One fixed current byte refusal; successful inputs still require the complete original source proof. */
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {accepted} from '../parallel-source-20261110/authority.mjs';
const capturePath='docs/parallel-source-20261110/capture-revision68.json',path='src/components/calculator-interactive.tsx';
const current=Object.freeze({ref:'25b56970c05aaffaad2dd856809aaf077ab70554',blob:'db0c1d614cbafbc9468bafdd1fda5f064176fcad',sha256:'017a01294f2980d25deca43ff8dddb9ab6ea87ec1271dcb4755e91223ec8d142',bytes:202736});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function rejectChangedInteractiveSource(read){
 const authority=accepted.find(row=>row.path===capturePath);assert(authority,'Independent current application capture required');const bytes=read(capturePath);assert(Buffer.isBuffer(bytes)&&sha(bytes)===authority.sha256,'Independent current target bytes differ: '+capturePath);
 const rows=JSON.parse(bytes).applicationSuccessors.filter(row=>row.path===path);assert.equal(rows.length,1,'Fixed interactive source row required');const row=rows[0].current;assert.equal(row.path,path);for(const key of ['ref','blob','sha256','bytes'])assert.equal(row[key],current[key],'Fixed current interactive tuple differs');
 const supplied=read(path);assert(Buffer.isBuffer(supplied)&&supplied.length===current.bytes&&sha(supplied)===current.sha256,'Current target source differs: '+path);
}
