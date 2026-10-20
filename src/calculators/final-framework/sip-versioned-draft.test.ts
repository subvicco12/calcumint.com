import { expect, it } from 'vitest';
import { calculateSipDraftSnapshot, readSipCapturedSnapshot, evaluateSipDraftScenarios } from './sip-versioned-draft';
import { sipCalculator } from '../finance/sip';
import { calculatorRegistry } from '../registry';
import { eligibleScenarioContract } from '../../lib/scenario-reevaluation';
const input = { monthlyContribution: 10000, annualReturnPercent: 1e-12, termMonths: 1200, contributionTiming: 'end' };
it('requires exact explicit technical versions and keeps the registered engine on v1', () => {
 expect(calculateSipDraftSnapshot(2,input).output.futureValue).toBe(12000000);
 expect(calculateSipDraftSnapshot(1,{...input,annualReturnPercent:0}).calculatorVersion).toBe(1);
 for(const version of [undefined,null,0,3,'2',NaN])expect(()=>calculateSipDraftSnapshot(version,input)).toThrow(/version/);
 expect(calculatorRegistry.getBySlug('sip-calculator')).toBe(sipCalculator);
});
it('reads old captures without recalculation and rejects corrupt or mismatched identity', () => {
 const old={calculatorSlug:'sip-calculator',calculatorVersion:1,input,output:{futureValue:12789769.24,investedAmount:12000000,estimatedGain:789769.24}};
 const before=JSON.stringify(old);const read=readSipCapturedSnapshot(1,old);
 expect(JSON.stringify(old)).toBe(before);expect(read.output).toEqual(old.output);expect(Object.isFrozen(read.output)).toBe(true);
 expect(()=>readSipCapturedSnapshot(2,old)).toThrow(/identity/);
 for(const bad of [{...old,calculatorSlug:'other'},{...old,calculatorVersion:3},{...old,output:{futureValue:Infinity}},{...old,input:undefined}])expect(()=>readSipCapturedSnapshot(1,bad)).toThrow();
 expect(eligibleScenarioContract(old)).toBeUndefined();expect(eligibleScenarioContract(calculateSipDraftSnapshot(2,input))).toBeUndefined();
});
it('isolates fresh A/B/C inputs and retains baseline when another draft request is invalid', () => {
 const scenarios=[{id:'A',input:{...input,annualReturnPercent:0}},{id:'B',input:{...input,annualReturnPercent:-1e-12}},{id:'C',input:{...input,termMonths:0}}];
 const before=JSON.stringify(scenarios),rows=evaluateSipDraftScenarios(2,scenarios);
 expect(rows.map(row=>row.status)).toEqual(['ready','ready','unavailable']);expect(JSON.stringify(scenarios)).toBe(before);
 expect(rows[0].status==='ready'&&rows[0].snapshot.output.futureValue).toBe(12000000);
 expect(()=>evaluateSipDraftScenarios(2,[{id:'B',input}])).toThrow();expect(()=>evaluateSipDraftScenarios(2,[{id:'A',input},{id:'A',input}])).toThrow();
 expect(()=>evaluateSipDraftScenarios(2,[{id:'A',input:{}}])).toThrow();
});

import { buildSipV2DraftWorkspace } from './sip-versioned-draft';
import { serializeSipV2DraftCsv, serializeSipV2DraftJson } from './sip-v2-projection';
import { solveSipV2DraftGoal } from './sip-v2-analytics';
it.each([0,1e-12,-1e-12,8,-99])('joins explicit v2 snapshot, analytics, periods and exports at rate %s',annualReturnPercent=>{
 const workspace=buildSipV2DraftWorkspace(2,{...input,annualReturnPercent,termMonths:24},{locale:'en-IN',currency:'INR'});
 const {projection,analytics,snapshot}=workspace;
 expect(projection.output).toEqual(snapshot.output);expect(analytics.baseline.output).toEqual(snapshot.output);
 expect(projection.result.schedule!.at(-1)!.values).toEqual(snapshot.output);
 expect(projection.result.series![0].points.at(-1)!.y).toBe(snapshot.output.futureValue);
 expect(JSON.parse(serializeSipV2DraftJson(projection)).output).toEqual(snapshot.output);
 expect(serializeSipV2DraftCsv(projection)).toContain('"finance.sip","sip-calculator","2","draft","en-IN","INR"');
 expect(analytics.scenarios.find(row=>row.baseline)!.value).toBe(snapshot.output.futureValue);
 const goal=solveSipV2DraftGoal({targetFutureValue:120000,annualReturnPercent,termMonths:24,contributionTiming:'end'});
 expect(goal.identity.version).toBe(2);expect(goal.output.futureValue).toBe(120000);
 expect(()=>buildSipV2DraftWorkspace(1,input)).toThrow(/version 2/);
});
it('retains a valid baseline when optional monthly precision is unavailable',()=>{
 const workspace=buildSipV2DraftWorkspace(2,{monthlyContribution:11000000000000.01,annualReturnPercent:0,termMonths:8,contributionTiming:'end'});
 expect(workspace.snapshot.output.futureValue).toBe(88000000000000.08);
 expect(workspace.projection.periodStatus).toBe('unavailable');
 expect(workspace.projection.result.primaryResult.value).toBe(workspace.snapshot.output.futureValue);
 expect(workspace.projection.result.schedule).toBeUndefined();
});
