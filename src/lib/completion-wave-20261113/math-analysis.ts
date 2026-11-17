import Decimal from 'decimal.js';
import {basicMathContracts,calculateBasicMath,basicMathCaptureRevision} from '../calculator-factory/cohorts/basic-math';

export type PairMathId=208|209|210|211|212|215|216;
const ids:readonly number[]=[208,209,210,211,212,215,216];
const D=Decimal.clone({precision:80});
function contract(id:PairMathId){
 if(!ids.includes(id))throw Error('Unsupported paired math profile');
 return basicMathContracts.find(row=>row.catalogId===id)!;
}
function checked(id:PairMathId,input:Readonly<Record<string,number>>){
 const row=contract(id);
 if(Object.keys(input).sort().join('|')!==row.fields.map(f=>f.key).sort().join('|'))throw Error('Supply exactly the declared input fields');
 return calculateBasicMath(id,input);
}
const formulas:Record<PairMathId,string>={208:'(next − old) / |old| × 100',209:'value × (1 + percent / 100)',210:'value × (1 − percent / 100)',211:'a / b',212:'a / b',215:'numerator / denominator',216:'Arithmetic mean of exactly a and b'};
/** The table and chart share these engine samples. A refusal is a gap, never a zero. */
export function analyzePairMath(id:PairMathId,input:Readonly<Record<string,number>>,field:string,samples:readonly number[]=[]){
 const delivered=checked(id,input),row=contract(id);
 if(!row.fields.some(f=>f.key===field))throw Error('Select a declared input field');
 if(!Array.isArray(samples)||samples.length>101||samples.some(x=>!Number.isFinite(x)))throw Error('Supply at most 101 finite explicit sample values');
 const points=Object.freeze(samples.map(x=>{
  try{return Object.freeze({x,y:checked(id,{...input,[field]:x}).snapshot.output.result as number});}
  catch(e){return Object.freeze({x,error:e instanceof Error?e.message:'Refused sample'});}
 }));
 return Object.freeze({...delivered,captureRevision:basicMathCaptureRevision,field,points,
  steps:Object.freeze([...row.fields.map(f=>Object.freeze({expression:f.label,value:input[f.key]})),Object.freeze({expression:formulas[id],value:delivered.snapshot.output.result as number})]),
  scope:row.scope,precision:'IEEE-754 binary64 approximate numeric output; displayed digits do not establish an exact decimal expansion. Reverse candidates are forward-verified within 8 relative machine epsilons.',
 });
}
export type PairMathSolution=Readonly<{status:'finite'|'none'|'nonunique';candidates:readonly Readonly<{value:number;forwardValue:number}>[];note:string}>;
/** Rearrangements of the existing two-input formula only. Every isolated solution
 * is recaptured through unchanged v1; rounded/unrepresentable candidates fail closed.
 * A zero coefficient is reported as nonunique rather than inventing a root.
 */
export function reversePairMath(id:PairMathId,input:Readonly<Record<string,number>>,field:string,target:number):PairMathSolution{
 checked(id,input);const row=contract(id);
 if(!row.fields.some(f=>f.key===field)||!Number.isFinite(target)||(target!==0&&Math.abs(target)<2**-1022))throw Error('Select a declared variable and finite normal or zero target');
 const t=new D(target),n=(key:string)=>new D(input[key]);
 const roots:{value:Decimal;sign?:1|-1}[]=[];let continuum=false;
 const divide=(numerator:Decimal,denominator:Decimal,sign?:1|-1)=>{
  if(denominator.isZero()){if(numerator.isZero())continuum=true;return;}
  roots.push({value:numerator.div(denominator),sign});
 };
 if(id===208){
  const r=t.div(100);
  if(field==='next')roots.push({value:n('old').plus(n('old').abs().mul(r))});
  else {divide(n('next'),new D(1).plus(r),1);divide(n('next'),new D(1).minus(r),-1);}
 }else if(id===209||id===210){
  const direction=id===209?1:-1;
  if(field==='value')divide(t,new D(1).plus(n('percent').div(100).mul(direction)));
  else if(n('value').isZero()){continuum=t.isZero();}
  else roots.push({value:t.div(n('value')).minus(1).mul(100*direction)});
 }else if(id===216){roots.push({value:t.mul(2).minus(n(field==='a'?'b':'a'))});}
 else {
  const numerator=id===215?'numerator':'a',denominator=id===215?'denominator':'b';
  if(field===numerator)roots.push({value:t.mul(n(denominator))});
  else divide(n(numerator),t);
 }
 const candidates:{value:number;forwardValue:number}[]=[];
 for(const root of roots){
  const value=root.value.toNumber();
  if(!Number.isFinite(value)||(root.sign===1&&value<=0)||(root.sign===-1&&value>=0)||candidates.some(c=>c.value===value))continue;
  try{
   const forwardValue=checked(id,{...input,[field]:value}).snapshot.output.result as number;
   const scale=Math.max(Math.abs(target),Math.abs(forwardValue));
   if(forwardValue!==target&&(scale===0||Math.abs(forwardValue/scale-target/scale)>8*Number.EPSILON))continue;
   candidates.push(Object.freeze({value,forwardValue}));
  }catch{/* Domain, overflow and underflow remain capture refusals. */}
 }
 return Object.freeze({status:continuum?'nonunique':candidates.length?'finite':'none',candidates:Object.freeze(candidates),note:continuum?'Infinitely many admissible values satisfy the algebraic equation; no unique input is selected.':candidates.length?'Approximate candidates verified through the unchanged forward engine.':'No isolated candidate passed the declared domain and forward verification.'});
}
