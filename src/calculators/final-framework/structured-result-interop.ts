import type { StructuredCalculationResult } from "./types";
import type { StructuredResultContract } from "./structured-result";
import { inspectScheduleContract } from "./schedule-contract";

/**
 * Converts the normalized Blueprint result contract to the existing renderer
 * contract while renderer migration is staged. No mathematical value is
 * recalculated here.
 */
export function toRendererResult(result: StructuredResultContract): StructuredCalculationResult {
  const metadata = result.schedule?.metadata;
  const periodKey = metadata?.period.key ?? result.schedule?.columns[0] ?? "period";
  if (metadata && result.schedule) {
    const declared = [periodKey, ...metadata.columns.map(column => column.key)];
    if (new Set(result.schedule.columns).size !== result.schedule.columns.length || declared.length !== result.schedule.columns.length || declared.some(key => !result.schedule!.columns.includes(key))) throw new Error("Schedule metadata must account for every declared column exactly once.");
    if (result.schedule.rows.some(row => !Object.hasOwn(row, periodKey))) throw new Error("Declared schedule period is missing from a row.");
  }
  const rendered: StructuredCalculationResult = {
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
      period: row[periodKey] ?? index + 1,
      values: Object.fromEntries(
        Object.entries(row).filter(([key]) => key !== periodKey)
      )
    })),
    scheduleMetadata: metadata,
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
  if (metadata) {
    const issues = inspectScheduleContract(rendered.schedule ?? [], metadata);
    if (issues.length) throw new Error(issues.join(" "));
  }
  return rendered;
}
