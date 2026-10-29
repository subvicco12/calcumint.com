import {describe,it,expect} from 'vitest';
import {runCalculator} from './engine';
import {completionContracts,completionExamples,exportCompletion,importCompletion} from './completion-contracts';
const b={currency:'USD',period:'year',scope:'supplied-scenario-no-policy',timing:'end'};
const q=(numerator:string,denominator='1')=>({numerator,denominator});
const calc=(n:number,input:unknown)=>runCalculator(completionContracts.find(d=>d.id===`private.completion.${n}`)!,input).output;
describe('remaining complete private supplied contracts',()=>{
 it('80 discounts each finite spending gap and reserve at correct boundaries',()=>{
  const p={...b,terminalReserve:'121',steps:[{returnRate:'0.1',spending:'110',benefit:'0'},{returnRate:'0.1',spending:'121',benefit:'0'}]};
  expect(calc(80,p)).toMatchObject({requiredInitialCapital:q('300')});
  expect(calc(80,{...p,timing:'begin'})).toMatchObject({requiredInitialCapital:q('320')});
 });
 it('80 retains negative returns and zero-horizon reserve without a perpetuity',()=>{
  expect(calc(80,{...b,terminalReserve:'0',steps:[{returnRate:'-0.5',spending:'50',benefit:'0'}]})).toMatchObject({requiredInitialCapital:q('100')});
  expect(calc(80,{...b,terminalReserve:'123',steps:[]})).toMatchObject({requiredInitialCapital:q('123')});
 });
 it('81 separates contribution timing, gains and real purchasing power',()=>{
  const p={...b,initial:'100',steps:[{returnRate:'0.1',contribution:'10',inflationRate:'0.2'}]};
  expect(calc(81,p)).toMatchObject({balance:q('120'),realBalance:q('100'),investmentGain:q('10')});
  expect(calc(81,{...p,timing:'begin'})).toMatchObject({balance:q('121'),investmentGain:q('11')});
 });
 it('84 aligns inflation and discounting at begin/end payment boundaries',()=>{
  const p={...b,baseSpending:'100',terminalReserve:'0',steps:[{returnRate:'0.1',inflationRate:'0.1',benefit:'0'},{returnRate:'0.1',inflationRate:'0.1',benefit:'0'}]};
  expect(calc(84,p)).toMatchObject({requiredInitialCapital:q('200'),rows:[{spending:q('110'),realReturn:q('0')},{spending:q('121'),realReturn:q('0')}]});
  expect(calc(84,{...p,timing:'begin'})).toMatchObject({requiredInitialCapital:q('200'),rows:[{spending:q('100')},{spending:q('110')}]});
 });
 it.each([85,86])('%i distinguishes exact depletion from subsequent insufficiency',id=>{
  const p={...b,initial:'100',steps:[{returnRate:'0',spending:'50',benefit:'0'},{returnRate:'0',spending:'50',benefit:'0'},{returnRate:'0',spending:'10',benefit:'0'}]};
  expect(calc(id,p)).toMatchObject({balance:q('0'),exactZeroPeriod:2,firstShortfallPeriod:3,totalShortfall:q('10'),status:'shortfall-within-horizon'});
 });
 it('85 exact decimal growth permits exact withdrawal without a binary residual',()=>{
  expect(calc(85,{...b,initial:'100',steps:[{returnRate:'0.1',spending:'110',benefit:'0'}]})).toMatchObject({balance:q('0'),exactZeroPeriod:1,firstShortfallPeriod:null});
 });
 it('85 benefit surplus is not deposited and early withdrawal does not earn growth',()=>{
  expect(calc(85,{...b,timing:'begin',initial:'100',steps:[{returnRate:'0.1',spending:'50',benefit:'0'}]})).toMatchObject({balance:q('55')});
  expect(calc(85,{...b,initial:'100',steps:[{returnRate:'0',spending:'50',benefit:'80'}]})).toMatchObject({balance:q('100'),totalWithdrawn:q('0')});
 });
 it.each([[88,'supplied'],[90,'lean'],[91,'fat']] as const)('%i derives only the explicitly supplied spending target and first crossing',(id,spendingProfile)=>{
  expect(calc(id,{...b,spendingProfile,targetBasis:'constant-supplied-nominal',annualSpending:'100',withdrawalFraction:'0.1',initial:'900',steps:[{returnRate:'0',contribution:'100'}]})).toMatchObject({targetCapital:q('1000'),firstTargetPeriod:1,balance:q('1000')});
 });
 it('89 Coast computes no-contribution required capital, including zero/negative horizon returns',()=>{
  expect(calc(89,{...b,contributionPolicy:'none',target:'121',initial:'100',returns:['0.1','0.1']})).toMatchObject({requiredNow:q('100'),balance:q('121'),targetReached:true});
  expect(calc(89,{...b,contributionPolicy:'none',target:'100',initial:'100',returns:['-0.5']})).toMatchObject({requiredNow:q('200'),balance:q('50'),targetReached:false});
  expect(calc(89,{...b,contributionPolicy:'none',target:'100',initial:'100',returns:[]})).toMatchObject({requiredNow:q('100')});
 });
 it('96 separates employee property and explicitly supplied employer vesting tranches',()=>{
  const p={...b,employeeBalance:'100',tranches:[{id:'a',balance:'100',vestedFraction:'0.5'}],steps:[{returnRate:'0.1',employeeContribution:'10',tranches:[{id:'a',contribution:'20',vestedFraction:'0.75'}]}]};
  expect(calc(96,p)).toMatchObject({employeeBalance:q('120'),employerBalance:q('130'),totalBalance:q('250'),vestedBalance:q('435','2'),unvestedBalance:q('65','2')});
  expect(calc(96,{...p,timing:'begin'})).toMatchObject({totalBalance:q('253'),vestedBalance:q('220'),unvestedBalance:q('33')});
  expect(()=>calc(96,{...p,steps:[{...p.steps[0],tranches:[{id:'a',contribution:'20',vestedFraction:'0.4'}]}]})).toThrow();
 });
 it('35 reconciles closing costs with prior-paid costs, financed costs and cash credits once',()=>{
  const p={currency:'USD',scope:'supplied-closing-lines-no-eligibility',price:'1000',baseLoan:'800',financedCosts:'50',deposit:'100',sellerCredit:'0',lenderCredit:'10',otherCredit:'0',lines:[{id:'fee',category:'loan-cost',amount:'100',paidBefore:'20'},{id:'escrow',category:'escrow',amount:'50',paidBefore:'0'}]};
  expect(calc(35,p)).toMatchObject({downPayment:q('200'),loanAmount:q('850'),closingCosts:q('150'),cashToClose:q('170')});
  expect(calc(35,{...p,deposit:'300'})).toMatchObject({cashToClose:q('-30')});
 });
 it.each([125,127])('%i reconciles supplied taxable/zero-rated/exempt lines without a selected rule pack',id=>{
  const p={currency:'USD',period:'invoice',scope:'supplied-classifications-no-rule-selection',lines:[{id:'a',amount:'100',priceBasis:'exclusive',classification:'taxable',rateFraction:'0.15'},{id:'b',amount:'115',priceBasis:'inclusive',classification:'taxable',rateFraction:'0.15'},{id:'c',amount:'20',priceBasis:'exclusive',classification:'zero-rated',rateFraction:'0'},{id:'d',amount:'30',priceBasis:'inclusive',classification:'exempt',rateFraction:'0'}]};
  expect(calc(id,p)).toMatchObject({net:q('250'),tax:q('30'),gross:q('280'),zeroRatedNet:q('20'),exemptNet:q('30')});
  expect(()=>calc(id,{...p,lines:[{...p.lines[3],rateFraction:'0.15'}]})).toThrow();
 });
 it('134 sums supplied liabilities and retains the selected positive denominator',()=>{
  expect(calc(134,{currency:'USD',period:'year',scope:'supplied-liability-ratio-no-statutory-definition',denominatorBasis:'selected gross',denominator:'200',liabilities:[{id:'a',amount:'10'},{id:'b',amount:'15'}]})).toMatchObject({totalLiability:q('25'),percent:q('25','2')});
 });
 it.each(['-1','1.000001','-1.01','NaN'])('rejects unsupported return rate %s',returnRate=>expect(()=>calc(80,{...b,terminalReserve:'0',steps:[{returnRate,spending:'100',benefit:'0'}]})).toThrow());
 it('rejects unknown assumptions and excessive horizons',()=>{
  expect(()=>calc(81,{...b,initial:'100',steps:[],taxRate:'0'})).toThrow();
  expect(()=>calc(81,{...b,initial:'100',steps:Array.from({length:601},()=>({returnRate:'0',contribution:'0',inflationRate:'0'}))})).toThrow();
 });
 it.each([35,80,81,84,85,86,88,89,90,91,96,125,127,134])('%i executes examples with identical immutable exports across every plan',id=>{
  const input=completionExamples[id];const s=exportCompletion(id,input,'free');
  expect(exportCompletion(id,input,'pro')).toEqual(s);expect(exportCompletion(id,input,'business')).toEqual(s);
  expect(importCompletion(JSON.parse(JSON.stringify(s)))).toEqual(s);
  expect(Object.isFrozen(s.calculation.input)).toBe(true);expect(Object.isFrozen(s.calculation.output)).toBe(true);expect(Object.isFrozen(s.sources)).toBe(true);
 });
 it.each(['input','output','version','source','identity','extra'])('rejects forged %s',kind=>{
  const s=JSON.parse(JSON.stringify(exportCompletion(81,completionExamples[81])));
  if(kind==='input')s.calculation.input.initial='101';if(kind==='output')s.calculation.output.balance=q('999');
  if(kind==='version')s.calculation.calculatorVersion=2;if(kind==='source')s.sources[0].sha256='0'.repeat(64);
  if(kind==='identity')s.masterId=85;if(kind==='extra')s.approved=true;
  expect(()=>importCompletion(s)).toThrow();
 });
 it('supports the600-period boundary with exact repeated contributions',()=>{
  expect(calc(81,{...b,initial:'0',steps:Array.from({length:600},()=>({returnRate:'0',contribution:'0.1',inflationRate:'0'}))})).toMatchObject({balance:q('60'),totalContributions:q('60'),horizon:600});
 });
 it('rejects duplicated price identities and nonpositive ratio denominators',()=>{
  const p=completionExamples[125] as {lines:unknown[]};
  expect(()=>calc(125,{...p,lines:[p.lines[0],p.lines[0]]})).toThrow();
  expect(()=>calc(134,{...completionExamples[134],denominator:'0'})).toThrow();
  expect(()=>calc(134,{...completionExamples[134],denominator:'-1'})).toThrow();
 });
 it('rejects unmatched closing totals, excessive financed costs and overstated prior payments',()=>{
  const p=completionExamples[35];
  expect(()=>calc(35,{...p,baseLoan:'1001'})).toThrow();
  expect(()=>calc(35,{...p,financedCosts:'151'})).toThrow();
  expect(()=>calc(35,{...p,lines:[{id:'x',category:'loan-cost',amount:'1',paidBefore:'2'}]})).toThrow();
 });
 it('rejects missing or duplicated vesting tranches rather than inventing plan fractions',()=>{
  const p=completionExamples[96];
  expect(()=>calc(96,{...p,steps:[{returnRate:'0',employeeContribution:'0',tranches:[]}]})).toThrow();
  expect(()=>calc(96,{...p,steps:[{returnRate:'0',employeeContribution:'0',tranches:[{id:'a',contribution:'0',vestedFraction:'0.75'},{id:'a',contribution:'0',vestedFraction:'0.75'}]}]})).toThrow();
 });
});
