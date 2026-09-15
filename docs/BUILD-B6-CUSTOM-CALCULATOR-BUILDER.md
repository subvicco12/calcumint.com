# Build Batch B6 — No-Code Custom Calculator Builder

## Scope
B6 introduces the first major Business-only creation capability: a versioned no-code calculator builder backed by a restricted deterministic formula language.

## Included
- Organization-scoped custom calculators.
- Draft, published and archived lifecycle states.
- Versioned immutable calculator definitions.
- Input fields for number, currency and percentage values.
- Output fields with deterministic formulas and formatting metadata.
- Live preview in the Business builder.
- Explicit publish action against a chosen version.
- Run-storage foundation for later analytics, embeds and client workflows.
- RLS policies tied to Business organization membership and roles.
- Builder access for Owner, Admin and Manager roles.
- Read access for organization members.
- Audit events for creation and publication.

## Formula language
The builder never evaluates arbitrary JavaScript. The parser supports numeric literals, named variables, parentheses, arithmetic operators, powers, comparisons, boolean AND/OR/NOT and a controlled function allowlist: `IF`, `MIN`, `MAX`, `ABS`, `ROUND`, `FLOOR`, `CEIL`.

Outputs are evaluated in order and may reference earlier numeric outputs. Unknown variables, unsupported characters, division by zero and invalid function signatures fail closed.

## Version model
Editing never mutates a published historical definition. Saving creates the next numbered version. Publishing records a specific `published_version`, allowing later rollback/version-selection workflows without changing the deterministic formula history.

## Deferred intentionally
B6 does not activate public/white-label embeds, lead capture, custom domains, webhooks, external API execution, AI formula generation, advanced lookup tables, tier tables or SSO. These remain later build batches.

## Deployment
Do not apply `004_b6_builder.sql`, merge to `main`, or deploy to Hostinger solely because CI passes. Environment activation remains a separate production decision.
