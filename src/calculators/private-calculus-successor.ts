/** Private successor: analytic differentiation/continuity and bounded polynomial quadrature.
 * Finite sampling is never described as proof of an arbitrary limit or integral error. */
import {z} from 'zod';
import {parseExpression,type ExprNode} from './advanced-math/expression-engine';
import {copyCalculationData,createCalculationSnapshot} from '../lib/calculation-snapshot';
import {equalCompletionJson} from './completion-contracts';
const point=z.number().finite().min(-1000000).max(1000000),expression=z.string().min(1).max(500);
const inputSchema=z.union([z.object({operation:z.literal('derivative'),expression,x:point}).strict(),z.object({operation:z.literal('limit'),expression,x:point}).strict(),z.object({operation:z.literal('integral'),expression,lower:point,upper:point}).strict()]);
type Dual={value:number;derivative:number};
const finite=(n:number)=>{if(!Number.isFinite(n))throw Error('Unsupported numerical range');return n;};
const constant=(n:ExprNode):boolean=>n.kind==='number'||n.kind==='unary'&&constant(n.arg)||n.kind==='binary'&&constant(n.left)&&constant(n.right)||n.kind==='call'&&constant(n.arg);
const sum=(a:number,b:number)=>{const v=finite(a+b);if(a!==0&&b!==0&&(v===a||v===b))throw Error('Complete addend erasure outside supported numerical range');return v;};
const product=(a:number,b:number)=>{const v=finite(a*b);if(a!==0&&b!==0&&v===0)throw Error('Multiplication underflow outside supported numerical range');return v;};
const quotient=(a:number,b:number)=>{if(b===0)throw Error('Singularity');const v=finite(a/b);if(a!==0&&v===0)throw Error('Division underflow outside supported numerical range');return v;};
const power=(a:number,b:number)=>{const v=finite(Math.pow(a,b));if(a!==0&&v===0)throw Error('Power underflow outside supported numerical range');return v;};
function analytic(n:ExprNode,x:number,differentiate:boolean):Dual{
 const gradient=(f:()=>number)=>differentiate?finite(f()):0;
 let value:number,derivative:number;
 if(n.kind==='number')return {value:n.value,derivative:0};if(n.kind==='variable')return {value:x,derivative:1};
 if(n.kind==='unary'){const a=analytic(n.arg,x,differentiate);return n.op==='-'?{value:-a.value,derivative:-a.derivative}:a;}
 if(n.kind==='binary'){
  const a=analytic(n.left,x,differentiate),b=analytic(n.right,x,differentiate);
  if(n.op==='+'){value=sum(a.value,b.value);derivative=gradient(()=>sum(a.derivative,b.derivative));}
  else if(n.op==='-'){value=sum(a.value,-b.value);derivative=gradient(()=>sum(a.derivative,-b.derivative));}
  else if(n.op==='*'){value=product(a.value,b.value);derivative=gradient(()=>sum(product(a.derivative,b.value),product(a.value,b.derivative)));}
  else if(n.op==='/'){value=quotient(a.value,b.value);derivative=gradient(()=>quotient(sum(product(a.derivative,b.value),-product(a.value,b.derivative)),product(b.value,b.value)));}
  else if(constant(n.right)&&Number.isInteger(b.value)){if(a.value===0&&b.value<0)throw Error('Singular power');value=power(a.value,b.value);derivative=gradient(()=>b.value===0?0:product(product(b.value,power(a.value,b.value-1)),a.derivative));}
  else {if(a.value<=0)throw Error('Real variable power requires positive base');value=power(a.value,b.value);derivative=gradient(()=>product(value,sum(product(b.derivative,Math.log(a.value)),quotient(product(b.value,a.derivative),a.value))));}
 }else{
  const a=analytic(n.arg,x,differentiate),u=a.value,g=a.derivative;
  switch(n.name){
   case 'sin':value=Math.sin(u);derivative=gradient(()=>product(Math.cos(u),g));break;
   case 'cos':value=Math.cos(u);derivative=gradient(()=>-product(Math.sin(u),g));break;
   case 'tan':if(Math.abs(Math.cos(u))<1e-12)throw Error('Near tangent pole');value=Math.tan(u);derivative=gradient(()=>quotient(g,product(Math.cos(u),Math.cos(u))));break;
   case 'exp':value=Math.exp(u);if(value===0)throw Error('Exponential underflow outside supported numerical range');derivative=gradient(()=>product(value,g));break;
   case 'ln':case 'log':if(u<=0)throw Error('Log domain');value=n.name==='ln'?Math.log(u):Math.log10(u);derivative=gradient(()=>quotient(g,product(u,n.name==='ln'?1:Math.LN10)));break;
   case 'sqrt':if(u<=0)throw Error('Sqrt boundary excluded from this continuous-neighborhood profile');value=Math.sqrt(u);derivative=gradient(()=>quotient(g,product(2,value)));break;
   case 'abs':if(differentiate&&u===0)throw Error('Abs differentiability not established at zero');value=Math.abs(u);derivative=gradient(()=>u===0?0:product(Math.sign(u),g));break;
   default:throw Error('Unsupported analytic function');
  }
 }
 return {value:finite(value),derivative};
}
function polynomial(n:ExprNode):number[]{
 const normalize=(p:number[])=>{p.forEach(finite);while(p.length>1&&p.at(-1)===0)p.pop();if(p.length>33)throw Error('Only polynomial degree<=32');return p;};
 const convolve=(a:number[],b:number[])=>{if(a.length+b.length-2>32)throw Error('Only polynomial degree<=32');const p=Array(a.length+b.length-1).fill(0) as number[];a.forEach((v,i)=>b.forEach((w,j)=>{p[i+j]=sum(p[i+j],product(v,w));}));return normalize(p);};
 if(n.kind==='number')return [n.value];if(n.kind==='variable')return [0,1];if(n.kind==='unary')return polynomial(n.arg).map(v=>n.op==='-'?-v:v);if(n.kind!=='binary')throw Error('Only bounded polynomial integrals; no sampled arbitrary-expression error claim');
 const a=polynomial(n.left),b=polynomial(n.right);
 if(n.op==='+'||n.op==='-')return normalize(Array.from({length:Math.max(a.length,b.length)},(_,i)=>sum(a[i]??0,(n.op==='+'?1:-1)*(b[i]??0))));
 if(n.op==='*')return convolve(a,b);if(n.op==='/'){if(b.length!==1||b[0]===0)throw Error('Only polynomial division by nonzero constants');return normalize(a.map(v=>quotient(v,b[0])));}
 if(b.length!==1||!Number.isInteger(b[0])||b[0]<0||b[0]>32)throw Error('Only polynomial nonnegative integer powers<=32');let p=[1];for(let k=0;k<b[0];k++)p=convolve(p,a);return p;
}
const methodology=Object.freeze({derivative:'Forward analytic chain/product/quotient/power rules on the parsed expression tree; reject unsupported/nondifferentiable domains.',limit:'Direct evaluation only after recursive continuity-domain checks at the target; no finite-sample convergence proof. Removable singularities and one-sided/boundary domains are unsupported.',integral:'Parse and validate first, then form polynomial coefficients of degree<=32; evaluate the power-rule antiderivative at both bounds. Reject all non-polynomial integrands, including narrow Gaussians.',precision:'Binary64 evaluation; floating-point roundoff is not rigorously bounded. No certified numerical error estimate is emitted.',resources:'Expressions<=500characters; coordinates/bounds within±1000000; polynomial degree<=32.',mathematics:'Continuity of compositions on their open domains; analytic differentiation rules; polynomial power-rule antiderivative and Fundamental Theorem of Calculus.',excluded:'No arbitrary sampled-limit proof, numerical quadrature guarantee, symbolic removable-limit solver or full canonical scope acceptance.'});
export function exportPrivateCalculus(raw:unknown,plan:'free'|'pro'|'business'='free'){
 z.enum(['free','pro','business']).parse(plan);const p=inputSchema.parse(raw);for(const m of p.expression.matchAll(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/g))if(Number(m[0])===0&&/[1-9]/.test(m[0].split(/[eE]/)[0]))throw Error('Literal underflow outside supported numerical range');const ast=parseExpression(p.expression);let value:number;
 if(p.operation==='integral'){const coefficients=polynomial(ast);const primitive=(x:number)=>coefficients.reduce((s,c,k)=>sum(s,quotient(product(c,power(x,k+1)),k+1)),0);value=sum(primitive(p.upper),-primitive(p.lower));}else{const r=analytic(ast,p.x,p.operation==='derivative');value=p.operation==='derivative'?r.derivative:r.value;}
 const id=p.operation==='derivative'?246:p.operation==='integral'?247:248;
 const envelope={schemaVersion:1,profileId:'private-analytic-calculus-'+p.operation,methodology,governance:{relatedCatalogId:id,canonicalAccepted:false,canonicalMappingApproved:false,legacyV1Unchanged:true,reviewStatus:'private-draft',certificationAuthorized:false,publicationAuthorized:false,releaseHold:true},calculation:createCalculationSnapshot({calculatorSlug:'private-analytic-calculus-'+p.operation,calculatorVersion:2,input:p,output:{value,method:p.operation==='integral'?'polynomial-antiderivative':p.operation==='limit'?'continuous-domain-evaluation':'analytic-differentiation',certifiedErrorBound:null}})};return copyCalculationData({envelope},{}).input.envelope as typeof envelope;
}
export function importPrivateCalculus(raw:unknown){const s=copyCalculationData({envelope:raw},{}).input.envelope as ReturnType<typeof exportPrivateCalculus>;if(!s?.calculation)throw Error('Missing calculation');const expected=exportPrivateCalculus(s.calculation.input);if(!equalCompletionJson(s,expected))throw Error('Immutable calculus result/source/method/version differs');return expected;}
export const privateCalculusExamples=Object.freeze([{operation:'derivative',expression:'x^3',x:2},{operation:'integral',expression:'x^2',lower:0,upper:3},{operation:'limit',expression:'exp(-x^2/1e-20)',x:0}]);
