"use client";
import type { StructuredCalculationResult } from "@/calculators/final-framework/types";
import type { CalculatorCapability } from "@/calculators/final-framework/entitlements";

function maxPositive(values:readonly number[]){return Math.max(...values.map(v=>Math.max(v,0)),1)}
function display(value:number|string,unit?:string){
  const rendered=typeof value==="number"?value.toLocaleString(undefined,{maximumFractionDigits:2}):value;
  return unit?rendered+" "+unit:rendered;
}

export function FinalResultPresentation({result}:{result:StructuredCalculationResult}){
  const metrics=[result.primaryResult,...(result.metrics??[])];
  const locked:readonly {capability:CalculatorCapability;title:string;copy:string}[]=[
    {capability:"advancedVisualization",title:"Advanced charts",copy:"Explore the result across time and assumptions."},
    {capability:"scenarioComparison",title:"Scenario comparison",copy:"Compare multiple assumptions side by side."},
    {capability:"sensitivityAnalysis",title:"Sensitivity analysis",copy:"See which assumptions change the outcome most."},
    {capability:"goalSolver",title:"Goal Solver",copy:"Solve backwards from the outcome you want."}
  ];
  return <section className="final-result" aria-label="Calculation result">
    <div className="result-hero" aria-live="polite">
      <span>{result.primaryResult.label}</span>
      <strong>{display(result.primaryResult.value,result.primaryResult.unit)}</strong>
    </div>
    {metrics.length>1&&<div className="metric-grid">{metrics.slice(1,5).map(metric=><div className="metric-card" key={metric.id}><span>{metric.label}</span><strong>{display(metric.value,metric.unit)}</strong></div>)}</div>}
    {result.composition&&result.composition.length>0&&<div className="result-panel"><div className="result-panel-heading"><h3>Overview</h3><span>Included with Free</span></div><div className="composition-list">{result.composition.map(item=><div key={item.id}><div><span>{item.label}</span><strong>{display(item.value,item.unit)}</strong></div><progress max={Math.max(...result.composition!.map(x=>Math.max(x.value,0)),1)} value={Math.max(item.value,0)} aria-label={item.label}/></div>)}</div></div>}
    {result.ranges&&result.ranges.length>0&&<div className="result-panel"><div className="result-panel-heading"><h3>Reference range</h3><span>Included with Free</span></div>{result.ranges.map(range=>{const value=typeof result.primaryResult.value==="number"?result.primaryResult.value:0;const ceiling=Math.max(range.max??value,value,1)*1.25;return <div className="range-indicator" key={range.id}><progress max={ceiling} value={Math.max(value,0)} aria-label={range.label}/><div><span>{range.min??"—"}–{range.max??"—"}</span><strong>{range.classification??range.label}</strong></div></div>})}</div>}
    {result.series&&result.series.length>0&&<div className="result-panel"><div className="result-panel-heading"><h3>Trend</h3><span>Included with Free</span></div><div className="mini-trend" role="img" aria-label="Calculation trend summary">{result.series[0].points.slice(-6).map(point=><div key={String(point.x)}><span>{String(point.x)}</span><strong>{display(point.y,result.series![0].unit)}</strong></div>)}</div></div>}
    {result.schedule&&result.schedule.length>0&&<details className="result-methodology"><summary>Detailed schedule</summary><div className="schedule-scroll"><table className="result-table"><thead><tr><th>Period</th>{Object.keys(result.schedule[0].values).map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>{result.schedule.map(row=><tr key={row.id}><td>{row.period}</td>{Object.entries(row.values).map(([k,v])=><td key={k}>{display(v)}</td>)}</tr>)}</tbody></table></div></details>}
    {result.series&&result.series.length>0&&<div className="result-panel"><div className="result-panel-heading"><h3>Visual scale</h3><span>Accessible data view</span></div><div className="series-bars">{result.series[0].points.slice(-12).map(point=><div key={String(point.x)}><span>{String(point.x)}</span><progress max={maxPositive(result.series![0].points.map(p=>p.y))} value={Math.max(point.y,0)} aria-label={point.label??String(point.x)}/></div>)}</div></div>}
    {result.warnings?.map(warning=><p className="result-warning" key={warning}>{warning}</p>)}
    <div className="pro-analysis"><div className="result-panel-heading"><div><span className="eyebrow">CalcuMint Pro</span><h3>Advanced Analysis</h3></div><a className="text-link" href="/pricing">Compare plans</a></div><div className="locked-feature-grid">{locked.map(item=><div className="locked-feature" key={item.capability}><span aria-hidden="true">🔒</span><strong>{item.title}</strong><small>{item.copy}</small></div>)}</div></div>
    {result.methodology&&<details className="result-methodology"><summary>Result methodology</summary><p>{result.methodology}</p></details>}
  </section>
}
