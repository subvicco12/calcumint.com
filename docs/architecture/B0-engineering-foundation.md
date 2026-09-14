# Build Batch B0 — Engineering & Environment Foundation

Status: implementation branch

This batch implements the foundation defined in the CalcuMint Master Architecture & Build Blueprint.

## Scope

- Next.js + TypeScript application shell.
- Mobile-first design tokens and reusable shell components.
- Strict TypeScript and lint configuration.
- Environment-variable contract with no committed secrets.
- Health endpoint for Hostinger post-deploy checks.
- Feature flags keeping B1–B10 functionality disabled until completed and certified.
- GitHub Actions validation for lint, types, tests and production build.
- Initial Free / Pro / Business pricing surface for architecture validation only; billing is not active.

## Environment model

- Local/CI: no production secrets.
- Staging: future Paddle sandbox + test auth.
- Production: Hostinger Node.js app at calcumint.com; production secrets configured in Hostinger.

## Deployment contract

1. GitHub is source of truth.
2. Production deploys only after reviewed/validated merge.
3. Hostinger installs dependencies and runs `npm run build`.
4. Runtime command is `npm start`.
5. `/health` must return HTTP 200 after deployment.

## Guardrails

- No live billing, ads, auth, AI, or Business workflows in B0.
- Existing legacy static HTML remains untouched during this branch and will be retired only after the Next.js replacement is deployment-certified.
- No calculator formula is considered production-ready until B1 calculator-engine tests and certification gates exist.
