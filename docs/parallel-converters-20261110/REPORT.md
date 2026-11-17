# Converter worked examples — bounded software change

Authoritative ledger: `docs/thirteen-program-20261110/requirements-540.json`.

IDs: 423, 424, 425, 427, 428, 429, 430, 431, 432, 433, 434, 437, 438, 439, 440.

Demonstrated shared gap: `src/components/publication20-tool.tsx` renders value entry, reconciliation, scope, batch, and account actions, but exposes no registered `definition.examples`. These 15 existing registered converters already include concrete example inputs and authoritative source URLs. A user cannot inspect their worked method or load those inputs through that caller.

New functionality: `src/lib/converter-cohort-20261110.ts` prepares actionable examples from those existing definitions, parses the registered input, calculates with the exact registered engine and checks the existing precision boundary. It preserves case-sensitive unit codes and returns an immutable complete draft. `src/components/converter-cohort-20261110-examples.tsx` renders source/target values, unrounded computed result, ordered method/formulas, scope and sources, with an accessible explicit button. There is no automatic draft mutation. The parent caller integration uses one `setDraft({...example})` action so all fields and the derived output update together.

No factors, historical engines, versions, authority or canonical dispositions change. No support added for blocked currency #442, ambiguous #217 identity, #214 rounding, or unregistered #268 v2.

Validation command:

```
./node_modules/.bin/vitest run --config tests/parallel-converters-20261110/vitest.config.ts
```

Result: 17 tests passed across two files. Each of the 15 IDs independently checks a concrete registered worked input and numeric expected output; component test checks units/method and no action before click, then exact selected draft. Missing module/component failures were observed before adding their implementations. Initial test fixtures for six examples were corrected against their actual registered source examples (the feature intentionally exposes those exact examples). Typecheck found only peer-file errors in `tests/parallel-specialist-general-20261110/business-input.test.tsx` lines 16/20, reported to root. No production build run.

Remaining genuine completion gaps: root caller integration and integration/browser verification; competent QA of the canonical requirements, source applicability review and acceptance authority remain separate. This closes only the missing worked-example interaction, not every requirement for any calculator. Canonical ledger is unchanged, including #432/#440 review-pending status and 43 identity/scope blocked rows. No completion/certification/publishing claims.
