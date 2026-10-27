import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {projectSuppliedBalance,suppliedPriceFactor,suppliedLeaseBase,suppliedHeatSavings,suppliedWeightedMean} from './source-driven-components';
// Authored literal examples, independent of runtime execution and the test fixture.
const authoredExamples = [
  {
    "masterId": 81,
    "slug": "private-source-81",
    "title": "Supplied Deposit Balance Projection (limited)",
    "examples": [
      {
        "label": "End deposits: 100*1.1+10=120",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 100,
          "timing": "end",
          "steps": [
            {
              "rate": 0.1,
              "deposit": 10
            }
          ]
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 120
        }
      },
      {
        "label": "Begin deposits: (100+10)*1.1=121",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 100,
          "timing": "begin",
          "steps": [
            {
              "rate": 0.1,
              "deposit": 10
            }
          ]
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 121
        }
      },
      {
        "label": "Empty zero horizon",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 0,
          "timing": "end",
          "steps": []
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 0
        }
      }
    ]
  },
  {
    "masterId": 85,
    "slug": "private-source-85",
    "title": "Supplied Withdrawal Balance Projection 85 (limited)",
    "examples": [
      {
        "label": "Exact depletion then shortfall",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 10,
          "timing": "end",
          "steps": [
            {
              "rate": 0,
              "withdrawal": 10
            },
            {
              "rate": 0,
              "withdrawal": 1
            }
          ]
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 0,
          "exactZeroPeriod": 1,
          "firstShortfallPeriod": 2
        }
      },
      {
        "label": "Negative supplied return and begin timing",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 100,
          "timing": "begin",
          "steps": [
            {
              "rate": -0.5,
              "withdrawal": 20
            }
          ]
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 40,
          "exactZeroPeriod": null,
          "firstShortfallPeriod": null
        }
      }
    ]
  },
  {
    "masterId": 86,
    "slug": "private-source-86",
    "title": "Supplied Withdrawal Balance Projection 86 (limited)",
    "examples": [
      {
        "label": "Exact depletion then shortfall",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 10,
          "timing": "end",
          "steps": [
            {
              "rate": 0,
              "withdrawal": 10
            },
            {
              "rate": 0,
              "withdrawal": 1
            }
          ]
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 0,
          "exactZeroPeriod": 1,
          "firstShortfallPeriod": 2
        }
      },
      {
        "label": "Negative supplied return and begin timing",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "initial": 100,
          "timing": "begin",
          "steps": [
            {
              "rate": -0.5,
              "withdrawal": 20
            }
          ]
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "endingBalance": 40,
          "exactZeroPeriod": null,
          "firstShortfallPeriod": null
        }
      }
    ]
  },
  {
    "masterId": 126,
    "slug": "private-source-126",
    "title": "IRD Observed 2026-10-26 Supplied Price Algebra (illustrative)",
    "examples": [
      {
        "label": "Observed exclusive 100",
        "input": {
          "sourceProfile": "IRD_OBSERVED_2026_10_26_PRICE_ONLY",
          "rateFraction": 0.15,
          "currency": "NZD",
          "period": "observed price",
          "amount": 100,
          "mode": "exclusive"
        },
        "expected": {
          "currency": "NZD",
          "period": "observed price",
          "net": 100,
          "tax": 15,
          "gross": 115
        }
      },
      {
        "label": "Observed inclusive 115",
        "input": {
          "sourceProfile": "IRD_OBSERVED_2026_10_26_PRICE_ONLY",
          "rateFraction": 0.15,
          "currency": "NZD",
          "period": "observed price",
          "amount": 115,
          "mode": "inclusive"
        },
        "expected": {
          "currency": "NZD",
          "period": "observed price",
          "net": 100,
          "tax": 15,
          "gross": 115
        }
      }
    ]
  },
  {
    "masterId": 469,
    "slug": "private-source-469",
    "title": "Supplied Lease Disclosure Base Payment (illustrative)",
    "examples": [
      {
        "label": "Unrounded disclosed base 11745/48",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "adjustedCapitalizedCost": 18800,
          "residual": 12350,
          "totalRentCharge": 5295,
          "paymentCount": 48
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "basePayment": 244.6875
        }
      }
    ]
  },
  {
    "masterId": 488,
    "slug": "private-source-488",
    "title": "Supplied Heat Balance Savings (limited)",
    "examples": [
      {
        "label": "1200-(4000+100)/4=175",
        "input": {
          "currency": "USD",
          "period": "supplied period",
          "usefulHeatKWh": 12000,
          "baselineEfficiency": 0.8,
          "scop": 3,
          "baselinePricePerKWh": 0.08,
          "heatPumpPricePerKWh": 0.25,
          "auxiliaryBoundary": "outside-SCOP",
          "auxiliaryKWh": 100
        },
        "expected": {
          "currency": "USD",
          "period": "supplied period",
          "savings": 175
        }
      }
    ]
  },
  {
    "masterId": 516,
    "slug": "private-source-516",
    "title": "Supplied Eligible Grade Point Mean (limited)",
    "examples": [
      {
        "label": "Independent eligible mean 82/25",
        "input": {
          "policyId": "caller-example",
          "policyVersion": "1",
          "maxGradePoints": 4.3,
          "rows": [
            {
              "points": 2.7,
              "credits": 3
            },
            {
              "points": 3.7,
              "credits": 4
            },
            {
              "points": 3.3,
              "credits": 3
            }
          ]
        },
        "expected": {
          "policyId": "caller-example",
          "policyVersion": "1",
          "maxGradePoints": 4.3,
          "weightedMean": 3.28
        }
      }
    ]
  }
];
const finite=z.number().finite(),nonnegative=finite.min(0),text=z.string().trim().min(1).max(64);
const basis={currency:text,period:text};
const projection={...basis,initial:nonnegative,timing:z.enum(['begin','end'])};
const deposits=z.object({...projection,steps:z.array(z.object({rate:finite.gt(-1),deposit:nonnegative}).strict()).max(10000)}).strict();
const withdrawals=z.object({...projection,steps:z.array(z.object({rate:finite.gt(-1),withdrawal:nonnegative}).strict()).max(10000)}).strict();
const price=z.object({sourceProfile:z.literal('IRD_OBSERVED_2026_10_26_PRICE_ONLY'),amount:nonnegative,mode:z.enum(['exclusive','inclusive']),rateFraction:z.literal(.15),currency:z.literal('NZD'),period:text}).strict();
const lease=z.object({...basis,adjustedCapitalizedCost:nonnegative,residual:nonnegative,totalRentCharge:nonnegative,paymentCount:finite.int().min(1).max(10000)}).strict();
const heat=z.object({...basis,usefulHeatKWh:nonnegative,baselineEfficiency:finite.gt(0).max(1),scop:finite.gt(0),baselinePricePerKWh:nonnegative,heatPumpPricePerKWh:nonnegative,auxiliaryBoundary:z.literal('outside-SCOP'),auxiliaryKWh:nonnegative}).strict();
const grades=z.object({policyId:text,policyVersion:text,maxGradePoints:finite.gt(0),rows:z.array(z.object({points:nonnegative,credits:nonnegative}).strict()).max(10000)}).strict().superRefine((p,ctx)=>{if(!p.rows.some(r=>r.credits>0))ctx.addIssue({code:'custom',message:'Positive eligible total credits required'});if(p.rows.some(r=>r.points>p.maxGradePoints))ctx.addIssue({code:'custom',message:'Points exceed supplied maximum'});});
const common='Partial proposed private profile only, not a canonical or adopted contract and not source complete. Archived source observation is not publisher-byte verified; source package remains pending. Qualified decisions and owner approval remain outstanding; public registration, clinical use, certification and publication remain blocked. Unrounded finite IEEE-754 arithmetic.';
const investor='https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator';
const specs=[
 {id:81,title:'Supplied Deposit Balance Projection (limited)',schema:deposits,url:investor,contract:'supplied-deposit-projection',expression:'begin: B=(B+deposit)*(1+return); end: B=B*(1+return)+deposit',scope:'Nonnegative supplied deposits only; explicit effective return for each period and begin/end timing. No annual/monthly conversion, tax/account rules or retirement adequacy.',calculate:(raw:unknown)=>{const p=deposits.parse(raw);const r=projectSuppliedBalance({...p,steps:p.steps.map(s=>({rate:s.rate,cashflow:s.deposit}))});return {...units(p),endingBalance:r.balance};}},
 ...([85,86] as const).map(id=>({id,title:`Supplied Withdrawal Balance Projection ${id} (limited)`,schema:withdrawals,url:investor,contract:`supplied-withdrawal-projection-${id}`,expression:'Apply each supplied period return and requested withdrawal in explicit timing; cap withdrawal at available balance',scope:'Nonnegative requested withdrawals only. Separate exact zero and first shortfall events within supplied periods; null means no event within supplied horizon. No safety, longevity or horizon inference; no annual/monthly conversion.',calculate:(raw:unknown)=>{const p=withdrawals.parse(raw),r=projectSuppliedBalance({...p,steps:p.steps.map(s=>({rate:s.rate,cashflow:-s.withdrawal}))});return {...units(p),endingBalance:r.balance,exactZeroPeriod:r.exactZeroPeriod,firstShortfallPeriod:r.firstShortfallPeriod};}})),
 {id:126,title:'IRD Observed 2026-10-26 Supplied Price Algebra (illustrative)',schema:price,url:'https://www.ird.govt.nz/gst/filing-and-paying-gst-and-refunds/calculating-gst',contract:'ird-observed-2026-10-26-price-only',expression:'exclusive: net=amount; inclusive: net=amount/1.15; tax=net*0.15; gross=net+tax',scope:'Explicit historical observation profile and literal 0.15 supplied rate, NZD and period required. Observation 15 GST on 100/115 only; no current statutory or jurisdiction default, eligibility, credits, returns or invoice rounding.',calculate:(raw:unknown)=>{const p=price.parse(raw);return {...units(p),...suppliedPriceFactor({...p,rate:p.rateFraction})};}},
 {id:469,title:'Supplied Lease Disclosure Base Payment (illustrative)',schema:lease,url:'https://www.federalreserve.gov/pubs/leasing/formce/description.htm',contract:'supplied-lease-disclosure-base',expression:'basePayment=(adjustedCapitalizedCost-residual+totalRentCharge)/paymentCount',scope:'Caller supplies disclosed components and payment period. Raw 18800/12350/5295/48 witness yields 244.6875; no universal money factor, tax or invoice rounding.',calculate:(raw:unknown)=>{const p=lease.parse(raw);return {...units(p),basePayment:suppliedLeaseBase({...p,capitalized:p.adjustedCapitalizedCost,rentCharge:p.totalRentCharge,payments:p.paymentCount})};}},
 {id:488,title:'Supplied Heat Balance Savings (limited)',schema:heat,url:'https://etl.energysecurity.gov.uk/products/heat-pumps/air-water-heat-pumps',contract:'supplied-heat-balance-outside-scop',expression:'savings=(usefulHeatKWh/baselineEfficiency)*baselineTariff-(usefulHeatKWh/SCOP+auxiliaryKWh)*electricTariff',scope:'Matched useful heat, system boundary and tariff period supplied; auxiliary electricity explicitly outside SCOP. No installed savings claim, achieved performance or ETL eligibility.',calculate:(raw:unknown)=>{const p=heat.parse(raw);return {...units(p),savings:suppliedHeatSavings(p)};}},
 {id:516,title:'Supplied Eligible Grade Point Mean (limited)',schema:grades,url:'https://studentservices.stanford.edu/my-academics/evaluations-exams-grades/grades/how-do-i-calculate-my-grade-point-average-gpa',contract:'supplied-policy-eligible-point-mean',expression:'weightedMean=sum(points*eligibleCredits)/sum(eligibleCredits)',scope:'Caller-selected policyId and policyVersion, maximum points and already eligible mapped rows required. No Stanford symbol mapping, repeats, exclusion, transfer or program policy inferred.',calculate:(raw:unknown)=>{const p=grades.parse(raw);return {policyId:p.policyId,policyVersion:p.policyVersion,maxGradePoints:p.maxGradePoints,weightedMean:suppliedWeightedMean(p.rows.map(r=>({value:r.points,weight:r.credits})))};}}
];
function units(p:{currency:string;period:string}){return {currency:p.currency,period:p.period};}
/** Review bindings only. These seven proposed contracts confer no ownerModel approval. */
export const privateSourceBindings=specs.map(s=>({masterId:s.id,contractId:s.contract,version:1,contractVersion:1,scope:s.scope,limitations:common,sourceURL:s.url}));
export const privateSourceDefinitions: {masterId:number;definition:CalculatorDefinition<unknown,unknown>}[]=specs.map(s=>({masterId:s.id,definition:{id:`private.source.${s.id}`,slug:`private-source-${s.id}`,title:s.title,category:'private-source',version:1,riskClass:s.id===126?'tax':s.id===516||s.id===488?'standard':'financial',reviewStatus:'draft',inputSchema:s.schema,calculate:s.calculate,formulas:[{id:s.contract,expression:s.expression,description:s.scope+' '+common}],sources:[{label:'Archived supplied source observation (not publisher-byte verified)',url:s.url,note:common+' '+s.scope}],examples:authoredExamples.find(c=>c.masterId===s.id)!.examples}}));
