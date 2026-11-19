'use server';
import {saveLinearSystemsHistory,linearProjects,saveLinearSystemsScenario,restoreLinearSystemsScenario,readLinearSystemsHistory,linearBusinessProjects} from '@/lib/sole-linear-systems-20261119/account';
export async function saveHistory(input:Parameters<typeof saveLinearSystemsHistory>[0]){return saveLinearSystemsHistory(input);}
export async function loadProjects(owner:string){return linearProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveLinearSystemsScenario>[0]){return saveLinearSystemsScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreLinearSystemsScenario>[0]){return restoreLinearSystemsScenario(input);}
export async function readHistory(input:Parameters<typeof readLinearSystemsHistory>[0]){try{return {ok:true as const,record:await readLinearSystemsHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof linearBusinessProjects>[0]){try{
  const {role,delivery}=await linearBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
