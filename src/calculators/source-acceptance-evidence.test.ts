import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {verifyFinancialSafetyBinding} from "../../scripts/financial-safety-lineage.mjs";

const dir="data/catalog/source-acceptance-2026-10-26";
const read=(p:string)=>JSON.parse(readFileSync(p,"utf8"));
const hash=(b:string|Buffer)=>createHash("sha256").update(b).digest("hex");
type Row={masterId:number;title:string;domain:string;status:string;packetPath:string|null;packetSHA256:string|null;historicalQualifiedApprovalStatus:string;certificationAuthorized:boolean;publicationAuthorized:boolean};
const guardedFinancialPaths=new Set(['src/calculators/precision.ts','src/calculators/finance/loan-payment.ts','src/calculators/finance/compound-interest.ts']);
type VerifiedInspection={current:Buffer;historical:Buffer};
function inspectedHistoricalBytes(path:string,bytesFor:(p:string)=>Buffer,verified:Map<string,VerifiedInspection>,actualBytesFor:(p:string)=>Buffer=p=>readFileSync(p)){
 const current=bytesFor(path);
 if(!guardedFinancialPaths.has(path))return current;
 // Packet claims refer to the retained source, not a new review of the guard
 // successor. Verify current bytes independently before inspecting that history.
 expect(current.equals(actualBytesFor(path))).toBe(true);
 // Scope reuse to this one synchronous validation, after checking each current
 // byte capture. Never reuse trust across requests or bypass changed bytes.
 const prior=verified.get(path);if(prior){expect(current.equals(prior.current)).toBe(true);return prior.historical;}
 const historical=execFileSync('git',['show',`a955cdad7019a645b7ed2950299d0603ba1784a7:${path}`],{stdio:['ignore','pipe','pipe']});
 const git=(args:string[])=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
 expect(verifyFinancialSafetyBinding(path,current,hash(historical),git)).toBe(true);
 verified.set(path,{current:Buffer.from(current),historical});
 return historical;
}
function inspectSourceBindings(value:unknown,bytesFor:(p:string)=>Buffer,verified:Map<string,VerifiedInspection>){
 if(Array.isArray(value)){for(const item of value)inspectSourceBindings(item,bytesFor,verified);return;}
 if(!value||typeof value!=="object")return;
 const obj=value as Record<string,unknown>;
 if(typeof obj.path==="string"&&obj.path.startsWith("src/")){
  expect(obj.path.split("/")).not.toContain("..");const bytes=inspectedHistoricalBytes(obj.path,bytesFor,verified);
  const gitBlob=createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest("hex");
  for(const key of ["githubBlobSha","blobSha"]){if(typeof obj[key]==="string")expect(obj[key]).toBe(gitBlob);}
  for(const key of ["localEvidenceSha256","contentSha256"]){if(typeof obj[key]==="string")expect([hash(bytes),hash(Buffer.concat([bytes,Buffer.from("\n")]))]).toContain(obj[key]);}
  for(const key of ["baseline","reviewedHead"]){const v=obj[key] as Record<string,unknown>|undefined;if(v?.sha256){expect(v.sha256).toBe(hash(bytes));expect(v.gitBlob).toBe(gitBlob);}}
 }
 for(const nested of Object.values(obj))inspectSourceBindings(nested,bytesFor,verified);
}
function assertSnapshot(register:ReturnType<typeof read>,bytesFor:(p:string)=>Buffer=(p)=>readFileSync(p)){
 const verified=new Map<string,VerifiedInspection>();
 const prior=read("data/catalog/risk-review-2026-10-26/reassessment.json");
 expect(register.sourceIndex.path).toBe(`${dir}/source-index.json`);expect(hash(bytesFor(register.sourceIndex.path))).toBe(register.sourceIndex.sha256);
 expect(Object.keys(register.protectedHashes).sort()).toEqual(["data/catalog/master-catalog-2026.csv","docs/audits/final-acceptance-p0-2026-10-21/acceptance-ledger.csv","data/catalog/risk-review-2026-10-26/reassessment.json","docs/audits/specialist-technical-review-2026-10-26/technical-register.json","docs/MASTER-BLUEPRINT-GOVERNANCE-AMENDMENT-2026-10-26.md","src/calculators/certification-review-policy.ts","src/lib/admin/publishing.ts","src/calculators/publication-authority.ts"].sort());
 expect(register.rows).toHaveLength(70);expect(new Set(register.rows.map((r:Row)=>r.masterId)).size).toBe(70);
 expect(register.summary).toMatchObject({packetsPrepared:59,evidenceComplete:0,evidenceGaps:59,qualifiedReviewRetained:11,certificationsGranted:0,publicationsGranted:0});
 for(const r of register.rows as Row[]){
  const old=prior.rows.find((x:Row)=>x.masterId===r.masterId);expect(old).toBeDefined();expect([r.title,r.domain]).toEqual([old.title,old.domain]);
  expect(r.historicalQualifiedApprovalStatus).toBe("QUALIFIED_APPROVAL_PENDING");expect(r.certificationAuthorized).toBe(false);expect(r.publicationAuthorized).toBe(false);
  if(old.qualifiedExternalReviewRequired){expect(r.status).toBe("QUALIFIED_REVIEW_RETAINED");expect(r.packetPath).toBeNull();continue;}
  expect(r.status).toBe("EVIDENCE_GAPS");expect(r.packetPath).toBe(`${dir}/packets/${String(r.masterId).padStart(3,"0")}.json`);
  const bytes=bytesFor(r.packetPath!);expect(hash(bytes)).toBe(r.packetSHA256);const p=JSON.parse(bytes.toString());
  expect(hash(bytesFor(p.basis.lanePath))).toBe(p.basis.laneSHA256);
  const lane=JSON.parse(bytesFor(p.basis.lanePath).toString());expect(lane.cases.find((x:Row)=>x.masterId===r.masterId)).toEqual(p.analysis);
  expect(hash(bytesFor(p.basis.riskRegisterPath))).toBe(p.basis.riskRegisterSHA256);expect(hash(bytesFor(p.basis.technicalRegisterPath))).toBe(p.basis.technicalRegisterSHA256);
  expect(p.currentSourceVerification.sourceUrls.slice().sort()).toEqual(old.sourceEvidence.map((x:{url:string})=>x.url).sort());
  inspectSourceBindings(p.analysis.implementationBinding,bytesFor,verified);
  expect(p.masterId).toBe(r.masterId);expect(p.evidenceComplete).toBe(false);expect(p.actualEngineGoldensAccepted).toBe(false);
  expect(p.certificationAuthorized).toBe(false);expect(p.publicationAuthorized).toBe(false);expect(p.remainingGaps.length).toBeGreaterThan(0);
  for(const key of ["candidateFormula","units","applicability","limits","rounding","sourceEvidence","independentNumericalEvidence","implementationBinding"]){expect(p.analysis[key]).toBeDefined();}
  expect(p.currentSourceVerification.status).toBe("NOT_COMPLETED");expect(p.currentSourceVerification.normativeRevisionVerified).toBe(false);
 }
 for(const [p,h] of Object.entries(register.protectedHashes)){expect(hash(bytesFor(p))).toBe(h);}
}

