"use client";

import { useMemo, useState } from "react";
import { runCustomCalculator, type CustomCalculatorDefinition } from "@/lib/builder/definition";

export function CustomCalculatorPreview({ definition }: { definition: CustomCalculatorDefinition }) {
  const initial = Object.fromEntries(definition.fields.map((field) => [field.key, String(field.defaultValue ?? field.min ?? 0)]));
  const [values, setValues] = useState<Record<string, string>>(initial);
  const evaluated = useMemo(() => {
    try {
      return { result: runCustomCalculator(definition, values).output, error: "" };
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : "Calculation failed" };
    }
  }, [definition, values]);

  return (
    <div className="builder-preview" style={{ "--builder-accent": definition.branding.accentColor } as React.CSSProperties}>
      {(definition.branding.companyName || definition.branding.logoUrl) && (
        <div className="builder-brand">
          {definition.branding.logoUrl && <img src={definition.branding.logoUrl} alt="" className="builder-logo" />}
          {definition.branding.companyName && <strong>{definition.branding.companyName}</strong>}
        </div>
      )}
      <div className="field-grid">
        {definition.fields.map((field) => (
          <label className="field" key={field.key}>
            <span>{field.label}</span>
            <input
              type="number"
              inputMode="decimal"
              min={field.min ?? undefined}
              max={field.max ?? undefined}
              step={field.step ?? "any"}
              value={values[field.key] ?? ""}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
            />
            {field.helpText && <small className="muted">{field.helpText}</small>}
          </label>
        ))}
      </div>
      {evaluated.error ? <div className="notice error-notice">{evaluated.error}</div> : (
        <>
          <div className="builder-results">
            {definition.outputs.map((output) => (
              <div className="result-box" key={output.key}>
                <span>{output.label}</span>
                <strong>{formatValue(evaluated.result?.[output.key], output.format, output.decimals)}</strong>
              </div>
            ))}
          </div>
          {definition.charts.map((chart) => <ResultChart key={`${chart.title}-${chart.outputKeys.join("-")}`} title={chart.title} outputKeys={chart.outputKeys} result={evaluated.result ?? {}} definition={definition} />)}
        </>
      )}
    </div>
  );
}

function ResultChart({ title, outputKeys, result, definition }: { title: string; outputKeys: string[]; result: Record<string, number | boolean>; definition: CustomCalculatorDefinition }) {
  const values = outputKeys.map((key) => ({
    key,
    label: definition.outputs.find((output) => output.key === key)?.label ?? key,
    value: typeof result[key] === "number" ? result[key] as number : 0
  }));
  const max = Math.max(...values.map((item) => Math.abs(item.value)), 1);
  return (
    <div className="builder-chart" aria-label={title}>
      <strong>{title}</strong>
      {values.map((item) => (
        <div className="builder-chart-row" key={item.key}>
          <span>{item.label}</span>
          <div className="builder-chart-track"><div className="builder-chart-bar" style={{ width: `${Math.max(2, Math.min(100, Math.abs(item.value) / max * 100))}%` }} /></div>
          <code>{item.value.toLocaleString()}</code>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: number | boolean | undefined, format: "number" | "currency" | "percentage", decimals: number): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (format === "percentage") return `${value.toFixed(decimals)}%`;
  if (format === "currency") return value.toLocaleString(undefined, { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
