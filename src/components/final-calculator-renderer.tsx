import type { PresentationDefinition, StructuredCalculationResult } from "@/calculators/final-framework/types";
import type { FinalPlan } from "@/calculators/final-framework/product-capabilities";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";
import { rendererTrustSurface } from "@/calculators/final-framework/renderer-trust-surface";
import { resolveAnalysisSurface } from "@/calculators/final-framework/analysis-surface-policy";
export function FinalCalculatorRenderer({ result, plan="free", presentation }: { result: StructuredCalculationResult; plan?: FinalPlan; presentation?: PresentationDefinition }) {
  const trust=rendererTrustSurface(result);
  const schedule=result.schedule?.length&&presentation?resolveAnalysisSurface(plan,presentation,"schedule"):null;
  const freeVisualization=presentation?.freeVisualization;
  return <section className="final-calculator-renderer">
    <div className="result-box" role="status" aria-live="polite" aria-atomic="true"><span>{result.primaryResult.label}</span><strong>{displayFinalValue(result.primaryResult.value,result.primaryResult.unit)}</strong></div>
    {result.metrics?.length?<dl>{result.metrics.map(metric=><div key={metric.id}><dt>{metric.label}</dt><dd>{displayFinalValue(metric.value,metric.unit)}</dd></div>)}</dl>:null}
    {result.composition?.length&&(!freeVisualization||freeVisualization==="composition")?<div className="result-panel" data-visualization="composition"><h3>Overview</h3>{result.composition.map(item=><div key={item.id}><span>{item.label}</span><strong>{displayFinalValue(item.value,item.unit)}</strong></div>)}</div>:null}
    {result.ranges?.length&&(!freeVisualization||freeVisualization==="range-indicator")?<div className="result-panel" data-visualization="range-indicator"><h3>Reference range</h3>{result.ranges.map(range=><div key={range.id}><span>{range.label}</span><strong>{range.classification??`${range.min??"—"}–${range.max??"—"}`}</strong></div>)}</div>:null}
    {result.series?.length&&(!freeVisualization||freeVisualization==="growth-line")?<div className="result-panel" data-visualization="growth-line"><h3>Trend</h3>{result.series[0].points.slice(-6).map(point=><div key={String(point.x)}><span>{String(point.x)}</span><strong>{displayFinalValue(point.y,result.series?.[0].unit)}</strong></div>)}</div>:null}
    {freeVisualization==="break-even"?<div className="result-panel" data-visualization="break-even"><h3>Break-even</h3><p>{displayFinalValue(result.primaryResult.value,result.primaryResult.unit)} {result.primaryResult.label}</p></div>:null}
    {schedule?.canExecute?<details><summary>Detailed schedule</summary><div className="schedule-scroll"><table className="result-table"><caption className="sr-only">Detailed calculation schedule</caption><thead><tr><th>Period</th>{Object.keys(result.schedule![0].values).map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>{result.schedule!.map(row=><tr key={row.id}><td>{row.period}</td>{Object.entries(row.values).map(([k,v])=><td key={k}>{displayFinalValue(v)}</td>)}</tr>)}</tbody></table></div></details>:schedule?.showUpgradePrompt?<div className="locked-feature"><span aria-hidden="true">🔒</span><strong>Detailed schedule</strong><small>Full period-by-period schedule is included with Pro.</small></div>:null}
    {result.warnings?.map(warning=><p className="muted" key={warning}>{warning}</p>)}
    {trust?<><details><summary>Methodology</summary><p>{trust.methodology}</p></details><details><summary>Sources</summary><ul>{trust.sources.map((source,index)=><li key={source.label+"-"+index}>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>:source.label}</li>)}</ul></details></>:null}
  </section>;
}