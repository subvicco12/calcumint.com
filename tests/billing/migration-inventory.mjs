// Read-only repository migration inventory. No database or network access.
import { readdir } from 'node:fs/promises';

export function inspectMigrationNames(names) {
  const sql = names.filter(name => name.endsWith('.sql')).sort();
  const prefixes = new Map();
  for (const name of sql) {
    const match = /^(\d+[a-z]?)_/.exec(name);
    if (!match) continue;
    const prefix = match[1];
    prefixes.set(prefix, [...(prefixes.get(prefix) ?? []), name]);
  }
  const duplicatePrefixes = [...prefixes.entries()]
    .filter(([,files]) => files.length > 1)
    .map(([prefix,files]) => ({ prefix, files }));
  const countryMigration = sql.includes('009_country_preferences.sql');
  return {
    files: sql,
    duplicatePrefixes,
    countryMigration,
    reconciliation: countryMigration
      ? 'REVIEW_REQUIRED: match 009_country_preferences.sql to authoritative deployment evidence'
      : 'BLOCKED: 009_country_preferences.sql missing'
  };
}

export async function inventoryRepositoryMigrations(directory = 'supabase/migrations') {
  return inspectMigrationNames(await readdir(directory));
}
