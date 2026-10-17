import {afterEach,expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
import {proxy} from '@/proxy';

afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();});
it.each(['base64-!!!!','base64-_w'])('proxy fails closed without throwing for unreadable session bytes %s',async(value)=>{
 vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://synthetic.invalid');
 vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','synthetic-anon');
 const fetch=vi.fn(()=>{throw Error('Unexpected synthetic network request');});vi.stubGlobal('fetch',fetch);
 const request=new NextRequest('https://app.example.invalid/account',{headers:{cookie:`sb-synthetic-auth-token=${value}; sb-synthetic-auth-token-code-verifier=preserved; preferences=preserved`}});
 const response=await proxy(request);
 expect(response.headers.get('x-middleware-next')).toBe('1');
 expect(fetch).not.toHaveBeenCalled();
 expect(request.cookies.get('preferences')?.value).toBe('preserved');
 expect(request.cookies.get('sb-synthetic-auth-token-code-verifier')?.value).toBe('preserved');
});
