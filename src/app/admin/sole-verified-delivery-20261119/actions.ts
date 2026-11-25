'use server';
import {saveVerifiedDeliveryHistory,deliveryProjects,saveVerifiedDeliveryScenario,restoreVerifiedDeliveryScenario,readVerifiedDeliveryHistory,deliveryBusinessProjects} from '@/lib/sole-verified-delivery-20261119/account';
export async function saveHistory(input:Parameters<typeof saveVerifiedDeliveryHistory>[0]){return saveVerifiedDeliveryHistory(input);}
export async function loadProjects(owner:string){return deliveryProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveVerifiedDeliveryScenario>[0]){return saveVerifiedDeliveryScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreVerifiedDeliveryScenario>[0]){return restoreVerifiedDeliveryScenario(input);}
export async function readHistory(input:Parameters<typeof readVerifiedDeliveryHistory>[0]){try{return {ok:true as const,record:await readVerifiedDeliveryHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof deliveryBusinessProjects>[0]){try{
  const {role,delivery}=await deliveryBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
