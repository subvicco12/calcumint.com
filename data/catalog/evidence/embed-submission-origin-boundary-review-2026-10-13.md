# Embed submission origin boundary — review and hold

Date: 2026-10-13
Scope: draft PR #1392, Business custom-calculator embed events and leads. This is separate from the standard calculator publication manifest and Slope v2.

## Verified behavior

The iframe page authorizes requests using `isEmbedRequestAllowed(allowed_domains, allow_direct, referer, sec-fetch-dest)`. The browser-side iframe then POSTs to `/api/embed/[key]/events` and `/api/embed/[key]/leads` from the CalcuMint origin. The POST request referrer therefore need not equal the original external embedding page's domain. Reusing the page-navigation origin check directly on the POST request risks rejecting legitimate traffic. An attempted change was reverted; no new origin rule is asserted as effective.

Both POST endpoints now require an active embed configuration and a published custom calculator in the configured organization with a nonempty published version before writes. Leads also require lead capture enabled and schema-valid `consented: true`. These checks do not prove consent authenticity, calculation integrity or protection against automated submissions.

## Remaining risk and required tests

- A public embed key is not authentication. Add a reviewed, bounded, signed embed-session token tied to config ID, calculator ID, published version and expiration (and, if reliable, approved parent origin), minted only after page authorization. Do not trust caller-supplied `sourceUrl` or `referrer` as proof of origin.
- Ensure legitimate cross-origin iframe POSTs continue to work and direct navigation remains governed by `allow_direct`.
- Add behavioral route tests with mocked database clients for inactive config, unpublished calculator, cross-organization calculator, missing version, disabled lead capture, malformed submission and DB failure.
- Add request size/rate protections and treat client-provided input/output as unverified. Consider server-side deterministic recomputation for authoritative result claims.
- Audit persistence of consent records: lead insert currently precedes separate consent/event inserts; failures are not transactionally coupled.

## Release decision

**HOLD** additional origin/telemetry/lead-security certification until a safe session contract and behavioral tests are implemented. No production DB, publication, merge or deployment authorization is implied by this review.
