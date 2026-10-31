import {beforeEach,expect,it,vi} from "vitest";
const state=vi.hoisted(()=>({rpc:vi.fn(),explain:vi.fn(),plan:"business"}));
vi.mock("@/lib/supabase/server",()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:{id:"synthetic-owner"}}})},from:()=>{const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:{plan:state.plan}})};return query;},rpc:state.rpc})}));
vi.mock("@/lib/ai/service",()=>({explainDeterministicResult:state.explain}));
import {POST as explain} from "@/app/api/ai/explain/route";
import {consumeAiAccess,finishAiUsage} from "./access";
import {AiAccessError} from "./request-errors";
beforeEach(()=>{state.plan="business";state.explain.mockReset().mockResolvedValue({summary:"metered output",keyPoints:[],usage:{}});state.rpc.mockReset().mockResolvedValue({data:1,error:null});});
it("rejects a returned accounting error without exposing its details",async()=>{const access=await consumeAiAccess("finder");state.rpc.mockResolvedValue({error:{message:"private database connection"}});await expect(finishAiUsage(access,undefined,true)).rejects.toThrow("AI usage accounting unavailable");});
it.each(["Monthly AI request limit reached","AI request rate limit reached"])("classifies approved quota denial %s",async message=>{state.rpc.mockResolvedValue({error:{message}});await expect(consumeAiAccess("finder")).rejects.toMatchObject({status:429,message});});
it.each(["Business plan required","Pro or Business plan required","Builder permission required","Authentication required"])("classifies approved authorization denial %s",async message=>{state.rpc.mockResolvedValue({error:{message}});await expect(consumeAiAccess("finder")).rejects.toMatchObject({status:403,message});});
it("keeps arbitrary RPC diagnostics out of public access errors",async()=>{state.rpc.mockResolvedValue({error:{message:"private limit database key"}});try{await consumeAiAccess("finder");throw Error("expected rejection");}catch(error){expect(error).not.toBeInstanceOf(AiAccessError);expect((error as Error).message).toBe("AI access unavailable");}});
it("retains local plan denial before any quota mutation",async()=>{state.plan="free";await expect(consumeAiAccess("builder")).rejects.toMatchObject({status:403,message:"Business plan required"});expect(state.rpc).not.toHaveBeenCalled();});
it.each([null,0,-1,1.5,Number.NaN,Number.MAX_SAFE_INTEGER+1,"private receipt",true,[1],{},"","1.5","1e2"])("rejects invalid quota receipt %s before returning provider access",async data=>{state.rpc.mockResolvedValue({data,error:null});await expect(consumeAiAccess("finder")).rejects.toThrow("AI access unavailable");});
it.each([1,"42"])("accepts a valid positive quota receipt %s",async data=>{state.rpc.mockResolvedValue({data,error:null});await expect(consumeAiAccess("finder")).resolves.toMatchObject({usageId:Number(data)});});

it.each([null,0,Number.NaN,Number.MAX_SAFE_INTEGER+1])("actual explanation route denies malformed receipt %s before provider or finalization",async data=>{
 state.rpc.mockResolvedValue({data,error:null});
 const response=await explain(new Request("https://synthetic.invalid/api/ai/explain",{method:"POST",body:JSON.stringify({calculatorName:"Synthetic",values:{},result:{}})}));
 expect(response.status).toBe(503);expect(await response.json()).toEqual({error:"AI assistance is temporarily unavailable. Please try again."});expect(state.explain).not.toHaveBeenCalled();expect(state.rpc.mock.calls.map(call=>call[0])).toEqual(["consume_ai_quota"]);
});
it("actual explanation route discards provider output on returned finalization error",async()=>{
 state.rpc.mockImplementation(async name=>name==="consume_ai_quota"?{data:42,error:null}:{error:{message:"private finalization key"}});
 const response=await explain(new Request("https://synthetic.invalid/api/ai/explain",{method:"POST",body:JSON.stringify({calculatorName:"Synthetic",values:{},result:{}})}));
 expect(response.status).toBe(503);expect(await response.json()).toEqual({error:"AI assistance is temporarily unavailable. Please try again."});expect(state.rpc.mock.calls.map(call=>call[0])).toEqual(["consume_ai_quota","finish_ai_usage"]);
});
