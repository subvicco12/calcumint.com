# Production platform owner bootstrap

The first `platform_admins` row is an operations bootstrap. Migration 008 intentionally provides no authenticated INSERT/UPDATE/DELETE policy for this table, so the first owner must be established with trusted service-role credentials.

Use the repository script only after an operator explicitly identifies the account that should own CalcuMint administration.

## Dry run

Set `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CALCUMINT_OWNER_EMAIL` in the operator environment, then run:

`npm run admin:bootstrap-owner`

Dry-run mode validates that exactly one confirmed Auth user has that email and checks the existing owner state. It performs no write.

## Apply

After reviewing the dry-run output:

`npm run admin:bootstrap-owner -- --apply`

The script refuses to replace or add a second active owner. If the requested user is already the active owner it exits without a write.

This bootstrap does not create calculator catalog rows, QA evidence, source evidence, reviewer assignments, certification, or publication state. Those remain governed by the normal admin lifecycle.
