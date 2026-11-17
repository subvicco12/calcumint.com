import test from 'node:test';
import assert from 'node:assert/strict';
import {drainCohortWorker} from '../../scripts/milestone100-20261114/delivery-worker.mjs';
test('40–60 cohort uses unchanged 20-event worker per invocation',async()=>{
 for(const expected of [1,20,40,41,60]){
  let remaining=expected;
  const result=await drainCohortWorker(async()=>{const processed=Math.min(remaining,20);remaining-=processed;return {processed,delivered:processed,failed:0,unavailable:0};},expected);
  assert.equal(result.processed,expected);assert.equal(result.delivered,expected);assert.equal(result.rounds.length,Math.ceil(expected/20));
 }
});
test('stalled worker and evidence outside known cohort fail closed',async()=>{
 await assert.rejects(drainCohortWorker(async()=>({processed:0,delivered:0,failed:0,unavailable:0}),40),/progress/);
 await assert.rejects(drainCohortWorker(async()=>({processed:20,delivered:20,failed:0,unavailable:0}),1),/outside exact/);
});
