"use client";
import { useState } from "react";
import type { ResultScheduleMetadata, ResultScheduleRow } from "@/calculators/final-framework/types";
import { inspectScheduleContract } from "@/calculators/final-framework/schedule-contract";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";
import "./final-schedule-table.css";

export function FinalScheduleTable({ rows, metadata }: { rows: readonly ResultScheduleRow[]; metadata: ResultScheduleMetadata }) {
  const [expanded, setExpanded] = useState(false);
  const issues = inspectScheduleContract(rows, metadata);
  if (issues.length) return <p role="alert">Detailed schedule unavailable: {issues.join(" ")}</p>;
  if (!rows.length) return null;
  const bounded = rows.length > 25;
  const visible = bounded && !expanded ? [...rows.slice(0, 24), rows[rows.length - 1]] : rows;
  const header = (column: { label: string; unit?: string }) => column.unit ? `${column.label} (${column.unit})` : column.label;
  return <details className="governed-schedule"><summary>Detailed schedule</summary>
    <p>{metadata.granularity === "checkpoints" ? "Checkpoint schedule. These sampled rows do not represent every period; do not sum them as complete totals." : "Complete schedule."}</p>
    <p aria-live="polite" aria-atomic="true">{bounded && !expanded ? `Showing the first 24 rows and final row of ${rows.length}.` : `Showing all ${rows.length} rows.`}</p>
    {bounded && <button className="button secondary" type="button" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? "Show schedule summary" : `Show all ${rows.length} rows`}</button>}
    <div className="schedule-scroll" role="region" aria-label={`${metadata.caption} data`} tabIndex={0}>
      <table className="result-table"><caption className="sr-only">{metadata.caption}</caption>
        <thead><tr><th scope="col">{header(metadata.period)}</th>{metadata.columns.map(column => <th scope="col" key={column.key}>{header(column)}</th>)}</tr></thead>
        <tbody>{visible.map(row => <tr key={row.id}><th scope="row">{displayFinalValue(row.period)}</th>{metadata.columns.map(column => <td key={column.key}>{Object.hasOwn(row.values, column.key) ? displayFinalValue(row.values[column.key]) : "—"}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </details>;
}
