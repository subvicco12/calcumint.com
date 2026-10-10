# Mixed-category source review queue

The canonical mixed categories are `science` and `everyday`. The ledger in
`mixed-category-review-ledger.partial.json` currently contains four HOLD records
based on implementation source. It is intentionally **not** a complete reviewed
mapping and must never be passed off as one.

## Repeatable review procedure

1. Use `listCalculatorImplementationInventory()` to enumerate every current
   `science` and `everyday` slug; do not rely on a frozen count.
2. Find the defining implementation in `src/calculators/` for each slug.
   Record the actual source path, validation and input units, output semantics,
   formula, review status and any competing implementation. The JSON reviewStatus must match the registry inventory exactly; status is not publication authority.
3. Match against the 540-row master CSV by master domain and title, checking
   cross-domain collisions. Use HOLD for uncertain assignments; do not invent
   alias equivalence or specialist certification.
4. Add an explicit evidence record to the ledger for **every** mixed-category
   slug. Run `auditCatalogSlugReviewLedger` to inspect missing and held slugs.
   `requireCompleteCatalogSlugReviewLedger` must reject either condition.
5. Only when every entry has a defensible approved decision, supply the ledger
   to the opt-in `catalog-full-evidence.test.ts` reconciliation, together with
   the reviewed category mapping JSON and canonical 540-row CSV. Inspect all
   ambiguous, unmatched and unreferenced results; do not infer publication.

The currently held Power and Travel Time pairs require explicit contract and
lifecycle adjudication. A source path string in a review record is provenance
metadata, **not automated proof** that a human inspected the source.

The `buildMixedCategoryReviewQueue` helper in `src/calculators/catalog-mixed-review-queue.ts` returns the current inventory-backed queue, with missing/held/approved totals and per-slug records. It never generates approvals or substitutes for source inspection.
