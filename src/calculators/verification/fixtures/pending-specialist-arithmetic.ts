/**
 * Independent engineering evidence only. Not certification goldenTests.
 * Mortgage: existing registered fixed-period aggregate formula and CFPB sources.
 * BMI: existing registered WHO source and kg / (cm/100)^2 formula.
 * Clinical applicability, classifications, period schedules and final-payment
 * rules require specialist decisions and are deliberately not expectations here.
 */
export const mortgageArithmeticVectors = [
  { label: "zero-rate five-year integral payments", input: { principal: 60000, annualRatePercent: 0, termMonths: 60 }, expected: { monthlyPayment: 1000, totalPayment: 60000, totalInterest: 0 }, derivation: "60000 / 60 = 1000; 60 × 1000 = 60000" },
  { label: "maximum supported term with exact cent payments", input: { principal: 12, annualRatePercent: 0, termMonths: 1200 }, expected: { monthlyPayment: 0.01, totalPayment: 12, totalInterest: 0 }, derivation: "12 / 1200 = 1/100; 1200 × 1/100 = 12" },
  { label: "single-period one-percent interest", input: { principal: 200, annualRatePercent: 12, termMonths: 1 }, expected: { monthlyPayment: 202, totalPayment: 202, totalInterest: 2 }, derivation: "one period: 200 × 101/100 = 202" },
  { label: "single-period ten-percent interest", input: { principal: 150, annualRatePercent: 120, termMonths: 1 }, expected: { monthlyPayment: 165, totalPayment: 165, totalInterest: 15 }, derivation: "one period: 150 × 11/10 = 165" },
  { label: "two periods with exact rational repayment", input: { principal: 210, annualRatePercent: 120, termMonths: 2 }, expected: { monthlyPayment: 121, totalPayment: 242, totalInterest: 32 }, derivation: "210 × (1/10) × (121/100)/(21/100) = 121" },
  { label: "two periods at one percent with exact cents", input: { principal: 201, annualRatePercent: 12, termMonths: 2 }, expected: { monthlyPayment: 102.01, totalPayment: 204.02, totalInterest: 3.02 }, derivation: "201 × (1/100) × (10201/10000)/(201/10000) = 10201/100" },
  { label: "three periods with exact rational repayment", input: { principal: 331, annualRatePercent: 120, termMonths: 3 }, expected: { monthlyPayment: 133.1, totalPayment: 399.3, totalInterest: 68.3 }, derivation: "331 × (1/10) × (1331/1000)/(331/1000) = 1331/10" },
  { label: "two periods at fifty percent", input: { principal: 1500, annualRatePercent: 600, termMonths: 2 }, expected: { monthlyPayment: 1350, totalPayment: 2700, totalInterest: 1200 }, derivation: "1500 × (1/2) × (9/4)/(5/4) = 1350" },
] as const;

export const bmiArithmeticVectors = [
  { label: "metric conversion at two metres", input: { weightKg: 72, heightCm: 200 }, expectedBmi: 18, exactRatio: [18, 1] },
  { label: "one decimal tie below reference cutoffs", input: { weightKg: 72.2, heightCm: 200 }, expectedBmi: 18.1, exactRatio: [361, 20] },
  { label: "rounding near first cutoff without classification approval", input: { weightKg: 73.8, heightCm: 200 }, expectedBmi: 18.5, exactRatio: [369, 20] },
  { label: "rounding near second cutoff without classification approval", input: { weightKg: 99.8, heightCm: 200 }, expectedBmi: 25, exactRatio: [499, 20] },
  { label: "rounding near third cutoff without classification approval", input: { weightKg: 119.8, heightCm: 200 }, expectedBmi: 30, exactRatio: [599, 20] },
  { label: "exact square metre conversion", input: { weightKg: 30, heightCm: 100 }, expectedBmi: 30, exactRatio: [30, 1] },
  { label: "non-square decimal conversion", input: { weightKg: 80, heightCm: 160 }, expectedBmi: 31.3, exactRatio: [125, 4] },
  { label: "maximum schema weight and height", input: { weightKg: 1000, heightCm: 300 }, expectedBmi: 111.1, exactRatio: [1000, 9] },
  { label: "maximum height with exact arithmetic", input: { weightKg: 90, heightCm: 300 }, expectedBmi: 10, exactRatio: [10, 1] },
  { label: "small positive metric input is arithmetic not population guidance", input: { weightKg: 0.1, heightCm: 100 }, expectedBmi: 0.1, exactRatio: [1, 10] },
] as const;
