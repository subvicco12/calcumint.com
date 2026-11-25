'use server';
import {saveFinalFactoryHistory,finalProjects,saveFinalFactoryScenario,restoreFinalFactoryScenario,readFinalFactoryHistory,finalBusinessProjects} from '@/lib/sole-final-factory-20261119/account';
export async function saveHistory(input:Parameters<typeof saveFinalFactoryHistory>[0]){return saveFinalFactoryHistory(input);}
export async function loadProjects(owner:string){return finalProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveFinalFactoryScenario>[0]){return saveFinalFactoryScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreFinalFactoryScenario>[0]){return restoreFinalFactoryScenario(input);}
export async function readHistory(input:Parameters<typeof readFinalFactoryHistory>[0]){try{return {ok:true as const,record:await readFinalFactoryHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof finalBusinessProjects>[0]){try{
  const {role,delivery}=await finalBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
