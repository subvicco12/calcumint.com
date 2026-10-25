import {describe,it,expect} from 'vitest';
import {privateScientificDefinitions as definitions} from './private-scientific-definitions';
import {calculatorRegistry} from './registry';
import {getReviewerCalculator} from './reviewer-definitions';
import {runCalculator} from './engine';
describe('private scientific catalog identities',()=>{
 it('retains five identities behind reviewer lookup without public registration',()=>{
  expect(definitions.map(x=>x.masterId).sort()).toEqual([491,495,535,536,539]);
  expect(new Set(definitions.map(x=>x.definition.id)).size).toBe(5);
  for(const {definition:d} of definitions){expect(d.reviewStatus).toBe('draft');expect(calculatorRegistry.getBySlug(d.slug)).toBeUndefined();expect(getReviewerCalculator(d.slug)).toBe(d);expect(d.sources[0].url).toMatch(/^https:\/\/github.com\//);expect(()=>runCalculator(d,d.examples[0].input)).not.toThrow();}
 });
 it('shares mathematics rather than conflating duplicate catalog identities',()=>{
  for(const [a,b] of [[491,539],[495,536]]){const x=definitions.find(d=>d.masterId===a)!.definition,y=definitions.find(d=>d.masterId===b)!.definition;expect(x.calculate).toBe(y.calculate);expect(x.id).not.toBe(y.id);expect(runCalculator(x,x.examples[0].input).output).toEqual(runCalculator(y,x.examples[0].input).output);}
 });
 it('does not fabricate a heat result outside the review guard',()=>{
  const d=definitions[0].definition;const output=runCalculator(d,{temperature:70,temperatureUnit:'F',relativeHumidityPercent:50}).output;
  expect(output).toMatchObject({status:'unsupported'});expect(output).not.toHaveProperty('heatIndexF');
 });
});
