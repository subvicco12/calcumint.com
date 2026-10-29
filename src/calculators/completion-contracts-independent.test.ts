import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {completionContracts} from './completion-contracts';
const b={currency:'USD',period:'year',scope:'supplied-scenario-no-policy',timing:'end'};
const q=(numerator:string,denominator='1')=>({numerator,denominator});
const calc=(id:number,input:unknown)=>runCalculator(completionContracts.find(d=>d.id===`private.completion.${id}`)!,input).output;
describe('independent supplied completion numerical witnesses',()=>{
 it('80: mixed loss/gain discounts gaps and horizon reserve separately',()=>{
  const p={...b,terminalReserve:'8',steps:[{returnRate:'-0.5',spending:'15',benefit:'5'},{returnRate:'1',spending:'35',benefit:'5'}]};
  expect(calc(80,p)).toMatchObject({requiredInitialCapital:q('58'),presentTerminalReserve:q('8')});
  expect(calc(80,{...p,timing:'begin'})).toMatchObject({requiredInitialCapital:q('78')});
 });
 it('84: unequal inflation and returns align payment boundaries',()=>{
  const p={...b,baseSpending:'80',terminalReserve:'5',steps:[{returnRate:'0.25',inflationRate:'0.5',benefit:'0'},{returnRate:'-0.5',inflationRate:'-0.5',benefit:'0'}]};
  expect(calc(84,p)).toMatchObject({requiredInitialCapital:q('200'),rows:[{spending:q('120'),realReturn:q('-1','6')},{spending:q('60'),realReturn:q('0')}]});
  expect(calc(84,{...p,timing:'begin'})).toMatchObject({requiredInitialCapital:q('184'),rows:[{spending:q('80')},{spending:q('120')}]});
 });
 it('81: contributions and inflation remain separate through a loss and recovery',()=>{
  const p={...b,initial:'40',steps:[{returnRate:'-0.5',contribution:'10',inflationRate:'0.25'},{returnRate:'1',contribution:'20',inflationRate:'-0.2'}]};
  expect(calc(81,p)).toMatchObject({balance:q('80'),realBalance:q('80'),investmentGain:q('10'),totalContributions:q('30')});
  expect(calc(81,{...p,timing:'begin'})).toMatchObject({balance:q('90'),realBalance:q('90'),investmentGain:q('20')});
 });
 it.each([85,86])('%i: losses and timing produce actual unmet gaps',id=>{
  const p={...b,initial:'40',steps:[{returnRate:'-0.5',spending:'30',benefit:'0'},{returnRate:'1',spending:'10',benefit:'2'}]};
  expect(calc(id,p)).toMatchObject({balance:q('0'),totalShortfall:q('18'),exactZeroPeriod:1,firstShortfallPeriod:1});
  expect(calc(id,{...p,timing:'begin'})).toMatchObject({balance:q('0'),totalShortfall:q('3'),exactZeroPeriod:2,firstShortfallPeriod:2});
  expect(calc(id,{...b,initial:'0',steps:[]})).toMatchObject({exactZeroPeriod:0,firstShortfallPeriod:null,totalShortfall:q('0')});
 });
 it.each([[88,'supplied'],[90,'lean'],[91,'fat']])('%i: first target crossing survives subsequent loss without claiming final attainment',(id,spendingProfile)=>{
  const p={...b,spendingProfile,targetBasis:'constant-supplied-nominal',annualSpending:'30',withdrawalFraction:'0.2',initial:'100',steps:[{returnRate:'1',contribution:'0'},{returnRate:'-0.5',contribution:'0'}]};
  expect(calc(Number(id),p)).toMatchObject({targetCapital:q('150'),firstTargetPeriod:1,targetReached:false,balance:q('100')});
  expect(()=>calc(Number(id),{...p,withdrawalFraction:'0'})).toThrow();
 });
 it('89: supplied loss/recovery gives exact no-contribution target and zero horizon',()=>{
  expect(calc(89,{...b,contributionPolicy:'none',target:'75',initial:'90',returns:['-0.5','0.5']})).toMatchObject({requiredNow:q('100'),balance:q('135','2'),shortfall:q('15','2'),targetReached:false});
  expect(calc(89,{...b,contributionPolicy:'none',target:'75',initial:'90',returns:[]})).toMatchObject({requiredNow:q('75'),balance:q('90'),targetReached:true});
 });
 it('96: tranche IDs, not array position, control vesting; reductions and missing IDs fail',()=>{
  const p={...b,employeeBalance:'20',tranches:[{id:'a',balance:'40',vestedFraction:'0.25'},{id:'b',balance:'60',vestedFraction:'0.5'}],steps:[{returnRate:'-0.5',employeeContribution:'10',tranches:[{id:'b',contribution:'0',vestedFraction:'0.75'},{id:'a',contribution:'20',vestedFraction:'0.5'}]}]};
  expect(calc(96,p)).toMatchObject({employeeBalance:q('20'),totalBalance:q('90'),vestedBalance:q('125','2'),unvestedBalance:q('55','2')});
  expect(calc(96,{...p,timing:'begin'})).toMatchObject({totalBalance:q('75'),vestedBalance:q('105','2')});
  expect(()=>calc(96,{...p,steps:[{...p.steps[0],tranches:[p.steps[0].tranches[0]]}]})).toThrow();
  expect(()=>calc(96,{...p,steps:[{...p.steps[0],tranches:[{id:'a',contribution:'0',vestedFraction:'0.2'},p.steps[0].tranches[0]]}]})).toThrow();
 });
 it('35: disjoint prior-paid, financed costs, deposits and credits reconcile cash and debt',()=>{
  const p={currency:'USD',scope:'supplied-closing-lines-no-eligibility',price:'100',baseLoan:'80',financedCosts:'4',deposit:'15',sellerCredit:'2',lenderCredit:'3',otherCredit:'0',lines:[{id:'a',category:'loan-cost',amount:'7',paidBefore:'2'},{id:'b',category:'prepaid',amount:'3',paidBefore:'1'}]};
  expect(calc(35,p)).toMatchObject({cashToClose:q('3'),loanAmount:q('84'),closingCosts:q('10'),paidBefore:q('3')});
  expect(calc(35,{...p,deposit:'20'})).toMatchObject({cashToClose:q('-2')});
  expect(()=>calc(35,{...p,financedCosts:'11'})).toThrow();
 });
 it.each([125,127])('%i: repeating inclusive amounts retain exact tax and separate classifications',id=>{
  const p={currency:'USD',period:'invoice',scope:'supplied-classifications-no-rule-selection',lines:[{id:'a',amount:'1',priceBasis:'inclusive',classification:'taxable',rateFraction:'0.5'},{id:'b',amount:'2',priceBasis:'exclusive',classification:'taxable',rateFraction:'0.25'},{id:'c',amount:'3',priceBasis:'inclusive',classification:'exempt',rateFraction:'0'},{id:'d',amount:'4',priceBasis:'exclusive',classification:'zero-rated',rateFraction:'0'}]};
  expect(calc(id,p)).toMatchObject({net:q('29','3'),tax:q('5','6'),gross:q('21','2'),exemptNet:q('3'),zeroRatedNet:q('4')});
 });
 it('134: decimal liabilities yield exact ratio with a caller-selected denominator',()=>{
  const p={currency:'USD',period:'year',scope:'supplied-liability-ratio-no-statutory-definition',denominatorBasis:'supplied revenue',denominator:'0.7',liabilities:[{id:'a',amount:'0.1'},{id:'b',amount:'0.2'}]};
  expect(calc(134,p)).toMatchObject({totalLiability:q('3','10'),percent:q('300','7')});
  expect(()=>calc(134,{...p,denominator:'0'})).toThrow();
 });
});
