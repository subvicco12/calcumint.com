# Private changed-factor converter workspace

The exported `PrivateFixedFactorReview` component provides a controlled, private draft surface for proposals 429 (pressure), 437 (density) and 439 (torque). It uses the existing immutable private cores and snapshot create/replay functions, and renders their scalar outputs with the actual `FinalCalculatorRenderer` and existing unit-conversion presentation. No public route, registered version, source mapping, account service or historical engine is changed.

| Proposal | Retained source correspondence | Example output from the unchanged private core | Remaining scope |
|---|---|---|---|
| 429 pressure | UCUM pound-force / international inch² | `1 psi → 6894.757293168362 Pa` | Fixed scalar units; gauge/absolute reference-model offsets are excluded |
| 437 density | Conventional avoirdupois pound / international foot³ | `1 lb/ft³ → 16.018463373960138 kg/m³` | No temperature, composition or buoyancy model |
| 439 torque | Conventional pound-force × international foot/inch | `1 lbf·ft → 1.3558179483314003 N·m` | Moment of force; no reinterpretation as energy or work |

Source applicability, competent review and canonical adoption remain pending for all three. These examples do not allocate technical successor versions or approve legacy approximation tolerances. The international-acre factor and every historical v1 engine remain unchanged.

Raw numeric text and both unit selections are controlled independently from the immutable result. Empty/incomplete text, unsupported units, decimal spelling that cannot round-trip under the existing caller parser, and nonidentity inputs outside the private normal range are rejected. The parser preserves supplied Number semantics; admitting a shortest decimal spelling does not make its binary64 value an exact real decimal. Zero is explicitly normalized in JSON; negative scalar inputs and the existing finite-identity exemption are retained. The inherited nonidentity domain is zero or `2^-970 ≤ |value| ≤ 2^990`, with the existing supplied-Number relative bound `γ₄ = 4u/(1−4u)`, `u=2^-53`. No new calculation formula is implemented in the workspace.

Any live input edit removes the current result and disables capture until recalculation. Saving history preserves original raw spelling, private identity, implementation revision, source hash and actual output. History is capped at 20 detached records. Explicit A/B capture replaces only the selected slot; later live edits do not mutate it. Comparison requires the same private converter and output unit. Native captioned tables present the two actual saved outputs; no invented financial recommendation, schedule, sensitivity model or aggregation is added to this fixed scalar method.

Complete JSON export contains the current verified record, history and both scenario slots. Each raw draft and nested immutable artifact is revalidated and re-executed before import commits any state. Strict envelope keys, source/revision binding, duplicate-key rejection, numeric parsing bounds, history limits and a two-million-character limit apply. Malformed or tampered recovery leaves valid history/scenarios untouched and preserves recovery text for correction. JSON download uses the actual Blob control. Synthetic free/pro/business selection affects renderer presentation only: each proposal has UI tests demonstrating identical artifacts and exports across all three plans. This local engineering surface does not change public feature entitlements.

Verified state persists under a separate browser-storage key. Remount restores raw saved values and private identities. Corrupt stored bytes are copied into the recovery field without being overwritten on mount. Storage write failures retain the verified in-tab state and allow JSON export. Unfinished drafts are tab-local; browser storage can be cleared or unavailable, so JSON remains the portable recovery path. There is no account synchronization.

Run the bounded feature tests:

```sh
node node_modules/vitest/vitest.mjs run src/lib/conversion-successor/fixed-factor-workspace.test.ts src/components/private-fixed-factor-review.test.tsx
node node_modules/typescript/bin/tsc --noEmit --incremental false
node tests/execution-recovery-20261109/converter-workspace-evidence.mjs --check
```

The machine evidence contains per-ID raw A/B packets, source/domain metadata, actual scalar units and outputs, complete history/scenario exports, exact recovery hashes and tamper results. It binds the new workflow/UI files and unchanged core files. Verification retains the exact red/green terminal log bytes as base64 with their SHA256 values, avoiding terminal whitespace changes in source control. It reuses the retained 68-pair/1,224 signed independent rational qualification packet without rerunning that numerical sweep. Real-component jsdom tests cover accessible labels, renderer output, malformed drafts, plan parity, A/B/history, remount, failed atomic recovery, unavailable storage and actual download bytes. This is bounded engineering evidence, not a manual browser/assistive-technology audit, whole-domain proof, full canonical completion, source approval, certification or publication authority.
