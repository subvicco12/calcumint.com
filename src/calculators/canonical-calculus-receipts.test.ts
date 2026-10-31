/** Shipped browser receipts are immutable: a later revision needs a new reader, not rewritten old outputs. */
import {it,expect} from 'vitest';
import derivative from '../../docs/canonical-calculus/receipts/derivative-v3.json';
import integral from '../../docs/canonical-calculus/receipts/integral-v3.json';
import limit from '../../docs/canonical-calculus/receipts/limit-v3.json';
import legacy from '../../docs/canonical-calculus/receipts/derivative-legacy-v2.json';
import {importCanonicalCalculation,exportCanonicalCalculation} from './canonical-calculus-workflow';
import {importPrivateCalculus} from './private-calculus-successor';
it.each([['derivative',derivative],['integral',integral],['limit',limit]])('reopens immutable actual-browser %s revision3 receipt across every plan',(_,receipt)=>{expect(importCanonicalCalculation(receipt)).toEqual(receipt);for(const plan of ['free','pro','business'] as const)expect(exportCanonicalCalculation(receipt.calculation.input,plan)).toEqual(receipt);});
it('retains the downloaded historical revision2 artifact without upgrading its value or identity',()=>{expect(importPrivateCalculus(legacy)).toEqual(legacy);expect(legacy.calculation.calculatorVersion).toBe(2);expect(legacy.calculation.output.value).toBe(12);});
