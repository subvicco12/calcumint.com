import type { StructuredCalculationResult } from "@/calculators/final-framework/types";

export function FinalCalculatorRenderer({ result }: { result: StructuredCalculationResult }) {
  return (
    <section className="final-calculator-renderer" aria-live="polite">
      <div className="result-box">
        <span>{result.primaryResult.label}</span>
        <strong>{String(result.primaryResult.value)}{result.primaryResult.unit ? ` ${result.primaryResult.unit}` : ""}</strong>
      </div>
      {result.metrics?.length ? <dl>{result.metrics.map(metric => <div key={metric.id}><dt>{metric.label}</dt><dd>{String(metric.value)}{metric.unit ? ` ${metric.unit}` : ""}</dd></div>)}</dl> : null}
      {result.warnings?.map(warning => <p className="muted" key={warning}>{warning}</p>)}
      {result.methodology ? <details><summary>Methodology</summary><p>{result.methodology}</p></details> : null}
    </section>
  );
}
