import {catalogSQL as original,tables as oldTables,functionNames as oldNames} from '../adoption1528/catalog.mjs';
export const tables=['profiles','calculation_history','calculation_projects','saved_scenarios'];
export const functionNames=['atomic_snapshot_valid','atomic_account_plan','guard_atomic_history','guard_atomic_workspace','save_calculation_history_atomic','save_project_scenario_atomic'];
const list=values=>values.map(v=>`'${v}'`).join(',');
// Preserve the established projection and deterministic ACL ordering; substitute
// only the explicit scope lists. This never changes the original capture/bundle.
if(!original.includes(list(oldTables))||!original.includes(list(oldNames)))throw Error('Original scoped capture contract changed');
export const catalogSQL=original.replaceAll(list(oldTables),list(tables)).replaceAll(list(oldNames),list(functionNames));
export const captureSQL=`BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY; SET LOCAL search_path=pg_catalog; SET LOCAL statement_timeout='20s'; SELECT (${catalogSQL})::text AS metadata_json,clock_timestamp() AS observed_at,current_setting('transaction_read_only') AS read_only,current_user AS observed_actor; COMMIT;`;
