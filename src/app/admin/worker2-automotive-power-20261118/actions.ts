'use server';
import {savePowerHistory,powerProjects,savePowerScenario,restorePowerScenario,readPowerHistory} from '@/lib/worker2-automotive-power-20261118/account';
export async function saveHistory(input:Parameters<typeof savePowerHistory>[0]){return savePowerHistory(input);}
export async function loadProjects(owner:string){return powerProjects(owner);}
export async function saveScenario(input:Parameters<typeof savePowerScenario>[0]){return savePowerScenario(input);}
export async function restoreScenario(input:Parameters<typeof restorePowerScenario>[0]){return restorePowerScenario(input);}
export async function readHistory(input:Parameters<typeof readPowerHistory>[0]){return readPowerHistory(input);}
