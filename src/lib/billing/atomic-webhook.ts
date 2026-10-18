/** Guarded subscription webhook orchestration.
 * Storage functions remain proposals; unavailable RPCs fail closed. No REST fallback.
 */
import { z } from 'zod';
import { verifyPaddleSignature, type PaddlePriceSelection } from './paddle';

export type BillingRpcName = 'read_verified_billing_completion_v1' | 'read_billing_fence_v1' | 'apply_verified_billing_event_v1';
export type BillingRpcReply = {data: unknown; error: {code?: string; message?: string} | null};
export type AtomicBillingDependencies = {
  enabled?: boolean;
  secret?: string;
  rpc: (name: BillingRpcName, args: Record<string,unknown>) => Promise<BillingRpcReply>;
  fetchSubscription: (id: string) => Promise<unknown>;
  selectionForPriceId: (id: string) => PaddlePriceSelection | null;
};
export type AtomicBillingResult = {outcome:'applied'|'duplicate';revision:string} | {
  outcome:'disabled'|'invalid_receipt'|'invalid_snapshot'|'identity_conflict'|'invalid_selection'|'review_required'|'retry_required'|'provider_unavailable'|'storage_unavailable';
};
const receiptSchema = z.object({
  event_id:z.string().min(1),event_type:z.string().startsWith('subscription.'),
  occurred_at:z.iso.datetime({offset:true}).optional(),data:z.record(z.string(),z.unknown())
});
const ownerSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
const selectionSchema = z.object({plan:z.enum(['pro','business']),interval:z.enum(['monthly','yearly'])});
const periodSchema = z.object({starts_at:z.iso.datetime({offset:true}),ends_at:z.iso.datetime({offset:true})});
const object = (value:unknown):Record<string,unknown> => value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
const nonempty = (value:unknown):value is string => typeof value==='string'&&value.trim().length>0;
function revision(value:unknown):value is string {
  return typeof value==='string'&&/^(0|[1-9][0-9]{0,18})$/.test(value)&&BigInt(value)<=9223372036854775807n;
}
async function safeRpc(deps:AtomicBillingDependencies,name:BillingRpcName,args:Record<string,unknown>):Promise<BillingRpcReply> {
  try { return await deps.rpc(name,args); } catch { return {data:null,error:{code:'TRANSPORT'}}; }
}
function storageFailure(reply:BillingRpcReply):AtomicBillingResult {
  return {outcome:reply.error?.code==='P0001'||reply.error?.code==='23505'?'review_required':'storage_unavailable'};
}

export async function processAtomicBillingWebhook(
  input:{rawBody:string;signature:string},deps:AtomicBillingDependencies
):Promise<AtomicBillingResult> {
  if(deps.enabled!==true||!deps.secret)return {outcome:'disabled'};
  if(!verifyPaddleSignature(input.rawBody,input.signature,deps.secret))return {outcome:'invalid_receipt'};
  let payload:unknown;
  try { payload=JSON.parse(input.rawBody); } catch { return {outcome:'invalid_receipt'}; }
  const parsed=receiptSchema.safeParse(payload);
  if(!parsed.success)return {outcome:'invalid_receipt'};
  const event=parsed.data, subscriptionId=event.data.id;
  const owner=ownerSchema.safeParse(object(event.data.custom_data).calcumint_user_id);
  if(!owner.success||!nonempty(subscriptionId))return {outcome:'invalid_receipt'};
  const receiptArgs={p_user_id:owner.data,p_event:event};
  async function completion():Promise<AtomicBillingResult|null> {
    const reply=await safeRpc(deps,'read_verified_billing_completion_v1',receiptArgs);
    if(reply.error)return storageFailure(reply);
    const data=object(reply.data);
    if(data.status==='missing')return null;
    if(data.status==='completed'&&revision(data.revision)&&data.revision!=='0')return {outcome:'duplicate',revision:data.revision};
    return {outcome:'storage_unavailable'};
  }
  // At most two attempts: application fence conflicts and known transaction aborts only.
  // Every replay reconciles first, then reads a new fence BEFORE a new provider GET.
  for(let attempt=0;attempt<2;attempt++) {
    const existing=await completion();
    if(existing)return existing;
    const fence=await safeRpc(deps,'read_billing_fence_v1',{p_user_id:owner.data});
    if(fence.error||!revision(fence.data))return {outcome:'storage_unavailable'};
    let raw:unknown;
    try { raw=await deps.fetchSubscription(subscriptionId); } catch { return {outcome:'provider_unavailable'}; }
    const snapshot=object(raw),custom=object(snapshot.custom_data);
    const first=object(Array.isArray(snapshot.items)?snapshot.items[0]:null);
    const price=nonempty(object(first.price).id)?object(first.price).id:first.price_id;
    if(snapshot.id!==subscriptionId||custom.calcumint_user_id!==owner.data)return {outcome:'identity_conflict'};
    if(!nonempty(snapshot.customer_id)||!nonempty(snapshot.status)||!nonempty(price))return {outcome:'invalid_snapshot'};
    let selection:ReturnType<typeof selectionSchema.safeParse>;
    try { selection=selectionSchema.safeParse(deps.selectionForPriceId(price)); } catch { return {outcome:'invalid_snapshot'}; }
    if(!selection.success)return {outcome:'invalid_selection'};
    const period=snapshot.current_billing_period==null?null:periodSchema.safeParse(snapshot.current_billing_period);
    const scheduled=snapshot.scheduled_change==null?null:object(snapshot.scheduled_change);
    if((period&&!period.success)||(scheduled&&!nonempty(scheduled.action)))return {outcome:'invalid_snapshot'};
    // Forward only existing authoritative fields; never payment instruments or raw customer metadata.
    const verifiedSnapshot={
      id:subscriptionId,customer_id:snapshot.customer_id,status:snapshot.status,
      custom_data:{calcumint_user_id:owner.data},items:[{price_id:price}],
      current_billing_period:period?.success?period.data:null,
      scheduled_change:scheduled?{action:scheduled.action}:null
    };
    const applied=await safeRpc(deps,'apply_verified_billing_event_v1',{
      ...receiptArgs,p_expected_revision:fence.data,p_snapshot:verifiedSnapshot,
      p_price_id:price,p_plan:selection.data.plan,p_interval:selection.data.interval
    });
    if(!applied.error) {
      const result=object(applied.data);
      if((result.status==='applied'||result.status==='duplicate')&&revision(result.revision)&&result.revision!=='0')return {outcome:result.status,revision:result.revision};
      // Malformed/lost acknowledgements may follow a commit; reconcile, never guess.
      return await completion()??{outcome:'retry_required'};
    }
    if(applied.error.code==='PT409'||applied.error.code==='40001'||applied.error.code==='40P01')continue;
    if(applied.error.code==='P0001'||applied.error.code==='23505')return storageFailure(applied);
    return await completion()??{outcome:'retry_required'};
  }
  return {outcome:'retry_required'};
}
