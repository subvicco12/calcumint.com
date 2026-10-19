// Disposable local PostgreSQL only. No database URL, production credentials, or host ports.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
const image = 'postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const name = `calcumint-billing-test-${randomUUID()}`;
function command(args, input = '') {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args, { stdio: ['pipe', 'pipe', 'pipe'], timeout: 30_000 });
    let out = '', err = '';
    child.stdout.on('data', chunk => { out += chunk; });
    child.stderr.on('data', chunk => { err += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve(out.trim()) : reject(new Error(err || out || `docker command exited ${code}: ${args.join(' ')}`)));
    child.stdin.on('error', reject);
    child.stdin.end(input);
  });
}
const sql = text => command(['exec', '-i', name, 'psql', '-h', '127.0.0.1', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose', '-U', 'postgres'], text);
const quote = value => `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const a = '00000000-0000-0000-0000-000000000001';
const b = '00000000-0000-0000-0000-000000000002';
function call(id, { owner = a, revision = '0', status = 'active', sub = 'sub_a', customer = 'ctm_a', price = 'pri_pro', plan = 'pro', interval = 'monthly', event, snapshot } = {}) {
  event ??= { event_id: id, event_type: 'subscription.updated', occurred_at: '2026-10-18T00:00:00Z', data: { id: sub, custom_data: { calcumint_user_id: owner } } };
  snapshot ??= { id: sub, customer_id: customer, status, custom_data: { calcumint_user_id: owner }, items: [{ price: { id: price } }], current_billing_period: { starts_at: '2026-10-01T00:00:00Z', ends_at: '2026-11-01T00:00:00Z' } };
  return `SELECT public.apply_verified_billing_event_v1('${owner}', '${revision}', ${quote(event)}, ${quote(snapshot)}, '${price}', '${plan}', '${interval}');`;
}
function completion(id, { owner = a, sub = 'sub_a', event } = {}) {
  event ??= { event_id: id, event_type: 'subscription.updated', occurred_at: '2026-10-18T00:00:00Z', data: { id: sub, custom_data: { calcumint_user_id: owner } } };
  return `SELECT public.read_billing_event_completion_v1('${owner}', ${quote(event)});`;
}
const service = query => sql(`SET ROLE service_role; ${query}`);
async function reset() {
  await sql(`TRUNCATE public.billing_atomic_completions, public.billing_webhook_events, public.billing_account_fences, public.subscriptions, public.billing_customers; UPDATE public.profiles SET plan='free';`);
}
async function state() {
  return sql(`SELECT jsonb_build_array(${['billing_customers', 'subscriptions', 'profiles', 'billing_webhook_events', 'billing_account_fences', 'billing_atomic_completions'].map(table => `(SELECT COALESCE(jsonb_agg(t ORDER BY to_jsonb(t)::text), '[]') FROM public.${table} t)`).join(',')});`);
}
let count = 0;
let created = false;
async function test(label, run) { await reset(); await run(); count++; console.log(`PASS ${label}`); }
try {
  await command(['run', '-d', '--rm', '--name', name, '--network', 'none', '--tmpfs', '/var/lib/postgresql/data', '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', image]);
  created = true;
  for (let attempt = 0; ; attempt++) {
    try { await sql('SELECT 1;'); break; } catch (error) {
      if (attempt >= 60) throw error;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  console.log(await sql('SELECT version();'));
  // Minimal synthetic Supabase prerequisites, not a production schema snapshot.
  await sql(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated;
    CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users, plan text NOT NULL CHECK(plan IN ('free','pro','business')), updated_at timestamptz DEFAULT now());
    CREATE TABLE public.favorites(user_id uuid); CREATE TABLE public.calculation_history(user_id uuid);
    CREATE TABLE public.ai_usage_events(user_id uuid);
    CREATE POLICY ai_usage_user_read ON public.ai_usage_events FOR SELECT USING(user_id = auth.uid());
    INSERT INTO auth.users VALUES ('${a}'),('${b}'); INSERT INTO public.profiles(id,plan) SELECT id,'free' FROM auth.users;`);
  await sql(await readFile('supabase/migrations/002_b4_billing.sql', 'utf8'));
  await sql(await readFile('supabase/migrations/030_billing_ai_rls_auth_initplan.sql', 'utf8'));
  await sql(await readFile('supabase/migrations/034_billing_webhook_event_privileges.sql', 'utf8'));
  const doc = await readFile('docs/architecture/proposals/ATOMIC-BILLING-TRANSACTION-PROPOSAL.md', 'utf8');
  const proposal = doc.match(/```sql\n([\s\S]*?)\n```/)?.[1];
  assert.ok(proposal, 'exact SQL proposal required');
  const guard = "DO $$ BEGIN\n  RAISE EXCEPTION 'PROPOSAL ONLY: approval and isolated PostgreSQL acceptance required';\nEND $$;";
  assert.equal(proposal.split(guard).length, 2, 'one explicit guard required');
  await assert.rejects(sql(proposal), /PROPOSAL ONLY/);
  // Remove the guard only in this isolated container's stdin, never the document.
  await sql(proposal.replace(guard, ''));
  await sql(`GRANT SELECT ON public.billing_customers, public.subscriptions TO authenticated;
    CREATE FUNCTION public.inject_billing_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
      IF current_setting('billing.test_fail',true) = TG_TABLE_NAME THEN RAISE EXCEPTION 'injected failure %', TG_TABLE_NAME; END IF;
      RETURN NEW; END $$;`);
  for (const table of ['billing_customers','subscriptions','profiles','billing_webhook_events','billing_account_fences','billing_atomic_completions']) {
    await sql(`CREATE TRIGGER inject_failure AFTER INSERT OR UPDATE ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.inject_billing_failure();`);
    await test(`rollback at ${table}, then fresh retry`, async () => {
      const before = await state();
      await assert.rejects(service(`SET billing.test_fail='${table}'; ${call('evt_failure')}`), /injected failure/);
      assert.equal(await state(), before);
      assert.equal(JSON.parse(await service(call('evt_failure'))).status, 'applied');
    });
  }
  await test('failure after fence increment rolls back every write', async () => {
    await sql(`INSERT INTO public.billing_account_fences VALUES('${a}',0);`);
    const before = await state();
    await assert.rejects(service(`SET billing.test_fail='billing_account_fences'; ${call('evt_fence')}`), /injected failure/);
    assert.equal(await state(), before);
    assert.equal(JSON.parse(await service(call('evt_fence'))).revision, '1');
  });
  await test('interrupted transaction rolls back; retry safely applies', async () => {
    const before = await state();
    const pending = service(`SET application_name='billing_interruption'; BEGIN; ${call('evt_interrupted')} SELECT pg_sleep(20); COMMIT;`);
    // Attach rejection handling before intentionally terminating the session.
    const interrupted = assert.rejects(pending, /terminating connection|connection.*closed/);
    let pid;
    for (let attempt = 0; attempt < 100; attempt++) {
      pid = await sql(`SELECT pid FROM pg_stat_activity WHERE application_name='billing_interruption' AND wait_event='PgSleep';`);
      if (pid) break;
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    assert.match(pid, /^\d+$/, 'transaction reached post-write barrier');
    await sql(`SELECT pg_terminate_backend(${pid});`);
    await interrupted;
    assert.equal(await state(), before);
    assert.equal(JSON.parse(await service(call('evt_interrupted'))).status, 'applied');
  });
  await test('missing profile cannot create receipts or entitlements', async () => {
    await sql(`DELETE FROM public.profiles WHERE id='${a}';`);
    try {
      const before = await state();
      await assert.rejects(service(call('evt_missing')), /Missing billing account/);
      assert.equal(await state(), before);
    } finally { await sql(`INSERT INTO public.profiles(id,plan) VALUES('${a}','free');`); }
  });
  await test('bigint exhaustion rolls back instead of wrapping revision', async () => {
    await sql(`INSERT INTO public.billing_account_fences VALUES('${a}',9223372036854775807);`);
    const before = await state();
    await assert.rejects(service(call('evt_exhausted', { revision:'9223372036854775807' })), /bigint out of range/);
    assert.equal(await state(), before);
  });
  await test('revoked service role cannot enter the privileged transaction', async () => {
    const signature = 'public.apply_verified_billing_event_v1(uuid,bigint,jsonb,jsonb,text,text,text)';
    await sql(`REVOKE EXECUTE ON FUNCTION ${signature} FROM service_role;`);
    try {
      const before = await state();
      await assert.rejects(service(call('evt_revoked')), /permission denied/);
      assert.equal(await state(), before);
    } finally { await sql(`GRANT EXECUTE ON FUNCTION ${signature} TO service_role;`); }
  });
  await test('concurrent duplicate, lost response and immutable completion', async () => {
    const first = service(`SET application_name='billing_duplicate_first'; BEGIN; ${call('evt_duplicate')} SELECT pg_sleep(2); COMMIT;`);
    for (let attempt = 0; ; attempt++) {
      const waiting = await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='billing_duplicate_first' AND wait_event='PgSleep';`);
      if (waiting === '1') break;
      assert.ok(attempt < 100, 'first transaction reached post-write barrier');
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    const second = service(`SET application_name='billing_duplicate_second'; ${call('evt_duplicate')}`);
    for (let attempt = 0; ; attempt++) {
      const waiting = await sql(`SELECT count(*) FROM pg_stat_activity WHERE application_name='billing_duplicate_second' AND wait_event_type='Lock';`);
      if (waiting === '1') break;
      assert.ok(attempt < 50, 'duplicate waits on the uncommitted transaction');
      await new Promise(resolve => setTimeout(resolve, 20));
    }
    const results = await Promise.all([first, second]);
    assert.equal(results.filter(result => result.includes('applied')).length, 1);
    assert.equal(results.filter(result => result.includes('duplicate')).length, 1);
    const before = await state();
    assert.equal(JSON.parse(await service(call('evt_duplicate'))).status, 'duplicate');
    assert.equal(await state(), before);
  });
  await test('completion probe requires exact receipt and owner-bound atomic marker', async () => {
    assert.equal(JSON.parse(await service(completion('evt_lookup'))).status, 'missing');
    await service(call('evt_lookup'));
    const before = await state();
    assert.deepEqual(JSON.parse(await service(completion('evt_lookup'))), {status:'duplicate', revision:'1'});
    assert.equal(await state(), before);
    await assert.rejects(service(completion('evt_lookup', {owner:b})), /Invalid billing completion lookup|Conflicting event receipt/);
    await assert.rejects(service(completion('evt_lookup', {sub:'sub_other'})), /Conflicting event receipt/);
    await assert.rejects(service(completion('evt_lookup', {event: {event_id:'evt_lookup', event_type:'subscription.canceled', data:{id:'sub_a', custom_data:{calcumint_user_id:a}}}})), /Conflicting event receipt/);
    assert.equal(await state(), before);
  });
  await test('legacy receipt cannot be acknowledged by completion probe', async () => {
    const e = {event_id:'evt_legacy_probe', event_type:'subscription.updated', occurred_at:'2026-10-18T00:00:00Z', data:{id:'sub_a',custom_data:{calcumint_user_id:a}}};
    await sql(`INSERT INTO public.billing_webhook_events(event_id,event_type,payload) VALUES('evt_legacy_probe','subscription.updated',${quote(e)});`);
    const before = await state();
    await assert.rejects(service(completion('evt_legacy_probe')), /Legacy receipt requires review/);
    assert.equal(await state(), before);
  });
  await test('overlapping distinct events: one winner, stale fence rejected', async () => {
    const results = await Promise.allSettled([service(call('evt_one')), service(call('evt_two', { status: 'canceled' }))]);
    assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
    assert.match(results.find(result => result.status === 'rejected').reason.message, /40001: Stale billing fence/);
    assert.equal(await sql('SELECT count(*) FROM public.billing_atomic_completions;'), '1');
  });
  await test('delayed active snapshot cannot overwrite newer cancellation; fresh retry', async () => {
    assert.equal(await service(`SELECT public.read_billing_fence_v1('${a}');`), '0');
    await service(call('evt_cancel', { status: 'canceled' }));
    const before = await state();
    await assert.rejects(service(call('evt_old')), /40001: Stale billing fence/);
    assert.equal(await state(), before);
    assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`), 'free');
    await service(call('evt_old', { revision: '1', status: 'canceled' }));
    assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`), 'free');
  });
  await test('conflicting receipt and legacy receipt remain blocked', async () => {
    await service(call('evt_conflict'));
    const before = await state();
    await assert.rejects(service(call('evt_conflict', { event: { event_id:'evt_conflict', event_type:'subscription.canceled', data:{ id:'sub_a', custom_data:{ calcumint_user_id:a } } } })), /Conflicting event receipt/);
    assert.equal(await state(), before);
    await reset();
    await sql(`INSERT INTO public.billing_webhook_events(event_id,event_type,payload) VALUES('evt_legacy','subscription.updated',${quote({ event_id:'evt_legacy', event_type:'subscription.updated', occurred_at:'2026-10-18T00:00:00Z', data:{id:'sub_a', custom_data:{calcumint_user_id:a}} })});`);
    const legacy = await state();
    await assert.rejects(service(call('evt_legacy')), /Legacy receipt requires review/);
    assert.equal(await state(), legacy);
  });
  await test('concurrent cross-account subscription binding stays immutable', async () => {
    const results = await Promise.allSettled([service(call('evt_a')), service(call('evt_b', { owner:b, customer:'ctm_b' }))]);
    assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
    assert.match(results.find(result => result.status === 'rejected').reason.message, /ownership conflict/);
    assert.equal(await sql('SELECT count(*) FROM public.billing_atomic_completions;'), '1');
    assert.equal(await sql('SELECT count(*) FROM public.billing_customers;'), '1');
  });
  await test('concurrent shared-customer ownership cannot cross accounts', async () => {
    const results = await Promise.allSettled([service(call('evt_a')), service(call('evt_b', { owner:b, sub:'sub_b' }))]);
    assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
    assert.match(results.find(result => result.status === 'rejected').reason.message, /ownership conflict|unique constraint/);
    assert.equal(await sql('SELECT count(*) FROM public.billing_atomic_completions;'), '1');
  });
  for (const status of ['active','trialing','past_due']) await test(`other ${status} subscription rejects entire update`, async () => {
    await service(call('evt_existing', { sub:'sub_existing', status }));
    const before = await state();
    await assert.rejects(service(call('evt_other', { revision:'1' })), /Multiple paid subscriptions/);
    assert.equal(await state(), before);
  });
  await test('existing Business yearly metadata and cancellation policy remain intact', async () => {
    await service(call('evt_business', {plan:'business', interval:'yearly', price:'pri_business'}));
    assert.equal(await sql(`SELECT plan || ':' || billing_interval || ':' || price_id FROM public.subscriptions;`), 'business:yearly:pri_business');
    assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`), 'business');
    await service(call('evt_cancel_business', {revision:'1', plan:'business', interval:'yearly', price:'pri_business', status:'canceled'}));
    assert.equal(await sql(`SELECT plan FROM public.profiles WHERE id='${a}';`), 'free');
    assert.equal(await sql('SELECT plan FROM public.subscriptions;'), 'business');
  });
  await test('mismatched provider identity and price fail before effects', async () => {
    const before = await state();
    const snapshot = {id:'sub_a', customer_id:'ctm_a', status:'active', custom_data:{calcumint_user_id:b}, items:[{price_id:'pri_pro'}]};
    await assert.rejects(service(call('evt_wrong_owner', {snapshot})), /Invalid verified billing input/);
    snapshot.custom_data.calcumint_user_id = a;
    snapshot.items[0].price_id = 'pri_wrong';
    await assert.rejects(service(call('evt_wrong_price', {snapshot})), /Invalid verified billing input/);
    assert.equal(await state(), before);
  });
  await test('exact bigint text fence above JavaScript safe integer', async () => {
    await sql(`INSERT INTO public.billing_account_fences VALUES('${a}',9007199254740992);`);
    assert.equal(await service(`SELECT public.read_billing_fence_v1('${a}');`), '9007199254740992');
    assert.equal(JSON.parse(await service(call('evt_bigint', { revision:'9007199254740992' }))).revision, '9007199254740993');
  });
  await test('invalid period cast rolls back earlier writes', async () => {
    const before = await state();
    const snapshot = { id:'sub_a', customer_id:'ctm_a', status:'active', custom_data:{calcumint_user_id:a}, items:[{price_id:'pri_pro'}], current_billing_period:{starts_at:'invalid'} };
    await assert.rejects(service(call('evt_invalid', {snapshot})), /invalid input syntax/);
    assert.equal(await state(), before);
  });
  await test('client roles cannot call RPCs or read internal ledgers; owner RLS', async () => {
    await service(call('evt_a'));
    await service(call('evt_b', {owner:b, sub:'sub_b', customer:'ctm_b'}));
    for (const role of ['anon','authenticated']) {
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.read_billing_fence_v1('${a}');`), /permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; ${completion('evt_a')}`), /permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; ${call('evt_attack')}`), /permission denied/);
      for (const table of ['billing_atomic_completions','billing_account_fences','billing_webhook_events']) await assert.rejects(sql(`SET ROLE ${role}; SELECT * FROM public.${table};`), /permission denied/);
    }
    assert.equal(await sql(`SET ROLE authenticated; SET request.jwt.claim.sub='${a}'; SELECT count(*) FROM public.subscriptions;`), '1');
    assert.equal(await sql(`SET ROLE authenticated; SET request.jwt.claim.sub='${a}'; SELECT count(*) FROM public.billing_customers WHERE user_id='${b}';`), '0');
    await assert.rejects(sql(`SET ROLE authenticated; UPDATE public.subscriptions SET status='active';`), /permission denied/);
  });
  console.log(`${count} PostgreSQL acceptance cases passed; proposal remains guarded and unwired.`);
} finally {
  if (created) await command(['rm', '-f', name]);
}
