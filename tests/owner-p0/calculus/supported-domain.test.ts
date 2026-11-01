import {it,expect} from 'vitest';
import {polynomialWitnesses} from './supported-domain-witnesses';
import {runCanonicalCalculus as run} from '../../../src/calculators/canonical-calculus';
it('bounded polynomial proof tooling rejects unsupported witness requests',()=>{
 for(const degree of [-1,33,1.5,NaN,Infinity])expect(()=>polynomialWitnesses(degree)).toThrow();
});
it('independent integer antiderivative and derivative witnesses reach degree32 without analytic inference',()=>{
 const witnesses=polynomialWitnesses(32);expect(witnesses).toHaveLength(297);
 for(const witness of witnesses){
  const actual=run(witness.input);expect(actual.exact,JSON.stringify(witness.input)).toEqual(witness.exact);
  expect(actual.arithmetic).toBe('exact-rational');
 }
});
it('actual engine refuses degree33 and original-domain holes at boundary coordinates',()=>{
 for(const x of ['-2','0','2']){
  expect(()=>run({operation:'derivative',expression:'x^33',x})).toThrow();
  expect(()=>run({operation:'derivative',expression:`(x-(${x}))/(x-(${x}))`,x})).toThrow();
 }
});
