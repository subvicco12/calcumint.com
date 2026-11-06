# Guarded adoption review package

This package has no production executor. Engineering and disposable-fixture validation are authorized; production writes and migration activation remain unauthorized. Both SQL artifacts raise an unconditional exception inside their transaction before locks or changes. There is no command-line activation switch.

Eight immutable existing sources plus one new narrow trigger privilege correction are bound in `tests/adoption1528/plan.json` and compose migrations 032–035, the draft inventory RPC, exact-date predicate repair, final-row publication validation, and P0 publication dependency guards. The package adds twelve functions, six triggers and three corresponding constraint-trigger metadata entries, and replace only the publication predicate. Existing publication BEFORE validation, table policies, existing function ownership/ACLs and provider functions remain unchanged. Country, membership and account ACL corrections are excluded. Existing source files are unchanged. The ninth source, `new-trigger-privileges.sql`, revokes EXECUTE from PUBLIC, anon and authenticated on only the six newly added trigger-only functions, preserving service_role execution and migration027’s existing contract. It changes no default ACL, table grant or provider control.

`guarded-target-apply.sql` binds the exact authenticated read-only target metadata bytes. `guarded-target-reverse.sql` binds a **derived expected target postimage**, not an observed production state. Both require READ COMMITTED and the captured postgres owner, acquire scoped table locks in stable order, and refuse incompatible metadata. The final apply also verifies the derived expected postimage inside its transaction. Production execution would additionally require separately authorized DDL quiescence: table locks do not serialize independent function or default-privilege DDL. Neither capture provenance nor possession of these artifacts grants activation authority.

The fixture reconstructs the captured tables, constraints, indexes, policies, function definitions and ACLs, and captured postgres global/public function default ACLs in disposable PostgreSQL with real GoTrue/PostgREST. PostgreSQL 17.6 reparses one existing source URL CHECK from a nested AND to an equivalent flat AND; acceptance enumerates the exact two strings and permits no other difference. The target postimage preserves the authentic CHECK string and transplants only the locally proven function, trigger and constraint-trigger deltas, preserving captured default function grants including service_role. The receipt records both local and target-derived hashes and this formatting difference.

Synthetic runtime checks provision the selected 20 current-v1 identities as pending drafts only. They verify genuine JWT denial, atomic QA/audit creation, retry/concurrency, failure rollback, direct publication refusal, and preservation of 209 explicitly synthetic published sentinels. These are not canonical, source, reviewer, certification, publication eligibility or production data acceptance.

The reverse uses no CASCADE and performs no application row deletion or mutation. It restores known-defective predecessors for technical reversibility only; it is not an approved safe production rollback. Completed draft, audit and job rows are retained. Critical workflows must remain held pending separately authorized recovery.

Run from the repository root:

```sh
node --test tests/adoption1528/bundle.test.mjs
node tests/adoption1528/acceptance.mjs
```

The second command requires the preloaded, pinned local Docker fixtures and regenerates review artifacts only after all checks pass.
