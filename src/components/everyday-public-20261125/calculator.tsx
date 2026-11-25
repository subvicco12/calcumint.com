'use client';

import {useId,useMemo,useRef,useState,type FormEvent} from 'react';
import {FinalResultPresentation} from '@/components/final-result-presentation';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {
 everydayContracts,everydayResult,everydayWorkflows,
} from '@/lib/worker3-everyday-sports-20261118/cohort';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';

const applicability:Readonly<Record<number,string>>={
 508:'Use costs for the same trip in one currency. This adds supplied costs and does not estimate prices.',
 513:'Enter the total for the stay and the number of people splitting it equally. Use one currency. This does not allocate costs by room or night.',
 514:'Use one currency and a whole number of people. This calculates equal shares, without tracking who paid or settling balances.',
 515:'Supply the bill amount before the tip and your chosen percentage. Everyone pays the same share. Taxes and local tipping rules are outside the calculation.',
 519:'Enter costs for the same billing period in one currency. Use zero for categories that do not apply. This does not estimate usage or apply tariffs.',
 520:'Enter non-overlapping costs for one move in one currency. Use zero for categories that do not apply. This does not estimate provider prices.',
 521:'Average pace from distance in kilometres and elapsed time in minutes. The result is decimal minutes per kilometre.',
 523:'Average speed from distance in kilometres and elapsed time in hours. This does not predict future speed.',
 524:'Average pace from distance in metres and elapsed time in minutes. The result is decimal minutes per 100 metres.',
};

export function getEverydayPublicCalculator(slug:string){
 return everydayContracts.find(contract=>contract.slug===slug&&contract.version===1&&Object.hasOwn(applicability,contract.catalogId));
}

export function EverydayPublicCalculator({calculatorSlug}:{calculatorSlug:string}){
 const contract=getEverydayPublicCalculator(calculatorSlug);
 return contract?<EverydayInputForm key={contract.slug} contract={contract}/>:null;
}

function EverydayInputForm({contract}:{contract:NonNullable<ReturnType<typeof getEverydayPublicCalculator>>}){
 const id=useId();
 const workflow=useMemo(()=>everydayWorkflows(contract.catalogId),[contract.catalogId]);
 const [raw,setRaw]=useState(()=>Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue??'')])));
 const [packet,setPacket]=useState<FactoryExecutionPacket|null>(null);
 const [error,setError]=useState<{message:string;field?:string}|null>(null);
 const form=useRef<HTMLFormElement>(null);
 const focusField=(key:string)=>{
  const input=form.current?.elements.namedItem(key);
  if(input instanceof HTMLInputElement)input.focus();
 };
 function calculate(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  setError(null);
  setPacket(null);
  for(const field of contract.fields){
   try{requiredCalculatorNumber(raw[field.key]);}
   catch{
    setError({message:'Enter a complete supported decimal for '+field.label.toLowerCase()+'.',field:field.key});
    focusField(field.key);
    return;
   }
  }
  try{setPacket(workflow.execute(raw));}
  catch(cause){
   setError({message:cause instanceof Error?cause.message:'Check the entered values and try again.'});
   const first=form.current?.querySelector('input');
   first?.focus();
  }
 }
 const result=packet?everydayResult(packet):null;
 return <section aria-label={contract.title} style={{minWidth:0,overflowWrap:'anywhere'}}>
  <p id={id+'-scope'}>{applicability[contract.catalogId]}</p>
  <form ref={form} aria-label="Calculator inputs" aria-describedby={id+'-scope'} noValidate onSubmit={calculate}
   style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',gap:'1rem'}}>
   {contract.fields.map(field=><label key={field.key} style={{minWidth:0}}>
    {field.label}{field.unit&&<span> ({field.unit})</span>}
    <input name={field.key} value={raw[field.key]} type="text" inputMode={field.key==='people'?'numeric':'decimal'}
     aria-invalid={error?.field===field.key||undefined}
     aria-describedby={error?.field===field.key?id+'-error':undefined}
     style={{display:'block',width:'100%',boxSizing:'border-box',minHeight:44,fontSize:'1rem'}}
     onChange={event=>{
      const value=event.target.value;
      setRaw(current=>({...current,[field.key]:value}));
      setError(null);
      setPacket(null);
     }}/>
   </label>)}
   <div style={{gridColumn:'1 / -1'}}>
    <button className="button primary" type="submit" style={{minHeight:44}}>Calculate</button>
   </div>
  </form>
  {error&&<p id={id+'-error'} role="alert">{error.message}</p>}
  {result&&<FinalResultPresentation result={{...result,warnings:['Displayed values may be rounded.']}}/>}
 </section>;
}
