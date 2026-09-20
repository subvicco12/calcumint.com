"use client";
import { hasCalculatorCapability } from "@/calculators/final-framework/entitlements";
import type { PlanTier } from "@/calculators/final-framework/types";
import type { Scenario,SensitivityPoint } from "@/calculators/final-framework/analysis";

function n(value:number){return value.toLocaleString(undefined,{maximumFractionDigits:2})}

export function GoalSolverPanel({plan,target,solved,label="Required input",targetLabel="Target",solvedLabel}:{plan:PlanTier;target:number;solved:number;label?:string;targetLabel?:string;solvedLabel?:string}){
 if(!hasCalculatorCapability(plan,"goalSolver"))return null;
 const resolvedLabel=solvedLabel??label;
 return <section className="result-panel" aria-label="Goal Solver"><div className="result-panel-heading"><h3>Goal Solver</h3><span>Pro analysis</span></div><div className="metric-grid"><div className="metric-card"><span>{targetLabel}</span><strong>{n(target)}</strong></div><div className="metric-card"><span>{resolvedLabel}</span><strong>{n(solved)}</strong></div></div></section>
}
export function ScenarioComparisonPanel({plan,scenarios}:{plan:PlanTier;scenarios:readonly Scenario[]}){
 if(!hasCalculatorCapability(plan,"scenarioComparison"))return null;
 return <section className="result-panel" aria-label="Scenario comparison"><div className="result-panel-heading"><h3>Scenario comparison</h3><span>Pro analysis</span></div><div className="composition-list">{scenarios.map(s=><div key={s.id}><div><span>{s.label}</span><strong>{n(s.value)} ({s.delta>=0?"+":""}{n(s.delta)})</strong></div></div>)}</div></section>
}
export function SensitivityPanel({plan,points,inputLabel="Input"}:{plan:PlanTier;points:readonly SensitivityPoint[];inputLabel?:string}){
 if(!hasCalculatorCapability(plan,"sensitivityAnalysis"))return null;
 const max=Math.max(...points.map(p=>Math.max(p.value,0)),1);
 return <section className="result-panel" aria-label="Sensitivity analysis"><div className="result-panel-heading"><h3>Sensitivity analysis</h3><span>Pro analysis</span></div><div className="series-bars">{points.map(p=><div key={p.input}><span>{inputLabel}: {n(p.input)}</span><progress max={max} value={Math.max(p.value,0)} aria-label={inputLabel+" "+n(p.input)}/><strong>{n(p.value)}</strong></div>)}</div></section>
}
