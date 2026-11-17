import {z} from 'zod';
import {pressureConverter} from '../../calculators/conversion/catalog-batch-2';
import {densityConverter,torqueConverter} from '../../calculators/conversion/catalog-batch-3';
import {copyCalculationData} from '../calculation-snapshot';
import {parsePublicationFactoryInput} from '../publication-factory-contracts-input';
import {sameRecordedJson} from '../recorded-json-equality';

/** Private methodology identities only; no registered version allocation. */
export const fixedFactorPrivateRevision='private-source-fixed-factor-20261109.1';
export const fixedFactorSourceArchiveSha256='2b0496305b2caa4748859667519ff7ed10dc241fcdad5d2ff0a23801457a447b';
export const fixedFactorPrivateContract='supplied-binary64/nearest-source-factors/ratio-first/normal-bounded';
export const fixedFactorMinimumMagnitude=2**-970;
export const fixedFactorMaximumMagnitude=2**990;
type Factor=Readonly<{numerator:string;denominator:string;nearest:number;bits:string}>;
const factor=(numerator:string,denominator:string,nearest:number,bits:string):Factor=>Object.freeze({numerator,denominator,nearest,bits});
const integer=(value:number)=>factor(String(value),'1',value,'');
const strictInput=z.object({value:z.number().finite(),fromUnit:z.string(),toUnit:z.string()}).strict();

/**
 * Reusable factory for genuinely changed source factors, never a v1 replacement.
 * Input Numbers are exact supplied binary64 values, not exact decimal text.
 * For bounded nonidentity input every ratio lies in (2^-30,2^30), hence exact
 * products lie in (2^-1000,2^1020): normal and finite. Each nearest factor has
 * relative representation error <=u; division and multiplication each <=u.
 * Relative forward error against exact source factors is bounded by
 * gamma4=4u/(1-4u), u=2^-53. Subnormal nonidentity work is outside this contract.
 */
function candidate(id:string,baseline:typeof pressureConverter|typeof densityConverter|typeof torqueConverter,table:Record<string,Factor>,methodology:string,limitations:readonly string[]){
 const factors=Object.freeze(table);
 return Object.freeze({
  id,implementationRevision:fixedFactorPrivateRevision,baselineEngineId:baseline.id,baselineEngineVersion:1 as const,
  allocatedSuccessorVersion:null,sourceArchiveSha256:fixedFactorSourceArchiveSha256,contract:fixedFactorPrivateContract,factors,
  qualification:Object.freeze({
   methodology,sourceApplicability:'PENDING',canonicalAdoptionAuthorized:false,
   inputInterpretation:'Exact supplied binary64 Number; no exact decimal-text quantization claim.',
   nonIdentityDomain:'Zero, or 2^-970 <= abs(value) <= 2^990; nonzero output normal and finite.',
   identityDomain:'Every finite supplied Number; zero normalized to standard JSON zero.',
   relativeBound:'gamma4 = 4u/(1-4u), u=2^-53, relative to supplied Number times exact rational unit ratio.',
   limitations:Object.freeze([...limitations])
  }),
  calculate(input:unknown){
   const parsed=baseline.inputSchema.parse(strictInput.parse(input));
   const {value,fromUnit,toUnit}=parsed;
   const from=factors[fromUnit],to=factors[toUnit];
   if(!Object.hasOwn(factors,fromUnit)||!Object.hasOwn(factors,toUnit))throw new RangeError('Unsupported private conversion unit');
   if(value===0||fromUnit===toUnit)return {result:value===0?0:value};
   const magnitude=Math.abs(value);
   if(magnitude<fixedFactorMinimumMagnitude||magnitude>fixedFactorMaximumMagnitude)throw new RangeError('Private conversion input outside bounded normal domain');
   const result=value*(from.nearest/to.nearest);
   if(!Number.isFinite(result)||Math.abs(result)<2**-1022)throw new RangeError('Private conversion result outside normal finite domain');
   return {result};
  }
 });
}

