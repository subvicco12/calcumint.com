import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { draftPreviewDefinitions } from "./final-framework/draft-preview-catalog";
import { privateOwnerDefinitions } from "./private-owner-definitions";
import { composePublishedCalculatorSlugs, isRepositoryPublicationEligible } from "./publication-authority";
import { calculatorRegistry } from "./registry";

const path = "data/catalog/risk-review-2026-10-26/reassessment.json";
const document = () => JSON.parse(readFileSync(path, "utf8"));
const sha = (p:string) => createHash("sha256").update(readFileSync(p)).digest("hex");
const priorPath = "docs/audits/specialist-technical-review-2026-10-26/technical-register.json";
type Row = { masterId:number; title:string; domain:string; historicalQualifiedApprovalStatus:string; riskTier:string; disposition:string; qualifiedExternalReviewRequired:boolean; historicalCaseSHA256:string; certificationAuthorized:boolean; publicationAuthorized:boolean; reason:string; remainingRequirements:string[]; externalMandateFinding:string };

describe("prospective 70-case reassessment preserves approval and publication authority",()=>{
 it("covers the exact70 historical identities once, without rewriting their cases",()=>{
  const d=document(), prior=JSON.parse(readFileSync(priorPath,"utf8"));
  expect(d.rows).toHaveLength(70);expect(new Set(d.rows.map((r:Row)=>r.masterId)).size).toBe(70);
  expect(d.rows.map((r:Row)=>r.masterId).sort((a:number,b:number)=>a-b)).toEqual(prior.cases.map((r:Row)=>r.masterId).sort((a:number,b:number)=>a-b));
  for(const r of d.rows as Row[]){const old=prior.cases.find((c:Row)=>c.masterId===r.masterId);expect(r.title).toBe(old.title);expect(r.domain).toBe(old.domain);expect(r.historicalQualifiedApprovalStatus).toBe("QUALIFIED_APPROVAL_PENDING");expect(r.historicalCaseSHA256).toBe(createHash("sha256").update(JSON.stringify(old)).digest("hex"));}
 });
 it("records exclusive individual decisions and distinguishes22source candidates from37evidence gaps and11qualified requirements",()=>{
  const d=document(),rows=d.rows as Row[];
  expect(rows.filter(r=>r.disposition==="SOURCE_BASED_REVIEW_SUFFICIENT")).toHaveLength(22);
  expect(rows.filter(r=>r.disposition==="ADDITIONAL_AUTHORITATIVE_EVIDENCE_REQUIRED")).toHaveLength(37);
  expect(rows.filter(r=>r.disposition==="QUALIFIED_EXTERNAL_REVIEW_REQUIRED")).toHaveLength(11);
  expect(d.summary.potentialSourceBasedAfterEvidence).toBe(59);
  for(const r of rows){expect(r.reason.length).toBeGreaterThan(40);expect(r.remainingRequirements.length).toBeGreaterThan(0);expect(r.externalMandateFinding).toBe("NO_CASE_SPECIFIC_EXTERNAL_SIGNATURE_MANDATE_ESTABLISHED_NOT_AN_EXEMPTION");expect(r.qualifiedExternalReviewRequired).toBe(r.disposition==="QUALIFIED_EXTERNAL_REVIEW_REQUIRED");}
 });
 it("requires institution-specific GPA rules rather than treating the catalog identity as supplied arithmetic",()=>{
  expect(document().rows.find((r:Row)=>r.masterId===516).riskTier).toBe("rule-dependent");
 });
 it("keeps all case approvals, certifications and publications ungranted",()=>{
  const d=document();expect(d.releaseHold).toBe(true);expect(d.summary.certificationsGranted).toBe(0);expect(d.summary.historicalSpecialistApprovalsObtained).toBe(0);
  for(const r of d.rows as Row[]){expect(r.certificationAuthorized).toBe(false);expect(r.publicationAuthorized).toBe(false);}
 });
 it("preserves the recorded540catalog,424ledger,70case register and active legacy gate bytes",()=>{
  for(const [p,h] of Object.entries(document().protectedHashes)){expect(sha(p)).toBe(h);}
 });
 it("does not promote original14private DRAFTs even with perfectly matching forged publication manifests",()=>{
  expect(draftPreviewDefinitions).toHaveLength(14);
  for(const d of draftPreviewDefinitions){expect(calculatorRegistry.getBySlug(d.slug)).toBeUndefined();}
  const forged=draftPreviewDefinitions.map(d=>({calculator_key:`unapproved-draft-${d.masterId}`,slug:d.slug,version:d.version}));
  expect(forged).toHaveLength(14);expect(composePublishedCalculatorSlugs(calculatorRegistry.list(),forged).size).toBe(0);
 });
 it("leaves20owner private profiles uncertified and unpublished regardless of source review eligibility",()=>{
  expect(privateOwnerDefinitions).toHaveLength(20);
  const definitions=privateOwnerDefinitions.map(d=>d.definition);
  for(const d of definitions){expect(d.reviewStatus).toBe("draft");expect(isRepositoryPublicationEligible(d)).toBe(false);}
  expect(composePublishedCalculatorSlugs(definitions,definitions.map(d=>({calculator_key:d.id,slug:d.slug,version:d.version}))).size).toBe(0);
 });
});
