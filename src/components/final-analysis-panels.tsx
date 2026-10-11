"use client";
import type { PlanTier, PresentationDefinition } from "@/calculators/final-framework/types";
import type { Scenario, SensitivityPoint } from "@/calculators/final-framework/analysis";
import { resolveAnalysisSurface } from "@/calculators/final-framework/analysis-surface-policy";
import { displayFinalValue } from "@/calculators/final-framework/renderer-display";
import "./final-analysis-panels.css";

type AnalysisProps = { plan: PlanTier; presentation: PresentationDefinition };
const invalidAnalysis = <p role="alert">Analysis requires finite numeric results.</p>;

export function GoalSolverPanel({ plan, presentation, target, solved, label = "Required input", targetLabel = "Target", solvedLabel, targetUnit, solvedUnit }: AnalysisProps & {
  target: number; solved: number; label?: string; targetLabel?: string; solvedLabel?: string; targetUnit?: string; solvedUnit?: string;
}) {
  if (!resolveAnalysisSurface(plan, presentation, "goalSolver")?.canExecute) return null;
  const valid = Number.isFinite(target) && Number.isFinite(solved);
  return <section className="result-panel final-analysis" aria-label="Goal Solver">
    <div className="result-panel-heading"><h3>Goal Solver</h3><span>Pro analysis</span></div>
    {valid ? <div className="metric-grid" role="status" aria-live="polite" aria-atomic="true">
      <div className="metric-card"><span>{targetLabel}</span><strong>{displayFinalValue(target, targetUnit)}</strong></div>
      <div className="metric-card"><span>{solvedLabel ?? label}</span><strong>{displayFinalValue(solved, solvedUnit)}</strong></div>
    </div> : invalidAnalysis}
  </section>;
}

export function ScenarioComparisonPanel({ plan, presentation, scenarios, resultLabel, resultUnit }: AnalysisProps & {
  scenarios: readonly Scenario[]; resultLabel: string; resultUnit?: string;
}) {
  if (!resolveAnalysisSurface(plan, presentation, "scenarios")?.canExecute || !scenarios.length) return null;
  const valid = scenarios.every(s => Number.isFinite(s.value) && Number.isFinite(s.delta) && (!s.input || Number.isFinite(s.input.value)));
  return <section className="result-panel final-analysis" aria-label="Scenario comparison">
    <div className="result-panel-heading"><h3>Scenario comparison</h3><span>Pro analysis</span></div>
    {valid ? <div className="analysis-data" role="region" aria-label="Scenario comparison data" tabIndex={0}>
      <table className="result-table"><caption className="sr-only">Scenario comparison: {resultLabel}</caption>
        <thead><tr><th scope="col">Scenario</th><th scope="col">{resultLabel}</th><th scope="col">Change from baseline</th></tr></thead>
        <tbody>{scenarios.map(s => <tr key={s.id}><th scope="row">{s.input ? `${s.input.label}: ${displayFinalValue(s.input.value, s.input.unit)}` : s.label}{s.baseline && <span className="analysis-baseline">Baseline</span>}</th>
          <td>{displayFinalValue(s.value, resultUnit)}</td><td>{s.delta > 0 ? "+" : ""}{displayFinalValue(s.delta, resultUnit)}</td></tr>)}</tbody>
      </table>
    </div> : invalidAnalysis}
  </section>;
}

export function SensitivityPanel({ plan, presentation, points, inputLabel = "Input", inputUnit, resultLabel, resultUnit }: AnalysisProps & {
  points: readonly SensitivityPoint[]; inputLabel?: string; inputUnit?: string; resultLabel: string; resultUnit?: string;
}) {
  if (!resolveAnalysisSurface(plan, presentation, "sensitivity")?.canExecute || !points.length) return null;
  const valid = points.every(p => Number.isFinite(p.input) && Number.isFinite(p.value));
  const min = valid ? Math.min(...points.map(p => p.value), 0) : 0;
  const upper = valid ? Math.max(...points.map(p => p.value), 0) : 0;
  const max = upper === min ? 1 : upper;
  return <section className="result-panel final-analysis" aria-label="Sensitivity analysis">
    <div className="result-panel-heading"><h3>Sensitivity analysis</h3><span>Pro analysis</span></div>
    {valid ? <><div className="series-bars">{points.map((p, index) => <div key={index}>
      <span>{inputLabel}: {displayFinalValue(p.input, inputUnit)}</span>
      <meter min={min} max={max} value={p.value} aria-label={`${resultLabel} at ${inputLabel} ${displayFinalValue(p.input, inputUnit)}`} aria-valuetext={displayFinalValue(p.value, resultUnit)} />
      <strong>{displayFinalValue(p.value, resultUnit)}</strong>
    </div>)}</div>
      <details open className="analysis-details"><summary>Sensitivity data</summary>
        <div className="analysis-data" role="region" aria-label="Sensitivity analysis data" tabIndex={0}>
          <table className="result-table"><caption className="sr-only">Sensitivity analysis: {resultLabel}</caption>
            <thead><tr><th scope="col">{inputLabel}</th><th scope="col">{resultLabel}</th></tr></thead>
            <tbody>{points.map((p, index) => <tr key={index}><td>{displayFinalValue(p.input, inputUnit)}</td><td>{displayFinalValue(p.value, resultUnit)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </> : invalidAnalysis}
  </section>;
}
