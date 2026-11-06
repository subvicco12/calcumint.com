import {z} from 'zod';
import Decimal from 'decimal.js';
import {copyCalculationData} from '@/lib/calculation-snapshot';
import {convertGeometryUnit,getGeometryUnit} from './units';

/** Private successor mathematics only; no registered version or canonical adoption. */
export const fullVolumeRevision='experimental-volume-15-solids-1' as const;
export const fullVolumeSolids=Object.freeze(['rectangular_prism','cube','triangular_prism','base_area_prism','cylinder','hollow_cylinder','cone','conical_frustum','sphere','hemisphere','base_area_pyramid','rectangular_pyramid','ellipsoid','ring_torus','spherical_cap'] as const);
export type FullVolumeSolid=typeof fullVolumeSolids[number];
export const VOLUME_IMPLEMENTATION_REVISION=fullVolumeRevision;
const volumeUnits=['m3','cm3','mm3','in3','ft3','L','mL'] as const;
const quantitySchema=z.object({value:z.union([z.string().max(4096),z.number().finite()]),unit:z.string().max(20)}).strict();
export const fullVolumeInputSchema=z.object({solid:z.enum(fullVolumeSolids),mode:z.enum(['forward','inverse']),parameters:z.record(z.string().max(10),quantitySchema),outputUnit:z.enum(volumeUnits).default('m3'),target:z.string().max(10).optional(),targetVolume:quantitySchema.optional(),radiusMode:z.enum(['radius','diameter']).default('radius'),axisMode:z.enum(['semiaxes','full-axes']).default('semiaxes'),baseMode:z.enum(['rectangular','square']).default('rectangular'),targetUnit:z.string().max(20).optional()}).strict();
export type FullVolumeInput=z.infer<typeof fullVolumeInputSchema>;
export const fullVolumeParameterNames:Readonly<Record<FullVolumeSolid,readonly string[]>>=Object.freeze({rectangular_prism:['l','w','h'],cube:['s'],triangular_prism:['b','t','L'],base_area_prism:['B','h'],cylinder:['r','h'],hollow_cylinder:['R','r','h'],cone:['r','h'],conical_frustum:['R','r','h'],sphere:['r'],hemisphere:['r'],base_area_pyramid:['B','h'],rectangular_pyramid:['l','w','h'],ellipsoid:['a','b','c'],ring_torus:['R','r'],spherical_cap:['R','h']});
for(const names of Object.values(fullVolumeParameterNames))Object.freeze(names);
export const fullVolumeMetadata=Object.freeze(fullVolumeSolids.map(id=>Object.freeze({id,label:id.split('_').map(s=>s[0].toUpperCase()+s.slice(1)).join(' '),parameters:fullVolumeParameterNames[id],inverseTargets:fullVolumeParameterNames[id]})));
const expressions:Record<FullVolumeSolid,string>={rectangular_prism:'V=l*w*h',cube:'V=s^3',triangular_prism:'V=b*t*L/2',base_area_prism:'V=B*h',cylinder:'V=pi*r^2*h',hollow_cylinder:'V=pi*(R-r)*(R+r)*h',cone:'V=pi*r^2*h/3',conical_frustum:'V=pi*h*(R^2+R*r+r^2)/3',sphere:'V=4*pi*r^3/3',hemisphere:'V=2*pi*r^3/3',base_area_pyramid:'V=B*h/3',rectangular_pyramid:'V=l*w*h/3',ellipsoid:'V=4*pi*a*b*c/3',ring_torus:'V=2*pi^2*R*r^2',spherical_cap:'V=pi*h^2*(R-h/3)'};
const sourcedSolids=new Set<FullVolumeSolid>(['rectangular_prism','cube','cylinder','cone','sphere']);
const D=Decimal.clone({precision:100,rounding:Decimal.ROUND_HALF_EVEN,maxE:1000,minE:-1000});
const token=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
type FailureStatus='domain-error'|'precision-unavailable'|'no-solution';
class VolumeFailure extends Error{constructor(readonly status:FailureStatus,message:string,readonly field?:string){super(message);}}
const fail=(status:FailureStatus,message:string,field?:string):never=>{throw new VolumeFailure(status,message,field);};
export type FullVolumeResult={status:FailureStatus;message:string;field?:string;implementationRevision:typeof fullVolumeRevision}|{status:'finite';implementationRevision:typeof fullVolumeRevision;catalogId:275;scope:'PRIVATE_EXPERIMENTAL';inputs:FullVolumeInput;parametersSI:Record<string,string>;volume:{raw:string;unit:string};canonicalVolumeM3:string;formula:string;warnings:string[];sourceProof:'ESTABLISHED_EQUATION_REVIEW_PENDING'|'DERIVATION_REVIEW_PENDING';solvedParameter?:{name:string;raw:string;unit:string};relativeResidual?:number;bracket?:[number,number];iterations?:number;lexicalFormUnavailable:string[]};
function parseQuantity(q:z.infer<typeof quantitySchema>,dimension:'length'|'area'|'volume',field:string){
 const raw=String(q.value).trim();
 if(!token.test(raw))fail('domain-error','A complete decimal or scientific token is required',field);
 let value:Decimal;
 try{value=new D(raw);}catch{return fail('domain-error','Invalid decimal value',field);}
 if(!value.isFinite()||value.isZero()&&/[1-9]/.test(raw.split(/[eE]/)[0]))fail('precision-unavailable','Decimal is outside the supported numerical envelope',field);
 if(getGeometryUnit(q.unit)?.dimension!==dimension)fail('domain-error',`Expected a supported ${dimension} unit`,field);
 if(dimension!=='volume'&&value.sd()>15)fail('precision-unavailable','Dimensions accept at most15 significant decimal digits',field);
 const canonical=convertGeometryUnit(raw,q.unit,dimension==='area'?'m2':dimension==='volume'?'m3':'m');
 const normalized=new D(canonical);
 if(!normalized.isFinite()||!value.isZero()&&normalized.isZero())fail('precision-unavailable','Unit normalization is outside the declared decimal envelope',field);
 return normalized;
}
function validateDimensions(solid:FullVolumeSolid,p:Record<string,Decimal>){
 for(const name of fullVolumeParameterNames[solid]){
  const value=p[name];
  if(!value)fail('domain-error','Required dimension missing',name);
  const allowedZero=name==='r'&&(solid==='hollow_cylinder'||solid==='conical_frustum');
  if(value.lt(0)||value.isZero()&&!allowedZero)fail('domain-error','Nondegenerate solids require positive dimensions',name);
  const area=name==='B';
  if(!value.isZero()&&(value.lt(area?'1e-24':'1e-12')||value.gt(area?'1e24':'1e12')))fail('precision-unavailable','Dimension is outside the declared normalized SI envelope',name);
 }
 const {R,r,h}=p;
 if(solid==='hollow_cylinder'){
  if(!r.lt(R))fail('domain-error','Inner radius must be smaller than outer radius','r');
  if(!r.isZero()&&R.minus(r).div(R).lt('1e-6'))fail('precision-unavailable','Shell thickness is below the validated relative envelope','r');
 }
 if(solid==='conical_frustum'&&r.gt(R))fail('domain-error','Small radius must not exceed the large radius','r');
 if(solid==='ring_torus'){
  if(!R.gt(r))fail('domain-error','Only ring tori with major radius greater than tube radius are supported','R');
  if(R.minus(r).div(R).lt('1e-6'))fail('precision-unavailable','Ring separation is below the validated relative envelope','R');
 }
 if(solid==='spherical_cap'){
  if(h.gt(R.times(2)))fail('domain-error','Cap height must not exceed sphere diameter','h');
  if(h.div(R).lt('1e-6'))fail('precision-unavailable','Cap height is below the validated relative envelope','h');
 }
}
function forward(solid:FullVolumeSolid,p:Record<string,number>):number{
 const {l,w,h,s,b,t,L,B,r,R,a,c}=p;
 switch(solid){
  case'rectangular_prism':return l*w*h;
  case'cube':return s*s*s;
  case'triangular_prism':return b*t*L/2;
  case'base_area_prism':return B*h;
  case'cylinder':return Math.PI*r*r*h;
  case'hollow_cylinder':return Math.PI*(R-r)*(R+r)*h;
  case'cone':return Math.PI*r*r*h/3;
  case'conical_frustum':return Math.PI*h*(R*R+R*r+r*r)/3;
  case'sphere':return 4*Math.PI*r*r*r/3;
  case'hemisphere':return 2*Math.PI*r*r*r/3;
  case'base_area_pyramid':return B*h/3;
  case'rectangular_pyramid':return l*w*h/3;
  case'ellipsoid':return 4*Math.PI*a*b*c/3;
  case'ring_torus':return 2*Math.PI*Math.PI*R*r*r;
  case'spherical_cap':return Math.PI*h*h*(R-h/3);
 }
}
function inverse(solid:FullVolumeSolid,p:Record<string,number>,target:string,V:number):{value:number;bracket?:[number,number];iterations?:number}{
 const {l,w,h,b,t,L,B,r,R,a,c}=p;let value:number;
 switch(solid){
  case'rectangular_prism':case'rectangular_pyramid':{const numerator=solid==='rectangular_pyramid'?3*V:V;value=target==='l'?numerator/(w*h):target==='w'?numerator/(l*h):numerator/(l*w);break;}
  case'cube':value=Math.cbrt(V);break;
  case'triangular_prism':value=target==='b'?2*V/(t*L):target==='t'?2*V/(b*L):2*V/(b*t);break;
  case'base_area_prism':case'base_area_pyramid':{const numerator=solid==='base_area_pyramid'?3*V:V;value=target==='B'?numerator/h:numerator/B;break;}
  case'cylinder':case'cone':{const numerator=solid==='cone'?3*V:V;value=target==='r'?Math.sqrt(numerator/(Math.PI*h)):numerator/(Math.PI*r*r);break;}
  case'hollow_cylinder':
   if(target==='h')value=V/(Math.PI*(R-r)*(R+r));
   else if(target==='R')value=Math.sqrt(r*r+V/(Math.PI*h));
   else {const radicand=R*R-V/(Math.PI*h);if(Math.abs(radicand)/(R*R)<=1e-4)fail('precision-unavailable','Inner-radius inverse is cancellation-sensitive at the solid-cylinder boundary','targetVolume');if(radicand<0)fail('no-solution','Target volume exceeds the outer cylinder volume','targetVolume');value=Math.sqrt(radicand);}
   break;
  case'conical_frustum':
   if(target==='h')value=3*V/(Math.PI*(R*R+R*r+r*r));
   else {const K=3*V/(Math.PI*h);if(target==='R'){
    if(r>0&&Math.abs(K-3*r*r)/Math.max(K,3*r*r)<=1e-14)fail('precision-unavailable','Ordered frustum boundary is unresolved at binary64 precision','targetVolume');if(K<3*r*r)fail('no-solution','Target would invert the ordered frustum radii','targetVolume');value=2*(K-r*r)/(Math.sqrt(4*K-3*r*r)+r);
   }else{if(Math.abs(K-R*R)/Math.max(K,R*R)<=1e-4||Math.abs(K-3*R*R)/Math.max(K,3*R*R)<=1e-14)fail('precision-unavailable','Small-radius inverse is cancellation-sensitive or at an unresolved ordering boundary','targetVolume');if(K<R*R||K>3*R*R)fail('no-solution','Target volume has no ordered small-radius solution','targetVolume');value=2*(K-R*R)/(Math.sqrt(4*K-3*R*R)+R);}}
   break;
  case'sphere':value=Math.cbrt(3*V/(4*Math.PI));break;
  case'hemisphere':value=Math.cbrt(3*V/(2*Math.PI));break;
  case'ellipsoid':value=target==='a'?3*V/(4*Math.PI*b*c):target==='b'?3*V/(4*Math.PI*a*c):3*V/(4*Math.PI*a*b);break;
  case'ring_torus':
   if(target==='R'){if(V<=2*Math.PI*Math.PI*r*r*r)fail('no-solution','Target is not a ring torus','targetVolume');value=V/(2*Math.PI*Math.PI*r*r);}
   else{if(V>=2*Math.PI*Math.PI*R*R*R)fail('no-solution','Target is not a ring torus','targetVolume');value=Math.sqrt(V/(2*Math.PI*Math.PI*R));}
   break;
  case'spherical_cap':
   if(target==='R'){value=V/(Math.PI*h*h)+h/3;if(Math.abs(V-Math.PI*h*h*h/6)/Math.max(V,Math.PI*h*h*h/6)<=1e-14)fail('precision-unavailable','Cap-height boundary requires higher precision','targetVolume');if(value<h/2)fail('no-solution','Target cannot contain the specified cap height','targetVolume');break;}
   {const max=4*Math.PI*R*R*R/3;if(Math.abs(max-V)/max<=1e-8)fail('precision-unavailable','Cap height inverse is ill-conditioned near the full-sphere endpoint','targetVolume');if(V>max)fail('no-solution','Target exceeds the full sphere volume','targetVolume');if(V===max)fail('precision-unavailable','Rounded full-sphere boundary requires higher-precision endpoint evidence','targetVolume');
    let low=0,high=2*R;
    for(let iterations=1;iterations<=128;iterations++){
     const mid=low+(high-low)/2;const volume=forward(solid,{R,h:mid});const residual=Math.abs(volume-V)/V;
     if(residual<=1e-11&&high-low<=1e-11*Math.max(Math.abs(mid),1e-12))return{value:mid,bracket:[low,high],iterations};
     if(mid===low||mid===high)fail('precision-unavailable','Cap inverse bracket stagnated without both accuracy criteria','targetVolume');
     if(volume<V)low=mid;else high=mid;
    }
    return fail('precision-unavailable','Cap inverse exhausted its128iteration budget','targetVolume');
   }
 }
 return{value};
}
function numberMap(p:Record<string,Decimal>){return Object.fromEntries(Object.entries(p).map(([name,value])=>[name,value.toNumber()]));}
/** Pure plan-independent computation; caller must retain experimental scope and contract evidence. */
export function calculateFullVolume(raw:unknown):FullVolumeResult{
 try{
  const clean=copyCalculationData({input:raw},{}).input.input;
  const parsed=fullVolumeInputSchema.safeParse(clean);
  if(!parsed.success)return{status:'domain-error',message:parsed.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; '),implementationRevision:fullVolumeRevision};
  const input=parsed.data;
  const square=input.solid==='rectangular_pyramid'&&input.baseMode==='square';
  const names:readonly string[]=square?['s','h']:fullVolumeParameterNames[input.solid];
  const diameterSolids=new Set<FullVolumeSolid>(['cylinder','hollow_cylinder','cone','conical_frustum','sphere','hemisphere','ring_torus','spherical_cap']);
  if(input.radiusMode==='diameter'&&!diameterSolids.has(input.solid))fail('domain-error','Diameter mode is not applicable to this solid','radiusMode');
  if(input.axisMode==='full-axes'&&input.solid!=='ellipsoid')fail('domain-error','Full-axis mode applies only to ellipsoids','axisMode');
  if(input.baseMode==='square'&&input.solid!=='rectangular_pyramid')fail('domain-error','Square base mode applies only to rectangular pyramids','baseMode');
  if(input.mode==='forward'&&(input.target!==undefined||input.targetVolume!==undefined||input.targetUnit!==undefined))fail('domain-error','Forward mode rejects inactive inverse fields');
  if(input.mode==='inverse'&&(!input.target||!names.includes(input.target)||!input.targetVolume))fail('domain-error','Inverse mode requires a declared target and targetVolume');
  const active=names.filter(name=>input.mode!=='inverse'||name!==input.target);
  if(Object.keys(input.parameters).some(name=>!active.includes(name))||active.some(name=>!Object.hasOwn(input.parameters,name)))fail('domain-error','Parameters must contain exactly the active fixed dimensions','parameters');
  const parameters:Record<string,Decimal>={};
  for(const name of active){
   let value=parseQuantity(input.parameters[name],name==='B'?'area':'length',name);
   if(input.radiusMode==='diameter'&&(name==='r'||name==='R')||input.axisMode==='full-axes'&&['a','b','c'].includes(name))value=value.div(2);
   parameters[name]=value;
  }
  let solved:ReturnType<typeof inverse>|undefined,targetVolume:number|undefined;
  if(input.mode==='inverse'){
   const target=parseQuantity(input.targetVolume!,'volume','targetVolume');
   if(target.lte(0))fail('no-solution','Nondegenerate solid requires a positive target volume','targetVolume');
   if(target.lt('1e-36')||target.gt('1e38'))fail('precision-unavailable','Target volume is outside the declared envelope','targetVolume');
   // Validate all known dimensions without fabricating a value for the unknown.
   for(const [name,value]of Object.entries(parameters)){
    const allowedZero=name==='r'&&(input.solid==='hollow_cylinder'||input.solid==='conical_frustum');
    if(value.lt(0)||value.isZero()&&!allowedZero)fail('domain-error','Fixed dimension must be positive',name);
    if(!value.isZero()&&(value.lt(name==='B'?'1e-24':'1e-12')||value.gt(name==='B'?'1e24':'1e12')))fail('precision-unavailable','Fixed dimension outside normalized envelope',name);
   }
   targetVolume=target.toNumber();
   if(input.targetUnit&&getGeometryUnit(input.targetUnit)?.dimension!==(input.target==='B'?'area':'length'))fail('domain-error','Inverse target unit has the wrong dimension','targetUnit');
   if(square){const known=numberMap(parameters);solved={value:input.target==='s'?Math.sqrt(3*targetVolume/known.h):3*targetVolume/(known.s*known.s)};}
   else solved=inverse(input.solid,numberMap(parameters),input.target!,targetVolume);
   if(!Number.isFinite(solved.value))fail('precision-unavailable','Inverse result is not finite',input.target);
   if(solved.value===0)fail('precision-unavailable','A rounded inverse boundary cannot establish an exact zero dimension',input.target);
   parameters[input.target!]=new D(String(solved.value));
  }
  const engineParameters:Record<string,Decimal>=square?{l:parameters.s,w:parameters.s,h:parameters.h}:parameters;
  validateDimensions(input.solid,engineParameters);
  const canonicalVolume=forward(input.solid,numberMap(engineParameters));
  let exactRationalVolume:Decimal|undefined;
  if(input.solid==='cube')exactRationalVolume=engineParameters.s.pow(3);
  else if(input.solid==='rectangular_prism'||input.solid==='rectangular_pyramid')exactRationalVolume=engineParameters.l.times(engineParameters.w).times(engineParameters.h).div(input.solid==='rectangular_pyramid'?3:1);
  else if(input.solid==='triangular_prism')exactRationalVolume=engineParameters.b.times(engineParameters.t).times(engineParameters.L).div(2);
  else if(input.solid==='base_area_prism'||input.solid==='base_area_pyramid')exactRationalVolume=engineParameters.B.times(engineParameters.h).div(input.solid==='base_area_pyramid'?3:1);
  const rangeValue=exactRationalVolume??new D(String(canonicalVolume));
  if(!Number.isFinite(canonicalVolume)||rangeValue.lt('1e-36')||rangeValue.gt('1e38'))fail('precision-unavailable','Computed volume is outside the declared envelope');
  const residual=targetVolume===undefined?undefined:Math.abs(canonicalVolume-targetVolume)/targetVolume;
  if(residual!==undefined&&residual>1e-11)fail('precision-unavailable','Inverse failed its forward residual criterion',input.target);
  let solvedParameter:{name:string;raw:string;unit:string}|undefined;
  if(solved){let value=new D(String(solved.value));if(input.radiusMode==='diameter'&&['r','R'].includes(input.target!)||input.axisMode==='full-axes'&&['a','b','c'].includes(input.target!))value=value.times(2);const base=input.target==='B'?'m2':'m',unit=input.targetUnit??base;solvedParameter={name:input.target!,raw:convertGeometryUnit(value.toString(),base,unit),unit};}
  const sourceProof=sourcedSolids.has(input.solid)?'ESTABLISHED_EQUATION_REVIEW_PENDING':'DERIVATION_REVIEW_PENDING';
  return{status:'finite',implementationRevision:fullVolumeRevision,catalogId:275,scope:'PRIVATE_EXPERIMENTAL',inputs:input,parametersSI:Object.fromEntries(Object.entries(parameters).map(([name,value])=>[name,value.toString()])),volume:{raw:convertGeometryUnit(String(canonicalVolume),'m3',input.outputUnit),unit:input.outputUnit},canonicalVolumeM3:String(canonicalVolume),formula:expressions[input.solid],warnings:['Private experimental implementation; canonical certification and publication pending.',sourceProof==='DERIVATION_REVIEW_PENDING'?'Formula follows the approved proposed contract; independent derivation/source applicability review remains pending.':'Source-established equation still requires exact-version applicability and competent review.','Binary64 approximate calculation with Math.PI; declared geometry envelope, not a full-domain accuracy proof.'],sourceProof,...(solvedParameter?{solvedParameter,relativeResidual:residual,...(solved?.bracket?{bracket:solved.bracket,iterations:solved.iterations}:{})}:{}),lexicalFormUnavailable:[...Object.entries(input.parameters).filter(([,q])=>typeof q.value==='number').map(([name])=>name),...(typeof input.targetVolume?.value==='number'?['targetVolume']:[])]};
 }catch(error){if(error instanceof VolumeFailure)return{status:error.status,message:error.message,...(error.field?{field:error.field}:{}),implementationRevision:fullVolumeRevision};return{status:'domain-error',message:error instanceof Error?error.message:'Invalid volume input',implementationRevision:fullVolumeRevision};}
}
