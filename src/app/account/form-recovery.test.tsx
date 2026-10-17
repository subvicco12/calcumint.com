// @vitest-environment jsdom
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({authFailure:null as unknown,plan:'pro',owner:'owner-a',calls:[] as FormData[],pending:[] as {resolve:()=>void;reject:(error:Error)=>void}[],callbacks:new Set<(event:string,session:{user:{id:string}}|null)=>void>()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:{id:'owner-a',email:'synthetic@example.invalid'}},error:null})},from:(table:string)=>{const data=table==='profiles'?{plan:state.plan}:table==='calculation_projects'?[{id:'project-a',name:'Project A'}]:table==='calculation_history'?[{id:'history-a',calculator_slug:'slope-calculator',calculator_version:1,created_at:'2026-01-01'}]:table==='saved_scenarios'?[{id:'scenario-a',project_id:'project-a',name:'Scenario A',calculator_slug:'slope-calculator'}]:[];const q={select:()=>q,eq:()=>q,order:()=>q,limit:()=>q,maybeSingle:()=>q,then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data,error:null}).then(resolve)};return q;}})}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:async()=>({data:{user:state.owner?{id:state.owner}:null},error:state.authFailure}),onAuthStateChange:(callback:(event:string,session:{user:{id:string}}|null)=>void)=>{state.callbacks.add(callback);return {data:{subscription:{unsubscribe:()=>state.callbacks.delete(callback)}}};}}})}));
vi.mock('./actions',()=>{const action=(data:FormData)=>{state.calls.push(data);return new Promise<void>((resolve,reject)=>state.pending.push({resolve,reject}));};return {updatePreferences:vi.fn(),createCalculationProject:action,deleteCalculationProject:action,saveProjectScenario:action,updateProjectScenarioName:action,deleteProjectScenario:action};});
vi.mock('@/app/login/actions',()=>({signOut:vi.fn()}));
vi.mock('@/components/billing-sync-status',()=>({BillingSyncStatus:()=>null}));
vi.mock('@/components/billing-portal-button',()=>({BillingPortalButton:()=>null}));
import AccountPage from './page';
import {Component,type ReactNode} from 'react';
import {redirect} from 'next/navigation';
beforeEach(()=>{state.authFailure=null;state.plan='pro';state.owner='owner-a';state.calls=[];state.pending=[];state.callbacks.clear();});
afterEach(cleanup);
async function renderAccount(){let view!:ReturnType<typeof render>;await act(async()=>{view=render(await AccountPage({searchParams:Promise.resolve({})}));});return view;}
it.each(['Create project','Save scenario'])('excludes duplicate pending %s submissions and retains inputs',async label=>{
 await renderAccount();const button=screen.getByRole('button',{name:label});const form=button.closest('form')!;
 fireEvent.change(form.querySelector('input[name="name"]')!,{target:{value:'Private draft'}});
 fireEvent.submit(form);fireEvent.submit(form);await waitFor(()=>expect(state.calls.length).toBeGreaterThan(0));
 expect(button.matches(':disabled')).toBe(true);expect(state.calls).toHaveLength(1);
 await act(async()=>state.pending[0].resolve());expect(form.querySelector('input[name="name"]')).toHaveProperty('value','Private draft');
});
it.each(['pro','business'])('retains a rejected %s draft and retries only after another submit',async plan=>{
 state.plan=plan;await renderAccount();const button=screen.getByRole('button',{name:'Save scenario'}),form=button.closest('form')!,input=form.querySelector('input[name="name"]')!;
 fireEvent.change(input,{target:{value:'Keep this draft'}});fireEvent.submit(form);await waitFor(()=>expect(state.pending).toHaveLength(1));
 await act(async()=>state.pending[0].reject(new Error('private backend details')));await screen.findByRole('alert');
 expect(input).toHaveProperty('value','Keep this draft');expect(state.calls).toHaveLength(1);expect(document.body.textContent).not.toContain('private backend details');expect(button.matches(':disabled')).toBe(false);
 fireEvent.submit(form);await waitFor(()=>expect(state.pending).toHaveLength(2));await act(async()=>state.pending[1].resolve());
 expect(screen.getByText('Request completed.')).toBeTruthy();expect(input).toHaveProperty('value','Keep this draft');expect(state.calls).toHaveLength(2);
});
it.each(['Rename','Remove scenario','Delete project'])('excludes duplicate %s submissions',async label=>{
 await renderAccount();const button=screen.getByRole('button',{name:label}),form=button.closest('form')!;
 fireEvent.submit(form);fireEvent.submit(form);await waitFor(()=>expect(state.pending).toHaveLength(1));expect(button.matches(':disabled')).toBe(true);expect(state.calls[0].get('expectedOwnerId')).toBe('owner-a');
 await act(async()=>state.pending[0].resolve());expect(button.matches(':disabled')).toBe(false);
});
it('blocks an owner switch before dispatch without an auth notification',async()=>{
 await renderAccount();state.owner='owner-b';fireEvent.submit(screen.getByRole('button',{name:'Create project'}).closest('form')!);
 await waitFor(()=>expect(screen.queryByRole('button',{name:'Create project'})).toBeNull());expect(state.calls).toHaveLength(0);
});
it('hides pending drafts and ignores completion after a delivered account switch',async()=>{
 await renderAccount();const form=screen.getByRole('button',{name:'Create project'}).closest('form')!;fireEvent.submit(form);await waitFor(()=>expect(state.pending).toHaveLength(1));
 state.owner='owner-b';act(()=>{for(const callback of state.callbacks)callback('SIGNED_IN',{user:{id:'owner-b'}});});
 await act(async()=>state.pending[0].resolve());expect(screen.queryByRole('button',{name:'Create project'})).toBeNull();expect(screen.queryByText('Request completed.')).toBeNull();expect(state.calls).toHaveLength(1);
});
it('does not report success when the owner changes silently during an outstanding request',async()=>{
 await renderAccount();fireEvent.submit(screen.getByRole('button',{name:'Create project'}).closest('form')!);await waitFor(()=>expect(state.pending).toHaveLength(1));
 state.owner='owner-b';await act(async()=>state.pending[0].resolve());
 expect(screen.queryByText('Request completed.')).toBeNull();expect(screen.queryByRole('button',{name:'Create project'})).toBeNull();
});
it('ignores a pending response after navigation unmounts account forms',async()=>{
 const view=await renderAccount();fireEvent.submit(screen.getByRole('button',{name:'Create project'}).closest('form')!);await waitFor(()=>expect(state.pending).toHaveLength(1));view.unmount();render(<button>Other page</button>);
 await act(async()=>state.pending[0].resolve());expect(screen.getByRole('button',{name:'Other page'})).toBeTruthy();expect(screen.queryByText('Request completed.')).toBeNull();expect(state.calls).toHaveLength(1);
});

