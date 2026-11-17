import {it,expect} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {base64SizeCalculator} from '@/calculators/technology-computing/catalog-batch-2';
const maximum=1_000_000_000_000_000n;
const exact=(n:bigint)=>4n*((n+2n)/3n);
it('matches independent exact-integer padded Base64 length at every binary boundary and4096 deterministic witnesses',()=>{
 const values=new Set<bigint>([0n,1n,2n,3n,maximum,maximum-1n,maximum-2n]);
 for(let bit=0n;bit<=50n;bit++)for(const offset of [-2n,-1n,0n,1n,2n])for(const center of [1n<<bit,3n*(1n<<bit)]){const n=center+offset;if(n>=0n&&n<=maximum)values.add(n);}
 let seed=20261109n;for(let i=0;i<4096;i++){seed=(6364136223846793005n*seed+1442695040888963407n)&((1n<<64n)-1n);values.add(seed%(maximum+1n));}
 expect(values.size).toBeGreaterThan(4500);
 for(const n of values){const actual=runCalculator(base64SizeCalculator,{inputBytes:Number(n)}).output.value;expect(Number.isSafeInteger(actual)).toBe(true);expect(BigInt(actual)).toBe(exact(n));}
});
it('preserves the exact offered integer boundaries and excludes fractional/nonfinite/out-of-domain values',()=>{
 expect(runCalculator(base64SizeCalculator,{inputBytes:0}).output.value).toBe(0);
 expect(Object.is(runCalculator(base64SizeCalculator,{inputBytes:-0}).output.value,-0)).toBe(true);
 expect(runCalculator(base64SizeCalculator,{inputBytes:Number(maximum)}).output.value).toBe(1_333_333_333_333_336);
 for(const inputBytes of [-1,0.5,Number(maximum)+1,NaN,Infinity,-Infinity])expect(()=>runCalculator(base64SizeCalculator,{inputBytes})).toThrow();
});
