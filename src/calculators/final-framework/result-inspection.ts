import type { StructuredCalculationResult } from './types';
import { inspectScheduleContract } from './schedule-contract';

export type InvalidResultSurface='composition'|'ranges'|'series'|'schedule'|'trust'|'warnings';
const record=(value:unknown):value is Record<string,unknown>=>Boolean(value&&typeof value==='object'&&!Array.isArray(value));
const text=(value:unknown)=>typeof value==='string';
const optionalText=(value:unknown)=>value===undefined||text(value);
const finite=(value:unknown)=>typeof value==='number'&&Number.isFinite(value);
const optionalFinite=(value:unknown)=>value===undefined||finite(value);
const displayValue=(value:unknown)=>text(value)||finite(value);
const array=(value:unknown,valid:(item:unknown)=>boolean)=>Array.isArray(value)&&Array.from(value).every(valid);
const labeled=(value:unknown):value is Record<string,unknown>=>record(value)&&text(value.id)&&text(value.label)&&optionalText(value.unit);
const metric=(value:unknown)=>labeled(value)&&displayValue(value.value);
const scheduleRow=(value:unknown)=>record(value)&&text(value.id)&&displayValue(value.period)&&record(value.values)&&Object.values(value.values).every(displayValue);
const scheduleMetadata=(value:unknown)=>record(value)&&text(value.caption)&&record(value.period)&&text(value.period.key)&&text(value.period.label)&&optionalText(value.period.unit)&&array(value.columns,column=>record(column)&&text(column.key)&&text(column.label)&&optionalText(column.unit))&&(value.granularity==='complete'||value.granularity==='checkpoints')&&(value.terminal===undefined||array(value.terminal,check=>record(check)&&text(check.column)&&finite(check.expected)&&finite(check.tolerance)));

/** Validate presentation data only; no formula, financial bounds, totals or tolerances are inferred. */
export function inspectStructuredResult(value:unknown):{
 coreValid:boolean;invalidSurfaces:readonly InvalidResultSurface[];renderable:StructuredCalculationResult|null;scheduleIssues?:readonly string[];
}{
 if(!record(value)||!metric(value.primaryResult)||(value.metrics!==undefined&&!array(value.metrics,metric)))return {coreValid:false,invalidSurfaces:[],renderable:null};
 const result={...value} as unknown as StructuredCalculationResult;
 const invalidSurfaces:InvalidResultSurface[]=[];
 const reject=(surface:InvalidResultSurface)=>{invalidSurfaces.push(surface);};
 if(value.composition!==undefined&&!array(value.composition,item=>labeled(item)&&finite(item.value))){reject('composition');result.composition=undefined;}
 if(value.ranges!==undefined&&!array(value.ranges,item=>labeled(item)&&optionalFinite(item.min)&&optionalFinite(item.max)&&optionalText(item.classification))){reject('ranges');result.ranges=undefined;}
 if(value.series!==undefined&&!array(value.series,item=>labeled(item)&&array(item.points,point=>record(point)&&displayValue(point.x)&&finite(point.y)&&optionalText(point.label)))){reject('series');result.series=undefined;}
 const rowsValid=value.schedule===undefined||array(value.schedule,scheduleRow);
 const metadataValid=value.scheduleMetadata===undefined||scheduleMetadata(value.scheduleMetadata);
 const scheduleIssues=rowsValid&&metadataValid&&result.scheduleMetadata?inspectScheduleContract(result.schedule??[],result.scheduleMetadata):[];
 if(!rowsValid||!metadataValid||scheduleIssues.length){
  reject('schedule');result.schedule=undefined;result.scheduleMetadata=undefined;
 }
 if(!optionalText(value.methodology)||(value.sources!==undefined&&!array(value.sources,source=>record(source)&&text(source.label)&&optionalText(source.url)))){
  reject('trust');result.methodology=undefined;result.sources=undefined;
 }
 if(value.warnings!==undefined&&!array(value.warnings,text)){reject('warnings');result.warnings=undefined;}
 return {coreValid:true,invalidSurfaces,renderable:result,scheduleIssues};
}
