import {expect,it} from 'vitest';
import {statisticsContracts} from '@/lib/statistics-integration-20261117/cohort';
import {runFactoryCalculation} from '@/lib/calculator-factory/registry';
import {runFactoryEmbedCalculation} from './factory-embed-contract';
import {factoryAutomationBatchSchema,runFactoryAutomationBatch,verifyFactoryAutomationRows} from './factory-automation-contract';

it.each(statisticsContracts.map(contract=>[contract.catalogId,contract] as const))(
 'preserves the exact API, embed and bounded batch capture for statistics #%i',
 (id,contract)=>{
  const {version,primaryKey}=contract;
  const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
  const exact=runFactoryCalculation(id,version,raw);
  const embed=runFactoryEmbedCalculation(id,version,raw);
  expect('packet' in embed && embed.packet).toEqual(exact);
  expect(exact.snapshot.output[primaryKey]).toEqual(expect.any(Number));
  const inputs=[raw,{...raw,[contract.fields[0].key]:''}];
  const rows=runFactoryAutomationBatch({catalogId:id,version,rows:inputs});
  expect(rows[0]).toMatchObject({index:0,ok:true,result:{packet:exact}});
  expect(rows[1]).toMatchObject({index:1,ok:false});
  verifyFactoryAutomationRows(id,version,inputs,rows);
  const tampered=structuredClone(rows);
  if(tampered[0].ok) tampered[0].result.packet={...exact,identity:{...exact.identity,sourceVersion:'wrong-source'}};
  expect(()=>verifyFactoryAutomationRows(id,version,inputs,tampered)).toThrow();
  expect(()=>runFactoryEmbedCalculation(id,version+1,raw)).toThrow();
  expect(factoryAutomationBatchSchema.safeParse({catalogId:id,version:version+1,rows:inputs}).success).toBe(false);
 },
);
