import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import {SUPPLIED_COMPONENT_CONTRACTS} from "./source-driven-components";
import {calculatorRegistry} from "./registry";
const dir="data/catalog/source-driven-2026-10-27";
const hash=(p:string)=>createHash("sha256").update(readFileSync(p)).digest("hex");
const read=()=>JSON.parse(readFileSync(`${dir}/engineering-register.json`,"utf8"));
describe("source-driven engineering preserves the exact source/authority boundary",()=>{
 it("binds all50 exact input identities without inventing approvals",()=>{
  const original=JSON.parse(execFileSync(process.execPath,["scripts/verify-source-driven-evidence.mjs"],{encoding:"utf8"}));
  const r=read();expect(r.rows.map((x:{masterId:number})=>x.masterId)).toEqual(original.ids);
  expect(r.input.zipSHA256).toBe("80226cfdf3d9bd2a5aba4d6e8ff4a49077d61533b20c459f0d54b3bba51797d5");
  expect(original).toMatchObject({rootManifestEntries:97,nestedManifestEntries:76,cases:50,sourceObservations:42,readableSourceObservations:31,retainedQualifiedCases:11,missingSourceCases:9});
  for(const row of r.rows){expect(row.canonicalScopeAdopted).toBe(false);expect(row.fullCalculatorAccepted).toBe(false);expect(row.qualifiedApproval).toBe("PENDING");expect(row.certificationAuthorized).toBe(false);expect(row.publicationAuthorized).toBe(false);expect(row.remainingGaps.length).toBeGreaterThan(0);}
 });
 it("pins candidate implementation bytes and immutable historical evidence",()=>{
  const r=read();for(const row of r.rows)for(const ref of row.candidateFiles){expect(hash(ref.path)).toBe(ref.sha256);}
  for(const [path,sha] of Object.entries(read().protectedHashes))expect(hash(path)).toBe(sha);
 });
 it("pins versioned unregistered component contracts without changing public discovery",()=>{
  const r=read();expect(r.componentContracts).toEqual(SUPPLIED_COMPONENT_CONTRACTS);
  expect(hash(r.componentImplementation.path)).toBe(r.componentImplementation.sha256);
  expect(hash(r.componentImplementation.testPath)).toBe(r.componentImplementation.testSHA256);
  for(const c of SUPPLIED_COMPONENT_CONTRACTS){expect(calculatorRegistry.getById(c.id)).toBeUndefined();expect(calculatorRegistry.getBySlug(c.id)).toBeUndefined();}
 });
 it("keeps publisher-byte verification distinct from hashed observations",()=>{
  for(const row of read().rows)for(const s of row.sourceEvidence){expect(s.publisherBodySHA256).toBeNull();expect(s.normativeContractAccepted).toBe(false);expect(s.observationRecordSHA256).toMatch(/^[a-f0-9]{64}$/);}
 });
});
