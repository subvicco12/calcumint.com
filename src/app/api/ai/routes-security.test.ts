import { beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ snapshot: {state:"available", slugs:new Set(["sip-calculator"])}, provider:vi.fn(), session:vi.fn(), consume:vi.fn(), finish:vi.fn(), find:vi.fn(), explain:vi.fn(), builder:vi.fn() }));
vi.mock("@/lib/publication-manifest",()=>({getPublicationSnapshot:async()=>state.snapshot,getPublishedCalculatorSlugs:async()=>state.snapshot.slugs}));
vi.mock("@/lib/ai/provider",()=>({getAiProvider:state.provider}));
vi.mock("@/lib/ai/access",async importOriginal=>({...await importOriginal<typeof import("@/lib/ai/access")>(),getAiSession:state.session,consumeAiAccess:state.consume,finishAiUsage:state.finish}));
vi.mock("@/lib/supabase/server",()=>({createSupabaseServerClient:vi.fn()}));
vi.mock("@/lib/ai/service",()=>({findCalculatorWithAi:state.find,explainDeterministicResult:state.explain,proposeBuilderDefinition:state.builder}));
import {AiAccessError} from "@/lib/ai/request-errors";
import {POST as find} from "./find/route";
import {POST as explain} from "./explain/route";
import {POST as builder} from "./builder-assist/route";
const request=(body:unknown)=>new Request("https://synthetic.invalid/api/ai",{method:"POST",body:JSON.stringify(body)});
const routes=[{name:"explanation",post:explain,body:{calculatorName:"Synthetic",values:{},result:{}}},{name:"builder",post:builder,body:{prompt:"A synthetic calculator"}}];
beforeEach(()=>{vi.clearAllMocks();state.snapshot={state:"available",slugs:new Set(["sip-calculator"])};state.provider.mockReturnValue({});state.session.mockResolvedValue({});state.consume.mockResolvedValue({usageId:1});state.finish.mockResolvedValue(undefined);state.find.mockResolvedValue({recommendations:[{slug:"private-ai-output"}],usedAi:true,usage:{}});state.explain.mockResolvedValue({summary:"private-ai-output",keyPoints:[],usage:{}});state.builder.mockResolvedValue({definition:{name:"private-ai-output"},notes:[],usage:{}});});
describe("public AI route security boundaries",()=>{
 it("refuses unknown publication authority before any provider or quota access",async()=>{state.snapshot.state="unavailable";const response=await find(request({query:"investment"}));expect(response.status).toBe(503);expect(await response.json()).toEqual({error:"Calculator availability is temporarily unavailable. Please try again."});expect(state.consume).not.toHaveBeenCalled();expect(state.find).not.toHaveBeenCalled();});
 it("uses public deterministic fallback without exposing provider diagnostics",async()=>{state.find.mockRejectedValue(new Error("private-provider-token"));const response=await find(request({query:"sip investment"}));const body=await response.json();expect(response.status).toBe(200);expect(body.usedAi).toBe(false);expect(body.recommendations.every((item:{slug:string})=>item.slug==="sip-calculator")).toBe(true);expect(JSON.stringify(body)).not.toContain("private-provider-token");expect(state.finish).toHaveBeenCalledTimes(1);});
 it("discards finder output when success accounting fails and never finalizes twice",async()=>{state.finish.mockRejectedValue(new Error("private-accounting-detail"));const response=await find(request({query:"sip investment"}));const body=await response.json();expect(body.usedAi).toBe(false);expect(JSON.stringify(body)).not.toMatch(/private-ai-output|private-accounting-detail/);expect(state.finish).toHaveBeenCalledTimes(1);});
 for(const route of routes){
  it(`${route.name} returns bounded JSON when failure accounting also fails`,async()=>{state.explain.mockRejectedValue(new Error("private-provider-token"));state.builder.mockRejectedValue(new Error("private-provider-token"));state.finish.mockRejectedValue(new Error("private-accounting-detail"));const response=await route.post(request(route.body));expect(response.status).toBe(503);expect(JSON.stringify(await response.json())).not.toMatch(/private-provider-token|private-accounting-detail/);expect(state.finish).toHaveBeenCalledTimes(1);});
  it(`${route.name} discards output on success accounting failure exactly once`,async()=>{state.finish.mockRejectedValue(new Error("private-accounting-detail"));const response=await route.post(request(route.body));expect(response.status).toBe(503);expect(JSON.stringify(await response.json())).not.toContain("private-ai-output");expect(state.finish).toHaveBeenCalledTimes(1);});
  it(`${route.name} rejects malformed requests before quota access`,async()=>{const response=await route.post(request({}));expect(response.status).toBe(400);expect(state.consume).not.toHaveBeenCalled();});
 }
});

it.each([403,429] as const)("retains classified access status %s for every route without provider access",async status=>{
 state.consume.mockRejectedValue(new AiAccessError(status===429?"AI request rate limit reached":"Business plan required",status));
 for(const route of [{post:find,body:{query:"sip investment"}},...routes]){const response=await route.post(request(route.body));expect(response.status).toBe(status);}
 expect(state.find).not.toHaveBeenCalled();expect(state.explain).not.toHaveBeenCalled();expect(state.builder).not.toHaveBeenCalled();expect(state.finish).not.toHaveBeenCalled();
});
it("preserves successful metered outputs with one finalization",async()=>{
 for(const route of routes){state.finish.mockClear();const response=await route.post(request(route.body));expect(response.status).toBe(200);expect(JSON.stringify(await response.json())).toContain("private-ai-output");expect(state.finish).toHaveBeenCalledTimes(1);expect(state.finish.mock.calls[0][2]).toBe(true);}
});
it("does not misclassify provider syntax failures as malformed client requests",async()=>{state.explain.mockRejectedValue(new SyntaxError("private provider JSON"));const response=await explain(request(routes[0].body));expect(response.status).toBe(503);});
it("rejects malformed JSON with a bounded client error",async()=>{const response=await explain(new Request("https://synthetic.invalid",{method:"POST",body:"{"}));expect(response.status).toBe(400);expect(state.consume).not.toHaveBeenCalled();});
it.each(["anonymous","unconfigured"])("preserves deterministic finder for %s access",async kind=>{if(kind==="anonymous")state.session.mockResolvedValue(null);else state.provider.mockReturnValue(null);const response=await find(request({query:"sip investment"}));expect(response.status).toBe(200);const body=await response.json();expect(body.usedAi).toBe(false);expect(body.recommendations).toHaveLength(1);expect(state.consume).not.toHaveBeenCalled();});
it("does not confuse a known empty publication set with unavailable authority",async()=>{state.snapshot.slugs=new Set();state.provider.mockReturnValue(null);const response=await find(request({query:"sip investment"}));expect(response.status).toBe(200);expect(await response.json()).toEqual({recommendations:[],usedAi:false});});
