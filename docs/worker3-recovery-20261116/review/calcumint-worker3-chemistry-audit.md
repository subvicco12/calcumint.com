# Worker3 chemistry recovery audit

All11 remain IMPLEMENTED_NOT_QUALIFIED. Scoped mathematics and applicable publisher evidence support conditional reuse; delivery metadata gaps and mandatory shared CI failures remain explicit.

Code `1e0ba5baa2a437e44b625b15ac66f9a4f264df54`; evidence `4a895fcba82c719c21749d0efcfa5f8f1bad26a6`. Read only; no tests rerun. Publisher captures: 17/17 hashes match. Business fingerprints: 124/124 match.

Current parent baseline81/potential101; historical receipt baseline80 is retained as historical context, not adopted as current count. All11 and full20 remain IMPLEMENTED_NOT_QUALIFIED.

## Per-ID matrix

|ID|Identity v1|Formula/unit|Applicable scope and source audit|Decision|
|---|---|---|---|---|
|329|chemistry.molality|n/m_solvent / mol/kg|Solvent mass, not solution mass. OpenStax 11.4 lines 790–828 defines molality and 35.8 mol/2 kg=17.9 worked example.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|333|chemistry.ph|-log10(H/1 mol L^-1) / dimensionless|Concentration approximation; dilution/activity validity belongs to caller; broad numeric interval is not a claim all concentrations are physically dilute. No neutrality classification or 0–14 clamp. OpenStax 14.2 defines hydronium concentration pH; 11.4 line1265 supports dilute concentration/activity approximation.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|334|chemistry.ideal-gas-law|n*0.082057366080960*T/V / atm|Absolute atm/K, ideal gas; zero amount vacuum limit. Rounded R intentionally immutable. OpenStax 9.2 ideal gas plus NIST SI R and atm conversion support units; native R is rounded, not exact source value.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|335|chemistry.gas-density|P*M/(0.082057366080960*T) / g/L|Absolute pressure, positive molar mass; P=0 vacuum limit. OpenStax 9.3 derives gas density d=PM/RT; NIST supports constants/units.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|336|chemistry.percent-composition|100*componentMass/totalMass / %|Total includes component; both g; no volume-percent interpretation. OpenStax 3.4 mass percent and 3.2 generic composition apply.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|337|chemistry.solution-concentration|soluteMassGrams/solutionVolumeLiters / g/L|Final total solution volume, not solvent volume. g/L, not molarity or percent. OpenStax 3.4 mass-volume percent supplies same ratio; conversion q grams/100mL =>10q g/L is a dimensional derivation, not direct claim publisher uses g/L.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|338|chemistry.stoichiometry|knownMoles*targetCoefficient/knownCoefficient / mol|Caller supplies same balanced reaction; fractional common rescaling allowed; no balancing/limiting-reactant/yield solution. OpenStax 4.3 balanced coefficient mole ratios apply.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|339|chemistry.half-life|initialAmount*0.5**(elapsedTime/halfLife) / same as initial amount|Closed first-order process and constant half-life; matched time units. Initial zero allowed even if decay underflows; positive amount refuses underflow. OpenStax 12.4 first-order integration and constant half-life apply; binary64 policy is engineering, not physical law.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|340|chemistry.nernst-equation|E0-(8.31446261815324*T/(n*96485.33212))*ln(Q) / V|Dimensionless activity quotient and E0 at supplied T for same balanced reaction; no activity/E0 temperature correction. Cancellation near E=0 has no relative-error guarantee. OpenStax17.4 Nernst;13.2 relative dimensionless Q; IUPAC activity; NIST constants support applicability, displayed ellipses do not establish all fixed engine digits; F is truncated.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|341|chemistry.beer-lambert-law|molarAbsorptivity*pathLength*concentration / dimensionless|Decadic A; epsilon L/(mol cm), path cm, concentration mol/L; monochromatic homogeneous linear regime; zeros mathematical limits. IUPAC B00626 explicitly defines law and units; no irrelevant OpenStax6.1 claim.|Scoped functional ready conditional CI; delivery metadata gaps remain.|
|342|chemistry.titration|Ct*Vt*nu_a/(Va*nu_t) / mol/L|Exact equivalence; matched volume units; balanced reaction/quantitative selectivity caller supplied. Zero concentration/volume are mathematical limits. No endpoint/blank/dilution correction. OpenStax4.5 titration analysis with4.3 balanced mole ratios applies.|Scoped functional ready conditional CI; delivery metadata gaps remain.|

## Complete shared contract binding

**capture.** All raw fields must be complete decimal strings; exact input key set; finite binary64 |x|<=1e50, nonzero |x|>=1e-50. Original engine schemas also apply. All structured output is copied; nonfinite/exotic recursive data refused. Primary nonzero result must be normal (>=2^-1022); zero permitted. This is a bounded floating-point model, not formal accuracy certification.

**engineAndFullOutput.** catalog-batch-1.ts immutable v1 produces {value,steps:[label + " = " + value]}; entire output retained by createCalculationSnapshot. Per-lane independent golden and complete-output checks; all11 share same engine file fingerprint.

**history.** verifyHistorical exact four-key snapshot, exact slug/version, exact input schema/key set and complete output equality against immutable engine. Deliberately bypasses capture-only bounds/chemistry guards; successful replay proves historical forward agreement, not physically admissible new capture.

