# Day 5 engineering freeze

Single isolated accounting branch. Day 4 application parent `5ff9d515af3cf4187087452e0e07ad8e607e7690`. Existing PR #1538 stays at `49ea243b5be7e1ee9f3cd8af7f936ab784402cf7`. RELEASE HOLD ACTIVE. Central integration and production publication are NO-GO.

## Verified accounting

- 63 preserved refs were re-read from GitHub and every target resolved to a Git commit. The handoff pins retained receipts and 10 exact-ID evidence deltas. It contains no application-source changes. Comparing the cumulative parent against the frozen PR found no delta under the engine, shared factory registry, central CI and Supabase migration paths inspected.
- 540 canonical IDs. Historical implementation evidence partitions into 305 registered, 192 bounded private, and 43 contract-blocked. Complete canonical implementation and approved mappings remain unestablished for all 540.
- 55 IDs have exact private evidence deltas. The 11 new sprint adoptions are #162, #163, #179, #252, #254, #326, #330, #458, #474, #493 and #509. They are isolated and remain pending scoped qualification. #504/#505 retain the selected Worker 3 pointers; Worker 1's evidence is independent and does not add adoptions.
- 102 distinct identities have pinned native receipts with Free, Pro and Business coverage outside the retained 111 scoped baseline. Another 27 have retained worker-roster evidence only in this freeze. The 411 outside these two evidence buckets include the 111 scoped-qualified baseline and cases with other or unestablished evidence; the freeze does not equate them with missing code. Day 2 reference journeys and the duplicate food branch do not create new adoption counts.
- The frozen shared registry compiles 111 profiles. 91 overlap the 111 scoped-qualified roster; the remaining 20 scoped IDs are #368–387 with separate evidence. The two totals are not interchangeable. The compiled dependency fingerprint records 209 Git-bound local inputs. No cumulative private sprint workflow was integrated into PR #1538.
- The historical snapshot recorded 209 published engine tuples associated with 187 catalog candidates. The exact registry-identified candidate subset includes 168 distinct tuples marked certified in code, 122 draft and 37 reviewed. Of 151 distinct linked hosted metadata records retained in the reconciliation, the certification field is null. These code labels and historical route observations do not establish current canonical certification. Zero canonical publication eligibilities are established. Fresh authoritative certification and publication counts remain unverified. Zero new qualifications, certifications or publications.

The [projection](freeze-projection.json) is an evidence attachment, with exact registered candidates, scoped pointers, per-ID outstanding requirements and retained receipt links. It does not replace the 540-row ledger. The [Blueprint gap matrix](BLUEPRINT-GAPS.md) records the shared work and operational gates.

## Exact backlog and integration sequence

1. After explicit central integration authorization, start with the 11 exact sprint adoptions. Preserve predecessor source and packet tags. Verify canonical ID and candidate tuple, append version-bound source evidence and admit generic historical replay on a controlled integration head. Run targeted replay/tamper and source guards before affected browser/auth/exports.
2. Keep #247 and #248 historical engines intact. #247 misses a narrow positive integral and reports zero error; #248 returns zero for a continuous peak whose limit is one. Review existing successor remedies, bounded applicability and source/QA proof before authorizing any adoption. Continue the specific #55 deposit scope/source decision. The 36 authority-held identities with no retained implementation pointer still need an approved mapping or contract. The 132 ambiguous/shared entries and remaining unmatched/private entries are evidence-resolution queues.
3. Use the per-ID requirements in the projection for missing UI, analysis, persistence, export, precision and QA evidence. Unknown or partial statuses require exact inspection before assigning new engine work. Admit Business capabilities separately for the exact tuple, caller, role and workspace. Qualify limits, tenant isolation, revocation, idempotency, audit and rollback before changing any delivery allowlist.
4. Preserve all mandatory jobs and aggregate. Use existing bounded exact-head checks only when central execution is authorized. The retained source deadline and hosted compatibility issues are external to this evidence-only freeze. Runner and broker work remain deferred.
5. In parallel, obtain competent source/formula/precision/QA decisions and real operator attestations. Use the existing held RPC package; require production schema/grant/RLS match, writer freeze, tested backup/restore, custody, compatible deployment and authorized reversible adoption. Acquire separate certification and release authorization for an exact accepted batch, then verify route, discovery, sitemap and withdrawal.

### Authority hold list

#9, #19, #20, #23, #34, #48, #87, #92, #95, #97, #98, #112, #120–124, #128–132, #135–137, #173, #198, #199, #204, #404–410, #442, #485, #502, #522, #526, #527, #530.

### Estimate and release decision

Observed engineering delivery was 3, 1, 2 and 5 newly isolated-accepted profiles in four sprint checkpoints. For the first 11-profile integration batch, budget approximately 4–8 engineering days after authorization and access to the required evidence and hosted gate: 2–4 for identity/source/replay intake, 1–2 for affected authenticated/production-mode acceptance, and 1–2 for controlled full CI and demonstrated defects. This is a bounded engineering estimate, excluding external approvals and provider/operator lead time. The 43 authority decisions, unresolved mapping, and unknown independent QA workload prevent an evidence-backed full-catalog or first-publication deadline.

**Integration NO-GO. Publication NO-GO.** The isolated freeze can be retained and reviewed. No verified P0 application defect prevented the handoff. The reproducibility check now lives in this branch and reads pinned Git objects rather than temporary receipt scripts. No application acceptance campaign was rerun.

## Reproduce the freeze accounting

Use a local repository containing the commits in `retained-refs.tsv`. From repository root run:

```bash
python docs/sole-factory-freeze-20261119/reconcile.py --repository . --output-dir /tmp/calcumint-freeze-recheck
cmp docs/sole-factory-freeze-20261119/freeze-projection.json /tmp/calcumint-freeze-recheck/freeze-projection.json
```

The verifier checks the frozen ledger, retained receipt pins, tuple registry source fingerprints, roster conservation, distinct adoption IDs and selected food pointers. Current production metadata and fresh hosted CI are outside this rehearsal.
