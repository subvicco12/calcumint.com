import {launchDefinitions} from '@/calculators/launch-portfolio';
import {copyCalculationData,createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {createFactoryWorkflows} from '../workflows';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';

export const remainderCaptureRevision='private.remainder-exact-zero.20261114.2';
const engine=launchDefinitions.find(row=>row.id==='launch-remainder-calculator'&&row.slug==='remainder-calculator'&&row.version===1)!;
export const remainderCaptureSuccessorContract=Object.freeze({
 catalogId:226,engineId:'launch-remainder-calculator',calculatorSlug:'remainder-calculator',calculatorVersion:1,captureRevision:remainderCaptureRevision,
 captureAdopted:false,canonicalApproved:false,publicationAuthorized:false,
 scope:'Finite normal binary64 inputs, nonzero divisor; normal signed JavaScript remainder or exact dyadically witnessed zero. Not Euclidean modulo.',
 source:Object.freeze({path:'docs/milestone100-20261114/math/ecma-numeric.md',sha256:'cbb37f968ab61d946e8434b7a8e50a98071220628a3d74c3e74a214dcf550366',section:'Number::remainder',applicabilityApproved:false}),
});

/** Exact dyadic integer relation, not rounded floating-point division. The
 * largest shift is bounded by the two finite binary64 exponent fields. */
export function exactBinary64Multiple(dividend:number,divisor:number){
 if(!Number.isFinite(dividend)||!Number.isFinite(divisor)||divisor===0)return false;
 if(dividend===0)return true;
 const parts=(value:number)=>{
  const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,Math.abs(value));
  const bits=view.getBigUint64(0),exponent=Number((bits>>52n)&2047n),fraction=bits&((1n<<52n)-1n);
  return {significand:exponent===0?fraction:(1n<<52n)|fraction,power:exponent===0?-1074:exponent-1075};
 };
 const a=parts(dividend),b=parts(divisor),shift=a.power-b.power;
 return shift>=0?(a.significand<<BigInt(shift))%b.significand===0n:a.significand%(b.significand<<BigInt(-shift))===0n;
}

/** Private capture successor only. Registered v1 mathematics, old capture and
 * historical replay are untouched; adoption is deliberately not registered. */
export function calculateRemainderCaptureSuccessor(input:unknown){
 const clean=copyCalculationData({input},{}).input.input;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).sort().join(',')!=='a,b')throw Error('Exact remainder input fields required');
 const parsed=engine.inputSchema.parse(clean);
 if(Object.values(parsed).some(value=>value!==0&&Math.abs(value)<2**-1022))throw Error('Input outside finite normal capture range');
 const output=engine.calculate(parsed,{}),value=output.result;
 if(!Number.isFinite(value)||(value!==0&&Math.abs(value)<2**-1022)||(value===0&&!exactBinary64Multiple(parsed.a,parsed.b)))throw Error('Output outside finite normal capture range');
 const snapshot=createCalculationSnapshot({calculatorSlug:engine.slug,calculatorVersion:engine.version,input:parsed,output});
 return Object.freeze({snapshot,captureRevision:remainderCaptureRevision,formula:'JavaScript signed remainder: a % b',steps:Object.freeze([Object.freeze({expression:'a % b',value})]),unit:''});
}

export function getRemainderCaptureWorkflows(){
 return createFactoryWorkflows({identity:{catalogId:226,engineId:engine.id,calculatorSlug:engine.slug,calculatorVersion:engine.version,sourceVersion:`factory-wave1-20261112.1/${engine.id}@${engine.version}/${remainderCaptureRevision}`},execute:raw=>{
  if(Object.keys(raw).sort().join(',')!=='a,b')throw Error('Exact remainder input fields required');
  return calculateRemainderCaptureSuccessor({a:requiredCalculatorNumber(raw.a),b:requiredCalculatorNumber(raw.b)}).snapshot;
 }});
}
