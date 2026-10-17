"use client";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { signIn, signInWithGoogle, signUp } from "@/app/login/actions";

export function AuthPanel({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
 const [mode,setMode]=useState(initialMode);
 const id=useId();
 const tabs=useRef<Partial<Record<typeof mode,HTMLButtonElement|null>>>({});
 function selectWithKeyboard(event:KeyboardEvent<HTMLButtonElement>){
  let next:typeof mode;
  if(event.key==='Home')next='signin';
  else if(event.key==='End')next='signup';
  else if(event.key==='ArrowLeft'||event.key==='ArrowRight')next=mode==='signin'?'signup':'signin';
  else return;
  event.preventDefault();setMode(next);tabs.current[next]?.focus();
 }
 return <div className="card auth-card">
  <div className="auth-tabs" role="tablist" aria-label="Account access">
   {(['signin','signup'] as const).map(value=><button key={value} ref={element=>{tabs.current[value]=element;}} id={`${id}-${value}`} role="tab" aria-selected={mode===value} aria-controls={`${id}-panel`} tabIndex={mode===value?0:-1} className={mode===value?'active':''} onClick={()=>setMode(value)} onKeyDown={selectWithKeyboard} type="button">{value==='signin'?'Sign in':'Create account'}</button>)}
  </div>
  <form action={signInWithGoogle}><button className="button google-button" type="submit"><span className="google-mark" aria-hidden="true">G</span> Continue with Google</button></form>
  <div className="auth-divider"><span>or continue with email</span></div>
  <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${mode}`}>
  {mode==="signin" ? <form key="signin" className="form-stack" action={signIn}><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="button primary" type="submit">Sign in</button></form> : <form key="signup" className="form-stack" action={signUp}><label>Name<input name="displayName" type="text" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" minLength={8} autoComplete="new-password" required /></label><button className="button primary" type="submit">Create free account</button><p className="muted-copy auth-legal">By creating an account, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p></form>}
  </div>
 </div>;
}
