import Decimal from 'decimal.js';
import {scenarioSetPayload,type CapturedScenario,type ScenarioSlot} from './scenario-set';
import {serializeCalculationCsv} from './calculation-export';

export type ScenarioReportCell=Readonly<{slot:ScenarioSlot;label?:string;unit?:string;value:number|null;difference:number|null;unavailable:string|null}>;
export type ScenarioReportMetric=Readonly<{field:string;label:string;unit?:string;cells:readonly ScenarioReportCell[]}>;
export type ScenarioReport=Readonly<{
 schemaVersion:1;captures:ReturnType<typeof scenarioSetPayload>;metrics:readonly ScenarioReportMetric[];
 charts:readonly Readonly<{field:string;title:string;unit?:string;points:readonly Readonly<{label:string;value:number}>[]}>[];
}>;
// 700 significant digits span the canonical decimal forms of all finite JS numbers.
const ReportDecimal=Decimal.clone({precision:700});
export const scenarioNumber=(value:number):string=>Object.is(value,-0)?'-0':String(value);
/** Presentation-only differences; no engine re-evaluation, unit inference or historical mutation. */
export function createScenarioReport(rows:readonly CapturedScenario[]):ScenarioReport {
 const captures=scenarioSetPayload(rows),baseline=captures.scenarios[0];
 const fields=[...new Set(captures.scenarios.flatMap(row=>Object.keys(row.output)))];
 const metrics=fields.flatMap(field=>{
  if(!captures.scenarios.some(row=>typeof row.output[field]==='number'))return [];
  const context=baseline.displayMetadata?.outputs[field];
  const cells=captures.scenarios.map(row=>{
   const value=typeof row.output[field]==='number'?row.output[field] as number:null;
   const other=row.displayMetadata?.outputs[field];
   const same=context?.label===other?.label&&context?.unit===other?.unit;
   let unavailable:string|null=!Object.hasOwn(row.output,field)?'Not present in this snapshot':value===null?'Not a numeric value':!same?'Display context differs from baseline':typeof baseline.output[field]!=='number'?'No numeric baseline':null;
   const difference=unavailable===null?new ReportDecimal(value!).minus(baseline.output[field] as number).toNumber():null;
   if(difference!==null&&!Number.isFinite(difference))unavailable='Difference exceeds finite numeric range';
   return Object.freeze({slot:row.slot,...(other?{label:other.label,...(other.unit!==undefined?{unit:other.unit}:{})}:{}),value,difference:unavailable===null?difference:null,unavailable});
  });
  return [Object.freeze({field,label:context?.label??field,...(context?.unit!==undefined?{unit:context.unit}:{}),cells:Object.freeze(cells)})];
 });
 const charts=metrics.flatMap(metric=>{
  // Never invent semantic chart labels or units from raw engine field names.
  if(captures.scenarios.length<2||!baseline.displayMetadata?.outputs[metric.field]||metric.cells.some(cell=>cell.unavailable!==null))return [];
  return [Object.freeze({field:metric.field,title:metric.label,...(metric.unit!==undefined?{unit:metric.unit}:{}),points:Object.freeze(metric.cells.map(cell=>Object.freeze({label:cell.slot,value:cell.value!})))})];
 });
 return Object.freeze({schemaVersion:1,captures,metrics:Object.freeze(metrics),charts:Object.freeze(charts)});
}
export function serializeScenarioReportJson(rows:readonly CapturedScenario[]):string {
 const {captures,...comparison}=createScenarioReport(rows);
 return JSON.stringify({...captures,comparison},null,2);
}
export function serializeScenarioReportCsv(rows:readonly CapturedScenario[]):string {
 const {captures,metrics}=createScenarioReport(rows);
 const output:Record<string,unknown>={capturedScenarios:captures.scenarios};
 metrics.forEach((metric,index)=>{
  output[`metric[${index}].field`]=metric.field;output[`metric[${index}].label`]=metric.label;
  if(metric.unit!==undefined)output[`metric[${index}].unit`]=metric.unit;
  for(const cell of metric.cells){const path=`metric[${index}].${cell.slot}`;output[`${path}.label`]=cell.label??null;output[`${path}.unit`]=cell.unit??null;output[`${path}.value`]=cell.value;output[`${path}.differenceFromA`]=cell.difference;output[`${path}.unavailable`]=cell.unavailable;}
 });
 return serializeCalculationCsv({schemaVersion:1,calculatorSlug:captures.calculatorSlug,calculatorVersion:captures.calculatorVersion,baseline:'A'},output);
}
