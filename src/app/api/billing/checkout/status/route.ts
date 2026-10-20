import {NextResponse} from 'next/server';
import {z} from 'zod';
import {createSupabaseServerClient} from '@/lib/supabase/server';
import {paddleRequest} from '@/lib/billing/paddle';

const selection=z.object({transactionId:z.string().min(1).max(128),expectedOwnerId:z.string().min(1).max(128),plan:z.enum(['pro','business']),interval:z.enum(['monthly','yearly'])});
const evidence=z.object({id:z.string(),status:z.string(),custom_data:z.object({calcumint_user_id:z.string(),calcumint_plan:z.string(),billing_interval:z.string()})});
const reply=(body:object,status:number)=>NextResponse.json(body,{status,headers:{'Cache-Control':'private, no-store'}});

/** Read-only reconciliation; no entitlement or publication authority is granted. */
export async function GET(request:Request){
 const client=await createSupabaseServerClient();
 if(!client)return reply({verified:false},503);
 const auth=await client.auth.getUser();
 if(auth.error||!auth.data.user)return reply({verified:false},401);
 const parsed=selection.safeParse(Object.fromEntries(new URL(request.url).searchParams));
 if(!parsed.success)return reply({verified:false},400);
 const input=parsed.data;
 if(input.expectedOwnerId!==auth.data.user.id)return reply({verified:false},409);
 try{
  const result=evidence.safeParse(await paddleRequest<unknown>(`/transactions/${encodeURIComponent(input.transactionId)}`,{method:'GET'}));
  if(!result.success)return reply({verified:false},409);
  const data=result.data,metadata=data.custom_data;
  if(data.id!==input.transactionId||metadata.calcumint_user_id!==auth.data.user.id||metadata.calcumint_plan!==input.plan||metadata.billing_interval!==input.interval)return reply({verified:false},409);
  return data.status==='completed'?reply({verified:true},200):reply({verified:false},202);
 }catch{return reply({verified:false},502);}
}
