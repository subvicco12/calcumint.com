# Atomic billing transaction proposal — NOT APPROVED OR APPLIED

This is a review artifact, outside `supabase/migrations`. The cumulative draft application branch calls these proposed functions for subscription notifications and fails closed until an authorized migration exists. No production schema changes have occurred. The proposal has now been executed only in disposable, network-isolated PostgreSQL acceptance fixtures (see the evidence below). The leading transaction guard deliberately aborts the complete SQL block if copied into a SQL client. Remove it for deployment only after explicit approval; the acceptance harness removes the exact guard only from its disposable-container input. TypeScript/mocked tests do not verify this SQL.

The previously deployed event-ID primary key does not make independent REST writes atomic. A receipt also does not prove legacy side effects succeeded. This proposal adds a **local account revision fence**, not an invented provider timestamp/version rule, and an atomic-completion marker separate from legacy receipts. It preserves the existing rule that ambiguous paid subscriptions require billing support instead of selecting a winning plan.

Protocol prerequisites:

1. Authenticate the signed raw webhook, normalize its immutable event envelope and verify account/subscription identity.
2. Read the account fence **before** the provider GET. Treat revisions as decimal strings, never JavaScript numbers. Missing fence means `"0"`.
3. Fetch and validate current provider state and configured price/plan/interval using existing server authority. Do not derive entitlement from the receipt's historical snapshot.
4. Call the proposed write RPC with that original fence and verified snapshot. The transaction checks the fence, immutable ownership, other paid subscriptions, every write and receipt/completion persistence together. Any exception rolls everything back.
5. Fence conflict/deadlock/unknown outcome requires owner-scoped reconciliation, then a fresh fence and fresh provider read. Never reuse the stale snapshot under a newly read revision. A matching atomic completion can acknowledge a retry without reapplying effects. The owner- and exact-event-bound read-only completion probe runs before the provider GET, so a committed response loss can be acknowledged even during a later provider outage; missing proceeds to a fresh fence/provider read, while conflicting and legacy receipts fail closed.
6. A legacy receipt without an atomic marker is REVIEW REQUIRED; never silently backfill completion, infer success or automatically replay it.

A local fence rejects overlapping application requests based on an older local revision. It does not prove provider read consistency, external settlement finality or exactly-once network delivery. Every local billing writer must participate in the fence or explicitly invalidate it; inventory and review of privileged writers is required before adoption.

