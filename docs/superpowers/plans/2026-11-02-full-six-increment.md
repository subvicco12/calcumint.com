# Full-six increment implementation plan

Goal: Execute the approved isolated engineering direction while retaining all publication and canonical review gates.
Architecture: New experimental modules consume exact contract hashes and Decimal strings. Historical engine definitions, registry and snapshots remain unchanged. One caller-only lexical correction refuses demonstrated lossy new input before old engines run.
Spec: docs/full-six/input/SHARED-PRODUCT-CONTRACT.md and contracts/*.json; direct user authorization supersedes proposal commissioning fields only for engineering.

- [ ] Shared numeric formatting/explicit geometry unit conversion: new full-six/format-policy.ts and units.ts; ties, signed zero, tiny/huge values, invalid unit/domain tests. No legacy formatter change.
- [ ] Paired statistics core: new statistics/decimal-descriptive modules; explicit population/sample, integer frequencies, missing policy, exact decimal bounds, independent >=100-digit oracle fixtures. Record unsupported branches rather than full-product acceptance.
- [ ] Shared artifact/snapshot infrastructure: strict typed outcomes and contract/identity/source bindings; immutable exact string serialization, exact revision replay, digest and recomputation rejection. No certified runtime version allocated.
- [ ] Registered caller correction: retain historical numeric-input, use existing strict lexical parser only for current binary64 helper consumers; actual controls deny lossy input and recover zero/valid artifacts identically across plans.
- [ ] Fast publication: reuse the existing register and requirement evidence; prepare only exact defensible registered targets, retain missing full scope/reviewer/QA/lifecycle decisions. Never infer eligibility.
- [ ] Integrate private demonstration only where exact API and requirements are supported. Focused tests then full mandatory lint/typecheck/unit/security/certification/webpack validation; independent review before one draft PR and one exact-head CI check.

Review focus: ordinary decimal statistics must not be narrowed by the binary64 caller guard; frequency counts must not expand memory; sample degrees of freedom must follow effective count; digest alone is not approval/authentication; unknown versions cannot silently replay through latest; no expanded definition replaces a historical engine or public route.

Integration decision: unregistered experimental foundations live in src/lib/full-six, outside the frozen registered-engine source tree. Existing calculator source hashes and historical reconciliation assertions remain unchanged; new modules receive their own explicit manifest.
