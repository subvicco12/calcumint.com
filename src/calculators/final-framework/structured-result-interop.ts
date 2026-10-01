import type { StructuredCalculationResult } from "./types";
import type { StructuredResultContract } from "./structured-result";

/**
 * Converts the normalized Blueprint result contract to the existing renderer
 * contract while renderer migration is staged. No mathematical value is
 * recalculated here.
 */
export function toRendererResult(result: StructuredResultContract): StructuredCalculationResult {
  return {
    primaryResult: { id: result.primaryResult.key, ...result.primaryResult },
    metrics: result.metrics.map(metric => ({ id: metric.key, ...metric })),
    series: result.series.map(series => ({
      id: series.key,
      label: series.label,
      unit: series.unit,
      points: series.points
    })),
    composition: result.composition.map(item => ({ id: item.key, ...item })),
    schedule: result.schedule?.rows.map((row, index) => ({
      id: String(index + 1),
      period: row[result.schedule!.columns[0] ?? "period"] ?? index + 1,
      values: Object.fromEntries(
        Object.entries(row).filter(([key]) => key !== (result.schedule!.columns[0] ?? "period"))
      )
    })),
    ranges: result.ranges.map(range => ({ id: range.key, ...range })),
    reverseTargets: result.reverseTargets,
    scenarioVariables: result.scenarioVariables,
    sensitivityVariables: result.sensitivityVariables,
    assumptions: result.assumptions,
    warnings: result.warnings,
    methodology: result.methodology,
    sources: result.sources,
    journey: result.journey
  };
}
