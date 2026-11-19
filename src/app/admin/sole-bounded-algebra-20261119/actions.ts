'use server';
import {saveBoundedAlgebraHistory,algebraProjects,saveBoundedAlgebraScenario,restoreBoundedAlgebraScenario,readBoundedAlgebraHistory,algebraBusinessProjects} from '@/lib/sole-bounded-algebra-20261119/account';
export async function saveHistory(input:Parameters<typeof saveBoundedAlgebraHistory>[0]){return saveBoundedAlgebraHistory(input);}
export async function loadProjects(owner:string){return algebraProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveBoundedAlgebraScenario>[0]){return saveBoundedAlgebraScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreBoundedAlgebraScenario>[0]){return restoreBoundedAlgebraScenario(input);}
export async function readHistory(input:Parameters<typeof readBoundedAlgebraHistory>[0]){try{return {ok:true as const,record:await readBoundedAlgebraHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof algebraBusinessProjects>[0]){try{
  const {role,delivery}=await algebraBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
