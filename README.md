# CalcuMint (`calcumint.com`)

Universal calculation platform — **Free / Pro / Business**.

CalcuMint is being rebuilt as a production-grade Next.js application according to the Master Architecture & Build Blueprint dated 14 September 2026. Public calculator pages remain SEO-first and broadly accessible; paid plans unlock deeper analysis and business workflows without creating duplicate calculator URLs.

## Locked principles

- Core mathematics is deterministic, versioned and tested.
- AI assists discovery and explanation; it never silently replaces the calculation engine.
- Free traffic supports advertising; Pro and Business are ad-free.
- Business differentiation is build + brand + collaborate + automate.
- GitHub is the source of truth and Hostinger is the target production host.

## Current implementation

**Build Batch B0 — Engineering & Environment Foundation**

This branch introduces the Next.js/TypeScript application shell, CI, environment contracts, security headers, design foundation, health endpoint and disabled feature flags for later batches.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Validation:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Build roadmap

B0 foundation → B1 deterministic calculator engine → B2 SEO/public templates → B3 auth → B4 Pro billing → B5 Business workspace → B6 custom builder → B7 embeds/leads → B8 API/webhooks → B9 AI → B10 admin/publishing → B11 calculator portfolio → B12 hardening/launch.

## Legacy files

The root-level static HTML files predate the production architecture. They are intentionally retained during B0 as rollback/reference material and will not be removed until the Next.js replacement passes deployment certification.
