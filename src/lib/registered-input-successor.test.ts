import {expect,it} from 'vitest';
import {requiredCalculatorNumber} from './registered-input-successor';
import {requiredCalculatorNumber as original} from '@/calculators/final-framework/numeric-input';
it.each(['',' ','9007199254740993','0.10000000000000001','1e-400','1e400','Infinity','NaN','0x10','1_000'])('rejects unsupported or lossy registered draft %j',text=>{
 expect(Number.isNaN(requiredCalculatorNumber(text))).toBe(true);
});
it.each(['0','-0','1','0.1','-0.0001','1e-12','1e20',' 12.50 '])('preserves supported historical numeric value %j',text=>{
 expect(Object.is(requiredCalculatorNumber(text),original(text))).toBe(true);
});
