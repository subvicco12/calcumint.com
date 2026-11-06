import {z} from 'zod';
import Decimal from 'decimal.js';
import {copyCalculationData} from '@/lib/calculation-snapshot';
import {convertGeometryUnit,getGeometryUnit} from './units';

/** Isolated full-contract implementation candidate; not a registered engine version. */
export const fullSlopeRevision='private-slope-full-20261106.1' as const;
const D=Decimal.clone({precision:100,rounding:Decimal.ROUND_HALF_EVEN,minE:-10000,maxE:10000});
const token=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const scalar=z.union([z.string().max(4096).refine(s=>token.test(s.trim()),'Complete decimal token required'),z.number().finite()]);
const unit=z.enum(['unitless','m','cm','mm','km','in','ft','s','min','h']);
const axes={xUnit:unit.optional(),yUnit:unit.optional()};
const pair={x0:scalar.optional(),y0:scalar.optional()};
const two=z.object({mode:z.literal('two_points'),x1:scalar,y1:scalar,x2:scalar,y2:scalar,...axes,x1Unit:unit.optional(),x2Unit:unit.optional(),y1Unit:unit.optional(),y2Unit:unit.optional()}).strict();
const rise=z.object({mode:z.literal('rise_run'),rise:scalar,run:scalar,...pair,...axes}).strict().refine(v=>(v.x0===undefined)===(v.y0===undefined),'An anchor requires both x0 and y0');
const point=z.object({mode:z.literal('point_slope'),x0:scalar,y0:scalar,orientation:z.enum(['finite','vertical']),m:scalar.optional(),...axes}).strict().refine(v=>v.orientation==='finite'?v.m!==undefined:v.m===undefined,'Finite orientation requires m; vertical orientation forbids m');
const intercept=z.object({mode:z.literal('slope_intercept'),m:scalar,b:scalar,...axes}).strict();
const general=z.object({mode:z.literal('general_line'),A:scalar,B:scalar,C:scalar,...axes}).strict();
export const fullSlopeInputSchema=z.discriminatedUnion('mode',[two,rise,point,intercept,general]);
export type FullSlopeInput=z.infer<typeof fullSlopeInputSchema>;
export type FullSlopeStatus='finite'|'vertical-line'|'degenerate'|'no-solution'|'underdetermined'|'domain-error'|'precision-unavailable';
export type FullSlopeLine={kind:'nonvertical';anchor:{x:number;y:number};slope:number}|{kind:'vertical';x:number};
export type SlopeInputProvenance={original:string|null;normalized:string;lexicalForm:'SUPPLIED_TEXT'|'UNAVAILABLE_NUMBER_TRANSPORT';negativeZero:boolean;unit?:string};
export type FullSlopeResult={revision:typeof fullSlopeRevision;status:FullSlopeStatus;message:string;inputs:Record<string,SlopeInputProvenance>;units:{x:string;y:string;slope:string};values:Record<string,number>;line:FullSlopeLine|null;warnings:string[];fieldErrors:Record<string,string>};
class PrecisionFailure extends Error{}
const text=(raw:string|number)=>typeof raw==='string'?raw.trim():Object.is(raw,-0)?'-0':String(raw);
const checked=(raw:string|number,ratio=false,generated=false,deferMagnitude=false):Decimal=>{
 const value=new D(text(raw));
 if(!value.isFinite()||(value.isZero()&&/[1-9]/.test(text(raw).split(/[eE]/)[0]))||(!generated&&value.sd()>15)||(!deferMagnitude&&!value.isZero()&&(value.abs().gt(ratio?'1e24':'1e12')||value.abs().lt(ratio?'1e-24':'1e-12'))))throw new PrecisionFailure('Input lies outside the declared 15-significant-digit geometry envelope');
 return value;
};
const outputNumber=(v:Decimal,ratio=false):number=>{
 if(!v.isFinite()||(!v.isZero()&&(v.abs().gt(ratio?'1e24':'1e12')||v.abs().lt(ratio?'1e-24':'1e-12'))))throw new PrecisionFailure('Generated value lies outside the declared geometry envelope');
 const n=v.toNumber();if(!Number.isFinite(n)||(!v.isZero()&&n===0))throw new PrecisionFailure('Generated value cannot be represented without underflow/overflow');return n===0?0:n;
};
const wellConditionedDelta=(a:Decimal,b:Decimal)=>{
 const delta=b.minus(a);if(!delta.isZero()&&D.max(a.abs(),b.abs()).div(delta.abs()).gt(1000))throw new PrecisionFailure('Coordinate cancellation requires wider precision');return delta;
};
const safeCopied=(input:unknown)=>copyCalculationData({input},{}).input.input;

