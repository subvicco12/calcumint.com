import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

/** Uses retained real Next/GoTrue context. Does not supply publication or auth substitutes. */
export async function runMilestoneBusiness(context,{cases,runJourneys}){
 assert(cases.length>0);assert.equal(new Set(cases.map(row=>row.id)).size,cases.length);
 assert.equal(new URL(context.next.url).hostname,'127.0.0.1');
 assert(context.db.provenance,'Genuine disposable identity/database fixture required');
 await runJourneys({...context,cases});
 const {report,batch}=context;
 report.milestoneBusinessBatch??=[];
 for(const row of cases){
  if(report.milestoneBusinessBatch.some(item=>item.catalogId===row.id))continue;
  const requestId=randomUUID(),body={catalogId:row.id,version:row.version,rows:[row.input,{...row.input,...row.edit}]};
  const submitted=await batch('POST',requestId,body);
  assert.equal(submitted.status,200,JSON.stringify(submitted));assert.equal(submitted.body.rows.length,2);
  for(let i=0;i<2;i++){
   const result=submitted.body.rows[i];assert.equal(result.ok,true,JSON.stringify(result));
   assert.deepEqual(result.result.packet.raw,body.rows[i]);
   assert.equal(result.result.packet.identity.catalogId,row.id);
   assert.equal(result.result.packet.snapshot.calculatorSlug,row.slug);
   assert.equal(result.result.packet.snapshot.calculatorVersion,row.version);
  }
  const history=report.freeHistory.find(item=>item.catalogId===row.id);assert(history);
  assert.deepEqual(submitted.body.rows[0].result.packet.snapshot.output,history.recordedOutput);
  const recovered=await batch('GET',requestId);assert.equal(recovered.status,200);
  assert.equal(recovered.body.jobId,submitted.body.jobId);assert.deepEqual(recovered.body.rows,submitted.body.rows);
  const duplicate=await batch('POST',requestId,body);assert.equal(duplicate.status,200);
  assert.equal(duplicate.body.jobId,submitted.body.jobId);assert.deepEqual(duplicate.body.rows,submitted.body.rows);
  report.milestoneBusinessBatch.push({catalogId:row.id,version:row.version,jobId:submitted.body.jobId,rows:2,realPOSTGET:true,idempotent:true});
 }
 const ids=cases.map(row=>row.id).sort((a,b)=>a-b);
 for(const key of ['freeHistory','sharing','embed','api','milestoneBusinessBatch'])assert.deepEqual(report[key].map(row=>row.catalogId).sort((a,b)=>a-b),ids);
 return report;
}
