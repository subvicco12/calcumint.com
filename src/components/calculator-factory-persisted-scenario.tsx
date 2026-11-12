'use client';
import {useLayoutEffect,useRef,useState} from 'react';
import {factoryProjects,factorySaveScenario,factoryRestoreScenario} from '@/app/admin/calculator-factory/actions';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';

type Props={ownerId:string;packet:FactoryExecutionPacket|null;onRestore:(snapshot:CalculationSnapshot,catalogId:number)=>void};
export function CalculatorFactoryPersistedScenario(props:Props){return <OwnedScenario key={props.ownerId} {...props}/>;}
function OwnedScenario({ownerId,packet,onRestore}:Props){
 const [projects,setProjects]=useState<{id:string;name:string}[]>([]),[projectId,setProjectId]=useState(''),[name,setName]=useState(''),[restoreId,setRestoreId]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 const generation=useRef(0),mounted=useRef(false),pending=useRef(false),retry=useRef<{key:string;id:string}|null>(null);
 const packetKey=JSON.stringify(packet);
 const current=useRef('');current.current=packetKey;
 useLayoutEffect(()=>{mounted.current=true;return()=>{mounted.current=false;generation.current++;pending.current=false;};},[]);
 useLayoutEffect(()=>{generation.current++;pending.current=false;retry.current=null;setBusy(false);setMessage('');},[packetKey]);
 const start=()=>{if(pending.current)return null;pending.current=true;setBusy(true);setMessage('');return {generation:++generation.current,key:packetKey};};
 const valid=(request:{generation:number;key:string})=>mounted.current&&generation.current===request.generation&&current.current===request.key;
 async function run(operation:(validNow:()=>boolean)=>Promise<void>){
  const request=start();if(!request)return;
  try{await operation(()=>valid(request));}catch(error){if(valid(request))setMessage(error instanceof Error?error.message:'Request unavailable. Retry.');}
  finally{if(valid(request)){pending.current=false;setBusy(false);}}
 }
 function load(){void run(async validNow=>{const result=await factoryProjects(ownerId);if(!validNow())return;setProjects(result.projects);setProjectId(old=>result.projects.some(row=>row.id===old)?old:result.projects[0]?.id??'');setMessage(result.projects.length?'Owned projects loaded.':'No owned projects yet.');});}
 function save(){if(!packet||!projectId||!name.trim())return;const key=JSON.stringify([ownerId,packet,projectId,name]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};const requestId=retry.current.id;
  void run(async validNow=>{const result=await factorySaveScenario({expectedOwnerId:ownerId,packet,projectId,name,requestId});if(!validNow())return;setRestoreId(result.scenarioId);setMessage(`Saved scenario ${result.scenarioId}.`);});
 }
 function restore(){void run(async validNow=>{const result=await factoryRestoreScenario({expectedOwnerId:ownerId,scenarioId:restoreId.trim()});if(!validNow())return;onRestore(result.snapshot,result.catalogId);setMessage('Verified saved snapshot restored.');});}
 return <section aria-label="Persisted project scenarios">
  <h3>Saved project scenarios</h3>
  <p>Save a verified calculation to an owned Pro or Business project. Saved scenarios retain normalized inputs and results; original raw keystrokes are not retained.</p>
  <button type="button" disabled={busy} onClick={load}>Load owned projects</button>{' '}<a href="/account/projects">Manage projects</a>
  <label>Owned project<select aria-label="Owned project" value={projectId} disabled={busy||!projects.length} onChange={event=>{setProjectId(event.target.value);retry.current=null;}}><option value="">Choose an owned project</option>{projects.map(project=><option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
  <label>Scenario name<input maxLength={120} value={name} disabled={busy} onChange={event=>{setName(event.target.value);retry.current=null;}}/></label>
  <button type="button" disabled={busy||!packet||!projectId||!name.trim()} onClick={save}>Save project scenario</button>
  <label>Saved scenario ID<input value={restoreId} disabled={busy} onChange={event=>setRestoreId(event.target.value)}/></label>
  <button type="button" disabled={busy||!restoreId.trim()} onClick={restore}>Restore saved scenario</button>
  {busy&&<p role="status">Working…</p>}{message&&<p role="status">{message}</p>}
 </section>;
}
