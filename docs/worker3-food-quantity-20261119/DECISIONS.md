# Unsigned Food quantity decisions

All eight remain IMPLEMENTED_NOT_QUALIFIED. Actual reviewer identity, competence/independence/appointment and attributed decisions must be established through the authorized project process. No source, precision, QA or canonical approval is fabricated.

|ID|Engine v1|Source/applicability decision|Precision/refusal decision|
|---|---|---|---|
|496|food.recipe-scaling|Supplied ingredient quantity scaled by target/original servings, compatible entered units; no recipe/process prescription.|Binary64 product/division and retained roundTo6 operation; bounded inputs, legitimate zero versus misleading positive rounded-zero refusal.|
|497|food.serving-size|Supplied total quantity divided by servings; fractional serving portions remain allowed.|Division plus retained roundTo6; admitted/refused envelope, zero totals and original rounded-zero historical output.|
|499|food.bakers-percentage|Ingredient mass relative to total flour mass; applicability of retained King Arthur Baking source revision/capture.|Division×100 and original roundTo6, mass-unit consistency, zero ingredient and positive rounded-zero refusal versus historical v1.|
|500|food.dough-hydration|Supplied water/flour mass percentage; source applicability does not prescribe hydration or safe food handling.|Division×100 and original roundTo6; bounded ratio, zero water and original zero historical replay independently of current capture.|
|501|food.cake-pan-conversion|Ingredient scaling by supplied target/original pan area in matching area units; no baking time/depth/doneness/safety inference.|Product/division plus original roundTo6; pan-area/input quantization, legitimate zero ingredient versus positive rounded-zero refusal.|
|503|food.nutrition-scaling|User-entered nutrient amount×servings in a consistent entered nutrient unit; no nutrient database, diet or health inference.|Product and original roundTo6, fractional servings, bounded domain and historical/current rounded-zero distinction.|
|504|food.coffee-ratio|Coffee mass=water mass/user-supplied water-to-coffee ratio; no preferred brewing recipe inferred.|Division plus original roundTo6; grams/mass-ratio convention and positive rounded-zero refusal with immutable old zero retained.|
|505|food.water-to-rice-ratio|Water quantity=rice quantity×user-supplied ratio with explicit compatible input/output units; no cooking/process/safety recommendation.|Product and original roundTo6; ratio-unit convention, legitimate zero versus positive rounded-zero, immutable historical behavior.|

The original engines are unchanged. Retaining the six-decimal rounding operation does not establish six accurate decimal places across the full binary64 domain. Independent reviewers must approve exact source revision/capture and formula applicability, input quantization/error/refusal/display policy and bounded source contract. Catalog notes alone are not substantive source approval; publisher URLs are not frozen captures. Capture tag `worker3-food-quantity-20261119.1/<engineId>@1` is a private workflow revision, not publisher acceptance.

For each exact ID/slug/v1, the scoped QA owner must accept/reject/defer/justify NA for every applicable Final UI/history/scenario/batch/export/accessibility/performance/editorial/abuse/plan requirement, reusing current evidence and adding only genuine missing evidence. Native320px/AX/keyboard/nonempty44px checks are scoped, not universal WCAG or physical-device approval. No blanket graph/reverse requirement or waiver is inferred.

Coordinator generic replay/registry/source admission remains separate from passing private packet/snapshot verification. Preserve original v1 rounded-zero records; do not silently recalculate/upgrade them through the current capture gate. Account history stores normalized inputs/output and v1 identity, not original raw decimal text/full source tag. Raw/source-bound provenance lives in exported packet JSON.

Shared Business/team/client storage, native API/embed, metered jobs and webhooks remain unavailable for these tuples. Generic current-member read/revocation evidence does not enable delivery. Business owner/coordinator must decide applicable scope and exact tuple/storage/caller/source capability adoption plus tenant/quota/audit/security evidence separately.

All mandatory hosted jobs and aggregate must pass at the selected exact integrated head. Local tests/build/TypeScript and passing CI alone cannot qualify an ID. Canonical contract adoption, current production equivalence and separate release authority remain outstanding. No counts, certification, publication or held controls change. RELEASE HOLD ACTIVE.
