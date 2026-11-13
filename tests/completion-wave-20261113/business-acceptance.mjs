import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

/** Run against the genuine account/Next fixture context; never substitutes transport or approval responses. */
export async function runBusinessWave(context,{cases,runJourneys}){
 assert.equal(cases.length,16);
 assert(!cases.some(row=>[323,324].includes(row.id)),'Proposed private successors cannot enter hosted positive fixtures');
 assert.equal(new URL(context.next.url).hostname,'127.0.0.1');
 assert(context.db.provenance,'A genuine disposable identity/database fixture is required');
 await runJourneys({...context,cases});
 const {report,batch,api,issue}=context;
 report.waveBatch??=[];
 for(const row of cases){
  if(report.waveBatch.some(item=>item.catalogId===row.id))continue;
  const requestId=randomUUID(),submitted=await batch('POST',requestId,{catalogId:row.id,version:row.version,rows:[row.input,{...row.input,...row.edit}]});
  assert.equal(submitted.status,200,JSON.stringify(submitted));assert.equal(submitted.body.rows.length,2);assert(submitted.body.rows.every(row=>row.ok===true),JSON.stringify(submitted));
  assert.deepEqual(submitted.body.rows[0].result.packet.raw,row.input);
  assert.deepEqual(submitted.body.rows[1].result.packet.raw,{...row.input,...row.edit});
  assert.deepEqual(submitted.body.rows[0].result.packet.snapshot.output,report.freeHistory.find(item=>item.catalogId===row.id).recordedOutput);
  const recovered=await batch('GET',requestId);assert.equal(recovered.status,200,JSON.stringify(recovered));assert.equal(recovered.body.jobId,submitted.body.jobId);assert.deepEqual(recovered.body.rows,submitted.body.rows);
  const duplicate=await batch('POST',requestId,{catalogId:row.id,version:row.version,rows:[row.input,{...row.input,...row.edit}]});assert.equal(duplicate.status,200);assert.equal(duplicate.body.jobId,submitted.body.jobId);
  report.waveBatch.push({catalogId:row.id,version:row.version,jobId:submitted.body.jobId,rows:2,realPOSTGET:true,idempotent:true});
 }
 report.restrictedBusiness=[];
 for(const id of [323,324]){
  const row={id,version:1,input:id===323?{charge1:'1',charge2:'1',distance:'1'}:{velocity:'1',angle:'45',gravity:'9.81'}};
  const calculated=await api(row);assert.equal(calculated.status,404,JSON.stringify(calculated));
  const submitted=await batch('POST',randomUUID(),{catalogId:id,version:1,rows:[row.input]});assert.equal(submitted.status,422,JSON.stringify(submitted));
  const embedded=await issue(row);assert.equal(embedded.status,422,JSON.stringify(embedded));
  report.restrictedBusiness.push({catalogId:id,calculate:calculated.status,batch:submitted.status,embed:embedded.status,proposedSuccessorRetained:true});
 }
 for(const key of ['freeHistory','sharing','embed','api'])assert.deepEqual(report[key].map(row=>row.catalogId).sort((a,b)=>a-b),cases.map(row=>row.id).sort((a,b)=>a-b));
 assert.equal(report.waveBatch.length,16);assert.equal(report.restrictedBusiness.length,2);
 return report;
}
