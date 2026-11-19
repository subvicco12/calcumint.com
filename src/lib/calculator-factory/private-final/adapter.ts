import type {CalculatorDefinition} from '@/calculators/types';
import type {PresentationDefinition,StructuredCalculationResult} from '@/calculators/final-framework/types';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {parsePublicationFactoryInput} from '@/lib/publication-factory-contracts-input';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '../workflows';
import {serializeCalculationCsv} from '@/lib/calculation-export';

type Field = FactoryWorkbenchField & {encoding?: 'json' | 'boolean'};
type Metadata = {
 catalogId:number;
 revision:string;
 fields:readonly Field[];
 limitations:string;
 unit:string;
 project:(output:Record<string,unknown>)=>Pick<StructuredCalculationResult,'primaryResult'|'metrics'>;
 presentation:PresentationDefinition;
};

export function compilePrivateFinal<I extends Record<string,unknown>,O extends Record<string,unknown>>(engine:CalculatorDefinition<I,O>, metadata:Metadata){
 const fields=Object.freeze(metadata.fields.map(field=>Object.freeze({
  ...field, defaultValue:field.defaultValue??encode(engine.examples[0]?.input[field.key]),
 })));
 const identity={catalogId:metadata.catalogId,engineId:engine.id,calculatorSlug:engine.slug,calculatorVersion:engine.version,sourceVersion:`${metadata.revision}/${engine.id}@${engine.version}`};
 const scope=engine.formulas.map(formula=>formula.description).join(' ');
 function exactInput(value:Record<string,unknown>){
  const input=engine.inputSchema.parse(value);
  if(!equalCompletionJson(input,value))throw Error('Expected exact v1 input fields');
  return input;
 }
 function calculate(input:I){
  return createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:engine.version,input,output:engine.calculate(input,{})});
 }
 const flow=createFactoryWorkflows({identity,execute(raw){
  if(Object.keys(raw).length!==fields.length||fields.some(field=>!Object.hasOwn(raw,field.key)))throw Error('Expected exact v1 input fields');
  const input=Object.fromEntries(fields.map(field=>[field.key,decode(field,raw[field.key])]));
  return calculate(exactInput(input));
 }});
 const workflows=Object.freeze({...flow,exportPacket(...args:Parameters<typeof flow.exportPacket>){
  const text=flow.exportPacket(...args);
  if(args[1]==='json')return text;
  const packet=flow.verify(args[0]);
  return serializeCalculationCsv({identity:packet.identity,raw:packet.raw,input:packet.snapshot.input,
   inputUnits:Object.fromEntries(fields.filter(field=>field.unit).map(field=>[field.key,field.unit]))},
   {...packet.snapshot.output,outputUnit:metadata.unit});
 }});
 function verifyHistorical(value:unknown){
  const clean=copyCalculationData({value},{}).input.value;
  if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='calculatorSlug,calculatorVersion,input,output')throw Error('Expected exact v1 snapshot');
  const snapshot=createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
  if(snapshot.calculatorSlug!==engine.slug||snapshot.calculatorVersion!==engine.version)throw Error('Exact source version unavailable');
  const expected=calculate(exactInput(snapshot.input));
  if(!equalCompletionJson(snapshot,expected))throw Error('Historical result differs from the registered engine');
  return {catalogId:metadata.catalogId,snapshot};
 }
 return Object.freeze({catalogId:metadata.catalogId,title:engine.title,engineId:engine.id,slug:engine.slug,version:engine.version,
  unit:metadata.unit,engine,fields,scope,limitations:metadata.limitations,presentation:metadata.presentation,workflows,verifyHistorical,
  result(packet:FactoryExecutionPacket):StructuredCalculationResult{
   const verified=flow.verify(packet);
   return {...metadata.project(verified.snapshot.output),methodology:scope,sources:engine.sources,
    warnings:[metadata.limitations,'Private engineering review. Source, scope and precision acceptance remain pending.']};
  },
 });
}

function encode(value:unknown):string {
 return typeof value==='string'?value:value===undefined?'':Object.is(value,-0)?'-0':JSON.stringify(value);
}

function decode(field:Field,text:string):unknown {
 if(field.encoding==='json'){
  if(new TextEncoder().encode(text).length>65536)throw Error('Structured field exceeds 64 KiB');
  return parsePublicationFactoryInput(text);
 }
 if(field.encoding==='boolean'){
  if(text!=='true'&&text!=='false')throw Error('Choose a boolean value');
  return text==='true';
 }
 if(field.kind==='text'||field.kind==='select')return text;
 const value=requiredCalculatorNumber(text);
 if(!Number.isFinite(value))throw Error(`Enter a finite number for ${field.label}`);
 return value;
}

export function encodePrivateFinalInputs(input:Record<string,unknown>){
 return Object.fromEntries(Object.entries(input).map(([key,value])=>[key,encode(value)]));
}
