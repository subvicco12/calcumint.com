"use client";
import type {ResultCompositionItem,ResultMetric,ResultRange} from '@/calculators/final-framework/types';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';
import {AnalysisPagination,useAnalysisPage} from './analysis-pagination';
import './final-analysis-panels.css';
/** Visual domain only: no totals, percentages, financial thresholds or unit conversion. */
function domain(values:Iterable<number>){let min=0,max=0;for(const value of values){min=Math.min(min,value);max=Math.max(max,value);}return {min,max:min===max?1:max};}
/** Receives composition data already validated by the shared result inspector. */
export function ResultCompositionPanel({items}:{items:readonly ResultCompositionItem[]}){
 const page=useAnalysisPage(items);const scale=domain(items.map(item=>item.value));
 return <section className="result-panel final-analysis" data-visualization="composition" aria-label="Overview"><div className="result-panel-heading"><h3>Overview</h3><span>Raw component values</span></div>
  <AnalysisPagination {...page} name="overview"/>
  <div className="series-bars">{page.visible.map((item,index)=><div key={page.start+index}><span>{item.label}</span><meter {...scale} value={item.value} aria-label={item.label} aria-valuetext={displayFinalValue(item.value,item.unit)}/><strong>{displayFinalValue(item.value,item.unit)}</strong></div>)}</div>
  <details open className="analysis-details"><summary>Overview data</summary><div className="analysis-data" role="region" aria-label="Overview data" tabIndex={0}><table className="result-table"><caption className="sr-only">Overview component data</caption><thead><tr><th scope="col">Component</th><th scope="col">Value</th></tr></thead><tbody>{page.visible.map((item,index)=><tr key={page.start+index}><th scope="row">{item.label}</th><td>{displayFinalValue(item.value,item.unit)}</td></tr>)}</tbody></table></div></details>
 </section>;
}
/** Declared reference bounds/classification are displayed verbatim; no classification is calculated. */
export function ResultRangePanel({ranges,primary}:{ranges:readonly ResultRange[];primary:ResultMetric}){
 const numeric=typeof primary.value==='number';
 return <section className="result-panel final-analysis" data-visualization="range-indicator" aria-label="Reference range"><div className="result-panel-heading"><h3>Reference range</h3><span>Declared reference data</span></div>
  {numeric?<div className="series-bars">{ranges.map((range,index)=>{const values=[primary.value as number,...(range.min===undefined?[]:[range.min]),...(range.max===undefined?[]:[range.max])];return <div key={index}><span>{range.label}</span><meter {...domain(values)} value={primary.value as number} aria-label={`${range.label}: ${primary.label}`} aria-valuetext={displayFinalValue(primary.value,primary.unit)}/><strong>{displayFinalValue(primary.value,primary.unit)}</strong></div>;})}</div>:<p>Numeric marker unavailable for this textual result.</p>}
  <details open className="analysis-details"><summary>Reference data</summary><div className="analysis-data" role="region" aria-label="Reference range data" tabIndex={0}><table className="result-table"><caption className="sr-only">Declared reference range data</caption><thead><tr><th scope="col">Reference</th><th scope="col">Lower bound</th><th scope="col">Upper bound</th><th scope="col">Classification</th></tr></thead><tbody>{ranges.map((range,index)=><tr key={index}><th scope="row">{range.label}</th><td>{range.min===undefined?'—':String(range.min)}</td><td>{range.max===undefined?'—':String(range.max)}</td><td>{range.classification??'—'}</td></tr>)}</tbody></table></div></details>
 </section>;
}
