"use client";

import Link from "next/link";
import {requiresSignIn} from "@/lib/auth-recovery";
import {requestAccountRecovery} from '@/lib/account-recovery';
import {CalculatorScenarioWorkspace} from "./calculator-scenario-workspace";
import { serializeCalculationCsv } from "@/lib/calculation-export";
import { createCalculationSnapshot, serializeCalculationJson } from "@/lib/calculation-snapshot";
import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {getPlanEntitlements,type CalcuMintPlan} from "@/lib/entitlements";
import {useCalculatorPlan} from "@/components/use-calculator-plan";

import type {ScenarioDisplayMetadata} from "@/lib/scenario-display-metadata";

type Props = {
  scenarioDisplayMetadata?:ScenarioDisplayMetadata;
  calculatorSlug: string;
  calculatorVersion: number;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
};

const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

type AccountBrowserClient=NonNullable<ReturnType<typeof createSupabaseBrowserClient>>;

/** UI preflight only: the database remains authoritative for atomic quota enforcement. */
async function readCurrentSaveCount(client:AccountBrowserClient,table:"favorites"|"calculation_history",userId:string){
  const result=await client.from(table).select("id",{count:"exact",head:true}).eq("user_id",userId);
  if(result.error||!Number.isSafeInteger(result.count)||result.count!<0)throw new Error("Account quota unavailable");
  return result.count!;
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
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

function AccountActionsSession({ calculatorSlug, calculatorVersion, input, output,scenarioDisplayMetadata,observedAuthOwner }: Props & {observedAuthOwner:{current:string|null|undefined}}) {
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
  const [scenarioOwner,setScenarioOwner]=useState(observedAuthOwner.current);
  const retryButton=useRef<HTMLButtonElement>(null),firstAction=useRef<HTMLButtonElement>(null),saveAction=useRef<HTMLButtonElement>(null),loginLink=useRef<HTMLAnchorElement>(null),restoreRetryFocus=useRef(false);
  useEffect(()=>{
    if(!restoreRetryFocus.current||(!readFailure&&signedIn===null))return;
    restoreRetryFocus.current=false;
    if(document.activeElement!==document.body)return;
    if(readFailure)retryButton.current?.focus();
    else if(signedIn)firstAction.current?.focus();
    else loginLink.current?.focus();
  },[readFailure,signedIn]);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    void (async () => {
      try{
        const auth=await supabase.auth.getUser();
        if(!active)return;
        if(auth.error&&!requiresSignIn(auth.error))throw new Error("Account authentication unavailable");
        const user=auth.error?null:auth.data.user;
        // Auth notifications may be delayed or absent. A verified read must also
        // invalidate captures before any new owner's account queries complete.
        if(observedAuthOwner.current!==(user?.id??null)){setStatus("");setStatusError(false);}
        observedAuthOwner.current=user?.id??null;
        setScenarioOwner(observedAuthOwner.current);
        if(!user){accountOwner.current=null;setReadFailure(false);setSignedIn(false);return;}
        const [favoriteResult,favoriteCountResult,historyCountResult]=await Promise.all([
          supabase.from("favorites").select("id").eq("user_id",user.id).eq("calculator_slug",calculatorSlug).maybeSingle(),
          supabase.from("favorites").select("id",{count:"exact",head:true}).eq("user_id",user.id),
          supabase.from("calculation_history").select("id",{count:"exact",head:true}).eq("user_id",user.id)
        ]);
        if(!active)return;
        if(favoriteResult.error||favoriteCountResult.error||historyCountResult.error||!Number.isSafeInteger(favoriteCountResult.count)||favoriteCountResult.count!<0||!Number.isSafeInteger(historyCountResult.count)||historyCountResult.count!<0)throw new Error("Account state unavailable");
        accountOwner.current=user.id;setFavorite(Boolean(favoriteResult.data));setReadFailure(false);setSignedIn(true);
      }catch(error){if(active){if(requiresSignIn(error)){accountOwner.current=null;setReadFailure(false);setSignedIn(false);}else{setReadFailure(true);setSignedIn(null);}}}
      finally{if(active)readRetryLock.current=false;}
    })();
    return () => { active = false; };
  }, [calculatorSlug,readAttempt,observedAuthOwner]);

  const entitlements=getPlanEntitlements(plan);
  let snapshot:ReturnType<typeof createCalculationSnapshot>|null=null;
  let invalidData=false;
  if(output){try{snapshot=createCalculationSnapshot({calculatorSlug,calculatorVersion,input,output});}catch{invalidData=true;}}


  function isCurrentActionOwner(owner:string|null){
    return mounted.current&&accountOwner.current===owner&&observedAuthOwner.current===owner;
  }

  function requireActionSignIn(owner:string|null,focusedElement:Element|null){
    // An old request must never invalidate a replacement owner's workspace.
    if(!isCurrentActionOwner(owner))return;
    restoreRetryFocus.current=document.activeElement===focusedElement&&(focusedElement===firstAction.current||focusedElement===saveAction.current);
    accountOwner.current=null;observedAuthOwner.current=null;
    setScenarioOwner(null);setFavorite(false);setReadFailure(false);setSignedIn(false);
    setStatus("");setStatusError(false);
    requestAccountRecovery();
  }

  async function toggleFavorite() {
    if(favoriteLock.current)return;
    const actionOwner=accountOwner.current,focusedElement=document.activeElement;
    favoriteLock.current=true;setFavoriting(true);report("Updating favorite…");
    try{
      const supabase=createSupabaseBrowserClient();if(!supabase)throw new Error("Account unavailable");
      const auth=await supabase.auth.getUser();if(auth.error)throw auth.error;const user=auth.data.user;
      if(!user){requireActionSignIn(actionOwner,focusedElement);return;}
      if(observedAuthOwner.current!==undefined&&observedAuthOwner.current!==user.id){
        if(mounted.current)retryAccountRead();
        return;
      }
      if(user.id!==accountOwner.current){retryAccountRead();return;}
      const nextFavorite=!favorite;
      if(nextFavorite&&entitlements.favoritesLimit!==null){
        const count=await readCurrentSaveCount(supabase,"favorites",user.id);
        if(observedAuthOwner.current!==undefined&&observedAuthOwner.current!==user.id)return;
        if(count>=entitlements.favoritesLimit){report(`Free accounts can save up to ${entitlements.favoritesLimit} favorites.`,true);return;}
      }
      const result=nextFavorite?await supabase.from("favorites").upsert({user_id:user.id,calculator_slug:calculatorSlug}):await supabase.from("favorites").delete().eq("user_id",user.id).eq("calculator_slug",calculatorSlug);
      if(result.error)throw new Error("Favorite update unavailable");
      if(isCurrentActionOwner(actionOwner)){setFavorite(nextFavorite);report(nextFavorite?"Added to favorites.":"Removed from favorites.");}
    }catch(error){if(requiresSignIn(error)){requireActionSignIn(actionOwner,focusedElement);return;}if(isCurrentActionOwner(actionOwner))report(plan==="free"?"Could not update favorite. Free accounts can save up to 10 favorites.":"Could not update favorite.",true);}
    finally{favoriteLock.current=false;if(mounted.current)setFavoriting(false);}
  }

  async function saveHistory() {
    if(!snapshot||saveLock.current)return;
    const actionOwner=accountOwner.current,focusedElement=document.activeElement;
    saveLock.current=true;setSaving(true);report("Saving calculation…");
    try{
      const supabase=createSupabaseBrowserClient();if(!supabase)throw new Error("Account unavailable");
      const auth=await supabase.auth.getUser();if(auth.error)throw auth.error;const user=auth.data.user;
      if(!user){requireActionSignIn(actionOwner,focusedElement);return;}
      if(observedAuthOwner.current!==undefined&&observedAuthOwner.current!==user.id){
        if(mounted.current)retryAccountRead();
        return;
      }
      if(user.id!==accountOwner.current){retryAccountRead();return;}
      if(entitlements.historyLimit!==null){
        const count=await readCurrentSaveCount(supabase,"calculation_history",user.id);
        if(observedAuthOwner.current!==undefined&&observedAuthOwner.current!==user.id)return;
        if(count>=entitlements.historyLimit){report(`Free accounts can keep up to ${entitlements.historyLimit} calculations.`,true);return;}
      }
      const {error}=await supabase.from("calculation_history").insert({user_id:user.id,calculator_slug:snapshot.calculatorSlug,calculator_version:snapshot.calculatorVersion,input_data:snapshot.input,output_data:snapshot.output});
      if(error)throw new Error("History save unavailable");
      if(isCurrentActionOwner(actionOwner)){report("Calculation saved to your history.");}
    }catch(error){if(requiresSignIn(error)){requireActionSignIn(actionOwner,focusedElement);return;}if(isCurrentActionOwner(actionOwner))report(plan==="free"?"Could not save. Free accounts can keep up to 20 calculations.":"Could not save calculation.",true);}
    finally{saveLock.current=false;if(mounted.current)setSaving(false);}
  }

  function exportJson() {
    if (!snapshot || !entitlements.exports) return;
    try {
      downloadFile(`${calculatorSlug}.json`, serializeCalculationJson(snapshot), "application/json");
      report("");
    } catch {
      report("Could not download calculation. Try again.",true);
    }
  }

  function exportCsv() {
    if (!snapshot || !entitlements.exports) return;
    try {
      downloadFile(`${calculatorSlug}.csv`, serializeCalculationCsv(snapshot.input, snapshot.output), "text/csv;charset=utf-8");
      report("");
    } catch {
      report("Could not download calculation. Try again.",true);
    }
  }

  function retryAccountRead(){if(readRetryLock.current)return;readRetryLock.current=true;restoreRetryFocus.current=document.activeElement===retryButton.current;requestAccountRecovery();setReadFailure(false);setSignedIn(null);setReadAttempt(value=>value+1);}

  return (
    <div className="account-actions">
      {readFailure ? <div><p role="alert">Account actions are temporarily unavailable. Try again.</p><button type="button" className="button secondary" ref={retryButton} onClick={retryAccountRead}>Retry account actions</button></div>
        : signedIn === false ? <Link ref={loginLink} className="text-link" href="/login">Sign in to save this calculation</Link>
        : signedIn === null ? <p role="status" aria-busy="true">Loading account actions…</p>
        : <>
      <button className="button secondary" type="button" ref={firstAction} onClick={toggleFavorite} disabled={favoriting} aria-busy={favoriting}>{favorite ? "★ Favorited" : "☆ Favorite"}</button>
      <button className="button secondary" type="button" ref={saveAction} onClick={saveHistory} disabled={!snapshot||saving} aria-busy={saving}>Save calculation</button>
      {entitlements.exports ? (
        <>
          <button className="button secondary" type="button" onClick={exportCsv} disabled={!snapshot}>Export CSV</button>
          <button className="button secondary" type="button" onClick={exportJson} disabled={!snapshot}>Export JSON</button>
        </>
      ) : <Link className="text-link" href="/pricing">Upgrade to Pro for exports and unlimited saves</Link>}
      {invalidData && <p role="alert">Calculation data is invalid. Enter valid inputs before saving or exporting.</p>}
      {status && <span className="muted" role={statusError?"alert":"status"} aria-atomic="true">{status}</span>}
      </>}
      <CalculatorScenarioWorkspace key={JSON.stringify([scenarioOwner!==undefined,scenarioOwner])} plan={plan} snapshot={snapshot} displayMetadata={scenarioDisplayMetadata} download={downloadFile}/>
    </div>
  );
}
