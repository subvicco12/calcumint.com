import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import register from '../../data/catalog/source-reviewer-integration-2026-10-27/integration-register.json';
import basis from '../../data/catalog/source-driven-2026-10-27/engineering-register.json';
import {privateSourceBindings,privateSourceDefinitions} from './private-source-definitions';
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
it('covers exact23component-supported cases while distinguishing seven bounded profiles from16unsupported contracts',()=>{
 expect(register.rows.map(r=>r.masterId)).toEqual(basis.rows.filter(r=>r.suppliedArithmeticComponents.length).map(r=>r.masterId));
 expect(register.rows.filter(r=>r.status==='PRIVATE_BOUNDED_PROFILE').map(r=>r.masterId)).toEqual([81,85,86,126,469,488,516]);
 expect(register.rows.filter(r=>r.status==='NOT_INTEGRATED_UNRESOLVED_CONTRACT')).toHaveLength(16);
 for(const r of register.rows){expect(r.canonicalBindingApproved).toBe(false);expect(r.fullCalculatorAccepted).toBe(false);expect(r.sourceComplete).toBe(false);expect(r.certificationAuthorized).toBe(false);expect(r.publicationAuthorized).toBe(false);expect(r.originalRemainingGaps.length).toBeGreaterThan(0);expect(r.originalRemainingGaps).toEqual(basis.rows.find(x=>x.masterId===r.masterId)!.remainingGaps);}
});
it('pins exact implementation, dependency, fixture and preserved catalog/governance/ledger bytes',()=>{
 expect(hash(register.basisPath)).toBe(register.basisSHA256);
 for(const [path,sha] of Object.entries({...register.files,...register.protectedHashes}))expect(hash(path)).toBe(sha);
});
it('binds profile identity and version only to the per-ID source observation, not publisher bytes or adoption',()=>{
 for(const b of privateSourceBindings){const r=register.rows.find(x=>x.masterId===b.masterId)!;expect(r.contractId).toBe(b.contractId);expect(r.technicalVersion).toBe(b.version);expect(r.calculatorId).toBe(privateSourceDefinitions.find(x=>x.masterId===b.masterId)!.definition.id);expect(r.sourceEvidence.map(s=>s.url)).toContain(b.sourceURL);expect(r.sourceEvidence.every(s=>s.publisherBodySHA256===null)).toBe(true);}
});
