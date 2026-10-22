# PDF, accessibility and performance evidence — 2026-10-22

Status: bounded automated evidence only; RELEASE HOLD remains. No acceptance-ledger promotion, certification, production writes, migrations, merges, deployments, payments or publication occurred.

## Scope and provenance

Detached evidence worktree: `/workspace/pr1467-lanes/pdf-accessibility`, baseline `71261465c877eab27e48c70605dd5435d87eda77`. Only this document is changed. No application, workflow or test changes, dependency installation, network expansion or browser rerun was needed.

Reused artifacts: `/workspace/.pr1467/reference-browser/browser-downloads/**/*.pdf` and `reference-browser-report.json`. The JSON SHA-256 is `bf9aca7d6bb97e15a315efd3f69121d086e776a43b49028a1e6e9e4f13ac0acd`. Each PDF's SHA-256 and relative path is retained in the raw measurement JSON. The existing artifacts' generating commit is not recorded in that report; these are artifact-specific findings, not proof of a fresh baseline build. Source inspection of `scripts/test-final-reference-browser.mjs` shows actual calculator source with adapted Supabase browser transport and Next link, synthetic local reviewer, headless Chromium and 350 ms export-click pacing.

The reused report records 36/36 passing journeys across six calculators, Free/Pro/Business and 320/1280 viewport widths, zero issues and app errors, plus two passing keyed schedule/mobile/metadata/keyboard checks. It includes invalid-input announcements, field labels and keyboard traversal. Those are historical automated harness observations, not fresh deployed-site, real authentication, persistence, physical-device or assistive-technology acceptance.

## Fresh structural measurements

At `2026-10-22T16:43:02Z`, installed Python 3.12.14 / pypdf 6.10.0 strict parsing and Poppler pdfinfo 26.05.0 inspected all 48 PDFs. No new packages were installed. Results:

| Measurement | Result |
| --- | --- |
| Files / total pages / bytes | 48 / 1,592 / 20,428,540 |
| File-size range | 8,407–1,873,857 bytes |
| Page-count range | 1–128 |
| Poppler tagged recognition / logical structure parse | 48/48 / 48/48 |
| Checked structure inconsistencies | 0 |
| Explicit extracted `PDF/UA conformance: UNVERIFIED` disclaimer | 48/48 |
| Logical tables / header cells / data cells / figures | 80 / 320 / 960 / 64 |

Checks go beyond magic bytes and tag-name presence: strict object/xref parsing; structure-node parent references; per-page content-stream BDC MCID sequence against ParentTree slots; reciprocal MCR page/MCID ownership; table cell Headers references resolving to structure IDs; TH column scope; and nonempty Figure Alt. Poppler separately parsed and dumped the logical structure for every file. Text extraction succeeded. These checks do not exhaust every PDF semantic or accessibility requirement.

Observed font resources use standard Courier / Courier-Bold without FontDescriptor entries (3,184 page font-resource occurrences, not unique fonts). Embedded-font and Unicode mapping requirements were not established; this is an unresolved conformance concern. Language/role detail and per-file results are retained in the JSON. Alt presence and link consistency do not prove meaningful descriptions, correct reading order, complete data interpretation or usable screen-reader output. No veraPDF/PAC validation or human PDF/UA certification was performed.

## Performance boundaries

Sequential low-priority parsing, text extraction and Poppler subprocess measurements totaled 39,605.037 ms; individual file measurements ranged 69.985–3,054.129 ms. This is tool-processing elapsed time on a shared cloud worker, including subprocess startup and output writing. It is not export-generation latency, browser rendering latency, mobile performance, Core Web Vitals or a controlled benchmark. Larger reports reach 128 pages / 1.87 MB and warrant future export-time and reader-usability measurement. No valid LCP/INP/CLS, physical-device or export-generation timing artifact was identified in the reused report; no such performance acceptance is claimed.

## Reproduction and raw outputs

Raw evidence is outside the checkout at `/workspace/.pr1467/sprint/pdf-accessibility/`: `measure.py`, `pdf-measurements.json`, and 48 `*-structure.txt` Poppler dumps. Reproduce with:

```sh
nice -n 15 python /workspace/.pr1467/sprint/pdf-accessibility/measure.py
pdfinfo -struct /workspace/.pr1467/reference-browser/browser-downloads/bmi-calculator-pro-1280/bmi-calculator-v1.pdf
sha256sum /workspace/.pr1467/reference-browser/reference-browser-report.json
```

No P0 auth processes were stopped or changed. The governing “CalcuMint Final Product — Forty-Eight-Hour Completion Plan” was not located by matching its title in this baseline's `docs`; this does not establish that it is absent from other sources. Primary auth closure remains the priority.

## Governing sprint clarification

The owner subsequently confirmed that the governing plan is a ChatGPT-project source and supplied the H0–H48 milestones directly. Those supplied requirements govern; no further repository search is needed. Preserve all fourteen unpublished DRAFT calculators, mathematical contracts and historical versions. H0–12 prioritizes auth closure, H12–24 runtime/security and exact-head CI, H24–36 independent QA/ledger reconciliation and code freeze, and H36–48 final 6/6 CI/evidence freeze/development-candidate handoff. Escalate unexplained auth at H12 and produce a reproducible blocker at H18. RELEASE HOLD remains.
