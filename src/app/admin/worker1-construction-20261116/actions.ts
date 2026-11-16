'use server';
import {saveConstructionHistory,constructionProjects,saveConstructionScenario,restoreConstructionScenario,readConstructionHistory,constructionBusinessProjects} from '@/lib/worker1-construction-20261116/account';
export async function saveHistory(input:Parameters<typeof saveConstructionHistory>[0]){return saveConstructionHistory(input);}
export async function loadProjects(owner:string){return constructionProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveConstructionScenario>[0]){return saveConstructionScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreConstructionScenario>[0]){return restoreConstructionScenario(input);}
export async function readHistory(input:Parameters<typeof readConstructionHistory>[0]){return readConstructionHistory(input);}
export async function loadBusiness(input:Parameters<typeof constructionBusinessProjects>[0]){return constructionBusinessProjects(input);}
