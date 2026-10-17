// Literal registered-contract expansions; not specialist approval or forecast advice.
export const investmentCashflowIndependentGoldens = {
  "stepUpSip": [
    {
      "label": "Before first step:12 deposits100 at zero return =1200",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": 0,
        "termMonths": 12,
        "contributionTiming": "end"
      },
      "expected": {
        "futureValue": 1200,
        "investedAmount": 1200,
        "estimatedGain": 0,
        "finalMonthlyContribution": 100
      }
    },
    {
      "label": "First step month13:12 times100 plus110 =1310",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": 0,
        "termMonths": 13,
        "contributionTiming": "end"
      },
      "expected": {
        "futureValue": 1310,
        "investedAmount": 1310,
        "estimatedGain": 0,
        "finalMonthlyContribution": 110
      }
    },
    {
      "label": "Before second step:12 times100 plus12 times110 =2520",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": 0,
        "termMonths": 24,
        "contributionTiming": "beginning"
      },
      "expected": {
        "futureValue": 2520,
        "investedAmount": 2520,
        "estimatedGain": 0,
        "finalMonthlyContribution": 110
      }
    },
    {
      "label": "Second step month25 adds121 to2520 =2641",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": 0,
        "termMonths": 25,
        "contributionTiming": "beginning"
      },
      "expected": {
        "futureValue": 2641,
        "investedAmount": 2641,
        "estimatedGain": 0,
        "finalMonthlyContribution": 121
      }
    },
    {
      "label": "Two end deposits:100 times1.01 plus100 =201",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": 12,
        "termMonths": 2,
        "contributionTiming": "end"
      },
      "expected": {
        "futureValue": 201,
        "investedAmount": 200,
        "estimatedGain": 1,
        "finalMonthlyContribution": 100
      }
    },
    {
      "label": "Two beginning deposits:100 times1.01 squared plus100 times1.01 =203.01",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": 12,
        "termMonths": 2,
        "contributionTiming": "beginning"
      },
      "expected": {
        "futureValue": 203.01,
        "investedAmount": 200,
        "estimatedGain": 3.01,
        "finalMonthlyContribution": 100
      }
    },
    {
      "label": "Negative return:100 times.99 plus100 =199",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 10,
        "annualReturnPercent": -12,
        "termMonths": 2,
        "contributionTiming": "end"
      },
      "expected": {
        "futureValue": 199,
        "investedAmount": 200,
        "estimatedGain": -1,
        "finalMonthlyContribution": 100
      }
    },
    {
      "label": "Zero-return no-step at1200-month ceiling:100 times1200",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 0,
        "annualReturnPercent": 0,
        "termMonths": 1200,
        "contributionTiming": "end"
      },
      "expected": {
        "futureValue": 120000,
        "investedAmount": 120000,
        "estimatedGain": 0,
        "finalMonthlyContribution": 100
      }
    },
    {
      "label": "Step and growth month13:100 sum(1.1^j,j=1..12)+200",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 100,
        "annualReturnPercent": 120,
        "termMonths": 13,
        "contributionTiming": "end"
      },
      "expected": {
        "futureValue": 2552.27,
        "investedAmount": 1400,
        "estimatedGain": 1152.27,
        "finalMonthlyContribution": 200
      }
    },
    {
      "label": "Step and growth month13:100 sum(1.1^j,j=1..12)+200 all times1.1",
      "input": {
        "initialMonthlyContribution": 100,
        "annualStepUpPercent": 100,
        "annualReturnPercent": 120,
        "termMonths": 13,
        "contributionTiming": "beginning"
      },
      "expected": {
        "futureValue": 2807.5,
        "investedAmount": 1400,
        "estimatedGain": 1407.5,
        "finalMonthlyContribution": 200
      }
    }
  ],
  "investmentMath": [
    {
      "label": "100 times1.21 squared=146.41; real1.21/1.1=1.1 gives121",
      "input": {
        "presentValue": 100,
        "annualReturnPercent": 21,
        "years": 2,
        "inflationPercent": 10
      },
      "expected": {
        "futureValue": 146.41,
        "inflationAdjustedFutureValue": 121,
        "realAnnualReturnPercent": 10
      }
    },
    {
      "label": "Nominal and inflation both10%:real ratio1, capital100 preserved",
      "input": {
        "presentValue": 100,
        "annualReturnPercent": 10,
        "years": 2,
        "inflationPercent": 10
      },
      "expected": {
        "futureValue": 121,
        "inflationAdjustedFutureValue": 100,
        "realAnnualReturnPercent": 0
      }
    },
    {
      "label": "Negative nominal return:100 times.9 squared=81; zero inflation",
      "input": {
        "presentValue": 100,
        "annualReturnPercent": -10,
        "years": 2,
        "inflationPercent": 0
      },
      "expected": {
        "futureValue": 81,
        "inflationAdjustedFutureValue": 81,
        "realAnnualReturnPercent": -10
      }
    },
    {
      "label": "Deflation:nominal100; real ratio1/.8=1.25 yields125",
      "input": {
        "presentValue": 100,
        "annualReturnPercent": 0,
        "years": 1,
        "inflationPercent": -20
      },
      "expected": {
        "futureValue": 100,
        "inflationAdjustedFutureValue": 125,
        "realAnnualReturnPercent": 25
      }
    },
    {
      "label": "Fractional year:100 times sqrt1.21=110; annual real return21%",
      "input": {
        "presentValue": 100,
        "annualReturnPercent": 21,
        "years": 0.5,
        "inflationPercent": 0
      },
      "expected": {
        "futureValue": 110,
        "inflationAdjustedFutureValue": 110,
        "realAnnualReturnPercent": 21
      }
    },
    {
      "label": "Zero rates at200-year ceiling preserve123.45",
      "input": {
        "presentValue": 123.45,
        "annualReturnPercent": 0,
        "years": 200,
        "inflationPercent": 0
      },
      "expected": {
        "futureValue": 123.45,
        "inflationAdjustedFutureValue": 123.45,
        "realAnnualReturnPercent": 0
      }
    },
    {
      "label": "Inflation25% with zero nominal:100/1.25=80 and real-20%",
      "input": {
        "presentValue": 100,
        "annualReturnPercent": 0,
        "years": 1,
        "inflationPercent": 25
      },
      "expected": {
        "futureValue": 100,
        "inflationAdjustedFutureValue": 80,
        "realAnnualReturnPercent": -20
      }
    },
    {
      "label": "80 times1.25=100 at zero inflation; real25%",
      "input": {
        "presentValue": 80,
        "annualReturnPercent": 25,
        "years": 1,
        "inflationPercent": 0
      },
      "expected": {
        "futureValue": 100,
        "inflationAdjustedFutureValue": 100,
        "realAnnualReturnPercent": 25
      }
    }
  ],
  "swp": [
    {
      "label": "End timing:(100 times1.01-10) times1.01-10=81.91",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 10,
        "annualReturnPercent": 12,
        "termMonths": 2,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 81.91,
        "totalWithdrawn": 20,
        "depleted": false,
        "depletionMonth": null
      }
    },
    {
      "label": "Beginning timing:((100-10) times1.01-10) times1.01=81.709 rounded81.71",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 10,
        "annualReturnPercent": 12,
        "termMonths": 2,
        "withdrawalTiming": "beginning"
      },
      "expected": {
        "endingCorpus": 81.71,
        "totalWithdrawn": 20,
        "depleted": false,
        "depletionMonth": null
      }
    },
    {
      "label": "Partial final end withdrawal:30+30+30+10=100, depleted month4",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 30,
        "annualReturnPercent": 0,
        "termMonths": 4,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 0,
        "totalWithdrawn": 100,
        "depleted": true,
        "depletionMonth": 4
      }
    },
    {
      "label": "Partial final beginning withdrawal:30+30+30+10=100, depleted month4",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 30,
        "annualReturnPercent": 0,
        "termMonths": 4,
        "withdrawalTiming": "beginning"
      },
      "expected": {
        "endingCorpus": 0,
        "totalWithdrawn": 100,
        "depleted": true,
        "depletionMonth": 4
      }
    },
    {
      "label": "End timing earns1 before capped withdrawal101; depleted month1",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 101,
        "annualReturnPercent": 12,
        "termMonths": 1,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 0,
        "totalWithdrawn": 101,
        "depleted": true,
        "depletionMonth": 1
      }
    },
    {
      "label": "Beginning capped withdrawal100 depletes before growth; month1",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 101,
        "annualReturnPercent": 12,
        "termMonths": 1,
        "withdrawalTiming": "beginning"
      },
      "expected": {
        "endingCorpus": 0,
        "totalWithdrawn": 100,
        "depleted": true,
        "depletionMonth": 1
      }
    },
    {
      "label": "No withdrawals:100 times1.01 squared=102.01, not depleted",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 0,
        "annualReturnPercent": 12,
        "termMonths": 2,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 102.01,
        "totalWithdrawn": 0,
        "depleted": false,
        "depletionMonth": null
      }
    },
    {
      "label": "Negative return:(100 times.99-10) times.99-10=78.11",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 10,
        "annualReturnPercent": -12,
        "termMonths": 2,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 78.11,
        "totalWithdrawn": 20,
        "depleted": false,
        "depletionMonth": null
      }
    },
    {
      "label": "Exact zero-return depletion:four withdrawals25 =100",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 25,
        "annualReturnPercent": 0,
        "termMonths": 4,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 0,
        "totalWithdrawn": 100,
        "depleted": true,
        "depletionMonth": 4
      }
    },
    {
      "label": "No withdrawals and zero return at1200-month ceiling preserves100",
      "input": {
        "initialCorpus": 100,
        "monthlyWithdrawal": 0,
        "annualReturnPercent": 0,
        "termMonths": 1200,
        "withdrawalTiming": "end"
      },
      "expected": {
        "endingCorpus": 100,
        "totalWithdrawn": 0,
        "depleted": false,
        "depletionMonth": null
      }
    }
  ]
} as const;
