"use client";

import {useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {requiresSignIn} from '@/lib/auth-recovery';
import {createSupabaseBrowserClient} from '@/lib/supabase/browser';

type View='checking'|'ready'|'unavailable'|'changed';

/** Visibility guard for server-authorized account data, never an authorization grant. */
export function AccountSessionBoundary({ownerId,children}:{ownerId:string;children:ReactNode}){
 const [view,setView]=useState<View>('checking'),[verified,setVerified]=useState(false);
 const region=useRef<HTMLDivElement>(null),retry=useRef<()=>void>(()=>{});
 useLayoutEffect(()=>{
  let active=true,blocked=false,generation={};
  const client=createSupabaseBrowserClient();
  function hide(){
   if(region.current){region.current.hidden=true;region.current.inert=true;}
   if(active&&!blocked)setView('checking');
  }
  function block(){if(active){blocked=true;generation={};setView('changed');}}
  async function verify(background=false){
   if(!active||blocked)return;
   if(!background)hide();
   const request=generation={};
   try{
    if(!client)throw new Error('Account unavailable');
    const auth=await client.auth.getUser();
    if(!active||blocked||request!==generation)return;
    if(auth.error)throw auth.error;
    if(auth.data.user?.id!==ownerId){block();return;}
    if(region.current){region.current.hidden=false;region.current.inert=false;}
    setVerified(true);setView('ready');
   }catch(error){
    if(!active||blocked||request!==generation)return;
    if(requiresSignIn(error))block();else setView('unavailable');
   }
  }
  hide();void verify();
  const subscription=client?.auth.onAuthStateChange((event,session)=>{
   if(session?.user.id!==ownerId)block();
   else if(event==='SIGNED_IN'||event==='USER_UPDATED')queueMicrotask(()=>void verify(true));
  }).data.subscription;
  const recheck=()=>{void verify();};
  const visibility=()=>{if(document.visibilityState==='visible')recheck();else hide();};
  retry.current=recheck;
  window.addEventListener('focus',recheck);window.addEventListener('pageshow',recheck);window.addEventListener('pagehide',hide);
  document.addEventListener('visibilitychange',visibility);
  return()=>{active=false;hide();generation={};subscription?.unsubscribe();window.removeEventListener('focus',recheck);window.removeEventListener('pageshow',recheck);window.removeEventListener('pagehide',hide);document.removeEventListener('visibilitychange',visibility);};
 },[ownerId]);
 if(view==='changed')return <section className="container page-top"><h1>Account session changed</h1><p role="alert">Reload your account or sign in to continue.</p><a href="/account">Reload account</a> <a href="/login">Sign in</a></section>;
 return <>
  {view==='checking'&&<p role="status" aria-busy="true">Verifying account session…</p>}
  {view==='unavailable'&&<div><p role="alert">We could not verify your account. Your data is hidden until verification succeeds.</p><button type="button" className="button secondary" onClick={()=>retry.current()}>Retry account verification</button></div>}
  {verified?<div ref={region} hidden={view!=='ready'} inert={view!=='ready'}>{children}</div>:<noscript>{children}</noscript>}
 </>;
}
