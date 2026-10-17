// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>{process.env.NEXT_PUBLIC_SUPABASE_URL='https://synthetic.invalid';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='synthetic';return {userId:'synthetic-owner',deferCounts:false,pendingCounts:[] as ((value:unknown)=>void)[],plan:'pro',profileError:true,accountError:true,authError:false,profileReads:0,callbacks:new Set<(event:string,session:{user:{id:string}}|null)=>void>()};});
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:async()=>({data:{user:state.authError||!state.userId?null:{id:state.userId}},error:state.authError?{}:null}),onAuthStateChange:(cb:(event:string,session:{user:{id:string}}|null)=>void)=>{state.callbacks.add(cb);return {data:{subscription:{unsubscribe:()=>state.callbacks.delete(cb)}}};}},from:(table:string)=>{const query={select:()=>query,eq:()=>query,maybeSingle:async()=>{if(table==='profiles'){state.profileReads++;return {data:{plan:state.plan},error:state.profileError?{}:null};}return {data:null,error:state.accountError?{}:null};},then:(resolve:(value:unknown)=>unknown)=>(state.deferCounts?new Promise(r=>state.pendingCounts.push(r)):Promise.resolve({count:0,error:state.accountError?{}:null})).then(resolve)};return query;}})}));
import {CalculatorAccountActions} from './calculator-account-actions';
import {useCalculatorPlan} from './use-calculator-plan';
function OtherConsumer(){return <output data-testid="other-plan">{useCalculatorPlan()}</output>;}
function App(){return <><OtherConsumer/><CalculatorAccountActions calculatorSlug="sip-calculator" calculatorVersion={1} input={{rate:0}} output={{value:0.001}}/></>;}
afterEach(()=>{cleanup();Object.assign(state,{userId:'synthetic-owner',deferCounts:false,pendingCounts:[],plan:'pro',profileError:true,accountError:true,authError:false,profileReads:0});state.callbacks.clear();});
it.each(['pro','business'])('recovers both account actions and separate analysis entitlements to %s without another auth event',async plan=>{
 state.plan=plan;render(<App/>);await screen.findByRole('button',{name:'Retry account actions'});await waitFor(()=>expect(state.profileReads).toBe(2));
 state.accountError=false;state.profileError=false;fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));
 await screen.findByRole('button',{name:'Export JSON'});expect(screen.getByTestId('other-plan').textContent).toBe(plan);
});
it('recovers a failed initial authentication read through the existing user retry',async()=>{
 state.authError=true;render(<App/>);await screen.findByRole('button',{name:'Retry account actions'});
 state.authError=false;state.profileError=false;state.accountError=false;fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));
 await screen.findByRole('button',{name:'Export JSON'});expect(screen.getByTestId('other-plan').textContent).toBe('pro');
});
it('preserves captured values across an explicit retry and revalidation without remounting history',async()=>{
 state.profileError=false;render(<App/>);await screen.findByRole('button',{name:'Retry account actions'});
 await waitFor(()=>expect(screen.getByRole('button',{name:'Capture baseline A'})).toHaveProperty('disabled',false));
 fireEvent.click(screen.getByRole('button',{name:'Capture baseline A'}));
 state.accountError=false;fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));
 await screen.findByRole('button',{name:'Export JSON'});
 expect(screen.getByRole('table',{name:'Captured engine outputs'}).textContent).toContain('0.001');
 expect(screen.getByRole('button',{name:'Replace baseline A'})).toBeTruthy();
 expect(state.profileReads).toBe(4);
});
it('retains Free restrictions and does not manufacture a paid plan when recovery is unavailable',async()=>{
 state.plan='free';render(<App/>);await screen.findByRole('button',{name:'Retry account actions'});
 state.accountError=false;fireEvent.click(screen.getByRole('button',{name:'Retry account actions'}));
 await screen.findByRole('button',{name:'Save calculation'});expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();
 expect(screen.getByTestId('other-plan').textContent).toBe('free');
});
it('restores keyboard focus to an available account action after retry',async()=>{
 state.profileError=false;render(<App/>);const retry=await screen.findByRole('button',{name:'Retry account actions'});retry.focus();state.accountError=false;
 fireEvent.click(retry);await screen.findByRole('button',{name:'Save calculation'});
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'☆ Favorite'}));
});
it('restores keyboard focus to the retry button after another failed read',async()=>{
 render(<App/>);const retry=await screen.findByRole('button',{name:'Retry account actions'});retry.focus();fireEvent.click(retry);
 const next=await screen.findByRole('button',{name:'Retry account actions'});await waitFor(()=>expect(document.activeElement).toBe(next));
});

it('does not steal focus when the user moves elsewhere while recovery is pending',async()=>{
 state.profileError=false;render(<><App/><button>Other control</button></>);
 const retry=await screen.findByRole('button',{name:'Retry account actions'});retry.focus();state.accountError=false;state.deferCounts=true;
 fireEvent.click(retry);await waitFor(()=>expect(state.pendingCounts).toHaveLength(2));
 const other=screen.getByRole('button',{name:'Other control'});other.focus();
 for(const resolve of state.pendingCounts)resolve({count:0,error:null});
 await screen.findByRole('button',{name:'Save calculation'});expect(document.activeElement).toBe(other);
});
it('returns keyboard focus to sign-in when recovery confirms an expired session',async()=>{
 state.profileError=false;render(<App/>);const retry=await screen.findByRole('button',{name:'Retry account actions'});retry.focus();
 state.userId='';state.accountError=false;fireEvent.click(retry);
 const login=await screen.findByRole('link',{name:'Sign in to save this calculation'});expect(document.activeElement).toBe(login);
 expect(screen.queryByRole('button',{name:'Export JSON'})).toBeNull();expect(screen.getByTestId('other-plan').textContent).toBe('free');
});
