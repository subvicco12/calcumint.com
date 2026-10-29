import {z} from 'zod';
import {runCalculator} from './engine';
import {privateSuppliedDefinitions} from './private-supplied-contracts';
import {sumFinite,multiplyFinite,divideFinite} from './owner-model-support';

export const money=z.number().finite().min(0).max(1e12);
export const loanSchema=z.object({openingDebt:money,steps:z.array(z.object({rate:z.number().finite().min(0).max(1),payment:money}).strict()).max(600)}).strict();
export const purchaseSchema=z.object({price:money,upfrontCosts:money,loan:loanSchema,periodCosts:z.array(money).max(600),terminalValue:money,sellingCosts:money}).strict();
export const rentalSchema=z.object({price:money,upfrontCosts:money,loan:loanSchema,terminalValue:money,sellingCosts:money,periods:z.array(z.object({scheduledRent:money,uncollectedRent:money,operatingCosts:money,capex:money,reserveContribution:money}).strict()).max(600)}).strict();
export const basis={currency:z.string().trim().min(1).max(160),period:z.string().trim().min(1).max(160),scope:z.literal('supplied-cashflows-no-tax'),discountRate:z.number().finite().min(0).max(1)};
type Basis={currency:string;period:string;discountRate:number};
export const ledgerDependency=privateSuppliedDefinitions.find(d=>d.id==='private.supplied-ledger-comparison')!;
export const sum=sumFinite;
export function match(a:number,b:number){if(a!==b)throw Error('Matched period counts required');}
export function finance(raw:z.infer<typeof loanSchema>){
 const p=loanSchema.parse(raw);let debt=p.openingDebt;
 const rows=p.steps.map((step,index)=>{
  const openingDebt=debt,interest=multiplyFinite(debt,step.rate);
  const due=sum([debt,interest]),payment=Math.min(step.payment,due);
  debt=sum([due,-payment]);
  return {at:index+1,openingDebt,interest,requestedPayment:step.payment,payment,principalRepaid:sum([payment,-interest]),closingDebt:debt};
 });
 return {terminalDebt:debt,totalInterest:sum(rows.map(r=>r.interest)),totalPayments:sum(rows.map(r=>r.payment)),financingRows:rows};
}
type Ledger={currency:string;period:string;horizon:number;flows:{at:number;outflow:number}[];terminalDebt:number;terminalAsset:number};
export function ledger(b:Basis,horizon:number,flows:Ledger['flows'],terminalDebt=0,terminalAsset=0):Ledger{return {currency:b.currency,period:b.period,horizon,flows,terminalDebt,terminalAsset};}
export function compare(left:Ledger,right:Ledger,b:Basis){
 return runCalculator(ledgerDependency,{left,right,discountRate:b.discountRate}).output as {left:number;right:number;difference:number};
}
export function purchase(p:z.infer<typeof purchaseSchema>,b:Basis){
 match(p.loan.steps.length,p.periodCosts.length);
 if(p.loan.openingDebt>p.price)throw Error('Opening purchase debt exceeds price; financed extra costs unsupported');
 const f=finance(p.loan),initialEquityCash=sum([p.price,-p.loan.openingDebt,p.upfrontCosts]);
 const flows=[{at:0,outflow:initialEquityCash},...f.financingRows.map((r,i)=>({at:r.at,outflow:sum([r.payment,p.periodCosts[i]])})),{at:p.periodCosts.length,outflow:p.sellingCosts}];
 const terminalEquity=sum([p.terminalValue,-p.sellingCosts,-f.terminalDebt]);
 const cashLedger=ledger(b,p.periodCosts.length,flows,f.terminalDebt,p.terminalValue);
 return {...f,initialEquityCash,terminalEquity,periodOutflows:f.financingRows.map((r,i)=>sum([r.payment,p.periodCosts[i]])),nominalNetCost:sum([...flows.map(f=>f.outflow),f.terminalDebt,-p.terminalValue]),cashLedger};
}
export function rental(p:z.infer<typeof rentalSchema>,b:Basis){
 match(p.loan.steps.length,p.periods.length);
 if(p.loan.openingDebt>p.price)throw Error('Opening purchase debt exceeds price');
 const f=finance(p.loan),initialEquityCash=sum([p.price,-p.loan.openingDebt,p.upfrontCosts]);
 const rows=p.periods.map((s,i)=>{
  if(s.uncollectedRent>s.scheduledRent)throw Error('Uncollected rent exceeds scheduled rent');
  const collectedRent=sum([s.scheduledRent,-s.uncollectedRent]),noi=sum([collectedRent,-s.operatingCosts]);
  const debtService=f.financingRows[i].payment,ownerCashflow=sum([noi,-debtService,-s.capex,-s.reserveContribution]);
  return {at:i+1,collectedRent,noi,debtService,capex:s.capex,reserveContribution:s.reserveContribution,ownerCashflow};
 });
 const terminalReserves=sum(rows.map(r=>r.reserveContribution));
 const terminalEquity=sum([p.terminalValue,-p.sellingCosts,-f.terminalDebt,terminalReserves]);
 const cashLedger=ledger(b,rows.length,[{at:0,outflow:initialEquityCash},...rows.map(r=>({at:r.at,outflow:-r.ownerCashflow})),{at:rows.length,outflow:p.sellingCosts}],f.terminalDebt,sum([p.terminalValue,terminalReserves]));
 const totalContributions=sum([initialEquityCash,...rows.map(r=>Math.max(-r.ownerCashflow,0)),Math.max(-terminalEquity,0)]);
 const totalDistributions=sum([...rows.map(r=>Math.max(r.ownerCashflow,0)),Math.max(terminalEquity,0)]);
 const profit=sum([totalDistributions,-totalContributions]);
 return {...f,rows,initialEquityCash,terminalReserves,terminalEquity,
  totalNoi:sum(rows.map(r=>r.noi)),totalDebtService:f.totalPayments,totalCapex:sum(rows.map(r=>r.capex)),
  totalOwnerCashflow:sum(rows.map(r=>r.ownerCashflow)),totalContributions,totalDistributions,profit,
  totalReturnPercent:totalContributions===0?null:multiplyFinite(divideFinite(profit,totalContributions),100),
  cashLedger,
 };
}
