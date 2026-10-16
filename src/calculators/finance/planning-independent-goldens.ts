// Hand-derived registered-contract vectors; source methodology and specialist approval remain UNKNOWN.
type NetWorthItems = { name: string; amount: number }[];
export const planningIndependentGoldens = {
  "roi": [
    {
      "label": "121/100 over two years: gain21, ROI21%, annual sqrt(1.21)-1=10%",
      "input": {
        "initialInvestment": 100,
        "finalValue": 121,
        "holdingMonths": 24,
        "additionalCosts": 0,
        "incomeReceived": 0
      },
      "expected": {
        "netGain": 21,
        "totalInvested": 100,
        "roiPercent": 21,
        "annualizedReturnPercent": 10
      }
    },
    {
      "label": "81/100 over two years: gain-19, ROI-19%, annual sqrt(.81)-1=-10%",
      "input": {
        "initialInvestment": 100,
        "finalValue": 81,
        "holdingMonths": 24,
        "additionalCosts": 0,
        "incomeReceived": 0
      },
      "expected": {
        "netGain": -19,
        "totalInvested": 100,
        "roiPercent": -19,
        "annualizedReturnPercent": -10
      }
    },
    {
      "label": "Zero ending value: total loss; annualized output remains null by existing contract",
      "input": {
        "initialInvestment": 100,
        "finalValue": 0,
        "holdingMonths": 12,
        "additionalCosts": 0,
        "incomeReceived": 0
      },
      "expected": {
        "netGain": -100,
        "totalInvested": 100,
        "roiPercent": -100,
        "annualizedReturnPercent": null
      }
    },
    {
      "label": "Invested120, ending144 including income12: gain24 and20%",
      "input": {
        "initialInvestment": 100,
        "finalValue": 132,
        "holdingMonths": 12,
        "additionalCosts": 20,
        "incomeReceived": 12
      },
      "expected": {
        "netGain": 24,
        "totalInvested": 120,
        "roiPercent": 20,
        "annualizedReturnPercent": 20
      }
    },
    {
      "label": "Unchanged value has zero gain and return",
      "input": {
        "initialInvestment": 100,
        "finalValue": 100,
        "holdingMonths": 12,
        "additionalCosts": 0,
        "incomeReceived": 0
      },
      "expected": {
        "netGain": 0,
        "totalInvested": 100,
        "roiPercent": 0,
        "annualizedReturnPercent": 0
      }
    },
    {
      "label": "Half-year ratio1.21 annualizes to1.21 squared minus1 =46.41%",
      "input": {
        "initialInvestment": 100,
        "finalValue": 121,
        "holdingMonths": 6,
        "additionalCosts": 0,
        "incomeReceived": 0
      },
      "expected": {
        "netGain": 21,
        "totalInvested": 100,
        "roiPercent": 21,
        "annualizedReturnPercent": 46.41
      }
    }
  ],
  "netWorth": [
    {
      "label": "Empty lists: zero totals and undefined debt/assets ratio",
      "input": {
        "assets": [] as NetWorthItems,
        "liabilities": [] as NetWorthItems
      },
      "expected": {
        "totalAssets": 0,
        "totalLiabilities": 0,
        "netWorth": 0,
        "debtToAssetPercent": null
      }
    },
    {
      "label": "Assets100 minus liabilities25 =75; ratio25%",
      "input": {
        "assets": [
          {
            "name": "asset0",
            "amount": 100
          }
        ] as NetWorthItems,
        "liabilities": [
          {
            "name": "debt0",
            "amount": 25
          }
        ] as NetWorthItems
      },
      "expected": {
        "totalAssets": 100,
        "totalLiabilities": 25,
        "netWorth": 75,
        "debtToAssetPercent": 25
      }
    },
    {
      "label": "Zero assets with liabilities25: net-25 and undefined ratio",
      "input": {
        "assets": [] as NetWorthItems,
        "liabilities": [
          {
            "name": "debt0",
            "amount": 25
          }
        ] as NetWorthItems
      },
      "expected": {
        "totalAssets": 0,
        "totalLiabilities": 25,
        "netWorth": -25,
        "debtToAssetPercent": null
      }
    },
    {
      "label": "Two assets125+75 and two debts50+50: net100 ratio50%",
      "input": {
        "assets": [
          {
            "name": "asset0",
            "amount": 125
          },
          {
            "name": "asset1",
            "amount": 75
          }
        ] as NetWorthItems,
        "liabilities": [
          {
            "name": "debt0",
            "amount": 50
          },
          {
            "name": "debt1",
            "amount": 50
          }
        ] as NetWorthItems
      },
      "expected": {
        "totalAssets": 200,
        "totalLiabilities": 100,
        "netWorth": 100,
        "debtToAssetPercent": 50
      }
    },
    {
      "label": "Equal assets and liabilities: zero net, ratio100%",
      "input": {
        "assets": [
          {
            "name": "asset0",
            "amount": 100
          }
        ] as NetWorthItems,
        "liabilities": [
          {
            "name": "debt0",
            "amount": 100
          }
        ] as NetWorthItems
      },
      "expected": {
        "totalAssets": 100,
        "totalLiabilities": 100,
        "netWorth": 0,
        "debtToAssetPercent": 100
      }
    },
    {
      "label": "Decimal totals .1+.2=.3 minus.1=.2; one third ratio rounds six places",
      "input": {
        "assets": [
          {
            "name": "asset0",
            "amount": 0.1
          },
          {
            "name": "asset1",
            "amount": 0.2
          }
        ] as NetWorthItems,
        "liabilities": [
          {
            "name": "debt0",
            "amount": 0.1
          }
        ] as NetWorthItems
      },
      "expected": {
        "totalAssets": 0.3,
        "totalLiabilities": 0.1,
        "netWorth": 0.2,
        "debtToAssetPercent": 33.333333
      }
    }
  ],
  "inflation": [
    {
      "label": "Factor1.25:100 costs125, purchasing power80, loss20%",
      "input": {
        "amount": 100,
        "annualInflationPercent": 25,
        "years": 1
      },
      "expected": {
        "futureEquivalentCost": 125,
        "futurePurchasingPower": 80,
        "cumulativeInflationPercent": 25,
        "purchasingPowerLossPercent": 20
      }
    },
    {
      "label": "Deflation factor.8:100 costs80, purchasing power125, loss-25%",
      "input": {
        "amount": 100,
        "annualInflationPercent": -20,
        "years": 1
      },
      "expected": {
        "futureEquivalentCost": 80,
        "futurePurchasingPower": 125,
        "cumulativeInflationPercent": -20,
        "purchasingPowerLossPercent": -25
      }
    },
    {
      "label": "Factor1.5 squared=2.25:900 costs2025, purchasing power400",
      "input": {
        "amount": 900,
        "annualInflationPercent": 50,
        "years": 2
      },
      "expected": {
        "futureEquivalentCost": 2025,
        "futurePurchasingPower": 400,
        "cumulativeInflationPercent": 125,
        "purchasingPowerLossPercent": 55.555556
      }
    },
    {
      "label": "Zero rate at200-year boundary preserves amount",
      "input": {
        "amount": 123.45,
        "annualInflationPercent": 0,
        "years": 200
      },
      "expected": {
        "futureEquivalentCost": 123.45,
        "futurePurchasingPower": 123.45,
        "cumulativeInflationPercent": 0,
        "purchasingPowerLossPercent": 0
      }
    },
    {
      "label": "Zero years: no modeled inflation",
      "input": {
        "amount": 100,
        "annualInflationPercent": 25,
        "years": 0
      },
      "expected": {
        "futureEquivalentCost": 100,
        "futurePurchasingPower": 100,
        "cumulativeInflationPercent": 0,
        "purchasingPowerLossPercent": 0
      }
    },
    {
      "label": "Zero amount retains rate-derived percentages",
      "input": {
        "amount": 0,
        "annualInflationPercent": 25,
        "years": 1
      },
      "expected": {
        "futureEquivalentCost": 0,
        "futurePurchasingPower": 0,
        "cumulativeInflationPercent": 25,
        "purchasingPowerLossPercent": 20
      }
    }
  ],
  "emergencyFund": [
    {
      "label": "100 times3 target300 less50 savings: gap250, five deposits50",
      "input": {
        "monthlyEssentialExpenses": 100,
        "targetMonths": 3,
        "currentEmergencySavings": 50,
        "buildMonths": 5
      },
      "expected": {
        "targetFund": 300,
        "currentSavings": 50,
        "fundingGap": 250,
        "coverageMonths": 0.5,
        "requiredMonthlySavings": 50,
        "targetReached": false
      }
    },
    {
      "label": "Exact target met; unspecified build period remains null",
      "input": {
        "monthlyEssentialExpenses": 100,
        "targetMonths": 3,
        "currentEmergencySavings": 300
      },
      "expected": {
        "targetFund": 300,
        "currentSavings": 300,
        "fundingGap": 0,
        "coverageMonths": 3,
        "requiredMonthlySavings": null,
        "targetReached": true
      }
    },
    {
      "label": "Surplus savings: gap and required contribution clamp tozero",
      "input": {
        "monthlyEssentialExpenses": 100,
        "targetMonths": 3,
        "currentEmergencySavings": 400,
        "buildMonths": 5
      },
      "expected": {
        "targetFund": 300,
        "currentSavings": 400,
        "fundingGap": 0,
        "coverageMonths": 4,
        "requiredMonthlySavings": 0,
        "targetReached": true
      }
    },
    {
      "label": "Zero expenses: zero target and undefined coverage",
      "input": {
        "monthlyEssentialExpenses": 0,
        "targetMonths": 3,
        "currentEmergencySavings": 50
      },
      "expected": {
        "targetFund": 0,
        "currentSavings": 50,
        "fundingGap": 0,
        "coverageMonths": null,
        "requiredMonthlySavings": null,
        "targetReached": true
      }
    },
    {
      "label": "One month reserve and one month build: contribution100",
      "input": {
        "monthlyEssentialExpenses": 100,
        "targetMonths": 1,
        "currentEmergencySavings": 0,
        "buildMonths": 1
      },
      "expected": {
        "targetFund": 100,
        "currentSavings": 0,
        "fundingGap": 100,
        "coverageMonths": 0,
        "requiredMonthlySavings": 100,
        "targetReached": false
      }
    },
    {
      "label": "User-selected1.5 months: target150; three deposits50",
      "input": {
        "monthlyEssentialExpenses": 100,
        "targetMonths": 1.5,
        "currentEmergencySavings": 0,
        "buildMonths": 3
      },
      "expected": {
        "targetFund": 150,
        "currentSavings": 0,
        "fundingGap": 150,
        "coverageMonths": 0,
        "requiredMonthlySavings": 50,
        "targetReached": false
      }
    }
  ],
  "rateConversion": [
    {
      "label": "Nominal20% semiannual:1.1 squared minus1=21%",
      "input": {
        "mode": "nominal-to-effective",
        "compoundsPerYear": 2,
        "annualNominalPercent": 20
      },
      "expected": {
        "annualNominalPercent": 20,
        "annualEffectivePercent": 21,
        "compoundsPerYear": 2
      }
    },
    {
      "label": "Effective21%: twice(sqrt1.21 minus1)=20%",
      "input": {
        "mode": "effective-to-nominal",
        "compoundsPerYear": 2,
        "annualEffectivePercent": 21
      },
      "expected": {
        "annualNominalPercent": 20,
        "annualEffectivePercent": 21,
        "compoundsPerYear": 2
      }
    },
    {
      "label": "Nominal-20% semiannual:.9 squared minus1=-19%",
      "input": {
        "mode": "nominal-to-effective",
        "compoundsPerYear": 2,
        "annualNominalPercent": -20
      },
      "expected": {
        "annualNominalPercent": -20,
        "annualEffectivePercent": -19,
        "compoundsPerYear": 2
      }
    },
    {
      "label": "Effective-19%:twice(sqrt.81 minus1)=-20%",
      "input": {
        "mode": "effective-to-nominal",
        "compoundsPerYear": 2,
        "annualEffectivePercent": -19
      },
      "expected": {
        "annualNominalPercent": -20,
        "annualEffectivePercent": -19,
        "compoundsPerYear": 2
      }
    },
    {
      "label": "Zero nominal at100000 frequency ceiling stayszero",
      "input": {
        "mode": "nominal-to-effective",
        "compoundsPerYear": 100000,
        "annualNominalPercent": 0
      },
      "expected": {
        "annualNominalPercent": 0,
        "annualEffectivePercent": 0,
        "compoundsPerYear": 100000
      }
    },
    {
      "label": "Annual compounding has identical nominal/effective12.5%",
      "input": {
        "mode": "nominal-to-effective",
        "compoundsPerYear": 1,
        "annualNominalPercent": 12.5
      },
      "expected": {
        "annualNominalPercent": 12.5,
        "annualEffectivePercent": 12.5,
        "compoundsPerYear": 1
      }
    }
  ],
  "savingsGoal": [
    {
      "label": "Zero return: target300 divided bythree deposits gives100",
      "input": {
        "currentSavings": 0,
        "targetAmount": 300,
        "annualReturnPercent": 0,
        "months": 3
      },
      "expected": {
        "futureValue": 300,
        "gapToTarget": 0,
        "requiredMonthlyContribution": 100,
        "monthlyContributionUsed": 100,
        "targetReached": true
      }
    },
    {
      "label": "Current100 plus two deposits50 reaches200, short100",
      "input": {
        "currentSavings": 100,
        "targetAmount": 300,
        "annualReturnPercent": 0,
        "months": 2,
        "monthlyContribution": 50
      },
      "expected": {
        "futureValue": 200,
        "gapToTarget": 100,
        "requiredMonthlyContribution": 100,
        "monthlyContributionUsed": 50,
        "targetReached": false
      }
    },
    {
      "label": "Current300 exceeds target200: required depositzero",
      "input": {
        "currentSavings": 300,
        "targetAmount": 200,
        "annualReturnPercent": 0,
        "months": 1
      },
      "expected": {
        "futureValue": 300,
        "gapToTarget": 0,
        "requiredMonthlyContribution": 0,
        "monthlyContributionUsed": 0,
        "targetReached": true
      }
    },
    {
      "label": "Current100 times1.1 squared reaches121 without deposits",
      "input": {
        "currentSavings": 100,
        "targetAmount": 121,
        "annualReturnPercent": 120,
        "months": 2,
        "monthlyContribution": 0
      },
      "expected": {
        "futureValue": 121,
        "gapToTarget": 0,
        "requiredMonthlyContribution": 0,
        "monthlyContributionUsed": 0,
        "targetReached": true
      }
    },
    {
      "label": "Two end deposits100 at1% monthly reach201",
      "input": {
        "currentSavings": 0,
        "targetAmount": 201,
        "annualReturnPercent": 12,
        "months": 2,
        "monthlyContribution": 100
      },
      "expected": {
        "futureValue": 201,
        "gapToTarget": 0,
        "requiredMonthlyContribution": 100,
        "monthlyContributionUsed": 100,
        "targetReached": true
      }
    },
    {
      "label": "Current100 declines by1% monthly to99; no deposit needed",
      "input": {
        "currentSavings": 100,
        "targetAmount": 99,
        "annualReturnPercent": -12,
        "months": 1,
        "monthlyContribution": 0
      },
      "expected": {
        "futureValue": 99,
        "gapToTarget": 0,
        "requiredMonthlyContribution": 0,
        "monthlyContributionUsed": 0,
        "targetReached": true
      }
    }
  ]
} as const;
