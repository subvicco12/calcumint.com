"use client";
import {useMemo,useId} from 'react';
import {createScenarioReport,scenarioNumber} from '@/lib/scenario-report';
import type {CapturedScenario} from '@/lib/scenario-set';
import {AnalysisPagination,useAnalysisPage} from './analysis-pagination';

function ReportChart({chart}:{chart:ReturnType<typeof createScenarioReport>['charts'][number]}) {
 const id=useId(),max=Math.max(...chart.points.map(point=>Math.abs(point.value)));
 return <figure className="scenario-report-chart"><svg role="img" aria-label={`${chart.title} scenario comparison${chart.unit===undefined?'':` (${chart.unit})`}`} aria-describedby={id} viewBox={`0 0 360 ${chart.points.length*40+30}`}>
 <line x1="180" x2="180" y1="5" y2={chart.points.length*40} stroke="currentColor"/>
 {chart.points.map((point,index)=>{const offset=max===0?0:point.value/max*120;return <g key={point.label}><text x="4" y={index*40+24}>{point.label}</text><rect x={Math.min(180,180+offset)} y={index*40+10} width={Math.abs(offset)} height="16" fill="currentColor"/><text x="4" y={index*40+42} fontSize="10">{scenarioNumber(point.value)}</text></g>;})}</svg><figcaption id={id}>{chart.title}{chart.unit===undefined?'':` (${chart.unit})`}. Signed values relative to zero; normalized bar lengths can hide tiny differences. Exact values and differences are in the table.</figcaption></figure>;
}
export function CalculatorScenarioReport({rows}:{rows:readonly CapturedScenario[]}) {
 const result=useMemo(()=>{try{return {report:createScenarioReport(rows),error:false};}catch{return {report:null,error:true};}},[rows]);
 const metrics=result.report?.metrics??[],page=useAnalysisPage(metrics);
 if(result.error)return <p role="alert">Comparison report unavailable. Earlier captures remain unchanged; inspect the complete snapshots.</p>;
 return <section aria-label="Captured scenario comparison report"><h3>A/B/C comparison report</h3><p>Differences subtract canonical decimal captured values from baseline A, in the original units. No engine re-evaluation or unit conversion. Values retain raw precision; JSON represents signed zero as zero.</p>
 {!metrics.length?<p>No numeric output fields are available for differences or charts.</p>:<><AnalysisPagination {...page} name="scenario report"/><div role="region" aria-label="Scenario difference table" className="scenario-scroll" tabIndex={0}><table><caption>Output differences from baseline A</caption><thead><tr><th scope="col">Engine output</th>{rows.map(row=><th scope="col" key={row.slot}>{row.slot}{row.slot==='A'?' (baseline)':''}: value / difference</th>)}</tr></thead><tbody>{page.visible.map(metric=><tr key={metric.field}><th scope="row">{metric.label}{metric.unit===undefined?'':` (${metric.unit})`}<small>Raw field: {metric.field}</small></th>{metric.cells.map(cell=><td key={cell.slot}>{cell.value===null?'Unavailable':scenarioNumber(cell.value)} / {cell.difference===null?'Unavailable':scenarioNumber(cell.difference)}<small>{cell.label??'Raw field'} · Unit: {cell.unit??'Not supplied'}</small>{cell.unavailable&&<small>{cell.unavailable}</small>}</td>)}</tr>)}</tbody></table></div></>}
 {result.report&&page.visible.map(metric=>{const chart=result.report!.charts.find(chart=>chart.field===metric.field);return chart?<ReportChart key={metric.field} chart={chart}/>:null;})}
 {result.report?.charts.length===0&&<p>No comparable chart is available. Charts require at least two numeric captures with matching explicit labels and units; unavailable values remain in the snapshots and table.</p>}</section>;
}
