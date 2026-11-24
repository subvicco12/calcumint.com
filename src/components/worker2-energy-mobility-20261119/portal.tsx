'use client';
import {useState,useRef} from 'react';
import {chargingRoundedToZero,mobilityContracts,mobilityContract,mobilityWorkflows} from '@/lib/worker2-energy-mobility-20261119/cohort';
import {CalculatorFactoryWorkbench} from '../calculator-factory-workbench';
import {FinalResultPresentation} from '../final-result-presentation';
import {MobilityPersistence} from './persistence';
import {saveHistory} from '@/app/admin/worker2-energy-mobility-20261119/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function MobilityPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [id,setId]=useState<number>(mobilityContracts[0].catalogId),[draftRevision,setDraftRevision]=useState(0);const c=mobilityContract(id),retry=useRef<{key:string;id:string}|null>(null);
 return <section onChangeCapture={event=>{const target=event.target;if(target instanceof HTMLInputElement&&c.fields.some(f=>f.key===target.name))setDraftRevision(v=>v+1);}} className="worker2-mobility-controls" style={{maxWidth:'100%',minWidth:0,overflowWrap:'anywhere'}}>
 <label>Calculator profile<select value={id} onChange={e=>setId(Number(e.target.value))}>{mobilityContracts.map(c=><option key={c.catalogId} value={c.catalogId}>#{c.catalogId} {c.title}</option>)}</select></label>
 <p>{c.engineId}@{c.version}. {c.scope} {c.limitations.join(' ')}</p>
 <details><summary>Formula and assumptions</summary><ul>{c.engine.formulas.map(f=><li key={f.id}><code>{f.expression}</code> — {f.description}</li>)}</ul></details>
 <CalculatorFactoryWorkbench key={ownerId+':'+id} workflows={mobilityWorkflows(id)} fields={c.fields} title={c.title+' — Result unit: '+c.unit+' — private review'} plan={plan} renderResult={packet=><><FinalResultPresentation plan={plan} result={{
  primaryResult:{id:c.primaryKey,label:c.primaryLabel,value:packet.snapshot.output[c.primaryKey] as number,unit:c.outputUnit?.(packet.snapshot.input)??c.unit},
  metrics:Object.entries(c.outputs).filter(([key])=>key!==c.primaryKey).map(([key,meta])=>({id:key,label:meta.label,unit:meta.unit,value:packet.snapshot.output[key] as number})),
  methodology:c.scope,sources:c.engine.sources,warnings:c.limitations,
 }}/>{chargingRoundedToZero(id,packet.snapshot)&&<p role="status">The estimate is positive but rounds to zero at this calculator version’s six-decimal precision.</p>}</>} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
  const result=await saveHistory({expectedOwnerId:ownerId,requestId:retry.current.id,packet});return `Authenticated immutable history saved: ${result.id}`;
 }} renderWorkflows={(packet,restore)=><MobilityPersistence catalogId={id} draftRevision={draftRevision} ownerId={ownerId} plan={plan} packet={packet} onRestore={(snapshot,restoredId)=>{if(restoredId!==id)throw Error('Choose the matching power profile before restoring');restore(snapshot);}}/>}/>
 <style>{`.worker2-mobility-controls input,.worker2-mobility-controls select,.worker2-mobility-controls button,.worker2-mobility-controls textarea{max-width:100%;min-height:44px;box-sizing:border-box;font-size:16px}.worker2-mobility-controls label{display:block}.worker2-mobility-controls :focus-visible{outline:3px solid #1259c3;outline-offset:2px}`}</style>
 </section>;
}
