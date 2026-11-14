import {it,expect} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {getPublication20Definition} from '@/lib/publication20';
import {validatePublication20Result} from '@/lib/publication20/result-trust';
// Independent exact rational interpretation of the already-parsed binary64 input,
// not a change to decimal entry policy or an assertion of decimal exactness.
type Q={n:bigint;d:bigint};
function rational(x:number):Q{const b=new DataView(new ArrayBuffer(8));b.setFloat64(0,x);const v=b.getBigUint64(0),e=Number((v>>52n)&2047n),m=(v&((1n<<52n)-1n))+(e?1n<<52n:0n),shift=(e?e-1023:1-1023)-52;return shift>=0?{n:m<<BigInt(shift),d:1n}:{n:m,d:1n<<BigInt(-shift)};}
const mul=(a:Q,b:Q):Q=>({n:a.n*b.n,d:a.d*b.d}),div=(a:Q,b:Q):Q=>({n:a.n*b.d,d:a.d*b.n});
const abs=(n:bigint)=>n<0n?-n:n;
function checkHalfUlp(value:number,exact:Q){const b=new DataView(new ArrayBuffer(8));b.setFloat64(0,value);const bits=b.getBigUint64(0);b.setBigUint64(0,bits+1n);const next=rational(b.getFloat64(0)),got=rational(value);const delta=abs(got.n*exact.d-exact.n*got.d),ulpN=next.n*got.d-got.n*next.d;expect(2n*delta*next.d<=ulpN*exact.d).toBe(true);}
const definitions=[bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator] as const;
it('qualifies exact registered binary64 outputs against an independent rational half-ULP bound across supported normal magnitudes',()=>{
 const values=[2**-1022,2**-1000,2**-800,2**-500,2**-100,0.1,1,3,10,123.456,2**100,1e100];let accepted=0,refused=0;
 for(const definition of definitions){const entry=getPublication20Definition(definition.slug)!;
  for(const a of values)for(const b of values){
   const input=definition.id==='technology.bandwidth'?{dataMegabytes:a,timeSeconds:b}:definition.id==='technology.data-transfer'?{bandwidthMbps:a,timeSeconds:b}:{dataMegabytes:a,bandwidthMbps:b};
   const exact=definition.id==='technology.data-transfer'?div(mul(rational(a),rational(b)),{n:8n,d:1n}):div(mul(rational(a),{n:8n,d:1n}),rational(b));
   let output:{value:number;steps:readonly string[]};try{output=runCalculator(definition as typeof bandwidthCalculator,input as never).output;}catch(error){expect(String(error)).toContain('outside the supported finite range');const max=rational(Number.MAX_VALUE);expect(exact.n*max.d>max.n*exact.d).toBe(true);refused++;continue;}
   try{validatePublication20Result(entry,input,output);}catch(error){expect(String(error)).toMatch(/underflows|subnormal/);refused++;continue;}checkHalfUlp(output.value,exact);accepted++;
  }
 }
 expect(accepted).toBeGreaterThan(300);expect(refused).toBeGreaterThan(0);
});
it('preserves independently specified literal witnesses and rejects invalid schema inputs without rewriting the engine',()=>{
 const inputs=[{dataMegabytes:25,timeSeconds:4},{dataMegabytes:25,bandwidthMbps:50},{dataMegabytes:25,bandwidthMbps:50},{bandwidthMbps:50,timeSeconds:4}];
 const expected=[50,4,4,25];definitions.forEach((definition,i)=>{expect(definition.version).toBe(1);expect(runCalculator(definition as typeof bandwidthCalculator,inputs[i] as never).output.value).toBe(expected[i]);for(const invalid of [0,-1,NaN,Infinity,1e101]){const key=Object.keys(inputs[i])[0];expect(()=>runCalculator(definition as typeof bandwidthCalculator,{...inputs[i],[key]:invalid} as never)).toThrow();}});
});
it('retains exact historical subnormal-input behavior while refusing it only at the current capture boundary',()=>{
 const input={dataMegabytes:Number.MIN_VALUE,timeSeconds:1},definition=bandwidthCalculator,entry=getPublication20Definition(definition.slug)!;
 const output=runCalculator(definition as typeof bandwidthCalculator,input).output;expect(output.value).toBe(Number.MIN_VALUE*8);expect(()=>validatePublication20Result(entry,input,output)).toThrow(/subnormal/);expect(runCalculator(definition as typeof bandwidthCalculator,input).output).toEqual(output);
});
