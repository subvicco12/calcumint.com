'use client';
import {useEffect,useRef,useState} from 'react';
import {getReviewerCalculator} from '@/calculators/reviewer-definitions';
import {reviewerFields,parseReviewerFields,calculateReviewerPreview} from '@/lib/calculator-review-preview';
import {serializeCalculationJson,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {serializeCalculationCsv,serializeCalculationPdf} from '@/lib/calculation-export';
export function CalculatorReviewWorkbench({slug}:{slug:string}){
 const [exampleIndex,setExampleIndex]=useState(0);
 const definition=getReviewerCalculator(slug),example=definition&&reviewerFields(definition,exampleIndex);
 const initial=()=>Object.fromEntries(Object.entries(example??{}).map(([key,value])=>[key,typeof value==='string'?value:JSON.stringify(value)]));
 const [draft,setDraft]=useState<Record<string,string>>(initial),[snapshot,setSnapshot]=useState<CalculationSnapshot>(),[error,setError]=useState<string>();
 const alert=useRef<HTMLParagraphElement>(null);useEffect(()=>{if(error)alert.current?.focus();},[error]);
 if(!definition)return <p role="alert">Preview unavailable.</p>;
 function download(format:'JSON'|'CSV'|'PDF'){
  if(!snapshot||!definition)return;
  try{
   const body=format==='JSON'?serializeCalculationJson(snapshot):format==='CSV'?serializeCalculationCsv(snapshot.input,snapshot.output):new Uint8Array(serializeCalculationPdf(snapshot,{title:`Private reviewer evidence: ${definition.title}`,formulas:definition.formulas,sources:definition.sources,methodology:'Unpublished engine contract preview. Not specialist approval or publication authorization.'})).buffer;
   const url=URL.createObjectURL(new Blob([body],{type:format==='JSON'?'application/json':format==='CSV'?'text/csv;charset=utf-8':'application/pdf'}));
   const a=document.createElement('a');a.href=url;a.download=`review-${slug}-v${snapshot.calculatorVersion}.${format.toLowerCase()}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{setError('Export could not be completed. Retry or use the complete engine output.');}
 }
 return <section style={{minWidth:0,overflowWrap:'anywhere'}} aria-label="Engine contract preview"><h2>Engine contract preview</h2><p>Version {definition.version} · repository review state: {definition.reviewStatus}. These are engine inputs and raw outputs for authorized testing, not specialist approval or a public release.</p>
 {definition.examples.length>1&&<label className="field">Example and calculation mode<select value={exampleIndex} onChange={e=>{const index=Number(e.target.value),fields=reviewerFields(definition,index);setExampleIndex(index);setDraft(Object.fromEntries(Object.entries(fields??{}).map(([key,value])=>[key,typeof value==='string'?value:JSON.stringify(value)])));setSnapshot(undefined);setError(undefined);}}>{definition.examples.map((e,index)=><option key={index} value={index}>{e.label}</option>)}</select></label>}
 {example?<form onSubmit={e=>{e.preventDefault();setSnapshot(undefined);setError(undefined);try{setSnapshot(calculateReviewerPreview(definition,parseReviewerFields(example,draft)));}catch{setError('Input does not satisfy this engine contract. Check every field and retry.');}}}>
 <div className="field-grid">{Object.entries(example).map(([key,value])=><label className="field" key={key}><span>{key}</span>{value!==null&&typeof value==='object'?<textarea aria-label={key} rows={5} value={draft[key]} maxLength={100000} onChange={e=>{setDraft({...draft,[key]:e.target.value});setSnapshot(undefined);setError(undefined);}}/>:<input aria-label={key} inputMode={typeof value==='number'?'decimal':'text'} value={draft[key]} maxLength={10000} onChange={e=>{setDraft({...draft,[key]:e.target.value});setSnapshot(undefined);setError(undefined);}}/>}<small>{typeof value==='number'?'Finite number; use the exact engine field units.':typeof value==='string'?'Text; exact engine choices and formats apply.':'JSON; preserve the engine structure.'}</small></label>)}</div><button type="submit">Calculate preview</button>{' '}<button type="button" onClick={()=>{setDraft(initial());setSnapshot(undefined);setError(undefined);}}>Reset example</button></form>:<p role="alert">No example-backed input form is available. A reviewed input adapter and example are required; no inputs or result have been fabricated.</p>}
 {error&&<p role="alert" tabIndex={-1} ref={alert}>{error}</p>}
 {snapshot&&<section><h3>Complete engine output</h3><pre aria-label="Complete engine output" style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{JSON.stringify(snapshot.output,null,2)}</pre><p role="status">Calculated with {snapshot.calculatorSlug}, version {snapshot.calculatorVersion}.</p>{(['JSON','CSV','PDF'] as const).map(format=><button key={format} type="button" onClick={()=>download(format)}>Download reviewer {format}</button>)}</section>}
 <h3>Methodology</h3>{definition.formulas.map(f=><div key={f.id}><code>{f.expression}</code><p>{f.description}</p></div>)}<h3>Sources</h3>{definition.sources.length?<ul>{definition.sources.map((s,i)=><li key={i}>{s.url?<a href={s.url} rel="noopener noreferrer" target="_blank">{s.label}</a>:s.label}{s.note&&<p>{s.note}</p>}</li>)}</ul>:<p>Source evidence is missing; this engine is not ready for certification.</p>}
 </section>;
}
