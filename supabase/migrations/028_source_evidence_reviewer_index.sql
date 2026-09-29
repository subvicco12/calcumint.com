-- Index the reviewer foreign key used by calculator source-evidence governance.
-- This addresses the production database advisor's unindexed FK finding without changing RLS or lifecycle semantics.

create index if not exists calculator_source_evidence_reviewed_by_idx
  on public.calculator_source_evidence(reviewed_by);
