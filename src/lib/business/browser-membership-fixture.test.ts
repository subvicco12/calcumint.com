import {beforeEach,describe,expect,it} from 'vitest';
import {createSupabaseServerClient,state} from '../../../tests/business-browser/transport';

beforeEach(()=>Object.assign(state,{role:'owner',member:true,user:true,counts:2,pending:0,failures:[],writes:[]}));
describe('Business browser adapter membership contract',()=>{
 it('returns a scalar role for the exact action membership preflight',async()=>{
  const client=await createSupabaseServerClient();
  const result=await client.from('organization_members').select().eq('organization_id','org-local').eq('user_id','local-user').maybeSingle();
  expect(result.error).toBeNull();expect(result.data).toMatchObject({role:'owner'});expect(Array.isArray(result.data)).toBe(false);
 });
 it('preserves collection reads for the existing page workspace',async()=>{
  const client=await createSupabaseServerClient();
  expect((await client.from('organization_members').select().eq('user_id','local-user')).data).toEqual([{organization_id:'org-local',user_id:'local-user',role:'owner'}]);
 });
 it.each([['organization_id','foreign-org'],['user_id','foreign-user']])('does not grant a scalar membership for another %s',async(field,value)=>{
  const client=await createSupabaseServerClient();
  expect((await client.from('organization_members').select().eq(field,value).maybeSingle()).data).toBeNull();
 });
 it('returns null for a missing member instead of an empty role array',async()=>{
  state.member=false;const client=await createSupabaseServerClient();
  expect((await client.from('organization_members').select().maybeSingle()).data).toBeNull();
 });
 it('returns current downgraded roles rather than authorizing from page state',async()=>{
  const client=await createSupabaseServerClient();state.role='viewer';
  expect((await client.from('organization_members').select().maybeSingle()).data).toMatchObject({role:'viewer'});
 });
});
