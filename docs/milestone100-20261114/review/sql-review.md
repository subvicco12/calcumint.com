# Read-only held SQL review

Reviewed the held ACTUAL44-to-69 generator and emitted SQL, plus disposable fixture preimage/postimage/restored captures under `/workspace/artifacts/milestone100-20261114/business-sql/`. No SQL was applied by this reviewer; no production access or certification is implied.

## Confirmed unchanged controls

Line-level comparisons of the four captured function definitions show three publication/job functions each changing exactly one VALUES mapping line. Sharing changes exactly two lines: its exact slug whitelist and output-shape CASE. All other function text is unchanged. Thus service-role checks, actor roles, tenant/project/client checks, plan checks, quota/audit behavior, request idempotency and publication refusals remain the predecessor behavior; this is a change review, not a claim that all predecessor behavior is correct.

All four function owners and ACLs match predecessor captures. All four table metadata objects match, including owner/ACL/RLS flags. The four constraints retain validated=true and noInherit=false while adding the new exact identities/slugs. The restored capture equals the entire predecessor JSON capture exactly.

Each held successor, reverse and retained-shape delta contains its explicit unapplied hold, four exact function definition-hash/owner/ACL guards, four exact constraint guards and four table owner/ACL/RLS guards. The reverse retains the durable-evidence refusal across all four tables and contains no DELETE FROM statement. Replay and roundtrip evidence is produced by the separate disposable acceptance harness, not by this review.

## Output shapes

The eight new structured-output branches name exact slugs and exact key sets: root finder; triangle and right triangle; surface area and volume; molarity, moles and dilution. They validate scalar number types, string-only steps arrays and the root finder's two-number bracket plus integral bounded iterations. These match the actual engine output structures; chemistry output is `{value,steps}`, not `{result}`.

The previously identified numeric-range defect is resolved in the reviewed held delta. Fresh inspection after commit `a3b60725130784796ca461c88c33e8983395584d` confirms each numeric field in all eight branches and each root bracket element uses a guarded PostgreSQL numeric comparison `abs(value) <= 1.7976931348623157e308`. The emitted successor, retained-shape delta and captured sharing function each contain all 21 bound checks. The reverse appropriately restores the predecessor rather than adding new bounds to it.

Fresh receipt `/workspace/artifacts/milestone100-20261114/business-sql/receipt.json`, SHA-256 `672e8e18d41c26d2658c5cef010c03747393eb3431a44bc7276bd81505086b9e`, reports eight real PostgREST positive shape saves and retries, 51 structural refusals and nine raw JSON `1e1000` refusals (one scalar per branch plus the root bracket). The producer sends these oversized numerics as literal raw JSON rather than letting JavaScript stringify Infinity to null, and asserts no refused request row was saved. Every saved row is checked against the original snapshot; authenticated direct callers are denied.

The receipt's successor, reverse and retained-delta hashes match the files inspected; all six recorded producer source hashes match current files. Its passed=true, productionWrites=false, sqlActivated=false and releaseHold=true flags are consistent with the reviewed fixture scope. A fresh pre/post comparison reconfirms the same one-line mapping changes and two-line sharing changes, unchanged owners/ACLs/table metadata and exact restored predecessor capture. No unresolved demonstrated defect remains in this inspected delta.

## Limits

Only held artifacts and local captured evidence were read. The fresh real PostgREST receipt and its producer/source bindings were checked; this reviewer did not independently rerun its disposable database fixture. Business authorization, SQL adoption and production equivalence remain outside this read-only review. This review is engineering evidence only.
