import {disabledProductResponse} from '@/lib/product-route-guard';
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyApiRequest, ApiAuthError } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { customCalculatorSchema, runCustomCalculator } from "@/lib/builder/definition";

const bodySchema=z.object({calculatorId:z.uuid(),rows:z.array(z.record(z.string(),z.json())).min(1).max(100)});
const completion=z.object({status:z.literal('completed'),request_id:z.uuid(),duplicate:z.boolean().optional(),job:z.object({id:z.uuid(),calculator_id:z.uuid(),calculator_version:z.number().int().positive(),output_rows:z.array(z.unknown())})});
const unavailable=(requestId?:string)=>NextResponse.json({error:'Batch outcome is unconfirmed; recover with GET using the same Idempotency-Key before retrying POST',...(requestId?{requestId}:{})},{status:503,headers:{'Cache-Control':'no-store'}});
function result(data:unknown,requestId:string){const parsed=completion.safeParse(data);if(!parsed.success || parsed.data.request_id!==requestId)return unavailable(requestId);const {job}=parsed.data;return NextResponse.json({requestId,jobId:job.id,calculatorId:job.calculator_id,version:job.calculator_version,rows:job.output_rows,...(parsed.data.duplicate?{duplicate:true}:{})},{headers:{'Cache-Control':'no-store'}});}
function storageError(code:string|undefined,requestId:string){if(code==='PT409')return NextResponse.json({error:'Request identity conflicts with immutable batch evidence',requestId},{status:409});if(code==='PT429')return NextResponse.json({error:'API quota exceeded',requestId},{status:429});if(code==='PT403')return NextResponse.json({error:'Batch authority changed',requestId},{status:403});return unavailable(requestId);}

/** Read-only recovery never consumes another request unit or recreates a job. */
export async function GET(request:Request){
  const disabled = disabledProductResponse('apiAndWebhooks'); if (disabled) return disabled;

 const key=z.uuid().transform(value=>value.toLowerCase()).safeParse(request.headers.get('Idempotency-Key'));if(!key.success)return NextResponse.json({error:'A stable Idempotency-Key UUID is required'},{status:400});
 try{const principal=await verifyApiRequest(request,'calculations:batch');const admin=createSupabaseAdminClient();if(!admin)return unavailable(key.data);
  const reply=await admin.rpc('read_verified_batch_job_v1',{p_api_key_id:principal.keyId,p_key_hash:principal.keyHash,p_organization_id:principal.organizationId,p_request_id:key.data});
  if(reply.error)return storageError(reply.error.code,key.data);if(reply.data?.status==='missing')return NextResponse.json({error:'No committed batch found',requestId:key.data},{status:404,headers:{'Cache-Control':'no-store'}});return result(reply.data,key.data);
 }catch(error){if(error instanceof ApiAuthError)return NextResponse.json({error:error.message},{status:error.status});return unavailable(key.data);}
}

export async function POST(request:Request){
  const disabled = disabledProductResponse('apiAndWebhooks'); if (disabled) return disabled;

 const key=z.uuid().transform(value=>value.toLowerCase()).safeParse(request.headers.get('Idempotency-Key'));if(!key.success)return NextResponse.json({error:'A stable Idempotency-Key UUID is required'},{status:400});
 try{
  const principal=await verifyApiRequest(request,'calculations:batch');
  const parsedBody=bodySchema.safeParse(await request.json().catch(()=>null));if(!parsedBody.success)return NextResponse.json({error:'Provide calculatorId and 1-100 rows'},{status:400});
  const {calculatorId,rows}=parsedBody.data;const admin=createSupabaseAdminClient();if(!admin)return unavailable(key.data);
  const args={p_api_key_id:principal.keyId,p_key_hash:principal.keyHash,p_organization_id:principal.organizationId,p_request_id:key.data,p_calculator_id:calculatorId,p_input_rows:rows};
  // This probe is non-writing only when missing. A completed duplicate POST still
  // consumes one authenticated request unit under the atomic quota transaction.
  const probe=await admin.rpc('submit_verified_batch_job_v1',{...args,p_version:null,p_definition:null,p_output_rows:null});
  if(probe.error)return storageError(probe.error.code,key.data);if(probe.data?.status!=='missing')return result(probe.data,key.data);
  const {data:calculator,error:calculatorError}=await admin.from('custom_calculators').select('id,organization_id,published_version,status').eq('id',calculatorId).eq('organization_id',principal.organizationId).eq('status','published').maybeSingle();
  if(calculatorError)return unavailable(key.data);if(!calculator?.published_version)return NextResponse.json({error:'Calculator not found'},{status:404});
  const {data:versionRow,error:versionError}=await admin.from('custom_calculator_versions').select('definition').eq('calculator_id',calculatorId).eq('version',calculator.published_version).maybeSingle();
  if(versionError)return unavailable(key.data);const parsed=customCalculatorSchema.safeParse(versionRow?.definition);if(!parsed.success)return NextResponse.json({error:'Published calculator definition is invalid'},{status:500});
  const outputs=rows.map((row,index)=>{try{return {index,ok:true as const,...runCustomCalculator(parsed.data,row)};}catch(error){return {index,ok:false as const,error:error instanceof Error?error.message:'Calculation failed'};}});
  const reply=await admin.rpc('submit_verified_batch_job_v1',{...args,p_version:calculator.published_version,p_definition:versionRow!.definition,p_output_rows:outputs});
  if(reply.error)return storageError(reply.error.code,key.data);return result(reply.data,key.data);
 }catch(error){if(error instanceof ApiAuthError)return NextResponse.json({error:error.message},{status:error.status});return unavailable(key.data);}
}
