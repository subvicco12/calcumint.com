import {describe,expect,it} from 'vitest';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from './business';
import {getRemainderCaptureWorkflows} from './remainder-capture-successor';
import {getFactoryWorkflows} from '../registry';
import {verifyLaunchSnapshot} from '@/lib/launch-snapshot-verification';

describe('stored #226 v1 history is verified independently of current capture policy',()=>{
 for(const [a,b] of [['1.5','.5'],['-1.5','.5'],[String(2**60),String(2**54)],['1e308','1']])it(`recovers exact immutable remainder ${a} % ${b}`,()=>{
  const packet=getRemainderCaptureWorkflows().execute({a,b});
  const historical=verifyLaunchSnapshot(packet.snapshot);
  expect(verifyFactoryStoredSnapshot(packet.snapshot)).toEqual({catalogId:226,snapshot:historical.snapshot});
  expect(Object.is(verifyFactoryStoredSnapshot(packet.snapshot).snapshot.output.result,packet.snapshot.output.result)).toBe(true);
 });
 it('rejects output tampering, extra inputs, unknown versions and identity substitution',()=>{
  const {snapshot}=getRemainderCaptureWorkflows().execute({a:'1.5',b:'.5'});
  for(const forged of [{...snapshot,output:{result:1}},{...snapshot,input:{...snapshot.input,extra:1}},{...snapshot,calculatorVersion:2},{...snapshot,calculatorSlug:'square-calculator'}])expect(()=>verifyFactoryStoredSnapshot(forged)).toThrow();
 });
 it('admits the private current packet without rewriting its predecessor namespace',()=>{
  const successor=getRemainderCaptureWorkflows().execute({a:'1.5',b:'.5'});
  expect(verifyFactoryPacket(successor)).toEqual(successor);
  expect(()=>getFactoryWorkflows(226).verify(successor)).toThrow();
  const predecessor=getFactoryWorkflows(226).execute({a:'17',b:'5'});
  expect(verifyFactoryPacket(predecessor)).toEqual(predecessor);
  expect(verifyFactoryStoredSnapshot(predecessor.snapshot)).toEqual({catalogId:226,snapshot:predecessor.snapshot});
 });
});
