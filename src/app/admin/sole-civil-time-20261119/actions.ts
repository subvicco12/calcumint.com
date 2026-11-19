'use server';
import {saveCivilTimeHistory,timeProjects,saveCivilTimeScenario,restoreCivilTimeScenario,readCivilTimeHistory,timeBusinessProjects} from '@/lib/sole-civil-time-20261119/account';
export async function saveHistory(input:Parameters<typeof saveCivilTimeHistory>[0]){return saveCivilTimeHistory(input);}
export async function loadProjects(owner:string){return timeProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveCivilTimeScenario>[0]){return saveCivilTimeScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreCivilTimeScenario>[0]){return restoreCivilTimeScenario(input);}
export async function readHistory(input:Parameters<typeof readCivilTimeHistory>[0]){try{return {ok:true as const,record:await readCivilTimeHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof timeBusinessProjects>[0]){try{
  const {role,delivery}=await timeBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