it('preserves a draft on unknown authentication failure and permits an explicit retry',async()=>{
 await renderAccount();const form=screen.getByRole('button',{name:'Create project'}).closest('form')!,input=form.querySelector('input[name="name"]')!;fireEvent.change(input,{target:{value:'Offline draft'}});
 const {AuthRetryableFetchError}=await import('@supabase/supabase-js');state.authFailure=new AuthRetryableFetchError('private connection detail',503);fireEvent.submit(form);await screen.findByRole('alert');
 expect(state.calls).toHaveLength(0);expect(input).toHaveProperty('value','Offline draft');state.authFailure=null;fireEvent.submit(form);await waitFor(()=>expect(state.pending).toHaveLength(1));await act(async()=>state.pending[0].resolve());expect(screen.getByText('Request completed.')).toBeTruthy();
});
it('blocks confirmed missing sessions before an action is dispatched',async()=>{
 await renderAccount();const {AuthSessionMissingError}=await import('@supabase/supabase-js');state.authFailure=new AuthSessionMissingError();fireEvent.submit(screen.getByRole('button',{name:'Create project'}).closest('form')!);
 await waitFor(()=>expect(screen.queryByRole('button',{name:'Create project'})).toBeNull());expect(state.calls).toHaveLength(0);expect(document.body.textContent).not.toContain('Auth session missing');
});
it('withholds a failed draft after a silent mid-request owner switch',async()=>{
 await renderAccount();fireEvent.submit(screen.getByRole('button',{name:'Create project'}).closest('form')!);await waitFor(()=>expect(state.pending).toHaveLength(1));state.owner='owner-b';await act(async()=>state.pending[0].reject(new Error('private owner mismatch')));
 expect(screen.queryByRole('button',{name:'Create project'})).toBeNull();expect(document.body.textContent).not.toContain('private owner mismatch');expect(screen.queryByText('Request completed.')).toBeNull();
});
it('preserves a pending draft through same-owner token refresh',async()=>{
 await renderAccount();const form=screen.getByRole('button',{name:'Create project'}).closest('form')!,input=form.querySelector('input[name="name"]')!;fireEvent.change(input,{target:{value:'Stable draft'}});fireEvent.submit(form);await waitFor(()=>expect(state.pending).toHaveLength(1));
 act(()=>{for(const callback of state.callbacks)callback('TOKEN_REFRESHED',{user:{id:'owner-a'}});});await act(async()=>state.pending[0].resolve());expect(input).toHaveProperty('value','Stable draft');expect(screen.getByText('Request completed.')).toBeTruthy();expect(state.calls).toHaveLength(1);
});
it('retains Free restrictions without rendering project or scenario mutation forms',async()=>{
 state.plan='free';await renderAccount();for(const label of ['Create project','Save scenario','Rename','Remove scenario','Delete project'])expect(screen.queryByRole('button',{name:label})).toBeNull();expect(state.calls).toHaveLength(0);
});

it('preserves Next redirect control flow instead of rendering a generic retry notice',async()=>{
 class Boundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<p>Framework navigation</p>:this.props.children;}}
 await act(async()=>{render(<Boundary>{await AccountPage({searchParams:Promise.resolve({})})}</Boundary>,{onCaughtError:()=>{}});});
 fireEvent.submit(screen.getByRole('button',{name:'Create project'}).closest('form')!);await waitFor(()=>expect(state.pending).toHaveLength(1));
 let signal:Error;try{redirect('/login');}catch(error){signal=error as Error;}
 await act(async()=>state.pending[0].reject(signal!));await screen.findByText('Framework navigation');expect(screen.queryByText(/We could not confirm/)).toBeNull();
});
it.each(['owner-b',''])('withholds the entire previous-owner account view after transition to %s',async owner=>{
 await renderAccount();expect(screen.getAllByText('Project A').length).toBeGreaterThan(0);expect(document.body.textContent).toContain('synthetic@example.invalid');
 state.owner=owner;act(()=>{for(const callback of state.callbacks)callback(owner?'SIGNED_IN':'SIGNED_OUT',owner?{user:{id:owner}}:null);});
 expect(screen.queryAllByText('Project A')).toHaveLength(0);expect(document.body.textContent).not.toContain('synthetic@example.invalid');expect(screen.queryByText('Scenario A · slope-calculator')).toBeNull();
});

it('uses distinct form keys within the rendered account workspace',async()=>{
 const errors=vi.spyOn(console,'error').mockImplementation(()=>{});
 try{await renderAccount();expect(errors.mock.calls.map(args=>String(args[0])).filter(value=>value.includes('same key'))).toHaveLength(0);}finally{errors.mockRestore();}
});
