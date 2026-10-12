import { loanPaymentCalculator } from "./loan-payment";

/**
 * Public fixed-rate mortgage principal-and-interest model.
 *
 * This intentionally reuses the certified amortizing-loan calculation engine.
 * Property taxes, homeowners insurance, mortgage insurance, HOA fees and
 * closing costs are outside this core principal-and-interest calculation.
 */
export const mortgageCalculator = {
  ...loanPaymentCalculator,
  id: "finance.mortgage",
  slug: "mortgage-payment",
  title: "Mortgage Calculator",
  sources: [
    ...loanPaymentCalculator.sources,
    {
      label: "Consumer Financial Protection Bureau — Principal and interest vs total monthly mortgage payment",
      url: "https://www.consumerfinance.gov/ask-cfpb/on-a-mortgage-whats-the-difference-between-my-principal-and-interest-payment-and-my-total-monthly-payment-en-1941/"
    }
  ]
} as const;
