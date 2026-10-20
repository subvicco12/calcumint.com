import {describe,it,expect} from "vitest";
import {draftPreviewDefinitions,calculateDraftPreview,draftPreviewScenarioMetadata} from "@/calculators/final-framework/draft-preview-catalog";
import {calculatorRegistry} from "@/calculators/registry";
import {readDraftPreviewCapture,saveDraftPreviewCapture} from "./draft-preview-history";
class MemoryStorage implements Storage {data=new Map<string,string>();length=0;clear(){this.data.clear();}getItem(k:string){return this.data.get(k)??null;}key(i:number){return [...this.data.keys()][i]??null;}removeItem(k:string){this.data.delete(k);}setItem(k:string,v:string){this.data.set(k,v);}}
describe("private fourteen-definition storage and contracts",()=>{
 for(const d of draftPreviewDefinitions)it(`${d.masterId}: roundtrip immutable capture, labels and public exclusion`,()=>{
  const s=new MemoryStorage(),c=calculateDraftPreview(d.masterId,d.initialInput);saveDraftPreviewCapture(s,"review-A",d.masterId,c.snapshot);const old=[...s.data.values()][0];
  const reopened=readDraftPreviewCapture(s,"review-A",d.masterId)!;expect(reopened.snapshot).toEqual(c.snapshot);expect(Object.isFrozen(reopened.snapshot.output)).toBe(true);
  expect(readDraftPreviewCapture(s,"review-B",d.masterId)).toBeNull();expect(calculatorRegistry.getBySlug(d.slug)).toBeUndefined();expect([...s.data.values()][0]).toBe(old);
  const metadata=draftPreviewScenarioMetadata(d.masterId,c);expect(metadata.calculatorSlug).toBe(d.slug);expect(Object.keys(metadata.outputs).length).toBeGreaterThan(0);
 });
 it.each(["owner","version","output","input","id"])("rejects corrupt %s without deleting stored evidence",field=>{
  const s=new MemoryStorage(),d=draftPreviewDefinitions[0],c=calculateDraftPreview(d.masterId,d.initialInput);saveDraftPreviewCapture(s,"A",d.masterId,c.snapshot);const [key,value]=[...s.data.entries()][0],e=JSON.parse(value);
  if(field==="owner")e.ownerScope="B";if(field==="version")e.snapshot.calculatorVersion=2;if(field==="output")e.snapshot.output.result="wrong";if(field==="input")e.snapshot.input.left="bad";if(field==="id")e.masterId=206;
  s.setItem(key,JSON.stringify(e));expect(()=>readDraftPreviewCapture(s,"A",d.masterId)).toThrow();expect(s.getItem(key)).toBe(JSON.stringify(e));
 });
 it("preserves existing storage on quota errors and rejects mismatched identity saves",()=>{
  const s=new MemoryStorage(),c=calculateDraftPreview(205,{left:"1",right:"3",operation:"divide"});saveDraftPreviewCapture(s,"A",205,c.snapshot);const old=[...s.data.values()][0];s.setItem=()=>{throw new Error("Quota");};
  expect(()=>saveDraftPreviewCapture(s,"A",205,c.snapshot)).toThrow();expect([...s.data.values()][0]).toBe(old);expect(()=>saveDraftPreviewCapture(s,"A",206,c.snapshot)).toThrow();
 });
 it("rejects corrupt JSON and missing owner, without changing mathematics",()=>{
  const s=new MemoryStorage(),d=draftPreviewDefinitions[0],c=calculateDraftPreview(205,d.initialInput);expect(()=>saveDraftPreviewCapture(s,"",205,c.snapshot)).toThrow();saveDraftPreviewCapture(s,"A",205,c.snapshot);s.setItem([...s.data.keys()][0],"broken");expect(()=>readDraftPreviewCapture(s,"A",205)).toThrow();
 });
 it("uses governed draw tables and same-unit energy composition only",()=>{
  const rng=calculateDraftPreview(233,draftPreviewDefinitions.find(x=>x.masterId===233)!.initialInput);expect(rng.result.scheduleMetadata?.period.label).toBe("Draw");expect(rng.result.schedule).toHaveLength(2);
  const energy=calculateDraftPreview(484,draftPreviewDefinitions.find(x=>x.masterId===484)!.initialInput);expect(energy.result.composition?.map(x=>x.unit)).toEqual(["kWh","kWh"]);
 });
});
it("binds conversion and grading scenario contexts to authoritative inputs",()=>{
 const fuel=calculateDraftPreview(435,{value:"20",fromUnit:"mpg_us",toUnit:"km_per_l"});expect(draftPreviewScenarioMetadata(435,fuel).inputs.value.unit).toBe("mpg (US)");
 const ingredient=calculateDraftPreview(498,{value:120,direction:"massToVolume",densityGPerMl:0.5});expect(draftPreviewScenarioMetadata(498,ingredient).inputs.value.unit).toBe("g");
 const grade=(maxScore:number)=>calculateDraftPreview(517,{assessments:[{score:1}],mode:"unweighted",missingPolicy:"reject",scale:{minScore:0,maxScore}});
 expect(draftPreviewScenarioMetadata(517,grade(4)).outputs.average.label).not.toBe(draftPreviewScenarioMetadata(517,grade(100)).outputs.average.label);
});
