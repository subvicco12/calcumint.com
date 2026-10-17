// Hand-derived registered contracts; no financial specialist approval granted.
type DebtItems = { name: string; balance: number; annualRatePercent: number; minimumPayment: number }[];
export const debtPayoffIndependentGoldens = {
  "analysis": [
    {
      "label": "Two1% periods:201+2.01-102.01=101;101+1.01-102.01=0",
      "input": {
        "principal": 201,
        "annualRatePercent": 12,
        "termMonths": 2,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "monthlyPayment": 102.01,
        "scheduledPayment": 102.01,
        "totalPayment": 204.02,
        "totalInterest": 3.02,
        "payoffMonths": 2,
        "interestSavedVsScheduled": 0,
        "monthsSavedVsScheduled": 0,
        "amortization": [
          {
            "month": 1,
            "payment": 102.01,
            "principal": 100,
            "interest": 2.01,
            "balance": 101
          },
          {
            "month": 2,
            "payment": 102.01,
            "principal": 101,
            "interest": 1.01,
            "balance": 0
          }
        ]
      }
    },
    {
      "label": "Zero rate:four payments25 retire100",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "termMonths": 4,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "monthlyPayment": 25,
        "scheduledPayment": 25,
        "totalPayment": 100,
        "totalInterest": 0,
        "payoffMonths": 4,
        "interestSavedVsScheduled": 0,
        "monthsSavedVsScheduled": 0,
        "amortization": [
          {
            "month": 1,
            "payment": 25,
            "principal": 25,
            "interest": 0,
            "balance": 75
          },
          {
            "month": 2,
            "payment": 25,
            "principal": 25,
            "interest": 0,
            "balance": 50
          },
          {
            "month": 3,
            "payment": 25,
            "principal": 25,
            "interest": 0,
            "balance": 25
          },
          {
            "month": 4,
            "payment": 25,
            "principal": 25,
            "interest": 0,
            "balance": 0
          }
        ]
      }
    },
    {
      "label": "Extra25 doubles zero-rate payment; payoff two months earlier",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "termMonths": 4,
        "extraMonthlyPayment": 25
      },
      "expected": {
        "monthlyPayment": 50,
        "scheduledPayment": 25,
        "totalPayment": 100,
        "totalInterest": 0,
        "payoffMonths": 2,
        "interestSavedVsScheduled": 0,
        "monthsSavedVsScheduled": 2,
        "amortization": [
          {
            "month": 1,
            "payment": 50,
            "principal": 50,
            "interest": 0,
            "balance": 50
          },
          {
            "month": 2,
            "payment": 50,
            "principal": 50,
            "interest": 0,
            "balance": 0
          }
        ]
      }
    },
    {
      "label": "Requested125 is capped at100 balance; payoff month1",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "termMonths": 4,
        "extraMonthlyPayment": 100
      },
      "expected": {
        "monthlyPayment": 125,
        "scheduledPayment": 25,
        "totalPayment": 100,
        "totalInterest": 0,
        "payoffMonths": 1,
        "interestSavedVsScheduled": 0,
        "monthsSavedVsScheduled": 3,
        "amortization": [
          {
            "month": 1,
            "payment": 100,
            "principal": 100,
            "interest": 0,
            "balance": 0
          }
        ]
      }
    },
    {
      "label": "Extra100:201+2.01-202.01=1; final capped payment1.01",
      "input": {
        "principal": 201,
        "annualRatePercent": 12,
        "termMonths": 2,
        "extraMonthlyPayment": 100
      },
      "expected": {
        "monthlyPayment": 202.01,
        "scheduledPayment": 102.01,
        "totalPayment": 203.02,
        "totalInterest": 2.02,
        "payoffMonths": 2,
        "interestSavedVsScheduled": 1,
        "monthsSavedVsScheduled": 0,
        "amortization": [
          {
            "month": 1,
            "payment": 202.01,
            "principal": 200,
            "interest": 2.01,
            "balance": 1
          },
          {
            "month": 2,
            "payment": 1.01,
            "principal": 1,
            "interest": 0.01,
            "balance": 0
          }
        ]
      }
    },
    {
      "label": "One period100 plus1% interest =101",
      "input": {
        "principal": 100,
        "annualRatePercent": 12,
        "termMonths": 1,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "monthlyPayment": 101,
        "scheduledPayment": 101,
        "totalPayment": 101,
        "totalInterest": 1,
        "payoffMonths": 1,
        "interestSavedVsScheduled": 0,
        "monthsSavedVsScheduled": 0,
        "amortization": [
          {
            "month": 1,
            "payment": 101,
            "principal": 100,
            "interest": 1,
            "balance": 0
          }
        ]
      }
    }
  ],
  "prepayment": [
    {
      "label": "No lump sum:explicit fee10 is not applied",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "originalTermMonths": 4,
        "paymentsMade": 0,
        "lumpSumPrepayment": 0,
        "prepaymentFee": 10
      },
      "expected": {
        "scheduledPayment": 25,
        "remainingBalanceBeforePrepayment": 100,
        "prepaymentApplied": 0,
        "remainingBalanceAfterPrepayment": 100,
        "remainingMonthsWithoutPrepayment": 4,
        "remainingMonthsAfterPrepayment": 4,
        "monthsSaved": 0,
        "remainingInterestWithoutPrepayment": 0,
        "remainingInterestAfterPrepayment": 0,
        "grossInterestSaved": 0,
        "prepaymentFee": 0,
        "netSavingsAfterFee": 0,
        "foreclosureAmount": 100
      }
    },
    {
      "label": "After one25 payment, prepay25 with fee2:75 to50, save one month",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "originalTermMonths": 4,
        "paymentsMade": 1,
        "lumpSumPrepayment": 25,
        "prepaymentFee": 2
      },
      "expected": {
        "scheduledPayment": 25,
        "remainingBalanceBeforePrepayment": 75,
        "prepaymentApplied": 25,
        "remainingBalanceAfterPrepayment": 50,
        "remainingMonthsWithoutPrepayment": 3,
        "remainingMonthsAfterPrepayment": 2,
        "monthsSaved": 1,
        "remainingInterestWithoutPrepayment": 0,
        "remainingInterestAfterPrepayment": 0,
        "grossInterestSaved": 0,
        "prepaymentFee": 2,
        "netSavingsAfterFee": -2,
        "foreclosureAmount": 77
      }
    },
    {
      "label": "Lump100 is capped at remaining75, immediate payoff, fee2",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "originalTermMonths": 4,
        "paymentsMade": 1,
        "lumpSumPrepayment": 100,
        "prepaymentFee": 2
      },
      "expected": {
        "scheduledPayment": 25,
        "remainingBalanceBeforePrepayment": 75,
        "prepaymentApplied": 75,
        "remainingBalanceAfterPrepayment": 0,
        "remainingMonthsWithoutPrepayment": 3,
        "remainingMonthsAfterPrepayment": 0,
        "monthsSaved": 3,
        "remainingInterestWithoutPrepayment": 0,
        "remainingInterestAfterPrepayment": 0,
        "grossInterestSaved": 0,
        "prepaymentFee": 2,
        "netSavingsAfterFee": -2,
        "foreclosureAmount": 77
      }
    },
    {
      "label": "Prepay100 from201:interest3.02 to1.01, gross2.01 lessfee.5 =1.51",
      "input": {
        "principal": 201,
        "annualRatePercent": 12,
        "originalTermMonths": 2,
        "paymentsMade": 0,
        "lumpSumPrepayment": 100,
        "prepaymentFee": 0.5
      },
      "expected": {
        "scheduledPayment": 102.01,
        "remainingBalanceBeforePrepayment": 201,
        "prepaymentApplied": 100,
        "remainingBalanceAfterPrepayment": 101,
        "remainingMonthsWithoutPrepayment": 2,
        "remainingMonthsAfterPrepayment": 1,
        "monthsSaved": 1,
        "remainingInterestWithoutPrepayment": 3.02,
        "remainingInterestAfterPrepayment": 1.01,
        "grossInterestSaved": 2.01,
        "prepaymentFee": 0.5,
        "netSavingsAfterFee": 1.51,
        "foreclosureAmount": 201.5
      }
    },
    {
      "label": "After first payment, prepay1:interest1.01 to1, lessfee.25 gives-.24",
      "input": {
        "principal": 201,
        "annualRatePercent": 12,
        "originalTermMonths": 2,
        "paymentsMade": 1,
        "lumpSumPrepayment": 1,
        "prepaymentFee": 0.25
      },
      "expected": {
        "scheduledPayment": 102.01,
        "remainingBalanceBeforePrepayment": 101,
        "prepaymentApplied": 1,
        "remainingBalanceAfterPrepayment": 100,
        "remainingMonthsWithoutPrepayment": 1,
        "remainingMonthsAfterPrepayment": 1,
        "monthsSaved": 0,
        "remainingInterestWithoutPrepayment": 1.01,
        "remainingInterestAfterPrepayment": 1,
        "grossInterestSaved": 0.01,
        "prepaymentFee": 0.25,
        "netSavingsAfterFee": -0.24,
        "foreclosureAmount": 101.25
      }
    },
    {
      "label": "After first payment with no lump:fee remainszero and interest1.01 unchanged",
      "input": {
        "principal": 201,
        "annualRatePercent": 12,
        "originalTermMonths": 2,
        "paymentsMade": 1,
        "lumpSumPrepayment": 0,
        "prepaymentFee": 10
      },
      "expected": {
        "scheduledPayment": 102.01,
        "remainingBalanceBeforePrepayment": 101,
        "prepaymentApplied": 0,
        "remainingBalanceAfterPrepayment": 101,
        "remainingMonthsWithoutPrepayment": 1,
        "remainingMonthsAfterPrepayment": 1,
        "monthsSaved": 0,
        "remainingInterestWithoutPrepayment": 1.01,
        "remainingInterestAfterPrepayment": 1.01,
        "grossInterestSaved": 0,
        "prepaymentFee": 0,
        "netSavingsAfterFee": 0,
        "foreclosureAmount": 101
      }
    }
  ],
  "refinance": [
    {
      "label": "Zero-rate term extension:100 to50 payment;ceil75/50 =2-month cash break-even",
      "input": {
        "remainingBalance": 1000,
        "currentAnnualRatePercent": 0,
        "currentRemainingMonths": 10,
        "newAnnualRatePercent": 0,
        "newTermMonths": 20,
        "refinanceCosts": 75
      },
      "expected": {
        "currentMonthlyPayment": 100,
        "newMonthlyPayment": 50,
        "monthlyPaymentChange": -50,
        "currentRemainingInterest": 0,
        "newLoanInterest": 0,
        "refinanceCosts": 75,
        "grossInterestSavings": 0,
        "netLifetimeSavings": -75,
        "breakEvenMonths": 2
      }
    },
    {
      "label": "Lower payment with zero costs breaks even immediately",
      "input": {
        "remainingBalance": 1000,
        "currentAnnualRatePercent": 0,
        "currentRemainingMonths": 10,
        "newAnnualRatePercent": 0,
        "newTermMonths": 20,
        "refinanceCosts": 0
      },
      "expected": {
        "currentMonthlyPayment": 100,
        "newMonthlyPayment": 50,
        "monthlyPaymentChange": -50,
        "currentRemainingInterest": 0,
        "newLoanInterest": 0,
        "refinanceCosts": 0,
        "grossInterestSavings": 0,
        "netLifetimeSavings": 0,
        "breakEvenMonths": 0
      }
    },
    {
      "label": "Higher payment from shorter term:break-even remainsnull",
      "input": {
        "remainingBalance": 1000,
        "currentAnnualRatePercent": 0,
        "currentRemainingMonths": 20,
        "newAnnualRatePercent": 0,
        "newTermMonths": 10,
        "refinanceCosts": 50
      },
      "expected": {
        "currentMonthlyPayment": 50,
        "newMonthlyPayment": 100,
        "monthlyPaymentChange": 50,
        "currentRemainingInterest": 0,
        "newLoanInterest": 0,
        "refinanceCosts": 50,
        "grossInterestSavings": 0,
        "netLifetimeSavings": -50,
        "breakEvenMonths": null
      }
    },
    {
      "label": "Remove1% monthly interest:3.02 gross lesscost1 gives2.02;ceil1/1.51=1",
      "input": {
        "remainingBalance": 201,
        "currentAnnualRatePercent": 12,
        "currentRemainingMonths": 2,
        "newAnnualRatePercent": 0,
        "newTermMonths": 2,
        "refinanceCosts": 1
      },
      "expected": {
        "currentMonthlyPayment": 102.01,
        "newMonthlyPayment": 100.5,
        "monthlyPaymentChange": -1.51,
        "currentRemainingInterest": 3.02,
        "newLoanInterest": 0,
        "refinanceCosts": 1,
        "grossInterestSavings": 3.02,
        "netLifetimeSavings": 2.02,
        "breakEvenMonths": 1
      }
    },
    {
      "label": "Reverse rate comparison increases interest3.02 pluscost1 =net-4.02",
      "input": {
        "remainingBalance": 201,
        "currentAnnualRatePercent": 0,
        "currentRemainingMonths": 2,
        "newAnnualRatePercent": 12,
        "newTermMonths": 2,
        "refinanceCosts": 1
      },
      "expected": {
        "currentMonthlyPayment": 100.5,
        "newMonthlyPayment": 102.01,
        "monthlyPaymentChange": 1.51,
        "currentRemainingInterest": 0,
        "newLoanInterest": 3.02,
        "refinanceCosts": 1,
        "grossInterestSavings": -3.02,
        "netLifetimeSavings": -4.02,
        "breakEvenMonths": null
      }
    },
    {
      "label": "Identical zero-rate payments:unchanged payment, cost2, no cash break-even",
      "input": {
        "remainingBalance": 100,
        "currentAnnualRatePercent": 0,
        "currentRemainingMonths": 3,
        "newAnnualRatePercent": 0,
        "newTermMonths": 3,
        "refinanceCosts": 2
      },
      "expected": {
        "currentMonthlyPayment": 33.33,
        "newMonthlyPayment": 33.33,
        "monthlyPaymentChange": 0,
        "currentRemainingInterest": 0,
        "newLoanInterest": 0,
        "refinanceCosts": 2,
        "grossInterestSavings": 0,
        "netLifetimeSavings": -2,
        "breakEvenMonths": null
      }
    }
  ],
  "debt": [
    {
      "label": "Single zero-rate debt100:four minimum payments25",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 100,
            "annualRatePercent": 0,
            "minimumPayment": 25
          }
        ] as DebtItems,
        "extraMonthlyPayment": 0,
        "strategy": "avalanche"
      },
      "expected": {
        "strategy": "avalanche",
        "monthsToPayoff": 4,
        "totalInterest": 0,
        "totalPaid": 100,
        "startingBalance": 100,
        "payoffOrder": [
          "A"
        ] as string[]
      }
    },
    {
      "label": "Single zero-rate debt funded only by extra50:two months",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 100,
            "annualRatePercent": 0,
            "minimumPayment": 0
          }
        ] as DebtItems,
        "extraMonthlyPayment": 50,
        "strategy": "snowball"
      },
      "expected": {
        "strategy": "snowball",
        "monthsToPayoff": 2,
        "totalInterest": 0,
        "totalPaid": 100,
        "startingBalance": 100,
        "payoffOrder": [
          "A"
        ] as string[]
      }
    },
    {
      "label": "Interest1 on A100; budget151 pays both debts in priority order avalanche",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 100,
            "annualRatePercent": 12,
            "minimumPayment": 0
          },
          {
            "name": "B",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 0
          }
        ] as DebtItems,
        "extraMonthlyPayment": 151,
        "strategy": "avalanche"
      },
      "expected": {
        "strategy": "avalanche",
        "monthsToPayoff": 1,
        "totalInterest": 1,
        "totalPaid": 151,
        "startingBalance": 150,
        "payoffOrder": [
          "A",
          "B"
        ] as string[]
      }
    },
    {
      "label": "Interest1 on A100; budget151 pays both debts in priority order snowball",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 100,
            "annualRatePercent": 12,
            "minimumPayment": 0
          },
          {
            "name": "B",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 0
          }
        ] as DebtItems,
        "extraMonthlyPayment": 151,
        "strategy": "snowball"
      },
      "expected": {
        "strategy": "snowball",
        "monthsToPayoff": 1,
        "totalInterest": 1,
        "totalPaid": 151,
        "startingBalance": 150,
        "payoffOrder": [
          "B",
          "A"
        ] as string[]
      }
    },
    {
      "label": "Original50 budget retained:minimum10+10 plus30; B thenA in three months",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 100,
            "annualRatePercent": 0,
            "minimumPayment": 10
          },
          {
            "name": "B",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 10
          }
        ] as DebtItems,
        "extraMonthlyPayment": 30,
        "strategy": "snowball"
      },
      "expected": {
        "strategy": "snowball",
        "monthsToPayoff": 3,
        "totalInterest": 0,
        "totalPaid": 150,
        "startingBalance": 150,
        "payoffOrder": [
          "B",
          "A"
        ] as string[]
      }
    },
    {
      "label": "Equal balance/rate ties preserve input order",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 0
          },
          {
            "name": "B",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 0
          }
        ] as DebtItems,
        "extraMonthlyPayment": 100,
        "strategy": "avalanche"
      },
      "expected": {
        "strategy": "avalanche",
        "monthsToPayoff": 1,
        "totalInterest": 0,
        "totalPaid": 100,
        "startingBalance": 100,
        "payoffOrder": [
          "A",
          "B"
        ] as string[]
      }
    },
    {
      "label": "Names are trimmed and two debts50 retire in two25-payment months",
      "input": {
        "debts": [
          {
            "name": " A ",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 25
          },
          {
            "name": "B",
            "balance": 50,
            "annualRatePercent": 0,
            "minimumPayment": 25
          }
        ] as DebtItems,
        "extraMonthlyPayment": 0,
        "strategy": "avalanche"
      },
      "expected": {
        "strategy": "avalanche",
        "monthsToPayoff": 2,
        "totalInterest": 0,
        "totalPaid": 100,
        "startingBalance": 100,
        "payoffOrder": [
          "A",
          "B"
        ] as string[]
      }
    },
    {
      "label": "One-period1% debt100 requires101 paid",
      "input": {
        "debts": [
          {
            "name": "A",
            "balance": 100,
            "annualRatePercent": 12,
            "minimumPayment": 101
          }
        ] as DebtItems,
        "extraMonthlyPayment": 0,
        "strategy": "avalanche"
      },
      "expected": {
        "strategy": "avalanche",
        "monthsToPayoff": 1,
        "totalInterest": 1,
        "totalPaid": 101,
        "startingBalance": 100,
        "payoffOrder": [
          "A"
        ] as string[]
      }
    }
  ],
  "credit": [
    {
      "label": "Zero APR100 paid asfour25 payments",
      "input": {
        "balance": 100,
        "annualAprPercent": 0,
        "monthlyPayment": 25,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 4,
        "totalInterest": 0,
        "totalPaid": 100,
        "effectiveMonthlyPayment": 25,
        "firstMonthInterest": 0
      }
    },
    {
      "label": "Zero APR100 paid30+30+30+10; final payment capped",
      "input": {
        "balance": 100,
        "annualAprPercent": 0,
        "monthlyPayment": 30,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 4,
        "totalInterest": 0,
        "totalPaid": 100,
        "effectiveMonthlyPayment": 30,
        "firstMonthInterest": 0
      }
    },
    {
      "label": "One1% month:100+1 paid as101",
      "input": {
        "balance": 100,
        "annualAprPercent": 12,
        "monthlyPayment": 101,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 1,
        "totalInterest": 1,
        "totalPaid": 101,
        "effectiveMonthlyPayment": 101,
        "firstMonthInterest": 1
      }
    },
    {
      "label": "Two1% periods on201 with102.01 payments:interest2.01+1.01=3.02",
      "input": {
        "balance": 201,
        "annualAprPercent": 12,
        "monthlyPayment": 102.01,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 2,
        "totalInterest": 3.02,
        "totalPaid": 204.02,
        "effectiveMonthlyPayment": 102.01,
        "firstMonthInterest": 2.01
      }
    },
    {
      "label": "Base10 plus extra15 is effective25:four months at zero APR",
      "input": {
        "balance": 100,
        "annualAprPercent": 0,
        "monthlyPayment": 10,
        "extraMonthlyPayment": 15
      },
      "expected": {
        "payoffMonths": 4,
        "totalInterest": 0,
        "totalPaid": 100,
        "effectiveMonthlyPayment": 25,
        "firstMonthInterest": 0
      }
    },
    {
      "label": "Requested200 is capped at101 due after1% interest",
      "input": {
        "balance": 100,
        "annualAprPercent": 12,
        "monthlyPayment": 200,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 1,
        "totalInterest": 1,
        "totalPaid": 101,
        "effectiveMonthlyPayment": 200,
        "firstMonthInterest": 1
      }
    },
    {
      "label": "Exact zero-APR single payment100",
      "input": {
        "balance": 100,
        "annualAprPercent": 0,
        "monthlyPayment": 100,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 1,
        "totalInterest": 0,
        "totalPaid": 100,
        "effectiveMonthlyPayment": 100,
        "firstMonthInterest": 0
      }
    },
    {
      "label": "2400-month horizon accepted:zero-APR2400 withpayment1",
      "input": {
        "balance": 2400,
        "annualAprPercent": 0,
        "monthlyPayment": 1,
        "extraMonthlyPayment": 0
      },
      "expected": {
        "payoffMonths": 2400,
        "totalInterest": 0,
        "totalPaid": 2400,
        "effectiveMonthlyPayment": 1,
        "firstMonthInterest": 0
      }
    }
  ]
} as const;
