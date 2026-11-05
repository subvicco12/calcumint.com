"use client";

import {useId,useMemo,useState} from 'react';
import {getLaunchSpec,launchDefinition} from '@/calculators/launch-portfolio';
import {runCalculator} from '@/calculators/engine';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {CalculatorAccountActions} from '@/components/calculator-account-actions';
import {AiResultExplanation} from './ai-result-explanation';

/** Caller-only recovery and feedback. Registered v1 schemas and mathematics are unchanged. */
export function RegisteredLaunchTool({slug}:{slug:string}){
 const spec=getLaunchSpec(slug)!;
 const definition=useMemo(()=>launchDefinition(spec),[spec]);
 const [values,setValues]=useState<Record<string,string>>(()=>Object.fromEntries(spec.fields.map(field=>[field.key,String(field.defaultValue)])));
 const input=useMemo(()=>Object.fromEntries(spec.fields.map(field=>[field.key,requiredCalculatorNumber(values[field.key])])),[spec,values]);
 const parsed=definition.inputSchema.safeParse(input);
 const fieldErrors=new Map<string,string>();
 if(!parsed.success)for(const issue of parsed.error.issues){
  const key=String(issue.path[0]),field=spec.fields.find(field=>field.key===key);
  if(!field||fieldErrors.has(key))continue;
  fieldErrors.set(key,`${field.label}: ${values[key]?.trim()===''?'Enter a value.':!Number.isFinite(input[key])?'Enter a finite decimal value without losing entered digits.':issue.message}`);
 }
 let result:number|null=null;
 if(parsed.success)try{const value=runCalculator(definition,input).output.result;result=Number.isFinite(value)?value:null;}catch{/* Refuse invalid/nonfinite output and all save/export actions. */}
 const displayValue=result!==null&&spec.formatResult?spec.formatResult(input,result):undefined;
 const prefix=useId();
 return <div className="calculator-ui">
  <div className="field-grid">{spec.fields.map(field=>{
   const error=fieldErrors.get(field.key),errorId=`${prefix}-${field.key}-error`;
   return <div key={field.key}><label className="field"><span>{field.label}</span>
    <input type="number" inputMode={field.integer?'numeric':'decimal'} min={field.min} max={field.max} step={field.integer?1:'any'} required value={values[field.key]??''} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} onChange={event=>setValues(current=>({...current,[field.key]:event.target.value}))}/>
   </label>{error&&<p id={errorId} className="muted-copy">{error}</p>}</div>;
  })}</div>
  <div className="result-box" aria-live="polite"><span>Result</span><strong>{result===null?'Enter valid inputs':displayValue??result.toLocaleString(undefined,{maximumFractionDigits:12})}</strong></div>
  {result===null&&<p role="alert">Enter valid inputs in the supported ranges. {parsed.success?'The result cannot be represented as a finite number.':'Correct the fields identified above.'}</p>}
  <CalculatorAccountActions calculatorSlug={slug} calculatorVersion={definition.version} input={input} output={result===null?null:{result}}/>
  {result!==null&&<AiResultExplanation calculatorName={spec.title} formula={spec.formula} assumptions={["The displayed deterministic formula is the source of the numeric result."]} values={input} result={{result}}/>}
 </div>;
}
