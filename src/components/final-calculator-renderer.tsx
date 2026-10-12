import { inspectStructuredResult } from "@/calculators/final-framework/result-inspection";
import {ResultCompositionPanel,ResultRangePanel} from "./result-overview-panels";
import {ResultSeriesPanel} from "./result-series-panel";
import { ResultDataError } from "./result-data-error";
import type { PresentationDefinition, StructuredCalculationResult } from "@/calculators/final-framework/types";
import type { FinalPlan } from "@/calculators/final-framework/product-capabilities";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";
import { rendererTrustSurface } from "@/calculators/final-framework/renderer-trust-surface";
import { FinalScheduleTable } from "./final-schedule-table";
import { resolveAnalysisSurface } from "@/calculators/final-framework/analysis-surface-policy";
export function FinalCalculatorRenderer({ result: rawResult, plan="free", presentation }: { result: StructuredCalculationResult; plan?: FinalPlan; presentation?: PresentationDefinition }) {
  const inspection=inspectStructuredResult(rawResult);
  if(!inspection.coreValid)return <section className="final-calculator-renderer" aria-label="Calculation result"><ResultDataError/></section>;
  const result=inspection.renderable!;
  const trust=rendererTrustSurface(result);
  const schedulePolicy=result.schedule?.length&&presentation?resolveAnalysisSurface(plan,presentation,"schedule"):null;
  const schedule=result.scheduleMetadata&&schedulePolicy?.canExecute?null:schedulePolicy;
  // One schema for every legacy row prevents insertion order from relabeling values.
  const scheduleColumns=schedule?.canExecute?Array.from(new Set(result.schedule!.flatMap(row=>Object.keys(row.values)))):[];
  const freeVisualization=presentation?.freeVisualization;
  return <section className="final-calculator-renderer">
    {inspection.invalidSurfaces.map(surface=><ResultDataError key={surface} surface={surface} issues={surface==="schedule"?inspection.scheduleIssues:undefined}/>)}
    <div className="result-box" role="status" aria-live="polite" aria-atomic="true"><span>{result.primaryResult.label}</span><strong>{displayFinalValue(result.primaryResult.value,result.primaryResult.unit)}</strong></div>
    {result.metrics?.length?<dl>{result.metrics.map(metric=><div key={metric.id}><dt>{metric.label}</dt><dd>{displayFinalValue(metric.value,metric.unit)}</dd></div>)}</dl>:null}
    {result.composition?.length&&(!freeVisualization||freeVisualization==="composition")?<ResultCompositionPanel items={result.composition}/>:null}
    {result.ranges?.length&&(!freeVisualization||freeVisualization==="range-indicator")?<ResultRangePanel ranges={result.ranges} primary={result.primaryResult}/>:null}
    {result.series?.length&&(!freeVisualization||freeVisualization==="growth-line")?<ResultSeriesPanel series={result.series[0]}/>:null}
    {freeVisualization==="break-even"?<div className="result-panel" data-visualization="break-even"><h3>Break-even</h3><p>{displayFinalValue(result.primaryResult.value,result.primaryResult.unit)} {result.primaryResult.label}</p></div>:null}
    {schedulePolicy?.canExecute&&result.scheduleMetadata?<FinalScheduleTable rows={result.schedule!} metadata={result.scheduleMetadata}/>:null}
    {schedule?.canExecute?<details><summary>Detailed schedule</summary><div className="schedule-scroll" role="region" aria-label="Detailed calculation schedule data" tabIndex={0}><table className="result-table"><caption className="sr-only">Detailed calculation schedule</caption><thead><tr><th scope="col">Period</th>{scheduleColumns.map(k=><th scope="col" key={k}>{k}</th>)}</tr></thead><tbody>{result.schedule!.map(row=><tr key={row.id}><th scope="row">{row.period}</th>{scheduleColumns.map(k=><td key={k}>{Object.hasOwn(row.values,k)?displayFinalValue(row.values[k]):"—"}</td>)}</tr>)}</tbody></table></div></details>:schedule?.showUpgradePrompt?<div className="locked-feature"><span aria-hidden="true">🔒</span><strong>Detailed schedule</strong><small>Full period-by-period schedule is included with Pro.</small></div>:null}
    {result.warnings?.map(warning=><p className="muted" key={warning}>{warning}</p>)}
    {trust?<><details><summary>Methodology</summary><p>{trust.methodology}</p></details><details><summary>Sources</summary><ul>{trust.sources.map((source,index)=><li key={source.label+"-"+index}>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>:source.label}</li>)}</ul></details></>:null}
  </section>;
}
