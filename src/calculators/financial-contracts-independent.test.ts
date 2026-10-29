import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {financialContracts} from './financial-contracts';
const b={currency:'USD',period:'year',scope:'supplied-cashflows-no-tax',discountRate:0.25};
const loan={openingDebt:80,steps:[{rate:0.25,payment:10},{rate:0,payment:0}]};
const purchase={price:100,upfrontCosts:5,loan,periodCosts:[2,3],terminalValue:50,sellingCosts:4};
const rental={price:100,upfrontCosts:5,loan,terminalValue:50,sellingCosts:4,periods:[{scheduledRent:30,uncollectedRent:0,operatingCosts:5,capex:2,reserveContribution:10},{scheduledRent:25,uncollectedRent:5,operatingCosts:5,capex:0,reserveContribution:5}]};
function run(id:number,input:unknown){return runCalculator(financialContracts.find(d=>d.id===`private.financial.${id}`)!,input).output;}
function close(actual:unknown,expected:number){expect(actual).toBeCloseTo(expected,10);}
describe('independently derived financial contract witnesses',()=>{
 it('21: financed fee enters principal once and upfront fee enters at time zero',()=>{
  const r=run(21,{...b,existingLoans:[loan],consolidatedLoan:{openingDebt:100,steps:[{rate:0,payment:10},{rate:0,payment:0}]},financedFee:20,upfrontFee:3});
  expect(r).toMatchObject({existing:{terminalDebt:90,totalPayments:10},consolidated:{terminalDebt:90,totalPayments:10}});
  expect(r.comparison).toMatchObject({left:65.6,right:68.6});
 });
 it('32/470/472: nonzero discounting places each cashflow and terminal liability at its date',()=>{
  const rent=run(32,{...b,purchase,rentUpfront:6,rentPayments:[20,30],rentRefund:5});
  const lease=run(470,{...b,purchase,leaseUpfront:6,leasePayments:[20,30],leaseEndCharges:5});
  const cash=run(472,{...b,purchase,cashUpfrontCosts:7});
  // Buy: 25 + 12/1.25 + (3+4+90-50)/1.5625 = 64.68.
  expect(rent.comparison).toMatchObject({left:38,right:64.68});
  expect(lease.comparison).toMatchObject({left:44.4,right:64.68});
  const c=cash.comparison as Record<string,number>;
  close(c.left,64.68);close(c.right,81.08);close(c.difference,-16.4);
 });
 it.each([36,43,49])('%i: reserves offset exit deficit once and negative equity is contributed',id=>{
  const result=run(id,{...b,rental});
  const r=(id===43?result.rental:result) as Record<string,unknown>;
  expect(r).toMatchObject({terminalDebt:90,totalInterest:20,totalPayments:10,totalNoi:40,totalCapex:2,terminalReserves:15,totalOwnerCashflow:13,terminalEquity:-29,totalContributions:54,totalDistributions:13,profit:-41});
  close(r.totalReturnPercent,-4100/54);
  if(id===49){close(r.presentCost,34.76);expect(r.totalPrincipalRepaid).toBe(-10);}
 });
 it('46: rehabilitation is additional to period costs and principal is never paid twice',()=>{
  expect(run(46,{...b,purchase,rehabilitationCosts:[6,7]})).toMatchObject({profit:-97,rehabilitationTotal:13,purchase:{terminalDebt:90,nominalNetCost:97}});
 });
 it('468: budget counts actual payments, including negative amortization',()=>{
  expect(run(468,{...b,purchase,availableUpfrontCash:24,periodBudget:11})).toMatchObject({upfrontShortfall:1,maxPeriodShortfall:1,firstOverBudgetPeriod:1,withinSuppliedBudget:false});
 });
 it('zero horizon: immediate sale and debt payoff net once, without future interest',()=>{
  const p={price:100,upfrontCosts:5,loan:{openingDebt:80,steps:[]},periodCosts:[],terminalValue:50,sellingCosts:4};
  const r=run(472,{...b,purchase:p,cashUpfrontCosts:5});
  expect(r).toMatchObject({purchase:{terminalDebt:80,initialEquityCash:25,terminalEquity:-34,nominalNetCost:59},comparison:{left:59,right:59,difference:0}});
 });
});

it('ID21 reconciles ordinary decimal principals without demanding floating-point artifacts',()=>{
 const l=(openingDebt:number)=>({openingDebt,steps:[]});
 expect(()=>run(21,{...b,existingLoans:[l(0.1),l(0.2)],consolidatedLoan:l(0.3),financedFee:0,upfrontFee:0})).not.toThrow();
 expect(()=>run(21,{...b,existingLoans:[l(0.1),l(0.2)],consolidatedLoan:l(0.31),financedFee:0,upfrontFee:0})).toThrow();
});
