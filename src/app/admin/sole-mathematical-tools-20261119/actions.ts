'use server';
import {saveMathematicalToolsHistory,mathProjects,saveMathematicalToolsScenario,restoreMathematicalToolsScenario,readMathematicalToolsHistory,mathBusinessProjects} from '@/lib/sole-mathematical-tools-20261119/account';
export async function saveHistory(input:Parameters<typeof saveMathematicalToolsHistory>[0]){return saveMathematicalToolsHistory(input);}
export async function loadProjects(owner:string){return mathProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveMathematicalToolsScenario>[0]){return saveMathematicalToolsScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreMathematicalToolsScenario>[0]){return restoreMathematicalToolsScenario(input);}
export async function readHistory(input:Parameters<typeof readMathematicalToolsHistory>[0]){try{return {ok:true as const,record:await readMathematicalToolsHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof mathBusinessProjects>[0]){try{
  const {role,delivery}=await mathBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
