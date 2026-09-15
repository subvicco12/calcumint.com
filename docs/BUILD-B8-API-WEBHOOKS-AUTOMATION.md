# Build Batch B8 — API, Webhooks, Batch Processing & Business Automation

## Scope
B8 makes CalcuMint programmable for Business customers while preserving the deterministic B6 calculation engine and organization boundaries introduced in B5.

## Business API v1
- `POST /api/v1/custom/{calculatorId}/calculate` executes one published custom calculator.
- `POST /api/v1/batch` executes 1–100 rows against one published custom calculator.
- API credentials use opaque `cm_live_*` / `cm_test_*` secrets; only SHA-256 hashes and short display prefixes are persisted.
- Supported scopes: `calculators:read`, `calculations:run`, `calculations:batch`, `leads:read`, `webhooks:manage`.
- API authentication verifies organization ownership, active status and required scope server-side.
- Per-minute and monthly quotas are enforced atomically through `consume_business_api_quota`.
- Usage events are persisted for metering and later billing/analytics.

## Batch processing
The B8 endpoint supports synchronous batches of up to 100 rows and persists each batch result in `batch_calculation_jobs`. The schema also includes queued/processing/failed states so later workers can move large jobs to asynchronous execution without breaking the API contract.

## Outbound webhooks
- Organizations can register HTTPS-only endpoints for `calculation.completed` and `lead.created`.
- A unique signing secret is generated once and shown once.
- Signing secrets are encrypted at rest with AES-256-GCM using server-only `WEBHOOK_ENCRYPTION_KEY`.
- Deliveries are signed with HMAC-SHA256 over `<timestamp>.<raw JSON payload>`.
- Headers: `x-calcumint-timestamp` and `x-calcumint-signature: v1=<hex>`.
- Database triggers queue webhook deliveries after custom-calculator runs and B7 lead creation.
- Internal worker endpoint processes due deliveries, uses a 10-second timeout, exponential backoff and dead-letters after eight failed attempts.
- Worker access requires server-only `WEBHOOK_WORKER_SECRET`.

## Security
- API secrets are never stored in plaintext.
- Webhook signing secrets are encrypted before persistence.
- API keys are organization-scoped and scope-limited.
- Public callers cannot choose an organization ID and execute another organization's calculator.
- Only published immutable custom-calculator versions are executable through the API.
- RLS protects API keys, usage, batch jobs, webhook endpoints and delivery history from cross-organization access.
- Service-role credentials, encryption keys and worker secrets remain server-only.

## Integration targets
The API and webhook contracts are generic HTTP interfaces suitable for n8n, Make, Zapier, Airtable, HubSpot, Salesforce, custom CRMs and internal applications without coupling CalcuMint to a specific automation vendor.

## Deferred intentionally
Large asynchronous batch workers, customer-configurable custom event payload templates, OAuth integrations, native CRM connectors, API overage billing, custom API domains and advanced observability belong to later hardening/expansion work.

## Deployment gate
Do not run `006_b8_api_automation.sql`, configure production worker secrets, merge to `main`, schedule the worker, or deploy to Hostinger until the stacked B0–B8 chain is approved for environment integration and CI is green.
