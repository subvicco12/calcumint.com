import type {Scenario,SensitivityPoint} from './analysis';
const record=(value:unknown):value is Record<string,unknown>=>Boolean(value&&typeof value==='object'&&!Array.isArray(value));
const finite=(value:unknown)=>typeof value==='number'&&Number.isFinite(value);
const text=(value:unknown)=>typeof value==='string';
const optionalText=(value:unknown)=>value===undefined||text(value);
export const validAnalysisText=(...values:unknown[])=>values.every(optionalText);
export function validScenarios(value:unknown):value is readonly Scenario[]{
 if(!Array.isArray(value))return false;
 const ids=new Set<string>();
 for(let index=0;index<value.length;index++){
  const row=value[index];
  if(!record(row)||!text(row.id)||!text(row.label)||!finite(row.value)||!finite(row.delta)||(row.baseline!==undefined&&typeof row.baseline!=='boolean')||(row.input!==undefined&&(!record(row.input)||!text(row.input.label)||!finite(row.input.value)||!optionalText(row.input.unit))))return false;
  if(ids.has(row.id as string))return false;ids.add(row.id as string);
 }
 return true;
}
export function validSensitivity(value:unknown):value is readonly SensitivityPoint[]{
 if(!Array.isArray(value))return false;
 for(let index=0;index<value.length;index++){const row=value[index];if(!record(row)||!finite(row.input)||!finite(row.value))return false;}
 return true;
}
/** Complete finite data determines the domain; visible pages never rescale it. */
export function sensitivityDomain(points:readonly SensitivityPoint[]){
 let min=0,max=0;for(const point of points){min=Math.min(min,point.value);max=Math.max(max,point.value);}
 return {min,max:max===min?1:max};
}
