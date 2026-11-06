import {compileFullGraphExpression,evaluateFullGraphExpression,GraphComputeError,graphRaw,parseGraphDecimal,type GraphEvaluationOptions,type GraphNode} from './graph-expression';
export const graphDerivativeRevision='full-six-symbolic-derivative-experimental-1' as const;
const number=(value:number):GraphNode=>({kind:'number',value,raw:graphRaw(value)});
const unary=(arg:GraphNode):GraphNode=>({kind:'unary',op:'-',arg});
const call=(name:'ln'|'sqrt'|'abs'|'sin'|'cos'|'tan'|'exp',arg:GraphNode):GraphNode=>({kind:'call',name,arg});
function binary(op:'+'|'-'|'*'|'/'|'^',left:GraphNode,right:GraphNode):GraphNode{
 // Original AST is always validated separately; these rules never erase original holes.
 if(op==='*'){if(left.kind==='number'&&left.value===1)return right;if(right.kind==='number'&&right.value===1)return left;}
 if((op==='+'||op==='-')&&right.kind==='number'&&right.value===0)return left;
 if(op==='+'&&left.kind==='number'&&left.value===0)return right;
 if(op==='^'&&right.kind==='number'&&right.value===1)return left;
 return {kind:'binary',op,left,right};
}
export interface GraphDerivativeResult{
 scope:'PRIVATE_EXPERIMENTAL';implementationRevision:typeof graphDerivativeRevision;expression:string;point:string;angleMode:'radians'|'degrees';
 status:'finite'|'domain-error'|'precision-unavailable'|'budget-exhausted'|'cancelled';value:number|null;raw:string|null;
 method:'symbolic AST with original-domain evaluation';originalAst:string|null;derivativeAst:string|null;message:string;
}
export function evaluateFullGraphDerivative(expression:string,point:string,options:GraphEvaluationOptions={}):GraphDerivativeResult{
 const out:GraphDerivativeResult={scope:'PRIVATE_EXPERIMENTAL',implementationRevision:graphDerivativeRevision,expression,point,angleMode:options.angleMode??'radians',status:'domain-error',value:null,raw:null,method:'symbolic AST with original-domain evaluation',originalAst:null,derivativeAst:null,message:''};
 try{
  const x=parseGraphDecimal(point),ast=compileFullGraphExpression(expression,{parameters:Object.keys(options.parameters??{}) as ('a'|'b'|'c')[]});
  out.originalAst=JSON.stringify(ast);
  evaluateFullGraphExpression(ast,x,options);
  let visits=0;const derivative=(n:GraphNode):GraphNode=>{
   if(++visits>4096)throw new GraphComputeError('RESOURCE_LIMIT','UNSUPPORTED_DERIVATIVE: derivative construction budget');
   if(n.kind==='number')return number(0);
   if(n.kind==='variable')return number(['x','t','theta'].includes(n.name)?1:0);
   if(n.kind==='unary'){const d=derivative(n.arg);return n.op==='-'?unary(d):d;}
   if(n.kind==='binary'){
    const a=n.left,b=n.right,da=derivative(a),db=derivative(b);
    if(n.op==='+'||n.op==='-')return binary(n.op,da,db);
    if(n.op==='*')return binary('+',binary('*',da,b),binary('*',a,db));
    if(n.op==='/')return binary('/',binary('-',binary('*',da,b),binary('*',a,db)),binary('^',b,number(2)));
    if(b.kind==='number'){
     const base=evaluateFullGraphExpression(a,x,options);
     if(base===0&&!Number.isInteger(b.value))throw new GraphComputeError('DOMAIN_ERROR','UNSUPPORTED_DERIVATIVE: noninteger power domain boundary');
     if(b.value===0)return number(0);if(b.value===1)return da;
     return binary('*',binary('*',b,binary('^',a,number(b.value-1))),da);
    }
    if(evaluateFullGraphExpression(a,x,options)<=0)throw new GraphComputeError('DOMAIN_ERROR','UNSUPPORTED_DERIVATIVE: variable exponent requires positive base on a real neighborhood');
    return binary('*',n,binary('+',binary('*',db,call('ln',a)),binary('*',b,binary('/',da,a))));
   }
   const a=n.arg,da=derivative(a),value=evaluateFullGraphExpression(a,x,options);
   if(n.name==='abs'){
    if(value===0)throw new GraphComputeError('DOMAIN_ERROR','UNSUPPORTED_DERIVATIVE: absolute-value zero needs a separate analytic rule');
    return binary('*',binary('/',a,call('abs',a)),da);
   }
   if(n.name==='sqrt'){
    if(value===0)throw new GraphComputeError('DOMAIN_ERROR','UNSUPPORTED_DERIVATIVE: square-root boundary');
    return binary('/',da,binary('*',number(2),call('sqrt',a)));
   }
   if(n.name==='ln')return binary('/',da,a);
   if(n.name==='log')return binary('/',da,binary('*',a,call('ln',number(10))));
   if(n.name==='exp')return binary('*',call('exp',a),da);
   const factor=options.angleMode==='degrees'?number(Math.PI/180):number(1);
   const chain=binary('*',da,factor);
   if(n.name==='sin')return binary('*',call('cos',a),chain);
   if(n.name==='cos')return binary('*',unary(call('sin',a)),chain);
   return binary('/',chain,binary('^',call('cos',a),number(2)));
  };
  const derived=derivative(ast);let nodes=0;
  const check=(n:GraphNode,depth:number)=>{if(++nodes>4096||depth>128)throw new GraphComputeError('RESOURCE_LIMIT','UNSUPPORTED_DERIVATIVE: expanded AST budget');if(n.kind==='binary'){check(n.left,depth+1);check(n.right,depth+1);}else if(n.kind==='call'||n.kind==='unary')check(n.arg,depth+1);};check(derived,1);
  out.derivativeAst=JSON.stringify(derived);
  const value=evaluateFullGraphExpression(derived,x,options);
  return {...out,status:'finite',value,raw:graphRaw(value),message:'Experimental symbolic derivative at selected point; host binary64 scalar-policy limits apply. No global smoothness or extrema classification.'};
 }catch(e){const code=e instanceof GraphComputeError?e.code:'SYNTAX_ERROR';return {...out,status:code==='CANCELLED'?'cancelled':code==='BUDGET_EXHAUSTED'?'budget-exhausted':['NUMERIC_UNCERTAIN','RANGE_UNDERFLOW','RANGE_UNSUPPORTED','RESOURCE_LIMIT'].includes(code)?'precision-unavailable':'domain-error',message:e instanceof Error?e.message:'Invalid derivative request'};}
}
