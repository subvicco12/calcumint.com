'use server';
import {saveFoodRatioHistory,ratioProjects,saveFoodRatioScenario,restoreFoodRatioScenario,readFoodRatioHistory,ratioBusinessProjects} from '@/lib/worker1-food-ratios-20261119/account';
export async function saveHistory(input:Parameters<typeof saveFoodRatioHistory>[0]){return saveFoodRatioHistory(input);}
export async function loadProjects(owner:string){return ratioProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveFoodRatioScenario>[0]){return saveFoodRatioScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreFoodRatioScenario>[0]){return restoreFoodRatioScenario(input);}
export async function readHistory(input:Parameters<typeof readFoodRatioHistory>[0]){try{return {ok:true as const,record:await readFoodRatioHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof ratioBusinessProjects>[0]){try{
  const {role,delivery}=await ratioBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
