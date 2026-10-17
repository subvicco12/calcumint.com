// @vitest-environment jsdom
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const state=vi.hoisted(()=>({owner:'owner-a',error:null as unknown,defer:false,pending:[] as ((value:unknown)=>void)[],callbacks:new Set<(event:string,session:{user:{id:string}}|null)=>void>()}));
vi.mock('@/lib/supabase/browser',()=>({createSupabaseBrowserClient:()=>({auth:{getUser:()=>state.defer?new Promise(resolve=>state.pending.push(resolve)):Promise.resolve({data:{user:state.owner?{id:state.owner}:null},error:state.error}),onAuthStateChange:(callback:(event:string,session:{user:{id:string}}|null)=>void)=>{state.callbacks.add(callback);return {data:{subscription:{unsubscribe:()=>state.callbacks.delete(callback)}}};}}})}));
import {AccountSessionBoundary} from './account-session-boundary';
const content=<><p>Private account A</p><label>Draft<input defaultValue="Untouched"/></label></>;
const user=(id:string)=>({data:{user:{id}},error:null});
afterEach(()=>{cleanup();state.owner='owner-a';state.error=null;state.defer=false;state.pending=[];state.callbacks.clear();});
it('withholds interactive account data until authenticated ownership is verified',async()=>{
 state.defer=true;render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);expect(screen.queryByRole('textbox')).toBeNull();
 await act(async()=>state.pending[0](user('owner-a')));expect(screen.getByRole('textbox')).toHaveProperty('value','Untouched');
});
it.each(['owner-b',''])('removes all old account data on an auth transition to %s',async owner=>{
 render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);await screen.findByRole('textbox');
 act(()=>{for(const callback of state.callbacks)callback(owner?'SIGNED_IN':'SIGNED_OUT',owner?{user:{id:owner}}:null);});
 expect(screen.queryByText('Private account A')).toBeNull();expect(screen.queryByRole('textbox')).toBeNull();expect(screen.getByRole('link',{name:'Reload account'}).getAttribute('href')).toBe('/account');
});
it('preserves draft values through unknown verification failure and explicit same-owner recovery',async()=>{
 render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);const input=await screen.findByRole('textbox');fireEvent.change(input,{target:{value:'Keep my draft'}});
 state.error=new Error('private connection detail');fireEvent(window,new Event('focus'));await screen.findByRole('button',{name:'Retry account verification'});
 expect(screen.queryByRole('textbox')).toBeNull();expect(input).toHaveProperty('value','Keep my draft');expect(document.body.textContent).not.toContain('private connection detail');
 state.error=null;fireEvent.click(screen.getByRole('button',{name:'Retry account verification'}));expect(await screen.findByRole('textbox')).toHaveProperty('value','Keep my draft');
});
it('ignores routine same-owner token refresh without resetting a draft',async()=>{
 render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);const input=await screen.findByRole('textbox');fireEvent.change(input,{target:{value:'Refresh-safe draft'}});state.defer=true;
 act(()=>{for(const callback of state.callbacks)callback('TOKEN_REFRESHED',{user:{id:'owner-a'}});});expect(screen.getByRole('textbox')).toBe(input);expect(state.pending).toHaveLength(0);
});
it('rejects an old restored-page response after a newer ownership check starts',async()=>{
 render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);await screen.findByRole('textbox');state.defer=true;
 fireEvent(window,new Event('pageshow'));expect(screen.queryByRole('textbox')).toBeNull();await waitFor(()=>expect(state.pending).toHaveLength(1));
 fireEvent(window,new Event('focus'));await waitFor(()=>expect(state.pending).toHaveLength(2));
 await act(async()=>state.pending[0](user('owner-a')));expect(screen.queryByRole('textbox')).toBeNull();
 await act(async()=>state.pending[1](user('owner-b')));expect(screen.queryByText('Private account A')).toBeNull();
});
it('does not revive a replaced account after delayed verification completes',async()=>{
 state.defer=true;render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);
 act(()=>{for(const callback of state.callbacks)callback('SIGNED_OUT',null);});await act(async()=>state.pending[0](user('owner-a')));
 expect(screen.queryByText('Private account A')).toBeNull();expect(screen.getByRole('heading',{name:'Account session changed'})).toBeTruthy();
});
it('treats a confirmed missing session as replacement rather than retryable connectivity',async()=>{
 const {AuthSessionMissingError}=await import('@supabase/supabase-js');state.error=new AuthSessionMissingError();render(<AccountSessionBoundary ownerId="owner-a">{content}</AccountSessionBoundary>);
 await screen.findByRole('heading',{name:'Account session changed'});expect(screen.queryByRole('button',{name:'Retry account verification'})).toBeNull();expect(document.body.textContent).not.toContain('Auth session missing');
});
it('revalidates a remounted page under its new server-bound owner',async()=>{
 const view=render(<AccountSessionBoundary key="a" ownerId="owner-a">{content}</AccountSessionBoundary>);await screen.findByRole('textbox');state.owner='owner-b';view.rerender(<AccountSessionBoundary key="b" ownerId="owner-b"><p>Private account B</p></AccountSessionBoundary>);
 await waitFor(()=>expect(screen.getByText('Private account B').closest('noscript,[hidden]')).toBeNull());expect(screen.queryByText('Private account A')).toBeNull();
});
