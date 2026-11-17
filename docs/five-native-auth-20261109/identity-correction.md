# Canonical identity correction

The original broad `base64-*` sanitizer incorrectly masked calculator identity text. The retained original receipts remain unchanged. Use `receipt-identity-corrected.json` here and in `final-schema/` to inspect the actual Base64 engine (`technology.base64-size`), slug and methodology identity (`base64-size-calculator`).

Both corrected receipts were collected from the same retained raw actual runs; no application workflow or build was repeated. Each `identity-correction-equivalence.json` records the raw receipt, original packet, corrected packet and sanitizer source SHA-256. Applying the original sanitizer to each corrected receipt reproduces its original packet byte-for-byte, demonstrating that acceptance claims and observed values are unchanged.

The corrected sanitizer recognizes decoded Supabase session payloads and credential context, preserves canonical identities, and still strips JWTs, API keys, secret fields, credential headers and auth cookies. Regression verification:

```sh
node tests/five-native-auth-20261109/evidence-sanitizer.test.mjs
node tests/five-native-auth-20261109/recollect-identities.mjs
```

The second command requires the retained local raw files; it publishes only sanitized corrected receipts and hashes. Synthetic publication scope and release holds remain unchanged.
