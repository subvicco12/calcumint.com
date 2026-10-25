import cases from '../../tests/next-runtime/owner-scope-cases.json';
import {privateOwnerDefinitions} from './private-owner-definitions';
import {expect,it} from 'vitest';
import {getReviewerCalculator} from './reviewer-definitions';
import {calculatorRegistry} from './registry';
import {runCalculator} from './engine';
import approval from '../../data/catalog/scope-policy-decisions-2026-10-25/owner-selections-2026-10-26.json';
it.each(approval.selected)('makes approved bounded master $masterId available only through private lookup',({masterId,title})=>{
 const d=getReviewerCalculator('private-owner-'+masterId);expect(d,`Approved master ${masterId} lacks implementation`).toBeDefined();expect(d!.title).toBe(title);expect(d!.reviewStatus).toBe('draft');expect(calculatorRegistry.getBySlug(d!.slug)).toBeUndefined();expect(d!.examples.length).toBeGreaterThan(0);
 for(const e of d!.examples){expect(()=>runCalculator(d!,e.input)).not.toThrow();}
});
it('does not treat an unapproved specialist scope or rejected mapping as an owner implementation',()=>{for(const id of [9,442,409,198])expect(getReviewerCalculator('private-owner-'+id)).toBeUndefined();});
it.each(['reportingPerUnit','unitsPerReporting'])('rejects nonzero FX underflow for %s without rejecting real zero budgets',direction=>{const d=getReviewerCalculator('private-owner-512')!;const line={date:'2026-01-01',baseCurrency:'EUR',quoteCurrency:'USD',amount:1e-300,rate:direction==='reportingPerUnit'?1e-100:1e100,direction};expect(()=>runCalculator(d,{reportingCurrency:'USD',lines:[line]})).toThrow();expect((runCalculator(d,{reportingCurrency:'USD',lines:[{...line,amount:0}]}).output as {total:number}).total).toBe(0);});
it('rejects nonzero sales, hourly-rate, rent and discounted-cashflow underflow',()=>{
 const cases:[number,unknown][]=[
 [145,{currency:'USD',period:'2026',lines:[{price:1e-300,quantity:1e-100}]}],
 [157,{currency:'USD',annualPeriod:'2026',annualRevenueTarget:1e-300,billableHours:1e100}],
 [44,{currency:'USD',period:'2026',potentialGrossRent:1e-300,beforeVacancyFraction:0,afterVacancyFraction:1e-100}],
 [156,{mode:'dated-npv',currency:'USD',valuationDate:'1925-01-01',dayCount:'ACT365F',annualEffectiveRatePercent:900,cashflows:[{date:'2025-01-01',amount:1e-300}]}]
 ];for(const [id,input] of cases)expect(()=>runCalculator(getReviewerCalculator('private-owner-'+id)!,input),`Unsupported nonzero underflow for ${id}`).toThrow();
});

it('keeps browser literals synchronized with authored examples, never generated actual outputs',()=>{expect(cases).toEqual(privateOwnerDefinitions.map(({masterId,definition:d})=>({masterId,slug:d.slug,examples:d.examples})));});
it('fails closed if the reused trip engine is no longer its approved immutable v1',async()=>{const {tripCostCalculator}=await import('./travel/catalog-batch-2');const version=tripCostCalculator.version;try{tripCostCalculator.version=2;expect(()=>runCalculator(getReviewerCalculator('private-owner-507')!,{transportCost:1,lodgingCost:2,foodCost:3,otherCost:4})).toThrow();}finally{tripCostCalculator.version=version;}});
