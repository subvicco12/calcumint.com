import {afterEach,expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
const external=vi.hoisted(()=>({create:vi.fn(()=>{throw Error('Account client constructed');})}));
vi.mock('@supabase/ssr',()=>({createServerClient:external.create}));
import {proxy} from '@/proxy';
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks();});
it.each(['public-only','invalid'])('does not refresh existing sessions in %s mode',async mode=>{
 vi.stubEnv('CALCUMINT_PRODUCT_MODE',mode);vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://synthetic.invalid');vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','synthetic');
 const request=new NextRequest('http://localhost/',{headers:{cookie:'sb-synthetic-auth-token=synthetic-session'}});
 const response=await proxy(request);expect(response.headers.get('x-middleware-next')).toBe('1');expect(external.create).not.toHaveBeenCalled();
});
