'use client';
import {useMemo,useState} from 'react';
import {createCalculationSnapshot,serializeCalculationJson,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {serializeCalculationCsv,serializeCalculationPdf} from '@/lib/calculation-export';
import {downloadPdfBytes} from '@/lib/download-pdf';
import {getPlanEntitlements} from '@/lib/entitlements';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-replay';
import {useCalculatorPlan} from './use-calculator-plan';
import {CalculatorScenarioWorkspace} from './calculator-scenario-workspace';

/** Stored fields stay in their original sections; identity is additional CSV context. */
export function serializeSavedCalculationCsv(snapshot:CalculationSnapshot):string{
 const saved=createCalculationSnapshot(snapshot),csv=serializeCalculationCsv(saved.input,saved.output);
 const quote=(value:string)=>`"${value.replaceAll('"','""')}"`;
 const text=(value:string)=>/^[\s]*[=+\-@]/u.test(value)?`'${value}`:value;
 const identity=[['identity','calculatorSlug',text(saved.calculatorSlug)],['identity','calculatorVersion',String(saved.calculatorVersion)]].map(row=>row.map(quote).join(',')).join('\n');
 const line=csv.indexOf('\n');
 return line<0?`${csv}\n${identity}`:`${csv.slice(0,line)}\n${identity}\n${csv.slice(line+1)}`;
}

function downloadText(filename:string,content:string,mime:string){
 const url=URL.createObjectURL(new Blob([content],{type:mime})),anchor=document.createElement('a');
 try{anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();}
 finally{anchor.remove();const revoke=URL.revokeObjectURL.bind(URL);setTimeout(()=>revoke(url),1000);}
}

/** This client never reads or writes a record: the server and its session boundary own access. */
export function SavedCalculationActions({snapshot,recordKey}:{snapshot:CalculationSnapshot;recordKey?:string}){
 const validated=useMemo(()=>{try{return createCalculationSnapshot(snapshot);}catch{return null;}},[snapshot]);
 if(!validated)return <p role="alert">Saved calculation tools are unavailable for this record. The original stored record has not been changed.</p>;
 // A new recorded payload gets a fresh workspace instead of retaining the prior record's previews.
 return <RecordedActions key={JSON.stringify([recordKey??null,validated])} snapshot={validated}/>;
}
function RecordedActions({snapshot}:{snapshot:CalculationSnapshot}){
 const plan=useCalculatorPlan(),entitlements=getPlanEntitlements(plan);
 const [message,setMessage]=useState(''),[error,setError]=useState(false),[verification,setVerification]=useState<{message:string;error:boolean}|null>(null);
 const filename=`${snapshot.calculatorSlug.replace(/[^\p{L}\p{N}._-]+/gu,'-').slice(0,120)}-v${snapshot.calculatorVersion}`;
 function exportStored(format:'json'|'csv'|'pdf'){
  if(!entitlements.exports)return;
  try{
   if(format==='json')downloadText(`${filename}.json`,serializeCalculationJson(snapshot),'application/json');
   else if(format==='csv')downloadText(`${filename}.csv`,serializeSavedCalculationCsv(snapshot),'text/csv;charset=utf-8');
   else downloadPdfBytes(`${filename}.pdf`,serializeCalculationPdf(snapshot,{title:`Recorded ${snapshot.calculatorSlug} — version ${snapshot.calculatorVersion}`,methodology:'Recorded historical inputs and results, without recalculation or application of current calculator metadata. This document does not establish original source authenticity, certification or applicability.'}));
   setError(false);setMessage(`Recorded ${format.toUpperCase()} download requested. Browser completion is not verified; the saved record is unchanged.`);
  }catch{setError(true);setMessage(`Could not download recorded ${format.toUpperCase()}. Retry the same export; the saved record is unchanged.`);}
 }
 function verifyStored(){try{const verified=verifyRegisteredSnapshot(snapshot);setVerification({error:false,message:`Exact engine agreement verified: ${verified.engineId} v${verified.engineVersion}. ${verified.scope} Original saved inputs and outputs remain unchanged.`});}catch{setVerification({error:true,message:'Exact-engine verification is unavailable or does not agree for this historical record. Its original inputs, outputs and version remain readable and exportable; no current-engine fallback or upgrade is applied.'});}}
 return <section aria-label="Saved calculation tools"><h2>Use this recorded calculation</h2><p>These actions preserve the recorded calculator identity, technical version, inputs and results. They do not upgrade or recalculate the saved record, or apply current labels and units.</p>
 <button type="button" className="button secondary" onClick={verifyStored}>Verify exact engine agreement</button><p>Verification is optional and runs only when requested. It checks an explicit immutable forward-engine contract where available; it does not authenticate original source authorship or approve clinical, provider or jurisdictional applicability.</p>{verification&&<p role={verification.error?'alert':'status'} aria-atomic="true">{verification.message}</p>}
 <div>{(['json','csv','pdf'] as const).map(format=><button key={format} type="button" className="button secondary" disabled={!entitlements.exports} onClick={()=>exportStored(format)}>Export recorded {format.toUpperCase()}</button>)}</div>
 {!entitlements.exports&&<p>Recorded exports and scenario capture require Pro or Business. The saved inputs and results remain readable on Free, including historical or retired versions.</p>}
 {message&&<p role={error?'alert':'status'} aria-atomic="true">{message}</p>}
 <p>Scenario capture creates separate copies of this recorded snapshot. It does not write to your account or replace the original record. Edited previews, where supported, remain separate from captured history.</p>
 <CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={downloadText}/>
 </section>;
}
