-- Optimize the B3 account RLS policies so auth.uid() is initialized once per statement.
-- Wrapping auth.uid() in SELECT preserves the existing ownership predicates while avoiding per-row re-evaluation.

alter policy "profiles_select_own" on public.profiles
  using ((select auth.uid()) = id);

alter policy "profiles_update_own" on public.profiles
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

alter policy "preferences_select_own" on public.user_preferences
  using ((select auth.uid()) = user_id);

alter policy "preferences_insert_own" on public.user_preferences
  with check ((select auth.uid()) = user_id);

alter policy "preferences_update_own" on public.user_preferences
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "favorites_select_own" on public.favorites
  using ((select auth.uid()) = user_id);

alter policy "favorites_insert_own" on public.favorites
  with check ((select auth.uid()) = user_id);

alter policy "favorites_delete_own" on public.favorites
  using ((select auth.uid()) = user_id);

alter policy "history_select_own" on public.calculation_history
  using ((select auth.uid()) = user_id);

alter policy "history_insert_own" on public.calculation_history
  with check ((select auth.uid()) = user_id);

alter policy "history_delete_own" on public.calculation_history
  using ((select auth.uid()) = user_id);
