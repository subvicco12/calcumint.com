import {basicMathCaptureRevision,calculateBasicMath} from '../cohorts/basic-math';

export type ScalarMathId=218|219|220;
export type MathGraphPoint=Readonly<{x:number;y?:number;error?:string}>;
const identities={218:{formula:'x × x',inverse:'x = ±√y'},219:{formula:'x × x × x',inverse:'x = ∛y'},220:{formula:'√x',inverse:'x = y × y; y ≥ 0'}} as const;

/** Reverse a requested output, retaining both real branches of the square.
 * Inverses are binary64 approximations, not assertions of exact forward equality.
 * Candidates must remain capturable under the unchanged normal-output policy.
 */
export function reverseScalarMath(id:ScalarMathId,target:number):readonly number[]{
 if(!Number.isFinite(target)||(id!==219&&target<0))throw Error('Target is outside the real inverse domain');
 const root=id===218?Math.sqrt(target):id===219?Math.cbrt(target):target*target;
 if(!Number.isFinite(root)||(root===0&&target!==0)||(root!==0&&Math.abs(root)<2**-1022))throw Error('Inverse is outside the finite normal input range');
 const candidates=id===218&&root!==0?[-root,root]:[root===0?0:root];
 for(const x of candidates){
  const actual=calculateBasicMath(id,{x}).snapshot.output.result as number;
  // Eight relative binary64 epsilons cover cube-root + two multiplications.
  const scale=Math.max(Math.abs(target),Math.abs(actual));
  if(actual!==target&&(scale===0||Math.abs(actual-target)/scale>8*Number.EPSILON))throw Error('Inverse does not reconcile with forward calculation');
 }
 return Object.freeze(candidates);
}

/** Adds the catalog's scalar advanced steps, reverse solve and bounded sampled
 * graph, using the retained engine for every forward value. Graphs are samples,
 * with gaps for refused points; interpolation is not an engine guarantee.
 */
export function completeScalarMath(id:ScalarMathId,x:number,samples:readonly number[]=[]){
 if(!identities[id])throw Error('Unsupported scalar math identity');
 if(!Array.isArray(samples)||samples.length>101)throw Error('Graph requires at most 101 explicit sample points');
 const delivered=calculateBasicMath(id,{x});
 const value=delivered.snapshot.output.result as number;
 const graph:readonly MathGraphPoint[]=Object.freeze(samples.map(sample=>{
  try{return Object.freeze({x:sample,y:calculateBasicMath(id,{x:sample}).snapshot.output.result as number});}
  catch(error){return Object.freeze({x:sample,error:error instanceof Error?error.message:'Refused point'});}
 }));
 return Object.freeze({...delivered,captureRevision:basicMathCaptureRevision,
  steps:Object.freeze([Object.freeze({expression:'x',value:x}),Object.freeze({expression:identities[id].formula,value})]),
  inverse:identities[id].inverse,rounding:'IEEE-754 binary64; reverse candidates are approximate; raw output is preserved.',
  graph});
}
