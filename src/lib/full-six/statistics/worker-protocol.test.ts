import {expect,it,vi} from 'vitest';
import {boundedData,validateStatisticsInput,validateStatisticsRequest,STATISTICS_WORKER_PROTOCOL} from './worker-protocol';
it('caps cumulative retained characters across individually bounded rows',()=>{
 const rows=Array.from({length:10000},()=>({value:'1'.repeat(128),frequency:'0'.repeat(128)}));
 expect(()=>validateStatisticsInput({mode:'population',encoding:'frequency',rows})).toThrow('character budget');
});
it('rejects cyclic objects, prototypes, accessors, symbols and excessive nesting',()=>{
 const cycle:Record<string,unknown>={};cycle.self=cycle;
 const getter=vi.fn(()=>1),accessor={};Object.defineProperty(accessor,'value',{get:getter});
 for(const value of [cycle,new Date(),accessor,{[Symbol('x')]:1}])expect(()=>boundedData(value)).toThrow();
 expect(getter).not.toHaveBeenCalled();
});
it('validates version and identity before accepting a worker request',()=>{
 const r={protocol:STATISTICS_WORKER_PROTOCOL,jobId:1,catalogId:282,input:{mode:'population',encoding:'raw',rows:[{value:'2'}]}};
 expect(validateStatisticsRequest(r)).toEqual(r);
 for(const bad of [{...r,jobId:0},{...r,protocol:'old'},{...r,catalogId:283.5}])expect(()=>validateStatisticsRequest(bad)).toThrow();
});
it('actual worker module computes the approved bound artifact',async()=>{
 const original=Object.getOwnPropertyDescriptor(globalThis,'onmessage'),post=vi.fn();
 vi.stubGlobal('postMessage',post);
 try{
  await import('./statistics.worker');
  const scope=globalThis as unknown as {onmessage:(event:MessageEvent)=>void};
  scope.onmessage({data:{protocol:STATISTICS_WORKER_PROTOCOL,jobId:7,catalogId:283,input:{mode:'population',encoding:'raw',rows:[{value:'1'},{value:'3'}]}}} as MessageEvent);
  expect(post).toHaveBeenCalledWith(expect.objectContaining({jobId:7,catalogId:283,artifact:expect.objectContaining({engineId:'statistics.variance',outcome:expect.objectContaining({status:'finite',values:expect.objectContaining({primary:expect.objectContaining({raw:'1'})})})})}));
 }finally{vi.unstubAllGlobals();if(original)Object.defineProperty(globalThis,'onmessage',original);else Reflect.deleteProperty(globalThis,'onmessage');}
});
it('rejects sparse, noncanonical, extra, hidden and null-prototype array shapes',()=>{
 const extra=[1];Object.defineProperty(extra,'extra',{value:2,enumerable:true});
 const noncanonical=[1];Object.defineProperty(noncanonical,'01',{value:2,enumerable:true});
 const hidden=[1];Object.defineProperty(hidden,'0',{enumerable:false});
 const nullPrototype=[1];Object.setPrototypeOf(nullPrototype,null);
 const accessor=[1],getter=vi.fn(()=>1);Object.defineProperty(accessor,'0',{get:getter});
 const hiddenObject={};Object.defineProperty(hiddenObject,'ignored',{value:1});
 for(const value of [Array(1),Array(10001),extra,noncanonical,hidden,nullPrototype,accessor,hiddenObject,Object.create(null)])expect(()=>boundedData(value)).toThrow();
 expect(getter).not.toHaveBeenCalled();
 // Actual arrays always have a non-configurable own data length descriptor;
 // JavaScript does not permit replacing it with an accessor.
 expect(()=>Object.defineProperty([], 'length', {get:getter})).toThrow();
});
it('preserves valid dense 10000-row input without altering shape',()=>{
 const input={mode:'population',encoding:'raw',rows:Array.from({length:10000},()=>({value:'1'}))};
 const copied=validateStatisticsInput(input);
 expect(copied).toEqual(input);expect(copied.rows).not.toBe(input.rows);
});

it('rejects arrays masquerading as missing rows',()=>{expect(()=>validateStatisticsInput({mode:'population',encoding:'raw',missingPolicy:'omit',rows:[[],{value:'1'}]})).toThrow('Invalid row');});
