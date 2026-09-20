import type { PresentationDefinition } from "./types";

export const referencePresentations = {
  loanEmi: {
    id: "reference.loan-emi",
    domain: "loans-credit",
    family: "amortization-debt",
    level: "decision",
    freeVisualization: "composition",
    supportedVisualizations: ["composition", "growth-line", "comparison-bars", "sensitivity"],
    supportsSchedule: true,
    supportsGoalSolver: true,
    supportsScenarios: true,
    supportsSensitivity: true,
    journey: ["mortgage-affordability", "extra-payment", "refinance", "rent-vs-buy"]
  },
  sip: {
    id: "reference.sip",
    domain: "investing-wealth",
    family: "growth-goal",
    level: "decision",
    freeVisualization: "growth-line",
    supportedVisualizations: ["growth-line", "composition", "comparison-bars", "sensitivity"],
    supportsSchedule: true,
    supportsGoalSolver: true,
    supportsScenarios: true,
    supportsSensitivity: true,
    journey: ["step-up-sip", "investment-growth", "inflation", "retirement-corpus", "swp"]
  },
  compoundInterest: {
    id: "reference.compound-interest",
    domain: "investing-wealth",
    family: "growth-goal",
    level: "analytical",
    freeVisualization: "composition",
    supportedVisualizations: ["composition", "growth-line", "comparison-bars", "sensitivity"],
    supportsSchedule: false,
    supportsGoalSolver: true,
    supportsScenarios: true,
    supportsSensitivity: true
  },
  mortgage: {
    id: "reference.mortgage",
    domain: "real-estate",
    family: "amortization-debt",
    level: "decision",
    freeVisualization: "composition",
    supportedVisualizations: ["composition", "growth-line", "comparison-bars", "sensitivity"],
    supportsSchedule: false,
    supportsGoalSolver: true,
    supportsScenarios: true,
    supportsSensitivity: true,
    journey: ["affordability", "extra-payment", "refinance", "rent-vs-buy"]
  },
  bmi: {
    id: "reference.bmi",
    domain: "health-fitness",
    family: "range-health",
    level: "analytical",
    freeVisualization: "range-indicator",
    supportedVisualizations: ["range-indicator"],
    supportsSchedule: false,
    supportsGoalSolver: false,
    supportsScenarios: false,
    supportsSensitivity: false,
    journey: ["bmr", "calorie-needs", "ideal-weight"]
  },
  breakEven: {
    id: "reference.break-even",
    domain: "business-accounting",
    family: "business-unit-economics",
    level: "decision",
    freeVisualization: "break-even",
    supportedVisualizations: ["break-even", "comparison-bars", "sensitivity"],
    supportsSchedule: false,
    supportsGoalSolver: true,
    supportsScenarios: true,
    supportsSensitivity: true
  }
} as const satisfies Readonly<Record<string, PresentationDefinition>>;
