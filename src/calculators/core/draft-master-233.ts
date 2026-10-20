import { z } from 'zod';
import type { CalculatorDefinition } from '../types';
const MASK64=(1n<<64n)-1n;
const unsigned=(maximum:bigint)=>z.string().regex(/^[0-9]+$/).refine(s=>{const normalized=s.replace(/^0+/, '')||'0';return /^[0-9]+$/.test(s)&&normalized.length<=20&&BigInt(normalized)<=maximum},'Unsigned integer out of range');
const bound=z.number().int().min(-2147483648).max(2147483647);
const inputSchema=z.object({seed:unsigned(MASK64),stream:unsigned((1n<<63n)-1n),minimum:bound,maximum:bound,count:z.number().int().min(1).max(1000)}).refine(x=>x.minimum<=x.maximum,'Minimum must not exceed maximum');
export type RandomNumberInput=z.infer<typeof inputSchema>;
export type RandomNumberOutput={values:number[];finalState:string};
export const draftMaster233Calculator:CalculatorDefinition<RandomNumberInput,RandomNumberOutput>={
 id:'math.random-number',slug:'random-number-generator',title:'Random Number Generator',category:'math',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,
 calculate:raw=>{const input=inputSchema.parse(raw);let state=0n;const inc=(BigInt(input.stream)<<1n)|1n;
  const step=()=>{const old=state;state=(old*6364136223846793005n+inc)&MASK64;const word=Number((((old>>18n)^old)>>27n)&0xffffffffn);const rotation=Number(old>>59n);return((word>>>rotation)|(word<<((-rotation)&31)))>>>0};
  step();state=(state+BigInt(input.seed))&MASK64;step();const span=input.maximum-input.minimum+1,threshold=(4294967296-span)%span;const values:number[]=[];let draws=0;
  while(values.length<input.count){if(++draws>1000000)throw new Error('Raw draw budget exhausted; no partial result');const r=step();if(r<threshold)continue;values.push(input.minimum+r%span)}
  return{values,finalState:state.toString()};
 },
 formulas:[{id:'pcg-xsh-rr',expression:'state=(old×6364136223846793005+2×stream+1) mod 2^64; XSH-RR output; rejection sampling',description:'Deterministic PCG-XSH-RR64/32 inclusive integer sampling with replacement. Noncryptographic simulation/education only. Replay requires algorithm version, seed and stream. Singleton ranges still consume one raw draw per value.'}],
 sources:[{label:'PCG minimal C implementation',url:'https://www.pcg-random.org/download.html',note:'PCG32 initialization and XSH-RR output; official seed42 stream54 reference words independently checked.'}],
 goldenTests:[{label:'Official PCG six-word vector in signed full-width range',input:{seed:'42',stream:'54',minimum:-2147483648,maximum:2147483647,count:6},expected:{values:{length:6,items:{"0": 559678135, "1": -79170551, "2": 974992176, "3": 64156307, "4": 1067743307, "5": 1273847918}},finalState:'13742400798436595530'}}],
 examples:[{label:'Singleton range consumes state',input:{seed:'42',stream:'54',minimum:7,maximum:7,count:1},expected:{values:[7],finalState:'3118741472915405573'}}],ui:{simpleInputKeys:['seed','stream','minimum','maximum','count']}
};
