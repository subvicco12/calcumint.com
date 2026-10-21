// @vitest-environment jsdom
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({authDefer:false,authReads:0,authPending:[] as ((value:unknown)=>void)[],id:'a',plan:'pro',error:false,defer:false,reject:false,authError:false,callback:null as null|((event:string,session:{user:{id:string}}|null)=>void),pending:[] as ((x:unknown)=>void)[],reads:0,unsubscribed:0}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:()=>{state.authReads++;return state.authDefer?new Promise(resolve=>state.authPending.push(resolve)):Promise.resolve({data:{user:state.id?{id:state.id}:null},error:state.authError?{}:null});},onAuthStateChange:(cb:typeof state.callback)=>{state.callback=cb;return {data:{subscription:{unsubscribe:()=>{state.unsubscribed++;}}}};}},from:()=>{const query={select:()=>query,eq:()=>query,maybeSingle:()=>{state.reads++;if(state.reject)return Promise.reject(new Error('synthetic profile transport failure'));return state.defer?new Promise(resolve=>state.pending.push(resolve)):Promise.resolve({data:{plan:state.plan},error:state.error?{}:null});}};return query;}})}));
import {useCalculatorPlan} from './use-calculator-plan';function Consumer(){return <p>{useCalculatorPlan()}</p>;}
afterEach(()=>{cleanup();state.authDefer=false;state.authReads=0;state.authPending=[];state.id='a';state.plan='pro';state.error=false;state.defer=false;state.reject=false;state.authError=false;state.callback=null;state.pending=[];state.reads=0;});
it('drops prior paid entitlements on user switch/logout and regains the new authorized plan',async()=>{render(<Consumer/>);await screen.findByText('pro');state.id='b';state.plan='free';act(()=>state.callback?.('SIGNED_IN',{user:{id:'b'}}));expect(screen.getByText('free')).toBeTruthy();await waitFor(()=>expect(state.reads).toBe(2));state.id='';act(()=>state.callback?.('SIGNED_OUT',null));expect(screen.getByText('free')).toBeTruthy();state.id='c';state.plan='business';act(()=>state.callback?.('SIGNED_IN',{user:{id:'c'}}));await screen.findByText('business');});
it('ignores stale prior-user profile data and same-user token refresh does not reload',async()=>{state.defer=true;render(<Consumer/>);await waitFor(()=>expect(state.pending).toHaveLength(1));state.id='b';act(()=>state.callback?.('SIGNED_IN',{user:{id:'b'}}));await waitFor(()=>expect(state.pending).toHaveLength(2));await act(async()=>state.pending[1]({data:{plan:'free'},error:null}));await act(async()=>state.pending[0]({data:{plan:'business'},error:null}));expect(screen.getByText('free')).toBeTruthy();act(()=>state.callback?.('TOKEN_REFRESHED',{user:{id:'b'}}));expect(state.reads).toBe(2);});
it('fails closed on profile errors and unsubscribes',async()=>{state.error=true;const view=render(<Consumer/>);await waitFor(()=>expect(state.reads).toBe(1));expect(screen.getByText('free')).toBeTruthy();const before=state.unsubscribed;view.unmount();expect(state.unsubscribed).toBe(before+1);});

it.each(['SIGNED_IN','USER_UPDATED'])('revalidates the same account on %s without keeping stale paid controls',async event=>{
 render(<Consumer/>);await screen.findByText('pro');state.defer=true;
 const before=state.reads;act(()=>state.callback?.(event,{user:{id:'a'}}));
 expect(screen.getByText('free')).toBeTruthy();expect(state.reads).toBe(before);
 await waitFor(()=>expect(state.pending).toHaveLength(1));
 await act(async()=>state.pending[0]({data:{plan:'free'},error:null}));expect(screen.getByText('free')).toBeTruthy();
});
it.each(['pro','business'])('recovers a failed same-account profile read to %s through explicit user update',async plan=>{
 state.error=true;render(<Consumer/>);await waitFor(()=>expect(state.reads).toBe(1));state.error=false;state.plan=plan;
 act(()=>state.callback?.('USER_UPDATED',{user:{id:'a'}}));await screen.findByText(plan);expect(state.reads).toBe(2);
});
it('ignores an older same-account revalidation after a newer event has completed',async()=>{
 render(<Consumer/>);await screen.findByText('pro');state.defer=true;
 act(()=>state.callback?.('SIGNED_IN',{user:{id:'a'}}));await waitFor(()=>expect(state.pending).toHaveLength(1));
 act(()=>state.callback?.('USER_UPDATED',{user:{id:'a'}}));await waitFor(()=>expect(state.pending).toHaveLength(2));
 await act(async()=>state.pending[1]({data:{plan:'free'},error:null}));
 await act(async()=>state.pending[0]({data:{plan:'business'},error:null}));expect(screen.getByText('free')).toBeTruthy();
});
it('cannot restore a paid plan from revalidation after logout',async()=>{
 render(<Consumer/>);await screen.findByText('pro');state.defer=true;
 act(()=>state.callback?.('USER_UPDATED',{user:{id:'a'}}));await waitFor(()=>expect(state.pending).toHaveLength(1));
 act(()=>state.callback?.('SIGNED_OUT',null));await act(async()=>state.pending[0]({data:{plan:'business'},error:null}));expect(screen.getByText('free')).toBeTruthy();
});
it('fails closed on a rejected same-account read and can retry sign-in',async()=>{
 render(<Consumer/>);await screen.findByText('pro');state.reject=true;
 act(()=>state.callback?.('USER_UPDATED',{user:{id:'a'}}));await waitFor(()=>expect(state.reads).toBe(2));expect(screen.getByText('free')).toBeTruthy();
 state.reject=false;state.plan='business';act(()=>state.callback?.('SIGNED_IN',{user:{id:'a'}}));await screen.findByText('business');
});
it('recovers from initial authentication failure only after a new authenticated event',async()=>{
 state.authError=true;render(<Consumer/>);await act(async()=>{});expect(state.reads).toBe(0);expect(screen.getByText('free')).toBeTruthy();
 state.authError=false;act(()=>state.callback?.('SIGNED_IN',{user:{id:'a'}}));await screen.findByText('pro');expect(state.reads).toBe(1);
});


