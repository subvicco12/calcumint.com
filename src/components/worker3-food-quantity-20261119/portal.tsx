'use client';
import {useState,useRef} from 'react';
import {foodContracts,foodContract,foodWorkflows,foodResult} from '@/lib/worker3-food-quantity-20261119/cohort';
import {CalculatorFactoryWorkbench} from '../calculator-factory-workbench';
import {FinalResultPresentation} from '../final-result-presentation';
import {FoodPersistence} from './persistence';
import {saveHistory} from '@/app/admin/worker3-food-quantity-20261119/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function FoodPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [id,setId]=useState<number>(foodContracts[0].catalogId),[draftRevision,setDraftRevision]=useState(0);const c=foodContract(id),retry=useRef<{key:string;id:string}|null>(null);
 return <section onChangeCapture={event=>{const target=event.target;if(target instanceof HTMLInputElement&&c.fields.some(f=>f.key===target.name))setDraftRevision(v=>v+1);}} className="worker3-food-controls" style={{maxWidth:'100%',minWidth:0,overflowWrap:'anywhere'}}>
 <label>Food profile<select value={id} onChange={e=>setId(Number(e.target.value))}>{foodContracts.map(c=><option key={c.catalogId} value={c.catalogId}>#{c.catalogId} {c.title}</option>)}</select></label>
 <p>{c.engineId}@{c.version}. {c.scope} {c.limitations}</p>
 <details><summary>Formula and assumptions</summary><ul>{c.engine.formulas.map(f=><li key={f.id}><code>{f.expression}</code> — {f.description}</li>)}</ul></details>
 <CalculatorFactoryWorkbench key={ownerId+':'+id} workflows={foodWorkflows(id)} fields={c.fields} title={c.title+' — Result unit: '+c.unit+' — private review'} plan={plan} renderResult={packet=><FinalResultPresentation plan={plan} result={foodResult(packet)}/>} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
  const result=await saveHistory({expectedOwnerId:ownerId,requestId:retry.current.id,packet});return `Authenticated immutable history saved: ${result.id}`;
 }} renderWorkflows={(packet,restore)=><FoodPersistence catalogId={id} draftRevision={draftRevision} ownerId={ownerId} plan={plan} packet={packet} onRestore={(snapshot,restoredId)=>{if(restoredId!==id)throw Error('Choose the matching food profile before restoring');restore(snapshot);}}/>}/>
 <style>{`.worker3-food-controls input,.worker3-food-controls select,.worker3-food-controls button,.worker3-food-controls textarea{max-width:100%;min-height:44px;box-sizing:border-box;font-size:16px}.worker3-food-controls label{display:block}.worker3-food-controls :focus-visible{outline:3px solid #1259c3;outline-offset:2px}`}</style>
 </section>;
}
