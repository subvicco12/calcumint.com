'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';
import {parseTechnologyFiveShare,parseTechnologyFiveSnapshotJson} from '@/lib/business/technology-five-sharing';
import {parseTechnologyNextShare,parseTechnologyNextSnapshotJson} from '@/lib/business/technology-next-sharing';
type Props={cohort?:'next';organizationId:string;projectId:string;initialRequestId:string;canShare:boolean;clients:readonly {id:string;name:string}[];history:readonly {id:string;snapshot:CalculationSnapshot}[];template?:{id:string;title:string;snapshot:CalculationSnapshot}};
export function TechnologyFiveShareForm(props:Props){return <ShareFormSession key={JSON.stringify([props.organizationId,props.projectId,props.initialRequestId,props.template?.id??null,...(props.cohort?['next']:[])])} {...props}/>;}
function ShareFormSession({cohort,organizationId,projectId,initialRequestId,canShare,clients,history,template}:Props){
 const [text,setText]=useState(template?JSON.stringify(template.snapshot,null,2):history[0]?JSON.stringify(history[0].snapshot,null,2):''),[title,setTitle]=useState(template?('Copy of '+template.title).slice(0,240):'Shared baseline'),[client,setClient]=useState(''),[message,setMessage]=useState(''),[error,setError]=useState(false),[busy,setBusy]=useState(false),[sharedId,setSharedId]=useState('');
 const pending=useRef(false),request=useRef({signature:'',id:initialRequestId});
 if(!canShare)return <p>Viewer access: read and export shared snapshots. Capturing shared work requires Member, Manager, Admin or Owner permission.</p>;
 async function submit(event:React.FormEvent){
  event.preventDefault();if(pending.current)return;pending.current=true;setBusy(true);setMessage('');setSharedId('');
  try{
   const snapshot=(cohort==='next'?parseTechnologyNextSnapshotJson:parseTechnologyFiveSnapshotJson)(text),draft={organizationId,projectId,clientWorkspaceId:client||null,title,snapshot};
   const signature=JSON.stringify(draft);if(request.current.signature&&request.current.signature!==signature)request.current.id=crypto.randomUUID();request.current.signature=signature;
   const payload=(cohort==='next'?parseTechnologyNextShare:parseTechnologyFiveShare)({...draft,requestId:request.current.id});
   const response=await fetch('/api/business/technology-five-shares'+(cohort==='next'?'?cohort=next':''),{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const result=await response.json();if(!response.ok){setError(true);setMessage(typeof result?.error==='string'?result.error:'Sharing is unavailable. Retry preserves earlier snapshots.');return;}
   if(typeof result?.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result.id))throw Error('Invalid confirmation');
   setError(false);setSharedId(result.id);setMessage('Verified snapshot shared. The original history and earlier shared records are unchanged.');
  }catch{setError(true);setMessage(cohort==='next'?'Sharing unavailable: use one of the thirteen supported exact recorded revisions and valid project/client access. Your editable JSON and earlier records are unchanged.':'Sharing unavailable: use a supported exact version-1 recorded snapshot and valid project/client access. Your editable JSON and earlier records are unchanged.');}
  finally{pending.current=false;setBusy(false);}
 }
 return <section aria-label="Share a verified calculation"><h2>Share a verified calculation</h2><p>Choose your recorded history or paste its exported calculation JSON. This creates a separate immutable organization snapshot; it never edits personal history or earlier shares. {cohort==='next'?'Only the thirteen declared next-cohort calculator revisions are supported, including Website Bandwidth revision 2.':'Only the five declared technology calculators at technical revision 1 are supported.'} Shared annotations do not approve source applicability or publication.</p>
 {template&&<p>Loaded verified shared template: {template.title}. Saving creates a new record and request; its original shared values stay unchanged.</p>}<form className="form-stack" onSubmit={submit}><fieldset disabled={busy} style={{minWidth:0}}><legend>New shared snapshot</legend><label className="field">Your recorded calculation<select aria-label="Your recorded calculation" onChange={event=>{const row=history.find(row=>row.id===event.target.value);if(row)setText(JSON.stringify(row.snapshot,null,2));}} defaultValue={template?'':history[0]?.id??''}><option value="">Paste recorded JSON below</option>{history.map(row=><option key={row.id} value={row.id}>{row.snapshot.calculatorSlug} · version {row.snapshot.calculatorVersion}</option>)}</select></label><label className="field">Snapshot title<input value={title} maxLength={240} required onChange={event=>setTitle(event.target.value)}/></label><label className="field">Client workspace<select aria-label="Client workspace" value={client} onChange={event=>setClient(event.target.value)}><option value="">Project only</option>{clients.map(row=><option key={row.id} value={row.id}>{row.name}</option>)}</select></label><label className="field">Shared calculation JSON<textarea style={{width:'100%',maxWidth:'100%',minWidth:0}} aria-label="Shared calculation JSON" rows={12} maxLength={65536} value={text} onChange={event=>setText(event.target.value)}/></label><button type="submit" className="button primary">Share verified snapshot</button></fieldset></form>
 {busy&&<p role="status">Verifying and sharing…</p>}{message&&<p role={error?'alert':'status'}>{message}</p>}{sharedId&&<Link href={'/business/shared/'+sharedId+(cohort==='next'?'?cohort=next':'')}>Open shared snapshot</Link>}
 </section>;
}
