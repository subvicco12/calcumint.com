'use server';
import {savePhysicsQuantityHistory,physicsQuantityProjects,savePhysicsQuantityScenario,restorePhysicsQuantityScenario,readPhysicsQuantityHistory,physicsQuantityBusinessProjects} from '@/lib/worker1-waves-circuits-20261118/account';
export async function saveHistory(input:Parameters<typeof savePhysicsQuantityHistory>[0]){return savePhysicsQuantityHistory(input);}
export async function loadProjects(owner:string){return physicsQuantityProjects(owner);}
export async function saveScenario(input:Parameters<typeof savePhysicsQuantityScenario>[0]){return savePhysicsQuantityScenario(input);}
export async function restoreScenario(input:Parameters<typeof restorePhysicsQuantityScenario>[0]){return restorePhysicsQuantityScenario(input);}
export async function readHistory(input:Parameters<typeof readPhysicsQuantityHistory>[0]){try{return {ok:true as const,record:await readPhysicsQuantityHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof physicsQuantityBusinessProjects>[0]){try{
  const {role,delivery}=await physicsQuantityBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
