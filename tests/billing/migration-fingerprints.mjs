// Compare locally available repository SQL to externally supplied ledger hashes.
// No database connection, production credentials, or migration execution.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const MIGRATION_FINGERPRINT_EVIDENCE = Object.freeze([
  { name:'b3_accounts', path:'supabase/migrations/001_b3_accounts.sql', sha256:'44c6b84cbef90edd8bae8f97b9ee8f3ca3fe0a2b75c9a7bc81c40ab782641444' },
  { name:'b4_billing', path:'supabase/migrations/002_b4_billing.sql', sha256:'3676dc52b3086a3445ccc96a6dc2e4aa7293d23f66736046bca22243a918df24' },
  { name:'account_rls_auth_initplan', path:'supabase/migrations/029_account_rls_auth_initplan.sql', sha256:'b9e21c71f2ff4e4d097df066181256e9a36834d505b80e24e080530c267840f0' },
  { name:'billing_webhook_event_privileges', path:'supabase/migrations/034_billing_webhook_event_privileges.sql', sha256:'761759a22f2a52b165b4d31294b3ba4bac69feb7a3b420cacfb0278d4881a042' }
]);

// Strip only full-line SQL comments. This is a diagnostic, not a SQL parser.
export function stripLineComments(sql) {
  return sql.replace(/^\\s*--[^\\n]*(?:\\n|$)/gm, '');
}

export async function compareMigrationFingerprints(evidence = MIGRATION_FINGERPRINT_EVIDENCE) {
  const result = [];
  for (const entry of evidence) {
    const body = await readFile(entry.path);
    const actual = createHash('sha256').update(body).digest('hex');
    const commentStripped = createHash('sha256').update(stripLineComments(body.toString('utf8'))).digest('hex');
    result.push({ name:entry.name, path:entry.path,
      status:actual === entry.sha256 ? 'EXACT_MATCH' : commentStripped === entry.sha256 ? 'COMMENT_STRIPPED_MATCH' : 'UNRESOLVED_DIFFERENCE',
      repositorySha256:actual, commentStrippedSha256:commentStripped, ledgerSha256:entry.sha256 });
  }
  return result;
}
