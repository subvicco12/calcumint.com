'use client';
import './calculator-factory-controls.css';
import {useRef,useState} from 'react';
import {factoryContracts,getFactoryContract,getFactoryWorkflows,factoryResult} from '@/lib/calculator-factory/registry';
import {CalculatorFactoryWorkbench} from './calculator-factory-workbench';
import {CalculatorFactorySharedWorkspace} from './calculator-factory-shared-workspace';
import {NativeEmbedGrantForm} from './native-embed-grant-form';
import {CalculatorFactorySensitivity} from './calculator-factory-sensitivity';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import {CalculatorFactoryPersistedScenario} from './calculator-factory-persisted-scenario';
import {MilestoneCalculatorAnalysis} from './milestone-calculator-analysis';
import {CompletionWaveAnalysis} from './completion-wave-analysis';
import {CalculatorFactoryMathAnalysis} from './calculator-factory-math-analysis';
import {CalculatorFactoryConversionMethodology} from './calculator-factory-conversion-methodology';
import {FinalResultPresentation} from './final-result-presentation';
import {saveCalculationHistory} from '@/app/account/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function CalculatorFactoryPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const historyRetry=useRef<{key:string;requestId:string}|null>(null);
 const [catalogId,setCatalogId]=useState(factoryContracts[0].catalogId);
 const contract=getFactoryContract(catalogId)!;
 return <section className="factory-delivery-controls" style={{minWidth:0,overflowWrap:'anywhere'}}><label>Engineering contract<select value={catalogId} onChange={event=>setCatalogId(Number(event.target.value))}>{factoryContracts.map(row=><option key={row.catalogId} value={row.catalogId}>#{row.catalogId} {row.title}</option>)}</select></label>
 <p>{contract.scope}</p><p>Exact engine: {contract.engineId}@{contract.version}. Canonical acceptance, certification and publication remain pending.</p>
 <CalculatorFactoryConversionMethodology catalogId={catalogId}/>
 <ul>{contract.limitations.map(limit=><li key={limit}>{limit}</li>)}</ul>
 <CalculatorFactoryWorkbench key={`${ownerId}:${contract.engineId}@${contract.version}`} title={contract.title} fields={contract.fields} plan={plan} workflows={getFactoryWorkflows(catalogId)} renderResult={packet=><><FinalResultPresentation plan={plan} result={factoryResult(catalogId,packet.raw)}/><CalculatorFactoryMathAnalysis catalogId={catalogId} x={Number(packet.snapshot.input.x)} plan={plan}/><CalculatorFactorySensitivity packet={packet} plan={plan}/></>} renderWorkflows={(packet,restore)=>{const restoreChecked=(snapshot:Parameters<typeof restore>[0],id:number)=>{if(id!==catalogId)throw Error('Choose the matching calculator before restoring this scenario');restore(snapshot);};return <>{packet&&<MilestoneCalculatorAnalysis packet={packet} plan={plan} onRestore={restore}/>}
{packet&&<CompletionWaveAnalysis catalogId={catalogId} packet={packet} plan={plan} onRestore={restore}/>}
{contract.registered&&plan!=='free'&&<CalculatorFactoryPersistedScenario ownerId={ownerId} packet={packet} onRestore={restoreChecked}/>}
{plan==='business'&&factoryDeliveryIdentity(catalogId,contract.version)&&<CalculatorFactorySharedWorkspace ownerId={ownerId} packet={packet} onRestore={restoreChecked} renderDelivery={organizationId=><NativeEmbedGrantForm ownerId={ownerId} organizationId={organizationId} initialCatalogId={catalogId}/>}/>}</>;}} onSave={contract.registered?async packet=>{const key=JSON.stringify([ownerId,packet]);if(historyRetry.current?.key!==key)historyRetry.current={key,requestId:crypto.randomUUID()};await saveCalculationHistory({...packet.snapshot,requestId:historyRetry.current.requestId,expectedOwnerId:ownerId});return 'Saved to your authenticated calculation history.';}:undefined}/>
 {!contract.registered&&<p>Saving this private arithmetic revision requires separately reviewed immutable-version adoption.</p>}
 </section>;
}
