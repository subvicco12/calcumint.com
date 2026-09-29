-- Restrict the internal Paddle webhook event ledger to privileged server access.
-- RLS already has no client policies; revoke client table grants as defense in depth.
revoke all privileges on table public.billing_webhook_events from anon, authenticated;
