import {beforeEach,expect,it,vi} from 'vitest';
const fixture=vi.hoisted(()=>({quota:true as unknown,error:false,updates:0,calls:0}));
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>({
 from:()=>{const chain={select:()=>chain,eq:()=>chain,maybeSingle:async()=>({error:null,data:{id:'key',organization_id:'org',status:'active',scopes:['calculations:batch'],monthly_quota:10,rate_limit_per_minute:5}}),update:()=>{fixture.updates++;return chain;}};return chain;},
 rpc:async()=>{fixture.calls++;return {data:fixture.quota,error:fixture.error?{message:'private storage diagnostic'}:null};}
})}));
import {authenticateApiRequest,verifyApiRequest} from './auth';
const request=()=>new Request('http://localhost/api/v1/batch',{headers:{Authorization:'Bearer synthetic-only-test-key'}});
beforeEach(()=>{fixture.quota=true;fixture.error=false;fixture.updates=0;fixture.calls=0;});
it.each([null,undefined,0,1,'true','false',{},[]].map(value=>({value})))('rejects malformed quota acknowledgement $value before authorizing',async({value})=>{fixture.quota=value;await expect(authenticateApiRequest(request(),'calculations:batch')).rejects.toMatchObject({status:503});expect(fixture.updates).toBe(0);});
it('preserves explicit quota refusal',async()=>{fixture.quota=false;await expect(authenticateApiRequest(request(),'calculations:batch')).rejects.toMatchObject({status:429});expect(fixture.updates).toBe(0);});
it('accepts only the affirmative boolean quota acknowledgement',async()=>{await expect(authenticateApiRequest(request(),'calculations:batch')).resolves.toMatchObject({keyId:'key',organizationId:'org'});expect(fixture.updates).toBe(1);});
it('does not expose quota storage diagnostics',async()=>{fixture.error=true;await expect(authenticateApiRequest(request(),'calculations:batch')).rejects.toMatchObject({status:503,message:'Usage metering unavailable'});});

it('atomic batch can verify identity without pre-debit or metadata writes',async()=>{const principal=await verifyApiRequest(request(),'calculations:batch');expect(principal.keyHash).toMatch(/^[0-9a-f]{64}$/);expect(fixture.calls).toBe(0);expect(fixture.updates).toBe(0);});
it('ordinary metered principal does not expose the verification hash',async()=>{const principal=await authenticateApiRequest(request(),'calculations:batch');expect(principal).not.toHaveProperty('keyHash');expect(fixture.calls).toBe(1);});