function calculateFullSlopeCandidate(input:unknown,generatedFields:ReadonlySet<string>=new Set()):FullSlopeResult{
 const result:FullSlopeResult={revision:fullSlopeRevision,status:'domain-error',message:'Invalid slope input',inputs:{},units:{x:'unitless',y:'unitless',slope:'unitless/unitless'},values:{},line:null,warnings:[],fieldErrors:{}};
 try{
  const parsed=fullSlopeInputSchema.safeParse(safeCopied(input));
  if(!parsed.success){for(const issue of parsed.error.issues)result.fieldErrors[issue.path.join('.')||'input']=issue.message;return result;}
  const v=parsed.data;const xUnit=v.xUnit??'unitless',yUnit=v.yUnit??'unitless';result.units={x:xUnit,y:yUnit,slope:`${yUnit}/${xUnit}`};
  const values:Record<string,Decimal>={};
  for(const [key,raw]of Object.entries(v)){
   if(key==='mode'||key==='orientation'||key.endsWith('Unit'))continue;
   if(typeof raw!=='string'&&typeof raw!=='number')continue;
   const coordinateUnitKey=`${key}Unit`;
   const suppliedUnit=coordinateUnitKey in v?(v as unknown as Record<string,string>)[coordinateUnitKey]:undefined;
   const isRatio=key==='m';let n=checked(raw,isRatio,generatedFields.has(key),suppliedUnit!==undefined);
   const axis=key.startsWith('x')||key==='run'?'x':key.startsWith('y')||key==='rise'||key==='b'?'y':null;
   const selectedUnit=axis==='x'?xUnit:axis==='y'?yUnit:undefined;
   if(suppliedUnit&&selectedUnit){n=new D(convertGeometryUnit(n.toString(),suppliedUnit,selectedUnit));outputNumber(n);}
   values[key]=n;
   result.inputs[key]={original:typeof raw==='string'?raw:null,normalized:n.toString(),lexicalForm:typeof raw==='string'?'SUPPLIED_TEXT':'UNAVAILABLE_NUMBER_TRANSPORT',negativeZero:n.isZero()&&n.isNegative(),...(selectedUnit?{unit:selectedUnit}:{})};
  }
  let m:Decimal|undefined,anchor:{x:Decimal;y:Decimal}|undefined,vertical:Decimal|undefined;
  const outcome=(status:FullSlopeStatus,message:string)=>{result.status=status;result.message=message;return result;};
  if(v.mode==='two_points'){
   // Establish exact geometric classification before conditioning finite ratios.
   const dx=values.x2.minus(values.x1),dy=values.y2.minus(values.y1);
   if(dx.isZero()&&dy.isZero())return outcome('degenerate','Coincident points do not determine a unique line');
   anchor={x:values.x1,y:values.y1};
   if(dx.isZero()||dy.isZero()){
    for(const [key,value]of [['dx',dx],['dy',dy]] as const){try{result.values[key]=outputNumber(value);}catch(error){if(!(error instanceof PrecisionFailure))throw error;result.warnings.push(`${key} omitted: ${error.message}; exact line classification retained`);}}
    if(dx.isZero())vertical=values.x1;else m=new D(0);
   }else{
    wellConditionedDelta(values.x1,values.x2);wellConditionedDelta(values.y1,values.y2);result.values.dx=outputNumber(dx);result.values.dy=outputNumber(dy);m=dy.div(dx);
   }
  }else if(v.mode==='rise_run'){
   result.values.dx=outputNumber(values.run);result.values.dy=outputNumber(values.rise);
   if(values.run.isZero()&&values.rise.isZero())return outcome('degenerate','Zero rise and run do not determine a direction');
   if(values.x0!==undefined)anchor={x:values.x0,y:values.y0};
   if(values.run.isZero()){
    if(anchor)vertical=anchor.x;
    else return outcome('vertical-line','Vertical direction has undefined slope; no absolute line location was supplied');
   }else m=values.rise.div(values.run);
  }else if(v.mode==='point_slope'){
   anchor={x:values.x0,y:values.y0};if(v.orientation==='vertical')vertical=values.x0;else m=values.m;
  }else if(v.mode==='slope_intercept'){
   m=values.m;anchor={x:new D(0),y:values.b};
  }else{
   const {A,B,C}=values;
   if(A.isZero()&&B.isZero())return C.isZero()?outcome('underdetermined','The identity 0 = 0 describes the whole plane, not a unique line'):outcome('no-solution','The equation has no points');
   const coefficientScale=D.max(A.abs(),B.abs());
   for(const a of [A,B])if(!a.isZero()&&coefficientScale.div(a.abs()).gt('1e12'))throw new PrecisionFailure('General-line coefficient ratio exceeds the declared conditioning envelope');
   if(B.isZero())vertical=C.div(A);else{m=A.negated().div(B);anchor={x:new D(0),y:C.div(B)};outputNumber(anchor.y);}
  }
  if(vertical!==undefined){const x=outputNumber(vertical);result.line={kind:'vertical',x};result.values.xIntercept=x;return outcome('vertical-line',`Vertical line x = ${x}; slope is undefined`);}
  if(m===undefined)throw Error('Internal missing slope');
  result.values.slope=outputNumber(m,true);
  if(anchor){
   result.line={kind:'nonvertical',anchor:{x:outputNumber(anchor.x),y:outputNumber(anchor.y)},slope:result.values.slope};
   const optional=(key:string,value:Decimal,a:Decimal,b:Decimal)=>{
    try{if(!value.isZero()&&D.max(a.abs(),b.abs()).div(value.abs()).gt(1000))throw new PrecisionFailure('Intercept cancellation requires wider precision');result.values[key]=outputNumber(value);}
    catch(e){if(!(e instanceof PrecisionFailure))throw e;result.warnings.push(`${key}: ${e.message}; valid point-slope representation retained`);}
   };
   const mx=m.times(anchor.x);optional('yIntercept',anchor.y.minus(mx),anchor.y,mx);
   if(!m.isZero()){const ym=anchor.y.div(m);optional('xIntercept',anchor.x.minus(ym),anchor.x,ym);}
  }
  const xMeta=getGeometryUnit(xUnit)!,yMeta=getGeometryUnit(yUnit)!;
  if(xMeta.dimension===yMeta.dimension){
   const normalized=m.times(yMeta.toSI).div(xMeta.toSI);const ratio=outputNumber(normalized,true);
   result.values.normalizedRatio=ratio;result.values.gradePercent=ratio*100;result.values.angleRadians=Math.atan(ratio);
  }
  return outcome('finite',m.isZero()?'Horizontal line/direction; slope is zero':'Finite slope computed from the selected mode');
 }catch(error){
  result.status=error instanceof PrecisionFailure?'precision-unavailable':'domain-error';result.message=error instanceof Error?error.message:'Invalid slope input';result.values={};result.line=null;return result;
 }
}

