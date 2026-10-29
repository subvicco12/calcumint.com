import {z} from 'zod';
import {divide,formatRational} from './exact-rational';
import {d,add,multiply,subtract,zero,one,compare,signed,sum,minimum,nonnegative,amount,rate,positiveFraction,fraction,label,retirementBasis,unique,type Rational} from './completion-math';

const cashStep=z.object({returnRate:rate,spending:amount,benefit:amount}).strict();
const savingStep=z.object({returnRate:rate,contribution:amount,inflationRate:rate}).strict();
const fireStep=z.object({returnRate:rate,contribution:amount}).strict();
const tranche=z.object({id:label,balance:amount,vestedFraction:fraction}).strict();
const vestedStep=z.object({returnRate:rate,employeeContribution:amount,tranches:z.array(z.object({id:label,contribution:amount,vestedFraction:fraction}).strict()).max(50)}).strict();
const fire=(kind:'supplied'|'lean'|'fat')=>z.object({...retirementBasis,spendingProfile:z.literal(kind),targetBasis:z.literal('constant-supplied-nominal'),annualSpending:amount,withdrawalFraction:positiveFraction,initial:amount,steps:z.array(fireStep).max(600)}).strict();
export const retirementSchemas={
 80:z.object({...retirementBasis,terminalReserve:amount,steps:z.array(cashStep).max(600)}).strict(),
 81:z.object({...retirementBasis,initial:amount,steps:z.array(savingStep).max(600)}).strict(),
 84:z.object({...retirementBasis,baseSpending:amount,terminalReserve:amount,steps:z.array(z.object({returnRate:rate,inflationRate:rate,benefit:amount}).strict()).max(600)}).strict(),
 85:z.object({...retirementBasis,initial:amount,steps:z.array(cashStep).max(600)}).strict(),
 86:z.object({...retirementBasis,initial:amount,steps:z.array(cashStep).max(600)}).strict(),
 88:fire('supplied'),89:z.object({...retirementBasis,contributionPolicy:z.literal('none'),target:amount,initial:amount,returns:z.array(rate).max(600)}).strict(),90:fire('lean'),91:fire('fat'),
 96:z.object({...retirementBasis,employeeBalance:amount,tranches:z.array(tranche).max(50),steps:z.array(vestedStep).max(600)}).strict(),
};
type Timing='begin'|'end';
type CashStep={returnRate:string;spending:string;benefit:string};
function corpus(timing:Timing,terminalReserve:string,steps:readonly {returnRate:string;spending:Rational;benefit:string;realReturn?:Rational}[]){
 let growth=one;
 const rows=steps.map((s,i)=>{
  const before=growth;growth=multiply(growth,add(one,signed(s.returnRate)));
  const gap=nonnegative(subtract(s.spending,d(s.benefit))),discountFactor=timing==='end'?growth:before;
  return {at:timing==='end'?i+1:i,spending:s.spending,benefit:d(s.benefit),gap,discountFactor,presentGap:divide(gap,discountFactor),...(s.realReturn?{realReturn:s.realReturn}:{})};
 });
 const presentSpendingGaps=sum(rows.map(r=>r.presentGap)),presentTerminalReserve=divide(d(terminalReserve),growth);
 const requiredInitialCapital=add(presentSpendingGaps,presentTerminalReserve);
 return {requiredInitialCapital,presentSpendingGaps,presentTerminalReserve,horizon:steps.length,rows,headline:formatRational(requiredInitialCapital)};
}
function accumulate(initial:string,timing:Timing,steps:readonly {returnRate:string;contribution:string;inflationRate?:string}[]){
 let balance=d(initial),inflationFactor=one,totalContributions=zero;
 const rows=steps.map((s,i)=>{
  const openingBalance=balance,contribution=d(s.contribution),factor=add(one,signed(s.returnRate));
  balance=timing==='begin'?multiply(add(balance,contribution),factor):add(multiply(balance,factor),contribution);
  inflationFactor=multiply(inflationFactor,add(one,signed(s.inflationRate??'0')));totalContributions=add(totalContributions,contribution);
  return {at:i+1,openingBalance,contribution,balance,realBalance:divide(balance,inflationFactor)};
 });
 return {balance,realBalance:divide(balance,inflationFactor),totalContributions,investmentGain:subtract(balance,add(d(initial),totalContributions)),horizon:steps.length,rows,headline:formatRational(balance)};
}
function withdrawals(initial:string,timing:Timing,steps:readonly CashStep[]){
 let balance=d(initial),exactZeroPeriod:number|null=compare(balance,zero)===0?0:null,firstShortfallPeriod:number|null=null;
 const rows=steps.map((s,i)=>{
  const openingBalance=balance,factor=add(one,signed(s.returnRate)),gap=nonnegative(subtract(d(s.spending),d(s.benefit)));
  const available=timing==='end'?multiply(balance,factor):balance;
  const withdrawn=minimum(available,gap),shortfall=subtract(gap,withdrawn);
  balance=subtract(available,withdrawn);if(timing==='begin')balance=multiply(balance,factor);
  if(compare(balance,zero)===0&&exactZeroPeriod===null)exactZeroPeriod=i+1;
  if(compare(shortfall,zero)>0&&firstShortfallPeriod===null)firstShortfallPeriod=i+1;
  return {at:i+1,openingBalance,spending:d(s.spending),benefit:d(s.benefit),gap,available,withdrawn,shortfall,balance};
 });
 return {balance,exactZeroPeriod,firstShortfallPeriod,totalWithdrawn:sum(rows.map(r=>r.withdrawn)),totalShortfall:sum(rows.map(r=>r.shortfall)),horizon:steps.length,
  status:firstShortfallPeriod!==null?'shortfall-within-horizon':exactZeroPeriod!==null?'exact-zero-within-horizon':'funds-remain-at-horizon',rows,headline:formatRational(balance)};
}
export function calculateRetirement(id:keyof typeof retirementSchemas,raw:unknown):Record<string,unknown>{
 switch(id){
  case 80:{const p=retirementSchemas[id].parse(raw);return corpus(p.timing,p.terminalReserve,p.steps.map(s=>({...s,spending:d(s.spending)})));}
  case 81:{const p=retirementSchemas[id].parse(raw);return accumulate(p.initial,p.timing,p.steps);}
  case 84:{
   const p=retirementSchemas[id].parse(raw);let inflationFactor=one;
   const steps=p.steps.map(s=>{
    const inflation=add(one,signed(s.inflationRate));if(p.timing==='end')inflationFactor=multiply(inflationFactor,inflation);
    const spending=multiply(d(p.baseSpending),inflationFactor);
    if(p.timing==='begin')inflationFactor=multiply(inflationFactor,inflation);
    return {...s,spending,realReturn:subtract(divide(add(one,signed(s.returnRate)),inflation),one)};
   });
   return corpus(p.timing,p.terminalReserve,steps);
  }
  case 85:case 86:{const p=retirementSchemas[id].parse(raw);return withdrawals(p.initial,p.timing,p.steps);}
  case 88:case 90:case 91:{
   const p=retirementSchemas[id].parse(raw),targetCapital=divide(d(p.annualSpending),d(p.withdrawalFraction));
   const out=accumulate(p.initial,p.timing,p.steps);
   const crossing=out.rows.find(r=>compare(r.balance,targetCapital)>=0);
   return {...out,targetCapital,firstTargetPeriod:compare(d(p.initial),targetCapital)>=0?0:crossing?.at??null,targetReached:compare(out.balance,targetCapital)>=0,headline:formatRational(targetCapital)};
  }
  case 89:{
   const p=retirementSchemas[id].parse(raw);let growth=one;
   const rows=p.returns.map((r,i)=>{growth=multiply(growth,add(one,signed(r)));return {at:i+1,balance:multiply(d(p.initial),growth)};});
   const requiredNow=divide(d(p.target),growth),balance=multiply(d(p.initial),growth);
   return {requiredNow,balance,shortfall:nonnegative(subtract(d(p.target),balance)),targetReached:compare(balance,d(p.target))>=0,horizon:p.returns.length,rows,headline:formatRational(requiredNow)};
  }
  case 96:{
   const p=retirementSchemas[id].parse(raw);unique(p.tranches.map(t=>t.id));
   let employeeBalance=d(p.employeeBalance);
   const buckets=p.tranches.map(t=>({id:t.id,balance:d(t.balance),vestedFraction:d(t.vestedFraction)}));
   const summary=()=>{
    const employerBalance=sum(buckets.map(t=>t.balance)),vestedBalance=add(employeeBalance,sum(buckets.map(t=>multiply(t.balance,t.vestedFraction)))),totalBalance=add(employeeBalance,employerBalance);
    return {employeeBalance,employerBalance,totalBalance,vestedBalance,unvestedBalance:subtract(totalBalance,vestedBalance),tranches:buckets.map(t=>({...t}))};
   };
   const rows=p.steps.map((s,i)=>{
    unique(s.tranches.map(t=>t.id));if(s.tranches.length!==buckets.length||s.tranches.some(t=>!buckets.some(b=>b.id===t.id)))throw Error('Every declared tranche must be supplied once each period');
    const factor=add(one,signed(s.returnRate)),update=(balance:Rational,contribution:string)=>p.timing==='begin'?multiply(add(balance,d(contribution)),factor):add(multiply(balance,factor),d(contribution));
    employeeBalance=update(employeeBalance,s.employeeContribution);
    for(const bucket of buckets){const step=s.tranches.find(t=>t.id===bucket.id)!;const vest=d(step.vestedFraction);if(compare(vest,bucket.vestedFraction)<0)throw Error('Vesting fraction reduction/forfeiture unsupported');bucket.balance=update(bucket.balance,step.contribution);bucket.vestedFraction=vest;}
    return {at:i+1,...summary()};
   });
   const out=summary();return {...out,horizon:p.steps.length,rows,headline:formatRational(out.vestedBalance)};
  }
 }
}
export const retirementMethods:Record<keyof typeof retirementSchemas,string>={
 80:'Finite initial corpus = present value of max(supplied spending-benefit,0) at each explicit begin/end boundary plus supplied reserve at horizon end. Per-period effective returns supplied; benefit surplus is not invested. No perpetuity or retirement-safety claim.',
 81:'Contribution before/after supplied effective-period growth, with separate cumulative contributions and investment gain. Real balance divides nominal balance by cumulative supplied inflation. No rate conversion, account eligibility or tax assumptions.',
 84:'Inflate period0 spending at each payment boundary, then value finite positive spending gaps and terminal reserve. Begin payments use inflation through the preceding period; end payments include current inflation. Real return=(1+nominal)/(1+inflation)-1. Reserve is supplied nominal horizon-end money.',
 85:'Benefits offset spending at the same boundary; only positive gaps withdraw from capital. End timing grows before payment; begin timing grows after payment. Withdrawals cap at available funds; benefits exceeding spending are not deposited. Exact zero and unpaid demand are distinct.',
 86:'Finite-horizon withdrawal trace with first exact-zero and first insufficient-withdrawal events, including initial zero at period0. Funds remaining at the horizon do not mean never depleted or sustainable.',
 88:'Target capital = supplied annual spending / explicitly supplied withdrawal fraction. Accumulate supplied contributions/returns and find first crossing, including period0. Target is constant supplied nominal capital; no universal safe rate or guarantee.',
 89:'No future contributions: required current capital = supplied future target / product(1+supplied period returns). Zero horizon returns target directly. Does not select retirement date, target or safe investment return.',
 90:'Lean is only a caller-selected spending profile. Target = supplied annual spending / supplied withdrawal fraction, with finite accumulation/first crossing. No universal Lean threshold or safe withdrawal rate.',
 91:'Fat is only a caller-selected spending profile. Target = supplied annual spending / supplied withdrawal fraction, with finite accumulation/first crossing. No universal Fat threshold or safe withdrawal rate.',
 96:'Employee bucket is fully vested. Each declared employer tranche compounds supplied contributions and returns with explicitly supplied nondecreasing vested fractions. Report total/vested/unvested amounts separately. No plan matching, legal limits, forfeiture, distribution treatment or institutional eligibility inferred.',
};
