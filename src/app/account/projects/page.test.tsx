// @vitest-environment jsdom
import {beforeEach,expect,it,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
const state=vi.hoisted(()=>({plan:'pro',profileError:false,historySlug:'slope-calculator',filters:[] as string[],rows:[] as unknown[]}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'owner-a'}},error:null})},from:(table:string)=>{const q={select:()=>q,eq:(k:string,v:string)=>{state.filters.push(`${table}:${k}:${v}`);return q;},order:()=>q,or:()=>q,limit:async()=>({data:state.rows,error:null}),maybeSingle:async()=>({data:table==='profiles'?{plan:state.plan}:table==='calculation_history'?{id:'22222222-2222-4222-8222-222222222222',calculator_slug:state.historySlug,calculator_version:7}:{id:'11111111-1111-4111-8111-111111111111',name:'Old project',description:null,created_at:'2026-10-20T12:00:00Z'},error:table==='profiles'&&state.profileError?{}:null})};return q;}})}));
vi.mock('next/navigation',()=>({redirect:()=>{throw Error('LOGIN');}}));
vi.mock('../actions',()=>({saveProjectScenario:async()=>{},updateProjectScenarioName:async()=>{},deleteProjectScenario:async()=>{},deleteCalculationProject:async()=>{}}));
vi.mock('@/components/account-session-boundary',()=>({AccountSessionBoundary:({children}:{children:React.ReactNode})=><>{children}</>}));
vi.mock('@/components/account-mutation-form',()=>({AccountMutationForm:({children}:{children:React.ReactNode})=><form>{children}</form>}));
import ProjectsPage from './page';
import ProjectPage from './[id]/page';
const project='11111111-1111-4111-8111-111111111111',history='22222222-2222-4222-8222-222222222222';
beforeEach(()=>Object.assign(state,{plan:'pro',profileError:false,historySlug:'slope-calculator',filters:[],rows:[]}));
it('reaches projects outside the account preview and retains an owned historical capture handoff',async()=>{state.rows=Array.from({length:21},(_,i)=>({id:`11111111-1111-4111-8111-${String(i+1).padStart(12,'0')}`,name:`Project ${i+1}`,description:null,created_at:'2026-10-20T12:00:00.123456Z'}));const html=renderToStaticMarkup(await ProjectsPage({searchParams:Promise.resolve({historyId:history})}));expect(html).toContain('Project 13');expect(html).not.toContain('Project 21');expect(html).toContain(`historyId=${history}`);expect(html).toContain('Next page');expect(state.filters).toContain('calculation_history:user_id:owner-a');});
it('scopes scenario browsing to owner and project and offers original-record capture',async()=>{const html=renderToStaticMarkup(await ProjectPage({params:Promise.resolve({id:project}),searchParams:Promise.resolve({historyId:history})}));expect(state.filters).toContain(`saved_scenarios:project_id:${project}`);expect(state.filters).toContain('saved_scenarios:user_id:owner-a');expect(html).toContain('version 7');expect(html).toContain(`name="historyId" value="${history}"`);expect(html).toContain('Save scenario');});
it.each(['free','outage'])('retains owned project reads while hiding paid capture controls on %s',async mode=>{state.plan=mode==='free'?'free':'pro';state.profileError=mode==='outage';const html=renderToStaticMarkup(await ProjectPage({params:Promise.resolve({id:project}),searchParams:Promise.resolve({historyId:history})}));expect(html).toContain('Old project');expect(html).not.toContain('Save scenario');});
it('rejects private DRAFT capture handoffs without rendering capture controls',async()=>{state.historySlug='basic-calculator';const html=renderToStaticMarkup(await ProjectPage({params:Promise.resolve({id:project}),searchParams:Promise.resolve({historyId:history})}));expect(html).toContain('Projects unavailable');expect(html).not.toContain('Save scenario');});
it('pages scenarios inside the project and keeps private reopen links on their guarded route',async()=>{state.rows=Array.from({length:21},(_,i)=>({id:`33333333-3333-4333-8333-${String(i+1).padStart(12,'0')}`,name:`Scenario ${i+1}`,calculator_slug:i===0?'basic-calculator':'slope-calculator',calculator_version:1,created_at:'2026-10-20T12:00:00.123456Z'}));const html=renderToStaticMarkup(await ProjectPage({params:Promise.resolve({id:project}),searchParams:Promise.resolve({historyId:history})}));expect(html).toContain('Scenario 20');expect(html).not.toContain('Scenario 21');expect(html).toContain('/account/drafts?source=scenario');expect(html).toContain(`historyId=${history}&amp;cursor=`);});
it('fails closed for malformed project IDs and cursors',async()=>{const html=renderToStaticMarkup(await ProjectPage({params:Promise.resolve({id:'invalid'}),searchParams:Promise.resolve({})}));expect(html).toContain('Projects unavailable');expect(state.filters).toEqual([]);const bad=renderToStaticMarkup(await ProjectsPage({searchParams:Promise.resolve({cursor:'bad'})}));expect(bad).toContain('Projects unavailable');});
it('treats invalid plan data as unavailable rather than a Free account',async()=>{
 state.plan='invalid';const html=renderToStaticMarkup(await ProjectPage({params:Promise.resolve({id:project}),searchParams:Promise.resolve({historyId:history})}));
 expect(html).toContain('Plan details are temporarily unavailable');expect(html).not.toContain('Saving scenarios requires Pro');expect(html).not.toContain('Delete project');
});
it.each(['projects','scenarios'])('preserves captured name casing under application CSS in %s',async kind=>{
 const base={id:project,name:'eBay original',created_at:'2026-10-20T12:00:00Z'};
 state.rows=[kind==='projects'?{...base,description:null}:{...base,calculator_slug:'slope-calculator',calculator_version:1}];
 const html=renderToStaticMarkup(kind==='projects'?await ProjectsPage({searchParams:Promise.resolve({})}):await ProjectPage({params:Promise.resolve({id:project}),searchParams:Promise.resolve({})}));
 const style=document.createElement('style'),container=document.createElement('div');style.textContent=readFileSync('src/app/globals.css','utf8');container.innerHTML=html;document.head.append(style);document.body.append(container);
 try{expect(container.querySelector('li a')?.textContent).toBe('eBay original');expect(getComputedStyle(container.querySelector('li')!).textTransform).toBe('none');}
 finally{container.remove();style.remove();}
});
