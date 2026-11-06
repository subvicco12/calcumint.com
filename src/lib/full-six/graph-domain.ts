import {type GraphNode,type GraphBudget,graphOperation} from './graph-expression';
/** Conservative domain guards. Host elementary intervals remain experimental, not rigorous enclosures. */
export interface GraphDomainInterval{lo:number;hi:number;safe:boolean;reason:string;}
const invalid=(reason:string):GraphDomainInterval=>({lo:0,hi:0,safe:false,reason});
const bits=new DataView(new ArrayBuffer(8));
function adjacent(x:number,direction:1|-1){if(!Number.isFinite(x))return x;if(x===0)return direction*Number.MIN_VALUE;bits.setFloat64(0,x);let b=bits.getBigUint64(0);b+=x>0?BigInt(direction):-BigInt(direction);bits.setBigUint64(0,b);return bits.getFloat64(0);}
const bounded=(lo:number,hi:number):GraphDomainInterval=>!Number.isFinite(lo)||!Number.isFinite(hi)||Math.max(Math.abs(lo),Math.abs(hi))>1e100?invalid('RANGE_UNSUPPORTED'):{lo:adjacent(lo,-1),hi:adjacent(hi,1),safe:true,reason:'EXPERIMENTAL_DOMAIN_GUARD'};
const same=(a:number,b:number):GraphDomainInterval=>({lo:a,hi:b,safe:true,reason:'EXPERIMENTAL_DOMAIN_GUARD'});
export function guardFullGraphDomain(ast:GraphNode,left:number,right:number,options:{angleMode?:'radians'|'degrees';parameters?:Partial<Record<'a'|'b'|'c',number>>;budget?:GraphBudget}={}):GraphDomainInterval{
 function visit(n:GraphNode):GraphDomainInterval{
  graphOperation(options.budget);
  if(n.kind==='number')return same(n.value,n.value);
  if(n.kind==='variable'){const p=n.name==='x'||n.name==='t'||n.name==='theta'?undefined:options.parameters?.[n.name];return p===undefined?same(left,right):same(p,p);}
  if(n.kind==='unary'){const a=visit(n.arg);return !a.safe?a:n.op==='-'?same(-a.hi,-a.lo):a;}
  if(n.kind==='binary'){
   const a=visit(n.left),b=visit(n.right);if(!a.safe)return a;if(!b.safe)return b;
   if(n.op==='+')return bounded(a.lo+b.lo,a.hi+b.hi);
   if(n.op==='-')return bounded(a.lo-b.hi,a.hi-b.lo);
   if(n.op==='*'){const p=[a.lo*b.lo,a.lo*b.hi,a.hi*b.lo,a.hi*b.hi];return bounded(Math.min(...p),Math.max(...p));}
   if(n.op==='/'){if(b.lo<=0&&b.hi>=0)return invalid('POSSIBLE_DENOMINATOR_ZERO');const p=[a.lo/b.lo,a.lo/b.hi,a.hi/b.lo,a.hi/b.hi];return bounded(Math.min(...p),Math.max(...p));}
   if(b.lo!==b.hi)return invalid('VARIABLE_EXPONENT_DOMAIN_UNRESOLVED');
   const e=b.lo;
   if(Number.isInteger(e)){
    if(Math.abs(e)>1024)return invalid('POWER_EXPONENT_UNSUPPORTED');
    if(e<=0&&a.lo<=0&&a.hi>=0)return invalid('POSSIBLE_ZERO_POWER_DOMAIN');
    const p=[Math.pow(a.lo,e),Math.pow(a.hi,e)];if(e>0&&e%2===0&&a.lo<=0&&a.hi>=0)p.push(0);
    return bounded(Math.min(...p),Math.max(...p));
   }
   if(a.lo<0||e<0&&a.lo===0)return invalid('POSSIBLE_POWER_DOMAIN');
   const p=[Math.pow(a.lo,e),Math.pow(a.hi,e)];return bounded(Math.min(...p),Math.max(...p));
  }
  const a=visit(n.arg);if(!a.safe)return a;
  if(n.name==='abs')return bounded(a.lo<=0&&a.hi>=0?0:Math.min(Math.abs(a.lo),Math.abs(a.hi)),Math.max(Math.abs(a.lo),Math.abs(a.hi)));
  if(n.name==='sqrt'){if(a.lo<0)return invalid('POSSIBLE_SQRT_DOMAIN');return bounded(Math.sqrt(a.lo),Math.sqrt(a.hi));}
  if(n.name==='ln'||n.name==='log'){if(a.lo<=0)return invalid('POSSIBLE_LOG_DOMAIN');if(a.lo<1e-100)return invalid('LOG_RANGE_UNSUPPORTED');const f=n.name==='ln'?Math.log:Math.log10;return bounded(f(a.lo),f(a.hi));}
  if(n.name==='exp'){if(a.lo< -700||a.hi>230)return invalid('EXP_RANGE_UNSUPPORTED');return bounded(Math.exp(a.lo),Math.exp(a.hi));}
  const factor=options.angleMode==='degrees'?Math.PI/180:1;const lo=a.lo*factor,hi=a.hi*factor;
  if(Math.max(Math.abs(lo),Math.abs(hi))>1e6)return invalid('TRIG_RANGE_UNSUPPORTED');
  if(n.name==='tan'){
   if(Math.floor((lo+Math.PI/2)/Math.PI)!==Math.floor((hi+Math.PI/2)/Math.PI)||Math.abs(Math.cos(lo))<=8*Number.EPSILON||Math.abs(Math.cos(hi))<=8*Number.EPSILON)return invalid('POSSIBLE_TANGENT_POLE');
   return bounded(Math.tan(lo),Math.tan(hi));
  }
  if(hi-lo>Math.PI/2)return invalid('OSCILLATION_REFINEMENT_REQUIRED');
  const f=n.name==='sin'?Math.sin:Math.cos,offset=n.name==='sin'?Math.PI/2:0;const values=[f(lo),f(hi)];
  const start=Math.ceil((lo-offset)/Math.PI),end=Math.floor((hi-offset)/Math.PI);
  for(let k=start;k<=end&&k<=start+2;k++)values.push(k%2===0?1:-1);
  return bounded(Math.min(...values),Math.max(...values));
 }
 return visit(ast);
}
