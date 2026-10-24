"use client";
import {useProductCapabilities} from "./product-capabilities";
import {ACCOUNT_RECOVERY_EVENT} from '@/lib/account-recovery';
import {useEffect,useState} from "react";
import {createSupabaseBrowserClient} from "@/lib/supabase/browser";
import {normalizePlan,type CalcuMintPlan} from "@/lib/entitlements";

export function useCalculatorPlan():CalcuMintPlan{
  const {accounts}=useProductCapabilities();
  const [plan,setPlan]=useState<CalcuMintPlan>("free");
  useEffect(()=>{
    if(!accounts)return;
    let active=true,revision=0;
    let identity:string|null|undefined;
    const supabase=createSupabaseBrowserClient();
    if(!supabase)return;
    async function loadPlan(id:string,request:number){
      try{
        const {data,error}=await supabase!.from("profiles").select("plan").eq("id",id).maybeSingle();
        if(active&&request===revision)setPlan(error?"free":normalizePlan(data?.plan));
      }catch{if(active&&request===revision)setPlan("free");}
    }
    function identify(id:string|null,revalidate=false){
      if(!active||(identity===id&&!revalidate))return;
      identity=id;const request=++revision;setPlan("free");
      // Auth callbacks must finish synchronously before another SDK request starts.
      if(id)queueMicrotask(()=>{if(active&&request===revision)void loadPlan(id,request);});
    }
    // Re-authentication/user updates invalidate profile-derived capabilities even for
    // the same account. Routine token refresh preserves the existing no-reload contract.
    const subscription=typeof supabase.auth.onAuthStateChange==="function"
      ?supabase.auth.onAuthStateChange((event,session)=>identify(session?.user.id??null,event==="SIGNED_IN"||event==="USER_UPDATED"||event==="SIGNED_OUT")).data.subscription:null;
    async function reloadIdentity(){
      const request=++revision;setPlan("free");
      try{
        const {data,error}=await supabase!.auth.getUser();
        if(active&&request===revision)identify(error?null:data.user?.id??null,true);
      }catch{if(active&&request===revision)identify(null,true);}
    }
    const retry=()=>{void reloadIdentity();};
    window.addEventListener(ACCOUNT_RECOVERY_EVENT,retry);
    const initialRequest=revision;
    void supabase.auth.getUser().then(({data,error})=>{
      if(active&&identity===undefined&&initialRequest===revision)identify(error?null:data.user?.id??null);
    }).catch(()=>{if(active&&identity===undefined&&initialRequest===revision)identify(null);});
    return()=>{active=false;window.removeEventListener(ACCOUNT_RECOVERY_EVENT,retry);subscription?.unsubscribe();};
  },[accounts]);
  return accounts?plan:"free";
}
