# Source-bound writer and dependency audit

Scope: candidate source at PR1529 `3adaaf89ad24331a2175d9d137dfcd8f3ced1da8`, plus this successor's unchanged admin sources, and authenticated read-only metadata observed 2026-11-06. All SQL is read-only; aggregate observations contain no customer history or private source-review text.

| Participating path | Verified candidate behavior | Remaining condition |
| --- | --- | --- |
| Admin create action | Platform JWT/role checks; audited creation RPC035, risk/version fields | RPC absent in predecessor; guarded adoption required |
| Admin source evidence action | Direct INSERT, server role checks, attribution/count/certification triggers | UUID binding does not prove exact source revision orchestration |
| QA / reviewer / lifecycle actions | RPC032 /033 /034 with active role and audit semantics | Adopted definitions absent in predecessor; no certification authorization |
| Bulk inventory preparation | Owner/admin RPC, protected DRAFT and pending QA | Held package; no inventory activation |
| Schedule action | Direct publish_at UPDATE then separate review-event INSERT | Two operations are not a single atomic audit; external behavior remains gated |
| Authenticated Refresh alerts action | Calls refresh_admin_review_alerts | Hosted ACL denies authenticated; do not blindly grant a service-oriented RPC |
| Internal publisher route | ADMIN_WORKER_SECRET bearer, service-role client, refresh + direct publication/alerts | Actual deployment SHA, secret configuration and scheduler identity UNKNOWN; no exact-version compare-and-swap claim |
| Bootstrap-owner script | Explicit --apply service-role role INSERT | External operators/keyholders UNKNOWN; script not executed |
| Direct PostgREST / DB roles | Captured table/column/function/schema grants, RLS and FK paths | Keyholders, all external SQL clients and future DDL not identified |
| Provider hooks | Six enabled event triggers captured, including PostgREST DDL/drop watches | Provider orchestration remains external; no disabling proposed |

`functionReferenceCandidates` is a lexical body-reference inventory, not a proof of absence of dynamic SQL/external writers. The effective grants reveal TRUNCATE and TRIGGER for anon/authenticated on all seven tables. RLS does not constrain TRUNCATE. Isolated captured-shaped PostgreSQL acceptance demonstrates direct SET ROLE TRUNCATE of synthetic admin_alerts despite denied/filtered SELECT and verifies rollback restoration. An isolated narrow revoke prevents that command while retaining DML grants; this is compatibility evidence, not an approved production privilege bundle or a claim that PostgREST exposes TRUNCATE. Provider-managed privileges remain unchanged.

Candidate account workflows depend on exact RPC signatures `save_calculation_history_atomic(uuid,text,integer,jsonb,jsonb,uuid)` and `save_project_scenario_atomic(uuid,uuid,uuid,text,uuid)`. Both are confirmed absent. Their existing tables `calculation_history`, `calculation_projects` and `saved_scenarios` are present. An initial query used the wrong scenario-table name; independent review caught it, the corrected authenticated query and assessment supersede that inference. No absent scenario-table claim remains. The isolated repository-model tests do not resolve hosted schema adoption.

The scoped metadata hash still matches the original package; source hashes, RLS and guarded apply/reverse SQL are preserved. The sidecar refresh dependency, client SQL privilege risk, missing history RPCs and operator quiescence remain separate blockers. No global writer/capacity/integrity guarantee is asserted. The observed application_name `PostgREST 14.5` is a runtime label, not authenticated publisher-version provenance; isolated tests pin 12.2.3 and do not claim runtime parity.
