'use client';
import {useState} from 'react';
import {finalPrivateDiscovery,finalPrivateExamples,exportFinalPrivate,importFinalPrivate,finalPrivateHeadline,type FinalPrivateSnapshot} from '../calculators/final-private-workbench';
const json=(value:unknown)=>JSON.stringify(value,null,2);
/** Authenticated loopback review fixture; no public route or account storage. */
export function FinalPrivateWorkbench(){
 const [selected,setSelected]=useState(21),[search,setSearch]=useState(''),[plan,setPlan]=useState<'free'|'pro'|'business'>('free');
 const [input,setInput]=useState(json(finalPrivateExamples[21])),[importText,setImportText]=useState('');
 const [snapshot,setSnapshot]=useState<FinalPrivateSnapshot|null>(null),[history,setHistory]=useState<readonly FinalPrivateSnapshot[]>([]),[error,setError]=useState('');
 const current=finalPrivateDiscovery.find(r=>r.masterId===selected);
 const visible=finalPrivateDiscovery.filter(r=>`${r.masterId} ${r.title}`.toLowerCase().includes(search.toLowerCase().trim()));
 const invalidate=()=>{setSnapshot(null);setError('');};
 function choose(id:number){setSelected(id);setInput(finalPrivateExamples[id]?json(finalPrivateExamples[id]):'');invalidate();}
 function filter(value:string){setSearch(value);const rows=finalPrivateDiscovery.filter(r=>`${r.masterId} ${r.title}`.toLowerCase().includes(value.toLowerCase().trim()));if(!rows.some(r=>r.masterId===selected))choose(rows[0]?.masterId??-1);}
 function calculate(){invalidate();try{if(input.length>1_000_000)throw Error('Scenario size limit');setSnapshot(exportFinalPrivate(selected,JSON.parse(input),plan));}catch{setError('Check the selected scope, required fields, decimal-string or numeric units, identities, periods and numerical bounds.');}}
 function restore(s:FinalPrivateSnapshot){setSearch('');setSelected(s.masterId);setInput(json(s.payload.calculation.input));setSnapshot(s);setError('');}
 function importSnapshot(){invalidate();try{if(importText.length>8_000_000)throw Error('Snapshot size limit');restore(importFinalPrivate(JSON.parse(importText)));}catch{setError('Snapshot must match its pinned identity, source, version and actual engine result.');}}
 function download(){
  if(!snapshot)return;
  const url=URL.createObjectURL(new Blob([json(snapshot)+'\n'],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=`private-workbench-${snapshot.masterId}-v1.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <main style={{maxWidth:1000,margin:'auto',padding:16,fontFamily:'system-ui',overflowWrap:'anywhere'}}>
  <h1>Private calculator engineering workbench</h1>
  <p>RELEASE HOLD. 50 methodology identities; 29 supplied private profiles available. Canonical completed count: 0. Full-product, source-version, jurisdiction, provider, institutional and qualified applicability decisions remain unresolved.</p>
  <label htmlFor="workbench-search">Find calculator</label><br/><input id="workbench-search" value={search} onChange={e=>filter(e.target.value)} style={{width:'100%',boxSizing:'border-box',minHeight:44,fontSize:16}}/><br/>
  <label htmlFor="workbench-contract">Calculator identity</label><br/>
  <select id="workbench-contract" value={selected} onChange={e=>choose(Number(e.target.value))} style={{width:'100%',minHeight:44}}>{visible.map(r=><option key={r.masterId} value={r.masterId}>{r.masterId}: {r.title}{r.available?' — private supplied profile':' — blocked'}</option>)}</select>
  {!visible.length&&<p role="status">No matching calculator identity.</p>}
  <label htmlFor="workbench-plan">Review plan</label>{' '}<select id="workbench-plan" value={plan} onChange={e=>setPlan(e.target.value as typeof plan)} style={{minHeight:44}}><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option></select>
  <p>Identical mathematical engines and precision across plans. Synthetic review selection does not prove subscription-provider acceptance.</p>
  {current&&<><h2>{current.masterId}: {current.title}</h2><h3>Methodology, units and boundaries</h3><p style={{whiteSpace:'pre-wrap'}}>{current.methodology}</p>
   {!current.available&&<p role="status">Blocked: no selected engineering profile here. Retained candidates do not supply missing governing policy.</p>}
   <details><summary>Sources and unclosed decisions</summary><ul>{current.sources.map(s=><li key={s.label}><a href={s.url}>{s.label}</a><p>{s.note}</p></li>)}</ul><ul>{current.remainingGaps.map((gap,i)=><li key={i}>{gap}</li>)}</ul></details>
   {current.available&&<><label htmlFor="workbench-json">Scenario JSON</label><br/><textarea id="workbench-json" value={input} rows={16} spellCheck={false} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={e=>{setInput(e.target.value);invalidate();}}/>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBlock:12}}><button type="button" onClick={calculate}>Calculate</button><button type="button" onClick={()=>choose(selected)}>Load example</button></div></>}
  </>}
  {error&&<p role="alert">{error}</p>}
  <section aria-label="Result" aria-live="polite">{snapshot&&<><h2>Private scenario result</h2><output data-testid="workbench-result">{finalPrivateHeadline(snapshot)}</output><p>Interpret this value using the selected method. Full quantities, events and traces follow. New exact profiles use numerator/denominator pairs without invoice rounding; preserved engines retain their original output formats.</p><pre data-testid="workbench-output" style={{whiteSpace:'pre-wrap'}}>{json(snapshot.payload.calculation.output)}</pre><button type="button" onClick={()=>setHistory(h=>[snapshot,...h].slice(0,20))}>Save scenario</button>{' '}<button type="button" onClick={download}>Export JSON</button></>}</section>
  <h2>Saved scenarios</h2><p>Up to 20 detached snapshots in this tab only. Restore a scenario to compare assumptions; no account write or persistent browser storage.</p><button type="button" onClick={()=>setHistory([])}>Clear scenarios</button>
  <ol data-testid="workbench-history">{history.map((s,i)=><li key={i}><details><summary>{s.masterId}: {s.payload.calculation.calculatorSlug} v{s.payload.calculation.calculatorVersion} — {finalPrivateHeadline(s)}</summary><pre style={{whiteSpace:'pre-wrap'}}>{json(s)}</pre></details><button type="button" onClick={()=>restore(s)}>Restore scenario {i+1}</button></li>)}</ol>
  <h2>Replay a downloaded snapshot</h2><label htmlFor="workbench-import">Snapshot JSON</label><br/><textarea id="workbench-import" rows={5} value={importText} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={e=>setImportText(e.target.value)}/><button type="button" onClick={importSnapshot}>Verify and restore snapshot</button>
  <style>{'button{min-height:44px;padding:8px 12px} :focus-visible{outline:3px solid #1259c3;outline-offset:2px} a{color:#0645ad}'}</style>
 </main>;
}
