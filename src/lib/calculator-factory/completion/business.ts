import {z} from 'zod';
import {factoryContracts,getFactoryWorkflows} from '../registry';
import type {FactoryExecutionPacket} from '../workflows';
import {createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';

export const factorySharingCapability=Object.freeze({available:false as const,reason:'Shared Business snapshot RPCs use a Technology calculator allowlist. Factory sharing requires an explicitly adopted database capability extension.'});

/** Re-execute the pinned packet before any authenticated persistence call. */
export function verifyFactoryPacket(value:unknown):FactoryExecutionPacket {
 const packet=z.object({identity:z.object({catalogId:z.number().int()}).passthrough()}).passthrough().parse(value);
 const contract=factoryContracts.find(row=>row.catalogId===packet.identity.catalogId&&row.registered);
 if(!contract)throw Error('Registered factory calculator required');
 return getFactoryWorkflows(contract.catalogId).verify(value as FactoryExecutionPacket);
}

/** Stored scenarios contain normalized snapshots, not original raw keystrokes or source packets. */
export function verifyFactoryStoredSnapshot(value:CalculationSnapshot){
 const snapshot=createCalculationSnapshot(value);
 const contract=factoryContracts.find(row=>row.registered&&row.slug===snapshot.calculatorSlug&&row.version===snapshot.calculatorVersion);
 if(!contract)throw Error('Exact registered factory snapshot version unavailable');
 const raw=Object.fromEntries(Object.entries(snapshot.input).map(([key,input])=>{
  if(typeof input!=='string'&&typeof input!=='number')throw Error('Unsupported persisted factory input');
  return [key,typeof input==='number'&&Object.is(input,-0)?'-0':String(input)];
 }));
 const expected=contract.execute(raw);
 if(!equalCompletionJson(expected,snapshot))throw Error('Stored factory snapshot differs from immutable engine result');
 return Object.freeze({catalogId:contract.catalogId,snapshot});
}
