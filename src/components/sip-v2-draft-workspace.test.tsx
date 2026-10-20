// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { buildSipV2DraftWorkspace } from '@/calculators/final-framework/sip-versioned-draft';
import { serializeSipV2DraftJson, serializeSipV2DraftCsv } from '@/calculators/final-framework/sip-v2-projection';
import { solveSipV2DraftGoal } from '@/calculators/final-framework/sip-v2-analytics';
import { referencePresentations } from '@/calculators/final-framework/reference-presentations';
import { FinalCalculatorRenderer } from './final-calculator-renderer';
import { ScenarioComparisonPanel, SensitivityPanel, GoalSolverPanel } from './final-analysis-panels';
import type { PlanTier } from '@/calculators/final-framework/types';
afterEach(cleanup);
const presentation={...referencePresentations.sip,supportsSchedule:true};
const input={monthlyContribution:10000,annualReturnPercent:-1e-12,termMonths:1200,contributionTiming:'end'};
// Verification-only harness; no public UI registration or persisted scenario adoption.
it.each(['free','pro','business'] as PlanTier[])('renders authoritative draft v2 across %s without changing export math',plan=>{
 const {projection,analytics,snapshot}=buildSipV2DraftWorkspace(2,input,{locale:'en-IN',currency:'INR'});
 const goal=solveSipV2DraftGoal({targetFutureValue:12000000,annualReturnPercent:-1e-12,termMonths:1200,contributionTiming:'end'});
 const view=render(<><FinalCalculatorRenderer result={projection.result} plan={plan} presentation={presentation}/><ScenarioComparisonPanel plan={plan} presentation={presentation} scenarios={analytics.scenarios} resultLabel="Draft v2 projected value" resultUnit="INR"/><SensitivityPanel plan={plan} presentation={presentation} points={analytics.points} inputLabel="Annual return" inputUnit="%" resultLabel="Draft v2 projected value" resultUnit="INR"/><GoalSolverPanel plan={plan} presentation={presentation} target={12000000} solved={goal.output.monthlyContribution} targetLabel="Target projected value" solvedLabel="Monthly contribution" targetUnit="INR" solvedUnit="INR"/></>);
 expect(view.container.querySelector('.result-box')!.textContent).toContain('12,000,000 INR');
 expect(view.container.textContent).toContain('Unregistered draft version 2; not certified');
 expect(screen.getByText('Methodology')).toBeTruthy();expect(screen.getByText('Sources')).toBeTruthy();
 if(plan==='free'){
  expect(screen.queryByRole('region',{name:'Scenario comparison'})).toBeNull();
  expect(screen.queryByRole('button',{name:'Show all 1200 rows'})).toBeNull();
 }else{
  const details=screen.getByText('Detailed schedule').closest('details')!;details.open=true;
  const expand=screen.getByRole('button',{name:'Show all 1200 rows'});expand.focus();expect(document.activeElement).toBe(expand);
  fireEvent.click(expand);expect(expand.getAttribute('aria-expanded')).toBe('true');
  const region=screen.getByRole('region',{name:'Draft v2 SIP projected monthly snapshots data'});region.focus();expect(document.activeElement).toBe(region);
  expect(within(region).getAllByRole('row')).toHaveLength(1201);
  expect(within(region).getByRole('columnheader',{name:'Cumulative modeled growth (INR)'})).toBeTruthy();
  expect(screen.getByRole('region',{name:'Scenario comparison data'}).getAttribute('tabindex')).toBe('0');
  expect(screen.getByRole('region',{name:'Sensitivity analysis data'}).getAttribute('tabindex')).toBe('0');
 }
 expect(JSON.parse(serializeSipV2DraftJson(projection)).output).toEqual(snapshot.output);
 expect(serializeSipV2DraftCsv(projection).split('\r\n').at(-1)).toBe('"1200","12000000","0","12000000"');
});
it('renders an optional period failure without concealing the valid result or draft trust',()=>{
 const workspace=buildSipV2DraftWorkspace(2,{monthlyContribution:11000000000000.01,annualReturnPercent:0,termMonths:8,contributionTiming:'end'});
 render(<FinalCalculatorRenderer result={workspace.projection.result} plan="business" presentation={presentation}/>);
 expect(screen.getByRole('status').textContent).toContain('88,000,000,000,000.08');
 expect(screen.getByText(/Optional monthly projection unavailable/)).toBeTruthy();
 expect(screen.getByText('Methodology')).toBeTruthy();expect(screen.queryByText('Detailed schedule')).toBeNull();
});
