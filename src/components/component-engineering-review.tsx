'use client';
import {useState} from 'react';
import inventory from '../../docs/cloud-batch08/discovery.json';
import {componentContracts,componentExamples,exportComponentContract,importComponentContract} from '../calculators/component-contracts';
type Snapshot=ReturnType<typeof exportComponentContract>;
const json=(v:unknown)=>JSON.stringify(v,null,2);
const matches=(r:{masterId:number;title:string;domain:string},q:string)=>/^\d+$/.test(q.trim())?String(r.masterId)===q.trim():`${r.masterId} ${r.title} ${r.domain}`.toLowerCase().includes(q.trim().toLowerCase());
export function ComponentEngineeringReview(){
 const [id,setId]=useState(3),[search,setSearch]=useState(''),[filter,setFilter]=useState('ALL'),[plan,setPlan]=useState<'free'|'pro'|'business'>('free');
 const [input,setInput]=useState(json(componentExamples[3])),[snapshot,setSnapshot]=useState<Snapshot|null>(null),[history,setHistory]=useState<readonly Snapshot[]>([]),[error,setError]=useState(''),[importText,setImportText]=useState('');
 const rows=inventory.rows.filter(r=>matches(r,search)&&(filter==='ALL'||r.implementationClass===filter));
 const row=inventory.rows.find(r=>r.masterId===id),definition=componentContracts.find(d=>d.id===`private.component.${id}`);
 const invalidate=()=>{setSnapshot(null);setError('');};
 function choose(n:number){setId(n);setInput(componentExamples[n]?json(componentExamples[n]):'');invalidate();}
 function find(q:string,c=filter){setSearch(q);setFilter(c);const visible=inventory.rows.filter(r=>matches(r,q)&&(c==='ALL'||r.implementationClass===c));if(!visible.some(r=>r.masterId===id))choose(visible[0]?.masterId??-1);}
 function calculate(){invalidate();try{if(input.length>1_000_000)throw Error('Scenario size limit');setSnapshot(exportComponentContract(id,JSON.parse(input),plan));}catch{setError('Check the required supplied loan or named-unit scope, units, denominators, membership, identities and numerical bounds.');}}
 function restore(s:Snapshot){setSearch('');setFilter('ALL');setId(s.masterId);setInput(json(s.calculation.input));setSnapshot(s);setError('');}
 function replay(){invalidate();try{if(importText.length>8_000_000)throw Error('Snapshot size limit');restore(importComponentContract(JSON.parse(importText)));}catch{setError('Snapshot must match its selected identity, evidence, dependency versions and actual engine output.');}}
 function download(){if(!snapshot)return;const url=URL.createObjectURL(new Blob([json(snapshot)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`private-component-${snapshot.masterId}-v1.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const headline=(s:Snapshot)=>s.calculation.output.value===null?'No positive monthly payment savings':String(s.calculation.output.value);
 return <main style={{maxWidth:1000,margin:'auto',padding:16,fontFamily:'system-ui',overflowWrap:'anywhere'}}>
  <h1>540-calculator engineering reconciliation</h1><p>RELEASE HOLD. Technical implementation classes do not approve canonical identities, certification or publication. Current public publication and protected certification remain UNKNOWN.</p>
  <p>{inventory.summary.classes.REGISTERED_IMPLEMENTED} registered-backed; {inventory.summary.classes.PRIVATE_COMPLETE} complete bounded private scopes; {inventory.summary.classes.COMPONENT_ONLY} component-only; {inventory.summary.classes.CONTRACT_BLOCKED} contract-blocked. No currently proven missing engine. Canonical mappings approved: 0.</p>
  <p><a href="/docs/cloud-batch08/implementation-manifest.json" download>Download full machine-readable inventory</a>{' · '}<a href="/docs/cloud-batch08/implementation-manifest.csv" download>Download inventory CSV</a></p>
  <label htmlFor="catalog-search">Find catalog identity</label><br/><input id="catalog-search" value={search} onChange={e=>find(e.target.value)} style={{width:'100%',boxSizing:'border-box',minHeight:44,fontSize:16}}/>
  <label htmlFor="catalog-class">Implementation class</label>{' '}<select id="catalog-class" value={filter} onChange={e=>find(search,e.target.value)} style={{maxWidth:'100%',minHeight:44}}><option value="ALL">ALL</option>{Object.keys(inventory.summary.classes).map(c=><option key={c} value={c}>{c}</option>)}</select><br/>
  <label htmlFor="catalog-identity">Catalog identity</label><br/><select id="catalog-identity" value={id} onChange={e=>choose(Number(e.target.value))} style={{width:'100%',minHeight:44}}>{rows.map(r=><option key={r.masterId} value={r.masterId}>{r.masterId}: {r.title}</option>)}</select>
  {!rows.length&&<p role="status">No matching identity.</p>}
  {row&&<><h2>{row.masterId}: {row.title}</h2><p data-testid="identity-status">{row.domain} · {row.implementationClass} · Current publication: UNKNOWN · Canonical mapping: unapproved</p><p>{row.nextAction}</p>
   {!definition&&<p role="status">This inventory row is inspectable. Its prior implementation or unresolved contract remains in the pinned evidence; this fixture calculates only the 25 new loan and conversion contracts.</p>}
  </>}
  {definition&&<><h3>Private scoped methodology and units</h3><p>{definition.formulas[0].expression}</p><p>{definition.formulas[0].description}</p><details><summary>Method/source references</summary><ul>{definition.sources.map((s,i)=><li key={i}>{s.url?<a href={s.url}>{s.label}</a>:s.label}<p>{s.note}</p></li>)}</ul></details>
   <label htmlFor="component-plan">Review plan</label>{' '}<select id="component-plan" value={plan} onChange={e=>setPlan(e.target.value as typeof plan)} style={{minHeight:44}}><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option></select><p>Same mathematical engine and precision for all plans. Review selection does not prove subscription-provider acceptance.</p>
   <label htmlFor="component-json">Scenario JSON</label><br/><textarea id="component-json" rows={13} value={input} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={e=>{setInput(e.target.value);invalidate();}}/>
   <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBlock:12}}><button type="button" onClick={calculate}>Calculate</button><button type="button" onClick={()=>choose(id)}>Load example</button></div>
  </>}
  {error&&<p role="alert">{error}</p>}
  <section aria-label="Result" aria-live="polite">{snapshot&&<><h2>Scoped result</h2><output data-testid="component-result">{headline(snapshot)}</output><p>Unit: {String(snapshot.calculation.output.unit)}. Full intermediate values and actual immutable dependency runs follow.</p><pre data-testid="component-output" style={{whiteSpace:'pre-wrap'}}>{json(snapshot.calculation.output)}</pre><button type="button" onClick={()=>setHistory(h=>[snapshot,...h].slice(0,20))}>Save scenario</button>{' '}<button type="button" onClick={download}>Export JSON</button></>}</section>
  <h2>Tab-local scenarios</h2><p>Up to 20 detached snapshots; no account API or persistent browser storage.</p><button type="button" onClick={()=>setHistory([])}>Clear scenarios</button><ol data-testid="component-history">{history.map((s,i)=><li key={i}><details><summary>{s.masterId}: {s.calculation.calculatorSlug} v1 — {headline(s)}</summary><pre style={{whiteSpace:'pre-wrap'}}>{json(s)}</pre></details><button type="button" onClick={()=>restore(s)}>Restore scenario {i+1}</button></li>)}</ol>
  <h2>Verify downloaded snapshot</h2><label htmlFor="component-import">Snapshot JSON</label><br/><textarea id="component-import" value={importText} rows={5} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={e=>setImportText(e.target.value)}/><button type="button" onClick={replay}>Verify and restore snapshot</button>
  <style>{'button{min-height:44px;padding:8px 12px} :focus-visible{outline:3px solid #1259c3;outline-offset:2px} a{color:#0645ad}'}</style>
 </main>;
}
