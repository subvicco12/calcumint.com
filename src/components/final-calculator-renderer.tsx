import type { StructuredCalculationResult } from "@/calculators/final-framework/types";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";
import { rendererTrustSurface } from "@/calculators/final-framework/renderer-trust-surface";

export function FinalCalculatorRenderer({ result }: { result: StructuredCalculationResult }) {
  const trust = rendererTrustSurface(result);
  return (
    <section className="final-calculator-renderer" aria-live="polite">
      <div className="result-box">
        <span>{result.primaryResult.label}</span>
        <strong>{displayFinalValue(result.primaryResult.value, result.primaryResult.unit)}</strong>
      </div>
      {result.metrics?.length ? <dl>{result.metrics.map(metric => <div key={metric.id}><dt>{metric.label}</dt><dd>{displayFinalValue(metric.value, metric.unit)}</dd></div>)}</dl> : null}
      {result.composition?.length ? <div className="result-panel"><h3>Overview</h3>{result.composition.map(item => <div key={item.id}><span>{item.label}</span><strong>{displayFinalValue(item.value, item.unit)}</strong></div>)}</div> : null}
      {result.ranges?.length ? <div className="result-panel"><h3>Reference range</h3>{result.ranges.map(range => <div key={range.id}><span>{range.label}</span><strong>{range.classification ?? `${range.min ?? "—"}–${range.max ?? "—"}`}</strong></div>)}</div> : null}
      {result.series?.length ? <div className="result-panel"><h3>Trend</h3>{result.series[0].points.slice(-6).map(point => <div key={String(point.x)}><span>{String(point.x)}</span><strong>{displayFinalValue(point.y, result.series?.[0].unit)}</strong></div>)}</div> : null}
      {result.warnings?.map(warning => <p className="muted" key={warning}>{warning}</p>)}
      {trust ? <><details><summary>Methodology</summary><p>{trust.methodology}</p></details><details><summary>Sources</summary><ul>{trust.sources.map((source,index)=><li key={source.label + "-" + index}>{source.url?<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a>:source.label}</li>)}</ul></details></> : null}
    </section>
  );
}
