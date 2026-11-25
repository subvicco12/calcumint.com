'use client';
import {prepareLinearSystemsRecovery,linearContract} from '@/lib/sole-linear-systems-20261119/cohort';
import {useLayoutEffect,useRef,useState} from 'react';
import {loadProjects,saveScenario,restoreScenario,readHistory,loadBusiness} from '@/app/admin/sole-linear-systems-20261119/actions';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function LinearSystemsPersistence({catalogId,draftRevision,ownerId,plan,packet,onRestore}:{catalogId:number;draftRevision:number;ownerId:string;plan:CalcuMintPlan;packet:FactoryExecutionPacket|null;onRestore:(s:CalculationSnapshot,id:number)=>void}){
 const [projects,setProjects]=useState<{id:string;name:string}[]>([]),[project,setProject]=useState(''),[name,setName]=useState(''),[scenario,setScenario]=useState(''),[history,setHistory]=useState(''),[org,setOrg]=useState('');
 const key=JSON.stringify([ownerId,packet,draftRevision,catalogId]),generation=useRef(0),mounted=useRef(false),pending=useRef(false),retry=useRef<{key:string;id:string}|null>(null);
 const [historical,setHistorical]=useState<CalculationSnapshot|null>(null);
 const [status,setStatus]=useState({key,message:'',busy:false});const visible=status.key===key?status:{key,message:'',busy:false};
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 useLayoutEffect(()=>{generation.current++;pending.current=false;retry.current=null;},[key]);
 async function run(operation:(valid:()=>boolean)=>Promise<string>){
  if(pending.current)return;pending.current=true;const token=++generation.current;setStatus({key,message:'',busy:true});const valid=()=>mounted.current&&generation.current===token;
  try{const message=await operation(valid);if(valid())setStatus({key,message,busy:false});}catch(e){if(valid())setStatus({key,message:e instanceof Error?e.message:'Request unavailable',busy:false});}finally{if(valid())pending.current=false;}
 }
 function recover(result:{catalogId:number;snapshot:CalculationSnapshot},valid:()=>boolean){
  if(!valid())return 'Stale response ignored';
  if(result.catalogId!==catalogId)throw Error('Choose the matching Linear systems profile before restoring');
  const checked=prepareLinearSystemsRecovery(result.snapshot);
  if(checked.catalogId!==catalogId)throw Error('Historical identity differs');
  if(!checked.currentCaptureAvailable){setHistorical(checked.snapshot);return 'Verified historical snapshot opened read-only; its original v1 result is preserved and is not a new capture.';}
  setHistorical(null);onRestore(checked.snapshot,checked.catalogId);return 'Verified owned snapshot restored';
 }
 function downloadHistorical(){
  if(!historical||plan==='free')return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(historical,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=historical.calculatorSlug+'-v'+historical.calculatorVersion+'-recorded.json';document.body.append(a);try{a.click();}finally{a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 }
 const busy=visible.busy;
 const save=()=>{if(!packet)return;const requestKey=JSON.stringify([ownerId,packet,project,name]);if(retry.current?.key!==requestKey)retry.current={key:requestKey,id:crypto.randomUUID()};const requestId=retry.current.id;void run(async valid=>{const result=await saveScenario({expectedOwnerId:ownerId,packet,projectId:project,name,requestId});if(valid())setScenario(result.scenarioId);return 'Saved scenario '+result.scenarioId;});};
 return <section aria-label="Authenticated Linear systems workflows"><h3>Immutable account workflows</h3>
 <label>Saved history ID<input value={history} onChange={e=>setHistory(e.target.value)} disabled={busy}/></label><button disabled={busy||!history.trim()} onClick={()=>void run(async valid=>{setHistorical(null);const r=await readHistory({expectedOwnerId:ownerId,historyId:history.trim()});return r.ok?recover(r.record,valid):'Saved calculation unavailable for this account or version.';})}>Restore owned history</button>
 {plan!=='free'&&<><button disabled={busy} onClick={()=>void run(async valid=>{const r=await loadProjects(ownerId);if(valid()){setProjects(r.projects);setProject(r.projects[0]?.id??'');}return 'Owned projects loaded';})}>Load owned projects</button>
 <label>Owned project<select value={project} onChange={e=>setProject(e.target.value)} disabled={busy}>{!projects.length&&<option value="">Load projects</option>}{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
 <label>Scenario name<input value={name} maxLength={120} onChange={e=>setName(e.target.value)} disabled={busy}/></label><button disabled={busy||!project||!packet||!name.trim()} onClick={save}>Save project scenario</button>
 <label>Saved scenario ID<input value={scenario} onChange={e=>setScenario(e.target.value)} disabled={busy}/></label><button disabled={busy||!scenario.trim()} onClick={()=>void run(async valid=>{const r=await restoreScenario({expectedOwnerId:ownerId,scenarioId:scenario.trim()});return recover(r,valid);})}>Restore saved scenario</button></>}
 {plan==='business'&&<><label>Business organization ID<input value={org} onChange={e=>setOrg(e.target.value)} disabled={busy}/></label><button disabled={busy||!org.trim()} onClick={()=>void run(async()=>{const r=await loadBusiness({expectedOwnerId:ownerId,organizationId:org.trim()});return r.ok?`Verified Business role: ${r.role}. ${r.reason}`:'Business workspace access denied. Check your membership or sign in again.';})}>Check current Business capability</button><p>Team writes, API/embed grants, metered jobs and webhooks remain unavailable for these tuples until guarded capability adoption.</p></>}
 {historical&&<section aria-label="Read-only historical Linear systems"><h4>Verified immutable historical record</h4><p>Recorded result unit: {linearContract(catalogId).unit}</p><p>The original normalized input and output are preserved. Current capture limits are not applied to this read-only result. Original raw decimal entry was not retained.</p><pre aria-label="Verified historical Linear systems snapshot" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(historical,null,2)}</pre>{plan!=='free'&&<button onClick={downloadHistorical}>Export recorded Linear systems JSON</button>}</section>}
 {visible.message&&<p role="status">{visible.message}</p>}{busy&&<p role="status">Working…</p>}
 </section>;
}
