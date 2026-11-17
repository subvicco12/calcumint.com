'use client';
import {useState,useRef} from 'react';
import {statisticsContracts,statisticsContract,statisticsWorkflows,statisticsResult} from '@/lib/worker2-statistics-b-20261117/cohort';
import {StatisticsWorkbench} from './workbench';
import {FinalResultPresentation} from '../final-result-presentation';
import {StatisticsPersistence} from './persistence';
import {saveHistory} from '@/app/admin/worker2-statistics-b-20261117/actions';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function StatisticsPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [id,setId]=useState<number>(statisticsContracts[0].catalogId),[draftRevision,setDraftRevision]=useState(0);const c=statisticsContract(id),retry=useRef<{key:string;id:string}|null>(null);
 return <section onChangeCapture={event=>{const target=event.target;if((target instanceof HTMLInputElement||target instanceof HTMLSelectElement)&&c.fields.some(f=>f.key===target.name))setDraftRevision(v=>v+1);}} className="worker2-statistics-controls" style={{maxWidth:'100%',minWidth:0,overflowWrap:'anywhere'}}>
 <label>Statistics profile<select value={id} onChange={e=>setId(Number(e.target.value))}>{statisticsContracts.map(c=><option key={c.catalogId} value={c.catalogId}>#{c.catalogId} {c.title}</option>)}</select></label>
 <p>{c.engineId}@{c.version}. {c.scope} {c.limitations.join(' ')}</p><p>#298 remains unavailable pending its source, applicability and ownership decision.</p>
 <details><summary>Formula and assumptions</summary><ul>{c.engine.formulas.map(f=><li key={f.id}><code>{f.expression}</code> — {f.description}</li>)}</ul></details>
 <StatisticsWorkbench key={ownerId+':'+id} workflows={statisticsWorkflows(id)} fields={c.fields} title={c.title+' — Result unit: '+c.unit+' — private review'} plan={plan} renderResult={packet=><><FinalResultPresentation plan={plan} result={statisticsResult(packet)}/><details><summary>Immutable calculation steps</summary><ol>{(packet.snapshot.output.steps as string[]).map((step,i)=><li key={i}>{step}</li>)}</ol></details></>} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
  const result=await saveHistory({expectedOwnerId:ownerId,requestId:retry.current.id,packet});return `Authenticated immutable history saved: ${result.id}`;
 }} renderWorkflows={(packet,restore)=><StatisticsPersistence catalogId={id} draftRevision={draftRevision} ownerId={ownerId} plan={plan} packet={packet} onRestore={(snapshot,restoredId)=>{if(restoredId!==id)throw Error('Choose the matching statistics profile before restoring');restore(snapshot);}}/>}/>
 <style>{`.worker2-statistics-controls input,.worker2-statistics-controls select,.worker2-statistics-controls button,.worker2-statistics-controls textarea{max-width:100%;min-height:44px;box-sizing:border-box;font-size:16px}.worker2-statistics-controls label{display:block}.worker2-statistics-controls :focus-visible{outline:3px solid #1259c3;outline-offset:2px}`}</style>
 </section>;
}
