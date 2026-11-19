'use server';
import {saveFoodHistory,foodProjects,saveFoodScenario,restoreFoodScenario,readFoodHistory,foodBusinessProjects} from '@/lib/worker3-food-quantity-20261119/account';
export async function saveHistory(input:Parameters<typeof saveFoodHistory>[0]){return saveFoodHistory(input);}
export async function loadProjects(owner:string){return foodProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveFoodScenario>[0]){return saveFoodScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreFoodScenario>[0]){return restoreFoodScenario(input);}
export async function readHistory(input:Parameters<typeof readFoodHistory>[0]){return readFoodHistory(input);}
export async function loadBusiness(input:Parameters<typeof foodBusinessProjects>[0]){return foodBusinessProjects(input);}
