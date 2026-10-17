import {beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({client:vi.fn(),password:vi.fn(),signup:vi.fn(),oauth:vi.fn(),signout:vi.fn()}));
vi.mock('@/lib/env',()=>({publicEnv:{NEXT_PUBLIC_SITE_URL:'https://app.example.invalid'}}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:state.client}));
vi.mock('next/navigation',()=>({redirect:(path:string)=>{throw new Error(`REDIRECT:${path}`);}}));
import {signIn,signUp,signInWithGoogle,signOut} from './actions';
beforeEach(()=>{vi.resetAllMocks();state.client.mockResolvedValue({auth:{signInWithPassword:state.password,signUp:state.signup,signInWithOAuth:state.oauth,signOut:state.signout}});state.password.mockResolvedValue({error:null});state.signup.mockResolvedValue({error:null});state.oauth.mockResolvedValue({data:{url:'https://provider.example.invalid'},error:null});});
function form(password:string){const data=new FormData();data.set('email',' synthetic@example.invalid ');data.set('password',password);data.set('displayName',' Synthetic ');return data;}
it.each([' leading-and-trailing ','        '])('preserves the exact password bytes on sign in for %j',async password=>{
 await expect(signIn(form(password))).rejects.toThrow('REDIRECT:/account');
 expect(state.password).toHaveBeenCalledWith({email:'synthetic@example.invalid',password});
});
it('preserves password whitespace on signup without changing the eight-character minimum',async()=>{
 const password=' abcdef ';
 await expect(signUp(form(password))).rejects.toThrow('REDIRECT:/login?message=');
 expect(state.signup).toHaveBeenCalledWith(expect.objectContaining({password,email:'synthetic@example.invalid',options:expect.objectContaining({data:{display_name:'Synthetic'}})}));
});
it.each([signIn,signUp,signInWithGoogle,signOut])('returns to login on unavailable authentication client for %s',async action=>{
 state.client.mockRejectedValue(new Error('synthetic transport failure'));
 await expect(action(form('synthetic-password'))).rejects.toThrow('REDIRECT:/login?error=Authentication%20is%20temporarily%20unavailable.%20Try%20again.');
});
it.each([[signIn,'password'],[signUp,'signup'],[signInWithGoogle,'oauth']] as const)('returns to login on rejected provider request for %s',async(action,method)=>{
 state[method].mockRejectedValue(new Error('synthetic transport failure'));
 await expect(action(form('synthetic-password'))).rejects.toThrow('REDIRECT:/login?error=Authentication%20is%20temporarily%20unavailable.%20Try%20again.');
});
it('keeps returned authentication errors and successful OAuth redirects intact',async()=>{
 state.password.mockResolvedValue({error:{message:'Invalid credentials'}});
 await expect(signIn(form('synthetic-password'))).rejects.toThrow('REDIRECT:/login?error=Invalid%20credentials');
 await expect(signInWithGoogle()).rejects.toThrow('REDIRECT:https://provider.example.invalid');
});

it('does not claim sign-out success when the provider rejects logout',async()=>{
 state.signout.mockResolvedValue({error:{message:'synthetic logout failure'}});
 await expect(signOut()).rejects.toThrow('REDIRECT:/login?error=Could%20not%20sign%20out.%20Try%20again.');
});
it('offers recovery on a rejected sign-out transport request',async()=>{
 state.signout.mockRejectedValue(new Error('synthetic transport failure'));
 await expect(signOut()).rejects.toThrow('REDIRECT:/login?error=Authentication%20is%20temporarily%20unavailable.%20Try%20again.');
});
it('preserves successful logout and missing-configuration behavior',async()=>{
 state.signout.mockResolvedValue({error:null});await expect(signOut()).rejects.toThrow('REDIRECT:/');
 state.client.mockResolvedValue(null);await expect(signOut()).rejects.toThrow('REDIRECT:/');
});
