"use client";
import { inspectStructuredResult } from "@/calculators/final-framework/result-inspection";
import {ResultCompositionPanel,ResultRangePanel} from "./result-overview-panels";
import {ResultSeriesPanel} from "./result-series-panel";
import { ResultDataError } from "./result-data-error";
import type { StructuredCalculationResult } from "@/calculators/final-framework/types";
import { hasCalculatorCapability, type CalculatorCapability } from "@/calculators/final-framework/entitlements";
import type { PlanTier } from "@/calculators/final-framework/types";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";

const display = displayFinalValue;

export function FinalResultPresentation({result:rawResult,plan="free"}:{result:StructuredCalculationResult;plan?:PlanTier}){
  const inspection=inspectStructuredResult(rawResult);
  if(!inspection.coreValid)return <section className="final-result" aria-label="Calculation result"><ResultDataError/></section>;
  const result=inspection.renderable!;
  const metrics=[result.primaryResult,...(result.metrics??[])];
  const secondaryMetrics=metrics.slice(1);
  const visibleMetrics=secondaryMetrics.slice(0,4);
  const additionalMetrics=secondaryMetrics.slice(4);
  const locked:readonly {capability:CalculatorCapability;title:string;copy:string}[]=[
    {capability:"advancedVisualization",title:"Advanced charts",copy:"Explore the result across time and assumptions."},
    {capability:"scenarioComparison",title:"Scenario comparison",copy:"Compare multiple assumptions side by side."},
    {capability:"sensitivityAnalysis",title:"Sensitivity analysis",copy:"See which assumptions change the outcome most."},
    {capability:"goalSolver",title:"Goal Solver",copy:"Solve backwards from the outcome you want."}
  ];
  return <section className="final-result" aria-label="Calculation result">
    {inspection.invalidSurfaces.map(surface=><ResultDataError key={surface} surface={surface} issues={surface==="schedule"?inspection.scheduleIssues:undefined}/>)}
    <div className="result-hero" role="status" aria-live="polite" aria-atomic="true">
      <span>{result.primaryResult.label}</span>
      <strong>{display(result.primaryResult.value,result.primaryResult.unit)}</strong>
    </div>
    {visibleMetrics.length>0&&<div className="metric-grid">{visibleMetrics.map(metric=><div className="metric-card" key={metric.id}><span>{metric.label}</span><strong>{display(metric.value,metric.unit)}</strong></div>)}</div>}
    {additionalMetrics.length>0&&<div className="metric-grid">{additionalMetrics.map(metric=><div className="metric-card" key={metric.id}><span>{metric.label}</span><strong>{display(metric.value,metric.unit)}</strong></div>)}</div>}
    {result.composition&&result.composition.length>0?<ResultCompositionPanel items={result.composition}/>:null}
    {result.ranges&&result.ranges.length>0?<ResultRangePanel ranges={result.ranges} primary={result.primaryResult}/>:null}
    {result.series&&result.series.length>0&&<ResultSeriesPanel series={result.series[0]}/>}
    {result.schedule&&result.schedule.length>0&&(hasCalculatorCapability(plan,"detailedSchedule")?<details className="result-methodology"><summary>Detailed schedule</summary><div className="schedule-scroll" role="region" aria-label="Detailed calculation schedule data" tabIndex={0}><table className="result-table"><caption className="sr-only">Detailed calculation schedule</caption><thead><tr><th scope="col">Period</th>{Object.keys(result.schedule[0].values).map(k=><th scope="col" key={k}>{k}</th>)}</tr></thead><tbody>{result.schedule.map(row=><tr key={row.id}><th scope="row">{row.period}</th>{Object.entries(row.values).map(([k,v])=><td key={k}>{display(v)}</td>)}</tr>)}</tbody></table></div></details>:<div className="locked-feature"><span aria-hidden="true">🔒</span><strong>Detailed schedule</strong><small>Full period-by-period schedule is included with Pro.</small></div>)}

    {result.warnings?.map(warning=><p className="result-warning" key={warning}>{warning}</p>)}
    <div className="pro-analysis"><div className="result-panel-heading"><div><span className="eyebrow">CalcuMint Pro</span><h3>Advanced Analysis</h3></div><a className="text-link" href="/pricing">Compare plans</a></div><div className="locked-feature-grid">{locked.filter(item=>!hasCalculatorCapability(plan,item.capability)).map(item=><div className="locked-feature" key={item.capability}><span aria-hidden="true">🔒</span><strong>{item.title}</strong><small>{item.copy}</small></div>)}</div></div>
    {result.methodology&&<details className="result-methodology"><summary>Result methodology</summary><p>{result.methodology}</p></details>}
    {result.sources&&result.sources.length>0&&<details className="result-methodology"><summary>Sources</summary><ul>{result.sources.map((source,index)=><li key={`${source.label}-${index}`}>{source.url?<a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>:source.label}</li>)}</ul></details>}
  </section>
}
