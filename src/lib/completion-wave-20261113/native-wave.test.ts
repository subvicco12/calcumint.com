import {it,expect} from 'vitest';
import {businessCases,restrictedBusinessIds} from './business-cases';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import {runFactoryEmbedCalculation} from '@/lib/native-delivery/factory-embed-contract';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
it.each(businessCases())('delivers immutable registered tuple $id without changing the engine output',row=>{
 expect(factoryDeliveryIdentity(row.id,row.version)).toMatchObject({catalogId:row.id,engineId:row.engine,slug:row.slug,version:row.version});
 const result=runFactoryEmbedCalculation(row.id,row.version,row.input);
 expect(result.output).toEqual(getFactoryWorkflows(row.id).execute(row.input).snapshot.output);
 expect(()=>runFactoryEmbedCalculation(row.id,2,row.input)).toThrow();
});
it.each(restrictedBusinessIds)('keeps private successor %s out of native delivery',id=>expect(factoryDeliveryIdentity(id,1)).toBeUndefined());
