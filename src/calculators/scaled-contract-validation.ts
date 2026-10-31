/** Validation infrastructure only. Never grants canonical mapping, certification or publication. */
import {z} from 'zod';
import {copyCalculationData} from '../lib/calculation-snapshot';
import {equalCompletionJson} from './completion-contracts';
export type ContractAdapter={key:string;catalogId:number;version:number;input:z.ZodType;output:z.ZodType;methodology:string;run:(input:unknown,plan:'free'|'pro'|'business')=>unknown;read:(artifact:unknown)=>unknown;getOutput:(artifact:unknown)=>Record<string,unknown>;getInput:(artifact:unknown)=>unknown;getIdentity:(artifact:unknown)=>{key:string;catalogId:number;version:number}};
export type Witness={name:string;input:unknown;expected:Record<string,unknown>;absoluteTolerance:number};
export type ContractCheck={requirement:string;case:string;passed:boolean;detail:string};
export function sameContractData(a:unknown,b:unknown){return equalCompletionJson(a,b);}
export function assertGolden(actual:unknown,expected:unknown,path='output'):void{
 if(expected!==null&&typeof expected==='object'){
  if(actual===null||typeof actual!=='object'||Array.isArray(actual)!==Array.isArray(expected))throw Error(path+' type mismatch');
  if(Array.isArray(expected)&&(!Array.isArray(actual)||actual.length!==expected.length))throw Error(path+' array length');
  for(const [k,v] of Object.entries(expected)){if(!Object.hasOwn(actual,k))throw Error(path+'.'+k+' missing');assertGolden((actual as Record<string,unknown>)[k],v,path+'.'+k);}return;
 }
 if(!Object.is(actual,expected))throw Error(path+' expected '+String(expected)+'; actual '+String(actual));
}
export function validateScaledContract(adapter:ContractAdapter,witnesses:readonly Witness[],invalid:readonly unknown[]){
 const checks:ContractCheck[]=[];const check=(requirement:string,name:string,fn:()=>void)=>{try{fn();checks.push({requirement,case:name,passed:true,detail:'Passed actual-engine check'});}catch(error){checks.push({requirement,case:name,passed:false,detail:error instanceof Error?error.message:String(error)});}};
 check('definition','required-evidence',()=>{if(!adapter.key||!Number.isInteger(adapter.catalogId)||adapter.catalogId<1||adapter.catalogId>540||!Number.isSafeInteger(adapter.version)||adapter.version<1||!adapter.methodology.trim())throw Error('Incomplete identity/version/methodology');if(witnesses.length<2||invalid.length<1||witnesses.some(w=>Object.keys(w.expected).length===0))throw Error('At least two nonempty goldens and one negative required');});
 for(const w of witnesses){let artifact:unknown;check('inputs',w.name,()=>{adapter.input.parse(w.input);if(!w.input||typeof w.input!=='object'||Array.isArray(w.input))throw Error('Record input required');if(adapter.input.safeParse({...w.input,undeclaredCanonicalField:true}).success)throw Error('Unknown field accepted');});
 check('identity-version',w.name,()=>{const identity=adapter.getIdentity(adapter.run(w.input,'free'));if(identity.key!==adapter.key||identity.catalogId!==adapter.catalogId||identity.version!==adapter.version)throw Error('Actual artifact identity/version differs from declared adapter');});
 check('goldens-and-rounding',w.name,()=>{artifact=adapter.run(w.input,'free');const out=adapter.getOutput(artifact);adapter.output.parse(out);assertScaledGolden(out,w.expected,w.absoluteTolerance);});
 check('plan-parity',w.name,()=>{const free=adapter.run(w.input,'free');for(const p of ['pro','business'] as const)if(!sameContractData(free,adapter.run(w.input,p)))throw Error('Plan changed mathematical artifact');});
 check('versioned-replay',w.name,()=>{artifact=adapter.run(w.input,'free');const parsed=JSON.parse(JSON.stringify(artifact));if(!sameContractData(adapter.read(parsed),artifact))throw Error('Original version replay differs');if(!sameContractData(adapter.run(adapter.getInput(parsed),'free'),artifact))throw Error('Scenario/history baseline differs');});
 check('tamper-rejection',w.name,()=>{const original=adapter.run(w.input,'free') as {calculation:{calculatorVersion:number;output:Record<string,unknown>}};for(const alter of [(a:typeof original)=>{a.calculation.calculatorVersion+=1;},(a:typeof original)=>{a.calculation.output={forged:true};}]){const fake=JSON.parse(JSON.stringify(original));alter(fake);let rejected=false;try{adapter.read(fake);}catch{rejected=true;}if(!rejected)throw Error('Changed version/output accepted');}});
 }
 invalid.forEach((input,i)=>check('domain-negative','negative-'+i,()=>{let rejected=false;try{adapter.run(input,'free');}catch{rejected=true;}if(!rejected)throw Error('Invalid domain accepted');}));
 return copyCalculationData({report:{adapterKey:adapter.key,catalogId:adapter.catalogId,engineVersion:adapter.version,checks,engineeringPassed:checks.every(c=>c.passed),canonicalAccepted:false,certificationAuthorized:false,publicationAuthorized:false,releaseHold:true}},{}).input.report as {adapterKey:string;catalogId:number;engineVersion:number;checks:ContractCheck[];engineeringPassed:boolean;canonicalAccepted:false;releaseHold:true};
}

/** Only the primary scalar may use a declared absolute error; identity/schema/replay stay exact. */
export function assertScaledGolden(actual:Record<string,unknown>,expected:Record<string,unknown>,tolerance:number){
 if(!Number.isFinite(tolerance)||tolerance<0||tolerance>1e-7)throw Error('Invalid declared absolute tolerance');
 const {value,...rest}=expected;assertGolden(actual,rest);
 if(!Object.hasOwn(expected,'value')||!Object.hasOwn(actual,'value'))throw Error('Primary witness required');
 if(tolerance===0||value===null||value===0||actual.value===0){assertGolden(actual.value,value);return;}
 if(typeof value!=='number'||typeof actual.value!=='number'||!Number.isFinite(value)||!Number.isFinite(actual.value)||Math.sign(actual.value)!==Math.sign(value)||Math.abs(actual.value-value)>tolerance)throw Error('Primary result outside independently declared absolute tolerance');
}
