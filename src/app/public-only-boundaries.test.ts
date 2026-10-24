import {renderToStaticMarkup} from 'react-dom/server';
import {afterEach,describe,expect,it,vi} from 'vitest';
vi.mock('server-only',()=>({}));
const network=vi.hoisted(()=>({account:vi.fn(()=>{throw new Error('Unexpected account client');})}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:network.account}));
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:network.account}));
const pages=import.meta.glob('./**/page.tsx');
const routes=import.meta.glob('./**/route.ts');
const actions=import.meta.glob('./**/*actions.ts');
afterEach(()=>{vi.unstubAllEnvs();vi.unstubAllGlobals();vi.clearAllMocks();});
describe.each(['public-only','invalid'])('%s executable boundaries',mode=>{
 for(const [path,load] of Object.entries(pages).filter(([p])=>/^\.\/(login|account|business|admin|ai|pricing|business-platform|embed|share)\//.test(p)))it(`renders unavailable before private reads in ${path}`,async()=>{
  vi.stubEnv('CALCUMINT_PRODUCT_MODE',mode);
  const loaded=await load() as {default:(props:unknown)=>Promise<import('react').ReactNode>;generateMetadata?:()=>unknown};
  expect(renderToStaticMarkup(await loaded.default({}))).toContain('Feature unavailable in this release');
  expect(network.account).not.toHaveBeenCalled();
 });
 for(const [path,load] of Object.entries(routes).filter(([p])=>p!=='./health/route.ts'))it(`denies all HTTP handlers in ${path}`,async()=>{
  vi.stubEnv('CALCUMINT_PRODUCT_MODE',mode);
  vi.stubEnv('PADDLE_API_KEY','synthetic-present');vi.stubEnv('AI_API_KEY','synthetic-present');vi.stubEnv('ADMIN_WORKER_SECRET','synthetic-present');
  const fetch=vi.fn(()=>{throw new Error('Unexpected network');});vi.stubGlobal('fetch',fetch);
  const loaded=await load() as Record<string,unknown>;
  for(const method of ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS']){
   const handler=loaded[method];if(typeof handler!=='function')continue;
   const response=await handler(new Request('http://localhost/blocked?CALCUMINT_PRODUCT_MODE=full',{method:method==='GET'?'GET':'POST',headers:{authorization:'Bearer synthetic-valid-looking'}}),{params:Promise.resolve({key:'known',calculatorId:'known'})});
   expect(response.status).toBe(503);expect(response.headers.get('cache-control')).toBe('no-store');expect(await response.json()).toEqual({error:'Feature unavailable in this release'});
  }
  expect(network.account).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();
 });
 for(const [path,load] of Object.entries(actions))it(`denies every exported action in ${path} before reading payload`,async()=>{
  vi.stubEnv('CALCUMINT_PRODUCT_MODE',mode);
  const loaded=await load() as Record<string,unknown>;
  for(const action of Object.values(loaded))if(typeof action==='function')await expect(action(undefined,undefined)).rejects.toThrow('Feature unavailable in this release');
  expect(network.account).not.toHaveBeenCalled();
 });
});
