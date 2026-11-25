# Private Gregorian calendar workflows

Baseline 49ea243b5be7e1ee9f3cd8af7f936ab784402cf7. The 540-row reconciliation records the selected IDs as registered implementations. The retained milestone overlay marks each as not newly assessed. Subsequent four-worker, Worker 3, construction and statistics additions do not include them. Worker refs were inspected before editing. The visible Worker 2 scope is statistics #296–299, and Worker 3's retained handoff covers statistics and chemistry. The isolated Worker 1 statistics, construction and physics branches use different identities and namespaces. No separate undeclared assignment was inferred.

| ID | Immutable v1 engine | Bounded contract |
|---|---|---|
|443|date-time.age|Calendar years, months and days at an explicit as-of date|
|444|date-time.date-difference|Signed elapsed date boundaries|
|445|date-time.date-add-subtract|Signed integer offsets with month-end clamping, then day addition|
|446|date-time.day-counter|Signed elapsed days, including zero|
|451|date-time.day-of-week|Gregorian weekday name and Sunday-zero index|
|452|date-time.week-number|ISO week number and ISO week-year|
|455|date-time.90-day|90 elapsed calendar days after day zero|
|456|date-time.30-day|30 elapsed calendar days after day zero|
|457|date-time.60-day|60 elapsed calendar days after day zero|

New private Final profiles preserve literal YYYY-MM-DD inputs, safe integer offset parsing, string results and compound secondary results. They use owned history and scenarios, exact immutable snapshot verification, entitlement-gated JSON/CSV/PDF and local batch recovery. Blank and malformed dates, invalid leap dates, unsupported integer tokens, unsafe offsets and four-digit overflow are refused by the capture stack. The v1 engines and stored numerical/date behavior are preserved.

The embedded ISO reference supports date representation and the ISO week convention. The repository's calendar arithmetic choices still require competent scope and source adjudication, including proleptic years, age anniversary clamping, signed versus inclusive elapsed days, and fixed offsets from day zero. The existing private workflow does not grant shared Business delivery. All nine remain unqualified pending review, integration and mandatory hosted CI.

RELEASE HOLD ACTIVE.

## Evidence

30 focused tests and lint passed. The initial UI run had nine failures from a copied assertion for physics wording. Its corrected calendar provenance assertion passed for every target. The focused UI used jsdom and account composition used mocks. Separate production webpack and build-time TypeScript passed. Real mobile Chromium used disposable GoTrue cookies and PostgreSQL/PostgREST. All 27 Free/Pro/Business journeys and 27 Pro JSON/CSV/PDF readbacks passed. Readback bytes matched the receipt. Owned history, entitled scenarios, mobile width, accessibility tree labels, keyboard recovery, foreign-account RLS, unauthorized private-route denial and same-cookie membership revocation passed. The runtime exception inventory was empty.
