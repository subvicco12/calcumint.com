// Exact public-content assumptions for these six finance interfaces.
// Kept narrow so client rendering does not import the entire public catalog.
export const financeReadinessAssumptions: Readonly<Record<string, readonly string[]>> = {
  "fixed-term-deposit-calculator": [
    "The annual rate remains constant.",
    "The generic model uses the selected compounding frequency and term expressed as months/12.",
    "Institution- or country-specific deposit conventions require a certified jurisdiction rule pack."
  ],
  "recurring-deposit-calculator": [
    "The annual rate remains constant and is converted to a monthly periodic rate.",
    "The monthly deposit remains fixed throughout the modeled term.",
    "This is a generic mathematical model; bank, product and country-specific RD compounding, accrual, tax and rounding conventions require a certified rule pack."
  ],
  "step-up-sip-calculator": [
    "Return and annual step-up rates remain constant.",
    "The contribution changes once after each completed 12-month period.",
    "Taxes, fees and market volatility are excluded."
  ],
  "swp-calculator": [
    "Return is constant and converted to a monthly periodic rate.",
    "Withdrawals are level monthly amounts.",
    "Taxes, fees, volatility and sequence-of-returns risk are not modeled, so the reverse result is a mathematical level withdrawal rather than a guarantee of real-world sustainability."
  ],
  "investment-growth-calculator": [
    "Nominal return and inflation are constant annual rates.",
    "Compounding is represented annually for this model.",
    "Taxes, fees and sequence-of-returns risk are excluded."
  ],
  "simple-interest-calculator": [
    "Interest does not compound.",
    "The annual rate is constant for the modeled period.",
    "Taxes, fees, day-count conventions and institution-specific rules are not included."
  ]
};
