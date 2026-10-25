import {expect,it} from 'vitest';
import {calculatorRegistry} from './registry';
import {runCalculator} from './engine';
// Independent 70-digit Decimal evaluation of the documented constants, rounded to six places.
it.each([['speed-of-sound-calculator',340.292287],['barometric-pressure-calculator',89874.560427]] as const)('keeps the displayed %s worked example consistent with its explicit physical model', (slug,value)=>{
 const d=calculatorRegistry.getBySlug(slug)!;const example=d.examples[0];expect(runCalculator(d,example.input).output).toMatchObject({value});expect(example.expected).toMatchObject({value});
});
