'use client';
import {useRef} from 'react';
import {RemainderCaptureSuccessor} from './remainder-capture-successor';
import {CalculatorFactoryPersistedScenario} from './calculator-factory-persisted-scenario';
import {CalculatorFactorySharedWorkspace} from './calculator-factory-shared-workspace';
import {Wave100CalculatorAnalysis} from './wave100-calculator-analysis';
import {CalculatorFactorySensitivity} from './calculator-factory-sensitivity';
import {NativeEmbedGrantForm} from './native-embed-grant-form';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';
import {saveCalculationHistory} from '@/app/account/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';

/** Existing authenticated actions own authorization, quotas and idempotency.
 * No public route, certification or registered capture version is adopted. */
export function RemainderPrivateDelivery({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const retry=useRef<{key:string;requestId:string}|null>(null);
 return <RemainderCaptureSuccessor plan={plan} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);
  if(retry.current?.key!==key)retry.current={key,requestId:crypto.randomUUID()};
  await saveCalculationHistory({...packet.snapshot,expectedOwnerId:ownerId,requestId:retry.current.requestId});
  return 'Saved to your authenticated calculation history.';
 }} renderWorkflows={(packet,restore)=>{
  const restoreChecked=(snapshot:Parameters<typeof restore>[0],catalogId:number)=>{
   if(catalogId!==226)throw Error('Exact remainder calculator required for recovery');
   restore(snapshot);
  };
  return <>{packet&&<LegacyRemainderAnalysis packet={packet} plan={plan} restore={restore}/>}
   {plan!=='free'&&<CalculatorFactoryPersistedScenario ownerId={ownerId} packet={packet} onRestore={restoreChecked}/>}
   {plan==='business'&&<CalculatorFactorySharedWorkspace ownerId={ownerId} packet={packet} onRestore={restoreChecked} renderDelivery={organizationId=><NativeEmbedGrantForm ownerId={ownerId} organizationId={organizationId} initialCatalogId={226}/>}/>}</>;
 }}/>
}

/** Existing optional analysis stays pinned to its retained capture contract.
 * A separately executed packet is never a relabeled successor packet. */
function LegacyRemainderAnalysis({packet,plan,restore}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan;restore:(snapshot:CalculationSnapshot)=>void}){
 let legacy:FactoryExecutionPacket;
 try{
  legacy=getFactoryWorkflows(226).execute(packet.raw);
  if(!equalCompletionJson(legacy.snapshot,packet.snapshot))throw Error('Capture snapshots differ');
 }catch{return <p>Legacy analysis is unavailable for this input under its retained capture policy. The exact-zero capture result, history, scenarios and exports remain available.</p>;}
 return <><Wave100CalculatorAnalysis packet={legacy} plan={plan} onRestore={restore}/><CalculatorFactorySensitivity packet={legacy} plan={plan}/></>;
}
