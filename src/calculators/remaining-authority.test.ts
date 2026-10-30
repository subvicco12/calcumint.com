import {describe,it,expect} from 'vitest';
import {remainingExamples,exportRemaining,importRemaining,remainingProfiles} from './remaining-authority';
const out=(id:number,patch:Record<string,unknown>={})=>exportRemaining({...remainingExamples[id],...patch}).calculation.output;
describe('six captured-source conditional private contracts',()=>{
 it('9 recovers independent exact1%monthly root with2decimalAPR',()=>expect(out(9)).toMatchObject({aprPercent:'12.00'}));
 it('9 returns truezero without a denominator singularity',()=>expect(out(9,{amountFinancedUSD:'20402'})).toMatchObject({aprPercent:'0.00'}));
 it.each([{amountFinancedUSD:'20403'},{paymentCount:1},{paymentDates:['2026-02-02','2026-03-01']},{firstChargeDate:'2026-01-31'},{amountFinancedClassification:'unknown'}])('9 rejects mismatched domain %j',p=>expect(()=>out(9,p)).toThrow());
 it.each([['100',true,'5'],['1000',true,'30'],['1000',false,'50'],['167',true,'5.01']])('20 exact fee%s',(transferUSD,within60Days,conditionalFeeUSD)=>expect(out(20,{transferUSD,within60Days})).toEqual({conditionalFeeUSD}));
 it.each([{transferUSD:'1.50'},{within60Days:null},{externallyEstablishedEligibility:false},{offerSnapshot:'COL00040'},{actualAccountPrediction:true}])('20 rejects unsupported offer facts %j',p=>expect(()=>out(20,p)).toThrow());
 it('23 sums USDcents exactly',()=>expect(out(23)).toEqual({conditionalStatementSumUSD:'130.39'}));
 it('23 allowszero',()=>expect(out(23,{accruedInterestUSD:'0',unpaidFeesUSD:'0'})).toEqual({conditionalStatementSumUSD:'0'}));
 it.each([{accruedInterestUSD:'125.371'},{phase:'repayment'},{option:'amortizing'},{actualAccountPrediction:true}])('23 rejects unsupported facts %j',p=>expect(()=>out(23,p)).toThrow());
 it.each([['40','800'],['45','950'],['0','0']])('112 exactsinglehourly%s',(hours,grossExactUSD)=>expect(out(112,{hours})).toMatchObject({grossExactUSD}));
 it('112 preserves fractional cents',()=>expect(out(112,{hourlyRateUSD:'20.01',hours:'41'})).toMatchObject({grossExactUSD:'830.415'}));
 it.each([{hours:'168.000001'},{hourlyRateUSD:'5'},{coveredNonexempt:false},{otherIncludibleRemuneration:true},{workweekStartUTC:'2026-02-30T00:00:00Z'}])('112 rejects inapplicable facts %j',p=>expect(()=>out(112,p)).toThrow());
 it('199 suppliedcentledger hasno inferred marketplace rates',()=>expect(out(199)).toMatchObject({sellerReceiptsUSD:'110',profitUSD:'52.86'}));
 it('199 subtracts assessed fees exactlyonce and credits only supplied amounts',()=>expect(out(199,{refundFunding:'seller',sellerRefundUSD:'10',credits:[{id:'credit1',feeId:'transaction1',assessedUSD:'1'}]})).toMatchObject({profitUSD:'43.86'}));
 it.each([{refundFunding:'etsy-full',credits:[{id:'c',feeId:'transaction1',assessedUSD:'1'}]},{fees:[{id:'x',kind:'transaction',assessedUSD:'1'},{id:'x',kind:'listing',assessedUSD:'1'}]},{credits:[{id:'c',feeId:'missing',assessedUSD:'1'}]},{marketplaceTaxUSD:'119'},{feePrediction:true}])('199 rejects incomplete/ambiguousledger %j',p=>expect(()=>out(199,p)).toThrow());
 it.each([['0','600'],['0.1','520'],['1','-200']])('204 suppliedreturnscenario%s',(returnRate,operationalProfit)=>expect(out(204,{returnRate})).toMatchObject({operationalProfit}));
 it('204 zerocohort andrefundnotnecessarilyprice',()=>{expect(out(204,{units:0})).toMatchObject({operationalProfit:'0'});expect(out(204,{refundPerReturn:'5'})).toMatchObject({operationalProfit:'570'});});
 it.each([{returnRate:'1.000001'},{units:1.5},{accountingCompliance:true},{kind:'warranty'}])('204 rejects broaderclaims %j',p=>expect(()=>out(204,p)).toThrow());
 for(const id of [9,20,23,112,199,204]){
  it(`${id} three-plan parity/immutable replay`,()=>{const s=exportRemaining(remainingExamples[id]);for(const plan of ['free','pro','business'] as const)expect(exportRemaining(remainingExamples[id],plan)).toEqual(s);expect(Object.isFrozen(s.calculation.input)).toBe(true);expect(Object.isFrozen(s.source.records)).toBe(true);expect(importRemaining(JSON.parse(JSON.stringify(s)))).toEqual(s);});
  it(`${id} rejects altered source/profile/governance/output/version`,()=>{const s=exportRemaining(remainingExamples[id]);for(const [path,value] of [[['source','records','0','responseSHA256'],'fake'],[['governance','canonicalAccepted'],true],[['calculation','output'],{}],[['calculation','calculatorVersion'],99],[['profileId'],'unsupported']] as [string[],unknown][]){const fake=JSON.parse(JSON.stringify(s));let target=fake as Record<string,unknown>;for(const key of path.slice(0,-1))target=target[key] as Record<string,unknown>;target[path.at(-1)!]=value;expect(()=>importRemaining(fake)).toThrow();}});
  it(`${id} rejects unknown and missingfacts`,()=>{expect(()=>out(id,{evidenceReference:''})).toThrow();expect(()=>out(id,{unsupported:true})).toThrow();});
 }
 it('doesnot promote canonical classes',()=>expect(remainingProfiles.map(x=>x.id)).toEqual([9,20,23,112,199,204]));
});