export function calculateFullSlope(input:unknown):FullSlopeResult{return calculateFullSlopeCandidate(input);}

const ordinary={x1:scalar,y1:scalar,x2:scalar,y2:scalar,m:scalar};
export const fullSlopeInverseSchema=z.discriminatedUnion('target',[
 z.object({target:z.literal('y2'),x1:ordinary.x1,y1:ordinary.y1,x2:ordinary.x2,m:ordinary.m}).strict(),
 z.object({target:z.literal('y1'),x1:ordinary.x1,x2:ordinary.x2,y2:ordinary.y2,m:ordinary.m}).strict(),
 z.object({target:z.literal('x2'),x1:ordinary.x1,y1:ordinary.y1,y2:ordinary.y2,m:ordinary.m}).strict(),
 z.object({target:z.literal('x1'),x2:ordinary.x2,y1:ordinary.y1,y2:ordinary.y2,m:ordinary.m}).strict(),
 z.object({target:z.literal('rise'),run:scalar,m:scalar}).strict(),z.object({target:z.literal('run'),rise:scalar,m:scalar}).strict(),
 z.object({target:z.literal('intercept_b'),x0:scalar,y0:scalar,m:scalar}).strict(),
 z.object({target:z.literal('line_y'),line:fullSlopeInputSchema,x:scalar}).strict(),z.object({target:z.literal('line_x'),line:fullSlopeInputSchema,y:scalar}).strict(),
]);
export type FullSlopeInverseResult={status:'unique'|'no-solution'|'underdetermined'|'domain-error'|'precision-unavailable';target:string;message:string;value?:number;forwardResidual?:number;inputs:Record<string,string>};
export function solveFullSlope(input:unknown):FullSlopeInverseResult{
 const result:FullSlopeInverseResult={status:'domain-error',target:'',message:'Invalid inverse input',inputs:{}};
 try{
  const parsed=fullSlopeInverseSchema.safeParse(safeCopied(input));if(!parsed.success){result.message=parsed.error.issues.map(i=>i.message).join('; ');return result;}
  const v=parsed.data;result.target=v.target;const n:Record<string,Decimal>={};
  for(const [k,r]of Object.entries(v))if(k!=='target'&&k!=='line'&&(typeof r==='string'||typeof r==='number')){n[k]=checked(r,k==='m');result.inputs[k]=text(r);}
  const classify=(status:'no-solution'|'underdetermined',message:string)=>{result.status=status;result.message=message;return result;};
  let answer:Decimal,forward:FullSlopeResult|undefined,expected:Decimal|undefined;
  if(v.target==='line_y'||v.target==='line_x'){
   const f=calculateFullSlope(v.line);if(f.status==='precision-unavailable')throw new PrecisionFailure(f.message);
   if(!f.line)return classify('no-solution','A unique anchored line is required');
   if(f.line.kind==='vertical'){
    if(v.target==='line_y')return new D(f.line.x).eq(n.x)?classify('underdetermined','Every y on this vertical line is admissible'):classify('no-solution','Selected x is not on the vertical line');
    answer=new D(f.line.x);
   }else{
    const {anchor,slope}=f.line;const m=new D(slope),x0=new D(anchor.x),y0=new D(anchor.y);
    if(v.target==='line_y')answer=y0.plus(m.times(n.x.minus(x0)));
    else{
     if(m.isZero())return y0.eq(n.y)?classify('underdetermined','Every x on this horizontal line is admissible'):classify('no-solution','Selected y is not on the horizontal line');
     answer=x0.plus(n.y.minus(y0).div(m));
    }
   }
   const value=outputNumber(answer);result.status='unique';result.value=value;
   const line=f.line;
   const residual=line.kind==='vertical'?Math.abs(value-line.x):v.target==='line_y'?Math.abs(value-(line.anchor.y+line.slope*(n.x.toNumber()-line.anchor.x))):Math.abs(n.y.toNumber()-(line.anchor.y+line.slope*(value-line.anchor.x)));
   const scale=Math.max(Math.abs(v.target==='line_y'?value:n.y?.toNumber()??value),1e-12);
   if(residual>1e-11*scale)throw new PrecisionFailure('Inverse line residual exceeds declared policy');
   result.forwardResidual=residual;result.message='Unique value on the selected line';return result;
  }
  const m=n.m;
  if(v.target==='y2'||v.target==='y1'){
   const dx=wellConditionedDelta(n.x1,n.x2);if(dx.isZero())return classify('no-solution','Coincident x coordinates cannot define the requested finite two-point slope');
   answer=v.target==='y2'?n.y1.plus(m.times(dx)):n.y2.minus(m.times(dx));
   forward=calculateFullSlopeCandidate({mode:'two_points',x1:n.x1.toString(),x2:n.x2.toString(),y1:v.target==='y1'?outputNumber(answer):n.y1.toString(),y2:v.target==='y2'?outputNumber(answer):n.y2.toString()},new Set([v.target]));expected=m;
  }else if(v.target==='x2'||v.target==='x1'){
   const dy=wellConditionedDelta(n.y1,n.y2);
   if(m.isZero())return dy.isZero()?classify('underdetermined','Any distinct x coordinate in the envelope gives zero slope'):classify('no-solution','Zero slope cannot connect different y coordinates');
   if(dy.isZero())return classify('no-solution','The algebraic candidate is coincident and is not an admissible slope solution');
   answer=v.target==='x2'?n.x1.plus(dy.div(m)):n.x2.minus(dy.div(m));
   forward=calculateFullSlopeCandidate({mode:'two_points',x1:v.target==='x1'?outputNumber(answer):n.x1.toString(),x2:v.target==='x2'?outputNumber(answer):n.x2.toString(),y1:n.y1.toString(),y2:n.y2.toString()},new Set([v.target]));expected=m;
  }else if(v.target==='rise'){
   if(n.run.isZero())return classify('no-solution','A finite slope requires nonzero run');answer=m.times(n.run);forward=calculateFullSlopeCandidate({mode:'rise_run',rise:outputNumber(answer),run:n.run.toString()},new Set(['rise']));expected=m;
  }else if(v.target==='run'){
   if(m.isZero())return n.rise.isZero()?classify('underdetermined','Any nonzero run in the envelope gives zero slope'):classify('no-solution','Zero slope cannot have nonzero rise');
   if(n.rise.isZero())return classify('no-solution','The algebraic candidate has zero run and is inadmissible');answer=n.rise.div(m);forward=calculateFullSlopeCandidate({mode:'rise_run',rise:n.rise.toString(),run:outputNumber(answer)},new Set(['run']));expected=m;
  }else{
   const product=m.times(n.x0);answer=n.y0.minus(product);if(!answer.isZero()&&D.max(n.y0.abs(),product.abs()).div(answer.abs()).gt(1000))throw new PrecisionFailure('Intercept cancellation requires wider precision');
   forward=calculateFullSlope({mode:'point_slope',orientation:'finite',m:m.toString(),x0:n.x0.toString(),y0:n.y0.toString()});
  }
  const value=outputNumber(answer);
  if(forward.status!=='finite')throw new PrecisionFailure(`Forward verification refused the inverse candidate: ${forward.message}`);
  const observed=expected?forward.values.slope:forward.values.yIntercept;
  if(observed===undefined)throw new PrecisionFailure('Forward verification did not produce the target');
  const exact=expected??answer;const residual=new D(observed).minus(exact).abs();
  if(exact.isZero()?!residual.isZero():residual.gt(exact.abs().times('1e-11')))throw new PrecisionFailure('Inverse forward residual exceeds declared policy');
  result.status='unique';result.value=value;result.forwardResidual=residual.toNumber();result.message='Unique solution verified by the same forward calculation';return result;
 }catch(error){result.status=error instanceof PrecisionFailure?'precision-unavailable':'domain-error';result.message=error instanceof Error?error.message:'Invalid inverse input';delete result.value;delete result.forwardResidual;return result;}
}