**finalUI.** Factory portal routes to FinalResultPresentation for primary value/unit, model scope, private warnings and contract source refs. NextEngineeringAnalysis separately renders every output field including steps verbatim in table. Chemistry contracts have one numeric output so no omitted numeric metric. UI evidence is shared component coverage plus329 target restore, not11 independent browser runs.

**scenarios.** createFactoryWorkflows.scenario uses verified complete packets, A/B/C slots/notes through captureScenario; Pro/Business gated locally. Stored history uses registered snapshot verifier; changed input, output, identity/sourceVersion refused. Local plan parameter is affordance, server authorization separate.

**graphAndTargets.** 1–25 explicitly supplied candidates of one numeric field with others fixed; invalid candidates remain error rows/gaps, discrete points never connected. Exact target uses JS numeric equality of binary64 forward outputs, not analytic inverse, tolerance or completeness/uniqueness proof. No match means no supplied witness. Pro/Business target UI; Free same forward math.

**JSON.** Verified replay packet retains schemaVersion, exact catalog/engine/slug/version/sourceVersion identity, raw decimal text, complete parsed input and output. Reimport reproduces current bounded capture, separate from broad historical snapshot path. Scope/field-unit/publisher metadata resolved from code, not embedded in artifact.

**CSV.** Verified identity/raw/input + complete output including steps serialized by serializeCalculationCsv. Presentation artifact, not JSON replay. No bound display labels/unit metadata/model scope/publisher evidence is added.

**PDF.** factoryDownload verifies packet and passes title, private identity/sourceRevision methodology, raw text table to serializeCalculationPdf; serializer includes all input/output leaves. No displayMetadata, scoped model description, formulas or sources passed. Thus result value and field values lack explicit unit bindings and publisher provenance in standalone PDF; PDF/UA explicitly unverified.

**nativeEmbed.** Exact delivery tuple/registered engine/version enforced; exact text fields; returns full output + packet and result unit. Returns limitations=contract.scope. Concrete provenance omission: sources is immutable definition.sources (generic deterministic-engine label), not contract.sourceEvidence; native response does not carry publisher citations.

**nativeBatch.** Exact supported tuple v1,1–100 rows,decimal strings; per-row full output+packet or refusal, replay verifier compares entire rows. Shared durable auth/quota/outbox route evidence remains reused; direct unit integration is not hosted deployment proof.

**Business.** Genuine disposable GoTrue/PostgREST/PostgreSQL fixture: all20 exact captures persisted/recovered, exact retries/conflicts and9 malformed refusals per chemistry ID, membership/account/project negatives, original8 sharing branches, publication denial, ACL/RLS guards. 124 integrated source hashes checked for reuse. Held69->89 SQL/reverse inactive; production equivalence UNKNOWN.

## Evidence and gaps

Reused frozen-source focused receipt:8 files292 tests; chemistry-a62,chemistry-b27. Reused affected regression:21 files482 tests. Business integrated receipt passed with all11 per-ID retry/storage observations and9 malformed refusals each; all124 current dependencies match. Publisher captures17/17 exact hashes match. JSON contains full per-ID identity, engine/ledger/source bindings, immutable Business cases, all numerical policies and fingerprints.

No candidate formula, source-applicability, full-output loss or history-domain regression demonstrated. The report/native source metadata omissions above are directly visible implementation gaps if full self-contained scoped delivery is required; they are not caused by timing failures and passing byte-length export checks do not resolve them. JSON and CSV/PDF deliberately remain different fidelity artifacts.

Shared failures remain: local API source5220ms and UI/PDF source5164ms exceed5000ms; hosted API6707/UI6231 exceed5000ms; source-acceptance20-minute cancellation, historical guard join expected1f4b9885/actual174c42d1, publication-factory failure and validate failure. These are shared qualification blockers, not evidence of chemistry source or mathematical defects. Hosted build/checks/full-product passed. No qualification is granted.

No tracked edit, suite rerun, active SQL, production, PR1538, count, ledger, certification or publication change.

## Confirmed delivery behavior witness and minimal repair

A lightweight vite-node read-only script executed all11 default captures and exports/native deliveries in2.5s; no suite rerun. Witness: `/tmp/calcumint-worker3-chemistry-delivery-witness.json`. ID329 returns0.5 from1mol/2kg; UI has scope; JSON/CSV/PDF contain no full model scope or publisher evidence; embed has scope and result unit but sources only generic engine attribution; batch lacks scope/publisher/field-unit metadata. Scope/units are not supplied elsewhere in packet input/output. PDF raw byte substring tests alone cannot prove extracted text due to encoding; exact call options prove omitted metadata.

Minimal repair: derive an exact compiled FactoryScopedMetadata interface with identity/sourceRevision,scope,primaryKey/outputUnit,input field units,publisher refs,limitations. Attach to native embed/batch responses; add PDF scope/sources/displayMetadata in completion/exports.ts; add JSON/CSV scoped report metadata using an explicit versioned envelope or separate report metadata contract, preserving immutable snapshots and exact replay semantics. Native embed should retain immutable engine attribution and add applicable contract source refs. Batch verifier must recompute metadata consistently. Do not edit immutable chemistry math or weaken qualification gates.
