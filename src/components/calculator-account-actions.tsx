"use client";

import Link from "next/link";
import {CalculatorScenarioWorkspace} from "./calculator-scenario-workspace";
import { serializeCalculationCsv } from "@/lib/calculation-export";
import { createCalculationSnapshot, serializeCalculationJson } from "@/lib/calculation-snapshot";
import { useEffect, useRef, useState } from "react";
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


export function CalculatorAccountActions(props:Props){
  const [authIdentity,setAuthIdentity]=useState<string|null|undefined>(undefined);
  const observedAuthOwner=useRef<string|null|undefined>(undefined);
  useEffect(()=>{
    const client=createSupabaseBrowserClient();
    if(!client||typeof client.auth.onAuthStateChange!=="function")return;
    const {data}=client.auth.onAuthStateChange((_event,session)=>{
      observedAuthOwner.current=session?.user.id??null;
      setAuthIdentity(observedAuthOwner.current);
    });
    return ()=>data.subscription.unsubscribe();
  },[]);
  return <AccountActionsSession key={JSON.stringify([props.calculatorSlug,props.calculatorVersion,authIdentity!==undefined,authIdentity])} {...props} observedAuthOwner={observedAuthOwner}/>;
}

function AccountActionsSession({ calculatorSlug, calculatorVersion, input, output,observedAuthOwner }: Props & {observedAuthOwner:{current:string|null|undefined}}) {
  const [signedIn, setSignedIn] = useState<boolean | null>(authConfigured ? null : false);
  const [favorite, setFavorite] = useState(false);
  const plan:CalcuMintPlan=useCalculatorPlan();
  const [status, setStatus] = useState("");
  const [statusError,setStatusError]=useState(false);
  const [readFailure,setReadFailure]=useState(false);
  const [readAttempt,setReadAttempt]=useState(0);
  const [saving,setSaving]=useState(false),[favoriting,setFavoriting]=useState(false);
  const saveLock=useRef(false),favoriteLock=useRef(false),readRetryLock=useRef(false),mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false};},[]);
  const report=(message:string,error=false)=>{if(mounted.current){setStatus(message);setStatusError(error);}};
  const accountOwner=useRef<string|null>(null);
  const [favoriteCount,setFavoriteCount]=useState(0);const [historyCount,setHistoryCount]=useState(0);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    void (async () => {
      try{
        const auth=await supabase.auth.getUser();
        if(!active)return;
        if(auth.error)throw new Error("Account authentication unavailable");
        const user=auth.data.user;
        if(!user){accountOwner.current=null;setReadFailure(false);setSignedIn(false);return;}
        const [favoriteResult,favoriteCountResult,historyCountResult]=await Promise.all([
          supabase.from("favorites").select("id").eq("user_id",user.id).eq("calculator_slug",calculatorSlug).maybeSingle(),
          supabase.from("favorites").select("id",{count:"exact",head:true}).eq("user_id",user.id),
          supabase.from("calculation_history").select("id",{count:"exact",head:true}).eq("user_id",user.id)
        ]);
        if(!active)return;
        if(favoriteResult.error||favoriteCountResult.error||historyCountResult.error||!Number.isSafeInteger(favoriteCountResult.count)||favoriteCountResult.count!<0||!Number.isSafeInteger(historyCountResult.count)||historyCountResult.count!<0)throw new Error("Account state unavailable");
        accountOwner.current=user.id;setFavorite(Boolean(favoriteResult.data));setFavoriteCount(favoriteCountResult.count!);setHistoryCount(historyCountResult.count!);setReadFailure(false);setSignedIn(true);
      }catch{if(active){setReadFailure(true);setSignedIn(null);}}
      finally{if(active)readRetryLock.current=false;}
    })();
    return () => { active = false; };
  }, [calculatorSlug,readAttempt]);

  const entitlements=getPlanEntitlements(plan);
  let snapshot:ReturnType<typeof createCalculationSnapshot>|null=null;
  let invalidData=false;
  if(output){try{snapshot=createCalculationSnapshot({calculatorSlug,calculatorVersion,input,output});}catch{invalidData=true;}}


  async function toggleFavorite() {
    if(favoriteLock.current)return;
    favoriteLock.current=true;setFavoriting(true);report("Updating favorite…");
    try{
      const supabase=createSupabaseBrowserClient();if(!supabase)throw new Error("Account unavailable");
      const auth=await supabase.auth.getUser();if(auth.error)throw new Error("Authentication unavailable");const user=auth.data.user;
      if(!user){report("Sign in to update your favorites.",true);return;}
      if(observedAuthOwner.current!==undefined&&observedAuthOwner.current!==user.id)return;
      if(user.id!==accountOwner.current){retryAccountRead();return;}
      const nextFavorite=!favorite;
      if(nextFavorite&&entitlements.favoritesLimit!==null&&favoriteCount>=entitlements.favoritesLimit){report(`Free accounts can save up to ${entitlements.favoritesLimit} favorites.`,true);return;}
      const result=nextFavorite?await supabase.from("favorites").upsert({user_id:user.id,calculator_slug:calculatorSlug}):await supabase.from("favorites").delete().eq("user_id",user.id).eq("calculator_slug",calculatorSlug);
      if(result.error)throw new Error("Favorite update unavailable");
      if(mounted.current){setFavorite(nextFavorite);setFavoriteCount(v=>Math.max(0,v+(nextFavorite?1:-1)));report(nextFavorite?"Added to favorites.":"Removed from favorites.");}
    }catch{report(plan==="free"?"Could not update favorite. Free accounts can save up to 10 favorites.":"Could not update favorite.",true);}
    finally{favoriteLock.current=false;if(mounted.current)setFavoriting(false);}
  }

  async function saveHistory() {
    if(!snapshot||saveLock.current)return;
    saveLock.current=true;setSaving(true);report("Saving calculation…");
    try{
      const supabase=createSupabaseBrowserClient();if(!supabase)throw new Error("Account unavailable");
      const auth=await supabase.auth.getUser();if(auth.error)throw new Error("Authentication unavailable");const user=auth.data.user;
      if(!user){report("Sign in to save this calculation.",true);return;}
      if(observedAuthOwner.current!==undefined&&observedAuthOwner.current!==user.id)return;
      if(user.id!==accountOwner.current){retryAccountRead();return;}
      if(entitlements.historyLimit!==null&&historyCount>=entitlements.historyLimit){report(`Free accounts can keep up to ${entitlements.historyLimit} calculations.`,true);return;}
      const {error}=await supabase.from("calculation_history").insert({user_id:user.id,calculator_slug:snapshot.calculatorSlug,calculator_version:snapshot.calculatorVersion,input_data:snapshot.input,output_data:snapshot.output});
      if(error)throw new Error("History save unavailable");
      if(mounted.current){setHistoryCount(v=>v+1);report("Calculation saved to your history.");}
    }catch{report(plan==="free"?"Could not save. Free accounts can keep up to 20 calculations.":"Could not save calculation.",true);}
    finally{saveLock.current=false;if(mounted.current)setSaving(false);}
  }

  function exportJson() {
    if (!snapshot || !entitlements.exports) return;
    downloadFile(`${calculatorSlug}.json`, serializeCalculationJson(snapshot), "application/json");
  }

  function exportCsv() {
    if (!snapshot || !entitlements.exports) return;
    try {
      downloadFile(`${calculatorSlug}.csv`, serializeCalculationCsv(snapshot.input, snapshot.output), "text/csv;charset=utf-8");
    } catch {
      report("Could not export calculation: result data is invalid.",true);
    }
  }

  function retryAccountRead(){if(readRetryLock.current)return;readRetryLock.current=true;setReadFailure(false);setSignedIn(null);setReadAttempt(value=>value+1);}

  if(readFailure)return <div className="account-actions"><p role="alert">Account actions are temporarily unavailable. Try again.</p><button type="button" className="button secondary" onClick={retryAccountRead}>Retry account actions</button></div>;
  if (signedIn === false) {
    return <div className="account-actions"><Link className="text-link" href="/login">Sign in to save this calculation</Link><CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={downloadFile}/></div>;
  }
  if (signedIn === null) return <p role="status" aria-busy="true">Loading account actions…</p>;

  return (
    <div className="account-actions">
      <button className="button secondary" type="button" onClick={toggleFavorite} disabled={favoriting} aria-busy={favoriting}>{favorite ? "★ Favorited" : "☆ Favorite"}</button>
      <button className="button secondary" type="button" onClick={saveHistory} disabled={!snapshot||saving} aria-busy={saving}>Save calculation</button>
      {entitlements.exports ? (
        <>
          <button className="button secondary" type="button" onClick={exportCsv} disabled={!snapshot}>Export CSV</button>
          <button className="button secondary" type="button" onClick={exportJson} disabled={!snapshot}>Export JSON</button>
        </>
      ) : <Link className="text-link" href="/pricing">Upgrade to Pro for exports and unlimited saves</Link>}
      {invalidData && <p role="alert">Calculation data is invalid. Enter valid inputs before saving or exporting.</p>}
      <CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={downloadFile}/>
      {status && <span className="muted" role={statusError?"alert":"status"} aria-atomic="true">{status}</span>}
    </div>
  );
}
