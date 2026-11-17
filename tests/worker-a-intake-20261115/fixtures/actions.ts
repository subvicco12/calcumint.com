'use server';
import {saveCalculationHistory} from '@/app/account/actions';
import {getRemainderCaptureWorkflows} from '@/lib/calculator-factory/completion/remainder-capture-successor';
const lost=new Set<string>();
/** Fault injection is only in this disposable fixture adapter, after the real
 * unchanged application action committed. Retry retains the same atomic ID. */
export async function saveIntake(owner:string,id:string,packet:unknown){
 const verified=getRemainderCaptureWorkflows().verify(packet as never);
 await saveCalculationHistory({...verified.snapshot,requestId:id,expectedOwnerId:owner});
 if(!lost.has(id)){lost.add(id);throw Error('Isolated simulated response loss after committed history');}
 return 'Verified authenticated history saved';
}
