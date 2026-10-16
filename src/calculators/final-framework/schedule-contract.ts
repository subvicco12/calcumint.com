import type { ResultScheduleMetadata, ResultScheduleRow } from "./types";

export function inspectScheduleContract(rows: readonly ResultScheduleRow[], metadata: ResultScheduleMetadata): readonly string[] {
  const issues: string[] = [];
  const columns = metadata.columns;
  const keys = columns.map(column => column.key);
  const validText = (value: string) => value.trim().length > 0;
  if (!validText(metadata.caption) || !validText(metadata.period.key) || !validText(metadata.period.label)) issues.push("Schedule caption and period identity are required.");
  if (!columns.length || columns.some(column => !validText(column.key) || !validText(column.label))) issues.push("Schedule column keys and labels are required.");
  if (new Set(keys).size !== keys.length || keys.includes(metadata.period.key)) issues.push("Schedule columns must have unique keys distinct from the period.");
  if (![metadata.period, ...columns].every(column => column.unit === undefined || validText(column.unit))) issues.push("Declared schedule units must be nonempty.");
  if (metadata.granularity !== "complete" && metadata.granularity !== "checkpoints") issues.push("Schedule granularity must be declared.");
  const ids = new Set<string>();
  for (const row of rows) {
    if (ids.has(row.id)) issues.push(`Duplicate schedule row identity: ${row.id}.`);
    ids.add(row.id);
    if (typeof row.period === "number" ? !Number.isFinite(row.period) : !validText(row.period)) issues.push(`Invalid schedule period in row ${row.id}.`);
    for (const [key, value] of Object.entries(row.values)) {
      if (!keys.includes(key)) issues.push(`Undeclared schedule column: ${key}.`);
      if (typeof value === "number" && !Number.isFinite(value)) issues.push(`Nonfinite schedule value: ${key} in row ${row.id}.`);
    }
  }
  for (const check of metadata.terminal ?? []) {
    if (!Number.isFinite(check.expected) || !Number.isFinite(check.tolerance) || check.tolerance < 0) {
      issues.push(`Invalid terminal reconciliation policy: ${check.column}.`);
      continue;
    }
    if (check.column !== metadata.period.key && !keys.includes(check.column)) {
      issues.push(`Undeclared terminal reconciliation column: ${check.column}.`);
      continue;
    }
    const last = rows.at(-1);
    const actual = check.column === metadata.period.key ? last?.period : last && Object.hasOwn(last.values, check.column) ? last.values[check.column] : undefined;
    if (typeof actual !== "number" || !Number.isFinite(actual) || Math.abs(actual - check.expected) > check.tolerance) issues.push(`Schedule terminal ${check.column} does not reconcile with ${check.expected} within ${check.tolerance}.`);
  }
  return issues;
}
