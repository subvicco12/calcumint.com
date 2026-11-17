import {expect,it} from 'vitest';
import {quartileCalculator} from '../../src/calculators/statistics/catalog-batch-4';
import {createEngineeringContract} from '../../src/lib/calculator-factory/completion/next-engineering-core';
import {statisticsWorkflows} from '../../src/lib/worker2-statistics-b-20261117/cohort';
it('the new cohort needs a genuine array-aware contract rather than scalar-field coercion',()=>{
 expect(()=>createEngineeringContract(quartileCalculator,{catalogId:296,primaryKey:'quartile',unit:'supplied unit',scope:'Type7 quartile',sourceEvidence:[]})).toThrow('Numeric engineering fields required');
 expect(statisticsWorkflows(296).execute({values:'[1,2,3,4]',quartileNumber:'1'}).snapshot.output.quartile).toBe(1.75);
});
