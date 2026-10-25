import {describe,expect,it} from 'vitest';
import {privateOwnerBusinessImpact} from './private-owner-business-impact';
const context={currency:'USD',period:'2026-10'};
const run=(id:number,input:unknown)=>privateOwnerBusinessImpact.find(b=>b.masterId===id)!.definition.calculate(input,{});
describe('owner supplied business impacts',()=>{
 it('covers exactly eight approved identities',()=>expect(privateOwnerBusinessImpact.map(x=>x.masterId)).toEqual([44,159,160,194,195,200,201,203]));
 it('compares lost gross rent without net profit claims',()=>expect(run(44,{...context,potentialGrossRent:1000,beforeVacancyFraction:0.1,afterVacancyFraction:0.25})).toEqual({beforeLostRent:100,afterLostRent:250,changeLostRent:150}));
 for(const id of [159,160]) it(`compares independent volumes for ${id}`,()=>expect(run(id,{...context,unit:'item',before:{price:10,unitVariableCost:4,units:100},after:{price:8,unitVariableCost:3,units:150}})).toEqual({beforeRevenue:1000,afterRevenue:1200,revenueChange:200,beforeContribution:600,afterContribution:750,contributionChange:150}));
 it('inverts a ROAS multiple',()=>expect(run(194,{...context,mode:'revenue-roas',targetAttributedRevenue:1200,targetRoasMultiple:3})).toEqual({requiredSpend:400}));
 it('uses supplied CPA and conversions',()=>expect(run(194,{...context,mode:'conversions-cpa',conversions:20,costPerAcquisition:7})).toEqual({requiredSpend:140}));
 it('solves a profit fraction of revenue',()=>expect(run(195,{...context,mode:'profit-revenue',contributionMarginFraction:0.5,targetProfitFraction:0.25})).toEqual({targetRoasMultiple:4}));
 it('solves profit per ad spend',()=>expect(run(195,{...context,mode:'profit-ad-spend',contributionMarginFraction:0.5,targetProfitPerAdSpend:1})).toEqual({targetRoasMultiple:4}));
 it('subtracts itemized marketplace costs',()=>expect(run(200,{...context,salesProceeds:100,fees:[{name:'supplied fee',amount:12}],goodsCosts:[{name:'goods',amount:30}],fulfillmentCosts:[{name:'delivery',amount:8}]})).toEqual({totalCosts:50,profit:50}));
 for(const mode of ['contribution','profit']) it(`compares promotion ${mode}`,()=>expect(run(201,{...context,mode,unit:'item',before:{revenue:100,units:10,costs:[{name:'declared costs',amount:60}]},promotion:{revenue:150,units:20,costs:[{name:'declared costs',amount:90}]}})).toEqual({measure:mode,before:40,promotion:60,incremental:20}));
 for(const basis of ['per-order','period']) it(`computes shipping on ${basis} basis`,()=>expect(run(203,{...context,basis,shippingRevenue:10,carrier:4,packaging:1,handling:2})).toEqual({shippingContribution:3}));
 it('executes every example against literal expectations',()=>{for(const {definition} of privateOwnerBusinessImpact)for(const example of definition.examples)expect(definition.calculate(example.input,{})).toEqual(example.expected);});
 it('rejects missing context, extra fields, negative costs and invalid fractions',()=>{
 for(const input of [{potentialGrossRent:100,beforeVacancyFraction:0,afterVacancyFraction:0},{...context,potentialGrossRent:100,beforeVacancyFraction:0,afterVacancyFraction:2},{...context,potentialGrossRent:100,beforeVacancyFraction:0,afterVacancyFraction:0,extra:1}])expect(()=>run(44,input)).toThrow();
 expect(()=>run(203,{...context,basis:'per-order',shippingRevenue:10,carrier:-1,packaging:1,handling:1})).toThrow();
 });
 it('rejects zero and impossible target denominators',()=>{
 for(const contributionMarginFraction of [0,0.2])expect(()=>run(195,{...context,mode:'profit-revenue',contributionMarginFraction,targetProfitFraction:0.2})).toThrow();
 expect(()=>run(194,{...context,mode:'revenue-roas',targetAttributedRevenue:10,targetRoasMultiple:0})).toThrow();
 });
 it('allows zero activity and losses but rejects overflow',()=>{
 expect(run(194,{...context,mode:'conversions-cpa',conversions:0,costPerAcquisition:0})).toEqual({requiredSpend:0});
 expect(run(203,{...context,basis:'period',shippingRevenue:0,carrier:4,packaging:1,handling:2})).toEqual({shippingContribution:-7});
 expect(()=>run(194,{...context,mode:'conversions-cpa',conversions:1e308,costPerAcquisition:1e308})).toThrow();
 expect(()=>run(203,{...context,basis:'period',shippingRevenue:1,carrier:1e308,packaging:1e308,handling:0})).toThrow();
 });
});
