'use client';
import {useState} from 'react';
import {financialContracts,financialExamples,exportFinancialContract} from '../calculators/financial-contracts';

type Snapshot=ReturnType<typeof exportFinancialContract>;
const json=(value:unknown)=>JSON.stringify(value,null,2);
function headline(s:Snapshot){
 const o=s.calculation.output;
 if('comparison' in o)return String((o.comparison as {difference:number}).difference);
 if(s.profileId==='private.financial.43'||s.profileId==='private.financial.46')return String(o.profit);
 if('withinSuppliedBudget' in o)return o.withinSuppliedBudget?'Within supplied budget':'Over supplied budget';
 return String(o.totalOwnerCashflow);
}
/** Private loopback review only. No account API, public route or persistent store. */
export function FinancialContractReview(){
 const [id,setId]=useState(financialContracts[0].id),[plan,setPlan]=useState<'free'|'pro'|'business'>('free');
 const [input,setInput]=useState(json(financialExamples[id]));
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[history,setHistory]=useState<readonly Snapshot[]>([]),[error,setError]=useState('');
 const d=financialContracts.find(d=>d.id===id)!;
 const invalidate=()=>{setSnapshot(null);setError('');};
 const load=(next=id)=>{setInput(json(financialExamples[next]));invalidate();};
 function calculate(){invalidate();try{if(input.length>1_000_000)throw Error('Input too large');setSnapshot(exportFinancialContract(id,JSON.parse(input),plan));}catch{setError('Check the required fields, supplied scope, matched horizons, financing principal, rent losses and supported numerical bounds.');}}
 function download(){
  if(!snapshot)return;
  const url=URL.createObjectURL(new Blob([json(snapshot)+'\n'],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=snapshot.calculation.calculatorSlug+'-v1.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <main style={{maxWidth:1000,margin:'auto',padding:16,fontFamily:'system-ui',overflowWrap:'anywhere'}}>
  <h1>Private financial calculator contracts</h1>
  <p>RELEASE HOLD. No canonical completion, certification, publication or qualified applicability approval. These supplied scenarios do not determine tax, lender eligibility or current source rules.</p>
  <label htmlFor="financial-contract">Calculator contract</label><br/>
  <select id="financial-contract" value={id} onChange={e=>{setId(e.target.value);load(e.target.value);}} style={{maxWidth:'100%',minHeight:44}}>{financialContracts.map(d=><option key={d.id} value={d.id}>{d.title}</option>)}</select><br/>
  <label htmlFor="review-plan">Review plan</label>{' '}
  <select id="review-plan" value={plan} onChange={e=>setPlan(e.target.value as typeof plan)} style={{minHeight:44}}><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option></select>
  <p>All plans use the same mathematics and precision. Review selection is a synthetic parity check, not subscription-provider acceptance.</p>
  <h2>Methodology and numerical boundaries</h2><p>{d.formulas[0].description}</p>
  <p>Money inputs: 0 to 1 trillion; per-period fractional rates: 0 to 1. Up to 600 periods and 20 existing loans. Cashflows occur at explicit period boundaries. Outputs are unrounded finite engineering quantities in the supplied currency, with full financing and cashflow traces. No annualization is inferred.</p>
  <details><summary>Source observations and remaining authority limits</summary><ul>{d.sources.map(s=><li key={s.url}><a href={s.url}>{s.label}</a><p>{s.note}</p></li>)}</ul></details>
  <label htmlFor="financial-json">Scenario JSON</label><br/>
  <textarea id="financial-json" value={input} rows={18} spellCheck={false} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={e=>{setInput(e.target.value);invalidate();}}/>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBlock:12}}><button type="button" onClick={calculate}>Calculate</button><button type="button" onClick={()=>load()}>Load example</button></div>
  {error&&<p role="alert">{error}</p>}
  <section aria-label="Result" aria-live="polite">{snapshot&&<>
   <h2>Scenario result</h2><output data-testid="financial-result">{headline(snapshot)}</output>
   <p>Comparison: left present cost minus right present cost. Rental: owner cashflow; ROI/flip: profit. Budget: supplied limits only. Read the selected methodology and full trace below.</p>
   <pre data-testid="financial-output" style={{whiteSpace:'pre-wrap'}}>{json(snapshot.calculation.output)}</pre>
   <button type="button" onClick={()=>setHistory(h=>[snapshot,...h].slice(0,20))}>Save local snapshot</button>{' '}
   <button type="button" onClick={download}>Export JSON</button>
  </>}</section>
  <h2>Tab-local history</h2><p>Up to 20 detached snapshots; no account write or persistent browser storage.</p>
  <button type="button" onClick={()=>setHistory([])}>Clear local history</button>
  <ol data-testid="financial-history">{history.map((s,i)=><li key={i}><details><summary>{s.calculation.calculatorSlug} v1 — {headline(s)}</summary><pre style={{whiteSpace:'pre-wrap'}}>{json(s)}</pre></details></li>)}</ol>
  <style>{'button{min-height:44px;padding:8px 12px} :focus-visible{outline:3px solid #1259c3;outline-offset:2px} a{color:#0645ad}'}</style>
 </main>;
}
