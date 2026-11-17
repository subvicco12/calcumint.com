RPC task-update scheduling repair

Implementation commit: 1f03a1193b6c8b50fe33fd3a7fd6a2973f09cefe, based on Worker3 7ebdf0412619b8414e8c20b091f4fd9872c41f03. Only vitest.config.ts and tests/construction-ci-recovery-20261116/yield-task-updates.mjs change. Both files match coordinator PR head 1b0c1e12cf0de67f9ae238cfa618ed8eaeb3f126 exactly. The six execution-recovery test bodies also match Git blob 8bb490e90651b322e482e6f48f03d3031ff82035 exactly.

The hook awaits one setImmediate event-loop turn in beforeEach. Existing RPC60000, test/child deadlines, maxWorkers1, assertions and security controls remain unchanged. No runtime/current-source verdict is cached.

archived-e7-hosted-source.raw.log is the exact original hosted source-job receipt for run43836695478, with its onTaskUpdate error preserved. The extract is an indexed readable excerpt; provenance.json binds the original raw bytes. Coordinator report supplies the independent unchanged-six-case red and exact-hook green event-loop control; those timings are coordinator observations, not Worker3 measurements.

Root owns the new combined exact-head runtime selection. This worker deliberately did not repeat the six-case or source-wrapper suite. Worker3 runtime acceptance remains pending that receipt and source-guard admission. No qualification, publication, merge or production action is claimed. RELEASE HOLD ACTIVE.
