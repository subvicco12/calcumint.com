'use server';
import {saveMechanicsHistory,mechanicsProjects,saveMechanicsScenario,restoreMechanicsScenario,readMechanicsHistory,mechanicsBusinessProjects} from '@/lib/worker1-mechanics-20261118/account';
export async function saveHistory(input:Parameters<typeof saveMechanicsHistory>[0]){return saveMechanicsHistory(input);}
export async function loadProjects(owner:string){return mechanicsProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveMechanicsScenario>[0]){return saveMechanicsScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreMechanicsScenario>[0]){return restoreMechanicsScenario(input);}
export async function readHistory(input:Parameters<typeof readMechanicsHistory>[0]){try{return {ok:true as const,record:await readMechanicsHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof mechanicsBusinessProjects>[0]){try{
  const {role,delivery}=await mechanicsBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
