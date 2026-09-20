export type PlanTier = "free" | "pro" | "business";

export type CalculatorDomain =
  | "finance-banking" | "loans-credit" | "investing-wealth" | "retirement"
  | "tax-payroll" | "personal-finance" | "business-accounting" | "saas-startups"
  | "ecommerce-marketing" | "real-estate" | "construction" | "math"
  | "advanced-math-graphing" | "statistics-probability" | "physics" | "chemistry"
  | "engineering" | "technology-computing" | "health-fitness" | "biology-life-science"
  | "date-time" | "conversion" | "automotive-ev" | "travel" | "food-cooking"
  | "energy-environment" | "sports" | "education" | "everyday-life" | "professional";

export type PresentationFamily =
  | "amortization-debt" | "growth-goal" | "business-unit-economics"
  | "range-health" | "distribution-statistics" | "math-solver"
  | "technical-engineering" | "utility-conversion" | "cost-comparison" | "general-analytical";

export type PresentationLevel = "essential" | "analytical" | "decision";

export type ResultMetric = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  emphasis?: "primary" | "secondary";
};

export type ResultSeriesPoint = {
  x: number | string;
  y: number;
  label?: string;
};

export type ResultSeries = {
  id: string;
  label: string;
  points: readonly ResultSeriesPoint[];
  unit?: string;
};

export type ResultCompositionItem = {
  id: string;
  label: string;
  value: number;
  unit?: string;
};

export type ResultScheduleRow = {
  id: string;
  period: number | string;
  values: Readonly<Record<string, number | string>>;
};

export type ResultRange = {
  id: string;
  label: string;
  min?: number;
  max?: number;
  classification?: string;
};

export type StructuredCalculationResult = {
  primaryResult: ResultMetric;
  metrics?: readonly ResultMetric[];
  series?: readonly ResultSeries[];
  composition?: readonly ResultCompositionItem[];
  schedule?: readonly ResultScheduleRow[];
  ranges?: readonly ResultRange[];
  reverseTargets?: readonly string[];
  scenarioVariables?: readonly string[];
  sensitivityVariables?: readonly string[];
  assumptions?: readonly string[];
  warnings?: readonly string[];
  methodology?: string;
  sources?: readonly { label: string; url?: string }[];
  journey?: readonly string[];
};

export type VisualizationKind =
  | "growth-line" | "composition" | "stacked-period" | "comparison-bars"
  | "range-indicator" | "break-even" | "distribution" | "progress"
  | "waterfall" | "sensitivity";

export type PresentationDefinition = {
  id: string;
  domain: CalculatorDomain;
  family: PresentationFamily;
  level: PresentationLevel;
  freeVisualization?: VisualizationKind;
  supportedVisualizations: readonly VisualizationKind[];
  supportsSchedule?: boolean;
  supportsGoalSolver?: boolean;
  supportsScenarios?: boolean;
  supportsSensitivity?: boolean;
  journey?: readonly string[];
};
