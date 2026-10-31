'use client';
import {useId,useMemo,useState} from 'react';
import {getPlanEntitlements,type CalcuMintPlan} from '@/lib/entitlements';
import {eligiblePrivateSensitivityFields,previewPrivateSensitivity,type PrivateSensitivityPreview} from '@/lib/private-review-sensitivity';
import type {exportScaledContract} from '@/calculators/scaled-contract-adapters';
type Packet=ReturnType<typeof exportScaledContract>;
/** A new baseline or loss of entitlement discards every transient preview. */
export function PrivateReviewSensitivity({packet,plan}:{packet:Packet|null;plan:CalcuMintPlan}){
 const permitted=getPlanEntitlements(plan).scenarios;
 return <PrivateSensitivitySession key={JSON.stringify([packet,permitted])} packet={packet} permitted={permitted}/>;
}
function PrivateSensitivitySession({packet,permitted}:{packet:Packet|null;permitted:boolean}){
 const prefix=useId();const available=useMemo(()=>{try{return {fields:packet?eligiblePrivateSensitivityFields(packet):[],error:null};}catch{return {fields:[],error:'The original packet could not be verified. Run a valid current contract before previewing.'};}},[packet]);
 const [field,setField]=useState(available.fields[0]??''),[text,setText]=useState(''),[result,setResult]=useState<PrivateSensitivityPreview|null>(null),[error,setError]=useState('');
 const enabled=permitted&&!!packet&&available.fields.length>0&&!available.error;
 function clear(){setResult(null);setError('');}
 function preview(){
  if(!enabled||!packet)return;
  try{
   if(text.length>20000)throw Error('Candidate text size bound.');
   const parts=text.split(',').map(value=>value.trim());
   if(!text.trim()||parts.some(value=>!value))throw Error('Supply complete numeric candidates.');
   const next=previewPrivateSensitivity(packet,field,parts.map(Number));
   setResult(next);setError('');
  }catch{setError('Private sensitivity failed. Supply 1–25 finite numbers valid for the selected field and immutable contract. Earlier successful results, if present, remain unchanged.');}
 }
 return <section aria-label="Private what-if sensitivity"><h2>Private what-if sensitivity</h2><p>Choose one supplied numeric input and explicit candidate values. Each preview runs the same immutable private engine with a complete copied input. Original results, history, A/B/C captures and exports stay unchanged. No canonical acceptance or applicability approval is implied.</p>
 {!permitted&&<p>Private sensitivity previews require Pro or Business. Run contract remains available with identical mathematics on Free.</p>}
 {!packet&&<p>Run or restore a valid current contract before previewing.</p>}
 {packet&&!available.fields.length&&!available.error&&<p>No supplied top-level numeric fields are supported for this private profile. Nested inputs and exact decimal strings are not coerced.</p>}
 {available.error&&<p role="alert">{available.error}</p>}
 <label htmlFor={prefix+'-field'}>Private numeric input field</label><select id={prefix+'-field'} disabled={!enabled} value={field} onChange={event=>{setField(event.target.value);clear();}}>{available.fields.map(value=><option key={value} value={value}>{value}</option>)}</select>
 <label htmlFor={prefix+'-values'}>Private candidate values (comma-separated, maximum 25)</label><input id={prefix+'-values'} type="text" disabled={!enabled} maxLength={20000} value={text} onChange={event=>{setText(event.target.value);clear();}}/>
 <button type="button" disabled={!enabled} onClick={preview}>Preview private sensitivity</button><button type="button" disabled={!result&&!error} onClick={clear}>Clear private sensitivity</button>
 {error&&<p role="alert" aria-atomic="true">{error}</p>}
 {result&&<><p role="status" aria-atomic="true">Private sensitivity preview complete. {result.points.length} candidate results; original captures are unchanged. Differences use the original engine output scale; no unit conversion is applied.</p><div role="region" aria-label="Private sensitivity results" tabIndex={0} style={{overflowX:'auto'}}><table><caption>Private sensitivity preview</caption><thead><tr><th scope="col">{result.field}</th><th scope="col">Stored engine value</th><th scope="col">Difference from original</th></tr></thead><tbody>{result.points.map((point,index)=><tr key={index}><th scope="row">{String(point.inputValue)}</th><td>{String(point.value)}</td><td>{point.difference===null?'Numeric difference unavailable':String(point.difference)}</td></tr>)}</tbody></table></div>{result.points.map((point,index)=><details key={index}><summary>Complete private preview {index+1}</summary><pre>{JSON.stringify(point.packet,null,2)}</pre></details>)}</>}
 </section>;
}
