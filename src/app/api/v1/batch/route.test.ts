import { beforeEach, expect, it, vi } from 'vitest';
const state=vi.hoisted(()=>({error:false,missing:false,readError:false,denied:false,writes:0}));
const id='11111111-1111-4111-8111-111111111111';
vi.mock('@/lib/api/auth',()=>{class ApiAuthError extends Error{status=429;}return {authenticateApiRequest:async()=>{if(state.denied)throw new ApiAuthError('Quota exhausted');return {organizationId:'org',keyId:'key'};},ApiAuthError};});
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>({from:(table:string)=>{
 const chain={select:()=>chain,eq:()=>chain,maybeSingle:async()=>({data:table==='custom_calculators'?{published_version:2}:{definition:{name:'Example',fields:[{key:'x',label:'Value',type:'number'}],outputs:[{key:'answer',label:'Answer',formula:'x*2'}]}},error:state.readError?{message:'private storage detail'}:null}),
 insert:()=>{state.writes++;return chain;},single:async()=>({data:state.missing?null:{id},error:state.error?{message:'private storage detail'}:null})};return chain;}})}));
import { POST } from './route';
const request=(body:unknown={calculatorId:id,rows:[{x:3}]})=>new Request('http://localhost/api/v1/batch',{method:'POST',body:JSON.stringify(body)});
beforeEach(()=>{state.denied=false;state.error=false;state.missing=false;state.readError=false;state.writes=0;});
it('never reports a successful batch when persistence fails',async()=>{state.error=true;const reply=await POST(request());expect(reply.status).toBe(503);expect(await reply.text()).not.toContain('private storage detail');});
it('never acknowledges a missing persisted job identity',async()=>{state.missing=true;expect((await POST(request())).status).toBe(503);});
it('distinguishes storage outage from calculator absence',async()=>{state.readError=true;expect((await POST(request())).status).toBe(503);expect(state.writes).toBe(0);});
it('rejects non-record rows before calculation or persistence',async()=>{expect((await POST(request({calculatorId:id,rows:[null]}))).status).toBe(400);expect(state.writes).toBe(0);});
it('keeps deterministic ordered successful and invalid row outputs in one persisted job',async()=>{const reply=await POST(request({calculatorId:id,rows:[{x:3},{x:'invalid'},{x:-2}]}));expect(reply.status).toBe(200);const body=await reply.json();expect(body.jobId).toBe(id);expect(body.rows.map((r:{ok:boolean})=>r.ok)).toEqual([true,false,true]);expect(body.rows[0].output.answer).toBe(6);expect(body.rows[2].output.answer).toBe(-4);expect(state.writes).toBe(1);});

it('preserves quota refusal before any persistence',async()=>{state.denied=true;expect((await POST(request())).status).toBe(429);expect(state.writes).toBe(0);});
it.each([[],Array.from({length:101},()=>({x:1}))])('enforces the existing 1-100 row bound',async rows=>{expect((await POST(request({calculatorId:id,rows}))).status).toBe(400);expect(state.writes).toBe(0);});
