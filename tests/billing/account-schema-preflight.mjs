// Read-only production-shaped account schema preflight. Run with a SQL query
// adapter returning rows; never applies migrations or repairs missing objects.
export const ACCOUNT_SCHEMA_PREFLIGHT_SQL = `
SELECT
  EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='user_preferences'
  ) AS preferences_table_present,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='user_preferences'
      AND column_name='country_code'
  ) AS country_code_present,
  EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='profiles'
      AND column_name='display_name'
  ) AS display_name_present
`;

export function assessAccountSchemaPreflight(row, migrationEvidence) {
  const blockers = [];
  if (!row?.preferences_table_present) blockers.push('public.user_preferences is absent');
  if (!row?.country_code_present) blockers.push('public.user_preferences.country_code is absent');
  if (!row?.display_name_present) blockers.push('public.profiles.display_name is absent');
  // Migration evidence is independent of schema presence: external/manual
  // deployments require an explicit verified-equivalence decision.
  if (migrationEvidence !== 'recorded' && migrationEvidence !== 'verified-equivalent') {
    blockers.push('country_preferences deployment history is unverified');
  }
  return { ready: blockers.length === 0, blockers };
}
