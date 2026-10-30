import {it,expect} from 'vitest';
import {remainingContracts,remainingExamples,remainingOutputSchemas,exportRemainingContract,importRemainingContract} from './remaining-contracts';
const ids=[25,37,45,47,57,58,59,60,61,62,63,66,67,68,69,70,71,72,73,74,75,76,77,78,79,83,93,94,100,101,102,106,107,108,110,111,113,114,115,116,117,118,119,465,466,473,477,480,494,528,537];
it('implements the exact remaining51 distinct private identities without registration',()=>{expect(remainingContracts.map(d=>Number(d.id.split('.').at(-1)))).toEqual(ids);for(const d of remainingContracts){expect(d.reviewStatus).toBe('draft');expect(d.version).toBe(1);expect(d.formulas[0].description).toContain('RELEASE HOLD');}});
it.each(ids)('%i enforces strict I/O, actual replay and plan parity',id=>{
 const s=exportRemainingContract(id,remainingExamples[id]);expect(exportRemainingContract(id,remainingExamples[id],'pro')).toEqual(s);expect(exportRemainingContract(id,remainingExamples[id],'business')).toEqual(s);expect(importRemainingContract(JSON.parse(JSON.stringify(s)))).toEqual(s);
 expect(Object.isFrozen(s.methodology)).toBe(true);expect(Object.isFrozen(s.calculation.output.details)).toBe(true);
 expect(remainingOutputSchemas[id].safeParse(s.calculation.output).success).toBe(true);expect(remainingOutputSchemas[id].safeParse({...s.calculation.output,unexpected:true}).success).toBe(false);
 expect(()=>exportRemainingContract(id,{...remainingExamples[id],unexpected:true})).toThrow();expect(()=>exportRemainingContract(id,{...remainingExamples[id],scope:'canonical-approved'})).toThrow();
 for(const alter of [(p:typeof s)=>{p.masterId=id===25?37:25;},(p:typeof s)=>{p.calculation.output.value=123456789;},(p:typeof s)=>{p.methodology.formulas=[];}]){const p=JSON.parse(JSON.stringify(s));alter(p);expect(()=>importRemainingContract(p)).toThrow();}
});
it('aligns Gregorian calendar dates from the original anchor rather than drifting after February',()=>{
 const s=exportRemainingContract(25,{...remainingExamples[25],firstPaymentDate:'2028-01-31',targetPaymentDate:'2028-03-31',monthRule:'clamp-original-day'});
 expect(s.calculation.output).toMatchObject({value:400,details:{targetMonths:3,paymentDates:['2028-01-31','2028-02-29','2028-03-31'],payoffDate:'2028-03-31'}});
 for(const p of [{firstPaymentDate:'2027-02-29'},{targetPaymentDate:'2028-03-30'},{firstPaymentDate:'2028-03-31',targetPaymentDate:'2028-01-31'},{firstPaymentDate:'2028-01-30',monthRule:'end-of-month'}])expect(()=>exportRemainingContract(25,{...remainingExamples[25],...p})).toThrow();
});
it('rejects vanished annuity factors, zero denominators and unsupported medical/fee policy fields',()=>{
 expect(()=>exportRemainingContract(58,{...remainingExamples[58],annualReturnPercent:1e-20})).toThrow();
 expect(()=>exportRemainingContract(74,{...remainingExamples[74],sharePrice:0})).toThrow();
 expect(()=>exportRemainingContract(528,{...remainingExamples[528],met:21})).toThrow();
 expect(()=>exportRemainingContract(465,{...remainingExamples[465],distanceKm:0})).toThrow();
 expect(()=>exportRemainingContract(72,{...remainingExamples[72],lowerRatePercent:30,upperRatePercent:40})).toThrow();
});
it('pins the reused source snapshot and rejects tampered source bindings',()=>{
 const s=exportRemainingContract(72,remainingExamples[72]);expect(s).toHaveProperty('sourceSnapshot.baselineSHA','bd0433f970819ed113553a5e71b6827d838f662b');const t=JSON.parse(JSON.stringify(s));t.sourceSnapshot.sourceTreeSHA256='0'.repeat(64);expect(()=>importRemainingContract(t)).toThrow();
});
it('rejects raw percentage underflow while preserving genuine zeros and declared rounding',()=>{
 for(const [id,p] of [[116,{bill:1e-200,tipPercent:1e-200,people:1}],[117,{price:1e-200,discountPercent:1e-200}],[118,{price:1e-200,discountPercent:1e-200}]] as const)expect(()=>exportRemainingContract(id,{...remainingExamples[id],...p})).toThrow();
 expect(exportRemainingContract(119,{...remainingExamples[119],eligibleSales:0}).calculation.output.value).toBe(0);
 expect(exportRemainingContract(119,{...remainingExamples[119],eligibleSales:1e-100}).calculation.output.value).toBe(0);
});
it('rejects raw growth and Fisher cancellation while retaining exact zero relationships',()=>{
 expect(()=>exportRemainingContract(62,{...remainingExamples[62],beginningValue:100,endingValue:100.000000000001,years:200})).toThrow();
 expect(()=>exportRemainingContract(68,{...remainingExamples[68],nominalReturnPercent:1e-20,inflationPercent:0})).toThrow();
 expect(exportRemainingContract(62,{...remainingExamples[62],endingValue:100}).calculation.output.value).toBe(0);
 expect(exportRemainingContract(68,{...remainingExamples[68],nominalReturnPercent:5,inflationPercent:5}).calculation.output.value).toBe(0);
});
