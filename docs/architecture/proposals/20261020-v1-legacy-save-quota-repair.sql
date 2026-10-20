-- Versioned REVIEW PROPOSAL v1, NOT a deployed migration or deployment timestamp.
-- Never rewrite 011 or mark it applied from this file. The owner must authorize
-- a fresh-install/upgrade manifest and ledger identity separately.
-- Repairs only the missing legacy 011 function/triggers; NOT an atomic quota fix.
-- History atomicity additionally requires the reviewed ATOMIC-ACCOUNT-HISTORY.sql.
BEGIN;
DO $proposal_guard$ BEGIN
 RAISE EXCEPTION 'UNAPPLIED_LEGACY_SAVE_QUOTA_REPAIR_V1';
END $proposal_guard$;

DO $prerequisites$ BEGIN
 IF to_regclass('public.profiles') IS NULL
  OR to_regclass('public.favorites') IS NULL
  OR to_regclass('public.calculation_history') IS NULL THEN
  RAISE EXCEPTION 'LEGACY_QUOTA_REPAIR_PREREQUISITES_MISSING';
 END IF;
 IF to_regprocedure('public.enforce_calcumint_save_quotas()') IS NOT NULL
  OR EXISTS(SELECT FROM pg_catalog.pg_trigger WHERE NOT tgisinternal
   AND ((tgrelid='public.favorites'::regclass AND tgname='favorites_free_quota')
    OR (tgrelid='public.calculation_history'::regclass AND tgname='calculation_history_free_quota'))) THEN
  RAISE EXCEPTION 'LEGACY_QUOTA_REPAIR_EXISTING_CONTRACT_REQUIRES_OWNER_COMPARISON';
 END IF;
END $prerequisites$;

-- Body and search path preserve 011's authored behavior; only its broken dollar
-- terminator is corrected. No plan update or new policy/entitlement is introduced.
CREATE FUNCTION public.enforce_calcumint_save_quotas() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
declare account_plan text; current_count bigint;
begin
 select coalesce(plan,'free') into account_plan from public.profiles where id=new.user_id;
 if account_plan not in ('pro','business') then
  if tg_table_name='favorites' then select count(*) into current_count from public.favorites where user_id=new.user_id; if current_count>=10 then raise exception 'Free accounts can save up to 10 favorites'; end if;
  elsif tg_table_name='calculation_history' then select count(*) into current_count from public.calculation_history where user_id=new.user_id; if current_count>=20 then raise exception 'Free accounts can keep up to 20 calculations'; end if;
  end if;
 end if;
 return new;
end $$;

REVOKE ALL ON FUNCTION public.enforce_calcumint_save_quotas() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER favorites_free_quota BEFORE INSERT ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.enforce_calcumint_save_quotas();
CREATE TRIGGER calculation_history_free_quota BEFORE INSERT ON public.calculation_history
FOR EACH ROW EXECUTE FUNCTION public.enforce_calcumint_save_quotas();
COMMIT;
-- A future owner-approved rollback removes only these exact named objects if
-- their captured definitions/ownership still match. No CASCADE, data mutation or
-- atomic-guard removal is authorized. Existing installations require comparison,
-- not automatic replacement. PUBLIC schema CREATE privileges require review.
