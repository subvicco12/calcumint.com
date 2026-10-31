# AUTH-EXPIRY-BOUNDARY source evidence

Task, verbatim: “Add a bounded short-lifetime genuine fixture expiry/recovery campaign; preserve the explicitly characterized immediate post-logout JWT boundary.” Estimate in Batch16 queue: 2–4 engineering hours; this is an estimate, not elapsed work claimed.

The already retrieved official GoTrue v2.197.0 source under `/tmp/batch13-auth-source` was inspected locally; no source retrieval was repeated. Existing fixture provenance pins release target commit `4eee58f296d9698a1c2c0ae14d7a0b379c7622d3` and image digest `1736a63078f5922b198c4cbe50f80ab9a2d3b54fe8b7b6cfb2e9dc5dbbc12c6b`. The local extracted tree has no `.git`, so its commit cannot be independently re-derived from git metadata here.

* `internal/conf/configuration.go` lines 1140–1142 sets JWT.Exp to 3600 only when zero. GlobalConfiguration.Validate at 1335 has no JWT lifetime minimum validator. SHA-256: `b27faebba541f907b23d2ce2dcab8c4679b5ce49cf1fcee007778f1b53230773`.
* `internal/tokens/service.go` line 689 calculates expiration as issuedAt plus JWT.Exp seconds. SHA-256: `03f7185ad7055dee171b03aac2076203635409fcc314dc987f880626aefcd8e9`.

No server minimum lifetime rule was found in those pinned configuration/generation paths. The campaign requests 15 seconds and verifies genuine issued `exp - iat === 15`, rather than assuming a minimum, forging tokens, or changing clocks. Fixture option validation is a local test bound, not a claimed GoTrue minimum or production recommendation.

The first genuine execution rejected the test's initial assumption of PostgREST denial at exp+2: the server returned 200. That failed execution is retained separately under `/tmp/batch17-expiry-evidence/failure.json`; it is not represented as a pass. The final campaign polls the unchanged expired token until actual rejection within the same 120-second deadline and records every observed acceptance and the eventual expiry error. This measures the installed validator's boundary without inventing a clock-skew rule or changing its configuration.

Pinned official PostgREST v12.2.3 source was then inspected to explain that measured failure:

* [Auth.hs](https://github.com/PostgREST/postgrest/blob/v12.2.3/src/PostgREST/Auth.hs#L68) explicitly sets `JWT.allowedSkew 30`; line 74 maps `JWTExpired` to `JWT expired`. SHA-256 of fetched raw file: `16324a86daff603902daadd1a33cd0cc62a6e59bd1eac269d2379b5e8adb9dfd`.
* [Config.hs](https://github.com/PostgREST/postgrest/blob/v12.2.3/src/PostgREST/Config.hs#L276) defaults `jwt-cache-max-lifetime` to zero. The fixture does not override that setting. Config.hs SHA-256: `268e9035fb5731d79d00b2b32df245e3fe9ff806e63801aef40366dfea341b29`. Auth.hs cache expiry uses JWT exp where present.

The final test therefore requires explicit HTTP 401 / PGRST301 / `JWT expired` at or before exp+35 seconds: the source's 30-second validation skew plus a five-second scheduling/observation allowance. It does not accept an arbitrary eventual failure. Each post-expiry 200 and the final rejection timestamp are recorded. The entire observation campaign has a 120-second deadline, and no server clocks or validation policies change.
