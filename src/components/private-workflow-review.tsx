'use client';

import {useState} from 'react';
import {privateWorkflowDefinitions,exportPrivateWorkflow} from '../calculators/private-scenario-workflows';

type Snapshot=ReturnType<typeof exportPrivateWorkflow>;
const examples:Readonly<Record<string,Record<string,unknown>>>=Object.freeze({
 'private.workflow.disclosed-lease':{currency:'USD',period:'month',capitalized:18800,residual:12350,rentCharge:5295,payments:48,disclosedChargePerPayment:12.25},
 'private.workflow.heat-costs':{currency:'USD',period:'year',usefulHeatKWh:10000,baselineEfficiency:1,scop:4,baselinePricePerKWh:0.1,heatPumpPricePerKWh:0.3,auxiliaryKWh:100},
 'private.workflow.target-trajectory':{currency:'USD',period:'month',initial:100,initialTarget:150,timing:'end',steps:[{rate:0,cashflow:25,target:150},{rate:0,cashflow:25,target:150}]},
});
const json=(value:unknown)=>JSON.stringify(value,null,2);

/** Private loopback fixture only. No account API, storage or lifecycle authority. */
export function PrivateWorkflowReview(){
 const [id,setId]=useState(privateWorkflowDefinitions[0].id);
 const [input,setInput]=useState(json(examples[id]));
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
 const [history,setHistory]=useState<readonly Snapshot[]>([]);
 const [error,setError]=useState('');
 const definition=privateWorkflowDefinitions.find(d=>d.id===id)!;
 const invalidate=()=>{setSnapshot(null);setError('');};
 function loadExample(nextId=id){setInput(json(examples[nextId]));invalidate();}
 function calculate(){
  invalidate();
  try{
   if(input.length>2_000_000)throw Error('Scenario exceeds reviewer size limit');
   setSnapshot(exportPrivateWorkflow(id,JSON.parse(input)));
  }catch{setError('Check the scenario JSON, required fields, units and supported finite bounds.');}
 }
 function download(){
  if(!snapshot)return;
  const url=URL.createObjectURL(new Blob([json(snapshot)+'\n'],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=`${snapshot.calculation.calculatorSlug}-v${snapshot.calculation.calculatorVersion}.json`;
  document.body.append(link);link.click();link.remove();
  // Release after the browser has consumed the download navigation.
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <main style={{maxWidth:960,margin:'auto',padding:16,fontFamily:'system-ui',overflowWrap:'anywhere'}}>
  <h1>Private supplied scenario review</h1>
  <p>RELEASE HOLD. Engineering scenarios only; not canonical calculator acceptance, certification or publication.</p>
  <p>No provider, jurisdiction, eligibility, invoice rounding or retirement safety is inferred. Values are unrounded. History lasts only in this tab.</p>
  <label htmlFor="workflow">Workflow</label><br/>
  <select id="workflow" value={id} style={{maxWidth:'100%',minHeight:44}} onChange={event=>{setId(event.target.value);loadExample(event.target.value);}}>
   {privateWorkflowDefinitions.map(d=><option key={d.id} value={d.id}>{d.title}</option>)}
  </select>
  <h2>Methodology</h2>
  <p>{definition.formulas[0].description}</p>
  <p>Source: <a href={definition.sources[0].url} rel="noreferrer">{definition.sources[0].label}</a>. Archived observations are limited evidence; applicability remains pending.</p>
  <label htmlFor="scenario-json">Scenario JSON</label><br/>
  <textarea id="scenario-json" value={input} spellCheck={false} rows={16} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={event=>{setInput(event.target.value);invalidate();}}/>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBlock:12}}>
   <button type="button" onClick={calculate}>Calculate</button>
   <button type="button" onClick={()=>loadExample()}>Load example</button>
  </div>
  {error&&<p role="alert">{error}</p>}
  <section aria-live="polite" aria-label="Calculation result">
   {snapshot&&<><h2>Result — version {snapshot.calculation.calculatorVersion}</h2>
    <pre data-testid="workflow-output" style={{whiteSpace:'pre-wrap'}}>{json(snapshot.calculation.output)}</pre>
    <button type="button" onClick={()=>setHistory(current=>[snapshot,...current].slice(0,20))}>Save local snapshot</button>{' '}
    <button type="button" onClick={download}>Export JSON</button>
   </>}
  </section>
  <h2>Local history</h2><p>Up to 20 detached snapshots. Clearing or reloading this tab removes them.</p>
  <button type="button" onClick={()=>setHistory([])}>Clear local history</button>
  <ol data-testid="local-history">{history.map((saved,index)=><li key={index}>
   <p>{saved.calculation.calculatorSlug} v{saved.calculation.calculatorVersion}</p>
   <details><summary>Saved input and result {index+1}</summary><pre style={{whiteSpace:'pre-wrap'}}>{json(saved)}</pre></details>
  </li>)}</ol>
  <style>{'button {min-height:44px;padding:8px 12px} :focus-visible {outline:3px solid #1259c3;outline-offset:2px} a {color:#0645ad}'}</style>
 </main>;
}
