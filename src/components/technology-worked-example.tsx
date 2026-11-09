import type {CalculatorDefinition} from '@/calculators/types';
import type {RegisteredValueDefinition} from '@/calculators/final-framework/registered-value-result';
import {validateTechnologyCapture} from '@/lib/technology-capture-trust';
export type TechnologyExampleDefinition=RegisteredValueDefinition&Pick<CalculatorDefinition<unknown,unknown>,'id'|'examples'|'inputSchema'>;
type Output={value:number;steps:readonly string[]};
export function TechnologyWorkedExample({definition,fields,unit,calculate,onUse}:{definition:TechnologyExampleDefinition;fields:readonly (readonly [string,string,string])[];unit:string;calculate:(input:Record<string,number|string>)=>Output;onUse:(input:Readonly<Record<string,number|string>>)=>void}){
 const example=definition.examples[0];let input:Readonly<Record<string,number|string>>,output:Output;
 try{
  if(!example)throw Error('No example');
  input=Object.freeze({...definition.inputSchema.parse(example.input) as Record<string,number|string>});output=calculate({...input});
  validateTechnologyCapture(definition.id,input,output);
  if(!example.expected||typeof example.expected!=='object'||output.value!==(example.expected as {value?:unknown}).value)throw Error('Example differs');
 }catch{return <section aria-label="Worked example"><h2>Worked example</h2><p role="status">The retained example is unavailable for this mathematical version.</p></section>;}
 const labels=Object.fromEntries(fields.map(([label,key])=>[key,label]));
 const outputUnit=typeof input.toUnit==='string'?input.toUnit:unit;
 return <section aria-label="Worked example"><h2>Worked example</h2><p>These example inputs are separate from your current draft. Loading them preserves your saved calculations.</p><table><caption>Worked example inputs</caption><thead><tr><th scope="col">Input</th><th scope="col">Value</th></tr></thead><tbody>{Object.entries(input).map(([key,value])=><tr key={key}><th scope="row">{labels[key]??({fromUnit:'From unit',toUnit:'To unit',raidLevel:'RAID level'} as Record<string,string>)[key]??key}</th><td>{String(value)}</td></tr>)}</tbody></table><p>Recorded example result: <output aria-label="Worked example result">{String(output.value)}</output> <span>{outputUnit}</span></p>{definition.formulas.map(formula=><div key={formula.id}><p>{formula.expression}</p><p>{formula.description}</p></div>)}<ol>{output.steps.map((step,index)=><li key={index}>{step}</li>)}</ol><h3>Source references</h3><ul>{definition.sources.map((source,index)=><li key={source.label+index}>{source.url?<a href={source.url} rel="noreferrer">{source.label}</a>:source.label}{source.note&&<p>{source.note}</p>}</li>)}</ul><button type="button" onClick={()=>onUse(input)}>Use worked example</button></section>;
}
