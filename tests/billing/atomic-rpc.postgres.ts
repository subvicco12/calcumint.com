import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHmac } from 'node:crypto';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { processAtomicBillingWebhook, type AtomicBillingDependencies, type BillingRpcName, type BillingRpcReply } from '../../src/lib/billing/atomic-webhook';
const exec=promisify(execFile);
const container=process.env.CALCUMINT_BILLING_TEST_CONTAINER;
if(!container||!/^calcumint-billing-test-[0-9a-f-]{36}$/.test(container))throw new Error('Disposable billing fixture required; no database URL is accepted');
const owner='00000000-0000-0000-0000-000000000001', other='00000000-0000-0000-0000-000000000002';
const secret='synthetic-postgres-webhook-secret';
const literal=(value:unknown)=>`'${String(value).replaceAll("'","''")}'`;
async function sql(query:string) {
  const {stdout}=await exec('docker',['exec',container!,'psql','-h','127.0.0.1','-U','postgres','-qAt','-X','-v','ON_ERROR_STOP=1','-v','VERBOSITY=verbose','-c',query],{timeout:25000,maxBuffer:1024*1024});
  return stdout.trim();
}
const argumentsFor:Record<BillingRpcName,string[]>={
  read_verified_billing_completion_v1:['p_user_id','p_event'],
  read_billing_fence_v1:['p_user_id'],
  apply_verified_billing_event_v1:['p_user_id','p_expected_revision','p_event','p_snapshot','p_price_id','p_plan','p_interval']
};
async function rpc(name:BillingRpcName,args:Record<string,unknown>,prefix=''):Promise<BillingRpcReply> {
  const values=argumentsFor[name].map(key=>literal(typeof args[key]==='object'?JSON.stringify(args[key]):args[key]));
  try {
    const output=await sql(`SET ROLE service_role; ${prefix} SELECT to_jsonb(public.${name}(${values.join(',')}));`);
    return {data:JSON.parse(output),error:null};
  } catch(error) {
    const detail=error as {stderr?:string};
    return {data:null,error:{code:detail.stderr?.match(/ERROR:\s+([A-Z0-9]{5}):/)?.[1]??'TRANSPORT'}};
  }
}
function input(id:string, account=owner, type='subscription.updated') {
  const rawBody=JSON.stringify({event_id:id,event_type:type,occurred_at:'2026-10-18T00:00:00Z',notification_id:'delivery-only',data:{id:'sub_a',custom_data:{calcumint_user_id:account}}});
  const timestamp=Math.floor(Date.now()/1000);
  return {rawBody,signature:`ts=${timestamp};h1=${createHmac('sha256',secret).update(`${timestamp}:${rawBody}`).digest('hex')}`};
}
const snapshot=(status='active',account=owner)=>({id:'sub_a',customer_id:'ctm_a',status,items:[{price_id:'pri_pro'}],custom_data:{calcumint_user_id:account},current_billing_period:{starts_at:'2026-10-01T00:00:00Z',ends_at:'2026-11-01T00:00:00Z'}});
const fixture=():AtomicBillingDependencies=>({enabled:true,secret,rpc,fetchSubscription:async()=>snapshot(),selectionForPriceId:id=>id==='pri_pro'?{plan:'pro',interval:'monthly'}:null});
const state=()=>sql(`SELECT jsonb_build_array(${['billing_customers','subscriptions','profiles','billing_webhook_events','billing_account_fences','billing_atomic_completions'].map(t=>`(SELECT COALESCE(jsonb_agg(r ORDER BY to_jsonb(r)::text),'[]') FROM public.${t} r)`).join(',')});`);
beforeAll(async()=>{
  const {stdout}=await exec('docker',['inspect','--format','{{.HostConfig.NetworkMode}} {{index .Config.Labels "calcumint.billing-fixture"}}',container!]);
  const [network,label]=stdout.trim().split(' ');
  expect(network).toBe(`${container}-network`);expect(label).toBe('true');
  expect((await exec('docker',['network','inspect','--format','{{.Internal}}',network])).stdout.trim()).toBe('true');
});
beforeEach(async()=>{await sql("TRUNCATE public.billing_atomic_completions,public.billing_webhook_events,public.billing_account_fences,public.subscriptions,public.billing_customers; UPDATE public.profiles SET plan='free';");});
describe('actual isolated PostgreSQL RPC orchestration',()=>{
  it('applies all effects once and verifies completion without another provider GET',async()=>{
    const deps=fixture();expect(await processAtomicBillingWebhook(input('evt_once'),deps)).toEqual({outcome:'applied',revision:'1'});
    const before=await state();deps.fetchSubscription=vi.fn().mockRejectedValue(new Error('provider offline'));
    expect(await processAtomicBillingWebhook(input('evt_once'),deps)).toEqual({outcome:'duplicate',revision:'1'});
    expect(deps.fetchSubscription).not.toHaveBeenCalled();expect(await state()).toBe(before);
    expect(await sql('SELECT count(*) FROM public.billing_atomic_completions;')).toBe('1');
  });
  it('handles concurrent duplicate orchestrators with one persisted completion',async()=>{
    const results=await Promise.all([processAtomicBillingWebhook(input('evt_concurrent'),fixture()),processAtomicBillingWebhook(input('evt_concurrent'),fixture())]);
    expect(results.map(r=>r.outcome).sort()).toEqual(['applied','duplicate']);
    expect(await sql('SELECT revision FROM public.billing_account_fences;')).toBe('1');
  });
  it('rejects delayed active snapshot, then refetches canceled state under the new fence',async()=>{
    let release!:(value:unknown)=>void;
    const old=fixture();const provider=vi.fn().mockImplementationOnce(()=>new Promise(resolve=>{release=resolve;})).mockResolvedValue(snapshot('canceled'));
    old.fetchSubscription=provider;
    const delayed=processAtomicBillingWebhook(input('evt_old'),old);
    await vi.waitFor(()=>expect(release).toBeTypeOf('function'));
    const current=fixture();current.fetchSubscription=async()=>snapshot('canceled');
    expect((await processAtomicBillingWebhook(input('evt_new'),current)).outcome).toBe('applied');
    release(snapshot());expect(await delayed).toEqual({outcome:'applied',revision:'2'});
    expect(provider).toHaveBeenCalledTimes(2);expect(await sql(`SELECT plan FROM public.profiles WHERE id='${owner}';`)).toBe('free');
    expect(await sql('SELECT status FROM public.subscriptions;')).toBe('canceled');
  });
  it('recovers an actual PostgreSQL deadlock with a fresh fence and provider read',async()=>{
    await sql(`INSERT INTO public.billing_account_fences VALUES('${owner}',0);`);
    // A gate, not a sleep, establishes both lock orders before forming the cycle.
    const gate=sql(`SET application_name='billing_deadlock_gate'; SELECT pg_advisory_lock(4242); SELECT pg_sleep(20);`).then(()=>null,error=>error);
    await vi.waitFor(async()=>expect(await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='billing_deadlock_gate' AND wait_event='PgSleep';`)).toBe('1'));
    const controller=sql(`SET application_name='billing_deadlock_controller'; SET deadlock_timeout='10s'; BEGIN;
      SELECT id FROM public.profiles WHERE id='${owner}' FOR UPDATE;
      SELECT pg_advisory_xact_lock(4242);
      SELECT revision FROM public.billing_account_fences WHERE user_id='${owner}' FOR UPDATE; COMMIT;`).then(()=>null,error=>error);
    await vi.waitFor(async()=>expect(await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='billing_deadlock_controller' AND wait_event_type='Lock';`)).toBe('1'));
    const deps=fixture(),errors:string[]=[];
    deps.fetchSubscription=vi.fn().mockResolvedValue(snapshot());
    deps.rpc=async(name,args)=>{
      const result=await rpc(name,args,name==='apply_verified_billing_event_v1'?"RESET ROLE; SET application_name='billing_deadlock_rpc'; SET deadlock_timeout='2s'; SET ROLE service_role;":'');
      if(result.error?.code)errors.push(result.error.code);
      return result;
    };
    const pending=processAtomicBillingWebhook(input('evt_deadlock'),deps);
    await vi.waitFor(async()=>expect(await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='billing_deadlock_rpc' AND wait_event_type='Lock';`)).toBe('1'));
    await sql(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE application_name='billing_deadlock_gate';`);
    expect(await pending).toEqual({outcome:'applied',revision:'1'});
    expect(await controller).toBeNull();expect(await gate).not.toBeNull();
    expect(errors).toContain('40P01');expect(deps.fetchSubscription).toHaveBeenCalledTimes(2);
    expect(await sql('SELECT count(*) FROM public.billing_atomic_completions;')).toBe('1');
  });
  it('reconciles post-commit response loss without reapplying effects',async()=>{
    const deps=fixture();let writes=0;
    deps.rpc=async(name,args)=>{const result=await rpc(name,args);if(name==='apply_verified_billing_event_v1'){writes++;if(!result.error)throw new Error('lost response after commit');}return result;};
    expect(await processAtomicBillingWebhook(input('evt_lost'),deps)).toEqual({outcome:'duplicate',revision:'1'});expect(writes).toBe(1);
    expect(await sql('SELECT count(*) FROM public.billing_atomic_completions;')).toBe('1');
  });
  it('rolls back injected late failure; explicit retry recovers without partial effects',async()=>{
    const before=await state(),deps=fixture();
    deps.rpc=(name,args)=>rpc(name,args,name==='apply_verified_billing_event_v1'?"SET billing.test_fail='billing_atomic_completions';":'');
    expect((await processAtomicBillingWebhook(input('evt_failure'),deps)).outcome).toBe('review_required');expect(await state()).toBe(before);
    expect((await processAtomicBillingWebhook(input('evt_failure'),fixture())).outcome).toBe('applied');
  });
  it('fails closed after unknown pre-dispatch transport interruption, then explicit retry applies',async()=>{
    const deps=fixture(),before=await state();deps.rpc=async(name,args)=>{if(name==='apply_verified_billing_event_v1')throw new Error('interrupted');return rpc(name,args);};
    expect((await processAtomicBillingWebhook(input('evt_transport'),deps)).outcome).toBe('retry_required');expect(await state()).toBe(before);
    expect((await processAtomicBillingWebhook(input('evt_transport'),fixture())).outcome).toBe('applied');
  });
  it('blocks conflicting receipts and cross-account subscription adoption',async()=>{
    await processAtomicBillingWebhook(input('evt_owner'),fixture());const before=await state();
    expect((await processAtomicBillingWebhook(input('evt_owner',owner,'subscription.canceled'),fixture())).outcome).toBe('review_required');
    const deps=fixture();deps.fetchSubscription=async()=>({...snapshot('active',other),customer_id:'ctm_b'});
    expect((await processAtomicBillingWebhook(input('evt_other',other),deps)).outcome).toBe('review_required');expect(await state()).toBe(before);
  });
  it('keeps a legacy receipt without atomic marker blocked',async()=>{
    const signed=input('evt_legacy'),event=JSON.parse(signed.rawBody);delete event.notification_id;
    await sql(`INSERT INTO public.billing_webhook_events(event_id,event_type,payload) VALUES('evt_legacy','subscription.updated',${literal(JSON.stringify(event))}::jsonb);`);
    const deps=fixture();deps.fetchSubscription=vi.fn();const before=await state();
    expect((await processAtomicBillingWebhook(signed,deps)).outcome).toBe('review_required');expect(deps.fetchSubscription).not.toHaveBeenCalled();expect(await state()).toBe(before);
  });
  it('completion lookup is restricted and verifies marker ownership',async()=>{
    const args={p_user_id:owner,p_event:JSON.parse(input('evt_marker').rawBody)};delete args.p_event.notification_id;
    expect((await rpc('read_verified_billing_completion_v1',args)).data).toEqual({status:'missing'});
    for(const role of ['anon','authenticated'])await expect(sql(`SET ROLE ${role}; SELECT public.read_verified_billing_completion_v1('${owner}',${literal(JSON.stringify(args.p_event))}::jsonb);`)).rejects.toThrow(/permission denied/);
    await processAtomicBillingWebhook(input('evt_marker'),fixture());
    await sql(`UPDATE public.billing_atomic_completions SET user_id='${other}' WHERE event_id='evt_marker';`);
    expect((await processAtomicBillingWebhook(input('evt_marker'),fixture())).outcome).toBe('review_required');
  });
});
