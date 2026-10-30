import {it,expect} from 'vitest';
import {componentContracts,componentExamples,exportComponentContract,importComponentContract} from './component-contracts';
const ids=[3,4,5,6,7,8,11,12,13,14,15,16,17,22,24,27,28,29,30,31,33,104,105,426,506];
it('provides exactly25 distinct private draft contracts without replacing historical engines',()=>{
 expect(componentContracts.map(d=>Number(d.id.split('.').at(-1)))).toEqual(ids);
 for(const d of componentContracts){expect(d.version).toBe(1);expect(d.reviewStatus).toBe('draft');expect(d.formulas[0].description).toContain('RELEASE HOLD');}
});
it.each(ids)('%i has plan parity, detached immutable snapshots and exact replay',id=>{
 const a=exportComponentContract(id,componentExamples[id],'free');
 expect(exportComponentContract(id,componentExamples[id],'pro')).toEqual(a);
 expect(exportComponentContract(id,componentExamples[id],'business')).toEqual(a);
 expect(importComponentContract(JSON.parse(JSON.stringify(a)))).toEqual(a);
 expect(Object.isFrozen(a.calculation.input)).toBe(true);
 const tamper=JSON.parse(JSON.stringify(a));tamper.calculation.output.value=123456789;
 expect(()=>importComponentContract(tamper)).toThrow();
 const foreign=JSON.parse(JSON.stringify(a));foreign.masterId=id===3?27:3;
 expect(()=>importComponentContract(foreign)).toThrow();
 const version=JSON.parse(JSON.stringify(a));version.calculation.calculatorVersion=2;
 expect(()=>importComponentContract(version)).toThrow();
 expect(()=>exportComponentContract(id,{...componentExamples[id],unexpected:true})).toThrow();
 expect(()=>exportComponentContract(id,{...componentExamples[id],scope:'canonical-approved'})).toThrow();
});
it('preserves schedule cents and final partial payment at zero rate',()=>{
 expect(exportComponentContract(5,{...componentExamples[5],principal:1200,annualRatePercent:0,termMonths:3,extraMonthlyPayment:100}).calculation.output).toMatchObject({value:400,payoffMonths:3,totalPayment:1200,amortization:[{payment:500,balance:700},{payment:500,balance:200},{payment:200,balance:0}]});
});
it('restricts mass and cooking to named units and rejects nonphysical values',()=>{
 for(const id of [426,506])for(const value of [-1,NaN,Infinity])expect(()=>exportComponentContract(id,{...componentExamples[id],value})).toThrow();
 expect(()=>exportComponentContract(426,{...componentExamples[426],toUnit:'m'})).toThrow();
 expect(()=>exportComponentContract(506,{...componentExamples[506],toUnit:'kg'})).toThrow();
});
it('rejects unamortizing and numerically unrepresentable payment scenarios',()=>{
 expect(()=>exportComponentContract(4,{...componentExamples[4],balance:100,annualAprPercent:12,monthlyPayment:1})).toThrow();
 expect(()=>exportComponentContract(3,{...componentExamples[3],annualRatePercent:1e-20})).toThrow();
 expect(()=>exportComponentContract(12,{...componentExamples[12],annualRatePercent:1e-20})).toThrow();
 expect(()=>exportComponentContract(13,{...componentExamples[13],grossMonthlyIncome:0})).toThrow();
});
it('rejects altered methodology and dependency versions even with unchanged outputs',()=>{
 const s=JSON.parse(JSON.stringify(exportComponentContract(3,componentExamples[3])));s.methodology='other';expect(()=>importComponentContract(s)).toThrow();
 const t=JSON.parse(JSON.stringify(exportComponentContract(3,componentExamples[3])));t.dependencies[0].version=2;expect(()=>importComponentContract(t)).toThrow();
});
it('publishes closed complete output contracts with required original named fields',async()=>{
 const {componentOutputSchemas}=await import('./component-contracts');
 for(const id of ids){const output=exportComponentContract(id,componentExamples[id]).calculation.output;expect(componentOutputSchemas[id].safeParse(output).success).toBe(true);expect(componentOutputSchemas[id].safeParse({...output,unexpected:true}).success).toBe(false);const missing={...output};delete missing.unit;expect(componentOutputSchemas[id].safeParse(missing).success).toBe(false);}
 const missing=JSON.parse(JSON.stringify(exportComponentContract(3,componentExamples[3]).calculation.output));delete missing.totalInterest;expect(componentOutputSchemas[3].safeParse(missing).success).toBe(false);
});
it('rejects annuity domains whose denominator loses the amortizing principal component',()=>{
 for(const id of [3,12])expect(()=>exportComponentContract(id,{...componentExamples[id],annualRatePercent:1000,termMonths:1200})).toThrow();
 expect(()=>exportComponentContract(24,{...componentExamples[24],currentAnnualRatePercent:1000,currentRemainingMonths:1200})).toThrow();
 expect(()=>exportComponentContract(3,{...componentExamples[3],principal:0.01,termMonths:1200})).toThrow();
});
