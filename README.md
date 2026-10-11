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

Use Node.js 22 or newer (CI uses Node.js 22) and npm. From the repository root:

```bash
npm ci
# For a fresh checkout only; preserve an existing .env.local.
cp -n .env.example .env.local
npm run dev
```

The template enables only local, non-secret defaults. Leave optional integration settings commented out until needed; uncomment them only with valid nonempty values. Blank assignments such as `SUPABASE_SERVICE_ROLE_KEY=` are invalid. Keep credentials in ignored local files or secure environment settings, never in Git. Production credentials are not required for unit tests or the local application shell.

Without Supabase publication configuration, the calculator directory is empty and individual calculator pages return 404. This preserves the publication gate: repository certification alone does not authorize public visibility. Calculator engines and interactive components can still be developed and tested with the unit suite. Authentication, billing, AI, and database-backed workflows require their respective integration configuration.

Use `npm ci` for fresh checkouts and CI; it installs the committed `package-lock.json` without updating dependency declarations or the lockfile. For an intentional dependency change, use `npm install` and review and commit both the manifest and lockfile changes.

Production environment validation and certification requirements still apply to releases. The local template is not production configuration.

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
