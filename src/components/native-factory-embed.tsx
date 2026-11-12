'use client';
import './calculator-factory-controls.css';
import {useRef,useState} from 'react';
import type {FactoryWorkbenchField} from './calculator-factory-workbench';
import type {runFactoryEmbedCalculation} from '@/lib/native-delivery/factory-embed-contract';
type Result=ReturnType<typeof runFactoryEmbedCalculation>;
/** The server executes the exact granted identity; the client sends only raw fields. */
export function NativeFactoryEmbed({grant,companyName,title,engineId,scope,fields}:{grant:string;companyName:string;title:string;engineId:string;scope:string;fields:readonly FactoryWorkbenchField[]}){
 const generation=useRef(0),[raw,setRaw]=useState<Record<string,string>>(()=>Object.fromEntries(fields.map(field=>[field.key,String(field.defaultValue??field.options?.[0]??'')]))),[busy,setBusy]=useState(false),[result,setResult]=useState<Result|null>(null),[error,setError]=useState('');
 function change(key:string,value:string){generation.current++;setRaw(old=>({...old,[key]:value}));setResult(null);setError('');}
 async function calculate(){if(busy)return;setBusy(true);setResult(null);setError('');const requestId=++generation.current;try{
  const response=await fetch('/api/native-embed/'+grant+'/calculate',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify(raw),signal:AbortSignal.timeout(10000)});
  const data=await response.json();if(!response.ok)throw Error(data.error??'Calculation unavailable');if(generation.current===requestId)setResult(data);
 }catch(cause){if(generation.current===requestId)setError(cause instanceof Error?cause.message:'Calculation unavailable');}finally{setBusy(false);}}
 return <section className="calculator-ui factory-delivery-controls" style={{padding:'1rem',overflowWrap:'anywhere'}}><p>{companyName}</p><h1>{title}</h1><p>CalcuMint · {engineId} · technical version1</p><p>{scope}</p>
 {fields.map(field=><label key={field.key}>{field.label}{field.options?<select value={raw[field.key]} onChange={event=>change(field.key,event.target.value)}>{field.options.map(code=><option key={code} value={code}>{field.optionLabels?.[code]??code}</option>)}</select>:<input value={raw[field.key]} onChange={event=>change(field.key,event.target.value)} inputMode="decimal" required maxLength={4096}/>}</label>)}
 <button type="button" disabled={busy} onClick={calculate}>{busy?'Calculating…':'Calculate'}</button>{error&&<p role="alert">{error}</p>}
 {result&&<div role="status"><h2>Native result</h2><p aria-label="Calculated value">{String(result.output.result)}{'unit' in result&&result.unit?' '+result.unit:''}</p><pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(result.output)}</pre><p>{result.limitations}</p>{'applicability' in result&&<p>{result.applicability}</p>}{'numericalPolicy' in result&&<p>{result.numericalPolicy}</p>}{'refusalPolicy' in result&&<p>{result.refusalPolicy}</p>}<h3>Methodology</h3>{result.methodology.map(formula=><p key={formula.id}>{formula.expression}</p>)}<h3>Sources</h3>{result.sources.map(source=><p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></p>)}{result.warnings.map(warning=><p key={warning}>{warning}</p>)}</div>}
 </section>;
}
