'use server';
import {saveStructuredFactoryHistory,structuredProjects,saveStructuredFactoryScenario,restoreStructuredFactoryScenario,readStructuredFactoryHistory,structuredBusinessProjects} from '@/lib/sole-structured-factory-20261119/account';
export async function saveHistory(input:Parameters<typeof saveStructuredFactoryHistory>[0]){return saveStructuredFactoryHistory(input);}
export async function loadProjects(owner:string){return structuredProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveStructuredFactoryScenario>[0]){return saveStructuredFactoryScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreStructuredFactoryScenario>[0]){return restoreStructuredFactoryScenario(input);}
export async function readHistory(input:Parameters<typeof readStructuredFactoryHistory>[0]){try{return {ok:true as const,record:await readStructuredFactoryHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof structuredBusinessProjects>[0]){try{
  const {role,delivery}=await structuredBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
