import assert from 'node:assert/strict';
/** Drain a known isolated acceptance cohort through the unchanged 20-event worker. */
export async function drainCohortWorker(worker,expected){
 assert(Number.isSafeInteger(expected)&&expected>0);
 const total={processed:0,delivered:0,failed:0,unavailable:0};
 const rounds=[];
 for(let attempt=0;attempt<Math.ceil(expected/20);attempt++){
  const result=await worker();
  for(const key of Object.keys(total))assert(Number.isSafeInteger(result[key])&&result[key]>=0);
  assert(result.processed>0&&result.processed<=20,'Unchanged bounded worker must make progress');
  assert.equal(result.processed,result.delivered+result.failed+result.unavailable);
  for(const key of Object.keys(total))total[key]+=result[key];
  assert(total.processed<=expected,'Worker consumed evidence outside exact acceptance cohort');
  rounds.push(result);
  if(total.processed===expected)return {...total,rounds};
 }
 assert.fail('Exact isolated cohort was not drained within existing worker bounds');
}
