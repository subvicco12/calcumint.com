# Five calculator interface and retained PDF observations

Source checkout: `a2bebecdd8a015a93752b7280619d117168f66e3`. Tests introduce no application changes. The browser uses actual `CalculatorInteractive`, existing private loopback preview, read-only `window.__first20Snapshot`, and explicitly SYNTHETIC Free/Pro/Business transport. It does not establish genuine authentication, production latency qualification, canonical acceptance, PDF/UA conformance, or human screen reader usability.

`browser.json` records 15 independent five-identity × three-plan observations. Trusted keyboard input changes the main editable field, and a requestAnimationFrame observer records elapsed time from the actual input event until both the actual `.result-box strong` DOM text changes and the read-only caller snapshot carries the expected result. Protocol dispatch-to-DOM time is recorded separately. These are single observations, without an invented SLA or statistical performance claim. Results: #370 80→160, #371/#372 10→20, #373 100→200, #386 1336→1340 (DOM thousands separators preserved). Event-to-DOM observations ranged from 7.0 to 26.7 ms in this run.

All 15 journeys passed trusted blank/backspace error and keyboard insertion recovery, focus retention, persistent original label, aria-invalid/aria-describedby binding, actual Chromium AX spinbutton name, semantic table names and scoped headings, and SVG names/descriptions with complete relationship table alternatives. Actual field keyboard focus was visible with a 3px solid outline. Result text computed contrast is 15.17:1 against its actual ancestor background. This is a scoped result-text contrast check, not a full page contrast audit.

All 45 viewport observations passed against configured width, not a potentially expanded layout viewport: innerWidth and document scrollWidth stayed within configured 320/820/1280 plus 1 CSS px; the actual fixture meta viewport was retained; no out-of-bounds calculator descendants were found. Reduced-motion media matched. Running transitions observed immediately during style updates had the existing reduced duration of 0.01ms; other snapshots had no running calculator animations. No assertion requires animations to vanish synchronously.

`pdf.json` reuses the exact ten retained Pro/Business native history PDF downloads listed in the original `authenticated/verification.json`; it creates no downloads and reruns no old journey. Actual bytes match original receipt SHA-256s. Every PDF contains Document/H1/H2/P structure, valid per-page contiguous MCIDs, ParentTree ownership and logical element backlinks, balanced marked content, ToUnicode, language and document title. The ten historical record exports contain no Table/TH/TD/Scope/Headers structures: those are explicitly recorded absent rather than claimed from serializer unit fixtures. Their raw inputs/results are paragraph content, and no formal PDF/UA table requirement is invented. `pdftotext` verifies the existing v1 raw result values (80,10,10,100,1336), stores full extracted text and its hash. Negative tampering of ParentTree and MCID content is rejected by this audit.

The retained blueprint (`docs/full-six/input/blueprint-full.txt`) supplies the applicable source clauses: P479 “Keyboard, labels, semantic tables, chart alternatives and contrast”; P544–P552 require keyboard operation, persistent labels/accessibly bound errors, semantic tables, chart textual alternatives, no horizontal mobile page scrolling, core result placement, fast input-to-result and reduced-motion behavior. These are the source accessibility/performance clauses associated with BP0454/BP0515–0523 in the governing reconciliation, not a newly imposed PDF/UA mandate. This evidence narrows those checks to the actual five interfaces and retained exports; it does not promote general production scale acceptability.

Reproduce from repository root with the shared dependency cache linked:

```sh
QA_SOURCE_COMMIT=$(git rev-parse HEAD) node tests/five-interface-qa-20261109/browser.mjs
node tests/five-interface-qa-20261109/pdf.mjs
```

Browser and subprocess commands require the supported network-enabled execution permission in this managed environment. No headers or tokens are written to receipts.
