import { expect, it } from 'vitest';
import { createCalculationSnapshot } from './calculation-snapshot';
import { calculateScenarioSensitivity } from './scenario-sensitivity';
import { presentSensitivityResults } from './scenario-sensitivity-presentation';

it('presents deterministic engine values and baseline differences without modifying captured evidence', () => {
  const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50,note:'unchanged'}});
  const original=JSON.stringify(baseline);
  const points=calculateScenarioSensitivity(baseline,'percentage',[10,20,30]);
  const rows=presentSensitivityResults(baseline,points);
  expect(rows.map(row=>row.metrics.find(metric=>metric.field==='result')?.value)).toEqual([25,50,75]);
  expect(rows.map(row=>row.metrics.find(metric=>metric.field==='result')?.baselineDifference)).toEqual([-25,0,25]);
  expect(Object.isFrozen(rows)).toBe(true);
  expect(Object.isFrozen(rows[0].metrics)).toBe(true);
  expect(JSON.stringify(baseline)).toBe(original);
});

it('fails closed for mismatched calculator identity and omits nonnumeric output fields', () => {
  const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
  const foreign=createCalculationSnapshot({calculatorSlug:'unit-conversion-calculator',calculatorVersion:1,input:{value:1,fromUnit:'mi',toUnit:'km'},output:{result:1.609344}});
  expect(()=>presentSensitivityResults(baseline,[{inputValue:1,snapshot:foreign}])).toThrow('identity mismatch');
  const points=calculateScenarioSensitivity(baseline,'percentage',[10]);
  expect(presentSensitivityResults(baseline,points)[0].metrics).toEqual([{field:'result',value:25,baselineDifference:-25}]);
});

it('reports unavailable baseline comparisons without inventing values or units',()=>{
 const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const candidate=createCalculationSnapshot({...baseline,output:{result:75,other:12,description:'not numeric'}});
 const rows=presentSensitivityResults(baseline,[{inputValue:30,snapshot:candidate}]);
 expect(rows[0].metrics).toEqual([
  {field:'result',value:75,baselineDifference:25},
  {field:'other',value:12,baselineDifference:null},
 ]);
 expect(rows[0].metrics.some(metric=>metric.field==='description')).toBe(false);
});

it('keeps an overflowing numeric delta unavailable rather than presenting infinity',()=>{
 const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:-1e308}});
 const candidate=createCalculationSnapshot({...baseline,output:{result:1e308}});
 const rows=presentSensitivityResults(baseline,[{inputValue:30,snapshot:candidate}]);
 expect(rows[0].metrics).toEqual([{field:'result',value:1e308,baselineDifference:null}]);
 expect(JSON.stringify(baseline.output)).toBe(JSON.stringify({result:-1e308}));
});
