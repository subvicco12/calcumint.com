// @vitest-environment jsdom
import {beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,cleanup} from '@testing-library/react';
import Page from './page';
const boundary=vi.hoisted(()=>({create:vi.fn(),redirect:vi.fn(),portal:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:boundary.create}));
vi.mock('next/navigation',()=>({redirect:boundary.redirect}));
vi.mock('@/components/calculator-factory-portal',()=>({CalculatorFactoryPortal:(props:unknown)=>{boundary.portal(props);return <p>Authorized portal transport fixture</p>;}}));
beforeEach(()=>{boundary.redirect.mockImplementation(()=>{throw Error('REDIRECT');});});
afterEach(()=>{cleanup();vi.resetAllMocks();});
function client({user={id:'owner'},authError=null,admin={active:true,role:'reviewer'},adminError=null,profile={plan:'pro'},profileError=null}:{user?:{id:string}|null;authError?:unknown;admin?:{active:boolean;role:string}|null;adminError?:unknown;profile?:{plan:string}|null;profileError?:unknown}={}){
 const eq=vi.fn(),from=vi.fn((table:string)=>({select:vi.fn(()=>({eq:(column:string,id:string)=>{eq(table,column,id);return {maybeSingle:vi.fn().mockResolvedValue(table==='platform_admins'?{data:admin,error:adminError}:{data:profile,error:profileError})};}}))}));
 boundary.create.mockResolvedValue({auth:{getUser:vi.fn().mockResolvedValue({data:{user},error:authError})},from});return {eq,from};
}
describe('private admin page fail-closed control flow (mock transport; no genuine session proof)',()=>{
 it('does not render the portal when server client is unavailable',async()=>{boundary.create.mockResolvedValue(null);render(await Page());expect(screen.getByText('Engineering factory unavailable')).toBeTruthy();expect(boundary.portal).not.toHaveBeenCalled();});
 it.each([{user:null},{authError:{message:'expired'}}])('redirects absent or rejected getUser before admin queries: %j',async options=>{const c=client(options);await expect(Page()).rejects.toThrow('REDIRECT');expect(boundary.redirect).toHaveBeenCalledWith('/login');expect(c.from).not.toHaveBeenCalled();expect(boundary.portal).not.toHaveBeenCalled();});
 it.each([{admin:null},{admin:{active:false,role:'owner'}},{admin:{active:true,role:'viewer'}},{adminError:{message:'database unavailable'}}])('denies unavailable/inactive/unsupported admin evidence: %j',async options=>{const c=client(options);render(await Page());expect(screen.getByText('Authorized engineering review access required')).toBeTruthy();expect(c.from).not.toHaveBeenCalledWith('profiles');expect(boundary.portal).not.toHaveBeenCalled();});
 it('denies entitlement read errors before rendering the portal',async()=>{client({profileError:{message:'unavailable'}});render(await Page());expect(screen.getByText('Account entitlements unavailable')).toBeTruthy();expect(boundary.portal).not.toHaveBeenCalled();});
 it('uses existing schema keys and passes server-derived owner and normalized plan',async()=>{const c=client({profile:{plan:'unrecognized'}});render(await Page());expect(c.eq.mock.calls).toEqual([['platform_admins','user_id','owner'],['profiles','id','owner']]);expect(boundary.portal).toHaveBeenCalledWith({ownerId:'owner',plan:'free'});});
});
