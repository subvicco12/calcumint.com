"use server";
import {requireProductCapability} from '@/lib/product-mode-server';


import {isAuthRetryableFetchError} from "@supabase/supabase-js";
import {z} from "zod";
import {verifiedPasswordRecovery,PASSWORD_RECOVERY_SENT,PASSWORD_RECOVERY_INVALID,PASSWORD_RESET_COMPLETE_NOTICE,PASSWORD_RESET_UNCONFIRMED_NOTICE,type PasswordRecoveryState} from "@/lib/password-recovery";
import {authFailureMessage} from "@/lib/auth-recovery";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function loginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

// Passwords are opaque credentials; normalize identity fields only.
function passwordValue(formData: FormData,key="password"): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

async function authenticationRequest<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch {
    loginError("Authentication is temporarily unavailable. Try again.");
  }
}

export async function signIn(formData: FormData) {
  requireProductCapability('accounts');

  const supabase = await authenticationRequest(() => createSupabaseServerClient({requireCookieWrites:true}));
  if (!supabase) loginError("Authentication is not configured yet.");

  const email = formValue(formData, "email");
  const password = passwordValue(formData);
  if (!email || !password) loginError("Email and password are required.");

  const { error } = await authenticationRequest(() => supabase.auth.signInWithPassword({ email, password }));
  if (error) loginError(authFailureMessage(error, "signin"));
  redirect("/account");
}

export async function signUp(formData: FormData) {
  requireProductCapability('accounts');

  const supabase = await authenticationRequest(() => createSupabaseServerClient({requireCookieWrites:true}));
  if (!supabase) loginError("Authentication is not configured yet.");

  const email = formValue(formData, "email");
  const password = passwordValue(formData);
  const displayName = formValue(formData, "displayName");
  if (!email || password.trim().length < 8) loginError("Use a valid email and a password of at least 8 characters.");

  const { error } = await authenticationRequest(() => supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { display_name: displayName }
    }
  }));
  if (error) loginError(authFailureMessage(error, "signup"));
  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account.");
}

export async function signInWithGoogle() {
  requireProductCapability('accounts');

  const supabase = await authenticationRequest(() => createSupabaseServerClient({requireCookieWrites:true}));
  if (!supabase) loginError("Authentication is not configured yet.");

  const { data, error } = await authenticationRequest(() => supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/account` }
  }));
  if (error || !data.url) loginError(authFailureMessage(error, "oauth"));
  redirect(data.url);
}

export async function signOut() {
  requireProductCapability('accounts');

  const supabase = await authenticationRequest(() => createSupabaseServerClient({requireCookieWrites:true}));
  if (supabase) {
    const { error } = await authenticationRequest(() => supabase.auth.signOut());
    if (error) loginError("Could not sign out. Try again.");
  }
  redirect("/");
}


export async function requestPasswordReset(_previous:PasswordRecoveryState,formData:FormData):Promise<PasswordRecoveryState> {
  requireProductCapability('accounts');

  const email=formValue(formData,"email");
  if(!z.string().email().max(254).safeParse(email).success)return {status:"error",message:"Enter a valid email address."};
  try {
    const supabase=await createSupabaseServerClient({requireCookieWrites:true});
    if(!supabase)return {status:"error",message:"Password reset is temporarily unavailable. Try again."};
    const callback=new URL("/auth/callback",new URL(publicEnv.NEXT_PUBLIC_SITE_URL).origin);
    callback.searchParams.set("next","/login/reset");
    // Even transport/SMTP failures can depend on account existence. Once the
    // provider lookup starts, every outcome receives the same acknowledgment.
    try{await supabase.auth.resetPasswordForEmail(email,{redirectTo:callback.toString()});}catch{/* Do not reveal account-dependent failures. */}
    return {status:"sent",message:PASSWORD_RECOVERY_SENT};
  }catch{return {status:"error",message:"Password reset is temporarily unavailable. Try again."};}
}

export async function completePasswordReset(_previous:PasswordRecoveryState,formData:FormData):Promise<PasswordRecoveryState> {
  requireProductCapability('accounts');

  const password=passwordValue(formData),confirmation=passwordValue(formData,"confirmPassword");
  if(password.trim().length<8||password.length>1024)return {status:"error",message:"Use a password of at least 8 characters."};
  if(password!==confirmation)return {status:"error",message:"The passwords do not match."};
  let supabase;
  try {
    supabase=await createSupabaseServerClient({requireCookieWrites:true});
    if(!supabase)throw new Error();
    const context=await verifiedPasswordRecovery(supabase);
    if(context.ownerId!==formValue(formData,"expectedOwnerId")||context.sessionId!==formValue(formData,"expectedSessionId"))throw new Error();
  }catch{return {status:"error",message:PASSWORD_RECOVERY_INVALID};}
  try {
    const {error}=await supabase.auth.updateUser({password});
    if(isAuthRetryableFetchError(error))return {status:"uncertain",message:"The password update could not be confirmed. Sign in or request a new link before trying again."};
    if(error)return {status:"error",message:"The password could not be updated. Try again or request a new link."};
  }catch{return {status:"uncertain",message:"The password update could not be confirmed. Sign in or request a new link before trying again."};}
  let notice=PASSWORD_RESET_COMPLETE_NOTICE;
  try {
    const {error}=await supabase.auth.signOut({scope:"global"});
    if(error)notice=PASSWORD_RESET_UNCONFIRMED_NOTICE;
  }catch{notice=PASSWORD_RESET_UNCONFIRMED_NOTICE;}
  // Cookie changes rerender the recovery page. Report completed mutation on a
  // public, whitelisted notice even when sign-out has an unconfirmed outcome.
  redirect(`/login?message=${encodeURIComponent(notice)}#auth-notice`);
}
