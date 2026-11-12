# Exact nine factory automation, held durable capability successor

Implements Blueprint BP-0410–0411/BP-0558/BP-0560 through one family adapter. New `/api/v1/calculator-factory/batch` uses the existing Business API batch permission, issuer authority, idempotent submit/read RPC, one-request-unit policy, immutable job table, optional owned webhook endpoint, outbox, lease worker, signed transport and retry policy. Existing internal Technology worker consumes the shared queue with exact29 identity resolution. Existing Technology request and calculation contracts remain exact20; engine versions and outputs are unchanged.

The nine adapter retains the complete factory packet, normalized input and original `output.result`, not a fabricated `value`. New job recovery and webhook dispatch replay the nine packet outputs against the exact factory engine. This is consistency evidence, not publisher provenance or certification.

The SQL artifacts are held and unapplied. Successor requires the retained exact20 schema preimage and extends only the durable job tuple constraint plus existing publication/submit tuple maps; native embed tables remain unchanged. No quota, role, lease, signing, delivery retry or publication framework is duplicated. Reverse pins changed function source bodies and refuses if any nine-family job history exists. It preserves retained history rather than deleting it. No deployment/database acceptance is claimed.

Actual source/schema adoption and authenticated three-plan/browser/batch/webhook acceptance remain necessary before any completion promotion. No canonical, competent-human, certification, publication, production or activation authority is granted here.
