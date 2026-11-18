'use server';
import {saveMechanicsHistory,mechanicsProjects,saveMechanicsScenario,restoreMechanicsScenario,readMechanicsHistory,mechanicsBusinessProjects} from '@/lib/worker1-mechanics-20261118/account';
export async function saveHistory(input:Parameters<typeof saveMechanicsHistory>[0]){return saveMechanicsHistory(input);}
export async function loadProjects(owner:string){return mechanicsProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveMechanicsScenario>[0]){return saveMechanicsScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreMechanicsScenario>[0]){return restoreMechanicsScenario(input);}
export async function readHistory(input:Parameters<typeof readMechanicsHistory>[0]){return readMechanicsHistory(input);}
export async function loadBusiness(input:Parameters<typeof mechanicsBusinessProjects>[0]){return mechanicsBusinessProjects(input);}
