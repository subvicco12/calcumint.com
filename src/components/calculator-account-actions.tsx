"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  calculatorSlug: string;
  calculatorVersion: number;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
};

const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function CalculatorAccountActions({ calculatorSlug, calculatorVersion, input, output }: Props) {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);
  const [favorite, setFavorite] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setSignedIn(Boolean(user));
      if (!user) return;
      const { data } = await supabase.from("favorites").select("id").eq("user_id", user.id).eq("calculator_slug", calculatorSlug).maybeSingle();
      if (active) setFavorite(Boolean(data));
    })();

    return () => { active = false; };
  }, [calculatorSlug]);

  async function toggleFavorite() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const nextFavorite = !favorite;
    const result = nextFavorite
      ? await supabase.from("favorites").upsert({ user_id: user.id, calculator_slug: calculatorSlug })
      : await supabase.from("favorites").delete().eq("user_id", user.id).eq("calculator_slug", calculatorSlug);

    if (result.error) {
      setStatus("Could not update favorite.");
      return;
    }
    setFavorite(nextFavorite);
    setStatus(nextFavorite ? "Added to favorites." : "Removed from favorites.");
  }

  async function saveHistory() {
    if (!output) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("calculation_history").insert({
      user_id: user.id,
      calculator_slug: calculatorSlug,
      calculator_version: calculatorVersion,
      input_data: input,
      output_data: output
    });
    setStatus(error ? "Could not save calculation." : "Calculation saved to your history.");
  }

  if (signedIn === false) {
    return <div className="account-actions"><Link className="text-link" href="/login">Sign in to save this calculation</Link></div>;
  }
  if (signedIn === null) return null;

  return (
    <div className="account-actions" aria-live="polite">
      <button className="button secondary" type="button" onClick={toggleFavorite}>{favorite ? "★ Favorited" : "☆ Favorite"}</button>
      <button className="button secondary" type="button" onClick={saveHistory} disabled={!output}>Save calculation</button>
      {status && <span className="muted">{status}</span>}
    </div>
  );
}
