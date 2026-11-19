'use client';
import {useState,useRef} from 'react';
import {specializedContracts,specializedContract,specializedWorkflows} from '@/lib/sole-specialized-factory-20261119/cohort';
import {CalculatorFactoryWorkbench} from '../sole-civil-time-20261119/workbench';
import {encodePrivateFinalInputs} from '@/lib/calculator-factory/private-final/adapter';
import {SpecializedResult} from './result';
import {SpecializedFactoryPersistence} from './persistence';
import {saveHistory} from '@/app/admin/sole-specialized-factory-20261119/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function SpecializedFactoryPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [id,setId]=useState<number>(specializedContracts[0].catalogId),[draftRevision,setDraftRevision]=useState(0);const c=specializedContract(id),retry=useRef<{key:string;id:string}|null>(null);
 return <section onChangeCapture={event=>{const target=event.target;if((target instanceof HTMLInputElement||target instanceof HTMLSelectElement||target instanceof HTMLTextAreaElement)&&c.fields.some(f=>f.key===target.name))setDraftRevision(v=>v+1);}} className="worker1-food-ratios-controls" style={{maxWidth:'100%',minWidth:0,overflowWrap:'anywhere'}}>
 <label>Specialized factory profile<select value={id} onChange={e=>setId(Number(e.target.value))}>{specializedContracts.map(c=><option key={c.catalogId} value={c.catalogId}>#{c.catalogId} {c.title}</option>)}</select></label>
 <p>{c.engineId}@{c.version}. {c.scope} {c.limitations}</p>
 <details><summary>Formula and assumptions</summary><ul>{c.engine.formulas.map(f=><li key={f.id}><code>{f.expression}</code> — {f.description}</li>)}</ul></details>
 <CalculatorFactoryWorkbench key={ownerId+':'+id} workflows={specializedWorkflows(id)} fields={c.fields} restoreInputs={encodePrivateFinalInputs} title={c.title+' — Result unit: '+c.unit+' — private review'} plan={plan} renderResult={packet=><SpecializedResult plan={plan} packet={packet}/>} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
  const result=await saveHistory({expectedOwnerId:ownerId,requestId:retry.current.id,packet});return `Authenticated immutable history saved: ${result.id}`;
 }} renderWorkflows={(packet,restore)=><SpecializedFactoryPersistence catalogId={id} draftRevision={draftRevision} ownerId={ownerId} plan={plan} packet={packet} onRestore={(snapshot,restoredId)=>{if(restoredId!==id)throw Error('Choose the matching Specialized factory profile before restoring');restore(snapshot);}}/>}/>
 <style>{`.worker1-food-ratios-controls input,.worker1-food-ratios-controls select,.worker1-food-ratios-controls button,.worker1-food-ratios-controls textarea{max-width:100%;min-height:44px;box-sizing:border-box;font-size:16px}.worker1-food-ratios-controls label{display:block}.worker1-food-ratios-controls :focus-visible{outline:3px solid #1259c3;outline-offset:2px}`}</style>
 </section>;
}
