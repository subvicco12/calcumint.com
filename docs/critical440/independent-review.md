# Independent review

Reviewer: separate critical440_independent_review agent; current uncommitted successor against PR1529 3adaaf89ad24331a2175d9d137dfcd8f3ced1da8.

Reviewed shared batch/replay/UI, exact historical caller lineage repair, isolated auth scope and passive audit assessment. Initial batch20 tests passed in review. One important audit error was found: a follow-up query used project_scenarios rather than actual saved_scenarios/calculation_projects. A new authenticated read-only query established both real relations present; the query, observation, assessment and tests were corrected. Only the two exact RPC dependencies remain missing. Reviewer confirmed the correction and found no remaining important defects.

The additional captured-shaped privilege witness was reviewed, not rerun by the reviewer: direct SQL role TRUNCATE bypasses SELECT/RLS, rollback restores synthetic row, isolated narrow revoke denies TRUNCATE while preserving DML grants. No PostgREST-exposure or production compatibility claim is made. Reviewer confirmed explicit DDL/writer/activation limitations.

Review is software review only, not competent mathematical QA, source applicability approval, certification or publication authorization. RELEASE HOLD remains active.

Final review independently reran all17 lineage/adoption/passive-preflight tests and the cohort checker. The two new dependency bindings preserve all original engine/parser and release restrictions. Existing five CI jobs retain their guards and receive scoped batch/auth/privilege receipts; no activation step was added.
