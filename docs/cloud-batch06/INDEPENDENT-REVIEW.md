# Independent Batch06 review

A separate reviewer inspected the new exact-math, retirement, accounting and profile exchange modules, then the unified adapters/UI/browser/CI integration. Reviewer owned only `completion-contracts-independent.test.ts`; production changes remained with the implementer.

The reviewer independently derived14 actual-engine goldens covering all14 new profiles. Cases include mixed positive/negative return corpus58 at end/78 at begin; unequal inflation/return paths200 at end/184 at begin; real purchasing power; withdrawal shortfall; FIRE target crossed then lost; Coast loss/recovery; reordered tranche identities, omitted/reduced vesting rejection; disjoint closing costs/refunds; repeating inclusive tax fractions; exact decimal ratio. Initial56 numerical tests (42 author+14 independent) passed. Four further author boundary tests cover600 periods, duplicate identities, invalid closing totals/denominators and omitted vesting inputs. No mathematical Critical/Important finding.

## Demonstrated Important defect

The first unified importer selected an adapter by outer masterId, but the shared family replayer accepted a valid payload for another profile. Swapping profile85's withdrawal payload into profile81's envelope succeeded, displaying savings methodology with withdrawal input/results. The independent reviewer reproduced a failing rejection assertion.

The author added four family-swap regressions:81←85,36←49,126←133,469←82. All four failed RED with the initial importer. Fix: original family replay is followed by export through the SELECTED adapter with replayed input; the whole expected outer/inner envelope is compared against supplied data. Original inner formats are retained. All four regressions then passed, along with every other broker/UI case.

The reviewer rechecked the fix and ran44 broker/UI tests (41 broker+3 UI), including the four swap regressions: no outstanding Critical or Important finding. Browser harness and additive CI step were statically reviewed with no further finding. Author's final174 actual Chromium journeys passed after the fix; reviewer did not independently duplicate the browser campaign.

Engineering review does not establish source-byte/version completeness, qualified institutional/tax/financial applicability or full canonical acceptance. All original blockers and RELEASE HOLD remain in force.
