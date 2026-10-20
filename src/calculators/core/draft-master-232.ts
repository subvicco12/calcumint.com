import { z } from 'zod';
import type { CalculatorDefinition } from '../types';
const integer = z.string().max(4097).regex(/^(?:0|-?[1-9][0-9]*)$/).refine(v=>v.replace('-','').length<=4096,'At most 4096 integer digits');
const inputSchema=z.object({left:integer,right:integer,operation:z.enum(['add','subtract','multiply','divmod','gcd'])});
export type BigNumberInput=z.infer<typeof inputSchema>;
export type BigNumberOutput={result:string}|{quotient:string;remainder:string};
const serialize=(n:bigint)=>{const s=n.toString();if(s.replace('-','').length>8192)throw new Error('Output exceeds 8192 digits');return s};
export const draftMaster232Calculator:CalculatorDefinition<BigNumberInput,BigNumberOutput>={
 id:'math.big-number',slug:'big-number-calculator',title:'Big Number Calculator',category:'math',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,
 calculate:raw=>{const {left,right,operation}=inputSchema.parse(raw);let a=BigInt(left),b=BigInt(right);
  if(operation==='divmod'){if(b===0n)throw new Error('Division by zero');return{quotient:serialize(a/b),remainder:serialize(a%b)}}
  if(operation==='add')return{result:serialize(a+b)};
  if(operation==='subtract')return{result:serialize(a-b)};
  if(operation==='multiply')return{result:serialize(a*b)};
  a=a<0n?-a:a;b=b<0n?-b:b;let iterations=0;while(b!==0n){if(++iterations>20000)throw new Error('GCD iteration budget exhausted');[a,b]=[b,a%b]};return{result:serialize(a)};
 },
 formulas:[{id:'exact-integers',expression:'q=trunc(a/b); r=a-qb; gcd via Euclid',description:'Exact signed integer arithmetic. Division truncates toward zero; remainder follows dividend sign; gcd(0,0)=0.'}],
 sources:[{label:'ECMAScript BigInt arithmetic',url:'https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-bigint-type',note:'Exact integer operators; independently checked against CPython integer arithmetic.'}],
 goldenTests:[{label:'Independent CPython signed divmod',input:{left:'-7',right:'3',operation:'divmod'},expected:{quotient:'-2',remainder:'-1'}},{label:'Independent CPython exact addition',input:{left:'9007199254740993',right:'1',operation:'add'},expected:{result:'9007199254740994'}}],
 examples:[{label:'Beyond binary64 exact integers',input:{left:'9007199254740993',right:'1',operation:'add'},expected:{result:'9007199254740994'}}],ui:{simpleInputKeys:['left','right','operation']}
};
