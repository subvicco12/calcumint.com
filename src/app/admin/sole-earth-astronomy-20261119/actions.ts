'use server';
import {saveEarthAstronomyHistory,earthProjects,saveEarthAstronomyScenario,restoreEarthAstronomyScenario,readEarthAstronomyHistory,earthBusinessProjects} from '@/lib/sole-earth-astronomy-20261119/account';
export async function saveHistory(input:Parameters<typeof saveEarthAstronomyHistory>[0]){return saveEarthAstronomyHistory(input);}
export async function loadProjects(owner:string){return earthProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveEarthAstronomyScenario>[0]){return saveEarthAstronomyScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreEarthAstronomyScenario>[0]){return restoreEarthAstronomyScenario(input);}
export async function readHistory(input:Parameters<typeof readEarthAstronomyHistory>[0]){try{return {ok:true as const,record:await readEarthAstronomyHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof earthBusinessProjects>[0]){try{
  const {role,delivery}=await earthBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
