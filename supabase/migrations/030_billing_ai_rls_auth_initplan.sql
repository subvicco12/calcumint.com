-- Optimize simple billing and AI ownership RLS predicates flagged by Supabase auth_rls_initplan.
-- The equality predicates are unchanged; auth.uid() is evaluated once per statement.

alter policy "billing_customers_select_own" on public.billing_customers
  using ((select auth.uid()) = user_id);

alter policy "subscriptions_select_own" on public.subscriptions
  using ((select auth.uid()) = user_id);

alter policy "ai_usage_user_read" on public.ai_usage_events
  using (user_id = (select auth.uid()));
