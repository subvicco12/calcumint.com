'use client';
import {useId,useMemo,useState} from 'react';
import {n1PublicationMethodology} from '@/lib/n1-publication-methodology';
import {frequencyPresentationUnit} from '@/lib/frequency-presentation';
import {runCalculator} from '@/calculators/engine';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
import type {Publication20Definition} from '@/lib/publication20/types';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {scenarioMetadataForResult} from '@/lib/scenario-display-metadata';
import {useCalculatorPlan} from './use-calculator-plan';
import {CalculatorAccountActions} from './calculator-account-actions';
import {Publication20Batch} from './publication20-batch';
import {FinalResultPresentation} from './final-result-presentation';

/** One caller for exact existing conversion definitions; no new engine or lifecycle authority. */
export function Publication20Tool({slug}:{slug:string}){
 const entry=getPublication20Definition(slug);
 if(!entry||!entry.definition.id.startsWith('conversion.'))return <p role="alert">This calculator interface is unavailable.</p>;
 return <ConversionSession key={`${entry.definition.id}@${entry.definition.version}`} entry={entry}/>;
}
function ConversionSession({entry}:{entry:Publication20Definition}){
 const {definition}=entry;
 const [draft,setDraft]=useState<Record<string,string>>(()=>Object.fromEntries(entry.fields.map(f=>[f.key,f.defaultValue])));
 const prefix=useId(),plan=useCalculatorPlan();
 const input=useMemo(()=>Object.fromEntries(entry.fields.map(f=>[f.key,f.kind==='number'?requiredCalculatorNumber(draft[f.key]??''):draft[f.key]??''])),[entry,draft]);
 const parsed=definition.inputSchema.safeParse(input),fieldErrors=new Map<string,string>();
 if(!parsed.success)for(const issue of parsed.error.issues){const key=String(issue.path[0]),field=entry.fields.find(f=>f.key===key);if(field&&!fieldErrors.has(key))fieldErrors.set(key,field.kind==='number'&&!Number.isFinite(input[key])?`${field.label}: enter a complete finite decimal without losing entered digits.`:`${field.label}: ${issue.message}`);}
 let output:Record<string,unknown>|null=null,error='';
 if(parsed.success){try{const actual=runCalculator(definition,input).output;validatePublication20Result(entry,input,actual);output=actual;}catch(e){error=e instanceof Error?e.message:'The result is outside the supported numeric range.';}}
 else error='Correct the fields identified above. Blank, malformed or lossy numeric values cannot be calculated.';
 const unit=entry.outputUnit(input),primary=output?.[entry.primaryKey];
 const presentationUnit=(code:string)=>frequencyPresentationUnit(definition.slug,definition.version,code);
 const baseMethodology=[entry.catalogId===427?entry.scope:'Fixed-unit value conversion using the selected source and target units.',...definition.formulas.map(f=>`${f.description}\n${f.expression}`)].join('\n\n');
 const methodology=n1PublicationMethodology(entry.catalogId,definition.version,baseMethodology,entry.scope);
 const result=output?{primaryResult:{id:'result',label:'Converted value',value:primary as number,unit},methodology,sources:definition.sources}:null;
 const displayBase=result?scenarioMetadataForResult(definition,input,output!,result,{inputs:Object.fromEntries(entry.fields.map(f=>[f.key,f.label])),outputs:{[entry.primaryKey]:'result'}}):undefined;
 const display=displayBase?{...displayBase,inputs:{...displayBase.inputs,value:{label:'Value',unit:String(input.fromUnit)}}}:undefined;
 return <div className="calculator-ui" data-publication20-slug={definition.slug}>
  {entry.catalogId===427&&<p data-temperature-scope="algebraic-value">{entry.scope}</p>}
  <div className="field-grid">{entry.fields.map(field=>{const message=fieldErrors.get(field.key),errorId=`${prefix}-${field.key}-error`;return <div key={field.key}><label className="field"><span>{field.label}</span>{field.kind==='select'?<select data-publication20-field={field.key} value={draft[field.key]??''} aria-invalid={Boolean(message)} aria-describedby={message?errorId:undefined} onChange={e=>setDraft(d=>({...d,[field.key]:e.target.value}))}>{field.options?.map(value=><option key={value} value={value}>{presentationUnit(value)}</option>)}</select>:<input data-publication20-field={field.key} type="text" inputMode="decimal" maxLength={4096} required value={draft[field.key]??''} aria-invalid={Boolean(message)} aria-describedby={message?errorId:undefined} onChange={e=>setDraft(d=>({...d,[field.key]:e.target.value}))}/>}</label>{message&&<p id={errorId} className="muted-copy">{message}</p>}</div>;})}</div>
  {result?<><div data-publication20-result={String(primary)}><FinalResultPresentation result={{...result,primaryResult:{...result.primaryResult,unit:presentationUnit(unit)}}} plan={plan}/><p>The headline may be rounded; the raw table and exports retain the stored value.</p></div><table className="schedule-table"><caption>Conversion reconciliation</caption><thead><tr><th scope="col">Field</th><th scope="col">Recorded value</th><th scope="col">Unit</th></tr></thead><tbody><tr><th scope="row">Input value</th><td>{String(input.value)}</td><td>{presentationUnit(String(input.fromUnit))}</td></tr><tr><th scope="row">Stored result</th><td>{Object.is(primary,-0)?'-0':String(primary)}</td><td>{presentationUnit(unit)}</td></tr></tbody></table><details><summary>Scope and limitations</summary><p>{entry.scope}</p></details></>:<div role="alert" aria-live="polite"><strong>Enter valid inputs.</strong> {error}</div>}
  {(plan==='pro'||plan==='business')&&<Publication20Batch slug={definition.slug} fromUnit={String(input.fromUnit)} toUnit={String(input.toUnit)} onSelect={(value,fromUnit,toUnit)=>setDraft(d=>({...d,value,fromUnit,toUnit}))}/>}
  <CalculatorAccountActions calculatorSlug={definition.slug} calculatorVersion={definition.version} input={input} output={output} scenarioDisplayMetadata={display} exportMethodology={output?methodology:undefined}/>
 </div>;
}
