import {beforeAll,describe,it,expect} from 'vitest';
import {verifyComposition} from '../../tests/parallel-five-20261110/verify-composition.mjs';
import {assertTestOnlySuccessor,testOnlySuccessorPaths} from '../../tests/parallel-five-20261110/test-only-successor.mjs';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const directory='docs/parallel-five-20261110/authenticated';
const json=(file:string)=>JSON.parse(readFileSync(directory+'/'+file,'utf8'));
const sha=(file:string)=>createHash('sha256').update(readFileSync(file)).digest('hex');
describe('parallel five genuine authenticated successful-scope evidence',()=>{
 let composition: Awaited<ReturnType<typeof verifyComposition>>;
 // Source qualification and reading all95 native artifacts are bounded setup,
 // separate from the unchanged five-second assertion/error-refusal case.
 beforeAll(async()=>{composition=await verifyComposition();},30000);
 it('binds the original application, honest completed scopes and all native disk artifacts',async()=>{
  const receipt=json('receipt.json'),source=json('final-source-version.json'),four=json('prior/sharing/completed-four-checkpoint.json'),fifth=json('sharing/receipt.json');
  expect(receipt.kind).toBe('BOUNDED_SUCCESSFUL_SCOPE_COMPOSITION_NOT_FAILED_RUN_PROMOTION');
  expect(receipt.priorFailedRunPromoted).toBe(false);expect(receipt.releaseHold).toBe(true);expect(receipt.certificationGranted).toBe(false);
  const baseline=json('f042-source-binding.json');expect(baseline.applicationGit).toBe('f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5');expect(baseline.allBaselineGitBlobsMatchActualRecordedBuildSources).toBe(true);expect(baseline.collectedGit).toBe(source.applicationGit);
  expect(Object.keys(source.currentBlobBindings).length).toBeGreaterThanOrEqual(1793);
  // This new CI bridge was written after the recorded production build. It is
  // deliberately outside the captured 1793 application paths and claims no
  // additional production compilation; every captured path remains checked.
  expect(source.currentBlobBindings['src/lib/parallel-five-auth-evidence.test.ts']).toBeUndefined();
  expect(sha(directory+'/prior/sharing/completed-four-producer.mjs.fixture')).toBe(receipt.successfulScopes.priorFourSharing.loadedHelperSHA256);
  expect(four.comparisons.map((r:{catalogId:number})=>r.catalogId)).toEqual([369,375,380,381]);
  expect(fifth.comparisons.map((r:{catalogId:number})=>r.catalogId)).toEqual([387]);
  expect([...four.rows,...fifth.rows].length).toBe(15);
  for(const id of [369,375,380,381,387])expect([...four.rows,...fifth.rows].filter((r:{catalogId:number})=>r.catalogId===id).map((r:{role:string})=>r.role)).toEqual(['owner','admin','member']);
  expect(testOnlySuccessorPaths).toHaveLength(7);
  for(const file of testOnlySuccessorPaths){const recorded=source.currentBlobBindings[file].recordedBuildSourceSHA256,bytes=readFileSync(file);await expect(assertTestOnlySuccessor(file,recorded,Buffer.concat([bytes,Buffer.from('\n// unrelated drift')]))).rejects.toThrow();await expect(assertTestOnlySuccessor(file,'0'.repeat(64),bytes)).rejects.toThrow();}
  await expect(assertTestOnlySuccessor('src/lib/other.test.ts','0'.repeat(64),Buffer.from(''))).rejects.toThrow('Only seven exact test successors');
  const result=composition;expect(result.downloads).toBe(95);expect(result.testOnlySuccessors).toBe(7);expect(result.priorFailedRunPromoted).toBe(false);const output=result.summary;
  expect(output).toContain('95 complete native download bytes');expect(output).toContain('failed earlier whole-run remains failed');
 });
});
