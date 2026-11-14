import {launchDefinitions, launchSpecs} from '../../../calculators/launch-portfolio';
import {createCalculationSnapshot} from '../../calculation-snapshot';

const rows = [
 [255,'hypotenuse-calculator','a','c = hypot(a, b)'],
 [256,'triangle-area-calculator','height','A = base × height / 2'],
 [259,'rectangle-area-calculator','width','A = length × width'],
 [260,'rectangle-perimeter-calculator','width','P = 2(length + width)'],
 [263,'circle-area-calculator','radius','A = πr²'],
 [264,'circle-circumference-calculator','radius','C = 2πr'],
 [265,'circle-diameter-calculator','radius','d = 2r'],
 [261,'square-area-calculator','side','A = side²'],
 [262,'square-perimeter-calculator','side','P = 4 × side'],
 [266,'parallelogram-area-calculator','height','A = base × height'],
 [267,'trapezoid-area-calculator','height','A = (a + b) × height / 2'],
 [269,'sphere-volume-calculator','radius','V = 4πr³ / 3'],
 [270,'sphere-surface-area-calculator','radius','A = 4πr²'],
 [271,'cylinder-volume-calculator','height','V = πr²height'],
 [273,'rectangular-prism-volume-calculator','height','V = length × width × height'],
] as const;
export type NextMathId = typeof rows[number][0];
export const nextMathCaptureRevision='private.geometry-completion.20261113.1';
export const nextMathContracts=Object.freeze(rows.map(([catalogId,slug,solveFor,formula])=>{
 const engine=launchDefinitions.find(row=>row.id===`launch-${slug}`&&row.slug===slug&&row.version===1);
 const spec=launchSpecs.find(row=>row.slug===slug);
 if(!engine||!spec)throw Error('Exact geometry engine unavailable');
 return Object.freeze({catalogId,slug,engineId:engine.id,version:1,title:engine.title,registered:true,primaryKey:'result',solveFor,formula,
 fields:Object.freeze(spec.fields.map(field=>Object.freeze({...field,kind:'number' as const}))),
 sourceEvidence:Object.freeze(['docs/calculator-first/authority-catalog.json','src/calculators/launch-portfolio.ts','data/verification/codex-a-standard-risk-goldens-2026-10-15.json']),
 scope:`Nonnegative dimensions in one consistent length unit. ${formula}. Area uses square units; volume uses cubic units.`,
 limitations:Object.freeze(['IEEE-754 binary64; finite normal results or witnessed zero only.','Reverse solves one named dimension with other dimensions fixed; degenerate nonunique solutions are refused.'])});
}));
function binding(id:NextMathId){const contract=nextMathContracts.find(row=>row.catalogId===id);if(!contract)throw Error('Unsupported geometry identity');return {contract,engine:launchDefinitions.find(row=>row.id===contract.engineId&&row.slug===contract.slug&&row.version===contract.version)!};}
function zeroWitness(id:NextMathId,v:Record<string,number>){switch(id){case 255:return v.a===0&&v.b===0;case 256:return v.base===0||v.height===0;case 259:return v.length===0||v.width===0;case 260:return v.length===0&&v.width===0;case 261:case 262:return v.side===0;case 266:return v.base===0||v.height===0;case 267:return (v.a===0&&v.b===0)||v.height===0;case 271:return v.radius===0||v.height===0;case 273:return v.length===0||v.width===0||v.height===0;default:return v.radius===0;}}
/** Strict capture uses the existing registered v1 engine without modifying its numerical behavior. */
export function calculateNextMath(id:NextMathId,input:unknown){
 const {contract,engine}=binding(id);
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length!==contract.fields.length||Object.keys(input).some(key=>!contract.fields.some(field=>field.key===key)))throw Error('Exact geometry input fields required');
 const parsed=engine.inputSchema.parse(input);
 if(Object.values(parsed).some(value=>value!==0&&Math.abs(value)<2**-1022))throw Error('Geometry input outside finite normal capture range');
 const output=engine.calculate(parsed,{});
 if(!Number.isFinite(output.result)||(output.result!==0&&Math.abs(output.result)<2**-1022)||(output.result===0&&!zeroWitness(id,parsed)))throw Error('Geometry output outside finite normal capture range');
 const snapshot=createCalculationSnapshot({calculatorSlug:contract.slug,calculatorVersion:1,input:parsed,output});
 Object.freeze(snapshot.input);Object.freeze(snapshot.output);Object.freeze(snapshot);
 return Object.freeze({snapshot,captureRevision:nextMathCaptureRevision,formula:contract.formula,steps:Object.freeze([Object.freeze({expression:contract.formula,value:output.result})]),unit:[269,271,273].includes(id)?'cubic units':[256,259,261,263,266,267,270].includes(id)?'square units':'length units'});
}
/** A target fixes the output and solves the contract's named dimension. Replay proves the candidate within binary64 tolerance. */
export function reverseNextMath(id:NextMathId,input:Record<string,number>,target:number){
 calculateNextMath(id,input);
 if(!Number.isFinite(target)||target<0)throw Error('Target must be finite and nonnegative');
 const {contract}=binding(id);let value:number;
 switch(id){
 case 255:if(target<input.b)throw Error('Hypotenuse target is below fixed leg');value=target===0?0:Math.sqrt((target-input.b)/target*(1+input.b/target))*target;break;
 case 256:if(input.base===0)throw Error('Zero base has no unique height');value=target/input.base*2;break;
 case 259:if(input.length===0)throw Error('Zero length has no unique width');value=target/input.length;break;
 case 260:value=target/2-input.length;break;
 case 263:value=Math.sqrt(target/Math.PI);break;
 case 264:value=target/(2*Math.PI);break;
 case 265:value=target/2;break;
 case 261:value=Math.sqrt(target);break;
 case 262:value=target/4;break;
 case 266:if(input.base===0)throw Error('Zero base has no unique height');value=target/input.base;break;
 case 267:if(input.a===0&&input.b===0)throw Error('Zero parallel sides have no unique height');value=(target/(input.a/2+input.b/2));break;
 case 269:value=Math.cbrt(target/(4*Math.PI/3));break;
 case 270:value=Math.sqrt(target/(4*Math.PI));break;
 case 271:if(input.radius===0)throw Error('Zero radius has no unique height');value=target/input.radius/input.radius/Math.PI;break;
 case 273:if(input.length===0||input.width===0)throw Error('Zero base has no unique height');value=target/input.length/input.width;break;
 }
 if(!Number.isFinite(value)||value<0||(value===0&&target!==0&&id!==255&&id!==260))throw Error('Reverse dimension outside supported range');
 const candidate=Object.freeze({...input,[contract.solveFor]:value});const replay=calculateNextMath(id,candidate);
 const actual=replay.snapshot.output.result as number;
 if(actual!==target&&Math.abs(actual-target)/Math.max(actual,target)>16*Number.EPSILON)throw Error('Reverse target does not reconcile');
 return Object.freeze({solveFor:contract.solveFor,value,input:candidate,replay});
}
/** Explicit samples only; refused dimensions produce graph gaps, never invented values. */
export function graphNextMath(id:NextMathId,input:Record<string,number>,samples:readonly number[]){
 calculateNextMath(id,input);if(!Array.isArray(samples)||samples.length>101)throw Error('At most 101 graph samples required');
 const {contract}=binding(id);return Object.freeze(samples.map(x=>{try{return Object.freeze({x,y:calculateNextMath(id,{...input,[contract.solveFor]:x}).snapshot.output.result as number});}catch(error){return Object.freeze({x,error:error instanceof Error?error.message:'Refused sample'});}}));
}
