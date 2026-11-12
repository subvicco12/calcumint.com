'use client';
import {useRef,useState} from 'react';
import {factoryContracts,getFactoryContract,getFactoryWorkflows,factoryResult} from '@/lib/calculator-factory/registry';
import {CalculatorFactoryWorkbench} from './calculator-factory-workbench';
import {CalculatorFactoryPersistedScenario} from './calculator-factory-persisted-scenario';
import {CalculatorFactoryMathAnalysis} from './calculator-factory-math-analysis';
import {CalculatorFactoryConversionMethodology} from './calculator-factory-conversion-methodology';
import {FinalResultPresentation} from './final-result-presentation';
import {saveCalculationHistory} from '@/app/account/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function CalculatorFactoryPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const historyRetry=useRef<{key:string;requestId:string}|null>(null);
 const [catalogId,setCatalogId]=useState(factoryContracts[0].catalogId);
 const contract=getFactoryContract(catalogId)!;
 return <section style={{minWidth:0,overflowWrap:'anywhere'}}><label>Engineering contract<select value={catalogId} onChange={event=>setCatalogId(Number(event.target.value))}>{factoryContracts.map(row=><option key={row.catalogId} value={row.catalogId}>#{row.catalogId} {row.title}</option>)}</select></label>
 <p>{contract.scope}</p><p>Exact engine: {contract.engineId}@{contract.version}. Canonical acceptance, certification and publication remain pending.</p>
 <CalculatorFactoryConversionMethodology catalogId={catalogId}/>
 <ul>{contract.limitations.map(limit=><li key={limit}>{limit}</li>)}</ul>
 <CalculatorFactoryWorkbench key={`${ownerId}:${contract.engineId}@${contract.version}`} title={contract.title} fields={contract.fields} plan={plan} workflows={getFactoryWorkflows(catalogId)} renderResult={packet=><><FinalResultPresentation plan={plan} result={factoryResult(catalogId,packet.raw)}/><CalculatorFactoryMathAnalysis catalogId={catalogId} x={Number(packet.snapshot.input.x)}/></>} renderWorkflows={contract.registered&&plan!=='free'?(packet,restore)=><CalculatorFactoryPersistedScenario ownerId={ownerId} packet={packet} onRestore={(snapshot,id)=>{if(id!==catalogId)throw Error('Choose the matching calculator before restoring this scenario');restore(snapshot);}}/>:undefined} onSave={contract.registered?async packet=>{const key=JSON.stringify([ownerId,packet]);if(historyRetry.current?.key!==key)historyRetry.current={key,requestId:crypto.randomUUID()};await saveCalculationHistory({...packet.snapshot,requestId:historyRetry.current.requestId,expectedOwnerId:ownerId});return 'Saved to your authenticated calculation history.';}:undefined}/>
 {!contract.registered&&<p>Saving this private arithmetic revision requires separately reviewed immutable-version adoption.</p>}
 </section>;
}