it('gates scenario exports during same-account downgrade/recovery without changing captured mathematics',async()=>{
 const {CalculatorScenarioWorkspace}=await import('./calculator-scenario-workspace');
 const {createCalculationSnapshot}=await import('@/lib/calculation-snapshot');
 const snapshot=createCalculationSnapshot({calculatorSlug:'percentage-of-value-calculator',calculatorVersion:1,input:{percentage:20,value:250},output:{result:50}});
 const download=vi.fn();
 function Workspace(){const plan=useCalculatorPlan();return <><p aria-label="Current plan">{plan}</p><CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={download}/></>;}
 render(<Workspace/>);await screen.findByText('pro');
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 const original=JSON.parse(download.mock.calls[0][1]);expect(original.scenarios[0].output).toEqual({result:50});
 state.defer=true;act(()=>state.callback?.('USER_UPDATED',{user:{id:'a'}}));
 expect(screen.queryByRole('button',{name:'Export scenario set JSON'})).toBeNull();
 expect(screen.getByRole('button',{name:'Replace baseline A'})).toHaveProperty('disabled',true);
 await waitFor(()=>expect(state.pending).toHaveLength(1));await act(async()=>state.pending[0]({data:{plan:'free'},error:null}));
 expect(screen.queryByRole('button',{name:'Export scenario set JSON'})).toBeNull();
 act(()=>state.callback?.('USER_UPDATED',{user:{id:'a'}}));await waitFor(()=>expect(state.pending).toHaveLength(2));
 await act(async()=>state.pending[1]({data:{plan:'business'},error:null}));
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set JSON'}));
 expect(JSON.parse(download.mock.calls[1][1])).toEqual(original);
 fireEvent.click(screen.getByRole('button',{name:'Export scenario set CSV'}));expect(download.mock.calls[2][1]).toContain('50');
 expect(snapshot.output).toEqual({result:50});expect(snapshot.calculatorVersion).toBe(1);
});

import {ACCOUNT_RECOVERY_EVENT,requestAccountRecovery} from '@/lib/account-recovery';
it('ignores a recovery identity response that arrives after explicit logout while already Free',async()=>{
 state.authError=true;render(<Consumer/>);await act(async()=>{});expect(screen.getByText('free')).toBeTruthy();
 state.authError=false;state.authDefer=true;act(()=>requestAccountRecovery());
 await waitFor(()=>expect(state.authPending).toHaveLength(1));
 act(()=>state.callback?.('SIGNED_OUT',null));
 await act(async()=>state.authPending[0]({data:{user:{id:'a'}},error:null}));
 expect(screen.getByText('free')).toBeTruthy();expect(state.reads).toBe(0);
});
it('ignores prior-owner recovery after a newer owner is identified',async()=>{
 render(<Consumer/>);await screen.findByText('pro');state.authDefer=true;
 act(()=>requestAccountRecovery());await waitFor(()=>expect(state.authPending).toHaveLength(1));
 state.id='b';state.plan='free';act(()=>state.callback?.('SIGNED_IN',{user:{id:'b'}}));
 await waitFor(()=>expect(state.reads).toBe(2));
 await act(async()=>state.authPending[0]({data:{user:{id:'a'}},error:null}));
 expect(screen.getByText('free')).toBeTruthy();expect(state.reads).toBe(2);
});
it('treats a recovery event as a read request rather than trusting event entitlements',async()=>{
 state.plan='free';render(<Consumer/>);await waitFor(()=>expect(state.reads).toBe(1));
 act(()=>window.dispatchEvent(new CustomEvent(ACCOUNT_RECOVERY_EVENT,{detail:{plan:'business',user:{id:'other'}}})));
 await waitFor(()=>expect(state.reads).toBe(2));expect(screen.getByText('free')).toBeTruthy();
});
it('removes recovery listeners on unmount without making later identity requests',async()=>{
 const view=render(<Consumer/>);await screen.findByText('pro');const before=state.authReads;view.unmount();
 act(()=>requestAccountRecovery());await act(async()=>{});expect(state.authReads).toBe(before);
});
