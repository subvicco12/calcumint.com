import {z} from 'zod';
import {divide,rational,formatRational} from './exact-rational';
import {d,add,multiply,subtract,zero,one,compare,sum,amount,positiveAmount,fraction,label,unique} from './completion-math';
const line=z.object({id:label,amount,priceBasis:z.enum(['inclusive','exclusive']),classification:z.enum(['taxable','zero-rated','exempt']),rateFraction:fraction}).strict();
const priceSchema=z.object({currency:label,period:label,scope:z.literal('supplied-classifications-no-rule-selection'),lines:z.array(line).min(1).max(600)}).strict();
export const accountingSchemas={
 35:z.object({currency:label,scope:z.literal('supplied-closing-lines-no-eligibility'),price:amount,baseLoan:amount,financedCosts:amount,deposit:amount,sellerCredit:amount,lenderCredit:amount,otherCredit:amount,lines:z.array(z.object({id:label,category:z.enum(['loan-cost','other-cost','prepaid','escrow']),amount,paidBefore:amount}).strict()).max(600)}).strict(),
 125:priceSchema,127:priceSchema,
 134:z.object({currency:label,period:label,scope:z.literal('supplied-liability-ratio-no-statutory-definition'),denominatorBasis:label,denominator:positiveAmount,liabilities:z.array(z.object({id:label,amount}).strict()).min(1).max(600)}).strict(),
};
export function calculateAccounting(id:keyof typeof accountingSchemas,raw:unknown):Record<string,unknown>{
 switch(id){
  case 35:{
   const p=accountingSchemas[id].parse(raw);unique(p.lines.map(l=>l.id));
   if(compare(d(p.baseLoan),d(p.price))>0)throw Error('Base acquisition loan exceeds price');
   for(const l of p.lines)if(compare(d(l.paidBefore),d(l.amount))>0)throw Error('Prior-paid amount exceeds line cost');
   const closingCosts=sum(p.lines.map(l=>d(l.amount))),paidBefore=sum(p.lines.map(l=>d(l.paidBefore)));
   if(compare(d(p.financedCosts),closingCosts)>0)throw Error('Financed closing costs exceed supplied closing costs');
   const downPayment=subtract(d(p.price),d(p.baseLoan)),loanAmount=add(d(p.baseLoan),d(p.financedCosts));
   const credits=sum([d(p.sellerCredit),d(p.lenderCredit),d(p.otherCredit)]);
   const cashToClose=subtract(subtract(subtract(subtract(add(downPayment,closingCosts),d(p.financedCosts)),d(p.deposit)),credits),paidBefore);
   return {currency:p.currency,downPayment,loanAmount,closingCosts,paidBefore,credits,cashToClose,
    categories:Object.fromEntries(['loan-cost','other-cost','prepaid','escrow'].map(category=>[category,sum(p.lines.filter(l=>l.category===category).map(l=>d(l.amount)))])),
    rows:p.lines.map(l=>({id:l.id,category:l.category,amount:d(l.amount),paidBefore:d(l.paidBefore),remaining:subtract(d(l.amount),d(l.paidBefore))})),headline:formatRational(cashToClose)};
  }
  case 125:case 127:{
   const p=accountingSchemas[id].parse(raw);unique(p.lines.map(l=>l.id));
   const lines=p.lines.map(l=>{
    const rate=d(l.rateFraction),taxable=l.classification==='taxable';
    if(taxable?compare(rate,zero)===0:compare(rate,zero)!==0)throw Error('Positive taxable rate or explicit zero-rated/exempt zero rate required');
    const net=taxable&&l.priceBasis==='inclusive'?divide(d(l.amount),add(one,rate)):d(l.amount),tax=taxable?multiply(net,rate):zero;
    return {id:l.id,classification:l.classification,priceBasis:l.priceBasis,rateFraction:rate,net,tax,gross:add(net,tax)};
   });
   const net=sum(lines.map(l=>l.net)),tax=sum(lines.map(l=>l.tax));
   return {currency:p.currency,period:p.period,net,tax,gross:add(net,tax),taxableNet:sum(lines.filter(l=>l.classification==='taxable').map(l=>l.net)),zeroRatedNet:sum(lines.filter(l=>l.classification==='zero-rated').map(l=>l.net)),exemptNet:sum(lines.filter(l=>l.classification==='exempt').map(l=>l.net)),lines,headline:formatRational(tax)};
  }
  case 134:{
   const p=accountingSchemas[id].parse(raw);unique(p.liabilities.map(l=>l.id));
   const totalLiability=sum(p.liabilities.map(l=>d(l.amount))),percent=multiply(divide(totalLiability,d(p.denominator)),rational(100n));
   return {currency:p.currency,period:p.period,denominatorBasis:p.denominatorBasis,denominator:d(p.denominator),totalLiability,percent,liabilities:p.liabilities.map(l=>({id:l.id,amount:d(l.amount)})),headline:formatRational(percent)};
  }
 }
}
export const accountingMethods={
 35:'Closing costs are the sum of disjoint named loan/other/prepaid/escrow lines. Cash to close = price-base acquisition loan + closing costs - separately financed costs - deposit - credits - costs paid before closing. Loan amount includes financed costs once. Negative cash denotes supplied cash-back accounting, not eligibility approval. Deposits and prior-paid line costs must be disjoint; no legal fee limits inferred.',
 125:'Caller supplies every price classification and fractional tax rate for one currency/period. Exclusive net=amount; taxable inclusive net=amount/(1+rate); tax=net*rate. Zero-rated and exempt require zero supplied rate and retain distinct bases. No taxable-base, shipping/discount, jurisdiction/date, credit or invoice-rounding rules inferred.',
 127:'Supplied classified VAT-style price lines: inclusive/exclusive algebra at explicitly supplied fractional rates, with zero-rated/exempt bases separated. No legal VAT rates, registration, invoice rounding, recovery/input-credit, return or supply-eligibility decision inferred.',
 134:'Effective ratio =100*sum(supplied nonnegative liability amounts)/explicit positive selected denominator. Same supplied currency/period. Numerator inclusion and denominator basis are caller choices, not statutory definitions. No tax computation or qualified applicability approval.',
};
