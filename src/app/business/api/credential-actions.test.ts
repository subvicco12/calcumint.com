import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({owner:'owner-a',inserts:[] as unknown[],updates:[] as unknown[],redirect:vi.fn()}));
vi.mock('next/navigation',()=>({redirect:state.redirect}));
vi.mock('next/cache',()=>({revalidatePath:vi.fn()}));
vi.mock('@/lib/env',()=>({serverEnv:{WEBHOOK_ENCRYPTION_KEY:'test'}}));
vi.mock('@/lib/api/webhooks',()=>({encryptWebhookSecret:()=> 'encrypted'}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:{id:state.owner}}})},from:(table:string)=>{const q={select:()=>q,eq:()=>q,limit:async()=>({data:[{organization_id:'org-a',role:'owner'}]}),maybeSingle:async()=>({data:{plan:'business'}}),update:(value:unknown)=>{state.updates.push({table,value});return {eq:()=>({eq:async()=>({error:null})})};},insert:async(value:unknown)=>{state.inserts.push({table,value});return {error:null};}};return q;}})}));
import {createBusinessApiKey,createWebhookEndpoint,revokeBusinessApiKey,disableWebhookEndpoint} from './actions';
function data(){const d=new FormData();d.set('expectedOwnerId','owner-a');d.set('name','Automation');d.set('scopes','calculations:run');d.set('webhookName','Automation');d.set('endpointUrl','https://example.com/hook');d.set('eventTypes','lead.created');return d;}
beforeEach(()=>{state.owner='owner-a';state.inserts=[];state.updates=[];state.redirect.mockClear();});
it.each([createBusinessApiKey,createWebhookEndpoint])('returns credentials without URL redirects',async action=>{const result=await action(data());expect(result.secret).toBeTruthy();expect(state.redirect).not.toHaveBeenCalled();expect(JSON.stringify(state.inserts)).not.toContain(result.secret);});
it.each([createBusinessApiKey,createWebhookEndpoint])('rejects stale owners before inserting',async action=>{state.owner='owner-b';await expect(action(data())).rejects.toThrow();expect(state.inserts).toHaveLength(0);});
it.each([['scopes','unknown:scope'],['rateLimit','0'],['monthlyQuota','10000001'],['name','x']])('rejects invalid API %s before writing',async(field,value)=>{const form=data();form.set(field,value);await expect(createBusinessApiKey(form)).rejects.toThrow();expect(state.inserts).toHaveLength(0);});
it('preserves selected allowed scopes and filters forged scopes',async()=>{const form=data();form.append('scopes','unknown:scope');await createBusinessApiKey(form);expect(state.inserts[0]).toMatchObject({value:{organization_id:'org-a',scopes:['calculations:run'],created_by:'owner-a'}});});
it.each([['endpointUrl','http://example.com'],['endpointUrl','invalid'],['eventTypes','unknown'],['webhookName','x']])('rejects invalid webhook %s before writing',async(field,value)=>{const form=data();form.set(field,value);await expect(createWebhookEndpoint(form)).rejects.toThrow();expect(state.inserts).toHaveLength(0);});
it.each([createBusinessApiKey,createWebhookEndpoint])('requires explicit rendered owner context',async action=>{const form=data();form.delete('expectedOwnerId');await expect(action(form)).rejects.toThrow();expect(state.inserts).toHaveLength(0);});

const revocations=[revokeBusinessApiKey,disableWebhookEndpoint];
function revocationData(){const form=data();form.set('keyId','key-a');form.set('endpointId','endpoint-a');return form;}
it.each(revocations)('rejects stale rendered owners before revoking automation',async action=>{state.owner='owner-b';await expect(action(revocationData())).rejects.toThrow('Account session changed');expect(state.updates).toHaveLength(0);});
it.each(revocations)('requires rendered owner context before revoking automation',async action=>{const form=revocationData();form.delete('expectedOwnerId');await expect(action(form)).rejects.toThrow('Account session changed');expect(state.updates).toHaveLength(0);});
it.each(revocations)('allows the current owner to revoke automation',async action=>{await action(revocationData());expect(state.updates).toHaveLength(1);});
