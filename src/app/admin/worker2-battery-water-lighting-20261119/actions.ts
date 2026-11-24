'use server';
import {saveResourceHistory,resourceProjects,saveResourceScenario,restoreResourceScenario,readResourceHistory} from '@/lib/worker2-battery-water-lighting-20261119/account';
export async function saveHistory(input:Parameters<typeof saveResourceHistory>[0]){return saveResourceHistory(input);}
export async function loadProjects(owner:string){return resourceProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveResourceScenario>[0]){return saveResourceScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreResourceScenario>[0]){return restoreResourceScenario(input);}
export async function readHistory(input:Parameters<typeof readResourceHistory>[0]){return readResourceHistory(input);}