export type SlopeViewport={xmin:number;xmax:number;ymin:number;ymax:number};
export type SlopeClip={status:'segment';points:{x:number;y:number}[]}|{status:'offscreen'|'no-line'|'domain-error';points:[]};
/** Analytic line clipping. This is presentation data and never changes the authoritative slope. */
export function clipFullSlopeLine(result:FullSlopeResult,viewport:SlopeViewport):SlopeClip{
 const {xmin,xmax,ymin,ymax}=viewport;
 if(![xmin,xmax,ymin,ymax].every(Number.isFinite)||xmin>=xmax||ymin>=ymax||[xmin,xmax,ymin,ymax].some(n=>Math.abs(n)>1e12))return{status:'domain-error',points:[]};
 const line=result.line;if(!line)return{status:'no-line',points:[]};
 if(line.kind==='vertical')return line.x<xmin||line.x>xmax?{status:'offscreen',points:[]}:{status:'segment',points:[{x:line.x,y:ymin},{x:line.x,y:ymax}]};
 const points:{x:number;y:number}[]=[];
 const add=(x:number,y:number)=>{if(!Number.isFinite(x)||!Number.isFinite(y)||x<xmin||x>xmax||y<ymin||y>ymax)return;if(!points.some(p=>p.x===x&&p.y===y))points.push({x:x===0?0:x,y:y===0?0:y});};
 const {anchor,slope:m}=line;add(xmin,anchor.y+m*(xmin-anchor.x));add(xmax,anchor.y+m*(xmax-anchor.x));
 if(m!==0){add(anchor.x+(ymin-anchor.y)/m,ymin);add(anchor.x+(ymax-anchor.y)/m,ymax);}
 if(points.length===0)return{status:'offscreen',points:[]};
 points.sort((a,b)=>a.x-b.x||a.y-b.y);return{status:'segment',points:points.length>2?[points[0],points[points.length-1]]:points};
}
export function sweepFullSlope(input:unknown,variable:string,values:readonly(string|number)[]):{value:string|number;result:FullSlopeResult}[]{
 const parsed=fullSlopeInputSchema.parse(safeCopied(input));const allowed:Record<string,readonly string[]>={two_points:['x1','y1','x2','y2'],rise_run:['rise','run'],point_slope:['m','x0','y0'],slope_intercept:['m','b'],general_line:['A','B','C']};
 if(!allowed[parsed.mode].includes(variable)||values.length<1||values.length>1001)throw new RangeError('Select one active variable and1–1001 bounded sweep values');
 return values.map(value=>({value,result:calculateFullSlope({...parsed,[variable]:value})}));
}
