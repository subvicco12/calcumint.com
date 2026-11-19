'use server';
import {saveMobilityHistory,mobilityProjects,saveMobilityScenario,restoreMobilityScenario,readMobilityHistory} from '@/lib/worker2-energy-mobility-20261119/account';
export async function saveHistory(input:Parameters<typeof saveMobilityHistory>[0]){return saveMobilityHistory(input);}
export async function loadProjects(owner:string){return mobilityProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveMobilityScenario>[0]){return saveMobilityScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreMobilityScenario>[0]){return restoreMobilityScenario(input);}
export async function readHistory(input:Parameters<typeof readMobilityHistory>[0]){return readMobilityHistory(input);}
