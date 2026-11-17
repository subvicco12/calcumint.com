'use server';
import {saveStatisticsHistory,statisticsProjects,saveStatisticsScenario,restoreStatisticsScenario,readStatisticsHistory,statisticsBusinessProjects} from '@/lib/worker2-statistics-b-20261117/account';
export async function saveHistory(input:Parameters<typeof saveStatisticsHistory>[0]){return saveStatisticsHistory(input);}
export async function loadProjects(owner:string){return statisticsProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveStatisticsScenario>[0]){return saveStatisticsScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreStatisticsScenario>[0]){return restoreStatisticsScenario(input);}
export async function readHistory(input:Parameters<typeof readStatisticsHistory>[0]){return readStatisticsHistory(input);}
export async function loadBusiness(input:Parameters<typeof statisticsBusinessProjects>[0]){return statisticsBusinessProjects(input);}
