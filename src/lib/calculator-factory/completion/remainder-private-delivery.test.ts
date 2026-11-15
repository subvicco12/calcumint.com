import {expect,it} from 'vitest';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from './business';
import {getRemainderCaptureWorkflows,remainderCaptureRevision} from './remainder-capture-successor';
import {getFactoryWorkflows} from '../registry';
import {runPrivateFactoryCalculation} from '../private-delivery';
import {factoryDownload} from './exports';
it('admits only the exact private #226 successor through the shared server packet boundary',()=>{
 const flow=getRemainderCaptureWorkflows(),packet=flow.execute({a:'1.5',b:'.5'});
 expect(verifyFactoryPacket(packet)).toEqual(packet);
 expect(verifyFactoryStoredSnapshot(packet.snapshot)).toEqual({catalogId:226,snapshot:packet.snapshot});
 for(const forged of [{...packet,identity:{...packet.identity,catalogId:225}},{...packet,identity:{...packet.identity,engineId:'other'}},{...packet,identity:{...packet.identity,calculatorVersion:2}},{...packet,identity:{...packet.identity,sourceVersion:packet.identity.sourceVersion+'/other'}},{...packet,snapshot:{...packet.snapshot,output:{result:1}}},{...packet,raw:{a:'2',b:'3'}}])expect(()=>verifyFactoryPacket(forged)).toThrow();
});
it('retains the complete old packet namespace and all old capture refusals',()=>{
 const old=getFactoryWorkflows(226),packet=old.execute({a:'17',b:'5'});
 expect(verifyFactoryPacket(packet)).toEqual(packet);
 expect(()=>old.execute({a:'1.5',b:'.5'})).toThrow(/normal capture/);
 const current=getRemainderCaptureWorkflows().execute({a:'1.5',b:'.5'});
 expect(()=>old.verify(current)).toThrow();
 expect(current.identity.sourceVersion).toContain(remainderCaptureRevision);
});
it('replays zero and signed historical values across source-bound exports and scenarios',()=>{
 const flow=getRemainderCaptureWorkflows();
 for(const raw of [{a:'1.5',b:'.5'},{a:'-1.5',b:'.5'},{a:'1e308',b:'1'},{a:'-17',b:'5'}]){
  const packet=flow.execute(raw),before=JSON.stringify(packet);
  expect(verifyFactoryPacket(packet)).toEqual(packet);
  for(const plan of ['pro','business'] as const){
   const json=factoryDownload(flow,packet,'json',plan,'Remainder');expect(flow.replay(new TextDecoder().decode(json.bytes))).toEqual(packet);
   expect(new TextDecoder().decode(factoryDownload(flow,packet,'csv',plan,'Remainder').bytes)).toContain('result');
   expect(new TextDecoder().decode(factoryDownload(flow,packet,'pdf',plan,'Remainder').bytes)).toContain('%PDF');
   expect(flow.scenario([],'A',packet,'exact capture',plan)[0].packet).toEqual(packet);
  }
  expect(JSON.stringify(packet)).toBe(before);
 }
});

it('private server registry pins exact versions while the default server capture stays unchanged',()=>{
 const raw={a:'1.5',b:'.5'};
 expect(runPrivateFactoryCalculation(226,1,raw)).toEqual(getRemainderCaptureWorkflows().execute(raw));
 for(const [id,version] of [[226,2],[225,1],[323,1],[999,1]])expect(()=>runPrivateFactoryCalculation(id,version,raw)).toThrow();
 expect(()=>getFactoryWorkflows(226).execute(raw)).toThrow(/normal capture/);
});
