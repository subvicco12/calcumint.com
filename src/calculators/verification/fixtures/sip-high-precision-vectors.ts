export const sipHighPrecisionVectors = [
  ...[1e-12, -1e-12, 1e-10, -1e-10, 0, -99, 1000, 10].flatMap(annual =>
    [1, 2, 1200].flatMap(months => ['end', 'beginning'].map(timing => ({
      monthly: 10000, annual, months, timing: timing as 'end' | 'beginning',
      label: `${annual}/${months}/${timing}`,
    })))),
  ...[0.005, 0.004999999999999999, 0.005000000000000001, 9007199254740991, 9007199254740992, 1e100, 1e300].map(monthly => ({
    monthly, annual: 0, months: 1, timing: 'end' as const, label: `rounding/integer/${monthly}`,
  })),
] as const;
