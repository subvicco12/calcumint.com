import { beforeEach, expect, it, vi } from 'vitest';
const id='11111111-1111-4111-8111-111111111111',requestId='22222222-2222-4222-8222-222222222222';
const state=vi.hoisted(()=>({error:false,missing:false,readError:false,denied:false,restWrites:0,rpcCalls:[] as {name:string,args:Record<string,unknown>}[],existing:false,lost:false,wrongAck:false,ack:'22222222-2222-4222-8222-222222222222'}));
vi.mock('@/lib/api/auth',()=>{class ApiAuthError extends Error{status=429;}return {verifyApiRequest:async()=>{if(state.denied)throw new ApiAuthError('Quota exhausted');return {organizationId:'org',keyId:'key',keyHash:'verified-hash'};},ApiAuthError};});
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>({from:(table:string)=>{
 const chain={select:()=>chain,eq:()=>chain,maybeSingle:async()=>({data:table==='custom_calculators'?{published_version:2}:{definition:{name:'Example',fields:[{key:'x',label:'Value',type:'number'}],outputs:[{key:'answer',label:'Answer',formula:'x*2'}]}},error:state.readError?{message:'private detail'}:null}),insert:()=>{state.restWrites++;throw Error('No REST fallback');}};return chain;},
 rpc:async(name:string,args:Record<string,unknown>)=>{state.rpcCalls.push({name,args});if(state.error)return {data:null,error:{code:'TRANSPORT',message:'private detail'}};
 if(name==='read_verified_batch_job_v1')return {data:state.existing?{status:'completed',request_id:state.wrongAck?id:state.ack,job:{id,calculator_id:id,calculator_version:1,output_rows:[{index:0,ok:true,output:{answer:6}}]}}:{status:'missing'},error:null};
 if(args.p_output_rows===null&&!state.existing)return {data:{status:'missing'},error:null};
 state.existing=true;if(state.lost){state.lost=false;throw Error('lost commit reply');}
 return {data:state.missing?null:{status:'completed',request_id:state.wrongAck?id:state.ack,duplicate:args.p_output_rows===null,job:{id,calculator_id:id,calculator_version:args.p_output_rows===null?1:2,output_rows:args.p_output_rows??[{index:0,ok:true,output:{answer:6}}]}},error:null};}
})}));
import {POST,GET} from './route';
const request=(body:unknown={calculatorId:id,rows:[{x:3}]},key=requestId)=>new Request('http://localhost/api/v1/batch',{method:'POST',headers:{'Idempotency-Key':key},body:JSON.stringify(body)});
beforeEach(()=>{state.error=false;state.missing=false;state.readError=false;state.denied=false;state.restWrites=0;state.rpcCalls=[];state.existing=false;state.lost=false;state.wrongAck=false;state.ack=requestId;});
it('never reports success when atomic storage is unavailable',async()=>{state.error=true;const r=await POST(request());expect(r.status).toBe(503);expect(await r.text()).not.toContain('private detail');expect(state.restWrites).toBe(0);});
it('never acknowledges malformed persistence evidence',async()=>{state.missing=true;expect((await POST(request())).status).toBe(503);});
it('fails closed on calculator read outage without persistence',async()=>{state.readError=true;expect((await POST(request())).status).toBe(503);expect(state.rpcCalls).toHaveLength(1);});
it('requires a stable UUID identity before storage',async()=>{expect((await POST(request(undefined,'bad'))).status).toBe(400);expect(state.rpcCalls).toHaveLength(0);});
it('preserves ordered row outputs in one atomic submit',async()=>{const r=await POST(request({calculatorId:id,rows:[{x:3},{x:'invalid'},{x:-2}]}));expect(r.status).toBe(200);const b=await r.json();expect(b.jobId).toBe(id);expect(b.requestId).toBe(requestId);expect(b.rows.map((r:{ok:boolean})=>r.ok)).toEqual([true,false,true]);expect(state.rpcCalls.at(-1)?.args.p_output_rows).toEqual(b.rows);expect(state.restWrites).toBe(0);});
it('replays immutable original version without reading a new definition',async()=>{state.existing=true;state.readError=true;const r=await POST(request());expect(r.status).toBe(200);expect((await r.json()).version).toBe(1);expect(state.rpcCalls).toHaveLength(1);});
it('unknown commit reply returns recovery instructions without a second submit',async()=>{state.lost=true;const r=await POST(request());expect(r.status).toBe(503);expect((await r.json()).requestId).toBe(requestId);expect(state.rpcCalls.filter(c=>c.name==='submit_verified_batch_job_v1')).toHaveLength(2);});
it('GET recovery reads durable job without a quota-writing RPC',async()=>{state.existing=true;const r=await GET(new Request('http://localhost/api/v1/batch',{headers:{'Idempotency-Key':requestId}}));expect(r.status).toBe(200);expect(state.rpcCalls.map(c=>c.name)).toEqual(['read_verified_batch_job_v1']);expect(state.restWrites).toBe(0);});
it('GET missing job is not a success or a write',async()=>{expect((await GET(new Request('http://localhost/api/v1/batch',{headers:{'Idempotency-Key':requestId}}))).status).toBe(404);});
it.each([[],Array.from({length:101},()=>({x:1})),[null]].map(rows=>({rows})))('enforces rows before submit',async ({rows})=>{expect((await POST(request({calculatorId:id,rows}))).status).toBe(400);expect(state.rpcCalls).toHaveLength(0);});

it('rejects numeric JSON overflow rather than silently binding Infinity as null',async()=>{const r=await POST(new Request('http://localhost/api/v1/batch',{method:'POST',headers:{'Idempotency-Key':requestId},body:'{"calculatorId":"'+id+'","rows":[{"x":1e999}]}'}));expect(r.status).toBe(400);expect(state.rpcCalls).toHaveLength(0);});

it('rejects an acknowledgement bound to another request',async()=>{state.existing=true;state.wrongAck=true;expect((await POST(request())).status).toBe(503);});

it.each(['POST','GET'])('correlates PostgreSQL canonical UUID acknowledgements for uppercase %s headers',async(method)=>{state.existing=true;const key='ABCDEFAB-2222-4222-8222-222222222222';state.ack=key.toLowerCase();const r=await (method==='POST'?POST(request(undefined,key)):GET(new Request('http://localhost/api/v1/batch',{headers:{'Idempotency-Key':key}})));expect(r.status).toBe(200);expect((await r.json()).requestId).toBe(key.toLowerCase());});
