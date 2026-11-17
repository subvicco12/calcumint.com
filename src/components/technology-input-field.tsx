'use client';
import {useId} from 'react';
/** Preserve the caller's numeric text and associate refusal feedback with its field. */
export function TechnologyInputField({label,value,onChange,step,error,fieldKey}:{label:string;value:string;onChange:(value:string)=>void;step?:number;error?:string;fieldKey:string}){
 const id=useId();
 return <label className="field"><span>{label}</span><input data-technology-field={fieldKey} inputMode={step===1?'numeric':'decimal'} type="number" step={step} value={value} aria-invalid={error?true:undefined} aria-describedby={error?id:undefined} onChange={event=>onChange(event.target.value)}/>{error?<small id={id}>{error}</small>:null}</label>;
}
