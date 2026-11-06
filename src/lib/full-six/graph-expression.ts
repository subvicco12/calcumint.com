/** New experimental grammar. Historical advanced-math expression engine is unchanged. */
export const graphGrammarRevision='full-six-ascii-ast-experimental-1' as const;
export type GraphErrorCode='SYNTAX_ERROR'|'RESOURCE_LIMIT'|'DOMAIN_ERROR'|'DOMAIN_DIV_ZERO'|'DOMAIN_INDETERMINATE'|'RANGE_UNSUPPORTED'|'RANGE_UNDERFLOW'|'NUMERIC_UNCERTAIN'|'BUDGET_EXHAUSTED'|'CANCELLED';
export class GraphComputeError extends Error {
 constructor(public readonly code:GraphErrorCode,message:string,public readonly position?:number){super(message);this.name='GraphComputeError';}
}
const fail=(code:GraphErrorCode,message:string,position?:number):never=>{throw new GraphComputeError(code,message,position);};
export type GraphNode={kind:'number';value:number;raw:string}|{kind:'variable';name:'x'|'t'|'theta'|'a'|'b'|'c'}|{kind:'unary';op:'+'|'-';arg:GraphNode}|{kind:'binary';op:'+'|'-'|'*'|'/'|'^';left:GraphNode;right:GraphNode}|{kind:'call';name:GraphFunction;arg:GraphNode};
export type GraphFunction='sin'|'cos'|'tan'|'exp'|'ln'|'log'|'sqrt'|'abs';
const fn=new Set<GraphFunction>(['sin','cos','tan','exp','ln','log','sqrt','abs']);
export interface GraphBudget{operations:number;maxOperations:number;cancelled?:()=>boolean;}
export function graphOperation(budget?:GraphBudget){if(!budget)return;if(budget.cancelled?.())fail('CANCELLED','Graph request cancelled');if(budget.operations>=budget.maxOperations)fail('BUDGET_EXHAUSTED','Graph operation budget exhausted');budget.operations++;}
export const graphRaw=(v:number)=>Object.is(v,-0)?'-0':String(v);
const minimumNormal=2.2250738585072014e-308;
export function graphFinite(v:number,nonzeroExpected=false):number{
 if(!Number.isFinite(v)||Math.abs(v)>1e100)fail('RANGE_UNSUPPORTED','Intermediate outside experimental numeric envelope');
 if(v!==0&&Math.abs(v)<minimumNormal||v===0&&nonzeroExpected)fail('RANGE_UNDERFLOW','Nonzero result underflows the supported numeric envelope');
 return v;
}
export function parseGraphDecimal(raw:string,maxAbs=1e9):number{
 if(typeof raw!=='string'||raw.length>64||!/^[-+]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][-+]?[0-9]+)?$/.test(raw))return fail('SYNTAX_ERROR','A complete signed decimal string is required');
 const exponent=raw.match(/[eE]([-+]?[0-9]+)$/);if(exponent&&Math.abs(Number(exponent[1]))>308)fail('RANGE_UNSUPPORTED','Decimal exponent must be between -308 and 308');
 const v=Number(raw);if(v===0&&/[1-9]/.test(raw.split(/[eE]/)[0]))fail('RANGE_UNDERFLOW','Nonzero decimal rounded to zero');
 if(!Number.isFinite(v)||Math.abs(v)>maxAbs)fail('RANGE_UNSUPPORTED','Decimal outside the selected input envelope');
 return v;
}
interface Token{kind:'number'|'name'|'symbol'|'end';text:string;position:number;}
function tokenize(source:string):Token[]{
 if(typeof source!=='string'||source.length>500)fail('RESOURCE_LIMIT','Expression must contain at most 500 UTF-16 units');
 const out:Token[]=[];let i=0;
 while(i<source.length){const c=source[i];if(/[ \t\r\n]/.test(c)){i++;continue;}const position=i;
  if(/[0-9.]/.test(c)){const m=source.slice(i).match(/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][-+]?[0-9]+)?/);if(!m)fail('SYNTAX_ERROR','Invalid decimal token',i);out.push({kind:'number',text:m![0],position});i+=m![0].length;}
  else if(/[A-Za-z]/.test(c)){const name=source.slice(i).match(/^[A-Za-z]+/)![0];out.push({kind:'name',text:name.toLowerCase(),position});i+=name.length;}
  else if('+-*/^()'.includes(c)){out.push({kind:'symbol',text:c,position});i++;}
  else fail('SYNTAX_ERROR',`Unsupported character at position ${i}`,i);
  if(out.length>512)fail('RESOURCE_LIMIT','Token budget exceeded',i);
 }
 out.push({kind:'end',text:'',position:source.length});return out;
}
export interface GraphCompileOptions{variable?:'x'|'t'|'theta';parameters?:readonly ('a'|'b'|'c')[];}
export function compileFullGraphExpression(source:string,options:GraphCompileOptions={}):GraphNode{
 const tokens=tokenize(source);let cursor=0,nodes=0,recursion=0;const variable=options.variable??'x',parameters=new Set(options.parameters??[]);
 const peek=()=>tokens[cursor],take=()=>tokens[cursor++];
 const node=(n:GraphNode):GraphNode=>{if(++nodes>256)fail('RESOURCE_LIMIT','AST node budget exceeded');return n;};
 const enter=()=>{if(++recursion>64)fail('RESOURCE_LIMIT','Expression nesting budget exceeded');};const leave=()=>{recursion--;};
 function primary():GraphNode{
  const t=take();if(!t)fail('SYNTAX_ERROR','Unexpected end of expression');
  if(t.kind==='number'){const value=parseGraphDecimal(t.text,1e100);return node({kind:'number',value,raw:t.text});}
  if(t.kind==='name'){
   if(t.text===variable||parameters.has(t.text as 'a'|'b'|'c'))return node({kind:'variable',name:t.text as 'x'|'t'|'theta'|'a'|'b'|'c'});
   if(t.text==='pi'||t.text==='e')return node({kind:'number',value:t.text==='pi'?Math.PI:Math.E,raw:t.text});
   if(!fn.has(t.text as GraphFunction))return fail('SYNTAX_ERROR',`Unsupported name ${t.text}`,t.position);
   if(take()?.text!=='(')fail('SYNTAX_ERROR','Function application requires parentheses',t.position);
   enter();const arg=expr();leave();if(take()?.text!==')')fail('SYNTAX_ERROR','Missing closing parenthesis',t.position);
   return node({kind:'call',name:t.text as GraphFunction,arg});
  }
  if(t.text==='('){enter();const result=expr();leave();if(take()?.text!==')')fail('SYNTAX_ERROR','Missing closing parenthesis',t.position);return result;}
  return fail('SYNTAX_ERROR','Expected decimal, variable or parenthesized expression',t.position);
 }
 function power():GraphNode{const left=primary();if(peek().text==='^'){take();enter();const right=unary();leave();return node({kind:'binary',op:'^',left,right});}return left;}
 function unary():GraphNode{if(peek().text==='+'||peek().text==='-'){const op=take().text as '+'|'-';enter();const arg=unary();leave();return node({kind:'unary',op,arg});}return power();}
 function term():GraphNode{let left=unary();while(peek().text==='*'||peek().text==='/'){const op=take().text as '*'|'/';left=node({kind:'binary',op,left,right:unary()});}return left;}
 function expr():GraphNode{let left=term();while(peek().text==='+'||peek().text==='-'){const op=take().text as '+'|'-';left=node({kind:'binary',op,left,right:term()});}return left;}
 const result=expr();if(peek().kind!=='end')fail('SYNTAX_ERROR','Unexpected trailing input',peek().position);
 function depth(n:GraphNode):number{return n.kind==='number'||n.kind==='variable'?1:n.kind==='binary'?1+Math.max(depth(n.left),depth(n.right)):1+depth(n.arg);}
 if(depth(result)>64)fail('RESOURCE_LIMIT','AST depth budget exceeded');return result;
}
export interface GraphEvaluationOptions{angleMode?:'radians'|'degrees';parameters?:Partial<Record<'a'|'b'|'c',number>>;budget?:GraphBudget;}
export function evaluateFullGraphExpression(ast:GraphNode,x:number,options:GraphEvaluationOptions={}):number{
 if(!Number.isFinite(x)||Math.abs(x)>1e9)fail('RANGE_UNSUPPORTED','Variable outside supported input range');
 function calc(n:GraphNode):number{
  graphOperation(options.budget);
  if(n.kind==='number')return graphFinite(n.value);
  if(n.kind==='variable'){const value=n.name==='x'||n.name==='t'||n.name==='theta'?x:options.parameters?.[n.name];if(value===undefined||!Number.isFinite(value)||Math.abs(value)>1e9)fail('RANGE_UNSUPPORTED','Missing or unsupported parameter');return graphFinite(value!);}
  if(n.kind==='unary'){const a=calc(n.arg);return n.op==='-'?-a:a;}
  if(n.kind==='binary'){
   const a=calc(n.left),b=calc(n.right);let v:number;
   if(n.op==='+'||n.op==='-'){
    v=n.op==='+'?a+b:a-b;
    const structurallyEqual=n.op==='-'&&JSON.stringify(n.left)===JSON.stringify(n.right);
    if(!structurallyEqual&&(a!==0||b!==0)&&(v===0||(Math.abs(a)+Math.abs(b))/Math.abs(v)>1e12))fail('NUMERIC_UNCERTAIN','Cancellation makes numeric precision uncertain');
    return graphFinite(v);
   }
   if(n.op==='*')return graphFinite(a*b,a!==0&&b!==0);
   if(n.op==='/'){if(b===0)fail('DOMAIN_DIV_ZERO','Division by zero');return graphFinite(a/b,a!==0);}
   if(a===0&&b===0)fail('DOMAIN_INDETERMINATE','Zero to zero power is indeterminate');
   if(a===0&&b<0)fail('DOMAIN_DIV_ZERO','Zero to a negative power is undefined');
   if(a<0&&(!Number.isInteger(b)||Math.abs(b)>1024))fail('DOMAIN_ERROR','Negative base requires integral exponent within 1024');
   return graphFinite(Math.pow(a,b),a!==0);
  }
  const a=calc(n.arg);let v:number;
  if(n.name==='sin'||n.name==='cos'||n.name==='tan'){
   const radians=options.angleMode==='degrees'?a*Math.PI/180:a;
   if(Math.abs(radians)>1e6)fail('RANGE_UNSUPPORTED','Trigonometric argument exceeds the supported envelope');
   if(n.name==='tan'&&Math.abs(Math.cos(radians))<=8*Number.EPSILON)fail('NUMERIC_UNCERTAIN','Tangent pole or numerically unresolved pole');
   v=n.name==='sin'?Math.sin(radians):n.name==='cos'?Math.cos(radians):Math.tan(radians);
  }else if(n.name==='exp'){if(a< -700||a>230)fail('RANGE_UNSUPPORTED','Exponential argument outside [-700,230]');v=Math.exp(a);}
  else if(n.name==='ln'||n.name==='log'){if(a<=0)fail('DOMAIN_ERROR','Logarithm requires positive argument');if(a<1e-100)fail('RANGE_UNSUPPORTED','Logarithm argument below supported envelope');v=n.name==='ln'?Math.log(a):Math.log10(a);}
  else if(n.name==='sqrt'){if(a<0)fail('DOMAIN_ERROR','Square root requires nonnegative argument');v=Math.sqrt(a);}
  else v=Math.abs(a);
  return graphFinite(v);
 }
 return calc(ast);
}
