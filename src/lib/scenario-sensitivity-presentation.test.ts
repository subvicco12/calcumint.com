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

it('preserves candidate ordering and duplicate values without rounding presentation differences',()=>{
 const baseline=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const points=calculateScenarioSensitivity(baseline,'percentage',[30,10,30,20]);
 const presentation=presentSensitivityResults(baseline,points);
 expect(presentation.map(row=>row.inputValue)).toEqual([30,10,30,20]);
 expect(presentation.map(row=>row.metrics[0].baselineDifference)).toEqual([25,-25,25,0]);
 expect(presentation.map(row=>row.metrics[0].value)).toEqual([75,25,75,50]);
});

it('uses the same recorded-decimal difference as scenario reports for actual percentage engine values',async()=>{
 const {percentageCalculator}=await import('@/calculators/core/percentage');const {runCalculator}=await import('@/calculators/engine');const {captureScenario}=await import('./scenario-set');const {createScenarioReport}=await import('./scenario-report');
 const input={percentage:10,value:1},baseline=createCalculationSnapshot({calculatorSlug:percentageCalculator.slug,calculatorVersion:1,input,output:runCalculator(percentageCalculator,input).output});
 const points=calculateScenarioSensitivity(baseline,'percentage',[30]);expect(baseline.output.result).toBe(.1);expect(points[0].snapshot.output.result).toBe(.3);
 const captures=captureScenario(captureScenario([],'A',baseline,''),'B',points[0].snapshot,'');
 expect(createScenarioReport(captures).metrics[0].cells[1].difference).toBe(.2);
 expect(presentSensitivityResults(baseline,points)[0].metrics[0].baselineDifference).toBe(.2);
});

it('keeps recorded-centimetre sensitivity differences consistent with scenario-report metres',async()=>{
 const {unitConversionCalculator}=await import('@/calculators/core/unit-conversion');const {runCalculator}=await import('@/calculators/engine');const input={value:1,fromUnit:'cm',toUnit:'m'};
 const baseline=createCalculationSnapshot({calculatorSlug:unitConversionCalculator.slug,calculatorVersion:1,input,output:runCalculator(unitConversionCalculator,input).output});
 const points=calculateScenarioSensitivity(baseline,'value',[3]);expect(baseline.output.result).toBe(.01);expect(points[0].snapshot.output.result).toBe(.03);expect(presentSensitivityResults(baseline,points)[0].metrics[0].baselineDifference).toBe(.02);
 expect(baseline.input).toEqual(input);expect(points[0].snapshot.input.toUnit).toBe('m');
});