```sql
BEGIN;
DO $$ BEGIN
  RAISE EXCEPTION 'PROPOSAL ONLY: approval and isolated PostgreSQL acceptance required';
END $$;

CREATE TABLE public.billing_account_fences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0)
);
CREATE TABLE public.billing_atomic_completions (
  event_id text PRIMARY KEY REFERENCES public.billing_webhook_events(event_id),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_subscription_id text NOT NULL,
  revision bigint NOT NULL CHECK (revision > 0),
  provider_snapshot jsonb NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_account_fences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_atomic_completions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_account_fences, public.billing_atomic_completions
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.billing_account_fences TO service_role;
GRANT SELECT, INSERT ON public.billing_atomic_completions TO service_role;

CREATE FUNCTION public.read_billing_event_completion_v1(p_user_id uuid, p_event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public AS $$
DECLARE
  v_event_id text := p_event->>'event_id';
  v_subscription_id text := p_event#>>'{data,id}';
  v_receipt public.billing_webhook_events%ROWTYPE;
  v_revision bigint;
BEGIN
  IF p_user_id IS NULL OR jsonb_typeof(p_event) IS DISTINCT FROM 'object'
     OR COALESCE(v_event_id, '') = '' OR COALESCE(v_subscription_id, '') = ''
     OR COALESCE(p_event->>'event_type', '') NOT LIKE 'subscription.%'
     OR p_event#>>'{data,custom_data,calcumint_user_id}' IS DISTINCT FROM p_user_id::text THEN
    RAISE EXCEPTION 'Invalid billing completion lookup';
  END IF;
  SELECT * INTO v_receipt FROM public.billing_webhook_events WHERE event_id = v_event_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('status', 'missing'); END IF;
  IF v_receipt.payload IS DISTINCT FROM p_event THEN
    RAISE EXCEPTION 'Conflicting event receipt';
  END IF;
  SELECT revision INTO v_revision FROM public.billing_atomic_completions
    WHERE event_id = v_event_id AND user_id = p_user_id
      AND provider_subscription_id = v_subscription_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Legacy receipt requires review'; END IF;
  RETURN jsonb_build_object('status', 'duplicate', 'revision', v_revision::text);
END;
$$;

CREATE FUNCTION public.read_billing_fence_v1(p_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, public AS $$
  SELECT COALESCE((SELECT revision::text FROM public.billing_account_fences
                   WHERE user_id = p_user_id), '0');
$$;

CREATE FUNCTION public.apply_verified_billing_event_v1(
  p_user_id uuid, p_expected_revision bigint, p_event jsonb,
  p_snapshot jsonb, p_price_id text, p_plan text, p_interval text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public AS $$
DECLARE
  v_revision bigint;
  v_event_id text := p_event->>'event_id';
  v_subscription_id text := p_snapshot->>'id';
  v_customer_id text := p_snapshot->>'customer_id';
  v_status text := p_snapshot->>'status';
  v_existing public.billing_webhook_events%ROWTYPE;
  v_owner uuid;
  v_rows integer;
BEGIN
  IF p_user_id IS NULL OR p_expected_revision IS NULL OR p_expected_revision < 0
     OR jsonb_typeof(p_event) IS DISTINCT FROM 'object'
     OR jsonb_typeof(p_snapshot) IS DISTINCT FROM 'object'
     OR COALESCE(v_event_id, '') = '' OR COALESCE(v_subscription_id, '') = ''
     OR COALESCE(v_customer_id, '') = '' OR COALESCE(v_status, '') = ''
     OR COALESCE(p_event->>'event_type', '') NOT LIKE 'subscription.%'
     OR p_event#>>'{data,id}' IS DISTINCT FROM v_subscription_id
     OR p_event#>>'{data,custom_data,calcumint_user_id}' IS DISTINCT FROM p_user_id::text
     OR p_snapshot#>>'{custom_data,calcumint_user_id}' IS DISTINCT FROM p_user_id::text
     OR p_plan IS NULL OR p_plan NOT IN ('pro', 'business')
     OR p_interval IS NULL OR p_interval NOT IN ('monthly', 'yearly')
     OR COALESCE(p_price_id, '') = ''
     OR COALESCE(p_snapshot#>>'{items,0,price,id}', p_snapshot#>>'{items,0,price_id}')
        IS DISTINCT FROM p_price_id THEN
    RAISE EXCEPTION 'Invalid verified billing input';
  END IF;

  INSERT INTO public.billing_account_fences(user_id) VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
  SELECT revision INTO STRICT v_revision FROM public.billing_account_fences
    WHERE user_id = p_user_id FOR UPDATE;
  PERFORM id FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Missing billing account'; END IF;

  SELECT * INTO v_existing FROM public.billing_webhook_events WHERE event_id = v_event_id;
  IF FOUND THEN
    IF v_existing.payload IS DISTINCT FROM p_event THEN
      RAISE EXCEPTION 'Conflicting event receipt';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.billing_atomic_completions
                   WHERE event_id = v_event_id AND user_id = p_user_id
                     AND provider_subscription_id = v_subscription_id) THEN
      RAISE EXCEPTION 'Legacy receipt requires review';
    END IF;
    RETURN jsonb_build_object('status', 'duplicate', 'revision', v_revision::text);
  END IF;
  IF v_revision <> p_expected_revision THEN
    RAISE EXCEPTION 'Stale billing fence' USING ERRCODE = '40001';
  END IF;

  SELECT user_id INTO v_owner FROM public.subscriptions
    WHERE provider_subscription_id = v_subscription_id FOR UPDATE;
  IF FOUND AND v_owner <> p_user_id THEN RAISE EXCEPTION 'Subscription ownership conflict'; END IF;
  SELECT user_id INTO v_owner FROM public.billing_customers
    WHERE paddle_customer_id = v_customer_id FOR UPDATE;
  IF FOUND AND v_owner <> p_user_id THEN RAISE EXCEPTION 'Customer ownership conflict'; END IF;
  IF EXISTS (SELECT 1 FROM public.subscriptions WHERE user_id = p_user_id
              AND provider_subscription_id <> v_subscription_id
              AND status IN ('active', 'trialing', 'past_due')) THEN
    RAISE EXCEPTION 'Multiple paid subscriptions require review';
  END IF;

  INSERT INTO public.billing_customers(user_id, paddle_customer_id, updated_at)
    VALUES (p_user_id, v_customer_id, now())
    ON CONFLICT (user_id) DO UPDATE SET paddle_customer_id = EXCLUDED.paddle_customer_id,
      updated_at = EXCLUDED.updated_at;
  INSERT INTO public.subscriptions(user_id, provider_subscription_id, provider_customer_id,
      price_id, plan, billing_interval, status, current_period_start, current_period_end,
      cancel_at_period_end, updated_at)
    VALUES (p_user_id, v_subscription_id, v_customer_id, p_price_id, p_plan, p_interval,
      v_status, (p_snapshot#>>'{current_billing_period,starts_at}')::timestamptz,
      (p_snapshot#>>'{current_billing_period,ends_at}')::timestamptz,
      COALESCE(p_snapshot#>>'{scheduled_change,action}' = 'cancel', false), now())
    ON CONFLICT (provider_subscription_id) DO UPDATE SET
      provider_customer_id = EXCLUDED.provider_customer_id, price_id = EXCLUDED.price_id,
      plan = EXCLUDED.plan, billing_interval = EXCLUDED.billing_interval, status = EXCLUDED.status,
      current_period_start = EXCLUDED.current_period_start, current_period_end = EXCLUDED.current_period_end,
      cancel_at_period_end = EXCLUDED.cancel_at_period_end, updated_at = EXCLUDED.updated_at
    WHERE public.subscriptions.user_id = p_user_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN RAISE EXCEPTION 'Subscription ownership conflict'; END IF;
  UPDATE public.profiles SET plan = CASE WHEN v_status IN ('active','trialing','past_due')
      THEN p_plan ELSE 'free' END, updated_at = now() WHERE id = p_user_id;
  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN RAISE EXCEPTION 'Missing billing account'; END IF;

  INSERT INTO public.billing_webhook_events(event_id, event_type, occurred_at, payload)
    VALUES (v_event_id, p_event->>'event_type', (p_event->>'occurred_at')::timestamptz, p_event);
  UPDATE public.billing_account_fences SET revision = revision + 1
    WHERE user_id = p_user_id RETURNING revision INTO v_revision;
  INSERT INTO public.billing_atomic_completions(event_id,user_id,provider_subscription_id,revision,provider_snapshot)
    VALUES (v_event_id,p_user_id,v_subscription_id,v_revision,
      jsonb_build_object('subscription_id',v_subscription_id,'customer_id',v_customer_id,
        'status',v_status,'price_id',p_price_id,'plan',p_plan,'interval',p_interval,
        'period_start',p_snapshot#>>'{current_billing_period,starts_at}',
        'period_end',p_snapshot#>>'{current_billing_period,ends_at}',
        'scheduled_action',p_snapshot#>>'{scheduled_change,action}'));
  RETURN jsonb_build_object('status','applied','revision',v_revision::text);
END;
$$;
REVOKE ALL ON FUNCTION public.read_billing_fence_v1(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_billing_event_completion_v1(uuid,jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_verified_billing_event_v1(uuid,bigint,jsonb,jsonb,text,text,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_billing_fence_v1(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_billing_event_completion_v1(uuid,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.apply_verified_billing_event_v1(uuid,bigint,jsonb,jsonb,text,text,text)
  TO service_role;
COMMIT;
```

