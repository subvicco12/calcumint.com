// @vitest-environment jsdom
import {readFileSync} from 'node:fs';
import {beforeEach,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {decodeDraftHistoryCursor,encodeDraftHistoryCursor} from '@/lib/draft-history-pagination';
const state=vi.hoisted(()=>({user:{id:'owner-a'} as {id:string}|null,error:null as unknown,rows:[] as unknown[],readError:null as unknown,filters:[] as string[],orders:[] as string[],table:'',select:'',limit:0,seek:'',reject:false,authReject:false}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>{if(state.authReject)throw Error('secret auth');return {data:{user:state.user},error:state.error};}},from:(table:string)=>{state.table=table;const q={select:(fields:string)=>{state.select=fields;return q;},eq:(key:string,value:string)=>{state.filters.push(`${key}:${value}`);return q;},order:(key:string,options:{ascending:boolean})=>{state.orders.push(`${key}:${options.ascending}`);return q;},or:(filter:string)=>{state.seek=filter;return q;},limit:async(limit:number)=>{state.limit=limit;if(state.reject)throw Error('secret read');return {data:state.rows,error:state.readError};}};return q;}})}));
vi.mock('next/navigation',()=>({redirect:()=>{throw Error('LOGIN_REDIRECT');}}));
vi.mock('@/components/account-session-boundary',()=>({AccountSessionBoundary:({ownerId,children}:{ownerId:string;children:React.ReactNode})=><div data-owner={ownerId}>{children}</div>}));
import HistoryPage from './page';
const row=(index:number)=>({id:`11111111-1111-4111-8111-${String(index).padStart(12,'0')}`,calculator_slug:'slope-calculator',calculator_version:1,created_at:'2026-10-20T12:00:00.123456+00:00'});
const cursor=(patch={})=>encodeDraftHistoryCursor({v:1,owner:'owner-a',source:'history',limit:20,createdAt:row(20).created_at,id:row(20).id,...patch});
const render=async(params:{source?:string;cursor?:string}={})=>renderToStaticMarkup(await HistoryPage({searchParams:Promise.resolve(params)}));
beforeEach(()=>Object.assign(state,{user:{id:'owner-a'},error:null,rows:[row(1)],readError:null,filters:[],orders:[],table:'',select:'',limit:0,seek:'',reject:false,authReject:false}));
it('browses metadata only with owner filtering and deterministic bounded ordering',async()=>{const html=await render();expect(state.table).toBe('calculation_history');expect(state.filters).toEqual(['user_id:owner-a']);expect(state.orders).toEqual(['created_at:false','id:false']);expect(state.limit).toBe(21);expect(state.select).not.toContain('input_data');expect(state.select).not.toContain('output_data');expect(html).toContain('version 1');expect(html).toContain(`/account/saved?source=history&amp;id=${row(1).id}`);expect(html).toContain('data-owner="owner-a"');expect(html).not.toContain('Next page');});
it('uses the20th row cursor and retains microseconds without showing the21st row',async()=>{state.rows=Array.from({length:21},(_,i)=>row(i+1));const html=await render();const next=html.match(/href="\/account\/history\?source=history&amp;cursor=([^"]+)"/);expect(next).not.toBeNull();const decoded=decodeDraftHistoryCursor(decodeURIComponent(next![1]),'owner-a','history',20);expect(decoded.createdAt).toBe('2026-10-20T12:00:00.123456+00:00');expect(decoded.id).toBe(row(20).id);expect(html).not.toContain(row(21).id);});
it('seeks by original fractional timestamp andID with no offset query',async()=>{await render({cursor:cursor()});expect(state.seek).toBe(`created_at.lt."${row(20).created_at}",and(created_at.eq."${row(20).created_at}",id.lt.${row(20).id})`);});
it('switches to saved scenarios with source-reset navigation',async()=>{state.rows=[{...row(1),name:'Recorded scenario'}];const html=await render({source:'scenario'});expect(state.table).toBe('saved_scenarios');expect(html).toContain('Recorded scenario');expect(html).toContain('/account/saved?source=scenario');expect(html).toContain('href="/account/history?source=history"');expect(html).toContain('href="/account/history?source=scenario"');});
it('routes private DRAFT links through their existing reviewer reader',async()=>{state.rows=[{...row(1),calculator_slug:'basic-calculator'}];expect(await render()).toContain(`/account/drafts?source=history&amp;id=${row(1).id}`);});
it('keeps retired registered identities visible without current-engine interpretation',async()=>{state.rows=[{...row(1),calculator_slug:'retired-calculator',calculator_version:73}];const html=await render();expect(html).toContain('retired-calculator');expect(html).toContain('version 73');});
it('renders a genuine empty owned list',async()=>{state.rows=[];expect(await render()).toContain('No saved calculations yet');});
it.each([{owner:'other'},{source:'scenario' as const},{limit:50 as const}])('rejects a mismatched cursor %j before record read',async patch=>{expect(await render({cursor:cursor(patch)})).toContain('Saved history unavailable');expect(state.table).toBe('');});
it.each([{source:'bad'},{cursor:'bad!'}])('rejects invalid query %j before record read',async params=>{expect(await render(params)).toContain('Saved history unavailable');expect(state.table).toBe('');});
it.each([{id:'bad'},{created_at:'bad'},{created_at:'2026-02-30T12:00:00Z'},{created_at:'2026-10-20T12:00:00.1234567Z'},{calculator_version:0},{calculator_slug:''}])('rejects corrupt metadata %j without displaying partial records',async patch=>{state.rows=[row(1),{...row(2),...patch}];const html=await render();expect(html).toContain('Saved history unavailable');expect(html).not.toContain(row(1).id);});
it('requires scenario names instead of inventing missing metadata',async()=>{expect(await render({source:'scenario'})).toContain('Saved history unavailable');});
it.each(['returned','rejected'])('isolates %s read errors with generic retry',async kind=>{if(kind==='returned')state.readError={message:'secret read'};else state.reject=true;const html=await render();expect(html).toContain('Saved history unavailable');expect(html).toContain('Retry saved history');expect(html).not.toContain('secret');});
it('redirects missing sessions before any saved-record read',async()=>{state.user=null;await expect(render()).rejects.toThrow('LOGIN_REDIRECT');expect(state.table).toBe('');});
it.each(['returned','rejected'])('isolates %s authentication errors',async kind=>{if(kind==='returned')state.error={message:'secret auth'};else state.authReject=true;const html=await render();expect(html).toContain('Account temporarily unavailable');expect(html).not.toContain('secret');expect(state.table).toBe('');});
it('preserves the displayed case of captured scenario names under application CSS',async()=>{
 state.rows=[{...row(1),name:'Historical slope'}];
 const style=document.createElement('style'),container=document.createElement('div');
 style.textContent=readFileSync('src/app/globals.css','utf8');
 container.innerHTML=await render({source:'scenario'});
 document.head.append(style);document.body.append(container);
 try{expect(container.querySelector('li a')?.textContent).toBe('Historical slope');expect(getComputedStyle(container.querySelector('li')!).textTransform).toBe('none');}
 finally{container.remove();style.remove();}
});
it('offers older history records to project selection while retaining private reviewer handoffs',async()=>{
 expect(await render()).toContain(`/account/projects?historyId=${row(1).id}`);
 state.rows=[{...row(1),calculator_slug:'basic-calculator'}];
 expect(await render()).not.toContain(`/account/projects?historyId=${row(1).id}`);
});