export const pressureFixedFactorPrivate=candidate('conversion.pressure.source-factor-private',pressureConverter,{
 pa:integer(1),kpa:integer(1000),mpa:integer(1e6),bar:integer(1e5),atm:integer(101325),
 psi:factor('8896443230521','1290320000',6894.757293168362,'40baeec1ddf70f99')
},'UCUM [psi]=[lbf_av]/[in_i]2; conventional pound-force and international inch.',[
 'Fixed scalar pressure-unit conversion only; no gauge/absolute reference-model conversion or pressure-offset inference.',
 'No competent applicability approval, canonical adoption or publication authority.'
]);
export const densityFixedFactorPrivate=candidate('conversion.density.source-factor-private',densityConverter,{
 kg_m3:integer(1),g_cm3:integer(1000),kg_l:integer(1000),
 lb_ft3:factor('28349523125','1769802912',16.018463373960138,'403004ba04035526')
},'UCUM [lb_av]/[ft_i]3; conventional avoirdupois pound and international foot.',[
 'Fixed scalar density-unit conversion; no material temperature, composition or buoyancy model.',
 'No competent applicability approval, canonical adoption or publication authority.'
]);
export const torqueFixedFactorPrivate=candidate('conversion.torque.source-factor-private',torqueConverter,{
 n_m:integer(1),kn_m:integer(1000),
 lbf_ft:factor('3389544870828501','2500000000000000',1.3558179483314003,'3ff5b16e29369c65'),
 lbf_in:factor('1129848290276167','10000000000000000',.1129848290276167,'3fbcec92e19e25dc')
},'UCUM [lbf_av].[ft_i] and [lbf_av].[in_i] as moments of force.',[
 'Torque/moment conversion only; equal dimensions do not reinterpret torque as energy or work.',
 'No competent applicability approval, canonical adoption or publication authority.'
]);
export const privateFixedFactorCandidates=Object.freeze([pressureFixedFactorPrivate,densityFixedFactorPrivate,torqueFixedFactorPrivate]);
export type PrivateFixedFactorId=(typeof privateFixedFactorCandidates)[number]['id'];
export type PrivateFixedFactorArtifact=Readonly<{
 transportVersion:1;privateId:string;implementationRevision:typeof fixedFactorPrivateRevision;
 contract:typeof fixedFactorPrivateContract;sourceArchiveSha256:typeof fixedFactorSourceArchiveSha256;
 baselineEngineId:string;baselineEngineVersion:1;allocatedSuccessorVersion:null;
 snapshot:Readonly<{input:Record<string,unknown>;output:Record<string,unknown>}>;
}>;
export function createPrivateFixedFactorSnapshot(id:PrivateFixedFactorId,input:unknown):PrivateFixedFactorArtifact{
 const engine=privateFixedFactorCandidates.find(row=>row.id===id);
 if(!engine)throw new Error('Unknown private fixed-factor identity');
 const parsed=strictInput.parse(input),output=engine.calculate(parsed);
 // JSON artifacts normalize signed zero explicitly; historical engines untouched.
 const normalized={...parsed,value:parsed.value===0?0:parsed.value};
 return Object.freeze({transportVersion:1,privateId:engine.id,implementationRevision:fixedFactorPrivateRevision,
  contract:fixedFactorPrivateContract,sourceArchiveSha256:fixedFactorSourceArchiveSha256,
  baselineEngineId:engine.baselineEngineId,baselineEngineVersion:1,allocatedSuccessorVersion:null,
  snapshot:copyCalculationData(normalized,output)});
}
const artifactSchema=z.object({transportVersion:z.literal(1),privateId:z.string(),implementationRevision:z.literal(fixedFactorPrivateRevision),
 contract:z.literal(fixedFactorPrivateContract),sourceArchiveSha256:z.literal(fixedFactorSourceArchiveSha256),baselineEngineId:z.string(),baselineEngineVersion:z.literal(1),allocatedSuccessorVersion:z.null(),
 snapshot:z.object({input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict()}).strict();
/** Inspect keys after syntax/numeric validation, including escaped key aliases. */
function rejectDuplicateKeys(text:string){
 const stack:(Set<string>|null)[]=[];
 for(let i=0;i<text.length;i++){
  const char=text[i];
  if(char==='{')stack.push(new Set());
  else if(char==='[')stack.push(null);
  else if(char==='}'||char===']')stack.pop();
  else if(char==='"'){
   const start=i;
   for(i++;i<text.length;i++){
    if(text[i]==='\\'){i++;continue;}
    if(text[i]==='"')break;
   }
   let next=i+1;while(/\s/.test(text[next]??'')&&next<text.length)next++;
   if(text[next]===':'){
    const keys=stack[stack.length-1],key=JSON.parse(text.slice(start,i+1)) as string;
    if(!keys||keys.has(key))throw new Error('Duplicate private snapshot key');
    keys.add(key);
   }
  }
 }
}
export function replayPrivateFixedFactorSnapshot(text:string):PrivateFixedFactorArtifact{
 if(typeof text!=='string'||text.length>2_000_000)throw new Error('Private fixed-factor snapshot size/type bound');
 const parsed=parsePublicationFactoryInput(text);rejectDuplicateKeys(text);
 const envelope=artifactSchema.parse(parsed);
 const expected=createPrivateFixedFactorSnapshot(envelope.privateId,envelope.snapshot.input);
 if(!sameRecordedJson(envelope,expected))throw new Error('Private fixed-factor snapshot input/output mismatch');
 return expected;
}
export function exportPrivateFixedFactorSnapshot(artifact:PrivateFixedFactorArtifact):string{
 return JSON.stringify(replayPrivateFixedFactorSnapshot(JSON.stringify(artifact)),null,2);
}
