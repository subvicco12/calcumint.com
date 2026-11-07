# Bounded N1 caller convention correction

The incoming 2026-11-07 matrix records #430's missing thermochemical qualifier in methodology and #434's missing retained-code/SI-symbol distinction. #434 is Data Storage Converter; Force Converter is #438 and is unchanged.

Exact v1 callers now include existing scope plus the thermochemical calorie convention (1 cal = 4.184 J), or the retained KB code versus SI kB distinction. The current result methodology displays these explanations. Existing AccountActions wiring sends the same methodology to PDF options and new A/B/C captures. Focused tests exercise the actual converter component, PDF serializer and scenario capture payload.

No registered engines, factor tables, source/reviewer decision records, frequency presentation pins or historical snapshots were changed. Raw unit codes remain unchanged. Raw calculation CSV/history and batch JSON gain no fields. Existing saved histories are not retroactively annotated. Formal source adoption, canonical acceptance, competent review, certification and publication remain pending.

Verification: component RED demonstrated two missing disclosures (14 existing tests passed). Helper RED demonstrated the absent helper. Focused GREEN command: `./node_modules/.bin/vitest run src/lib/n1-publication-methodology.test.ts src/components/publication20-tool.test.tsx`. No full suite or build. Dependencies reused from `/workspace/work/batch13-deps/node_modules`.
