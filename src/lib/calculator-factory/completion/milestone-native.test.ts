import {z} from 'zod';
import {it,expect} from 'vitest';
import caseData from '../../../../docs/milestone60-20261113/business-account-cases.json';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import {runFactoryEmbedCalculation} from '@/lib/native-delivery/factory-embed-contract';
import {getFactoryContract,getFactoryWorkflows} from '../registry';
it.each(z.array(z.object({id:z.number().int(),slug:z.string(),version:z.number().int(),input:z.record(z.string(),z.string())}).strict()).parse(caseData))('delivers only the exact new registered immutable tuple $id',row=>{
 const contract=getFactoryContract(row.id)!;expect(factoryDeliveryIdentity(row.id,1)).toEqual({catalogId:row.id,engineId:contract.engineId,slug:row.slug,version:1});
 expect(runFactoryEmbedCalculation(row.id,1,row.input).output).toEqual(getFactoryWorkflows(row.id).execute(row.input).snapshot.output);
 expect(factoryDeliveryIdentity(row.id,2)).toBeUndefined();
});
it('continues refusing private and unknown mathematical successors',()=>{for(const id of [323,324,435,441,999])expect(factoryDeliveryIdentity(id,1)).toBeUndefined();});