## Required acceptance before removing the guard or wiring an RPC

| Isolated PostgreSQL fixture | Required evidence |
| --- | --- |
| Inject failure after each customer/subscription/profile/receipt/completion write | All effects and revision roll back; retry applies once |
| Concurrent identical events and post-commit response loss | One atomic completion; matching retry returns duplicate without effects |
| Two snapshots read fence 0; newer commits first | Older snapshot gets 40001; no state overwrite; fresh fence/provider read required |
| Same event ID with different normalized receipt or another owner | Conflict; no effects or cross-account response |
| Legacy receipt without marker | Review required; no replay or inferred success |
| New/existing subscription ownership changes concurrently | Constraint/conditional update aborts the complete transaction |
| Other active/trialing/past_due subscription | No inferred aggregate tier or downgrade; whole transaction rejected |
| Missing profile, revoked role, invalid period, provider unavailable before RPC | No completion or partial entitlement effect |
| Revision beyond JavaScript safe integer | Decimal-string transport preserves the exact fence |
| Account deletion/retention, privileged writer bypass and deadlock | Explicit policy, role tests and retry/reconciliation evidence |

Verified locally: SQL compilation, injected-write rollback and the concurrency cases below. Still UNKNOWN: deployment-role ownership, provider read-consistency guarantees, payload normalization rules for legacy receipts, retention policy and all privileged-writer participation. The cumulative draft application route is not deployable until this proposal is approved and applied through authorized change control; deployed atomicity remains unverified. No exactly-once claim follows from this draft.

## Reproduced blocked concurrency case

An offline diagnostic starts an active provider read and holds its response, processes a newer canceled snapshot to Free, then releases the old response. The current REST handler restores Pro. Desired assertion Free / actual Pro failed as expected; this is an unresolved release blocker, not a passing regression or an implemented fix. No expected-failure/skip was added to CI. The diagnostic is preserved separately in `/workspace/review-artifacts/atomic-billing-2026-10-18/stale-snapshot-diagnostic.log` and `stale-snapshot-probe.ts.txt`.

