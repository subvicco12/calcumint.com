/** Additional engineering vectors, independently derived from the registered
 * monthly-rate/annuity contract. Negative modeled return is supported by its
 * existing schema; no investment forecast or specialist approval is inferred.
 * These complement (rather than replace/rebind) existing SIP golden records.
 */
export const sipInverseIndependentVectors = [
  { label: "two end deposits with a five-percent monthly loss", annualReturnPercent:-60,termMonths:2,timing:"end",target:1170,monthly:600,
    expected:{futureValue:1170,investedAmount:1200,estimatedGain:-30},derivation:"600 × (19/20 + 1) = 1170; inverse 1170 / (39/20) = 600" },
  { label: "two beginning deposits with a five-percent monthly loss",annualReturnPercent:-60,termMonths:2,timing:"beginning",target:1111.5,monthly:600,
    expected:{futureValue:1111.5,investedAmount:1200,estimatedGain:-88.5},derivation:"600 × ((19/20)^2 + 19/20) = 2223/2; inverse / (741/400) = 600" },
  { label: "three end deposits with a five-percent monthly loss",annualReturnPercent:-60,termMonths:3,timing:"end",target:1141,monthly:400,
    expected:{futureValue:1141,investedAmount:1200,estimatedGain:-59},derivation:"400 × (1 + 19/20 + 361/400) = 1141" },
  { label: "three beginning deposits with a five-percent monthly loss",annualReturnPercent:-60,termMonths:3,timing:"beginning",target:1083.95,monthly:400,
    expected:{futureValue:1083.95,investedAmount:1200,estimatedGain:-116.05},derivation:"400 × (19/20 + 361/400 + 6859/8000) = 21679/20" },
] as const;
