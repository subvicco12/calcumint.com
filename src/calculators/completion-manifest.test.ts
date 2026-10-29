import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {it,expect} from 'vitest';
import manifest from '../../docs/cloud-batch06/implementation-manifest.json';
import original from '../../data/catalog/source-driven-2026-10-27/engineering-register.json';
import {completionContracts} from './completion-contracts';
import {finalPrivateDiscovery} from './final-private-workbench';
it('machine-readable reconciliation binds exact50 identities, actual private discovery and all original blockers',()=>{
 expect(manifest.calculators.map(r=>r.masterId)).toEqual(original.rows.map(r=>r.masterId));
 expect(manifest.newPrivateProfileIds).toEqual(completionContracts.map(d=>Number(d.id.split('.').at(-1))).sort((a,b)=>a-b));
 expect(manifest.componentSupportedCohortIds).toHaveLength(23);expect(manifest.otherMethodologyAvailableIds).toHaveLength(8);
 for(const r of manifest.calculators){
  const prior=original.rows.find(p=>p.masterId===r.masterId)!;const discovery=finalPrivateDiscovery.find(d=>d.masterId===r.masterId)!;
  expect(r.sourceEvidence).toEqual(prior.sourceEvidence);expect(r.remainingGaps).toEqual(prior.remainingGaps);
  expect(r.canonicalCompleted).toBe(false);expect(r.definitionId).toBe(discovery.definitionId);
  expect(discovery.available).toBe(r.engineeringState!=='blocked-for-this-workbench');
 }
});
it('manifest hashes pin new implementation bytes and the preserved exact arithmetic dependency',()=>{
 for(const [path,sha] of Object.entries(manifest.implementationSHA256))expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(sha);
 expect(createHash('sha256').update(readFileSync(manifest.preservedArithmetic.path)).digest('hex')).toBe(manifest.preservedArithmetic.sha256);
});
