import {it,expect} from 'vitest';
import Decimal from 'decimal.js';
import fixtures from '../../../tests/first20-publication/polygon-oracle.json';
import {polygonAreaSuccessor} from './polygon-successor';
import {runCalculator} from '@/calculators/engine';
const Reference=Decimal.clone({precision:140});
for(const fixture of fixtures.cases)it(`independent polygon oracle: ${fixture.label} n=${fixture.input.sides}`,()=>{
 if(!fixture.expectedFinite){expect(()=>runCalculator(polygonAreaSuccessor,fixture.input)).toThrow(/finite range/);return;}
 const actual=runCalculator(polygonAreaSuccessor,fixture.input).output.result,reference=new Reference(fixture.reference);
 expect(Number.isFinite(actual)).toBe(true);
 // Engineering witness budget only, not an approved full-domain product tolerance.
 expect(new Reference(actual.toString()).minus(reference).abs().div(reference).lte('1e-14')).toBe(true);
});
