# Batch 04: supplied annual heat comparison

Baseline: `00d12203e71032b3efca10f548a85ada9333b67a`, verified against fetched PR1486 head. RELEASE HOLD remains active.

The mission authorizes selection and implementation of independently supportable requirements. Continue without an additional design approval stop, consistent with Batch03 PLAN. Do not repeat baseline QA or monitor completed CI40732512191.

## Contract and approach

Implement a separate immutable private v1 annual comparison for requirement488. Preserve all existing definitions and snapshot formats. Extending the original public calculator would require unresolved applicability and canonical mapping decisions; changing Batch03 profiles would violate preservation. A separate private module and closed replay format permit independently reviewable engineering.

ETL section1.4.1 supports SCOP=reference annual heat demand/annual heating electricity. Use only caller-supplied compatible annual space-heating heat demand, conventional existing efficiency (0<eta<=1), SCOP>0 and currency/kWh tariffs. Require explicit acknowledgement of matching delivered-heat boundaries and extra auxiliary electricity outside SCOP. Do not calculate SCOP from equipment or infer auxiliary inclusion. No cooling, hot water, hybrid sources, subsidies, tax, emissions, maintenance, tariff escalation or investment-return model. Source snapshot is not a normative version or applicability approval.

Energy: existing=Q/eta; heat-pump base=Q/SCOP; total=base+outside auxiliary. Costs multiply supplied tariffs. Savings may be negative. Simple payback=incremental installed cost/positive annual savings; zero cost gives0, nonpositive savings gives null with an explicit status. No monetary rounding: normalized rational string output. Bound decimal strings to12 integral/6 fractional digits and input object fields strictly.

## Tasks

- [x] Write tests for independent200/175 savings witnesses, losses, zero demand, zero-cost and nonpositive-savings payback, repeating fractions, efficiency bounds, missing acknowledgements, unsupported inputs and immutable replay tampering. Run RED.
- [x] Implement `annualHeatComparison` CalculatorDefinition and `exportAnnualHeatComparison`/`importAnnualHeatComparison`, source record/binding. Run GREEN and focused existing rational/profile/workflow regression tests.
- [x] Verify source hashes, all baseline tracked files unchanged, typecheck and focused lint. Review diff; commit verified changes; push separate branch and open draft PR based on PR1486 branch. Check new CI once, at most one further check; report pending rather than wait indefinitely.

## Review focus

Prevent auxiliary double counting; reject eta>1 (existing heat pumps need another contract); preserve negative savings; do not invent payback for zero/negative savings; reject source/version/output tampering and unknown fields. Same engine for all review plans. No public registration, lifecycle or production writes.
