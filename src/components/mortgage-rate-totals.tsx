"use client";
import type { MortgageRateAnalysis } from '@/calculators/final-framework/mortgage-rate-analysis';
import { displayFinalValue } from '@/calculators/final-framework/renderer-display';
import { resolveAnalysisSurface } from '@/calculators/final-framework/analysis-surface-policy';
import { referencePresentations } from '@/calculators/final-framework/reference-presentations';
import type { PlanTier } from '@/calculators/final-framework/types';

export function MortgageRateTotals({analysis,plan}:{analysis:MortgageRateAnalysis;plan:PlanTier}){
 if(!resolveAnalysisSurface(plan,referencePresentations.mortgage,'scenarios')?.canExecute)return null;
 const unavailable=[...new Map([...analysis.scenarios,...analysis.sensitivity].filter(point=>point.state==='unavailable').map(point=>[point.input.annualRatePercent,point])).values()];
 return <section className="result-panel final-analysis" aria-label="Mortgage aggregate comparison totals">
  <p>Each rate comparison evaluates the same principal and term independently. These are aggregate principal-and-interest results, not a payment schedule or total ownership costs.</p>
  {unavailable.length>0&&<p role="status">Some requested rates are outside the supported engine inputs or cannot produce finite results; they are unavailable, not zero.</p>}
  {unavailable.length>0&&<ul aria-label="Unavailable Mortgage annual rates">{unavailable.map(point=><li key={point.input.annualRatePercent}>{displayFinalValue(point.input.annualRatePercent,'%')}: {point.state==='unavailable'&&point.reason==='outside-supported-inputs'?'Outside supported engine inputs':'Cannot produce finite results'}</li>)}</ul>}
  <details className="analysis-details"><summary>Rate comparison totals</summary><div className="analysis-data" role="region" aria-label="Mortgage aggregate rate comparison data" tabIndex={0}>
   <table className="result-table"><caption className="sr-only">Mortgage aggregate rate comparison totals</caption>
    <thead><tr><th scope="col">Annual rate (%)</th><th scope="col">Monthly principal &amp; interest</th><th scope="col">Total principal &amp; interest</th><th scope="col">Total modeled interest</th></tr></thead>
    <tbody>{analysis.scenarios.map(point=><tr key={point.id}><th scope="row">{displayFinalValue(point.input.annualRatePercent,'%')}{point.baseline&&<span className="analysis-baseline">Baseline</span>}</th>{point.state==='available'?<><td>{displayFinalValue(point.output.monthlyPayment)}</td><td>{displayFinalValue(point.output.totalPayment)}</td><td>{displayFinalValue(point.output.totalInterest)}</td></>:<td colSpan={3}>Unavailable</td>}</tr>)}</tbody>
   </table>
  </div></details>
 </section>;
}
