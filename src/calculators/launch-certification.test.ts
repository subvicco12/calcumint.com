import{describe,expect,it}from"vitest";import{calculatorRegistry}from"./registry";import{getPublicCalculatorContent}from"./public-content";import{auditLaunchCertification,auditLaunchCertificationDefinitions}from"./launch-certification";
const now=new Date("2100-01-01T00:00:00Z");
const base=calculatorRegistry.list().find(item=>item.reviewStatus==="certified");
if(!base)throw new Error("Expected at least one certified calculator");
const content=getPublicCalculatorContent(base.slug);
if(!content)throw new Error("Expected public content for certified fixture");
const audit=(definition:typeof base,lookup:(slug:string)=>typeof content|undefined=()=>content)=>auditLaunchCertificationDefinitions([definition],lookup,now).map(issue=>issue.reason);
describe("launch certification audit",()=>{
 it("finds no structural defects in currently certified calculators",()=>expect(auditLaunchCertification(now)).toEqual([]));
 it("fails closed without a worked certification fixture",()=>expect(audit({...base,goldenTests:[],examples:[]})).toContain("missing certification fixtures"));
 it("requires non-blank identity metadata",()=>{expect(audit({...base,id:""})).toContain("missing calculator id");expect(audit({...base,title:"  "})).toContain("missing calculator title");expect(audit({...base,category:""})).toContain("missing calculator category");});
 it("requires a usable source",()=>expect(audit({...base,sources:[],officialSources:[]})).toContain("missing sources"));
 it("requires composed public content",()=>expect(audit(base,()=>undefined)).toContain("missing public content"));
 it("requires public content category identity",()=>expect(audit(base,()=>({...content,category:"wrong-category"}))).toContain("public content category mismatch"));
 it("requires an editorial formula explanation",()=>expect(audit(base,()=>({...content,formulaExplanation:" "}))).toContain("missing editorial formula explanation"));
 it("requires at least one non-blank editorial assumption",()=>expect(audit(base,()=>({...content,assumptions:[" ",""]}))).toContain("missing editorial assumptions"));
 it("requires an editorial intro",()=>expect(audit(base,()=>({...content,intro:""}))).toContain("missing editorial intro"));
});
