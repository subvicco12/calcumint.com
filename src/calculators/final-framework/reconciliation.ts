import type { StructuredResultContract } from "./structured-result";

export type ReconciliationIssue = {
  surface: "series-terminal";
  key: string;
  expected: number;
  actual: number;
  tolerance: number;
};

export function reconcilePrimaryWithSeriesTerminal(
  result: StructuredResultContract,
  seriesKey: string,
  tolerance = 0.01
): readonly ReconciliationIssue[] {
  if (typeof result.primaryResult.value !== "number") return [];
  const series = result.series.find(item => item.key === seriesKey);
  const terminal = series?.points.at(-1)?.y;
  if (terminal === undefined) return [];
  if (Math.abs(terminal - result.primaryResult.value) <= tolerance) return [];
  return [{
    surface: "series-terminal",
    key: seriesKey,
    expected: result.primaryResult.value,
    actual: terminal,
    tolerance
  }];
}

export function assertPrimarySeriesReconciled(
  result: StructuredResultContract,
  seriesKey: string,
  tolerance = 0.01
): void {
  const issues = reconcilePrimaryWithSeriesTerminal(result, seriesKey, tolerance);
  if (issues.length) {
    const issue = issues[0];
    throw new Error(
      `Result reconciliation failed for ${issue.key}: headline ${issue.expected} != terminal ${issue.actual} within ${issue.tolerance}`
    );
  }
}
