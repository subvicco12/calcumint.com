"use client";

import Link from 'next/link';
import {unstable_rethrow} from 'next/navigation';
import {useTransition,useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react';
import {requiresSignIn} from '@/lib/auth-recovery';
import {createSupabaseBrowserClient} from '@/lib/supabase/browser';

/** Local exclusion only; the server authenticates and authorizes every request. */
export function AccountMutationForm({action,ownerId,children,className}:{action:(data:FormData)=>Promise<void>;ownerId:string;children:ReactNode;className?:string}){
 const [pending,startTransition]=useTransition();
 const [blocked,setBlocked]=useState(false),[message,setMessage]=useState(''),[failed,setFailed]=useState(false);
 const locked=useRef(false),mounted=useRef(true),revision=useRef<object>({});
 useEffect(()=>{
  mounted.current=true;
  const client=createSupabaseBrowserClient();
  const subscription=client?.auth.onAuthStateChange((_event,session)=>{
   if(session?.user.id!==ownerId){revision.current={};setBlocked(true);setMessage('');}
  }).data.subscription;
  return()=>{mounted.current=false;revision.current={};subscription?.unsubscribe();};
 },[ownerId]);
 function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(locked.current||pending||blocked)return;
  locked.current=true;setMessage('');setFailed(false);
  const data=new FormData(event.currentTarget);data.set('expectedOwnerId',ownerId);
  const request=revision.current;
  const current=()=>mounted.current&&request===revision.current;
  startTransition(async()=>{
   let client:ReturnType<typeof createSupabaseBrowserClient>=null,actionPending=false;
   async function verifyOwner(){
    try{
     const auth=await client!.auth.getUser();if(!current())return false;
     if(auth.error)throw auth.error;
     if(auth.data.user?.id!==ownerId){revision.current={};setBlocked(true);return false;}
     return true;
    }catch(error){
     if(current()&&requiresSignIn(error)){revision.current={};setBlocked(true);return false;}
     throw error;
    }
   }
   try{
    client=createSupabaseBrowserClient();if(!client)throw new Error('Account unavailable');
    if(!await verifyOwner())return;
    actionPending=true;await action(data);actionPending=false;
    if(await verifyOwner())setMessage('Request completed.');
   }catch(error){
    unstable_rethrow(error);
    // An action may fail after cookies change without a delivered notification.
    if(actionPending&&current()&&client){try{if(!await verifyOwner())return;}catch{/* Unknown connectivity retains the draft and a generic notice. */}}
    if(current()){setFailed(true);setMessage('We could not confirm this request. Check your account before retrying.');}
   }finally{
    locked.current=false;
   }
  });
 }
 if(blocked)return <div role="alert">Your account session changed. <a href="/account">Reload account</a> or <Link href="/login">sign in</Link> to continue.</div>;
 return <form action={action} onSubmit={submit} className={className} aria-busy={pending}>
  <input type="hidden" name="expectedOwnerId" value={ownerId}/>
  <fieldset disabled={pending} className={className} style={{border:0,padding:0,margin:0,minWidth:0}}>{children}</fieldset>
  {pending&&<p role="status">Submitting request…</p>}
  {message&&<p role={failed?'alert':'status'} aria-atomic="true">{message}{failed&&<> <a href="/account">Check account</a></>}</p>}
 </form>;
}
