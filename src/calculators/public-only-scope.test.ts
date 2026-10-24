import {expect,it} from 'vitest';
import {calculatorRegistry} from './registry';
import {restrictPublishedSlugs} from './public-only-scope';
const definitions=calculatorRegistry.list();
it('never grants missing, changed, or excluded identities',()=>{
 const slugs=new Set(['percentage-of-value-calculator','unit-conversion-calculator','loan-emi-calculator']);
 expect([...restrictPublishedSlugs('public-only',definitions,slugs)]).toEqual(['percentage-of-value-calculator','unit-conversion-calculator']);
 expect([...restrictPublishedSlugs('public-only',definitions,new Set(['unit-conversion-calculator']))]).toEqual(['unit-conversion-calculator']);
 expect(restrictPublishedSlugs('public-only',definitions,new Set()).size).toBe(0);
 for(const patch of [{version:2},{id:'forged'},{category:'finance'}])expect(restrictPublishedSlugs('public-only',definitions.map(d=>({...d,...patch})),slugs).size).toBe(0);
 expect(restrictPublishedSlugs('invalid',definitions,slugs).size).toBe(0);
 expect(restrictPublishedSlugs('full',definitions,slugs)).toEqual(slugs);
});