The local fence must be read before the provider GET for the proposed CAS to reject that old response. Reading a new fence after fetching the old snapshot would defeat the protection. The proposal persists only selected non-payment-instrument fields for current-snapshot evidence; retention and privileged-access review still applies.

The current ambiguity guard retains the prior profile while rejecting the notification; it does not establish the correct aggregate tier. That profile may remain over- or under-entitled until reviewed reconciliation. The guard is not a substitute for an approved multiple-subscription policy.


## Isolated PostgreSQL acceptance — 18 October 2026

Run `node tests/billing/atomic-postgres.mjs` from the repository root with Docker available. No npm installation or database URL is needed. The harness starts a uniquely named container with `--network none`, no published ports and tmpfs data; it removes that container on completion. The local trust setting is confined to that network-isolated synthetic database. No production environment variables or credentials are supplied. PostgreSQL **16.15**, official `postgres:16-alpine` image digest `sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea`.

The harness executes existing migrations **002**, **030** and **034_billing_webhook_event_privileges** against minimal synthetic auth/profile/history/AI prerequisites. It extracts this exact SQL block, verifies the complete guarded block aborts, then removes only the known guard in memory for local testing. It creates no executable production migration and introduces no application RPC calls. Fixture roles and prerequisites are not a production schema/privilege attestation.

**25 passing acceptance cases:** failure after each of six table writes and a separate fence-increment failure; interrupted backend after writes/before commit; missing profile; bigint exhaustion; revoked service-role execution; concurrent duplicate and post-commit retry with unchanged state; competing distinct events; delayed active snapshot rejected with SQLSTATE `40001` after newer cancellation; conflicting/legacy receipts; concurrent cross-account subscription and customer binding; active/trialing/past_due ambiguity; Business/yearly metadata and cancellation; invalid owner/price; exact bigint string transport; invalid period cast; and client execution/ledger restrictions plus owner-scoped billing reads. Duplicate concurrency explicitly observes the second backend waiting on a database lock. Rollback tests compare every billing table, profile and fence before/after failure.

This proves the proposal's tested PostgreSQL transaction behavior, not production application atomicity or exactly-once delivery. The previously deployed REST webhook performed separate writes; the cumulative draft subscription route now fails closed on an unavailable RPC. No financial formulas, calculator versions or history records changed. Mandatory CI is unchanged; a narrowly scoped additional PostgreSQL workflow protects changes to this proposal, its harness and the three billing migrations.

### Minimum adoption decisions and sequence

| Owner / authority | Required evidence or decision | Current state |
| --- | --- | --- |
| Database/security owner | Actual schema drift, function owner, service-role grants/BYPASSRLS, fixed search path, backup/rollback and migration review | UNKNOWN; synthetic fixture only |
| Billing/application maintainer | Inventory every privileged subscription/profile writer; require the same account fence/lock or explicit invalidation; forbid revision reuse with old provider snapshots | Required before application wiring |
| Payment-provider integration owner | Provider GET freshness semantics, normalized immutable event fields, valid status/price/period evidence and retry/reconciliation limits | Existing application semantics preserved; external guarantees UNKNOWN |
| Billing support + data owner | Resolve legacy receipts without atomic markers and multiple-paid-subscription ambiguity; never backfill success from receipt existence | Review required; blocked automatically |
| Security/privacy + data owner | Receipt/minimal-snapshot retention, account deletion/cascade policy and privileged audit access | UNKNOWN; no retention policy invented |
| Application maintainer + database reviewer | Verify draft guarded RPC orchestration and response mapping: `40001`/`40P01` require reconciliation + new fence/provider GET, conflicts require review, uncertain outcomes require matching atomic completion lookup | Draft route wired; live deadlock/recovery and RPC transport still unverified |

Order: resolve schema/role/writer and retention decisions → review versioned migration/rollback proposal → authorize isolated full-schema integration → implement and test server orchestration against that contract → authorized migration/deployment review. None of these approvals or applications is performed here. A lost response after commit is reconciled by the existing immutable event plus atomic marker; an interrupted uncommitted transaction rolls back. Event ID uniqueness is a database constraint, not an exactly-once network guarantee. Unrelated privileged writes can defeat fencing until all writers participate.

## Draft application integration note — 18 October 2026

The cumulative draft application route now calls the proposed completion lookup, fence read and apply RPCs for subscription notifications and fails closed when the functions are unavailable. The SQL above is still a guarded proposal, not an applied migration. This draft route and SQL must remain unmerged/undeployed until the actual database schema/role, writer fencing and owner decisions are reviewed. Provider reads and database commits cannot form one distributed transaction; an uncertain response returns a retryable 503, and a new delivery must read a fresh fence and provider snapshot. No production atomicity claim follows from this code change.
