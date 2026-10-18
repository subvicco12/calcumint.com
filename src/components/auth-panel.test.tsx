// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
vi.mock('@/app/login/actions',()=>({signIn:vi.fn(),signUp:vi.fn(),signInWithGoogle:vi.fn()}));
import {AuthPanel} from './auth-panel';
afterEach(cleanup);
it('does not expose entered sign-in credentials as sign-up name/email fields',()=>{
 render(<AuthPanel/>);
 fireEvent.change(screen.getByLabelText('Email'),{target:{value:'synthetic@example.invalid'}});
 fireEvent.change(screen.getByLabelText('Password'),{target:{value:'synthetic-password'}});
 fireEvent.click(screen.getByText('Create account',{exact:true}));
 expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('');
 expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');
 expect((screen.getByLabelText('Password') as HTMLInputElement).value).toBe('');
});
it('does not reuse sign-up identity or credentials after returning to sign in',()=>{
 render(<AuthPanel initialMode="signup"/>);
 fireEvent.change(screen.getByLabelText('Name'),{target:{value:'Synthetic name'}});
 fireEvent.change(screen.getByLabelText('Email'),{target:{value:'synthetic@example.invalid'}});
 fireEvent.change(screen.getByLabelText('Password'),{target:{value:'synthetic-password'}});
 fireEvent.click(screen.getAllByText('Sign in',{exact:true})[0]);
 expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('');
 expect((screen.getByLabelText('Password') as HTMLInputElement).value).toBe('');
});
it('exposes selected tabs and their associated panel to screen readers',()=>{
 render(<AuthPanel/>);
 const tab=screen.getByRole('tab',{name:'Sign in',selected:true});
 const panel=screen.getByRole('tabpanel',{name:'Sign in'});
 expect(tab.getAttribute('aria-controls')).toBe(panel.id);
 expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
 expect(tab.tabIndex).toBe(0);
 expect(screen.getByRole('tab',{name:'Create account',selected:false}).tabIndex).toBe(-1);
});
it.each(['ArrowRight','ArrowLeft','End'])('supports keyboard mode selection using %s',key=>{
 render(<AuthPanel/>);
 const signin=screen.getByRole('tab',{name:'Sign in'});signin.focus();fireEvent.keyDown(signin,{key});
 const signup=screen.getByRole('tab',{name:'Create account',selected:true});
 expect(document.activeElement).toBe(signup);
 expect(screen.getByRole('tabpanel',{name:'Create account'})).toBeTruthy();
 fireEvent.keyDown(signup,{key:'Home'});
 expect(document.activeElement).toBe(screen.getByRole('tab',{name:'Sign in',selected:true}));
});
it('keeps tab/panel associations unique across multiple authentication panels',()=>{
 render(<><AuthPanel/><AuthPanel initialMode="signup"/></>);
 const ids=screen.getAllByRole('tab').map(tab=>tab.id);
 expect(ids.every(Boolean)).toBe(true);expect(new Set(ids).size).toBe(ids.length);
 for(const panel of screen.getAllByRole('tabpanel'))expect(document.getElementById(panel.getAttribute('aria-labelledby')!)?.getAttribute('aria-controls')).toBe(panel.id);
});

it('keeps Google sign-in named independently of its decorative mark',()=>{
 render(<AuthPanel/>);
 expect(screen.getByRole('button',{name:'Continue with Google'})).toBeTruthy();
});
it('retains current input when the already selected mode is activated again',()=>{
 render(<AuthPanel/>);
 fireEvent.change(screen.getByLabelText('Email'),{target:{value:'synthetic@example.invalid'}});
 fireEvent.click(screen.getByRole('tab',{name:'Sign in'}));
 expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('synthetic@example.invalid');
});
