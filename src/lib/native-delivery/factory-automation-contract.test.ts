import {describe,it,expect} from 'vitest';
import {factoryDeliveryCatalog} from './factory-delivery-catalog';
import {factoryContracts,runFactoryCalculation} from '@/lib/calculator-factory/registry';
import {factoryAutomationBatchSchema,runFactoryAutomationBatch,verifyFactoryAutomationRows,automationIdentity} from './factory-automation-contract';
import {technologyNativeCatalog} from './technology-five-catalog';
describe('exact nine reuse unchanged factory engines in durable batch shape',()=>{
 for(const identity of factoryDeliveryCatalog)it(`preserves ${identity.catalogId}@${identity.version} packet/output`,()=>{
  const contract=factoryContracts.find(x=>x.catalogId===identity.catalogId)!;
  const input=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
  const expected=runFactoryCalculation(identity.catalogId,identity.version,input);
  const rows=runFactoryAutomationBatch({catalogId:identity.catalogId,version:1,rows:[input]});
  expect(rows[0]).toMatchObject({index:0,ok:true,result:{engineId:identity.engineId,packet:expected,output:expected.snapshot.output}});
  if([322,325,327].includes(identity.catalogId))expect(rows[0].result!.output).toEqual({value:expected.snapshot.output.value,steps:expected.snapshot.output.steps});
  else expect('value' in rows[0].result!.output).toBe(false);
  verifyFactoryAutomationRows(identity.catalogId,1,[input],rows);
  expect(()=>verifyFactoryAutomationRows(identity.catalogId,1,[input],[{...rows[0],result:{...rows[0].result,output:{result:123}}}])).toThrow();
 });
 it('retains old20 tuple identities and 383v2',()=>{
  expect(technologyNativeCatalog).toHaveLength(20);
  for(const row of technologyNativeCatalog)expect(automationIdentity(row.catalogId,row.version)).toBe(row);
  expect(automationIdentity(383,1)).toBeUndefined();expect(automationIdentity(383,2)?.engineId).toBe('technology.website-bandwidth');
 });
 it('rejects other factory and private physics identities, wrong versions, numeric JSON and arbitrary code',()=>{
  for(const catalogId of [323,324,370,441])expect(factoryAutomationBatchSchema.safeParse({catalogId,version:1,rows:[{x:'2'}]}).success).toBe(false);
  expect(factoryAutomationBatchSchema.safeParse({catalogId:218,version:2,rows:[{x:'2'}]}).success).toBe(false);
  expect(factoryAutomationBatchSchema.safeParse({catalogId:218,version:1,rows:[{x:2}]}).success).toBe(false);
  const rows=runFactoryAutomationBatch({catalogId:218,version:1,rows:[{x:'2',formula:'arbitrary'},{x:'1e-200'},{x:'3'}]});
  expect(rows.map(row=>row.ok)).toEqual([false,false,true]);
 });
 it('inherits existing100 row bound without adding commercial limits',()=>{
  expect(()=>runFactoryAutomationBatch({catalogId:218,version:1,rows:Array.from({length:101},()=>({x:'2'}))})).toThrow();
 });
});
