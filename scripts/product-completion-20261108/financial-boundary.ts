/** Read-only legacy witness: independent zero-duration/zero-rate identities. */
import {compoundInterestCalculator} from '../../src/calculators/finance/compound-interest';
import {loanPaymentCalculator} from '../../src/calculators/finance/loan-payment';
const principal=12000000000000.25;
const compoundInput={principal,annualRatePercent:5,years:0,compoundsPerYear:12};
const loanInput={principal,annualRatePercent:0,termMonths:1};
const cases=[
 {catalogReviewCandidate:51,engineId:compoundInterestCalculator.id,version:compoundInterestCalculator.version,input:compoundInput,actual:compoundInterestCalculator.calculate(compoundInput,{}),independentIdentity:'Zero compounding periods: A=P and I=0',expected:{futureValue:principal,totalInterest:0}},
 {catalogReviewCandidate:1,engineId:loanPaymentCalculator.id,version:loanPaymentCalculator.version,input:loanInput,actual:loanPaymentCalculator.calculate(loanInput,{}),independentIdentity:'One zero-rate period: monthlyPayment=totalPayment=P and totalInterest=0',expected:{monthlyPayment:principal,totalPayment:principal,totalInterest:0}},
];
console.log(JSON.stringify({kind:'LEGACY_BOUNDARY_OBSERVATION_NOT_NEW_ACCEPTANCE',principalExactDyadic:{numerator:'48000000000001',denominator:'4'},cases:cases.map(c=>({...c,matchesIdentity:JSON.stringify(c.actual)===JSON.stringify(c.expected)})),formulaChanged:false,sourceModified:false,certificationAuthorized:false,releaseHold:true},null,2));
