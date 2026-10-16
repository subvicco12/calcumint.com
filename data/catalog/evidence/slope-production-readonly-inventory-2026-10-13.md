# Slope production inventory evidence — 2026-10-13

**Evidence source:** Owner-provided screenshots of a separate ChatGPT conversation's Supabase read-only SQL inventory for project `zpwpstsvztyshcnwdfye`. Counts below are transcribed from the screenshots; SQL statements and complete machine-readable results were not provided here, and this conversation's Supabase connection remains inaccessible. **Not an independently rerun database audit.**

## Reported aggregate findings

| Public table | Reported rows |
| --- | ---: |
| calculator_catalog_admin | 209 |
| calculator_qa_checks | 3,135 |
| calculator_review_events | 3 |
| calculator_source_evidence | 210 |
| calculation_history | 1 |
| saved_scenarios | 0 |
| shared_calculations | 0 |
| custom_calculators | 0 |
| custom_calculator_versions | 0 |
| custom_calculator_runs | 0 |
| batch_calculation_jobs | 0 |
| calculation_projects | 0 |

The 209 catalog records were reported as lifecycle `published`, version 1. The one history record was `percentage-change-calculator`, version 1. The inspected stores contained zero `slope-calculator` history, saved scenarios, or shared calculations; no slope-named catalog slug or key was found. No dedicated snapshot-named table was identified in the inspected schema. The reporting conversation stated its operations were read-only SELECT/metadata queries with no changes.

## Interpretation and limits

- **Observed current database exposure is low** for a Slope saved-record migration in the inspected stores, but this is not proof of zero browser storage, API clients, exports, external systems or future writes.
- **Keep historical compatibility:** active launch Slope remains `slope-calculator` v1 with `rise/run` and `{result}`; inactive approved Geometry coordinate Slope currently also has version 1. Snapshot identity by slug/version creates a collision on an unreviewed switch.
- **Proposed future contract:** reserve coordinate version 2 and explicit fail-closed `(slug,version)` dispatch; preserve original v1 payloads. Runtime adapter integration and version allocation require explicit review/approval.
- **Publication discrepancy:** no slope-named row in authoritative catalog even though a launch Slope definition exists in repository code. Investigate manifest/route lifecycle and identity mapping without assuming it is publicly available.
- Catalog `published` rows do not establish that every entry passed certification or is publicly routable. No publication or certification decision is inferred.
- Exact SQL text, transaction snapshot, query time, account-level coverage and full column inventory were not supplied. For stronger audit evidence, preserve sanitized query text and aggregate results from the connected conversation.

**Disposition: HOLD.** No production mutation, registry activation, merge, certification or publication authorized.
