import type { CalculatorDefinition, CalculatorSource } from "../types";

type AnyCalculator = CalculatorDefinition<unknown, unknown>;

const borrowingSource: CalculatorSource = {
  label: "Consumer Financial Protection Bureau — How does paying down a mortgage work?",
  url: "https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/",
  note: "Official consumer-finance reference for fixed-rate loan payments, principal, interest and amortization."
};

const investingSource: CalculatorSource = {
  label: "U.S. SEC Investor.gov — Financial planning tools",
  url: "https://www.investor.gov/free-financial-planning-tools",
  note: "Official investor-education reference for compound-interest and savings-goal calculations."
};

const inflationSource: CalculatorSource = {
  label: "U.S. Bureau of Labor Statistics — Purchasing power and constant dollars",
  url: "https://www.bls.gov/cpi/factsheets/purchasing-power-constant-dollars.htm",
  note: "Official reference for inflation and purchasing-power concepts."
};

const emergencySavingsSource: CalculatorSource = {
  label: "Consumer Financial Protection Bureau — An essential guide to building an emergency fund",
  url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
  note: "Official consumer-finance reference for emergency-savings planning."
};

/**
 * Explicit release allowlist. Finance implementations stay draft in their source modules
 * until they are deliberately admitted here after tests/certification review.
 * This prevents a newly registered finance calculator from becoming public accidentally.
 */
const certifiedFinanceSlugs = new Set([
  "loan-emi-calculator",
  "loan-refinance-calculator",
  "loan-prepayment-calculator",
  "loan-comparison-calculator",
  "loan-affordability-calculator",
  "debt-payoff-calculator",
  "credit-card-payoff-calculator",
  "compound-interest-calculator",
  "fixed-term-deposit-calculator",
  "recurring-deposit-calculator",
  "sip-calculator",
  "step-up-sip-calculator",
  "investment-growth-calculator",
  "swp-calculator",
  "effective-interest-rate-calculator",
  "savings-goal-calculator",
  "roi-calculator",
  "net-worth-calculator",
  "inflation-calculator",
  "simple-interest-calculator",
  "emergency-fund-calculator"
]);

function officialSourceFor(definition: AnyCalculator): readonly CalculatorSource[] {
  if (definition.officialSources?.length) return definition.officialSources;
  if (definition.sources?.length) return definition.sources;
  if (definition.slug === "inflation-calculator") return [inflationSource];
  if (definition.slug === "emergency-fund-calculator") return [emergencySavingsSource];
  if (definition.category === "loans-mortgages") return [borrowingSource];
  return [investingSource];
}

export function applyFinanceReleaseCertification(definition: AnyCalculator): AnyCalculator {
  if (!certifiedFinanceSlugs.has(definition.slug)) return definition;
  return {
    ...definition,
    reviewStatus: "certified",
    officialSources: officialSourceFor(definition)
  };
}

export const financeReleaseSlugs = certifiedFinanceSlugs;
