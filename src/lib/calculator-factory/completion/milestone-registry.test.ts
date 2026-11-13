import {z} from 'zod';
import {expect,it} from 'vitest';
import caseData from '../../../../docs/milestone60-20261113/business-account-cases.json';
import {getFactoryContract,getFactoryWorkflows} from '@/lib/calculator-factory/registry';
it.each(z.array(z.object({id:z.number().int(),slug:z.string(),version:z.number().int(),input:z.record(z.string(),z.string())}).strict()).parse(caseData))('integrates exact registered calculator $id without changing historical engines',row=>{
 const contract=getFactoryContract(row.id);expect(contract?.registered).toBe(true);expect(contract?.slug).toBe(row.slug);
 const workflow=getFactoryWorkflows(row.id),packet=workflow.execute(row.input);
 expect(workflow.replay(JSON.stringify(packet))).toEqual(packet);expect(packet.snapshot.calculatorSlug).toBe(row.slug);
 expect(()=>workflow.execute({...row.input,extra:'unapproved'})).toThrow();
 for(const plan of ['pro','business'] as const)expect(JSON.parse(workflow.exportPacket(packet,'json',plan))).toEqual(packet);
 expect(()=>workflow.exportPacket(packet,'json','free')).toThrow();
});
