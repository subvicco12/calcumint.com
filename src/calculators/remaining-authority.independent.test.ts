import {describe,it,expect} from 'vitest';
import {remainingExamples,remainingProfiles,exportRemaining,importRemaining} from './remaining-authority';
const out=(id:number,patch:Record<string,unknown>={})=>exportRemaining({...remainingExamples[id],...patch}).calculation.output;
function fraction(s:string):[bigint,bigint]{if(s.includes('/'))return s.split('/').map(BigInt) as [bigint,bigint];const [a,b='']=s.split('.');return[BigInt(a+b),10n**BigInt(b.length)];}
function compare(a:string,b:string){const [an,ad]=fraction(a),[bn,bd]=fraction(b);return an*bd-bn*ad;}
describe('independently derived six source-bound private contracts',()=>{
 // For two equal payments choose P=k(1+i)^2 and AF=k(2+i).
 it.each([
  ['210','121','120.00','0.1'],['900','625','300.00','0.25'],
  ['250','225','600.00','0.5'],['300','400','1200.00','1'],
  ['820','441','60.00','0.05'],
 ])('9 proves APR for independently constructed AF%s/P%s',(amountFinancedUSD,paymentUSD,aprPercent,monthly)=>{
  const r=out(9,{amountFinancedUSD,paymentUSD});expect(r.aprPercent).toBe(aprPercent);
  expect(compare(String(r.monthlyRateLower),monthly)<=0n).toBe(true);expect(compare(String(r.monthlyRateUpper),monthly)>=0n).toBe(true);
 });
 it('9 supports more than two payments and a cross-year calendar',()=>{
  expect(out(9,{amountFinancedUSD:'331',paymentUSD:'133.10',paymentCount:3,firstChargeDate:'2026-11-28',paymentDates:['2026-12-28','2027-01-28','2027-02-28']})).toMatchObject({aprPercent:'120.00'});
 });
 it('9 rejects an exact APR half-cent bin and distinguishes both cent perturbations',()=>{
  // i=1/240000: P=(240001)^2/100, AF=240000*480001/100.
  const p={amountFinancedUSD:'1152002400',paymentUSD:'576004800.01'};
  expect(()=>out(9,p)).toThrow();
  expect(out(9,{...p,amountFinancedUSD:'1152002400.01'}).aprPercent).toBe('0.00');
  expect(out(9,{...p,amountFinancedUSD:'1152002399.99'}).aprPercent).toBe('0.01');
 });
 it('9 retains a truezero root and rejects roots outside the explicitly selected bound',()=>{
  expect(out(9,{amountFinancedUSD:'200',paymentUSD:'100'})).toMatchObject({aprPercent:'0.00',monthlyRateLower:'0',monthlyRateUpper:'0'});
  expect(()=>out(9,{amountFinancedUSD:'1',paymentUSD:'100'})).toThrow();
  expect(()=>out(9,{amountFinancedUSD:'201',paymentUSD:'100'})).toThrow();
 });
 it('9 rejects valid dates outside the selected full-month schedule',()=>{
  for(const p of [{firstChargeDate:'2026-01-29'},{paymentDates:['2026-02-01','2026-04-01']},{paymentDates:['2026-02-01','2026-03-01','2026-04-01']},{firstChargeDate:'2026-02-30'},{paymentDates:['2026-02-01T00:00:00Z','2026-03-01']}])expect(()=>out(9,p)).toThrow();
 });
 it.each([['166',true,'5'],['167',true,'5.01'],['101',false,'5.05'],['999999999999',true,'29999999999.97']])('20 calculates greater-of fee for wholeUSD %s',(transferUSD,within60Days,conditionalFeeUSD)=>expect(out(20,{transferUSD,within60Days})).toEqual({conditionalFeeUSD}));
 it('20 rejects unknown eligibility/timing and refuses assessed-account predictions',()=>{
  for(const p of [{transferUSD:'0'},{transferUSD:'100.00'},{within60Days:'true'},{sourceDefinedTimingEstablished:false},{externallyEstablishedEligibility:null},{actualAccountPrediction:true}])expect(()=>out(20,p)).toThrow();
 });
 it('23 keeps decimal USD units and sums beyond either individual input without rounding',()=>{
  expect(out(23,{accruedInterestUSD:'0.01',unpaidFeesUSD:'0.02'})).toEqual({conditionalStatementSumUSD:'0.03'});
  expect(out(23,{accruedInterestUSD:'999999999999.99',unpaidFeesUSD:'999999999999.99'})).toEqual({conditionalStatementSumUSD:'1999999999999.98'});
  expect(()=>out(23,{unpaidFeesUSD:'0.001'})).toThrow();
 });
 it('112 preserves fractional overtime hours and fractional cents',()=>{
  expect(out(112,{hours:'40.125',hourlyRateUSD:'7.25'})).toEqual({regularExactUSD:'290',overtimeExactUSD:'1.359375',grossExactUSD:'291.359375'});
  expect(out(112,{hours:'168',hourlyRateUSD:'20'})).toEqual({regularExactUSD:'800',overtimeExactUSD:'3840',grossExactUSD:'4640'});
  expect(out(112,{hours:'0.000001',hourlyRateUSD:'0.000001',applicableMinimumRateUSD:'0.000001'})).toMatchObject({grossExactUSD:'0.000000000001'});
 });
 it('112 validates the exact week and externally supplied minimum rather than assuming eligibility',()=>{
  for(const p of [{hours:'-1'},{hours:'168.000001'},{hourlyRateUSD:'7.249999'},{applicableMinimumRateUSD:'0'},{workweekStartUTC:'2026-02-29T00:00:00Z'},{workweekStartUTC:'2026-10-19T00:00:00+00:00'},{higherPremiumOrSpecialException:true},{payrollDisbursement:true}])expect(()=>out(112,p)).toThrow();
 });
 it('199 subtracts tax, seller-funded refunds and supplied fees once; adds only assessed credits',()=>{
  expect(out(199,{buyerGrossUSD:'100',marketplaceTaxUSD:'10',sellerRefundUSD:'20',refundFunding:'seller',fees:[{id:'f1',kind:'transaction',assessedUSD:'3'},{id:'f2',kind:'processing',assessedUSD:'2'}],credits:[{id:'c1',feeId:'f1',assessedUSD:'1'}],cogsUSD:'30',fulfillmentUSD:'5',otherCostsUSD:'2'})).toEqual({sellerReceiptsUSD:'90',assessedFeesUSD:'5',assessedCreditsUSD:'1',profitUSD:'29'});
  expect(out(199,{buyerGrossUSD:'1',marketplaceTaxUSD:'0',fees:[],credits:[],cogsUSD:'3',fulfillmentUSD:'0',otherCostsUSD:'0'}).profitUSD).toBe('-2');
 });
 it('199 rejects duplicate/unmatched/over-credit ledgers and unselected refund branches',()=>{
  for(const p of [
   {refundFunding:'seller',credits:[{id:'a',feeId:'transaction1',assessedUSD:'4'},{id:'b',feeId:'transaction1',assessedUSD:'4'}]},
   {refundFunding:'seller',credits:[{id:'transaction1',feeId:'transaction1',assessedUSD:'1'}]},
   {refundFunding:'seller',credits:[{id:'a',feeId:'listing1',assessedUSD:'0.20'}],orderCancelled:false},
   {refundFunding:'etsy-full',sellerRefundUSD:'1'},
   {sellerRefundUSD:'111',refundFunding:'seller'},
   {completeFeeUniverseConfirmed:false},{feePrediction:true},
  ])expect(()=>out(199,p)).toThrow();
 });
 it('204 retains fractional expected returns and incremental operational costs',()=>{
  expect(out(204,{units:3,returnRate:'0.25',salePerUnit:'9',costPerSale:'4',refundPerReturn:'7',incrementalHandlingPerReturn:'0.50',incrementalFeesPerReturn:'0.25',recoveredOperationalValuePerReturn:'2'})).toEqual({baselineOperationalProfit:'15',returnOperationalCost:'4.3125',operationalProfit:'10.6875'});
  expect(out(204,{units:3,returnRate:'0.333333',salePerUnit:'9',costPerSale:'4',refundPerReturn:'1',incrementalHandlingPerReturn:'0',incrementalFeesPerReturn:'0',recoveredOperationalValuePerReturn:'0'})).toMatchObject({returnOperationalCost:'0.999999',operationalProfit:'14.000001'});
 });
 it('204 rejects accounting/forecast claims and does not manufacture cash-recovery output',()=>{
  for(const p of [{accountingCompliance:true},{returnForecast:true},{kind:'exchange'},{currency:'JPY'},{returnRate:'1.000001'},{units:-1},{recoveryValuation:'cash-revenue'}])expect(()=>out(204,p)).toThrow();
  expect(Object.keys(out(204))).toEqual(['baselineOperationalProfit','returnOperationalCost','operationalProfit']);
 });
 it.each([9,20,23,112,199,204])('%i binds exact profile,source,governance and output with immutable parity',id=>{
  const s=exportRemaining(remainingExamples[id]);expect(Object.isFrozen(s.source.records[0])).toBe(true);expect(Object.isFrozen(s.methodology)).toBe(true);expect(Object.isFrozen(s.governance)).toBe(true);
  expect(exportRemaining(remainingExamples[id],'pro')).toEqual(s);expect(exportRemaining(remainingExamples[id],'business')).toEqual(s);expect(importRemaining(JSON.parse(JSON.stringify(s)))).toEqual(s);
  expect(s.governance).toMatchObject({relatedCatalogId:id,canonicalImplementationClass:'CONTRACT_BLOCKED',canonicalAccepted:false,qualifiedApplicability:'UNRESOLVED',certificationAuthorized:false,publicationAuthorized:false});
 });
 it('replay rejects valid other-profile payloads, extra fields and getter objects without executing them',()=>{
  const s=JSON.parse(JSON.stringify(exportRemaining(remainingExamples[20])));s.calculation=JSON.parse(JSON.stringify(exportRemaining(remainingExamples[23]).calculation));expect(()=>importRemaining(s)).toThrow();
  const t=JSON.parse(JSON.stringify(exportRemaining(remainingExamples[204])));t.certified=true;expect(()=>importRemaining(t)).toThrow();
  let called=false;const raw={get calculation(){called=true;throw Error('must not execute');}};expect(()=>importRemaining(raw)).toThrow();expect(called).toBe(false);
 });
 it('exposes exactly six new private profiles without extending their full canonical scope',()=>expect(remainingProfiles.map(p=>p.id)).toEqual([9,20,23,112,199,204]));
});

