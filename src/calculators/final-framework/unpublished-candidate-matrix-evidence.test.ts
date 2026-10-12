import fs from 'node:fs';import path from 'node:path';import {expect,it} from 'vitest';
import {calculatorRegistry} from '../registry';
it('keeps the original16 matrix identities/version/source/code evidence exact without inferring protected approvals',()=>{
 const lines=fs.readFileSync(path.join(process.cwd(),'docs/UNPUBLISHED-CANDIDATE-READINESS-MATRIX.csv'),'utf8').trim().split(/\r?\n/).slice(1);
 expect(lines).toHaveLength(16);const ids=new Set<string>();
 for(const line of lines){
  // The identity prefix consists of unquoted registry identifiers/numeric fields; prose follows it.
  const [id,slug,version,risk,status,sourceCount]=line.split(',');const definition=calculatorRegistry.getById(id);expect(definition).toBeDefined();expect(ids.has(id)).toBe(false);ids.add(id);
  expect({slug,version:Number(version),risk,status,sourceCount:Number(sourceCount)}).toEqual({slug:definition!.slug,version:definition!.version,risk:definition!.riskClass,status:definition!.reviewStatus,sourceCount:definition!.sources.length});
  expect(line).toContain('Batch6 anonymous authority snapshot');expect(line).toContain('not refreshed');expect(line).toContain('UNKNOWN: protected evidence unavailable anonymously');expect(line).toContain('UNKNOWN: minimal manifest excludes internal lifecycle/reason');
 }
});
