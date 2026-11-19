'use server';
import {saveSpecializedFactoryHistory,specializedProjects,saveSpecializedFactoryScenario,restoreSpecializedFactoryScenario,readSpecializedFactoryHistory,specializedBusinessProjects} from '@/lib/sole-specialized-factory-20261119/account';
export async function saveHistory(input:Parameters<typeof saveSpecializedFactoryHistory>[0]){return saveSpecializedFactoryHistory(input);}
export async function loadProjects(owner:string){return specializedProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveSpecializedFactoryScenario>[0]){return saveSpecializedFactoryScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreSpecializedFactoryScenario>[0]){return restoreSpecializedFactoryScenario(input);}
export async function readHistory(input:Parameters<typeof readSpecializedFactoryHistory>[0]){try{return {ok:true as const,record:await readSpecializedFactoryHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof specializedBusinessProjects>[0]){try{
  const {role,delivery}=await specializedBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
