import {expect,it} from 'vitest';
import {getReviewerCalculator} from './reviewer-definitions';
import {calculatorRegistry} from './registry';
import {calculateReviewerPreview} from '../lib/calculator-review-preview';
import {serializeCalculationJson} from '../lib/calculation-snapshot';
import {serializeCalculationCsv,serializeCalculationPdf} from '../lib/calculation-export';
const ids=[81,85,86,126,469,488,516];
it.each(ids)('exposes only a versioned private bounded profile for source case %s',id=>{
 const d=getReviewerCalculator('private-source-'+id);expect(d).toBeDefined();
 expect(d!.id).toBe('private.source.'+id);expect(d!.version).toBe(1);expect(d!.reviewStatus).toBe('draft');expect(calculatorRegistry.getBySlug(d!.slug)).toBeUndefined();
 expect(d!.sources.length).toBeGreaterThan(0);expect(d!.formulas.map(f=>f.description).join(' ').toLowerCase()).toContain('pending');
});
it.each([21,32,36,43,46,49,80,84,125,127,134,198,199,468,470,472])('does not equate generic component reuse with supported calculator contract %s',id=>{expect(getReviewerCalculator('private-source-'+id)).toBeUndefined();});
it.each(ids)('exports immutable actual-engine snapshots for source case %s',id=>{
 const d=getReviewerCalculator('private-source-'+id);expect(d).toBeDefined();
 for(const e of d!.examples){
  const input=structuredClone(e.input),before=structuredClone(input);const snapshot=calculateReviewerPreview(d!,input);
  expect(input).toEqual(before);expect(snapshot.calculatorSlug).toBe(d!.slug);expect(snapshot.calculatorVersion).toBe(1);expect(Object.isFrozen(snapshot)).toBe(true);
  const json=serializeCalculationJson(snapshot),csv=serializeCalculationCsv(snapshot.input,snapshot.output),pdf=serializeCalculationPdf(snapshot,{title:d!.title,formulas:d!.formulas,sources:d!.sources});
  expect(JSON.parse(json).input).toEqual(before);expect(JSON.parse(json).output).toEqual(snapshot.output);expect(csv).toContain('"output"');expect(Buffer.from(pdf).subarray(0,8).toString()).toContain('%PDF-1.7');
  Object.assign(input as object,{untrustedReplacement:1});expect(serializeCalculationJson(snapshot)).toBe(json);expect(serializeCalculationCsv(snapshot.input,snapshot.output)).toBe(csv);
 }
});
