import {requiredCalculatorNumber} from './registered-input-successor';
import {businessExamples, exportBusinessContract} from '../calculators/business-contracts';

export const guidedBusinessIds = [139,140,141,142,143,144,164,165,166,167] as const;
export type GuidedBusinessId = typeof guidedBusinessIds[number];
export type BusinessDraft = Record<string,string>;
export const supportsGuidedBusiness = (id:number):id is GuidedBusinessId => guidedBusinessIds.some(value=>value===id);
export function businessDraft(id:GuidedBusinessId, input:Record<string,unknown> = businessExamples[id]):BusinessDraft {
 return Object.fromEntries(Object.keys(businessExamples[id]).map(key=>[key, input[key] === undefined ? '' : String(input[key])]));
}
export function businessFieldLabel(key:string){return key.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());}
export function parseBusinessDraft(id:GuidedBusinessId,draft:BusinessDraft){
 const input:Record<string,unknown>={};const errors:Record<string,string>={};
 for(const [key,example] of Object.entries(businessExamples[id])){
  const raw=draft[key]?.trim()??'';
  if(key==='scope'){
   if(raw!==example)errors.scope='Guided inputs require the existing supplied-business-no-policy scope. Repair the scenario JSON before using guided inputs.';
   else input[key]=raw;
   continue;
  }
  if(!raw){errors[key]=`${businessFieldLabel(key)} is required.`;continue;}
  if(typeof example==='number'){
   const parsed=requiredCalculatorNumber(raw);
   if(!Number.isFinite(parsed)){errors[key]=`${businessFieldLabel(key)} must be a finite decimal number preserved without precision loss.`;continue;}
   input[key]=parsed;
  }else input[key]=raw;
 }
 return {input,errors};
}
export function calculateBusinessDraft(id:GuidedBusinessId,draft:BusinessDraft,plan:'free'|'pro'|'business'='free'):{errors:Record<string,string>;snapshot:ReturnType<typeof exportBusinessContract>|null}{
 const parsed=parseBusinessDraft(id,draft);
 if(Object.keys(parsed.errors).length)return {errors:parsed.errors,snapshot:null};
 try{return {errors:{},snapshot:exportBusinessContract(id,parsed.input,plan)};}
 catch{return {errors:{contract:'Check amounts, positive denominators, supported bounds and cohort membership against the selected methodology.'},snapshot:null};}
}
