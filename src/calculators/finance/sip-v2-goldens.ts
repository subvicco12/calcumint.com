/** Candidate-only expectations. Independently reproduced with Python decimal
 * (200-digit precision, monthly deposit recurrence, ROUND_HALF_UP); additionally
 * checked against verification/sip-high-precision-reference.ts exact rationals.
 * Formula source: OpenStax Contemporary Mathematics §6.3 Annuities;
 * nominal annual-percent / 1200 and timing are explicit SIP contract choices.
 * These fixtures do not replace or modify version-1 certification history. */
export const sipV2Goldens = [
  { label: 'ordinary beginning', input: { monthlyContribution: 10000, annualReturnPercent: 10, termMonths: 120, contributionTiming: 'beginning' as const }, expected: { futureValue: 2065520.20, investedAmount: 1200000, estimatedGain: 865520.20 } },
  { label: 'ordinary end', input: { monthlyContribution: 5000, annualReturnPercent: 12, termMonths: 120, contributionTiming: 'end' as const }, expected: { futureValue: 1150193.45, investedAmount: 600000, estimatedGain: 550193.45 } },
  { label: 'negative', input: { monthlyContribution: 1, annualReturnPercent: -99, termMonths: 12, contributionTiming: 'beginning' as const }, expected: { futureValue: 7.16, investedAmount: 12, estimatedGain: -4.84 } },
  { label: 'maximum return', input: { monthlyContribution: 100, annualReturnPercent: 1000, termMonths: 12, contributionTiming: 'beginning' as const }, expected: { futureValue: 316970.30, investedAmount: 1200, estimatedGain: 315770.30 } },
  { label: 'maximum duration negative', input: { monthlyContribution: 100, annualReturnPercent: -99, termMonths: 1200, contributionTiming: 'end' as const }, expected: { futureValue: 1212.12, investedAmount: 120000, estimatedGain: -118787.88 } },
];
