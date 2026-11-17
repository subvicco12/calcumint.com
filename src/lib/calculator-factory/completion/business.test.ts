import {expect,it} from 'vitest';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot,factorySharingCapability} from './business';
import {getFactoryWorkflows} from '../registry';
it('verifies immutable registered packets and rejects tampering',()=>{
 const packet=getFactoryWorkflows(218).execute({x:'4'});
 expect(verifyFactoryPacket(packet)).toEqual(packet);
 expect(()=>verifyFactoryPacket({...packet,snapshot:{...packet.snapshot,output:{result:999}}})).toThrow();
});
it('restores the exact stored normalized snapshot without inventing raw provenance',()=>{
 const packet=getFactoryWorkflows(218).execute({x:'4'});
 expect(verifyFactoryStoredSnapshot(packet.snapshot)).toEqual({catalogId:218,snapshot:packet.snapshot});
 expect(()=>verifyFactoryStoredSnapshot({...packet.snapshot,calculatorVersion:999})).toThrow();
});
it('does not claim Technology-only sharing RPCs can store factory contracts',()=>{
 expect(factorySharingCapability.available).toBe(false);
 expect(factorySharingCapability.reason).toContain('allowlist');
});
