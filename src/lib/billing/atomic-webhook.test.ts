import { createHmac } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { processAtomicBillingWebhook, type AtomicBillingDependencies } from './atomic-webhook';

const owner = '00000000-0000-0000-0000-000000000001';
const secret = 'synthetic-offline-secret';
const event = { event_id: 'evt_a', event_type: 'subscription.updated', data: {id:'sub_a',custom_data:{calcumint_user_id:owner}} };
const snapshot = () => ({ id:'sub_a', customer_id:'ctm_a', status:'active', items:[{price:{id:'pri_pro'}}], custom_data:{calcumint_user_id:owner}, current_billing_period:{starts_at:'2026-10-01T00:00:00Z',ends_at:'2026-11-01T00:00:00Z'} });
function input(payload: unknown = event) {
  const rawBody = JSON.stringify(payload), timestamp = Math.floor(Date.now()/1000);
  return { rawBody, signature: `ts=${timestamp};h1=${createHmac('sha256',secret).update(`${timestamp}:${rawBody}`).digest('hex')}` };
}
function fixture() {
  const rpc = vi.fn<AtomicBillingDependencies['rpc']>().mockImplementation(async name => ({data:name==='read_verified_billing_completion_v1'?{status:'missing'}:name==='read_billing_fence_v1'?'0':{status:'applied',revision:'1'},error:null}));
  const fetchSubscription = vi.fn().mockResolvedValue(snapshot());
  const deps: AtomicBillingDependencies = {enabled:true,secret,rpc,fetchSubscription,selectionForPriceId:price=>price==='pri_pro'?{plan:'pro',interval:'monthly'}:null};
  return {deps,rpc,fetchSubscription};
}
describe('isolated atomic billing orchestration', () => {
  it('defaults closed without dispatch when not explicitly enabled',async()=>{
    const f=fixture();f.deps.enabled=false;
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'disabled'});
    expect(f.rpc).not.toHaveBeenCalled();expect(f.fetchSubscription).not.toHaveBeenCalled();
  });
  it('authenticates raw receipt before any storage/provider access',async()=>{
    const f=fixture();expect((await processAtomicBillingWebhook({...input(),signature:'invalid'},f.deps)).outcome).toBe('invalid_receipt');
    expect(f.rpc).not.toHaveBeenCalled();expect(f.fetchSubscription).not.toHaveBeenCalled();
  });
  it('reads completion and fence before provider GET; applies only verified configured snapshot',async()=>{
    const f=fixture(), calls:string[]=[];
    f.rpc.mockImplementation(async name=>{calls.push(name);return {data:name==='read_verified_billing_completion_v1'?{status:'missing'}:name==='read_billing_fence_v1'?'9007199254740992':{status:'applied',revision:'9007199254740993'},error:null};});
    f.fetchSubscription.mockImplementation(async()=>{calls.push('provider');return {...snapshot(),payment_method:{private:'not forwarded'}};});
    expect(await processAtomicBillingWebhook(input({...event,notification_id:'delivery_only'}),f.deps)).toEqual({outcome:'applied',revision:'9007199254740993'});
    expect(calls).toEqual(['read_verified_billing_completion_v1','read_billing_fence_v1','provider','apply_verified_billing_event_v1']);
    const args=f.rpc.mock.calls[2][1];expect(args.p_expected_revision).toBe('9007199254740992');expect(args.p_event).not.toHaveProperty('notification_id');expect(args.p_snapshot).not.toHaveProperty('payment_method');
  });
  it('preserves configured Business/yearly selection without entitlement inference',async()=>{
    const f=fixture();f.fetchSubscription.mockResolvedValue({...snapshot(),items:[{price_id:'pri_business'}]});f.deps.selectionForPriceId=id=>id==='pri_business'?{plan:'business',interval:'yearly'}:null;
    expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('applied');
    expect(f.rpc.mock.calls.at(-1)?.[1]).toMatchObject({p_plan:'business',p_interval:'yearly',p_price_id:'pri_business'});
  });
  it('fails closed when provider refresh is unavailable',async()=>{
    const f=fixture();f.fetchSubscription.mockRejectedValue(new Error('private provider detail'));
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'provider_unavailable'});expect(f.rpc).toHaveBeenCalledTimes(2);
  });
  it('acknowledges verified atomic completion without provider availability',async()=>{
    const f=fixture();f.rpc.mockResolvedValue({data:{status:'completed',revision:'3'},error:null});
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'duplicate',revision:'3'});expect(f.fetchSubscription).not.toHaveBeenCalled();
  });
  it.each(['40001','40P01'])('reconciles and refetches both fence and provider on %s',async code=>{
    const f=fixture();let attempts=0, reads=0;
    f.rpc.mockImplementation(async name=>({data:name==='read_verified_billing_completion_v1'?{status:'missing'}:name==='read_billing_fence_v1'?String(reads++):++attempts===1?null:{status:'applied',revision:'2'},error:name==='apply_verified_billing_event_v1'&&attempts===1?{code}:null}));
    f.fetchSubscription.mockResolvedValueOnce(snapshot()).mockResolvedValueOnce({...snapshot(),status:'canceled'});
    expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('applied');expect(f.fetchSubscription).toHaveBeenCalledTimes(2);
    const writes=f.rpc.mock.calls.filter(([name])=>name==='apply_verified_billing_event_v1');expect(writes.map(([,args])=>args.p_expected_revision)).toEqual(['0','1']);expect(writes[1][1].p_snapshot).toMatchObject({status:'canceled'});
  });
  it('bounds contention retries without reporting success',async()=>{
    const f=fixture();f.rpc.mockImplementation(async name=>({data:name==='read_verified_billing_completion_v1'?{status:'missing'}:name==='read_billing_fence_v1'?'0':null,error:name==='apply_verified_billing_event_v1'?{code:'40001'}:null}));
    expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('retry_required');expect(f.fetchSubscription).toHaveBeenCalledTimes(2);
  });
  it('reconciles uncertain commit response without repeating a write',async()=>{
    const f=fixture();let reads=0;
    f.rpc.mockImplementation(async name=>{if(name==='apply_verified_billing_event_v1')throw new Error('private transport detail');return {data:name==='read_billing_fence_v1'?'0':++reads===1?{status:'missing'}:{status:'completed',revision:'1'},error:null};});
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'duplicate',revision:'1'});expect(f.rpc.mock.calls.filter(([name])=>name==='apply_verified_billing_event_v1')).toHaveLength(1);
  });
  it('never blindly retries uncertain unconfirmed writes',async()=>{
    const f=fixture();f.rpc.mockImplementation(async name=>{if(name==='apply_verified_billing_event_v1')throw new Error('sensitive');return {data:name==='read_billing_fence_v1'?'0':{status:'missing'},error:null};});
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'retry_required'});expect(f.fetchSubscription).toHaveBeenCalledTimes(1);
  });
  it.each([null,0,'01','-1','9223372036854775808'])('rejects corrupt fence %s before provider access',async fence=>{
    const f=fixture();f.rpc.mockImplementation(async name=>({data:name==='read_verified_billing_completion_v1'?{status:'missing'}:fence,error:null}));
    expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('storage_unavailable');expect(f.fetchSubscription).not.toHaveBeenCalled();
  });
  it.each(['id','customer_id','status','custom_data','items'])('rejects missing provider %s without write',async key=>{
    const f=fixture();const invalid:Record<string,unknown>=snapshot();delete invalid[key];f.fetchSubscription.mockResolvedValue(invalid);
    expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('invalid_snapshot');expect(f.rpc).toHaveBeenCalledTimes(2);
  });
  it('rejects wrong provider owner and unconfigured price',async()=>{
    const f=fixture();f.fetchSubscription.mockResolvedValue({...snapshot(),custom_data:{calcumint_user_id:'another-owner'}});
    expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('invalid_snapshot');f.fetchSubscription.mockResolvedValue({...snapshot(),items:[{price_id:'unconfigured'}]});expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('invalid_snapshot');
  });
  it.each([{current_billing_period:{starts_at:'invalid',ends_at:'invalid'}},{scheduled_change:{}}])('rejects malformed optional provider evidence',async invalid=>{
    const f=fixture();f.fetchSubscription.mockResolvedValue({...snapshot(),...invalid});expect((await processAtomicBillingWebhook(input(),f.deps)).outcome).toBe('invalid_snapshot');
  });
  it.each([{event_id:'',event_type:'subscription.updated',data:{}},{...event,event_type:'transaction.completed'},{...event,data:{id:'sub_a',custom_data:{calcumint_user_id:'not-uuid'}}}])('rejects unsupported or corrupt receipt before RPC',async payload=>{
    const f=fixture();expect((await processAtomicBillingWebhook(input(payload),f.deps)).outcome).toBe('invalid_receipt');expect(f.rpc).not.toHaveBeenCalled();
  });
  it('fails closed when the proposed RPC is not installed, without REST fallback',async()=>{
    const f=fixture();f.rpc.mockResolvedValue({data:null,error:{code:'PGRST202',message:'function absent'}});
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'storage_unavailable'});expect(f.fetchSubscription).not.toHaveBeenCalled();expect(f.rpc).toHaveBeenCalledTimes(1);
  });
  it('does not trust a malformed apply acknowledgement',async()=>{
    const f=fixture();f.rpc.mockImplementation(async name=>({data:name==='read_verified_billing_completion_v1'?{status:'missing'}:name==='read_billing_fence_v1'?'0':{status:'applied',revision:1},error:null}));
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'retry_required'});expect(f.fetchSubscription).toHaveBeenCalledTimes(1);
  });
  it('rejects corrupt completion metadata before fetching or writing',async()=>{
    const f=fixture();f.rpc.mockResolvedValue({data:{status:'completed',revision:1},error:null});
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'storage_unavailable'});expect(f.fetchSubscription).not.toHaveBeenCalled();
  });
  it('keeps legacy/conflicting evidence blocked and errors sanitized',async()=>{
    const f=fixture();f.rpc.mockResolvedValue({data:null,error:{code:'P0001',message:'private legacy receipt details'}});
    expect(await processAtomicBillingWebhook(input(),f.deps)).toEqual({outcome:'review_required'});expect(f.fetchSubscription).not.toHaveBeenCalled();
  });
});
