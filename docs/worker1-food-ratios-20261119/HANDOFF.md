# Coffee and water-to-rice pilot

Baseline `f146b080dcbedb8fd6c515b89a35ff1605425c6b`. Before selection, the worker checked the remote worker branch listing and retained assignments, including the statistics and chemistry reservations. Neither food identity appeared in the visible reservations.

| Catalog ID | Exact registered draft | Calculation and units | Scope decisions pending |
| --- | --- | --- | --- |
| 504 Coffee Ratio Calculator | `food.coffee-ratio / coffee-ratio-calculator@1` | Divide water mass in grams by grams of water per gram of coffee. A positive ratio is required, including when water mass is zero. The result is coffee mass in grams. | Competent review of mass-only units, direction, six-decimal rounding and finite-output boundary. No density conversion or recommended brewing ratio is assumed. |
| 505 Water-to-Rice Ratio Calculator | `food.water-to-rice-ratio / water-to-rice-ratio-calculator@1` | Multiply rice amount by water per unit of rice. The user supplies both in the same measure. The ratio is a multiplier and zero is allowed in v1. | Competent review of same-measure applicability, permissive zero multiplier, six-decimal rounding and permitted measure descriptions. No recipe, cooking, density or food-safety recommendation is assumed. |

The master catalog supplies identities. The unchanged draft definitions supply the exact formulas, examples, input schemas and source label. Formal formula and external source applicability remain pending. The private route uses active platform-review access. Both calculators have independent owned history and scenario recovery, exact-version verifiers, local batch with row refusal and replay, and entitlement-gated JSON, CSV and PDF exports. Decimal text is retained in local source-bound artifacts. Existing account history and scenarios retain normalized v1 snapshots.

New capture rejects malformed, nonfinite, negative, lossy or subnormal numbers and delegates schema/range and result checks to the registered v1 functions. The historical verifier runs the original arithmetic separately and admits exact v1 records that fall outside new capture restrictions. Six-decimal rounding can legitimately produce zero from positive inputs. Both plans and identities share the same calculation path.

Focused tests cover independent arithmetic, the rounding tie, invalid denominators, overflow, replay tampering, version substitution, local batch correction, and valid historical subnormal recovery. The native harness uses a disposable PostgreSQL/GoTrue/PostgREST fixture, real SSR sign-in cookies, a production webpack build and mobile Chromium. It uses loopback transport with unchanged CSP and zero publication fixtures. The first native setup was blocked by the sandbox Docker socket restriction. The next run reached fixture initialization and rejected an invalid synthetic organization slug. The final run uses a valid slug.

Shared Business team writes, metered jobs, API/embed and webhooks require separately reviewed adoption. The pilot only queries current Business capability under existing authorization. Independent source, precision and QA determinations, central immutable-replay/source admission and mandatory integrated hosted CI are pending. Both entries remain unqualified. RELEASE HOLD remains active.

The final native run passed six mobile journeys and six export content readbacks. The retained receipt lists the checks, byte sizes and SHA-256 values. Targeted ESLint and the production webpack build, including TypeScript validation, passed.