import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {RemainingAuthorityReview} from '../components/remaining-authority-review';
it('private review exposes the selected APR source citation rather than an empty link',()=>{
 const html=renderToStaticMarkup(createElement(RemainingAuthorityReview));
 expect(html).toContain('https://www.consumerfinance.gov/rules-policy/regulations/1026/j/');
 expect(html).toContain('cfpb-j');
});

import {spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
it.each(['missing-records','duplicate-source','altered-response'] as const)('offline source verifier rejects %s without accepting unverified evidence',kind=>{
 const directory=mkdtempSync(path.join(tmpdir(),'remaining-source-review-'));
 try{
  const root=path.join(directory,'docs/remaining-six');mkdirSync(root,{recursive:true});
  cpSync('docs/remaining-six/source',path.join(root,'source'),{recursive:true});
  const binding=JSON.parse(readFileSync('docs/remaining-six/source-binding.json','utf8'));
  if(kind==='missing-records')binding.records=[];
  if(kind==='duplicate-source')binding.records[1]=binding.records[0];
  if(kind==='altered-response'){
   const file=path.join(root,binding.records[0].responseFile);const bytes=readFileSync(file);bytes[20]^=1;writeFileSync(file,bytes);
  }
  writeFileSync(path.join(root,'source-binding.json'),JSON.stringify(binding));
  const result=spawnSync('python3',[path.resolve('scripts/verify-remaining-six-source.py')],{cwd:directory,encoding:'utf8'});
  expect(result.error).toBeUndefined();expect(result.status).not.toBe(0);
 }finally{rmSync(directory,{recursive:true,force:true});}
});
