import {molarityCalculator,molesCalculator,dilutionCalculator} from '../../../calculators/chemistry/catalog-batch-1';
import {createCalculationSnapshot,copyCalculationData} from '../../calculation-snapshot';

const source='https://openstax.org/books/chemistry-2e/pages/3-3-molarity';
const rows=[
 {catalogId:328,engine:molarityCalculator,solveFor:'moles',formula:'M = n / V',unit:'mol/L',fields:[['moles','mol'],['solutionVolumeLiters','L']],scope:'Amount of dissolved solute divided by total homogeneous solution volume, not solvent volume.'},
 {catalogId:331,engine:molesCalculator,solveFor:'massGrams',formula:'n = m / M',unit:'mol',fields:[['massGrams','g'],['molarMass','g/mol']],scope:'Amount from sample mass and a user-supplied positive molar mass. No formula parser, atomic-weight lookup or purity correction.'},
 {catalogId:332,engine:dilutionCalculator,solveFor:'initialConcentration',formula:'C₂ = C₁ V₁ / V₂',unit:'mol/L',fields:[['initialConcentration','mol/L'],['initialVolume','L'],['finalVolume','L']],scope:'Conserved solute diluted by adding solvent; positive initial volume and final volume at least initial volume. No reaction, precipitation or solvent-volume additivity assumption.'},
] as const;
export type NextScienceId=typeof rows[number]['catalogId'];
export const nextScienceCaptureRevision='private.science-completion.20261114.1';
export const nextScienceContracts=Object.freeze(rows.map(row=>Object.freeze({catalogId:row.catalogId,slug:row.engine.slug,engineId:row.engine.id,version:row.engine.version,title:row.engine.title,registered:true,primaryKey:'value',solveFor:row.solveFor,formula:row.formula,unit:row.unit,scope:row.scope,fields:Object.freeze(row.fields.map(([key,unit])=>Object.freeze({key,unit,label:`${key} (${unit})`,defaultValue:String((row.engine.examples[0].input as Record<string,number>)[key]),kind:'number' as const}))),sourceEvidence:Object.freeze([source,'src/calculators/chemistry/catalog-batch-1.ts','docs/calculator-first/authority-catalog.json']),limitations:Object.freeze(['Private engineering capture only; no certification or publication authorization.','Finite normal binary64 inputs and results, except witnessed exact zero. No uncertainty or significant-figure inference.'])})));
function binding(id:NextScienceId){const row=rows.find(row=>row.catalogId===id);if(!row)throw Error('Unsupported science identity');return row;}

/** Reuses the exact historical v1 arithmetic; narrower capture guards do not mutate the engine. */
export function calculateNextScience(id:NextScienceId,input:unknown){
 const row=binding(id);
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Exact science input fields required');
 // The snapshot copier refuses accessors, symbols and exotic prototypes before schema parsing.
 const clean=copyCalculationData(input as Record<string,unknown>,{}).input;
 if(Object.keys(clean).length!==row.fields.length||Object.keys(clean).some(key=>!row.fields.some(([field])=>field===key)))throw Error('Exact science input fields required');
 const values=clean as Record<string,number>;
 if(Object.values(values).some(value=>typeof value!=='number'||!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022)))throw Error('Science input outside finite normal capture range');
 if(id===332&&(values.initialVolume<=0||values.finalVolume<values.initialVolume))throw Error('Dilution requires positive initial volume and final volume at least initial volume');
 const engine=row.engine;
 // All three engines have numeric record schemas; parse once before dispatch.
 const parsed=engine.inputSchema.parse(values);
 const output=(engine.calculate as (input:unknown,context:Record<string,never>)=>{value:number;steps:readonly string[]})(parsed,{});
 const zero= id===328?values.moles===0:id===331?values.massGrams===0:values.initialConcentration===0;
 if(!Number.isFinite(output.value)||(output.value!==0&&Math.abs(output.value)<2**-1022)||(output.value===0&&!zero))throw Error('Science output outside finite normal capture range');
 return Object.freeze({snapshot:createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:engine.version,input:parsed,output}),captureRevision:nextScienceCaptureRevision,formula:row.formula,unit:row.unit,steps:Object.freeze([Object.freeze({expression:row.formula,value:output.value})])});
}
/** Named numerator solve keeps denominators fixed and proves its result by exact-engine replay. */
export function reverseNextScience(id:NextScienceId,input:Record<string,number>,target:number){
 calculateNextScience(id,input);
 if(!Number.isFinite(target)||target<0)throw Error('Target must be finite and nonnegative');
 const row=binding(id);
 const value=id===328?target*input.solutionVolumeLiters:id===331?target*input.molarMass:target*input.finalVolume/input.initialVolume;
 if(!Number.isFinite(value)||(value===0&&target!==0))throw Error('Reverse value outside supported range');
 const candidate=Object.freeze({...input,[row.solveFor]:value});
 const replay=calculateNextScience(id,candidate),actual=replay.snapshot.output.value as number;
 if(actual!==target&&Math.abs(actual-target)/Math.max(Math.abs(actual),Math.abs(target))>16*Number.EPSILON)throw Error('Reverse target does not reconcile');
 return Object.freeze({solveFor:row.solveFor,value,input:candidate,replay});
}
export function graphNextScience(id:NextScienceId,input:Record<string,number>,samples:readonly number[]){
 calculateNextScience(id,input);if(!Array.isArray(samples)||samples.length>101)throw Error('At most 101 graph samples required');
 const row=binding(id);return Object.freeze(samples.map(x=>{try{return Object.freeze({x,y:calculateNextScience(id,{...input,[row.solveFor]:x}).snapshot.output.value as number});}catch(error){return Object.freeze({x,error:error instanceof Error?error.message:'Refused sample'});}}));
}
