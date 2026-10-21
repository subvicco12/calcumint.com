# Owner-approved four-calculator DRAFT engineering

RELEASE HOLD. Owner explicitly authorized 206 Scientific, 517 configurable Grade, 518 non-medical Sleep Duration and 531 versioned Planetary Weight implementation/testing/draft integration. No certification, public registration, publication, production or specialist-review bypass is authorized.

Base: #1453 `42464b5c201ee22bf2d14e0c11951abb5c593ffa`; #1452 `c9d5939bf54281e8a5aca0446037a31369ba87a5`. Both SUCCESS heads and main `caffafe639350ca0c2c2cf33ae1f099294f5af54` were checked once. Source PRs and all ten earlier DRAFT engines are unchanged.

|ID|Engine and colocated test|Contract|
|---|---|---|
|206|`src/calculators/core/draft-master-206.ts` / `.test.ts`|decimal.js 10.6.0 explicit runtime dependency; clone 50-digit half-even context, 34 reported digits; exact degree lattice/quadrant/cofunction reduction; no general near-zero clamp; principal inverse angles; explicit operation domains and exponent limits.|
|517|`src/calculators/travel/draft-master-517.ts` / `.test.ts`|Explicit native grading scale, weighted/unweighted mean, required missing-value policy, optional caller-defined labels. Reuses `statistics.weighted-mean`; filters zero weights and rejects overflow, contribution underflow or out-of-scale floating results. No institutional defaults.|
|518|`src/calculators/travel/draft-master-518.ts` / `.test.ts`|Strict dated minute-precision timestamps with Z/±HH:mm offsets; elapsed UTC minutes and separate integer awake subtraction. Rejects offsetless/named-zone ambiguity; no timezone database, offset inference, clinical interpretation or master 410 reassignment.|
|531|`src/calculators/astronomy/draft-master-531.ts` / `.test.ts`|Versioned NASA JEOD spherical model GM/R² references for Earth/Mars/Jupiter/Moon, plus separate 9.80665 standard-Earth convention; kg/lb physical mass, force N, Earth-equivalent indicated kg. Reuses `physics.force`. Not measured landing-site/apparent gravity.|

## Independent mathematical evidence

Scientific fixtures: `src/calculators/verification/fixtures/draft-master-206-goldens.json` and reproducible Python generator use mpmath 130 digits and Decimal 34 half-even. The four old proposed-algorithm failures at cos 90°, sin 180°, sin 360° and cos 270° now return exact zero; nearby nonzero degree inputs retain independent 34-digit expected results. Radian/general evaluation follows the declared 50-digit library policy, not a universal correct-rounding claim.

Grade goldens are independently derived rational weighted sums, including 86 from 860/10 and unweighted cases, explicit custom boundary labels/missing inputs. Sleep goldens use independent Python datetime UTC differences for midnight, spring/fall offsets, equivalent instants and calendar boundaries. The local-only timestamp `2026-03-08T02:30` is rejected; an explicit offset denotes an instant and is not claimed valid for an unspecified named city.

Planetary fixtures: `src/calculators/verification/fixtures/draft-master-531-goldens.json` independently evaluate the source decimal GM and radius with Python Decimal 80. Source is NASA JEOD commit `b2f8a3913424b7a4ea2e59c604dda008c9dea6ed`, `models/environment/gravity/data/src/{earth,mars,jupiter,moon}_spherical.cc`; pinned URLs and full source SHA256 values are retained with fixtures. Direct NASA factsheet retrieval was blocked by network policy; these are explicitly NASA JEOD model constants, not claimed fresh factsheet measurements. Far-field limitations are retained in visible methodology. No unsupported planet dataset/default is fabricated. Additional bodies or actual surface/apparent-gravity claims require source/model review.

## Framework and validation

Private shared adapter: `src/calculators/final-framework/draft-four-contracts.ts` and `.test.tsx`. Reuses Final renderer, immutable versioned snapshots and JSON/CSV; exact scientific strings remain strings. All plans consume identical mathematical outputs. Methodology, source and DRAFT/model/policy disclosures stay visible. No route/discovery registry or persistence writer is added.

New tests 127; cumulative 400 tests across 20 files, including prior ten calculators and 15 certification guards, all pass. Typecheck and affected ESLint pass. One local `npm run build` passes with production `next build --webpack` unchanged. Next-generated tsconfig/next-env changes were discarded. No unrelated dependency upgrades; decimal.js 10.6.0 was promoted from existing transitive dev pin to explicit pinned runtime dependency. Automatic exact-head CI is recorded after the final push; no manual rerun requested.

Four new calculator definitions include two engine-reuse integrations. Total owner-authorized, locally validated unregistered DRAFT definitions: 14. Registry remains 574; zero certifications/publications/deployments added. All previously UNKNOWN external authority requests remain UNKNOWN.

## Remaining review and next batch

Review numerical policy/precision and configurable-grade boundaries, explicit-offset-only time scope, and NASA reference-model applicability before any registry or certification decision. Physical Android/TalkBack and measured viewport tests remain UNVERIFIED. Named IANA-zone inference and measured planetary surface gravity are not implemented. Mortgage/BMI and existing specialist/HOLD controls remain blocked. No production writes, migrations, payments, merges, deployments, certification or publication changes.
