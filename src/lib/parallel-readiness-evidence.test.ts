import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

it('runs the five fail-closed projection regressions and checks current retained evidence',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 // Inherited streams also work in managed runtimes that prohibit child pipe capture.
 expect(()=>execFileSync(process.execPath,['tests/parallel-completion-20261110/readiness.test.mjs'],{cwd:process.cwd(),env,stdio:'inherit',timeout:20000})).not.toThrow();
 expect(()=>execFileSync(process.execPath,['scripts/parallel-completion-20261110/readiness.mjs','--check'],{cwd:process.cwd(),env,stdio:'inherit',timeout:20000})).not.toThrow();
 const report=JSON.parse(readFileSync('docs/parallel-completion-20261110/readiness/projection.json','utf8'));
 expect(report.summary).toEqual({identities:540,retainedRequirements:14293,authorityActions:43,releaseCandidates:0,canonicalPromotions:0});
 expect(Object.keys(report.categorySummaries)).toHaveLength(9);
},30000);
