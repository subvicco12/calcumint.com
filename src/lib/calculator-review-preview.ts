import type {CalculatorDefinition} from '@/calculators/types';
import {runCalculator} from '@/calculators/engine';
import {createCalculationSnapshot} from './calculation-snapshot';
const record=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function reviewerFields(definition:CalculatorDefinition<unknown,unknown>){const input=definition.examples[0]?.input;return record(input)?structuredClone(input):undefined;}
/** Example types describe editing only; the authoritative schema still validates every calculation. */
export function parseReviewerFields(example:Record<string,unknown>,draft:Record<string,string>){
 if(Object.keys(draft).some(key=>!Object.hasOwn(example,key)))throw Error('Unknown input field');
 return Object.fromEntries(Object.entries(example).map(([key,value])=>{
  const raw=draft[key];if(typeof raw!=='string')throw Error(`Enter ${key}`);
  if(typeof value==='number'){if(!raw.trim()||!Number.isFinite(Number(raw)))throw Error(`Enter a finite number for ${key}`);return[key,Number(raw)];}
  if(typeof value==='string')return[key,raw];
  try{return[key,JSON.parse(raw)];}catch{throw Error(`Enter valid JSON for ${key}`);}
 }));
}
export function calculateReviewerPreview(definition:CalculatorDefinition<unknown,unknown>,input:unknown){
 const result=runCalculator(definition,input);if(!record(result.input)||!record(result.output))throw Error('This engine requires a dedicated input/output adapter');
 return createCalculationSnapshot({calculatorSlug:result.slug,calculatorVersion:result.version,input:result.input,output:result.output});
}
