import {describe,expect,it} from "vitest";
import {calculatorRegistry} from "../registry";
import {getCertificationCandidateContent,getPublicCalculatorContent} from "../public-content";
describe("repository portfolio reconciliation",()=>{
 const defs=calculatorRegistry.list();
 it("keeps registry identity unique",()=>{
  expect(new Set(defs.map(d=>d.id)).size).toBe(defs.length);
  expect(new Set(defs.map(d=>d.slug)).size).toBe(defs.length);
 });
 it("requires every certified registry definition to have governed public content",()=>{
  const missing=defs.filter(d=>d.reviewStatus==="certified"&&!getPublicCalculatorContent(d.slug)).map(d=>d.slug);
  expect(missing).toEqual([]);
 });
 it("keeps draft and reviewed candidate content non-public",()=>{
  const leaked=defs.filter(d=>d.reviewStatus!=="certified"&&getCertificationCandidateContent(d.slug)&&getPublicCalculatorContent(d.slug)).map(d=>d.slug);
  expect(leaked).toEqual([]);
 });
 it("reports lifecycle counts without treating candidate content as certification",()=>{
  const counts=defs.reduce((a,d)=>(a[d.reviewStatus]=(a[d.reviewStatus]??0)+1,a),{} as Record<string,number>);
  expect(Object.values(counts).reduce((a,b)=>a+b,0)).toBe(defs.length);
  expect(counts.certified??0).toBeGreaterThan(0);
  expect((counts.reviewed??0)+(counts.draft??0)).toBeGreaterThan(0);
 });
});
