import {describe,expect,it} from 'vitest';
import fixtures from '../../../data/verification/codex-a-standard-risk-goldens-2026-10-15.json';
import {calculatorRegistry} from '../registry';import {runCalculator} from '../engine';
const relativeTolerance=16*Number.EPSILON;
function assertIndependent(actual:unknown,expected:number){expect(typeof actual).toBe('number');expect(Number.isFinite(actual)).toBe(true);const numeric=actual as number;expect(numeric===expected||Math.abs(numeric-expected)<=Math.abs(expected)*relativeTolerance).toBe(true);}
describe('Codex A independent standard-risk source-contract vectors',()=>{
 it('keeps47 distinct engine identities in bounded16/10/10/11 groups without asserting catalog approval',()=>{expect(fixtures.calculators).toHaveLength(47);expect(new Set(fixtures.calculators.map(row=>row.slug)).size).toBe(47);expect(fixtures.calculators.filter(row=>row.batch==='existing-16-audit')).toHaveLength(16);for(const [batch,count]of [['geometry-10',10],['science-10',10],['utility-11',11]] as const)expect(fixtures.calculators.filter(row=>row.batch===batch)).toHaveLength(count);});
 for(const row of fixtures.calculators){
  for(const vector of row.cases)it(`${row.batch}: ${row.slug}: ${vector.label}`,()=>{const definition=calculatorRegistry.getBySlug(row.slug)!;expect(definition).toBeDefined();expect(definition.id).toBe(row.calculatorId);expect(definition.version).toBe(row.version);expect(definition.riskClass).toBe('standard');const parsed=definition.inputSchema.parse(vector.input);assertIndependent((definition.calculate(parsed,{}) as {result:number}).result,vector.expected);assertIndependent((runCalculator(definition,vector.input).output as {result:number}).result,vector.expected);});
  it(`${row.slug}: rejects invalid finite-domain inputs at the public engine/schema boundary`,()=>{const definition=calculatorRegistry.getBySlug(row.slug)!;const original=row.cases[0].input;const key=Object.keys(original)[0];for(const invalid of [NaN,Infinity,-Infinity,'',null,undefined]){const input={...original,[key]:invalid};expect(definition.inputSchema.safeParse(input).success).toBe(false);expect(()=>runCalculator(definition,input)).toThrow();}const missing={...original};delete (missing as Record<string,unknown>)[key];expect(definition.inputSchema.safeParse(missing).success).toBe(false);});
 }
});
