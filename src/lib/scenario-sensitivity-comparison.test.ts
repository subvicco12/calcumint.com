import { describe, expect, it } from 'vitest';
import { createCalculationSnapshot } from './calculation-snapshot';
import { compareScenarioSensitivity } from './scenario-sensitivity-comparison';

describe('engine-output sensitivity comparison', () => {
 const captured=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 it('reconciles every delta to the frozen captured baseline without changing engine outputs',()=>{
  const original=JSON.stringify(captured);
  const rows=compareScenarioSensitivity(captured,'percentage','result',[10,20,30]);
  expect(rows).toEqual([
   {inputValue:10,outputValue:25,differenceFromBaseline:-25},
   {inputValue:20,outputValue:50,differenceFromBaseline:0},
   {inputValue:30,outputValue:75,differenceFromBaseline:25},
  ]);
  expect(JSON.stringify(captured)).toBe(original);
  expect(Object.isFrozen(rows)).toBe(true);
 });
 it('fails closed on missing or nonnumeric outputs and unapproved engines',()=>{
  expect(()=>compareScenarioSensitivity(captured,'percentage','missing',[10])).toThrow();
  expect(()=>compareScenarioSensitivity(captured,'missing','result',[10])).toThrow();
  const nested=createCalculationSnapshot({...captured,output:{result:{value:50}}});
  expect(()=>compareScenarioSensitivity(nested,'percentage','result',[10])).toThrow();
  const mortgage=createCalculationSnapshot({calculatorSlug:'mortgage-calculator',calculatorVersion:1,input:{principal:100},output:{monthlyPayment:10}});
  expect(()=>compareScenarioSensitivity(mortgage,'principal','monthlyPayment',[100])).toThrow();
 });
});
