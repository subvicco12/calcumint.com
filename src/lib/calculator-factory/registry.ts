import {next100MathContracts,calculateNext100Math,type Next100MathId} from './completion/math-next100';
import {geometryNext100Contracts,calculateGeometryNext100,type GeometryNext100Id} from './completion/geometry-next100';
import {nextScienceContracts,calculateNextScience,type NextScienceId} from './completion/science-next100';
import {nextMathContracts,calculateNextMath,type NextMathId} from './completion/math-next';
import {conversionNextContracts} from './completion/conversion-next';
import {frequencyPresentationUnit} from '../frequency-presentation';
import {basicMathContracts,basicMathCaptureRevision,calculateBasicMath,type BasicMathCatalogId} from './cohorts/basic-math';
import {conversionCompletionContracts,conversionCompletionUnit} from './completion/conversion-contracts';
import {conversionFactoryDefinitions} from './cohorts/conversions';
import {physicsCandidates} from './cohorts/physics';
import {createFactoryWorkflows,type FactoryRaw} from './workflows';
import {createCalculationSnapshot} from '../calculation-snapshot';
import {requiredCalculatorNumber} from '../registered-input-successor';
import type {FactoryWorkbenchField} from '@/components/calculator-factory-workbench';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';

export type FactoryContract=Readonly<{catalogId:number;engineId:string;slug:string;version:number;title:string;registered:boolean;captureRevision?:string;primaryKey:string;unit?:string;outputUnit?:(input:Record<string,unknown>)=>string;privateRevision?:string;fields:readonly FactoryWorkbenchField[];scope:string;sourceEvidence:readonly string[];limitations:readonly string[];execute:(raw:FactoryRaw)=>ReturnType<typeof createCalculationSnapshot>}>;
function numericInput(raw:FactoryRaw,fields:readonly FactoryWorkbenchField[]){
 if(Object.keys(raw).length!==fields.length||Object.keys(raw).some(key=>!fields.some(field=>field.key===key)))throw Error('Exact input fields required');
 return Object.fromEntries(fields.map(field=>{let value:number;try{value=requiredCalculatorNumber(raw[field.key]);}catch{throw Error(`Enter a complete finite value for ${field.label}`);}if(!Number.isFinite(value))throw Error(`Enter a complete finite value for ${field.label}`);return [field.key,value];}));
}
const math:FactoryContract[]=basicMathContracts.map(row=>({...row,registered:true,captureRevision:basicMathCaptureRevision,execute:(raw:FactoryRaw)=>calculateBasicMath(row.catalogId as BasicMathCatalogId,numericInput(raw,row.fields)).snapshot}));
const conversions:FactoryContract[]=conversionFactoryDefinitions.map(row=>{
 const scoped=conversionCompletionContracts.find(contract=>contract.catalogId===row.catalogId);
 return {catalogId:row.catalogId,engineId:row.engineId,slug:row.definition.slug,version:row.version,title:row.definition.title,registered:true,primaryKey:row.primaryKey,
 outputUnit:scoped?input=>conversionCompletionUnit(row.catalogId,String(input.toUnit)).symbol:row.outputUnit,
 fields:row.fields.map(field=>scoped&&field.options?{...field,optionLabels:Object.fromEntries(field.options.map(code=>[code,conversionCompletionUnit(row.catalogId,code).symbol]))}:field),
 scope:row.scope,sourceEvidence:['src/lib/publication20/conversions.ts',...(scoped?[scoped.source.path]:[])],
 limitations:['Offered unit codes only; formal canonical and source applicability remain subject to competent acceptance.'],execute:(raw:FactoryRaw)=>row.run({catalogId:row.catalogId,version:row.version,input:raw}).snapshot};
});
const physics:FactoryContract[]=physicsCandidates.map(row=>{
 const engine=row.engine;
 const fields:readonly FactoryWorkbenchField[]='fields' in row?row.fields as readonly FactoryWorkbenchField[]:[];
 return {catalogId:row.catalogId,engineId:row.engineId,slug:row.slug,...('privateRevision' in row?{privateRevision:String(row.privateRevision)}:{}),version:typeof row.version==='number'?row.version:1,title:engine.title??`Physics ${row.catalogId}`,registered:row.catalogId!==323&&row.catalogId!==324,primaryKey:row.primaryKey,fields,scope:row.scope,sourceEvidence:[row.sourceEvidence],limitations:[...row.limitations,...row.blockers],execute:(raw:FactoryRaw)=>{const input=engine.inputSchema.parse(numericInput(raw,fields));const output=engine.calculate(input as never,{});return createCalculationSnapshot({calculatorSlug:row.slug,calculatorVersion:typeof row.version==='number'?row.version:1,input,output});}};
});
const nextMath:FactoryContract[]=nextMathContracts.map(row=>({...row,captureRevision:'private.geometry-completion.20261113.1',execute:(raw:FactoryRaw)=>calculateNextMath(row.catalogId as NextMathId,numericInput(raw,row.fields)).snapshot}));
// Only registered scalar v1 converter tuples enter shared delivery. Private exact-decimal drafts retain separate workflows.
const nextConversions=conversionNextContracts.filter(row=>row.registered);
const wave100Math:FactoryContract[]=next100MathContracts.map(row=>({...row,captureRevision:'private.math-next100.20261114.1',execute:(raw:FactoryRaw)=>calculateNext100Math(row.catalogId as Next100MathId,numericInput(raw,row.fields)).snapshot}));
const wave100Geometry:FactoryContract[]=geometryNext100Contracts.map(row=>({...row,captureRevision:'private.geometry-next100.20261114.1',execute:(raw:FactoryRaw)=>calculateGeometryNext100(row.catalogId as GeometryNext100Id,numericInput(raw,row.fields)).snapshot}));
const wave100Science:FactoryContract[]=nextScienceContracts.map(row=>({...row,captureRevision:'private.science-completion.20261114.1',execute:(raw:FactoryRaw)=>calculateNextScience(row.catalogId as NextScienceId,numericInput(raw,row.fields)).snapshot}));
export const factoryContracts:readonly FactoryContract[]=Object.freeze([...math,...conversions,...physics,...nextMath,...nextConversions,...wave100Math,...wave100Geometry,...wave100Science]);
if(new Set(factoryContracts.map(row=>row.catalogId)).size!==factoryContracts.length)throw Error('Duplicate factory catalog identity');
export function getFactoryContract(catalogId:number){return factoryContracts.find(row=>row.catalogId===catalogId);}
export function getFactoryWorkflows(catalogId:number){const contract=getFactoryContract(catalogId);if(!contract)throw Error('Unknown factory identity');return createFactoryWorkflows({identity:{catalogId,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,sourceVersion:`factory-wave1-20261112.1/${contract.engineId}@${contract.version}${contract.privateRevision?`/${contract.privateRevision}`:''}${contract.captureRevision?`/${contract.captureRevision}`:''}`},execute:contract.execute});}
export function runFactoryCalculation(catalogId:number,version:number,input:FactoryRaw){const contract=getFactoryContract(catalogId);if(!contract||contract.version!==version)throw Error('Exact factory identity/version unavailable');return getFactoryWorkflows(catalogId).execute(input);}
export function calculateFactory(catalogId:number,input:FactoryRaw){const contract=getFactoryContract(catalogId);if(!contract)throw Error('Unknown factory identity');return runFactoryCalculation(catalogId,contract.version,input).snapshot;}
export function factoryResult(catalogId:number,raw:FactoryRaw):StructuredCalculationResult{const contract=getFactoryContract(catalogId);if(!contract)throw Error('Unknown factory identity');const packet=runFactoryCalculation(catalogId,contract.version,raw);const key=contract.primaryKey;const unit=contract.outputUnit?.(packet.snapshot.input)??contract.unit;return {primaryResult:{id:key,label:'Result',value:packet.snapshot.output[key] as number,...(unit?{unit:frequencyPresentationUnit(contract.slug,contract.version,unit)}:{})},methodology:contract.scope,warnings:['Private engineering review; no certification or publication approval.',...contract.limitations]};}
