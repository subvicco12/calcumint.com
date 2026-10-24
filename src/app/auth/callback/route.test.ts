import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({client:vi.fn(),exchange:vi.fn()}));
vi.mock('@/lib/env',()=>({publicEnv:{NEXT_PUBLIC_SITE_URL:'https://app.example.invalid'}}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:state.client}));
import {GET} from './route';
beforeEach(()=>{vi.resetAllMocks();state.client.mockResolvedValue({auth:{exchangeCodeForSession:state.exchange}});state.exchange.mockResolvedValue({error:null});});
function request(next:string,code='synthetic-code'){const url=new URL('https://listener.example.invalid/auth/callback');url.searchParams.set('code',code);url.searchParams.set('next',next);return new Request(url);}
it.each(['/\\outside.example.invalid','/\t/outside.example.invalid','/\n/outside.example.invalid','//outside.example.invalid'])('keeps callback destination on configured origin for %j',async next=>{
 const result=await GET(request(next));expect(result.headers.get('location')).toBe('https://app.example.invalid/account');
});
it.each(['/account','/account?tab=history#saved','/calculators/slope-calculator'])('preserves ordinary local callback destination %j',async next=>{
 expect((await GET(request(next))).headers.get('location')).toBe(`https://app.example.invalid${next}`);
});
it.each(['client','exchange'] as const)('recovers from rejected %s without authenticating or redirecting externally',async failure=>{
 state[failure].mockRejectedValue(new Error('synthetic unavailable'));
 expect((await GET(request('/account'))).headers.get('location')).toBe('https://app.example.invalid/login?error=Authentication%20callback%20failed.');
});
it('does not create an auth client or exchange without a code',async()=>{
 await GET(request('/account',''));
 expect(state.client).not.toHaveBeenCalled();expect(state.exchange).not.toHaveBeenCalled();
});
it('keeps explicit exchange failure on the login page',async()=>{
 state.exchange.mockResolvedValue({error:{message:'Expired code'}});
 expect((await GET(request('/account'))).headers.get('location')).toBe('https://app.example.invalid/login?error=Authentication%20callback%20failed.');
});
it('does not expose returned provider details in the callback recovery URL',async()=>{
 state.exchange.mockResolvedValue({error:{message:'synthetic-sensitive-session-detail'}});
 const location=(await GET(request('/account'))).headers.get('location');expect(location).toContain('https://app.example.invalid/login?error=');expect(location).not.toContain('synthetic-sensitive-session-detail');
});
it('sends invalid recovery callbacks to a fixed safe link-unavailable state',async()=>{state.exchange.mockResolvedValue({error:{message:'private expired/replayed provider detail'}});expect((await GET(request('/login/reset'))).headers.get('location')).toBe('https://app.example.invalid/login/reset?invalid=1');});
it('does not carry arbitrary recovery destination queries or fragments forward',async()=>{expect((await GET(request('/login/reset?next=https://outside.example.invalid#private'))).headers.get('location')).toBe('https://app.example.invalid/login/reset');});
