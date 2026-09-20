"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {getPlanEntitlements,type CalcuMintPlan} from "@/lib/entitlements";
import {useCalculatorPlan} from "@/components/use-calculator-plan";

type Props = {
  calculatorSlug: string;
  calculatorVersion: number;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
};

const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toCsv(input: Record<string, unknown>, output: Record<string, unknown>) {
  const rows = [
    ["section", "field", "value"],
    ...Object.entries(input).map(([key, value]) => ["input", key, String(value)]),
    ...Object.entries(output).map(([key, value]) => ["output", key, String(value)])
  ];
  return rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

export function CalculatorAccountActions({ calculatorSlug, calculatorVersion, input, output }: Props) {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);
  const [favorite, setFavorite] = useState(false);
  const plan:CalcuMintPlan=useCalculatorPlan();
  const [status, setStatus] = useState("");
  const [favoriteCount,setFavoriteCount]=useState(0);const [historyCount,setHistoryCount]=useState(0);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      setSignedIn(Boolean(user));
      if (!user) return;

      const [{ data: favoriteData },favoriteCountResult,historyCountResult] = await Promise.all([
        supabase.from("favorites").select("id").eq("user_id", user.id).eq("calculator_slug", calculatorSlug).maybeSingle(),
        supabase.from("favorites").select("id",{count:"exact",head:true}).eq("user_id",user.id),
        supabase.from("calculation_history").select("id",{count:"exact",head:true}).eq("user_id",user.id)
      ]);
      if (!active) return;
      setFavorite(Boolean(favoriteData));
      setFavoriteCount(favoriteCountResult.count??0);setHistoryCount(historyCountResult.count??0);
    })();

    return () => { active = false; };
  }, [calculatorSlug]);

  const entitlements=getPlanEntitlements(plan);

  async function toggleFavorite() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const nextFavorite = !favorite;if(nextFavorite&&entitlements.favoritesLimit!==null&&favoriteCount>=entitlements.favoritesLimit){setStatus(`Free accounts can save up to ${entitlements.favoritesLimit} favorites.`);return;}
    const result = nextFavorite
      ? await supabase.from("favorites").upsert({ user_id: user.id, calculator_slug: calculatorSlug })
      : await supabase.from("favorites").delete().eq("user_id", user.id).eq("calculator_slug", calculatorSlug);

    if (result.error) {
      setStatus(plan === "free" ? "Could not update favorite. Free accounts can save up to 10 favorites." : "Could not update favorite.");
      return;
    }
    setFavorite(nextFavorite);setFavoriteCount(v=>Math.max(0,v+(nextFavorite?1:-1)));
    setStatus(nextFavorite ? "Added to favorites." : "Removed from favorites.");
  }

  async function saveHistory() {
    if (!output) return;if(entitlements.historyLimit!==null&&historyCount>=entitlements.historyLimit){setStatus(`Free accounts can keep up to ${entitlements.historyLimit} calculations.`);return;}
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
    setStatus(error
      ? plan === "free" ? "Could not save. Free accounts can keep up to 20 calculations." : "Could not save calculation."
      : "Calculation saved to your history.");
    if(!error)setHistoryCount(v=>v+1);
  }

  function exportJson() {
    if (!output || !entitlements.exports) return;
    downloadFile(`${calculatorSlug}.json`, JSON.stringify({ calculatorSlug, calculatorVersion, input, output }, null, 2), "application/json");
  }

  function exportCsv() {
    if (!output || !entitlements.exports) return;
    downloadFile(`${calculatorSlug}.csv`, toCsv(input, output), "text/csv;charset=utf-8");
  }

  if (signedIn === false) {
    return <div className="account-actions"><Link className="text-link" href="/login">Sign in to save this calculation</Link></div>;
  }
  if (signedIn === null) return null;

  return (
    <div className="account-actions" aria-live="polite">
      <button className="button secondary" type="button" onClick={toggleFavorite}>{favorite ? "★ Favorited" : "☆ Favorite"}</button>
      <button className="button secondary" type="button" onClick={saveHistory} disabled={!output}>Save calculation</button>
      {entitlements.exports ? (
        <>
          <button className="button secondary" type="button" onClick={exportCsv} disabled={!output}>Export CSV</button>
          <button className="button secondary" type="button" onClick={exportJson} disabled={!output}>Export JSON</button>
        </>
      ) : <Link className="text-link" href="/pricing">Upgrade to Pro for exports and unlimited saves</Link>}
      {status && <span className="muted">{status}</span>}
    </div>
  );
}
