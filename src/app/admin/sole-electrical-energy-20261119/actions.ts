'use server';
import {saveElectricalEnergyHistory,energyProjects,saveElectricalEnergyScenario,restoreElectricalEnergyScenario,readElectricalEnergyHistory,energyBusinessProjects} from '@/lib/sole-electrical-energy-20261119/account';
export async function saveHistory(input:Parameters<typeof saveElectricalEnergyHistory>[0]){return saveElectricalEnergyHistory(input);}
export async function loadProjects(owner:string){return energyProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveElectricalEnergyScenario>[0]){return saveElectricalEnergyScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreElectricalEnergyScenario>[0]){return restoreElectricalEnergyScenario(input);}
export async function readHistory(input:Parameters<typeof readElectricalEnergyHistory>[0]){try{return {ok:true as const,record:await readElectricalEnergyHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof energyBusinessProjects>[0]){try{
  const {role,delivery}=await energyBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
