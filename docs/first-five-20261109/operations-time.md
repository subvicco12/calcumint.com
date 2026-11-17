# Strict operator observation calendar syntax

Baseline 756d3a7e1debc0f8b046b3564da96ddc10699656. The existing operator checker accepted an impossible February30 because Date.parse normalized it into March2. A new focused test first failed with Missing expected rejection; the source fix now checks the parsed UTC whole-second calendar against the original literal. Invalid calendar rollover is rejected rather than normalized.

The new sixth test covers February30, nonleap February29 including2100, April31,24:00 and leap-second syntax refusal. Genuine leap days including2000 and submillisecond fractional UTC strings remain accepted without mutating supplied strings. All six focused tests pass; prior five remain unchanged. No inspected timestamp becomes an authenticated or fresh observation, and complete packets still cannot grant adoption or execution authority.

Command: node tests/execution-recovery-20261109/cohort22-attestation.test.mjs

Raw local red log: /tmp/first-five-operations-time-red.log, exit1, SHA256 9c03b1ecd5ef4a2ebeae336580d3224b3dffbcc52d9dc3fc6fb58c2e81c41129.

Raw local green log: /tmp/first-five-operations-time-green.log, exit0,6passed, SHA256 c3dacda282b35e4baa126083203b4ea9e2393b69db632e2f146f46760660bd58.

These raw logs are local workspace artifacts, not claimed permanent hosted evidence. Historical receipts and reviewed source constant remain unchanged. Root owns any current bridge test-count successor. No build, Docker, production query, SQL, appointment, custody attestation or release action occurred.
