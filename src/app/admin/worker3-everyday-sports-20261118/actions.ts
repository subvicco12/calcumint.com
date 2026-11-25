'use server';
import {saveEverydayHistory,everydayProjects,saveEverydayScenario,restoreEverydayScenario,readEverydayHistory,everydayBusinessProjects} from '@/lib/worker3-everyday-sports-20261118/account';
export async function saveHistory(input:Parameters<typeof saveEverydayHistory>[0]){return saveEverydayHistory(input);}
export async function loadProjects(owner:string){return everydayProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveEverydayScenario>[0]){return saveEverydayScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreEverydayScenario>[0]){return restoreEverydayScenario(input);}
export async function readHistory(input:Parameters<typeof readEverydayHistory>[0]){return readEverydayHistory(input);}
export async function loadBusiness(input:Parameters<typeof everydayBusinessProjects>[0]){return everydayBusinessProjects(input);}
