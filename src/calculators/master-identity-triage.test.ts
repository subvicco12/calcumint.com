import { readFileSync } from "node:fs";
import { expect,it } from "vitest";
import type { buildMasterPublicationAudit } from "./master-publication-audit";
import { listCalculatorImplementationInventory } from "./implementation-inventory";
import { buildMasterIdentityCrosswalk,buildIdentityEvidenceTriage } from "./master-identity-crosswalk";
const audit=JSON.parse(readFileSync('data/catalog/audit-2026-10-15/master-publication-audit.json','utf8')) as ReturnType<typeof buildMasterPublicationAudit>;
const inventory=listCalculatorImplementationInventory();
const report=buildMasterIdentityCrosswalk(audit,inventory);
it('partitions all 249 unresolved master IDs exactly once without creating identity decisions',()=>{
 const triage=buildIdentityEvidenceTriage(report,inventory);
 expect(triage.summary.unresolvedMasterIds).toBe(249);
 const ids=triage.cases.flatMap(item=>item.masterIds);expect(ids).toHaveLength(249);expect(new Set(ids).size).toBe(249);
 expect(triage.summary.missingLinkageWithLabelHints+triage.summary.missingLinkageWithoutLabelHints).toBe(245);
 expect(triage.summary).toMatchObject({multiCandidateMasterIds:4,aliasesResolved:0,approvedMappings:0,provenMissingEngines:0});
 expect(triage.cases.every(item=>item.identityDecision==='UNKNOWN'&&!item.aliasResolved&&!item.implementationAuthorized)).toBe(true);
 expect(triage.domains).toHaveLength(27);
});
it('keeps cross-domain competing power identities in one joint evidence case',()=>{
 const triage=buildIdentityEvidenceTriage(report,inventory);const power=triage.cases.find(item=>item.masterIds.includes(222))!;
 expect(power.masterIds).toEqual([222,308]);expect(power.candidateSlugs).toEqual(['power-calculator','power-from-work-calculator']);
 expect(power.domains).toHaveLength(2);expect(power.labelHints).toEqual([]);
 for(const domain of power.domains)expect(triage.domains.find(item=>item.domain===domain)!.reviewCaseIds).toContain(power.reviewCaseId);
});
it('does not reinterpret Slope v1 from a current v2 HOLD candidate',()=>{
 const slope=buildIdentityEvidenceTriage(report,inventory).protectedHistoryScopes.find(item=>item.masterId===276)!;
 expect(slope).toMatchObject({disposition:'HOLD',technicalHistoryDecision:'UNKNOWN'});expect(slope.candidateIdentities.find(item=>item.slug==='slope-calculator')!.version).toBe(2);
});
it('keeps label hints outside candidate edges and distinguishes absent hints from absent engines',()=>{
 const before=JSON.stringify(report);const triage=buildIdentityEvidenceTriage(report,inventory);
 expect(triage.cases.some(item=>item.labelHints.length)).toBe(true);
 for(const item of triage.cases)for(const hint of item.labelHints)expect(hint.evidence).toBe('NORMALIZED_LABEL_ONLY_NOT_AN_ALIAS_OR_DOMAIN_DECISION');
 expect(JSON.stringify(report)).toBe(before);expect(triage.purpose).toContain('never create aliases');
});
it('is deterministic across registry ordering and rejects duplicate identities',()=>{
 expect(buildIdentityEvidenceTriage(report,[...inventory].reverse())).toEqual(buildIdentityEvidenceTriage(report,inventory));
 expect(()=>buildIdentityEvidenceTriage(report,[...inventory,inventory[0]])).toThrow(/registry/);
});
it('groups transitively overlapping candidate scopes rather than duplicating unresolved IDs',()=>{
 const changed=structuredClone(report);const templates=[222,308,377].map(id=>structuredClone(report.rows.find(row=>row.masterId===id)!));
 const candidate=templates[0].candidates[0];
 templates[0].candidates=[{...candidate,slug:'a',sharedMasterIds:[222,308]},{...candidate,slug:'b',sharedMasterIds:[222,377]}];
 templates[1].candidates=[{...candidate,slug:'a',sharedMasterIds:[222,308]},{...candidate,slug:'c',sharedMasterIds:[308]}];
 templates[2].candidates=[{...candidate,slug:'b',sharedMasterIds:[222,377]},{...candidate,slug:'d',sharedMasterIds:[377]}];
 changed.rows=templates;
 const triage=buildIdentityEvidenceTriage(changed,inventory);
 expect(triage.cases).toHaveLength(1);expect(triage.cases[0].masterIds).toEqual([222,308,377]);
});
