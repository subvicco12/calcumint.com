# Build Batch B9 — Grounded AI Layer

## Scope
B9 adds AI assistance without allowing an AI model to become a calculator. Every numeric result remains owned by CalcuMint's deterministic engines from B1/B6.

## Capabilities
- Natural-language calculator discovery at `/ai`.
- Deterministic catalog fallback when no AI provider is configured or the AI call fails.
- Pro/Business result explanations grounded in immutable calculator inputs and outputs.
- Scenario assistance that may describe which inputs to vary and expected qualitative direction, but must not calculate replacement numeric results.
- Business-only custom-calculator drafting through `/business/builder/ai`.
- Provider abstraction with server-only endpoint/model/key configuration.
- AI request metering, monthly quotas and per-minute limits.

## Entitlements
- Free: calculator finder; up to 10 metered AI requests/month when AI is configured.
- Pro: finder + result explanation + scenario assistance; 200 requests/month.
- Business: all Pro capabilities + builder assistance; 1,000 requests/month.
- Signed-out finder users receive deterministic catalog matching and incur no AI-provider request.

## Grounding rules
1. AI never performs or replaces the deterministic calculation engine.
2. Supplied numeric outputs are immutable and cannot be recomputed, estimated or contradicted by AI.
3. Finder recommendations are restricted to the certified public calculator catalog.
4. Builder proposals are parsed through the B6 Zod schema and executed once through the restricted formula engine before being returned.
5. Unsupported functions, arbitrary JavaScript, network calls and unknown formulas fail closed.
6. Finance/health/high-impact explanations must surface assumptions and avoid professional-advice framing.

## Provider abstraction
B9 uses an OpenAI-compatible JSON chat interface behind `AiProvider`. Provider configuration is entirely server-side:
- `AI_PROVIDER`
- `AI_BASE_URL`
- `AI_MODEL`
- `AI_API_KEY`

No provider key is exposed through `NEXT_PUBLIC_*` variables. If any required provider value is absent, AI calls remain disabled and the finder uses deterministic matching.

## Data and metering
`007_b9_ai.sql` adds `ai_usage_events` plus security-definer quota functions. Quotas are derived from the authenticated user's server-controlled profile plan; clients cannot submit their own plan or quota. RLS permits users to read their own usage and organization Owners/Admins to inspect organization usage.

## Deployment gate
Do not apply `007_b9_ai.sql`, configure a production AI provider/key, merge to `main`, or deploy to Hostinger until B0–B9 environment integration is explicitly authorized. Provider selection and production spend caps should be configured separately from code deployment.