describe("source acceptance evidence is complete in coverage and fail-closed in readiness",()=>{
 it("contains exact59packets and retains the11qualified cases unchanged",()=>assertSnapshot(read(`${dir}/readiness-register.json`)));
 it("rejects unsupported completeness, identity, authority and qualified-status promotions",()=>{
  const original=read(`${dir}/readiness-register.json`);
  for(const mutate of [(r:ReturnType<typeof read>)=>r.summary.evidenceComplete=59,(r:ReturnType<typeof read>)=>r.rows[0].masterId=999,(r:ReturnType<typeof read>)=>r.rows[0].certificationAuthorized=true,(r:ReturnType<typeof read>)=>r.rows[0].historicalQualifiedApprovalStatus="APPROVED",(r:ReturnType<typeof read>)=>r.rows.pop()]){
   const r=structuredClone(original);mutate(r);expect(()=>assertSnapshot(r)).toThrow();
  }
 });
 it("rejects stale referenced lane, source-index and inspected implementation evidence",()=>{
  const register=read(`${dir}/readiness-register.json`);
  for(const path of [`${dir}/lanes/finance-14.json`,`${dir}/source-index.json`,"src/calculators/finance/credit-card-payoff.ts","src/calculators/precision.ts"]){
   const corrupt=(p:string)=>p===path?Buffer.from(readFileSync(p,"utf8")+" "):readFileSync(p);
   expect(()=>assertSnapshot(register,corrupt)).toThrow();
  }
 });
 it("rechecks repeated current bytes and never shares verified history across validation calls",()=>{
  const path="src/calculators/precision.ts",current=readFileSync(path),verified=new Map<string,VerifiedInspection>();
  expect(inspectedHistoricalBytes(path,()=>current,verified)).not.toEqual(current);
  expect(()=>inspectedHistoricalBytes(path,()=>Buffer.concat([current,Buffer.from("//tamper")]),verified)).toThrow();
  const changed=Buffer.concat([current,Buffer.from("//changed-on-disk")]);
  expect(()=>inspectedHistoricalBytes(path,()=>changed,verified,()=>changed)).toThrow();
  const original=read(`${dir}/readiness-register.json`);
  expect(()=>assertSnapshot(original,p=>p===path?Buffer.concat([current,Buffer.from("//tamper")]):readFileSync(p))).toThrow();
 });
 it("replays67exact-rational candidate checks without claimingactual-engine acceptance",()=>{
  const result=JSON.parse(execFileSync("python3",[`${dir}/lanes/bounded-witnesses.py`],{encoding:"utf8"}));
  expect(result).toEqual({ids:22,numericCases:67,result:"PASS",scope:"EXACT_RATIONAL_CANDIDATE_ONLY"});
 });
 it("keeps publisher capture HTTPS,redirect and unreviewed-status protections",()=>{
  expect(()=>execFileSync("python3",[`${dir}/capture-sources.test.py`],{encoding:"utf8",stdio:"pipe"})).not.toThrow();
 });
 it("distinguishes the actualproxydenial from unattemptedurls and an inactive draft",()=>{
  const access=read(`${dir}/source-access.json`);expect(access.configurationDraftSaved).toBe(true);expect(access.configurationApplied).toBe(false);
  expect(access.actualProbe).toMatchObject({url:"https://www.gov.uk/income-tax-rates",originResponseReceived:false,proxyConnectStatus:403});
  const sources=read(`${dir}/source-index.json`);expect(sources.sources.length).toBeGreaterThan(20);
  for(const s of sources.sources){expect(s.currentSourceVerified).toBe(false);expect(s.sourceBodySHA256).toBeNull();expect(s.referencingIds.length).toBeGreaterThan(0);}
 });
});
