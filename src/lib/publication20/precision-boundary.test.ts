import {it,expect} from 'vitest';
import {runCalculator} from '@/calculators/engine';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-replay';
import {publication20Definitions} from './index';
import {validatePublication20Result} from './result-trust';
const inputOf=(e:typeof publication20Definitions[number])=>Object.fromEntries(e.fields.map(f=>[f.key,f.kind==='number'?Number(f.defaultValue):f.defaultValue]));
it('reproduces nonzero subnormal precision loss and refuses new captures without rewriting v1 replay',()=>{
 const e=publication20Definitions.find(e=>e.catalogId===423)!,input={value:requiredCalculatorNumber('1e-323'),fromUnit:'m',toUnit:'mm'},output=runCalculator(e.definition,input).output;
 expect(output.result).toBe(9.88e-321);expect(output.result).not.toBe(0);
 // Exact IEEE754 subnormal output = fractionBits * 2^-1074. Compare it
 // with the exact typed-decimal expectation 10^-320 using integer arithmetic.
 const bytes=new DataView(new ArrayBuffer(8));bytes.setFloat64(0,output.result as number);const bits=bytes.getBigUint64(0);expect(bits>>52n).toBe(0n);const scaled=bits*10n**320n,denominator=2n**1074n;
 expect((denominator-scaled)*100n>denominator).toBe(true); // More than1% relative error.
 expect(()=>validatePublication20Result(e,input,output)).toThrow(/subnormal|precision|underflows/i);
 const snapshot={calculatorSlug:e.definition.slug,calculatorVersion:1,input,output};expect(verifyRegisteredSnapshot(snapshot).snapshot.output.result).toBe(output.result);
});
it.each(publication20Definitions)('refuses subnormal new scalar provenance for exact profile $catalogId',e=>{const input=inputOf(e),field=e.fields.find(f=>f.kind==='number')!;input[field.key]=1e-323;const output=runCalculator(e.definition,input).output;expect(()=>validatePublication20Result(e,input,output)).toThrow(/subnormal|precision|underflows/i);});
it('refuses nonzero subnormal results from normal inputs, retaining ordinary tiny numbers and valid zeros',()=>{const e=publication20Definitions.find(e=>e.catalogId===423)!;let input={value:1e-307,fromUnit:'m',toUnit:'km'},output=runCalculator(e.definition,input).output;expect(output.result).not.toBe(0);expect(()=>validatePublication20Result(e,input,output)).toThrow(/subnormal|precision|underflows/i);input={...input,value:1e-300};output=runCalculator(e.definition,input).output;expect(()=>validatePublication20Result(e,input,output)).not.toThrow();input={...input,value:0};output=runCalculator(e.definition,input).output;expect(()=>validatePublication20Result(e,input,output)).not.toThrow();const t=publication20Definitions.find(e=>e.catalogId===427)!,zero={value:-273.15,fromUnit:'c',toUnit:'k'};expect(()=>validatePublication20Result(t,zero,runCalculator(t.definition,zero).output)).not.toThrow();});
