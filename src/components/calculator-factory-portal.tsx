'use client';
import {useState} from 'react';
import {factoryContracts,getFactoryContract,getFactoryWorkflows,factoryResult} from '@/lib/calculator-factory/registry';
import {CalculatorFactoryWorkbench} from './calculator-factory-workbench';
import {FinalResultPresentation} from './final-result-presentation';
import {saveCalculationHistory} from '@/app/account/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function CalculatorFactoryPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [catalogId,setCatalogId]=useState(factoryContracts[0].catalogId);
 const contract=getFactoryContract(catalogId)!;
 return <section><label>Engineering contract<select value={catalogId} onChange={event=>setCatalogId(Number(event.target.value))}>{factoryContracts.map(row=><option key={row.catalogId} value={row.catalogId}>#{row.catalogId} {row.title}</option>)}</select></label>
 <p>{contract.scope}</p><p>Exact engine: {contract.engineId}@{contract.version}. Canonical acceptance, certification and publication remain pending.</p>
 <ul>{contract.limitations.map(limit=><li key={limit}>{limit}</li>)}</ul>
 <CalculatorFactoryWorkbench key={`${ownerId}:${contract.engineId}@${contract.version}`} title={contract.title} fields={contract.fields} plan={plan} workflows={getFactoryWorkflows(catalogId)} renderResult={packet=><FinalResultPresentation plan={plan} result={factoryResult(catalogId,packet.raw)}/>} onSave={contract.registered?async packet=>{await saveCalculationHistory({...packet.snapshot,requestId:crypto.randomUUID(),expectedOwnerId:ownerId});return 'Saved to your authenticated calculation history.';}:undefined}/>
 {!contract.registered&&<p>Saving this private arithmetic revision requires separately reviewed immutable-version adoption.</p>}
 </section>;
}
