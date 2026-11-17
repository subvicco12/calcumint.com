'use client';
import {useId,useState,useSyncExternalStore} from 'react';
import {z} from 'zod';
import type {FinalPlan} from '../calculators/final-framework/product-capabilities';
import {unitConversionPresentation} from '../calculators/final-framework/unit-conversion-presentation';
import {FinalCalculatorRenderer} from './final-calculator-renderer';
import {fixedFactorWorkspaces,fixedFactorWorkspaceDefinition,fixedFactorWorkspaceStorageKey,
 emptyFixedFactorWorkspace,runFixedFactorDraft,setFixedFactorCurrent,saveFixedFactorHistory,saveFixedFactorScenario,
 restoreFixedFactorHistory,restoreFixedFactorScenario,compareFixedFactorScenarios,exportFixedFactorWorkspace,importFixedFactorWorkspace,
 fixedFactorScalarResult,fixedFactorUnitLabel,type FixedFactorDraft,type FixedFactorWorkspace} from '../lib/conversion-successor/fixed-factor-workspace';

const message=(error:unknown)=>error instanceof z.ZodError?error.issues[0]?.message??'Invalid private input':error instanceof Error?error.message:'Private operation could not be verified';
const subscribeHydration=()=>()=>{};
const clientReady=()=>true,serverReady=()=>false;
function loadStoredWorkspace(){
 let raw:string|null=null;
 try{
  raw=localStorage.getItem(fixedFactorWorkspaceStorageKey);
  return {workspace:raw===null?emptyFixedFactorWorkspace():importFixedFactorWorkspace(raw),json:'',error:'',notice:''};
 }catch{
  return {workspace:emptyFixedFactorWorkspace(),json:raw??'',
   error:raw===null?'':'Stored workspace could not be verified. Its original text is retained; correct or replace it to recover. Nothing was overwritten.',
   notice:raw===null?'Browser storage is unavailable. Start in this tab and export JSON to keep verified records.':''};
 }
}
/** Explicit private review surface only; no public route or account API. */
export function PrivateFixedFactorReview(){
 // Mount browser state after hydration; no synchronous setState effect or SSR storage read.
 const ready=useSyncExternalStore(subscribeHydration,clientReady,serverReady);
 return ready?<PrivateFixedFactorClient/>:<p role="status">Loading private converter workspace…</p>;
}
function PrivateFixedFactorClient(){
 const prefix=useId();
 const [initial]=useState(loadStoredWorkspace);
 const [workspace,setWorkspace]=useState(initial.workspace);
 const [id,setId]=useState(initial.workspace.current?.artifact.privateId??fixedFactorWorkspaces[0].engine.id);
 const [draft,setDraft]=useState<FixedFactorDraft>(initial.workspace.current?.draft??fixedFactorWorkspaces[0].example);
 const [plan,setPlan]=useState<FinalPlan>('free');
 const [formError,setFormError]=useState(''),[recoveryError,setRecoveryError]=useState(initial.error),[storageNotice,setStorageNotice]=useState(initial.notice);
 const [json,setJson]=useState(initial.json),[compare,setCompare]=useState(false);
 const definition=fixedFactorWorkspaceDefinition(id),current=workspace.current;
 function persist(next:FixedFactorWorkspace){
  const text=exportFixedFactorWorkspace(next);setWorkspace(next);
  try{localStorage.setItem(fixedFactorWorkspaceStorageKey,text);setStorageNotice('Verified workspace saved in this browser.');}
  catch{setStorageNotice('Browser storage is unavailable. This verified workspace remains in this tab; export JSON to keep it.');}
 }
 function update(next:FixedFactorDraft){setDraft(next);setWorkspace(state=>setFixedFactorCurrent(state,null));setFormError('');}
 function select(next:string){
  const selected=fixedFactorWorkspaceDefinition(next);setId(next);update(selected.example);
 }
 function run(){
  setFormError('');
  try{persist(setFixedFactorCurrent(workspace,runFixedFactorDraft(id,draft)));}
  catch(error){setWorkspace(state=>setFixedFactorCurrent(state,null));setFormError(message(error));}
 }
 function restore(next:FixedFactorWorkspace){
  persist(next);if(next.current){setId(next.current.artifact.privateId);setDraft(next.current.draft);}setFormError('');
 }
 function action(operation:()=>FixedFactorWorkspace){try{restore(operation());}catch(error){setFormError(message(error));}}
 function recover(){
  try{const verified=importFixedFactorWorkspace(json);restore(verified);setCompare(false);setRecoveryError('');}
  catch(error){setRecoveryError('Recovery rejected: '+message(error)+'. Existing history and scenarios were kept.');}
 }
 function exportJson(){try{const text=exportFixedFactorWorkspace(workspace);setJson(text);setRecoveryError('');return text;}catch(error){setRecoveryError(message(error));return null;}}
 function download(){
  const text=exportJson();if(text===null)return;
  try{
   const url=URL.createObjectURL(new Blob([text+'\n'],{type:'application/json'})),link=document.createElement('a');
   link.href=url;link.download='private-fixed-factor-workspace.json';document.body.append(link);
   try{link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  }catch{setRecoveryError('Download unavailable. The complete JSON remains in the recovery field for copying.');}
 }
 let comparison:ReturnType<typeof compareFixedFactorScenarios>|null=null;
 if(compare){try{comparison=compareFixedFactorScenarios(workspace);}catch{/* The Compare action reports validation failures. */}}
 return <section aria-label="Private source-factor converter workspace" className="calculator-ui" style={{maxWidth:1000,margin:'auto',padding:16,overflowWrap:'anywhere'}}>
  <h1>Private source-factor conversion review</h1>
  <p>Draft proposals for 429, 437 and 439. Competent applicability review and canonical adoption remain pending. No registered engine, public route or historical record is changed.</p>
  <p>Local engineering history and A/B review are available for every synthetic plan. They do not grant account entitlements. Only verified snapshots are saved; unfinished drafts remain in this tab.</p>
  <div className="field-grid">
   <label htmlFor={prefix+'converter'}>Private converter<select id={prefix+'converter'} value={id} onChange={event=>select(event.target.value)}>{fixedFactorWorkspaces.map(row=><option value={row.engine.id} key={row.catalogId}>{row.catalogId} — {row.title}</option>)}</select></label>
   <label htmlFor={prefix+'plan'}>Synthetic presentation plan<select id={prefix+'plan'} value={plan} onChange={event=>setPlan(event.target.value as FinalPlan)}>{['free','pro','business'].map(value=><option key={value}>{value}</option>)}</select></label>
   <label htmlFor={prefix+'value'}>Conversion value<input id={prefix+'value'} type="text" inputMode="decimal" maxLength={200} value={draft.value} aria-invalid={!!formError} aria-describedby={prefix+'domain'} onChange={event=>update({...draft,value:event.target.value})}/></label>
   <label htmlFor={prefix+'from'}>From unit<select id={prefix+'from'} value={draft.fromUnit} onChange={event=>update({...draft,fromUnit:event.target.value})}>{Object.keys(definition.engine.factors).map(code=><option key={code} value={code}>{fixedFactorUnitLabel(code)}</option>)}</select></label>
   <label htmlFor={prefix+'to'}>To unit<select id={prefix+'to'} value={draft.toUnit} onChange={event=>update({...draft,toUnit:event.target.value})}>{Object.keys(definition.engine.factors).map(code=><option key={code} value={code}>{fixedFactorUnitLabel(code)}</option>)}</select></label>
  </div>
  <p id={prefix+'domain'}>Nonidentity domain: zero, or 2^-970 ≤ |value| ≤ 2^990. Finite identical-unit values are preserved. JSON normalizes signed zero. Inputs represent supplied Numbers; lossy decimal text is refused.</p>
  <button type="button" onClick={run}>Calculate private proposal</button>{' '}
  <button type="button" onClick={()=>update(definition.example)}>Load private example</button>
  {formError&&<p role="alert">{formError}</p>}
  <section aria-label="Verified private result">
   {current&&<><FinalCalculatorRenderer result={fixedFactorScalarResult(current)} plan={plan} presentation={unitConversionPresentation}/>
    <p>Exact recorded Number: <output data-testid="private-factor-exact-result">{String(current.artifact.snapshot.output.result)}</output> {fixedFactorUnitLabel(current.draft.toUnit)}</p>
    <details><summary>Complete immutable proposal artifact</summary><pre style={{whiteSpace:'pre-wrap'}} data-testid="private-factor-artifact">{JSON.stringify(current,null,2)}</pre></details>
   </>}
  </section>
  <details><summary>Selected method and applicability</summary>
   <p>{definition.engine.qualification.methodology}</p><p>{definition.engine.qualification.relativeBound}</p>
   <ul>{definition.engine.qualification.limitations.map(line=><li key={line}>{line}</li>)}</ul>
   <p>Source applicability: {definition.engine.qualification.sourceApplicability}. Private revision: {definition.engine.implementationRevision}. No successor version is allocated.</p>
  </details>
  <h2>Local immutable history</h2><p>Up to 20 verified records, retained in browser storage when available.</p>
  <button type="button" disabled={!current} onClick={()=>action(()=>saveFixedFactorHistory(workspace))}>Save current to history</button>{' '}
  <button type="button" onClick={()=>{persist({...workspace,history:[]});}}>Clear history</button>
  <ol aria-label="Saved private history">{workspace.history.map((saved,index)=><li key={index}>{fixedFactorWorkspaceDefinition(saved.artifact.privateId).title}: {saved.draft.value} {fixedFactorUnitLabel(saved.draft.fromUnit)} → {String(saved.artifact.snapshot.output.result)} {fixedFactorUnitLabel(saved.draft.toUnit)}{' '}
   <button type="button" onClick={()=>action(()=>restoreFixedFactorHistory(workspace,index))}>Restore history {index+1}</button></li>)}</ol>
  <h2>Private A/B scenarios</h2>
  <p>Compare saved proposals only when converter identity and output unit match. Capturing a slot explicitly replaces that slot; saved records remain detached from live inputs.</p>
  {(['A','B'] as const).map(slot=><span key={slot}><button type="button" disabled={!current} onClick={()=>{action(()=>saveFixedFactorScenario(workspace,slot));setCompare(false);}}>Capture scenario {slot}</button>{' '}
   <button type="button" disabled={!workspace.scenarios[slot]} onClick={()=>action(()=>restoreFixedFactorScenario(workspace,slot))}>Restore scenario {slot}</button>{' '}</span>)}
  <button type="button" onClick={()=>{try{compareFixedFactorScenarios(workspace);setCompare(true);setFormError('');}catch(error){setCompare(false);setFormError(message(error));}}}>Compare saved scenarios</button>{' '}
  <button type="button" onClick={()=>{persist({...workspace,scenarios:{A:null,B:null}});setCompare(false);}}>Clear scenarios</button>
  {comparison&&<table><caption>Private A/B conversion scenarios</caption><thead><tr><th scope="col">Slot</th><th scope="col">Converter</th><th scope="col">Saved input</th><th scope="col">Saved output</th></tr></thead><tbody>{comparison.map(({slot,record})=><tr key={slot}><th scope="row">{slot}</th><td>{fixedFactorWorkspaceDefinition(record.artifact.privateId).title}</td><td>{record.draft.value} {fixedFactorUnitLabel(record.draft.fromUnit)}</td><td>{String(record.artifact.snapshot.output.result)} {fixedFactorUnitLabel(record.draft.toUnit)}</td></tr>)}</tbody></table>}
  <h2>Export and recovery</h2>
  <p>Complete workspace JSON includes raw saved inputs, immutable results, source identity, history and both scenario slots. Every record is re-executed before recovery; failed recovery keeps the current workspace.</p>
  <button type="button" onClick={exportJson}>Export workspace JSON</button>{' '}<button type="button" onClick={download}>Download workspace JSON</button>{' '}
  <button type="button" onClick={recover}>Recover verified workspace</button><br/>
  <label htmlFor={prefix+'json'}>Workspace JSON for export or recovery</label><br/>
  <textarea id={prefix+'json'} rows={10} value={json} spellCheck={false} aria-invalid={!!recoveryError} onChange={event=>{setJson(event.target.value);setRecoveryError('');}} style={{width:'100%',boxSizing:'border-box'}}/>
  {recoveryError&&<p role="alert">{recoveryError}</p>}{storageNotice&&<p role="status">{storageNotice}</p>}
 </section>;
}
