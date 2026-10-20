// Literal existing-contract arithmetic; financial methodology approval remains UNKNOWN.
export const debtAggregateIndependentGoldens = {
  "payment": [
    {
      "label": "Zero interest:1000 divided by10 =100",
      "input": {
        "principal": 1000,
        "annualRatePercent": 0,
        "termMonths": 10
      },
      "expected": {
        "monthlyPayment": 100,
        "totalPayment": 1000,
        "totalInterest": 0
      }
    },
    {
      "label": "Rounded payment33.33 times3 =99.99; existing aggregate interest-0.01",
      "input": {
        "principal": 100,
        "annualRatePercent": 0,
        "termMonths": 3
      },
      "expected": {
        "monthlyPayment": 33.33,
        "totalPayment": 99.99,
        "totalInterest": -0.01
      }
    },
    {
      "label": "One period:1000 plus1% interest =1010",
      "input": {
        "principal": 1000,
        "annualRatePercent": 12,
        "termMonths": 1
      },
      "expected": {
        "monthlyPayment": 1010,
        "totalPayment": 1010,
        "totalInterest": 10
      }
    },
    {
      "label": "Two periods:principal201, rate1%, payment102.01, totals204.02",
      "input": {
        "principal": 201,
        "annualRatePercent": 12,
        "termMonths": 2
      },
      "expected": {
        "monthlyPayment": 102.01,
        "totalPayment": 204.02,
        "totalInterest": 3.02
      }
    },
    {
      "label": "Two periods at10% monthly:12100/21 =576.190476... rounded576.19",
      "input": {
        "principal": 1000,
        "annualRatePercent": 120,
        "termMonths": 2
      },
      "expected": {
        "monthlyPayment": 576.19,
        "totalPayment": 1152.38,
        "totalInterest": 152.38
      }
    },
    {
      "label": "Zero rate at1200-month ceiling:1200 divided by1200 =1",
      "input": {
        "principal": 1200,
        "annualRatePercent": 0,
        "termMonths": 1200
      },
      "expected": {
        "monthlyPayment": 1,
        "totalPayment": 1200,
        "totalInterest": 0
      }
    },
    {
      "label": "Small monetary principal:.12 divided by12 =.01",
      "input": {
        "principal": 0.12,
        "annualRatePercent": 0,
        "termMonths": 12
      },
      "expected": {
        "monthlyPayment": 0.01,
        "totalPayment": 0.12,
        "totalInterest": 0
      }
    },
    {
      "label": "Rate ceiling1000% for one month:100 times(1+5/6) rounds183.33",
      "input": {
        "principal": 100,
        "annualRatePercent": 1000,
        "termMonths": 1
      },
      "expected": {
        "monthlyPayment": 183.33,
        "totalPayment": 183.33,
        "totalInterest": 83.33
      }
    }
  ],
  "comparison": [
    {
      "label": "Equal zero-rate three-period loans retain unrounded total100",
      "input": {
        "loanA": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 3,
          "upfrontCosts": 0
        },
        "loanB": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 3,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 33.33,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "loanB": {
          "monthlyPayment": 33.33,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "monthlyPaymentDifference": 0,
        "totalCostDifference": 0,
        "lowerMonthlyPayment": "equal",
        "lowerTotalCost": "equal"
      }
    },
    {
      "label": "Zero-rate ten-period A versus one-period1% B",
      "input": {
        "loanA": {
          "principal": 1000,
          "annualRatePercent": 0,
          "termMonths": 10,
          "upfrontCosts": 0
        },
        "loanB": {
          "principal": 1000,
          "annualRatePercent": 12,
          "termMonths": 1,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 100,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 1000
        },
        "loanB": {
          "monthlyPayment": 1010,
          "totalInterest": 10,
          "upfrontCosts": 0,
          "totalCost": 1010
        },
        "monthlyPaymentDifference": -910,
        "totalCostDifference": -10,
        "lowerMonthlyPayment": "A",
        "lowerTotalCost": "A"
      }
    },
    {
      "label": "Two-period1% A versus zero-rate B at principal201",
      "input": {
        "loanA": {
          "principal": 201,
          "annualRatePercent": 12,
          "termMonths": 2,
          "upfrontCosts": 0
        },
        "loanB": {
          "principal": 201,
          "annualRatePercent": 0,
          "termMonths": 2,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 102.01,
          "totalInterest": 3.02,
          "upfrontCosts": 0,
          "totalCost": 204.02
        },
        "loanB": {
          "monthlyPayment": 100.5,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 201
        },
        "monthlyPaymentDifference": 1.51,
        "totalCostDifference": 3.02,
        "lowerMonthlyPayment": "B",
        "lowerTotalCost": "B"
      }
    },
    {
      "label": "Fees tradeoff:A lower payment50 but total120 versus B payment100,total100",
      "input": {
        "loanA": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 2,
          "upfrontCosts": 20
        },
        "loanB": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 1,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 50,
          "totalInterest": 0,
          "upfrontCosts": 20,
          "totalCost": 120
        },
        "loanB": {
          "monthlyPayment": 100,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "monthlyPaymentDifference": -50,
        "totalCostDifference": 20,
        "lowerMonthlyPayment": "A",
        "lowerTotalCost": "B"
      }
    },
    {
      "label": "Swapped fee tradeoff reverses signed differences and winner labels",
      "input": {
        "loanA": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 1,
          "upfrontCosts": 0
        },
        "loanB": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 2,
          "upfrontCosts": 20
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 100,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "loanB": {
          "monthlyPayment": 50,
          "totalInterest": 0,
          "upfrontCosts": 20,
          "totalCost": 120
        },
        "monthlyPaymentDifference": 50,
        "totalCostDifference": -20,
        "lowerMonthlyPayment": "B",
        "lowerTotalCost": "A"
      }
    },
    {
      "label": "Different principals100 and200 at zero rate overtwo periods",
      "input": {
        "loanA": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 2,
          "upfrontCosts": 0
        },
        "loanB": {
          "principal": 200,
          "annualRatePercent": 0,
          "termMonths": 2,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 50,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "loanB": {
          "monthlyPayment": 100,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 200
        },
        "monthlyPaymentDifference": -50,
        "totalCostDifference": -100,
        "lowerMonthlyPayment": "A",
        "lowerTotalCost": "A"
      }
    },
    {
      "label": "Unrounded10% monthly two-period interest15.238095... rounds15.24",
      "input": {
        "loanA": {
          "principal": 100,
          "annualRatePercent": 120,
          "termMonths": 2,
          "upfrontCosts": 0
        },
        "loanB": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 2,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 57.62,
          "totalInterest": 15.24,
          "upfrontCosts": 0,
          "totalCost": 115.24
        },
        "loanB": {
          "monthlyPayment": 50,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "monthlyPaymentDifference": 7.62,
        "totalCostDifference": 15.24,
        "lowerMonthlyPayment": "B",
        "lowerTotalCost": "B"
      }
    },
    {
      "label": "Fee.004 rounds tozero; equal comparison is based on displayed totals",
      "input": {
        "loanA": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 3,
          "upfrontCosts": 0.004
        },
        "loanB": {
          "principal": 100,
          "annualRatePercent": 0,
          "termMonths": 3,
          "upfrontCosts": 0
        }
      },
      "expected": {
        "loanA": {
          "monthlyPayment": 33.33,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "loanB": {
          "monthlyPayment": 33.33,
          "totalInterest": 0,
          "upfrontCosts": 0,
          "totalCost": 100
        },
        "monthlyPaymentDifference": 0,
        "totalCostDifference": 0,
        "lowerMonthlyPayment": "equal",
        "lowerTotalCost": "equal"
      }
    }
  ],
  "affordability": [
    {
      "label": "User target20% of1000 gives200 payment; zero-rate ten-month principal2000",
      "input": {
        "grossMonthlyIncome": 1000,
        "existingMonthlyDebt": 0,
        "targetDtiPercent": 20,
        "annualRatePercent": 0,
        "termMonths": 10,
        "downPayment": 0
      },
      "expected": {
        "currentDtiPercent": 0,
        "maximumTotalMonthlyDebt": 200,
        "availableMonthlyLoanPayment": 200,
        "maximumLoanPrincipal": 2000,
        "maximumPurchasePrice": 2000,
        "modeledPaymentAtMaximumPrincipal": 200
      }
    },
    {
      "label": "Debt50 leaves150; principal1500 plus down payment100 =1600",
      "input": {
        "grossMonthlyIncome": 1000,
        "existingMonthlyDebt": 50,
        "targetDtiPercent": 20,
        "annualRatePercent": 0,
        "termMonths": 10,
        "downPayment": 100
      },
      "expected": {
        "currentDtiPercent": 5,
        "maximumTotalMonthlyDebt": 200,
        "availableMonthlyLoanPayment": 150,
        "maximumLoanPrincipal": 1500,
        "maximumPurchasePrice": 1600,
        "modeledPaymentAtMaximumPrincipal": 150
      }
    },
    {
      "label": "Debt exactly equals user target:zero available payment and principal",
      "input": {
        "grossMonthlyIncome": 1000,
        "existingMonthlyDebt": 200,
        "targetDtiPercent": 20,
        "annualRatePercent": 0,
        "termMonths": 10,
        "downPayment": 0
      },
      "expected": {
        "currentDtiPercent": 20,
        "maximumTotalMonthlyDebt": 200,
        "availableMonthlyLoanPayment": 0,
        "maximumLoanPrincipal": 0,
        "maximumPurchasePrice": 0,
        "modeledPaymentAtMaximumPrincipal": 0
      }
    },
    {
      "label": "Debt exceeds target:clamp capacity tozero; purchase output retains down payment100",
      "input": {
        "grossMonthlyIncome": 1000,
        "existingMonthlyDebt": 250,
        "targetDtiPercent": 20,
        "annualRatePercent": 0,
        "termMonths": 10,
        "downPayment": 100
      },
      "expected": {
        "currentDtiPercent": 25,
        "maximumTotalMonthlyDebt": 200,
        "availableMonthlyLoanPayment": 0,
        "maximumLoanPrincipal": 0,
        "maximumPurchasePrice": 100,
        "modeledPaymentAtMaximumPrincipal": 0
      }
    },
    {
      "label": "Inverse1% two-period annuity:principal2010000/10201 rounds197.04",
      "input": {
        "grossMonthlyIncome": 1000,
        "existingMonthlyDebt": 0,
        "targetDtiPercent": 10,
        "annualRatePercent": 12,
        "termMonths": 2,
        "downPayment": 0
      },
      "expected": {
        "currentDtiPercent": 0,
        "maximumTotalMonthlyDebt": 100,
        "availableMonthlyLoanPayment": 100,
        "maximumLoanPrincipal": 197.04,
        "maximumPurchasePrice": 197.04,
        "modeledPaymentAtMaximumPrincipal": 100
      }
    },
    {
      "label": "One-period10%:principal100/1.1 rounds90.91; modeled payment100",
      "input": {
        "grossMonthlyIncome": 1000,
        "existingMonthlyDebt": 0,
        "targetDtiPercent": 10,
        "annualRatePercent": 120,
        "termMonths": 1,
        "downPayment": 0
      },
      "expected": {
        "currentDtiPercent": 0,
        "maximumTotalMonthlyDebt": 100,
        "availableMonthlyLoanPayment": 100,
        "maximumLoanPrincipal": 90.91,
        "maximumPurchasePrice": 90.91,
        "modeledPaymentAtMaximumPrincipal": 100
      }
    },
    {
      "label": "User DTI100% and1200-month zero-rate boundary:principal120000",
      "input": {
        "grossMonthlyIncome": 100,
        "existingMonthlyDebt": 0,
        "targetDtiPercent": 100,
        "annualRatePercent": 0,
        "termMonths": 1200,
        "downPayment": 0
      },
      "expected": {
        "currentDtiPercent": 0,
        "maximumTotalMonthlyDebt": 100,
        "availableMonthlyLoanPayment": 100,
        "maximumLoanPrincipal": 120000,
        "maximumPurchasePrice": 120000,
        "modeledPaymentAtMaximumPrincipal": 100
      }
    },
    {
      "label": "Decimal budget:333 times10% less3.33=29.97; three-month principal89.91",
      "input": {
        "grossMonthlyIncome": 333,
        "existingMonthlyDebt": 3.33,
        "targetDtiPercent": 10,
        "annualRatePercent": 0,
        "termMonths": 3,
        "downPayment": 0
      },
      "expected": {
        "currentDtiPercent": 1,
        "maximumTotalMonthlyDebt": 33.3,
        "availableMonthlyLoanPayment": 29.97,
        "maximumLoanPrincipal": 89.91,
        "maximumPurchasePrice": 89.91,
        "modeledPaymentAtMaximumPrincipal": 29.97
      }
    }
  ]
} as const;
