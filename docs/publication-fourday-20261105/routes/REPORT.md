# Public route, discovery, and sitemap acceptance — 2026-11-05

**Release hold remains in place. Current public rendering and discovery acceptance are UNKNOWN.**

Current production export (`../production/catalog.json`, database observation `2026-11-05T16:55:11.60396+00:00`) contains 209 unique published engine rows, all version 1. Each current `(calculator_key, slug, version)` exactly matches the corresponding row in `docs/calculator-first/hosted-rows.json`. Prior category bindings provide 209 expected URLs in the existing `/calculators/{category}/{slug}` pattern; these are route candidates based on recorded bindings, not current live-page observations or approved canonical catalog identities.

## Current observations

| Check | Count | Result |
| --- | ---: | --- |
| Unique production engine route GET attempts | 209 | All transport UNKNOWN |
| Origin HTTP 200 / other origin HTTP responses | 0 / 0 | No origin response obtained |
| Calculator rendering/version/canonical URL verified now | 0 | 209 UNKNOWN |
| Sitemap GET | 1 | UNKNOWN |
| Public `/calculators` discovery GET | 1 | UNKNOWN |
| Canonical catalog identity approvals established | 0 | Outside the authority of a public GET |

Every direct request failed before reaching the origin: `URLError: <urlopen error Tunnel connection failed: 403 Forbidden>`. This is a workspace proxy CONNECT failure, **not an observed calcumint.com HTTP 403**, and does not establish that any route is down. `observations.json` captures all 211 requested URLs, current expected engine IDs/versions/titles, UTC attempt times, nullable HTTP status and the transport error. No response HTML was obtained, so displayed version, heading, canonical URL, input controls, sitemap membership and discovery links cannot be asserted.

The supported Firecrawl plugin was tried as a read-only fallback for the sitemap and directory, with `maxAge: 0`, raw HTML and links, and 15-second timeouts. Both requests were rejected before retrieval because the connected account and daily MCP allowance had insufficient credits (reported refresh `2026-11-05T19:07:35.431Z`). No retries, purchases, authentication, forms or interactions were performed. `fallback.json` records this limitation without account-specific billing links.

## Acceptance boundaries

The 209 exact current production engine identities are known from the read-only database export. Their **current public availability is unknown**, even though earlier snapshots reported public availability. The 540 canonical catalog identities are a different scope: no 209-to-540 canonical acceptance, A/B eligibility, or publication eligibility follows from this check. Even a future HTTP 200 requires actual server-rendered calculator content, calculation controls within `.calculator-ui` (excluding account/scenario controls), expected title and technical version, canonical URL and final URL to match; these are necessary server-rendered HTML surface evidence only. They do not verify browser functionality, calculation correctness, mobile behavior, canonical ID approval or publication authorization.

The reusable GET-only probe is `tests/publication-fourday/routes/probe.py`. It uses four workers, a 12-second request timeout, a 2MB response cap and same-origin HTTPS redirects only; it performs no production writes. It records response hashes and compact visible content evidence when responses are available, without persisting full pages. Run from the repository root after network access is available:

```sh
python tests/publication-fourday/routes/probe.py
```

Offline parser validation passed: `python -m unittest discover -s tests/publication-fourday/routes -p 'test_*.py'` (9 tests). They check visible technical version extraction, exclude navigation/account/scenario controls, reject static content plus navigation search as calculator rendering, and exercise CI timeout/failure/output validation. Parent validation pins the server-rendered evidence scope and control-count convention. No build or local browser fixtures were run.

The CI probe also targets the 17 recorded engine/version candidates from `docs/full-product-batch21/candidates-17.json` only when absent from current production tuples. These are separate from the 209 published engines and are not 17 approved canonical IDs (the recorded mapping contains 12 identity candidates and 52 associations). For these routes only, origin 404/410 records observed fail-closed visibility; HTTP 200 requires review and establishes no publication eligibility; transport failures remain UNKNOWN. Candidate counts and tuple/URL identities are validated separately. No new network observation was performed while adding this CI capture extension.
