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
    <div className="builder-preview">
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
        <div className="builder-results">
          {definition.outputs.map((output) => (
            <div className="result-box" key={output.key}>
              <span>{output.label}</span>
              <strong>{formatValue(evaluated.result?.[output.key], output.format, output.decimals)}</strong>
            </div>
          ))}
        </div>
      )}
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
