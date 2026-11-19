'use server';
import {saveCalendarHistory,calendarProjects,saveCalendarScenario,restoreCalendarScenario,readCalendarHistory,calendarBusinessProjects} from '@/lib/worker1-calendar-20261119/account';
export async function saveHistory(input:Parameters<typeof saveCalendarHistory>[0]){return saveCalendarHistory(input);}
export async function loadProjects(owner:string){return calendarProjects(owner);}
export async function saveScenario(input:Parameters<typeof saveCalendarScenario>[0]){return saveCalendarScenario(input);}
export async function restoreScenario(input:Parameters<typeof restoreCalendarScenario>[0]){return restoreCalendarScenario(input);}
export async function readHistory(input:Parameters<typeof readCalendarHistory>[0]){try{return {ok:true as const,record:await readCalendarHistory(input)};}
 catch{return {ok:false as const};}}
export async function loadBusiness(input:Parameters<typeof calendarBusinessProjects>[0]){try{
  const {role,delivery}=await calendarBusinessProjects(input);
  return {ok:true as const,role,reason:delivery.reason};
 }catch{return {ok:false as const};}}
