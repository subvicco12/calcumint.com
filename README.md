# CalcuMint (`calcumint.com`)

Universal calculation platform — **Free / Pro / Business**.

CalcuMint is a production-grade Next.js application built according to the Master Architecture & Build Blueprint dated 14 September 2026. Public calculator pages remain SEO-first and broadly accessible; paid plans unlock deeper analysis and business workflows without creating duplicate calculator URLs.

## Locked principles

- Core mathematics is deterministic, versioned and tested.
- AI assists discovery and explanation; it never silently replaces the calculation engine.
- Free traffic supports advertising; Pro and Business are ad-free.
- Business differentiation is build + brand + collaborate + automate.
- GitHub is the source of truth and Hostinger is the target production host.
- `https://calcumint.com` is the single production origin used by canonical metadata, sitemaps and structured data.

## Application source of truth

The production application is the Next.js project under `src/`, built with `npm run build` and served with `npm run start`. Root-level static HTML from the pre-Next.js prototype is not part of the production application and must not be used as a Hostinger document-root deployment artifact.

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

B0 foundation → B1 deterministic calculator engine → B2 SEO/public templates → B3 auth → B4 Pro billing → B5 Business workspace → B6 custom builder → B7 embeds/leads → B8 API/webhooks → B9 AI → B10 admin/publishing → B11 calculator portfolio → B12 hardening/launch → B13 production UI/UX and brand refinement.

## Deployment rule

Hostinger must run the Node.js/Next.js application from this repository. Do not upload or serve historical standalone `.html` files as the public website. Production readiness checks intentionally reject alternate public origins such as `www.calcumint.com`; redirect aliases should terminate at `https://calcumint.com` outside the application when configured at the hosting/DNS layer.
