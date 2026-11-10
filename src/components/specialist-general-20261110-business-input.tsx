'use client';
import {useId,useState} from 'react';
import {businessExamples,exportBusinessContract} from '../calculators/business-contracts';
import {businessDraft,businessFieldLabel,calculateBusinessDraft,type BusinessDraft,type GuidedBusinessId} from '../lib/specialist-general-20261110-business-input';

type Props={id:GuidedBusinessId;draft:BusinessDraft;plan?:'free'|'pro'|'business';onChange:(draft:BusinessDraft)=>void;onCalculate:(snapshot:ReturnType<typeof exportBusinessContract>)=>void};
/** Controlled draft: parent invalidates its current result on every onChange. */
export function GuidedBusinessInputs({id,draft,plan='free',onChange,onCalculate}:Props){
 const prefix=useId();const [errors,setErrors]=useState<Record<string,string>>({});
 return <section aria-label="Guided business inputs"><h3>Guided scenario fields</h3>
 <p>Supplied business amounts only. Use one currency, period and measurement basis. No accounting, tax or source applicability approval.</p>
 <form noValidate onSubmit={event=>{event.preventDefault();const result=calculateBusinessDraft(id,draft,plan);setErrors(result.errors);if(result.snapshot)onCalculate(result.snapshot);}}>
 {Object.entries(businessExamples[id]).filter(([key])=>key!=='scope').map(([key,example])=>{
  const field=`${prefix}-${key}`,error=`${field}-error`;
  return <div key={key}><label htmlFor={field}>{businessFieldLabel(key)}</label><input id={field} type="text" inputMode={typeof example==='number'?'decimal':undefined} value={draft[key]??''} required aria-invalid={!!errors[key]} aria-describedby={errors[key]?error:undefined} onChange={event=>{setErrors({});onChange({...draft,[key]:event.target.value});}} style={{display:'block',width:'100%',minHeight:44,boxSizing:'border-box'}}/>{errors[key]&&<p id={error}>{errors[key]}</p>}</div>;
 })}
 <p>Scope: supplied-business-no-policy (fixed)</p>
 {Object.keys(errors).length>0&&<p role="alert">{errors.contract??errors.scope??'Correct the marked fields before calculating.'}</p>}
 <button type="submit" style={{minHeight:44}}>Calculate guided scenario</button>
 </form></section>;
}

/** Mount with key={id + scenarioJson}; JSON edits/restores then replace the draft. */
export function GuidedBusinessWorkspace({id,input,plan,onInvalidate,onCalculate}:{id:GuidedBusinessId;input:Record<string,unknown>;plan:'free'|'pro'|'business';onInvalidate:()=>void;onCalculate:Props['onCalculate']}){
 const [draft,setDraft]=useState(()=>businessDraft(id,input));
 return <GuidedBusinessInputs id={id} draft={draft} plan={plan} onChange={next=>{setDraft(next);onInvalidate();}} onCalculate={onCalculate}/>;
}
