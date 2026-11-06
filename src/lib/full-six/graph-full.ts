import {z} from 'zod';
import {copyCalculationData} from '@/lib/calculation-snapshot';
import {compileFullGraphExpression,evaluateFullGraphExpression,GraphComputeError,graphRaw,parseGraphDecimal,type GraphBudget,type GraphNode} from './graph-expression';
import {evaluateFullGraphDerivative,type GraphDerivativeResult} from './graph-derivative';
import {guardFullGraphDomain} from './graph-domain';
export const graphImplementationRevision='full-six-graph-private-experimental-1' as const;
export const fullGraphInputSchema=z.object({
 catalogId:z.union([z.literal(235),z.literal(251)]),expressions:z.array(z.string().min(1).max(500)).min(1).max(6),minX:z.string().max(64),maxX:z.string().max(64),
 angleMode:z.enum(['radians','degrees']).default('radians'),parameters:z.object({a:z.string().max(64).optional(),b:z.string().max(64).optional(),c:z.string().max(64).optional()}).strict().optional(),
 minY:z.string().max(64).optional(),maxY:z.string().max(64).optional(),derivativeAt:z.string().max(64).optional(),
}).strict().superRefine((v,ctx)=>{if(v.catalogId===251&&v.derivativeAt!==undefined)ctx.addIssue({code:'custom',message:'Point derivative analysis belongs to Graphing235'});if(v.catalogId===251&&v.angleMode==='degrees')ctx.addIssue({code:'custom',message:'Function Plotter supports radians only'});if((v.minY===undefined)!==(v.maxY===undefined))ctx.addIssue({code:'custom',message:'Both viewport y bounds are required'});});
export type FullGraphInput=z.infer<typeof fullGraphInputSchema>;
export interface FullGraphSample{x:number;rawX:string;y:string|null;status:string;segmentId:number|null;}
export interface FullGraphCell{left:number;right:number;status:'accepted'|'unresolved';reason:string;errorPx:number|null;segmentId:number|null;}
export interface FullGraphCurve{expression:string;normalizedAst:string;samples:FullGraphSample[];cells:FullGraphCell[];gaps:FullGraphCell[];clippedSampleCount:number;sampledRange:{min:string;max:string}|null;status:'sampled'|'partial'|'budget-exhausted';}
export interface FullGraphResult{
 scope:'PRIVATE_EXPERIMENTAL';implementationRevision:typeof graphImplementationRevision;catalogId:235|251;baselineEngineId:string;baselineVersion:1;
 status:'finite'|'domain-error'|'precision-unavailable'|'budget-exhausted'|'cancelled';request:FullGraphInput;curves:FullGraphCurve[];derivatives:GraphDerivativeResult[];coverage:'sampled-incomplete';
 viewport:{width:800;height:480;minY:string;maxY:string};budget:{operations:number;pointEvaluations:number;domainEvaluations:number};limitations:readonly string[];message:string;
}
interface WorkCell{left:number;right:number;depth:number;}
class CellQueue{
 private heap:WorkCell[]=[];
 get length(){return this.heap.length;}
 private higher(a:WorkCell,b:WorkCell){const wa=a.right-a.left,wb=b.right-b.left;return wa>wb||wa===wb&&a.left<b.left;}
 push(c:WorkCell){const h=this.heap;h.push(c);let i=h.length-1;while(i>0){const p=(i-1)>>1;if(!this.higher(h[i],h[p]))break;[h[i],h[p]]=[h[p],h[i]];i=p;}}
 pop():WorkCell{const h=this.heap,first=h[0],last=h.pop()!;if(h.length){h[0]=last;let i=0;while(true){let best=i;const a=2*i+1,b=a+1;if(a<h.length&&this.higher(h[a],h[best]))best=a;if(b<h.length&&this.higher(h[b],h[best]))best=b;if(best===i)break;[h[i],h[best]]=[h[best],h[i]];i=best;}}return first;}
}
const limitations=Object.freeze([
 'Private experimental revision; no registered engine adoption, canonical certification or publication authority.',
 'Coverage is sampled-incomplete. Accepted cells report observed quarter/midpoint chord error and conservative experimental domain guards, not rigorous continuity or uniform error proof.',
 'Automatic y viewport is clipped to [-1e9,1e9]; clippedSampleCount retains the count, and raw table samples are never clipped.','Elementary functions use host Math binary64. Cross-platform elementary error warranty and independent full-domain qualification remain unestablished.',
 'Point derivatives preserve original-domain checks and expose individual typed refusals; full derivative overlay/extrema and domain proof remain incomplete.','Root/intersection search, extrema, quadrature, inverse, parametric/polar, target solving, sensitivity and professional-report acceptance remain incomplete in this implementation.',
]);
function errorStatus(e:unknown):FullGraphResult['status']{return e instanceof GraphComputeError?e.code==='CANCELLED'?'cancelled':e.code==='BUDGET_EXHAUSTED'?'budget-exhausted':['NUMERIC_UNCERTAIN','RANGE_UNDERFLOW','RANGE_UNSUPPORTED'].includes(e.code)?'precision-unavailable':'domain-error':'domain-error';}
export function calculateFullGraph(raw:unknown,controls:{cancelled?:()=>boolean}={}):FullGraphResult{
 let request:FullGraphInput={catalogId:251,expressions:[],minX:'',maxX:'',angleMode:'radians'};
 const curves:FullGraphCurve[]=[];const derivatives:GraphDerivativeResult[]=[];const budget:GraphBudget={operations:0,maxOperations:8000000,cancelled:controls.cancelled};let points=0,domains=0;
 let yMin=-1,yMax=1;const result=(status:FullGraphResult['status'],message:string):FullGraphResult=>({scope:'PRIVATE_EXPERIMENTAL',implementationRevision:graphImplementationRevision,catalogId:request.catalogId,baselineEngineId:request.catalogId===235?'advanced-math.graphing':'advanced-math.function-plotter-2d',baselineVersion:1,status,request,curves,derivatives,coverage:'sampled-incomplete',viewport:{width:800,height:480,minY:graphRaw(yMin),maxY:graphRaw(yMax)},budget:{operations:budget.operations,pointEvaluations:points,domainEvaluations:domains},limitations,message});
 try{
  const copied=copyCalculationData({request:raw},{}).input.request;request=fullGraphInputSchema.parse(copied);
  const min=parseGraphDecimal(request.minX),max=parseGraphDecimal(request.maxX),mid=min+(max-min)/2;
  if(!(min<mid&&mid<max))throw new GraphComputeError('RANGE_UNSUPPORTED','GRID_RESOLUTION: three distinct representable coordinates required');
  const parameters=Object.fromEntries(Object.entries(request.parameters??{}).map(([k,v])=>[k,parseGraphDecimal(v)])) as Partial<Record<'a'|'b'|'c',number>>;
  const options={angleMode:request.angleMode,parameters,budget};
  const asts=request.expressions.map(s=>compileFullGraphExpression(s,{parameters:Object.keys(parameters) as ('a'|'b'|'c')[]}));
  if(request.minY!==undefined){yMin=parseGraphDecimal(request.minY);yMax=parseGraphDecimal(request.maxY!);if(!(yMin<yMax))throw new GraphComputeError('SYNTAX_ERROR','Viewport minimum must be below maximum');}
  const seedValues:number[]=[];
  const caches=asts.map(()=>new Map<string,FullGraphSample>());
  const sample=(ast:GraphNode,curveIndex:number,x:number):FullGraphSample=>{
   const key=graphRaw(x),cache=caches[curveIndex];const existing=cache.get(key);if(existing)return existing;
   if(points>=131072||cache.size>=32768)throw new GraphComputeError('BUDGET_EXHAUSTED','Graph sample budget exhausted');
   points++;let s:FullGraphSample;
   try{const y=evaluateFullGraphExpression(ast,x,options);s={x,rawX:key,y:graphRaw(y),status:'finite',segmentId:null};}
   catch(e){if(e instanceof GraphComputeError&&['CANCELLED','BUDGET_EXHAUSTED'].includes(e.code))throw e;s={x,rawX:key,y:null,status:e instanceof GraphComputeError?e.code:'NUMERIC_UNCERTAIN',segmentId:null};}
   cache.set(key,s);return s;
  };
  asts.forEach((ast,i)=>{for(let n=0;n<=80;n++){const x=n===80?max:min+(max-min)*n/80,s=sample(ast,i,x);if(s.y!==null)seedValues.push(Number(s.y));}});
  if(request.minY===undefined&&seedValues.length){yMin=Math.min(...seedValues);yMax=Math.max(...seedValues);if(yMin===yMax){const padding=Math.max(1,Math.abs(yMin)*.05);yMin-=padding;yMax+=padding;}else{const padding=(yMax-yMin)*.05;yMin-=padding;yMax+=padding;}}
  if(request.minY===undefined){yMin=Math.max(-1e9,Math.min(1e9,yMin));yMax=Math.max(-1e9,Math.min(1e9,yMax));if(yMin===yMax){if(yMin===1e9)yMin-=1;else if(yMax===-1e9)yMax+=1;else{yMin-=1;yMax+=1;}}}
  let partial=false;
  for(let index=0;index<asts.length;index++){
   const ast=asts[index],queue=new CellQueue(),cells:FullGraphCell[]=[];const operationStart=budget.operations,domainStart=domains;
   for(let n=0;n<80;n++)queue.push({left:min+(max-min)*n/80,right:n===79?max:min+(max-min)*(n+1)/80,depth:0});
   budget.maxOperations=Math.min(8000000,operationStart+2000000);
   let exhausted=false;let activeCell:WorkCell|null=null;
   try{
    while(queue.length){
     const c=queue.pop(),width=c.right-c.left,center=c.left+width/2;activeCell=c;
     if(budget.operations-operationStart>=2000000||domains-domainStart>=128000)throw new GraphComputeError('BUDGET_EXHAUSTED','Per-curve graph operation/domain budget exhausted');
     domains++;const domain=guardFullGraphDomain(ast,c.left,c.right,options);
     const xs=[c.left,c.left+width/4,center,c.left+3*width/4,c.right];
     const samples=xs.map(x=>sample(ast,index,x));let errorPx:number|null=null;
     const finite=samples.every(s=>s.y!==null);
     if(finite){const ys=samples.map(s=>Number(s.y));errorPx=Math.max(...ys.slice(1,4).map((y,k)=>Math.abs(y-(ys[0]+(ys[4]-ys[0])*(k+1)/4))/(yMax-yMin)*480));}
     if(domain.safe&&finite&&errorPx!==null&&errorPx<=.5){cells.push({left:c.left,right:c.right,status:'accepted',reason:'OBSERVED_CHORD_ERROR_WITH_EXPERIMENTAL_DOMAIN_GUARD',errorPx,segmentId:null});activeCell=null;continue;}
     const allSameInvalid=samples.every(s=>s.y===null)&&new Set(samples.map(s=>s.status)).size===1;
     if(c.depth>=24||!(c.left<center&&center<c.right)||allSameInvalid){cells.push({left:c.left,right:c.right,status:'unresolved',reason:domain.safe?'NUMERIC_OR_VISUAL_UNRESOLVED':domain.reason,errorPx,segmentId:null});activeCell=null;continue;}
     queue.push({left:c.left,right:center,depth:c.depth+1});queue.push({left:center,right:c.right,depth:c.depth+1});activeCell=null;
    }
   }catch(e){if(!(e instanceof GraphComputeError)||e.code!=='BUDGET_EXHAUSTED')throw e;exhausted=true;partial=true;if(activeCell)queue.push(activeCell);while(queue.length){const c=queue.pop();cells.push({left:c.left,right:c.right,status:'unresolved',reason:'BUDGET_EXHAUSTED',errorPx:null,segmentId:null});}}
   budget.maxOperations=8000000;
   cells.sort((a,b)=>a.left-b.left);let segment=0,lastRight:number|null=null;
   for(const c of cells){if(c.status==='unresolved'){lastRight=null;continue;}if(lastRight!==c.left)segment++;c.segmentId=segment;lastRight=c.right;}
   const samples=[...caches[index].values()].sort((a,b)=>a.x-b.x);let cell=0;
   for(const s of samples){while(cell<cells.length-1&&cells[cell].right<s.x)cell++;const c=cells[cell];if(c?.status==='accepted'&&s.x>=c.left&&s.x<=c.right&&s.y!==null)s.segmentId=c.segmentId;}
   const finite=samples.filter(s=>s.y!==null).map(s=>Number(s.y));
   curves.push({expression:request.expressions[index],normalizedAst:JSON.stringify(ast),samples,cells,gaps:cells.filter(c=>c.status==='unresolved'),clippedSampleCount:finite.filter(y=>y<yMin||y>yMax).length,sampledRange:finite.length?{min:graphRaw(Math.min(...finite)),max:graphRaw(Math.max(...finite))}:null,status:exhausted?'budget-exhausted':cells.some(c=>c.status==='unresolved')?'partial':'sampled'});
  }
  if(request.derivativeAt!==undefined){parseGraphDecimal(request.derivativeAt);for(const expression of request.expressions)derivatives.push(evaluateFullGraphDerivative(expression,request.derivativeAt,options));}
  const numericRefusal=curves.some(c=>c.samples.some(s=>['NUMERIC_UNCERTAIN','RANGE_UNDERFLOW','RANGE_UNSUPPORTED'].includes(s.status)));
  const anyAccepted=curves.some(c=>c.cells.some(cell=>cell.status==='accepted'));
  return result(partial?'budget-exhausted':anyAccepted?'finite':numericRefusal?'precision-unavailable':'domain-error',partial?'Sample budget exhausted; unresolved cells remain gaps.':'Experimental sampled result; see per-cell diagnostics and remaining full-contract limitations.');
 }catch(e){return result(errorStatus(e),e instanceof Error?e.message:'Invalid graph request');}
}
