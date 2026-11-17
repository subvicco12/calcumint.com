# Held Business extension: next20

Status: **HELD, unapplied**. The successor extends the held milestone100 factory mapping from69 to89 tuples. It adds only catalog IDs284–291,300,329,333–342. It does not authorize certification, canonical adoption, publication, production SQL execution or deployment. Existing SQL generators, active migrations, application source and canonical counts were not edited.

`held-successor.sql` and `held-reverse.sql` deliberately raise `UNAPPLIED_NEXT_ENGINEERING_BUSINESS_*` before any mutation. Both bind four existing function definitions, SHA256 hashes, owners and ACLs; four constraints and their validation/inheritance flags; and four table owners, ACLs and RLS flags. Both verify the expected final metadata inside the transaction. The successor retains the authorization bodies and old structured sharing clauses. The reverse refuses when any added identity has durable grant, usage, job or shared-snapshot evidence; it never deletes evidence or audit rows.

`immutable-engine-cases.json` records actual first-example engine calculations and every compiled immutable engine source hash. All output fields are retained: numeric fields plus string-array steps. Normal distribution explicitly includes zScore, pdf, cdf and upperTail. Chemistry adds the exact value/steps shapes. The SQL checks exact keys, numeric types and finite binary64 magnitude, plus string-array steps. It checks transport shape; application historical verification remains responsible for exact immutable engine agreement.

`preimage.json`, `postimage.json` and `tuples89.json` are captures from disposable pinned PostgreSQL17.6, GoTrue2.197.0 and PostgREST12.2.3. The images run without published ports on an internal Docker network. The fixture refuses external database environment variables and destroys its containers/network after execution. `fixture-receipt.json` is sanitized and records source hashes, images, limits and observations. Production equivalence remains UNKNOWN.

Run the focused generator tests from the repository root:

```sh
node tests/next-engineering-20261115/business-generator.test.mjs
```

Run the genuine isolated fixture with the existing pinned local Docker images:

```sh
node scripts/next-engineering-20261115/business-sql-acceptance.mjs
```

The default fixture verifies checked-in bytes; it does not rewrite SQL or captures. Output goes to `/tmp/next-business-evidence/receipt.json`, or `BUSINESS_ARTIFACTS`. `BUSINESS_GENERATE=1` explicitly regenerates this directory's held SQL and captures from the isolated fixture. It never removes hold markers from the checked-in files.

After integrating the new factory family modules, exercise actual factory execution and actual authenticated sharing-server template recovery:

```sh
BUSINESS_INTEGRATED=1 node scripts/next-engineering-20261115/business-sql-acceptance.mjs
```

That mode bundles the real sharing/session/access modules, adapting only Next cookie transport to a genuinely signed-in SDK client. It verifies every new workflow against the immutable engine snapshot, exact template recovery, current Business member reads, stale-account denial, wrong-project denial and foreign/free/pro denial. This optional mode requires all20 new contracts in the integrated application registry; the isolated Business branch deliberately does not edit that registry.

The isolated acceptance proves20 new sharing cases plus8 retained structured cases, immutable exact retries/conflict refusal, anonymous/authenticated RPC execution denial,232 malformed and oversized per-numeric-field refusals without inserted rows, member RLS recovery, foreign/free/pro/revoked membership denial, wrong-project client refusal,28 exact share audits and reverse refusal after durable evidence. Publication gates genuinely deny every new tuple; no approval function is substituted.
