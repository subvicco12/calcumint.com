import {launchDefinitions, launchSpecs} from '../../../calculators/launch-portfolio';
import {copyCalculationData,createCalculationSnapshot} from '../../calculation-snapshot';

const rows = [
 [213,'fraction-calculator','numerator','Finite quotient only; no rational arithmetic operations.'],
 [221,'cube-root-calculator','x','Real cube root.'],
 [222,'power-calculator','base','Real exponentiation where the retained engine produces a finite result.'],
 [223,'exponent-calculator','base','Real exponentiation; distinct exponent input identity is retained.'],
 [224,'logarithm-calculator','x','Positive argument and base at least 1e-9; base cannot equal one.'],
 [225,'reciprocal-calculator','x','Nonzero real reciprocal.'],
 [226,'remainder-calculator','a','JavaScript signed remainder, not Euclidean modulo.'],
 [227,'lcm-calculator','a','Two positive safe integers; exact safe-integer LCM only.'],
 [228,'gcf-calculator','a','Two positive safe integers; Euclidean GCF.'],
 [229,'factor-calculator','number','Smallest divisor greater than one for integers 2 through 1e9; not a complete factor list.'],
 [230,'rounding-calculator','value','Retained decimal exponent-shift rounding, ties toward positive infinity; nonnegative integer places.'],
 [231,'scientific-notation-calculator','coefficient','Evaluate coefficient times ten to exponent; no normalized notation formatter.'],
 [234,'percent-error-calculator','observed','Absolute percent error; accepted value at least 1e-9.'],
] as const;
export type Next100MathId=typeof rows[number][0];
export const next100MathCaptureRevision='private.math-next100.20261114.1';
export const next100MathContracts=Object.freeze(rows.map(([catalogId,slug,solveFor,scope])=>{
 const engine=launchDefinitions.find(row=>row.id===`launch-${slug}`&&row.slug===slug&&row.version===1);
 const spec=launchSpecs.find(row=>row.slug===slug);
 if(!engine||!spec)throw Error('Exact math engine binding unavailable');
 return Object.freeze({catalogId,slug,engineId:engine.id,version:1,title:engine.title,primaryKey:'result',registered:catalogId!==222,solveFor,scope,formula:spec.formula,
 fields:Object.freeze(spec.fields.map(field=>Object.freeze({...field,kind:'number' as const}))),
 sourceEvidence:Object.freeze(['docs/calculator-first/authority-catalog.json','src/calculators/launch-portfolio.ts','data/verification/codex-a-standard-risk-goldens-2026-10-15.json','docs/milestone100-20261114/math/source-applicability.json']),
 limitations:Object.freeze(['IEEE-754 binary64; finite normal inputs/results or algebraically witnessed zero only. No arbitrary precision.','Reverse search is explicitly bounded and never claims an exhaustive inverse. Catalog scope and external certification remain subject to review.'])});
}));
function binding(id:Next100MathId){const contract=next100MathContracts.find(row=>row.catalogId===id);if(!contract)throw Error('Unsupported math identity');return {contract,engine:launchDefinitions.find(row=>row.id===contract.engineId&&row.slug===contract.slug&&row.version===1)!};}
function zeroWitness(id:Next100MathId,v:Record<string,number>){switch(id){case 213:return v.numerator===0;case 221:return v.x===0;case 222:return v.base===0&&v.exp>0;case 223:return v.base===0&&v.exponent>0;case 224:return v.x===1;case 226:return v.a===0||(Number.isSafeInteger(v.a)&&Number.isSafeInteger(v.b)&&v.a%v.b===0);case 230:return true;case 231:return v.coefficient===0;case 234:return v.observed===v.actual;default:return false;}}
/** Captures only the exact existing version-one engine, before presentation. */
export function calculateNext100Math(id:Next100MathId,input:unknown){
 if(input&&typeof input==='object'&&!Array.isArray(input))input=copyCalculationData(input as Record<string,unknown>,{}).input;
 const {contract,engine}=binding(id);
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==contract.fields.length||Object.keys(input).some(key=>!contract.fields.some(field=>field.key===key)))throw Error('Exact math input fields required');
 const parsed=engine.inputSchema.parse(input);
 if(Object.values(parsed).some(value=>value!==0&&Math.abs(value)<2**-1022))throw Error('Input outside finite normal capture range');
 const output=engine.calculate(parsed,{});const value=output.result;
 if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022)||(value===0&&!zeroWitness(id,parsed)))throw Error('Output outside finite normal capture range');
 const snapshot=createCalculationSnapshot({calculatorSlug:contract.slug,calculatorVersion:1,input:parsed,output});
 Object.freeze(snapshot.input);Object.freeze(snapshot.output);Object.freeze(snapshot);
 return Object.freeze({snapshot,captureRevision:next100MathCaptureRevision,formula:contract.formula,steps:Object.freeze([Object.freeze({expression:contract.formula,value})]),unit:id===234?'%':''});
}
/** Explicit forward samples, with gaps for refused points and no interpolation claim. */
export function graphNext100Math(id:Next100MathId,input:Record<string,number>,samples:readonly number[]){
 calculateNext100Math(id,input);if(!Array.isArray(samples)||samples.length>101)throw Error('At most 101 explicit graph samples required');
 const {contract}=binding(id);
 return Object.freeze(samples.map(x=>{try{return Object.freeze({x,y:calculateNext100Math(id,{...input,[contract.solveFor]:x}).snapshot.output.result as number});}catch(error){return Object.freeze({x,error:error instanceof Error?error.message:'Refused sample'});}}));
}
/** A bounded inverse search supports non-injective and discrete functions without
 * inventing a unique answer. Callers supply candidate values for solveFor;
 * returned witnesses are replayed by the immutable forward engine. */
export function reverseNext100Math(id:Next100MathId,input:Record<string,number>,target:number,candidates:readonly number[]){
 calculateNext100Math(id,input);
 if(!Number.isFinite(target)||(target!==0&&Math.abs(target)<2**-1022))throw Error('Target must be finite normal or zero');
 if(!Array.isArray(candidates)||candidates.length===0||candidates.length>101)throw Error('Supply 1 through 101 explicit inverse candidates');
 const {contract}=binding(id);const seen=new Set<number>();
 const witnesses=[];
 for(const value of candidates){
  if(seen.has(value))continue;seen.add(value);
  try{const candidate=Object.freeze({...input,[contract.solveFor]:value});const replay=calculateNext100Math(id,candidate);const actual=replay.snapshot.output.result as number;
   // Exact machine-output equality is deliberate: no tolerance admits a false
   // discrete, rounding, or near-zero inverse witness.
   if(actual===target)witnesses.push(Object.freeze({value,input:candidate,replay}));
  }catch{/* A refused candidate is not a witness. */}
 }
 return Object.freeze({solveFor:contract.solveFor,target,exhaustive:false as const,searched:candidates.length,witnesses:Object.freeze(witnesses)});
}
