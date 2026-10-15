"use client";
import type {ResultSeries} from '@/calculators/final-framework/types';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';
import {AnalysisPagination,useAnalysisPage} from './analysis-pagination';
import './final-analysis-panels.css';
/** Same validated raw series drives the signed chart and complete paged data table. */
export function ResultSeriesPanel({series}:{series:ResultSeries}){
 const page=useAnalysisPage(series.points);let min=0,max=0;
 for(const point of series.points){min=Math.min(min,point.y);max=Math.max(max,point.y);}if(min===max)max=1;
 return <section className="result-panel final-analysis" data-visualization="growth-line" aria-label="Trend">
  <div className="result-panel-heading"><h3>Trend</h3><span>Accessible data view</span></div>
  <AnalysisPagination {...page} name="trend"/>
  <div className="series-bars">{page.visible.map((point,index)=><div key={page.start+index}><span>{String(point.x)}</span><meter min={min} max={max} value={point.y} aria-label={`${series.label} at ${String(point.x)}`} aria-valuetext={displayFinalValue(point.y,series.unit)}/><strong>{displayFinalValue(point.y,series.unit)}</strong></div>)}</div>
  <details open className="analysis-details"><summary>Trend data</summary><div className="analysis-data" role="region" aria-label={`${series.label} trend data`} tabIndex={0}>
   <table className="result-table"><caption className="sr-only">Trend data: {series.label}</caption><thead><tr><th scope="col">Position</th><th scope="col">{series.unit?`${series.label} (${series.unit})`:series.label}</th></tr></thead><tbody>{page.visible.map((point,index)=><tr key={page.start+index}><th scope="row">{String(point.x)}</th><td>{displayFinalValue(point.y,series.unit)}</td></tr>)}</tbody></table>
  </div></details>
 </section>;
}
