"use client";

import {useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {requiresSignIn} from '@/lib/auth-recovery';
import {createSupabaseBrowserClient} from '@/lib/supabase/browser';

type View='checking'|'ready'|'unavailable'|'changed';

/** Visibility guard for server-authorized account data, never an authorization grant. */
export function AccountSessionBoundary({ownerId,children}:{ownerId:string;children:ReactNode}){
 const [view,setView]=useState<View>('checking'),[verification,setVerification]=useState<object|null>(null);
 const region=useRef<HTMLDivElement>(null),retry=useRef<()=>void>(()=>{}),retryButton=useRef<HTMLButtonElement>(null),restoreFocus=useRef<()=>void>(()=>{});
 useLayoutEffect(()=>{
  let active=true,blocked=false,needsVerification=true,generation={};
  const client=createSupabaseBrowserClient();
  let focused:HTMLElement|null=null,selection:{start:number;end:number;direction:'forward'|'backward'|'none'|null}|null=null,retryIntent=false;
  function clearFocus(){focused=null;selection=null;retryIntent=false;}
  restoreFocus.current=()=>{
   const target=focused??(retryIntent?region.current?.querySelector<HTMLElement>('h1'):null);
   const current=document.activeElement;
   const mayRestore=current===document.body||current===focused;
   const range=selection;
   clearFocus();
   if(!mayRestore||!target?.isConnected||!region.current?.contains(target)||target.matches(':disabled')||target.closest('[hidden],[inert]'))return;
   if(target.tagName==='H1'&&!target.hasAttribute('tabindex'))target.tabIndex=-1;
   target.focus({preventScroll:true});
   if(range&&(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement))target.setSelectionRange(range.start,range.end,range.direction??undefined);
  };
  function hide(){
   needsVerification=true;
   const target=document.activeElement;
   if(target===retryButton.current)retryIntent=true;
   if(target instanceof HTMLElement&&region.current?.contains(target)){
    focused=target;selection=null;
    if((target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement)&&target.selectionStart!==null&&target.selectionEnd!==null)selection={start:target.selectionStart,end:target.selectionEnd,direction:target.selectionDirection};
   }
   if(region.current){region.current.hidden=true;region.current.inert=true;}
   if(active&&!blocked)setView('checking');
  }
  function block(){if(active){clearFocus();blocked=true;generation={};setView('changed');}}
  async function verify(background=false){
   if(!active||blocked)return;
   if(!background)hide();
   const request=generation={};needsVerification=true;
   try{
    if(!client)throw new Error('Account unavailable');
    const auth=await client.auth.getUser();
    if(!active||blocked||request!==generation)return;
    if(auth.error)throw auth.error;
    if(auth.data.user?.id!==ownerId){block();return;}
    if(region.current){region.current.hidden=false;region.current.inert=false;}
    // A new identity also commits focus recovery when checking/ready updates are batched.
    needsVerification=false;setVerification(request);setView('ready');
   }catch(error){
    if(!active||blocked||request!==generation)return;
    if(requiresSignIn(error))block();else setView('unavailable');
   }
  }
  hide();void verify();
  const subscription=client?.auth.onAuthStateChange((event,session)=>{
   if(session?.user.id!==ownerId)block();
   // Refresh can invalidate an in-flight /user response. Reverify hidden or
   // pending data; a settled same-owner refresh still preserves the draft.
   else if(event==='SIGNED_IN'||event==='USER_UPDATED'||(event==='TOKEN_REFRESHED'&&needsVerification))queueMicrotask(()=>void verify(true));
  }).data.subscription;
  const recheck=()=>{void verify();};
  const visibility=()=>{if(document.visibilityState==='visible')recheck();else hide();};
  const userMoved=(event:Event)=>{const target=event.target;if(target instanceof Node&&target!==retryButton.current&&!region.current?.contains(target))clearFocus();};
  retry.current=recheck;
  window.addEventListener('focus',recheck);window.addEventListener('pageshow',recheck);window.addEventListener('pagehide',hide);
  document.addEventListener('visibilitychange',visibility);document.addEventListener('focusin',userMoved);document.addEventListener('pointerdown',userMoved);
  return()=>{active=false;hide();clearFocus();restoreFocus.current=()=>{};generation={};subscription?.unsubscribe();window.removeEventListener('focus',recheck);window.removeEventListener('pageshow',recheck);window.removeEventListener('pagehide',hide);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('focusin',userMoved);document.removeEventListener('pointerdown',userMoved);};
 },[ownerId]);
 useLayoutEffect(()=>{if(view==='ready')restoreFocus.current();},[view,verification]);
 if(view==='changed')return <section className="container page-top"><h1>Account session changed</h1><p role="alert">Reload your account or sign in to continue.</p><a href="/account">Reload account</a> <a href="/login">Sign in</a></section>;
 return <>
  {view==='checking'&&<p role="status" aria-busy="true">Verifying account session…</p>}
  {view==='unavailable'&&<div><p role="alert">We could not verify your account. Your data is hidden until verification succeeds.</p><button type="button" className="button secondary" ref={retryButton} onClick={()=>retry.current()}>Retry account verification</button></div>}
  {verification?<div ref={region} hidden={view!=='ready'} inert={view!=='ready'}>{children}</div>:<noscript>{children}</noscript>}
 </>;
}
