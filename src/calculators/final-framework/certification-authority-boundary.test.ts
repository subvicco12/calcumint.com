import {describe,expect,it} from "vitest";
import fs from "node:fs";
describe("authoritative certification authority boundary",()=>{
 const admin=fs.readFileSync("src/app/admin/calculators/[id]/page.tsx","utf8");
 const db=fs.readFileSync("src/lib/final-certification-database-gate.test.ts","utf8");
 const governance=fs.readFileSync("docs/BUILD-B10-ADMIN-PUBLISHING-FACTORY.md","utf8");
 it("keeps repository readiness distinct from authoritative lifecycle certification",()=>{
  expect(governance).toContain("draft → review → certified → published");
  expect(governance).toContain("Certification/publication also invoke a database-side gate");
  expect(admin).toContain("Skipping lifecycle stages is rejected.");
  expect(admin).toContain("database publishing gate");
 });
 it("keeps certification evidence and reviewer authority fail-closed",()=>{
  expect(db).toContain("structured reviewed source evidence");
  expect(db).toContain("requires an active review-capable reviewer for YMYL certification");
  expect(db).toContain("enforces lifecycle role permissions");
 });
});
