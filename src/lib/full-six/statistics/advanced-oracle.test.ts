import {describe,it,expect} from 'vitest';
import Decimal from 'decimal.js';
import {createHash} from 'node:crypto';
import {calculateAdvancedStatistics} from './advanced';
import {advancedOracleFixtures,advancedOracleMetadata} from './advanced-oracle-fixtures';
const D=Decimal.clone({precision:300});
function relative(actual:string,expected:string,budget:string){const a=new D(actual),e=new D(expected);if(e.isZero())expect(a.isZero()).toBe(true);else expect(a.minus(e).abs().div(e.abs()).lte(budget)).toBe(true);}
describe('independent Python Fraction/200and300digit statistics oracle',()=>{
 it('pins the actual independent oracle source and runtime receipt',()=>{expect(createHash('sha256').update(advancedOracleMetadata.source).digest('hex')).toBe(advancedOracleMetadata.sourceSHA256);expect(advancedOracleMetadata.runtime).toMatch(/^Python 3\./);});
 for(const row of advancedOracleFixtures){
  it(row.case.name,()=>{
   const c=row.case as {mode:'population'|'sample';values:readonly string[];frequencies?:readonly string[];targetMetric:'variance'|'standardDeviation';target:string;shift:string};
   const dataset={mode:c.mode,encoding:c.frequencies?'frequency' as const:'raw' as const,rows:c.values.map((value,i)=>({value,...(c.frequencies?{frequency:c.frequencies[i]}:{})}))};
   const result=calculateAdvancedStatistics({dataset,analysis:{kind:'target-scale',metric:c.targetMetric,target:c.target,shift:c.shift}});
   expect(result.status).toBe('finite');if(result.status!=='finite')throw Error(result.message);
   for(const key of ['mean','variance','standardDeviation'] as const)relative(result.summary.metrics[key],row.expected[key],'1e-40');
   const a=result.analysis;if(!a||a.kind!=='target-scale')throw Error('Missing target analysis');
   relative(a.scale,row.expected.scale,'1e-40');relative(a.forward.metrics[c.targetMetric],row.expected.target,'1e-40');
  });
 }
});
