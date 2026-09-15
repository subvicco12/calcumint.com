"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn, signInWithGoogle, signUp } from "@/app/login/actions";

export function AuthPanel({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
 const [mode,setMode]=useState(initialMode);
 return <div className="card auth-card">
  <div className="auth-tabs" role="tablist"><button className={mode==="signin"?"active":""} onClick={()=>setMode("signin")} type="button">Sign in</button><button className={mode==="signup"?"active":""} onClick={()=>setMode("signup")} type="button">Create account</button></div>
  <form action={signInWithGoogle}><button className="button google-button" type="submit"><span className="google-mark">G</span> Continue with Google</button></form>
  <div className="auth-divider"><span>or continue with email</span></div>
  {mode==="signin" ? <form className="form-stack" action={signIn}><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="button primary" type="submit">Sign in</button></form> : <form className="form-stack" action={signUp}><label>Name<input name="displayName" type="text" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" minLength={8} autoComplete="new-password" required /></label><button className="button primary" type="submit">Create free account</button><p className="muted-copy auth-legal">By creating an account, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p></form>}
 </div>;
}
