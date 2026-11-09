import {describe,expect,it} from 'vitest';
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const historicalExpected=['BmiReferenceTool','TechnologyTool','HealthTool','EngineeringTool'] as const;
const sourcePath='src/components/calculator-interactive.tsx';
const legacyCallers=(source:string)=>[...source.matchAll(/function\s+(\w+)\([^]*?(?=function\s+\w+\(|$)/g)].filter(match=>match[0].includes('<FinalResultPresentation')).map(match=>match[1]);
describe('legacy Final presentation convergence inventory',()=>{
 it('preserves the exact historical four-caller inventory and requires the reviewed current Technology migration',()=>{
  const historical=execFileSync('git',['show','a7a656f71b04b50192485a49b0b56b3fa6bd86b9:'+sourcePath]);
  expect(createHash('sha256').update(historical).digest('hex')).toBe('46903cd272e5e8a9b7ff37e338a6d9e149bf8956c4d5bed7afec7f9539d2c123');
  expect(legacyCallers(historical.toString())).toEqual(historicalExpected);
  const current=fs.readFileSync(path.join(process.cwd(),sourcePath),'utf8');
  expect(legacyCallers(current)).toEqual(['BmiReferenceTool','HealthTool','EngineeringTool']);
  const technology=current.slice(current.indexOf('function TechnologyTool('),current.indexOf('\ntype HealthKind='));
  expect(technology).toContain('<FinalCalculatorRenderer plan={plan} presentation={technologyScalarPresentation}');
  expect(technology).not.toContain('<FinalResultPresentation');
 });
 it('does not allow a second import path for the governing Final renderer',()=>{
  const current=fs.readFileSync(path.join(process.cwd(),sourcePath),'utf8');
  expect((current.match(/from "@\/components\/final-calculator-renderer"/g)??[])).toHaveLength(1);
 });
});
