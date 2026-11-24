'use client';
import {useState,useRef} from 'react';
import {powerContracts,powerContract,powerWorkflows} from '@/lib/worker2-automotive-power-20261118/cohort';
import {CalculatorFactoryWorkbench} from '../calculator-factory-workbench';
import {FinalResultPresentation} from '../final-result-presentation';
import {PowerPersistence} from './persistence';
import {saveHistory} from '@/app/admin/worker2-automotive-power-20261118/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function PowerPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [id,setId]=useState<number>(powerContracts[0].catalogId),[draftRevision,setDraftRevision]=useState(0);const c=powerContract(id),retry=useRef<{key:string;id:string}|null>(null);
 return <section onChangeCapture={event=>{const target=event.target;if(target instanceof HTMLInputElement&&c.fields.some(f=>f.key===target.name))setDraftRevision(v=>v+1);}} className="worker2-power-controls" style={{maxWidth:'100%',minWidth:0,overflowWrap:'anywhere'}}>
 <label>Power profile<select value={id} onChange={e=>setId(Number(e.target.value))}>{powerContracts.map(c=><option key={c.catalogId} value={c.catalogId}>#{c.catalogId} {c.title}</option>)}</select></label>
 <p>{c.engineId}@{c.version}. {c.scope} {c.limitations.join(' ')}</p>
 <details><summary>Formula and assumptions</summary><ul>{c.engine.formulas.map(f=><li key={f.id}><code>{f.expression}</code> — {f.description}</li>)}</ul></details>
 <CalculatorFactoryWorkbench key={ownerId+':'+id} workflows={powerWorkflows(id)} fields={c.fields} title={c.title+' — Result unit: '+c.unit+' — private review'} plan={plan} renderResult={packet=><FinalResultPresentation plan={plan} result={{
  primaryResult:{id:'horsepower',label:'Mechanical horsepower',value:packet.snapshot.output.horsepower as number,unit:c.unit},
  methodology:c.scope,sources:c.engine.sources,warnings:c.limitations,
 }}/>} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
  const result=await saveHistory({expectedOwnerId:ownerId,requestId:retry.current.id,packet});return `Authenticated immutable history saved: ${result.id}`;
 }} renderWorkflows={(packet,restore)=><PowerPersistence catalogId={id} draftRevision={draftRevision} ownerId={ownerId} plan={plan} packet={packet} onRestore={(snapshot,restoredId)=>{if(restoredId!==id)throw Error('Choose the matching power profile before restoring');restore(snapshot);}}/>}/>
 <style>{`.worker2-power-controls input,.worker2-power-controls select,.worker2-power-controls button,.worker2-power-controls textarea{max-width:100%;min-height:44px;box-sizing:border-box;font-size:16px}.worker2-power-controls label{display:block}.worker2-power-controls :focus-visible{outline:3px solid #1259c3;outline-offset:2px}`}</style>
 </section>;
}
