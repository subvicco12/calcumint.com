import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import Decimal from 'decimal.js';
import fixtures from '../../../../tests/statistics/decimal-descriptive-fixtures.json';
import {STATISTICS_WORKER_PROTOCOL,type StatisticsWorkerResponse} from './worker-protocol';
import type {DecimalStatisticsInput} from './decimal-descriptive';
const Reference=Decimal.clone({precision:220});
const responses:StatisticsWorkerResponse[]=[];
const scope=globalThis as unknown as {onmessage:(event:{data:unknown})=>void};
beforeAll(async()=>{vi.stubGlobal('onmessage',undefined);vi.stubGlobal('postMessage',(message:StatisticsWorkerResponse)=>{responses.push(message);});await import('./statistics.worker');});
afterAll(()=>vi.unstubAllGlobals());
for(const catalogId of [282,283] as const)for(const fixture of fixtures.cases){
 it(`worker oracle #${catalogId}: ${fixture.name}/${fixture.mode}`,()=>{
  responses.length=0;const input:DecimalStatisticsInput={mode:fixture.mode as DecimalStatisticsInput['mode'],encoding:fixture.encoding as DecimalStatisticsInput['encoding'],rows:fixture.rows};
  scope.onmessage({data:{protocol:STATISTICS_WORKER_PROTOCOL,jobId:1,catalogId,input}});
  const response=responses.at(-1);
  expect(response?.catalogId).toBe(catalogId);const outcome=response!.artifact.outcome;
  if(outcome.status!=='finite')throw Error('Expected finite oracle outcome');
  for(const [key,reference] of Object.entries(fixture.expected)){
   const expected=new Reference(reference),actual=new Reference(outcome.values[key].raw);
   expect(expected.isZero()?actual.isZero():actual.minus(expected).abs().div(expected.abs()).lte('1e-40'),key).toBe(true);
  }
  expect(outcome.values.primary.raw).toBe(outcome.values[catalogId===282?'standardDeviation':'variance'].raw);
 });
}
