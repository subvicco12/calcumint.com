import Link from 'next/link';
import {redirect} from 'next/navigation';
import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {draftMasterIdForSlug} from '@/lib/draft-persistence-contract';
import {projectTimestamp} from '@/lib/project-pagination';
export const querySchema=z.object({cursor:z.string().max(2048).optional(),historyId:z.string().uuid().optional()});
export const projectSchema=z.object({id:z.string().uuid(),name:z.string().min(1).max(120),description:z.string().nullable(),created_at:projectTimestamp});
export const scenarioSchema=z.object({id:z.string().uuid(),name:z.string().min(1).max(120),calculator_slug:z.string().min(1),calculator_version:z.number().int().positive(),created_at:projectTimestamp});
export function Unavailable({href='/account/projects'}:{href?:string}){return <section className="container page-top"><h1>Projects unavailable</h1><p role="status">We could not open this page of saved work.</p><Link href={href}>Retry projects</Link><p><Link href="/account">Return to account</Link></p></section>;}
export async function projectSession(){const supabase=await createSupabaseServerClient();if(!supabase)throw Error();const auth=await supabase.auth.getUser();if(auth.error)throw Error();return {supabase,user:auth.data.user};}
export function signIn():never{redirect('/login');}
export async function selectedHistory(supabase:NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,owner:string,id?:string){
 if(!id)return null;
 const result=await supabase.from('calculation_history').select('id,calculator_slug,calculator_version').eq('user_id',owner).eq('id',id).maybeSingle();
 if(result.error)throw Error();
 const row=z.object({id:z.string().uuid(),calculator_slug:z.string().min(1),calculator_version:z.number().int().positive()}).parse(result.data);
 // Private captures keep their existing reviewer route and authorization contract.
 if(draftMasterIdForSlug(row.calculator_slug)!==undefined)throw Error();
 return row;
}
export function projectHref(path:string,historyId?:string,cursor?:string){const query=new URLSearchParams();if(historyId)query.set('historyId',historyId);if(cursor)query.set('cursor',cursor);return `${path}${query.size?`?${query}`:''}`;}
