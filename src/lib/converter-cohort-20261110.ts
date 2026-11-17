/** Actionable worked examples from the exact offered registered v1 converter.
 * No copied factors, new arithmetic, successor engine, or acceptance authority. */
import {runCalculator} from '@/calculators/engine';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
export function converterWorkedExamples(slug:string){
 const entry=getPublication20Definition(slug);
 if(!entry||!entry.definition.id.startsWith('conversion.'))return [];
 const {definition}=entry;
 return definition.examples.map(example=>{
  const input=definition.inputSchema.parse(example.input);
  const output=runCalculator(definition,input).output;
  validatePublication20Result(entry,input,output);
  const value=input.value,fromUnit=input.fromUnit,toUnit=input.toUnit;
  if(typeof value!=='number'||typeof fromUnit!=='string'||typeof toUnit!=='string')throw Error('Invalid registered converter example.');
  return Object.freeze({catalogId:entry.catalogId,label:example.label,
   draft:Object.freeze({value:Object.is(value,-0)?'-0':String(value),fromUnit,toUnit}),
   result:output[entry.primaryKey] as number,
   formulas:definition.formulas,sources:definition.sources,scope:entry.scope});
 });
}
