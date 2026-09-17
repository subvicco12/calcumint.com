import type { PublicCalculatorContent } from "../public-content";

/**
 * Editorial metadata for the expanded finance suite.
 * These entries do not make calculators public: public-content.ts still
 * requires the corresponding calculator definition to be certified.
 */
export const financePublicContent: readonly PublicCalculatorContent[] = [
  {
    slug: "loan-emi-calculator", category: "finance-investment",
    shortDescription: "Calculate loan payments, amortization, extra-payment savings and reverse affordability.",
    intro: "Model a reducing-balance loan with a deterministic monthly payment formula, inspect its amortization path and test how additional monthly payments change payoff time and interest.",
    formulaExplanation: "For a monthly rate r and n payments, payment = principal × r / (1 − (1+r)^−n). Zero-interest loans use principal / n.",
    assumptions: ["The stated annual rate is converted to a monthly rate by dividing by 12.", "Payments occur monthly and the rate remains constant for the modeled term.", "Fees, taxes, insurance and lender-specific rounding are excluded unless explicitly added by a future jurisdiction rule pack."],
    faq: [{ question: "Can CalcuMint solve the maximum loan from a payment?", answer: "Yes. The reverse affordability solver derives the principal supported by a target monthly payment, rate and term." }, { question: "Does an extra payment reduce interest?", answer: "The amortization simulation applies the additional monthly amount to the outstanding balance, which can shorten the modeled payoff term and reduce modeled interest." }],
    relatedSlugs: ["loan-payment-calculator", "fixed-term-deposit-calculator"], keywords: ["EMI calculator", "loan calculator", "amortization calculator", "loan affordability", "extra payment calculator"]
  },
  {
    slug: "fixed-term-deposit-calculator", category: "finance-investment",
    shortDescription: "Estimate maturity value and interest for a fixed term deposit.",
    intro: "Project a deposit using principal, annual interest rate, term and selected compounding frequency.",
    formulaExplanation: "Compound maturity uses A = P(1+r/m)^(m×t), where m is the selected number of compounding periods per year.",
    assumptions: ["The annual rate remains constant.", "The generic model uses the selected compounding frequency and term expressed as months/12.", "Institution- or country-specific deposit conventions require a certified jurisdiction rule pack."],
    faq: [{ question: "Is this tied to a specific bank?", answer: "No. This is a generic deterministic term-deposit model until a certified country or institution rule pack is selected." }],
    relatedSlugs: ["compound-interest-calculator", "sip-calculator"], keywords: ["fixed deposit calculator", "FD calculator", "term deposit calculator", "deposit maturity"]
  },
  {
    slug: "sip-calculator", category: "finance-investment",
    shortDescription: "Project recurring monthly investments or reverse-solve the contribution needed for a target corpus.",
    intro: "Model equal monthly contributions with an assumed annual return and choose beginning- or end-of-period contribution timing.",
    formulaExplanation: "The model applies a monthly periodic return to recurring cash flows and supports the corresponding annuity-due adjustment for beginning-of-period contributions.",
    assumptions: ["The assumed return is constant and converted to a monthly periodic rate.", "Contributions are equal each month.", "Taxes, fees and market volatility are not modeled."],
    faq: [{ question: "Can I calculate the SIP needed for a target?", answer: "Yes. The reverse solver calculates the level monthly contribution implied by the target corpus, term, assumed return and contribution timing." }],
    relatedSlugs: ["step-up-sip-calculator", "swp-calculator", "investment-growth-calculator"], keywords: ["SIP calculator", "monthly investment calculator", "target corpus calculator"]
  },
  {
    slug: "step-up-sip-calculator", category: "finance-investment",
    shortDescription: "Model monthly investments that increase annually and reverse-solve the required starting contribution.",
    intro: "Simulate a recurring investment whose monthly contribution steps up after each completed year.",
    formulaExplanation: "CalcuMint simulates monthly cash flows deterministically, applies the assumed monthly return and increases the contribution by the selected annual step-up after each 12-month block.",
    assumptions: ["Return and annual step-up rates remain constant.", "The contribution changes once after each completed 12-month period.", "Taxes, fees and market volatility are excluded."],
    faq: [{ question: "Can I solve the starting SIP for a target corpus?", answer: "Yes. The reverse solver determines the initial monthly contribution required under the selected return, annual step-up and term assumptions." }],
    relatedSlugs: ["sip-calculator", "investment-growth-calculator", "swp-calculator"], keywords: ["step up SIP calculator", "increasing SIP", "target investment calculator"]
  },
  {
    slug: "investment-growth-calculator", category: "finance-investment",
    shortDescription: "Calculate future value, present value, CAGR and inflation-adjusted real return.",
    intro: "Evaluate compound investment growth and compare nominal growth with purchasing-power-adjusted growth.",
    formulaExplanation: "Future value uses FV = PV(1+r)^t. Real return uses the exact Fisher relationship: (1+nominal)/(1+inflation) − 1.",
    assumptions: ["Nominal return and inflation are constant annual rates.", "Compounding is represented annually for this model.", "Taxes, fees and sequence-of-returns risk are excluded."],
    faq: [{ question: "Is real return just nominal return minus inflation?", answer: "No. This calculator uses the exact multiplicative relationship between nominal return and inflation." }],
    relatedSlugs: ["compound-interest-calculator", "sip-calculator", "step-up-sip-calculator"], keywords: ["future value calculator", "present value calculator", "CAGR calculator", "real return calculator", "inflation adjusted return"]
  },
  {
    slug: "swp-calculator", category: "finance-investment",
    shortDescription: "Model systematic withdrawals, corpus depletion and a sustainable level withdrawal for a selected term.",
    intro: "Simulate monthly withdrawals from an investment corpus while applying an assumed return and identify whether or when the modeled corpus is depleted.",
    formulaExplanation: "The deterministic simulation grows the remaining balance at the monthly assumed rate and applies the selected withdrawal at the beginning or end of each period. The reverse solver uses the corresponding annuity relationship.",
    assumptions: ["Return is constant and converted to a monthly periodic rate.", "Withdrawals are level monthly amounts.", "Taxes, fees, volatility and sequence-of-returns risk are not modeled, so the reverse result is a mathematical level withdrawal rather than a guarantee of real-world sustainability."],
    faq: [{ question: "Does sustainable withdrawal mean guaranteed retirement income?", answer: "No. It is the level withdrawal that mathematically amortizes the modeled corpus under the stated constant-return assumptions." }],
    relatedSlugs: ["sip-calculator", "step-up-sip-calculator", "investment-growth-calculator"], keywords: ["SWP calculator", "systematic withdrawal calculator", "retirement withdrawal calculator", "corpus depletion"]
  }
];
