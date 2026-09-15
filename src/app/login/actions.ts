"use server";

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

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) loginError("Authentication is not configured yet.");

  const email = formValue(formData, "email");
  const password = formValue(formData, "password");
  if (!email || !password) loginError("Email and password are required.");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) loginError(error.message);
  redirect("/account");
}

export async function signUp(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) loginError("Authentication is not configured yet.");

  const email = formValue(formData, "email");
  const password = formValue(formData, "password");
  const displayName = formValue(formData, "displayName");
  if (!email || password.length < 8) loginError("Use a valid email and a password of at least 8 characters.");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { display_name: displayName }
    }
  });
  if (error) loginError(error.message);
  redirect("/login?message=Check%20your%20email%20to%20confirm%20your%20account.");
}

export async function signInWithGoogle() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) loginError("Authentication is not configured yet.");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/account` }
  });
  if (error || !data.url) loginError(error?.message ?? "Google sign-in could not start.");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
