"use client";
import {useEffect,useState} from "react";
import {createSupabaseBrowserClient} from "@/lib/supabase/browser";
import {normalizePlan,type CalcuMintPlan} from "@/lib/entitlements";

export function useCalculatorPlan():CalcuMintPlan{
  const [plan,setPlan]=useState<CalcuMintPlan>("free");
  useEffect(()=>{
    let active=true;
    const supabase=createSupabaseBrowserClient();
    if(!supabase)return;
    void (async()=>{
      const {data:{user}}=await supabase.auth.getUser();
      if(!active||!user){if(active)setPlan("free");return;}
      const {data}=await supabase.from("profiles").select("plan").eq("id",user.id).maybeSingle();
      if(active)setPlan(normalizePlan(data?.plan));
    })();
    return()=>{active=false};
  },[]);
  return plan;
}
