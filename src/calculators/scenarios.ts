export type Scenario<TInput> = {
  id: string;
  label: string;
  input: TInput;
};

export type ScenarioResult<TInput, TOutput> = Scenario<TInput> & {
  output: TOutput;
};

export type ScenarioMetric<TOutput> = {
  id: string;
  value: (output: TOutput) => number;
  preference?: "lower" | "higher";
};

export type ScenarioMetricComparison = {
  metricId: string;
  values: Readonly<Record<string, number>>;
  preferredScenarioId?: string;
};

export type ScenarioComparison<TInput, TOutput> = {
  scenarios: readonly ScenarioResult<TInput, TOutput>[];
  metrics: readonly ScenarioMetricComparison[];
};

function finite(value: number, label: string): number {
  if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
  return value;
}

/** Runs deterministic scenarios and compares only explicitly supplied numeric metrics. */
export function compareScenarios<TInput, TOutput>(
  scenarios: readonly Scenario<TInput>[],
  calculate: (input: TInput) => TOutput,
  metrics: readonly ScenarioMetric<TOutput>[],
): ScenarioComparison<TInput, TOutput> {
  if (scenarios.length < 2) throw new Error("Scenario comparison requires at least two scenarios");
  if (new Set(scenarios.map((scenario) => scenario.id)).size !== scenarios.length) throw new Error("Scenario ids must be unique");
  if (metrics.length < 1) throw new Error("Scenario comparison requires at least one metric");
  if (new Set(metrics.map((metric) => metric.id)).size !== metrics.length) throw new Error("Scenario metric ids must be unique");

  const results = scenarios.map((scenario) => ({ ...scenario, output: calculate(scenario.input) }));
  const comparisons = metrics.map((metric) => {
    const values: Record<string, number> = {};
    for (const scenario of results) values[scenario.id] = finite(metric.value(scenario.output), `Metric ${metric.id}`);
    let preferredScenarioId: string | undefined;
    if (metric.preference) {
      preferredScenarioId = results[0].id;
      for (const scenario of results.slice(1)) {
        const current = values[preferredScenarioId];
        const candidate = values[scenario.id];
        if ((metric.preference === "lower" && candidate < current) || (metric.preference === "higher" && candidate > current)) preferredScenarioId = scenario.id;
      }
    }
    return { metricId: metric.id, values: Object.freeze(values), preferredScenarioId };
  });

  return { scenarios: results, metrics: comparisons };
}
