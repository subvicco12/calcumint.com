'use client';
import {useState} from 'react';
import {sourceBoundProfiles} from '../calculators/source-bound-profiles';
import {exportSourceProfile,type ReviewPlan} from '../calculators/source-profile-snapshot';
import {formatRational,type Rational} from '../calculators/exact-rational';

type Snapshot=ReturnType<typeof exportSourceProfile>;
const examples:Readonly<Record<string,Record<string,unknown>>>=Object.freeze({
 'private.profile.stanford-transcript-gpa':{policySnapshot:'2026-10-28',gradingEra:'autumn-2014-or-later',studentCareer:'undergraduate',transcriptStatus:'registrar-resolved',rows:[{recordId:'x',grade:'B-',units:'3',gradingSystem:'general'},{recordId:'y',grade:'A-',units:'4',gradingSystem:'general'},{recordId:'z',grade:'B+',units:'3',gradingSystem:'general'}]},
 'private.profile.nz-gst-prices':{policySnapshot:'2026-10-28',currency:'NZD',lines:[{id:'headphones',amount:'100',priceBasis:'exclusive',classification:'standard'}]},
 'private.profile.assessment-levies':{methodSnapshot:'2026-10-28',currency:'USD',assessmentYear:2026,levies:[{id:'town',jurisdiction:'Town A example',assessedValue:'175000',grantedExemptions:'25000',ratePerThousand:'50'}]},
});
const json=(v:unknown)=>JSON.stringify(v,null,2);
function headline(snapshot:Snapshot):string{
 const out=snapshot.calculation.output;
 const quantity=('gpa' in out?out.gpa:'gst' in out?out.gst:out.totalTax) as Rational|null;
 return quantity===null?'No graded units':formatRational(quantity);
}
/** Isolated engineering UI; no account provider, persistent storage or public route. */
export function SourceProfileReview(){
 const [id,setId]=useState(sourceBoundProfiles[0].id),[plan,setPlan]=useState<ReviewPlan>('free');
 const [input,setInput]=useState(json(examples[id])),[snapshot,setSnapshot]=useState<Snapshot|null>(null);
 const [history,setHistory]=useState<readonly Snapshot[]>([]),[error,setError]=useState('');
 const definition=sourceBoundProfiles.find(d=>d.id===id)!;
 const invalidate=()=>{setSnapshot(null);setError('');};
 const load=(next=id)=>{setInput(json(examples[next]));invalidate();};
 function calculate(){invalidate();try{if(input.length>1_000_000)throw Error('Size limit');setSnapshot(exportSourceProfile(id,JSON.parse(input),plan));}catch{setError('Check the required profile, decimal strings, classification, record identities and supported bounds.');}}
 function download(){
  if(!snapshot)return;
  const url=URL.createObjectURL(new Blob([json(snapshot)+'\n'],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=snapshot.calculation.calculatorSlug+'-v1.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <main style={{maxWidth:1000,margin:'auto',padding:16,fontFamily:'system-ui',overflowWrap:'anywhere'}}>
  <h1>Source-bound private calculator review</h1>
  <p>RELEASE HOLD. No canonical acceptance, certification or publication. This is a private source-snapshot profile, not a determination of eligibility or current legal applicability.</p>
  <p>Decimal strings preserve exact arithmetic. Outputs use exact numerator/denominator pairs; nonterminating values remain fractions. No invoice or institutional display rounding is inferred.</p>
  <label htmlFor="profile">Profile</label><br/>
  <select id="profile" value={id} onChange={e=>{setId(e.target.value);load(e.target.value);}} style={{maxWidth:'100%',minHeight:44}}>{sourceBoundProfiles.map(d=><option value={d.id} key={d.id}>{d.title}</option>)}</select><br/>
  <label htmlFor="review-plan">Review plan</label>{' '}
  <select id="review-plan" value={plan} onChange={e=>setPlan(e.target.value as ReviewPlan)} style={{minHeight:44}}><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option></select>
  <p>Plan selection is a synthetic parity check, not authenticated subscription acceptance. The same mathematical contract applies to every plan.</p>
  <h2>Methodology and scope</h2><p>{definition.formulas[0].description}</p>
  <ul>{definition.sources.map(source=><li key={source.label}><a href={source.url} rel="noreferrer">{source.label}</a><p>{source.note}</p></li>)}</ul>
  <label htmlFor="source-json">Scenario JSON</label><br/>
  <textarea id="source-json" value={input} rows={18} spellCheck={false} style={{width:'100%',boxSizing:'border-box',fontSize:16}} onChange={e=>{setInput(e.target.value);invalidate();}}/>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBlock:12}}><button type="button" onClick={calculate}>Calculate</button><button type="button" onClick={()=>load()}>Load example</button></div>
  {error&&<p role="alert">{error}</p>}
  <section aria-label="Result" aria-live="polite">{snapshot&&<>
   <h2>Exact result</h2><output data-testid="exact-result">{headline(snapshot)}</output>
   <p>GPA points, GST dollars or levy-tax dollars, according to the selected profile.</p>
   <pre data-testid="profile-output" style={{whiteSpace:'pre-wrap'}}>{json(snapshot.calculation.output)}</pre>
   <button type="button" onClick={()=>setHistory(h=>[snapshot,...h].slice(0,20))}>Save local snapshot</button>{' '}
   <button type="button" onClick={download}>Export JSON</button>
  </>}</section>
  <h2>Local history</h2><p>Up to 20 detached snapshots, retained only in this tab.</p>
  <button type="button" onClick={()=>setHistory([])}>Clear local history</button>
  <ol data-testid="source-history">{history.map((s,i)=><li key={i}><details><summary>{s.calculation.calculatorSlug} v1 — {headline(s)}</summary><pre style={{whiteSpace:'pre-wrap'}}>{json(s)}</pre></details></li>)}</ol>
  <style>{'button{min-height:44px;padding:8px 12px} :focus-visible{outline:3px solid #1259c3;outline-offset:2px} a{color:#0645ad}'}</style>
 </main>;
}
