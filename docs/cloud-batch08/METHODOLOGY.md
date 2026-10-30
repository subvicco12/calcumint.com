# Batch 08 private contract boundaries

These 25 profiles are complete only within their stated private mathematical scopes. They are not canonical calculator acceptance, approved ID aliases, specialist approval or lifecycle authority. Every profile remains DRAFT and unregistered in the public calculator registry. RELEASE HOLD applies.

The saved 76-case plan is reused as historical planning evidence. Its pending CI observation has been superseded by the user's terminal SUCCESS receipt for run40918367925 at baseline5a6f2311bde292ac0c3799c01eb3bb316522f426; no baseline CI poll was repeated.

## Loans, debt and affordability

IDs3,5,6,7,8,22,27,29 expose the existing fixed monthly amortization engine. IDs4,11,28 expose the fixed-payment payoff engine. IDs12,30,104,105 expose supplied-target DTI affordability; ID13 exposes the supplied debt/income ratio. IDs14,15,16 fix the selected generic payoff strategy; ID17 compares both strategies with exactly the same supplied budget. IDs24,33 expose the existing refinance comparison and simple payment break-even. ID31 uses the supplied price and down-payment percentage.

The formula text in each profile records exact timing, source scope and original numerical behavior. Nominal annual interest is divided by12; payments follow monthly interest. Amortization rows round to2 decimals while balances evolve unrounded, with0.005 closure tolerance. Schedule totals sum displayed rounded rows; they are not a new contractual cent-ledger policy. Payoff/debt totals retain their original rounding. Horizons remain1200 schedule/debt months and2400 fixed-payment payoff months. Final payments are capped at amount due. Inputs below0.01 principal/balance are excluded to avoid silently skipping positive subclosure balances. Rates that round the inherited annuity denominator to zero or one are rejected. Zero-displayed-payment and incomplete schedules are also rejected; they cannot represent complete positive-principal amortization in the inherited numerical contract. There is no new stable-arithmetic version silently substituted for the historic engine.

Affordability uses a caller-supplied DTI target, monthly gross income, debt inclusion, down payment and rate/term. It makes no lending-approval claim. Debt strategies use caller-supplied fixed original minimums and a constant monthly budget; no issuer minimum formula is inferred. Nonamortizing, horizon-exceeding or nondecreasing aggregate debt plans fail closed. Refinance cashflow break-even is distinct from lifetime savings and can exceed a loan term; no positive monthly savings produces null. No subsidies, grace periods, fees, tax, insurance, escrow, statutory or lender rules are invented.

ID25 stays COMPONENT_ONLY: a months-target helper does not establish calendar dates, payment-date conventions or day-count rules. Personal/student/auto/home-equity labels do not broaden the generic supplied fixed-rate scope.

## Conversions

ID426 supports nonnegative mass in kg,g,lb,oz through the original SI factors and12-decimal result rounding. It does not convert force. ID506 supports named US customary/metric kitchen volume units with the original explicitly approximate milliliter factors. It does not substitute exact rational equivalencies, regional cup sizes or ingredient density. The factors and exclusions are included in exports.

## Contract and replay

All inputs are closed strict named schemas. Monetary/quantity magnitudes are bounded at1e12, rates0..1000%, integral terms1..1200; other explicit domain rules are defined in the pinned source schema. Currency is a caller-supplied common unit label, with no foreign exchange. Complete closed output schemas retain every named original result, schedule/comparison, units and actual immutable dependency run; they are serialized in the540-row manifest.

Exports deep-copy and freeze the entire envelope, including input, output, methodology, source metadata and dependency identities. Import recomputes the selected version1 private profile and compares the complete JSON envelope. This detects altered selected identity, input, output, methodology and dependency version; it is deterministic replay integrity, not a digital signature or authentication of who supplied the original inputs. A fully edited and correctly recomputed scenario is a different valid scenario.

All three plan selections call the same engine and generate identical mathematical/export data. The private authenticated loopback fixture provides all540 identity discovery,25 runnable profiles, tab-local20-snapshot history, scenario restoration and JSON downloads. It does not prove account persistence, payment-provider or subscription authorization. Existing private workflows and publication controls remain intact.
