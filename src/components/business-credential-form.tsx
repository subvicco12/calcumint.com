"use client";

import {useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {createSupabaseBrowserClient} from '@/lib/supabase/browser';
import type {BusinessCredentialResult} from '@/app/business/api/actions';

/** Credentials live only in this mounted view; the server authorizes every write. */
type Props={action:(data:FormData)=>Promise<BusinessCredentialResult>;ownerId:string;kind:'API key'|'webhook signing secret';children:ReactNode};
export function BusinessCredentialForm(props:Props){return <CredentialSession key={props.ownerId} {...props}/>;}
function CredentialSession({action,ownerId,kind,children}:Props){
 const [pending,setPending]=useState(false),[blocked,setBlocked]=useState(false),[secret,setSecret]=useState(''),[message,setMessage]=useState('');
 const form=useRef<HTMLFormElement>(null);
 const locked=useRef(false),mounted=useRef(true),generation=useRef<object>({});
 useEffect(()=>{
  mounted.current=true;
  const client=createSupabaseBrowserClient();
  const subscription=client?.auth.onAuthStateChange((_event,session)=>{
   if(session?.user.id!==ownerId){generation.current={};setSecret('');setBlocked(true);setMessage('');}
  }).data.subscription;
  const clear=()=>{generation.current={};setSecret('');};
  window.addEventListener('pagehide',clear);
  return()=>{mounted.current=false;generation.current={};subscription?.unsubscribe();window.removeEventListener('pagehide',clear);};
 },[ownerId]);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(locked.current||blocked)return;
  locked.current=true;setPending(true);setSecret('');setMessage('');
  const data=new FormData(event.currentTarget);data.set('expectedOwnerId',ownerId);
  const request=generation.current;
  const current=()=>mounted.current&&request===generation.current;
  const client=createSupabaseBrowserClient();
  async function verify(){
   if(!client)throw new Error('Session unavailable');
   const auth=await client.auth.getUser();
   if(!current())return false;
   if(auth.error)throw auth.error;
   if(auth.data.user?.id!==ownerId){generation.current={};setSecret('');setBlocked(true);return false;}
   return true;
  }
  try{
   if(!await verify())return;
   const result=await action(data);
   if(await verify()&&current())setSecret(result.secret);
  }catch{
   if(current()){
    try{if(!await verify())return;}catch{/* Unknown outcome: never reveal an unverified credential. */}
    if(current())setMessage('We could not confirm this request. Review your API keys or webhook endpoints and revoke or disable any unwanted credential before creating another.');
   }
  }finally{locked.current=false;if(mounted.current)setPending(false);}
 }
 if(blocked)return <p role="alert">Your account session changed. <a href="/business/api">Reload automation</a> or <a href="/login">sign in</a> to continue.</p>;
 return <div>
  <form ref={form} className="card form-stack" onSubmit={submit} aria-busy={pending}>
   <input type="hidden" name="expectedOwnerId" value={ownerId}/>
   <fieldset disabled={pending} className="form-stack" style={{border:0,padding:0,margin:0,minWidth:0}}>{children}</fieldset>
   {pending&&<p role="status">Creating credential…</p>}
   {message&&<p role="alert">{message} <a href="/business/api">Review automation</a></p>}
  </form>
  {secret&&<div className="notice success-notice" role="status"><strong>Copy this {kind} now.</strong> This view clears when you leave or reload.<br/><code>{secret}</code><button type="button" className="button secondary" onClick={()=>{setSecret('');form.current?.querySelector<HTMLButtonElement>('button')?.focus();}}>Dismiss secret</button></div>}
 </div>;
}
