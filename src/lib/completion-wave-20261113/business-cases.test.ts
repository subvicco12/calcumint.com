import {describe,it,expect} from 'vitest';
import {businessCases,remainingBusinessIds,restrictedBusinessIds} from './business-cases';
import {getFactoryContract,getFactoryWorkflows,runFactoryCalculation} from '../calculator-factory/registry';
import {writeFileSync} from 'node:fs';

describe('remaining Business genuine journey inputs',()=>{
 it('covers every remaining registered tuple with executable independent edits and exact replay',()=>{
  const cases=businessCases();expect(cases).toHaveLength(16);
  expect([...cases.map(row=>row.id),...restrictedBusinessIds].sort((a,b)=>a-b)).toEqual([...remainingBusinessIds].sort((a,b)=>a-b));
  for(const row of cases){const contract=getFactoryContract(row.id)!;expect(row).toMatchObject({engine:contract.engineId,slug:contract.slug,version:contract.version});
   const packet=runFactoryCalculation(row.id,row.version,row.input);expect(getFactoryWorkflows(row.id).replay(JSON.stringify(packet))).toEqual(packet);
   expect(()=>runFactoryCalculation(row.id,row.version+1,row.input)).toThrow();
  }
  if(process.env.BUSINESS_CASES_OUTPUT)writeFileSync(process.env.BUSINESS_CASES_OUTPUT,JSON.stringify(cases,null,2)+'\n');
 });
 it('keeps proposed private successors outside registered hosted Business acceptance',()=>{
  for(const id of restrictedBusinessIds){const contract=getFactoryContract(id)!;expect(contract.registered).toBe(false);expect(contract.engineId).toMatch(/^private\.physics-scaled\./);expect(contract.privateRevision).toBeTruthy();expect(businessCases().some(row=>row.id===id)).toBe(false);}
 });
});
