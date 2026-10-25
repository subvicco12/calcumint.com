import {expect,it} from 'vitest';
import {calculatorRegistry} from '@/calculators/registry';
import {reviewerFields,calculateReviewerPreview,parseReviewerFields} from './calculator-review-preview';
it('reuses the actual engine/schema and immutable version rather than a substitute formula',()=>{const d=calculatorRegistry.getBySlug('power-calculator')!;const result=calculateReviewerPreview(d,{work:100,time:20});expect(result.output).toEqual({value:5,steps:['Power = work / time = 5']});expect(result.calculatorSlug).toBe(d.slug);expect(result.calculatorVersion).toBe(d.version);});
it('keeps empty numeric input invalid instead of silently calculating zero',()=>{expect(()=>parseReviewerFields({work:100,time:20},{work:'',time:'20'})).toThrow();expect(()=>parseReviewerFields({work:100,time:20},{work:'NaN',time:'20'})).toThrow();});
it('preserves nested and string contracts without coercing strings to numbers',()=>{expect(parseReviewerFields({seed:'42',values:[1,2],options:{base:2}},{seed:'9007199254740993',values:'[3,4]',options:'{"base":8}'})).toEqual({seed:'9007199254740993',values:[3,4],options:{base:8}});});
it('does not fabricate example inputs for definitions without examples',()=>{const d={...calculatorRegistry.getBySlug('power-calculator')!,examples:[]};expect(reviewerFields(d)).toBeUndefined();});
it('rejects unknown fields and schema violations',()=>{expect(()=>parseReviewerFields({work:1},{work:'1',untrusted:'7'})).toThrow();expect(()=>calculateReviewerPreview(calculatorRegistry.getBySlug('power-calculator')!,{work:100,time:0})).toThrow();});
