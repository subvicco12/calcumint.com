-- CalcuMint: persist explicit country preference without requiring precise location.
alter table public.user_preferences
  add column if not exists country_code text
  check (country_code is null or country_code in ('IN','US','GB','CA','AU'));

comment on column public.user_preferences.country_code is
  'Explicit user-selected Wave 1 country preference. Null means custom regional settings; never inferred from precise location.';
