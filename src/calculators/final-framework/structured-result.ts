export type StructuredResultMetric = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
};

export type StructuredResultSeries = {
  key: string;
  label: string;
  points: readonly { x: number | string; y: number }[];
  unit?: string;
};

export type StructuredResultComposition = {
  key: string;
  label: string;
  value: number;
  unit?: string;
};

export type StructuredResultSchedule = {
  columns: readonly string[];
  rows: readonly Readonly<Record<string, number | string>>[];
};

export type StructuredResultRange = {
  key: string;
  label: string;
  value?: number;
  min?: number;
  max?: number;
  classification?: string;
};

export type StructuredResultContract = {
  primaryResult: StructuredResultMetric;
  metrics: readonly StructuredResultMetric[];
  series: readonly StructuredResultSeries[];
  composition: readonly StructuredResultComposition[];
  schedule?: StructuredResultSchedule;
  ranges: readonly StructuredResultRange[];
  reverseTargets: readonly string[];
  scenarioVariables: readonly string[];
  sensitivityVariables: readonly string[];
  assumptions: readonly string[];
  warnings: readonly string[];
  methodology: string;
  sources: readonly { label: string; url?: string }[];
  journey: readonly string[];
};

export function createStructuredResult(
  input: Pick<StructuredResultContract, "primaryResult"> &
    Partial<Omit<StructuredResultContract, "primaryResult">>
): StructuredResultContract {
  return {
    metrics: [],
    series: [],
    composition: [],
    ranges: [],
    reverseTargets: [],
    scenarioVariables: [],
    sensitivityVariables: [],
    assumptions: [],
    warnings: [],
    methodology: "",
    sources: [],
    journey: [],
    ...input
  };
}
