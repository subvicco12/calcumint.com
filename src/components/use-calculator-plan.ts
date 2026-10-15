"use client";
import {useEffect,useState} from "react";
import {createSupabaseBrowserClient} from "@/lib/supabase/browser";
import {normalizePlan,type CalcuMintPlan} from "@/lib/entitlements";

export function useCalculatorPlan():CalcuMintPlan{
  const [plan,setPlan]=useState<CalcuMintPlan>("free");
  useEffect(()=>{
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
    function identify(id:string|null){
      if(!active||identity===id)return;
      identity=id;const request=++revision;setPlan("free");
      // Auth callbacks must finish synchronously before another SDK request starts.
      if(id)queueMicrotask(()=>{if(active&&request===revision)void loadPlan(id,request);});
    }
    const subscription=typeof supabase.auth.onAuthStateChange==="function"
      ?supabase.auth.onAuthStateChange((_event,session)=>identify(session?.user.id??null)).data.subscription:null;
    void supabase.auth.getUser().then(({data,error})=>{
      if(active&&identity===undefined)identify(error?null:data.user?.id??null);
    }).catch(()=>{if(active&&identity===undefined)identify(null);});
    return()=>{active=false;subscription?.unsubscribe();};
  },[]);
  return plan;
}
