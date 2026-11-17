import {getFactoryContract,getFactoryWorkflows} from './registry';
import {getRemainderCaptureWorkflows} from './completion/remainder-capture-successor';
import type {FactoryExecutionPacket,FactoryRaw} from './workflows';

/** Private engineering capture selection only. The default registry, public
 * delivery, registered engines and retained packet namespaces are unchanged. */
export function getPrivateFactoryWorkflows(catalogId:number){
 return catalogId===226?getRemainderCaptureWorkflows():getFactoryWorkflows(catalogId);
}

/** Server and private UI share the same closed immutable capture dispatch. */
export function runPrivateFactoryCalculation(catalogId:number,version:number,input:FactoryRaw){
 const contract=getFactoryContract(catalogId);
 if(!contract?.registered||contract.version!==version)throw Error('Exact registered private factory identity/version unavailable');
 return getPrivateFactoryWorkflows(catalogId).execute(input);
}

/** Exact namespace selection, never try a different engine after verification
 * fails. Legacy packets retain their original capture policy and verifier. */
export function verifyPrivateFactoryPacket(packet:FactoryExecutionPacket){
 const id=packet.identity.catalogId;
 if(typeof id!=='number')throw Error('Exact private factory catalog identity required');
 const current=getPrivateFactoryWorkflows(id);
 const workflow=packet.identity.sourceVersion===current.identity.sourceVersion?current:getFactoryWorkflows(id);
 return workflow.verify(packet);
}
