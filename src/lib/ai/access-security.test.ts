import {beforeEach,expect,it,vi} from "vitest";
import {createClient,AuthSessionMissingError,isAuthSessionMissingError} from "@supabase/supabase-js";
const state=vi.hoisted(()=>({rpc:vi.fn(),explain:vi.fn(),find:vi.fn(),builder:vi.fn(),provider:vi.fn(),profileRead:vi.fn(),authError:null as unknown,profileError:null as unknown,anonymous:false,plan:"business"}));
vi.mock("@/lib/supabase/server",()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:state.anonymous?null:{id:"synthetic-owner"}},error:state.authError})},from:()=>{state.profileRead();const query={select:()=>query,eq:()=>query,maybeSingle:async()=>({data:{plan:state.plan},error:state.profileError})};return query;},rpc:state.rpc})}));
vi.mock("@/lib/ai/service",()=>({explainDeterministicResult:state.explain,findCalculatorWithAi:state.find,proposeBuilderDefinition:state.builder}));
vi.mock("@/lib/ai/provider",()=>({getAiProvider:state.provider}));
vi.mock("@/lib/publication-manifest",()=>({getPublicationSnapshot:async()=>({state:"available",slugs:new Set(["sip-calculator"])})}));
import {POST as find} from "@/app/api/ai/find/route";
import {POST as builder} from "@/app/api/ai/builder-assist/route";
import {POST as explain} from "@/app/api/ai/explain/route";
import {consumeAiAccess,finishAiUsage} from "./access";
import {AiAccessError} from "./request-errors";
beforeEach(()=>{state.authError=null;state.profileError=null;state.anonymous=false;state.provider.mockReset().mockReturnValue({});state.profileRead.mockReset();state.find.mockReset().mockResolvedValue({recommendations:[],usedAi:true,usage:{}});state.builder.mockReset().mockResolvedValue({definition:{},notes:[],usage:{}});state.plan="business";state.explain.mockReset().mockResolvedValue({summary:"metered output",keyPoints:[],usage:{}});state.rpc.mockReset().mockResolvedValue({data:1,error:null});});
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

const actualRoutes=[{name:"finder",post:find,body:{query:"sip investment"}},{name:"explanation",post:explain,body:{calculatorName:"Synthetic",values:{},result:{}}},{name:"builder",post:builder,body:{prompt:"A synthetic calculator"}}];
const aiRequest=(body:unknown)=>new Request("https://synthetic.invalid/api/ai",{method:"POST",body:JSON.stringify(body)});
for(const route of actualRoutes){
 it.each(["authentication","profile"])(`actual ${route.name} rejects %s errors even with accompanying authorized data`,async kind=>{
  if(kind==="authentication")state.authError={message:"private auth credentials"};else state.profileError={message:"private profile credentials"};
  const response=await route.post(aiRequest(route.body));
  expect(response.status).toBe(503);expect(await response.json()).toEqual({error:"AI assistance is temporarily unavailable. Please try again."});
  expect(state.rpc).not.toHaveBeenCalled();expect(state.find).not.toHaveBeenCalled();expect(state.explain).not.toHaveBeenCalled();expect(state.builder).not.toHaveBeenCalled();
  if(kind==="authentication")expect(state.profileRead).not.toHaveBeenCalled();
 });
}
it("preserves ordinary anonymous finder fallback without quota or provider use",async()=>{state.anonymous=true;const response=await find(aiRequest({query:"sip investment"}));expect(response.status).toBe(200);const body=await response.json();expect(body.usedAi).toBe(false);expect(body.recommendations).toHaveLength(1);expect(state.rpc).not.toHaveBeenCalled();expect(state.find).not.toHaveBeenCalled();expect(state.profileRead).not.toHaveBeenCalled();});
it("preserves anonymous premium access denial",async()=>{state.anonymous=true;const response=await explain(aiRequest(actualRoutes[1].body));expect(response.status).toBe(403);expect(state.rpc).not.toHaveBeenCalled();expect(state.explain).not.toHaveBeenCalled();});
it("preserves provider-disabled deterministic finder without consulting failed account data",async()=>{state.provider.mockReturnValue(null);state.authError={message:"private auth credentials"};state.profileError={message:"private profile credentials"};const response=await find(aiRequest({query:"sip investment"}));expect(response.status).toBe(200);const body=await response.json();expect(body.usedAi).toBe(false);expect(body.recommendations).toHaveLength(1);expect(state.rpc).not.toHaveBeenCalled();expect(state.find).not.toHaveBeenCalled();expect(state.profileRead).not.toHaveBeenCalled();});

it("preserves actual SDK missing-session behavior without network, quota or provider calls",async()=>{
 const transport=vi.fn(async()=>{throw new Error("Unexpected network access");});
 const client=createClient("https://synthetic.invalid","synthetic-anon-key",{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{fetch:transport}});
 const result=await client.auth.getUser();
 expect(result.data.user).toBeNull();expect(isAuthSessionMissingError(result.error)).toBe(true);expect(transport).not.toHaveBeenCalled();
 state.anonymous=true;state.authError=result.error;
 const finder=await find(aiRequest(actualRoutes[0].body));expect(finder.status).toBe(200);const payload=await finder.json();expect(payload.usedAi).toBe(false);expect(payload.recommendations).toHaveLength(1);
 for(const route of actualRoutes.slice(1)){const response=await route.post(aiRequest(route.body));expect(response.status).toBe(403);expect(await response.json()).toEqual({error:"Sign in to use AI-assisted features"});}
 expect(state.rpc).not.toHaveBeenCalled();expect(state.profileRead).not.toHaveBeenCalled();expect(state.find).not.toHaveBeenCalled();expect(state.explain).not.toHaveBeenCalled();expect(state.builder).not.toHaveBeenCalled();expect(transport).not.toHaveBeenCalled();
});
it.each(["unexpected anonymous error","user with missing-session error"])("rejects %s despite anonymous compatibility",async kind=>{
 state.anonymous=kind==="unexpected anonymous error";state.authError=state.anonymous?new Error("Auth session missing!"):new AuthSessionMissingError();
 for(const route of actualRoutes){const response=await route.post(aiRequest(route.body));expect(response.status).toBe(503);expect(await response.json()).toEqual({error:"AI assistance is temporarily unavailable. Please try again."});}
 expect(state.rpc).not.toHaveBeenCalled();expect(state.profileRead).not.toHaveBeenCalled();expect(state.find).not.toHaveBeenCalled();expect(state.explain).not.toHaveBeenCalled();expect(state.builder).not.toHaveBeenCalled();
});
