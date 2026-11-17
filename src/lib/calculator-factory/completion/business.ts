import {constructionContracts,verifyConstructionSnapshot} from '@/lib/worker1-construction-20261116/cohort';
import {nextEngineeringContracts,verifyNextEngineeringSnapshot} from './next-engineering';
import {z} from 'zod';
import {factoryContracts} from '../registry';
import {verifyPrivateFactoryPacket} from '../private-delivery';
import type {FactoryExecutionPacket} from '../workflows';
import {createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {verifyLaunchSnapshot} from '@/lib/launch-snapshot-verification';

export const factorySharingCapability=Object.freeze({available:false as const,reason:'Shared Business snapshot RPCs use a Technology calculator allowlist. Factory sharing requires an explicitly adopted database capability extension.'});

/** Re-execute the pinned packet before any authenticated persistence call. */
export function verifyFactoryPacket(value:unknown):FactoryExecutionPacket {
 const packet=z.object({identity:z.object({catalogId:z.number().int()}).passthrough()}).passthrough().parse(value);
 const contract=factoryContracts.find(row=>row.catalogId===packet.identity.catalogId&&row.registered);
 if(!contract)throw Error('Registered factory calculator required');
 return verifyPrivateFactoryPacket(value as FactoryExecutionPacket);
}

/** Stored scenarios contain normalized snapshots, not original raw keystrokes or source packets. */
export function verifyFactoryStoredSnapshot(value:CalculationSnapshot){
 const snapshot=createCalculationSnapshot(value);
 if(constructionContracts.some(row=>row.slug===snapshot.calculatorSlug)){const verified=verifyConstructionSnapshot(snapshot);return Object.freeze({catalogId:verified.catalogId,snapshot:verified.snapshot});}
 const contract=factoryContracts.find(row=>row.registered&&row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!contract)throw Error('Exact registered factory snapshot version unavailable');
 // A stored normalized v1 record is not a request for a new capture. Reuse the
 // exact historical verifier, including schema/output checks and signed zero.
 // This narrow replay path does not admit an unadopted packet/source revision.
 if(contract.catalogId===226&&snapshot.calculatorSlug==='remainder-calculator'&&snapshot.calculatorVersion===1){
  return Object.freeze({catalogId:contract.catalogId,snapshot:verifyLaunchSnapshot(snapshot).snapshot});
 }
 if(nextEngineeringContracts.some(row=>row.catalogId===contract.catalogId))return Object.freeze({catalogId:contract.catalogId,snapshot:verifyNextEngineeringSnapshot(snapshot).snapshot});
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,input])=>{
  if(typeof input!=='string'&&typeof input!=='number')throw Error('Unsupported persisted factory input');
  return [key,typeof input==='number'&&Object.is(input,-0)?'-0':String(input)];
 }));
 const expected=contract.execute(raw);
 if(!equalCompletionJson(expected,snapshot))throw Error('Stored factory snapshot differs from immutable engine result');
 return Object.freeze({catalogId:contract.catalogId,snapshot});
}
