# B2 — Public Calculator Platform & SEO Foundation

B2 turns the certified portion of the deterministic B1 engine into the first public-facing calculator platform.

## Public routes

- `/calculators` — searchable calculator directory
- `/calculators/{category}` — category hub
- `/calculators/{category}/{slug}` — canonical calculator page
- `/sitemap.xml` — generated from certified public registry
- `/robots.txt` — generated crawler rules

## Publication rule

A calculator is eligible for public discovery only when both conditions are true:

1. its engine definition has `reviewStatus: "certified"`;
2. it has an entry in `public-content.ts` with unique explanatory content.

This intentionally keeps the B1 finance reference calculators out of public search because their YMYL source/review metadata is not yet complete.

## Page standard implemented

Public calculator pages include:

- breadcrumbs and canonical metadata
- H1 + purpose statement
- interactive validated calculator
- prominent result
- formula and formula explanation
- worked-example reference
- assumptions and limitations
- FAQ content
- related calculator links
- calculation trust/status panel
- non-blocking plan upgrade surface

## Search and internal linking

The initial search works client-side against the certified calculator index. Category hubs and related-calculator links establish the first internal-link graph. This can later move to a larger server/search index without changing canonical URLs.

## SEO safeguards

- draft/reviewed calculators are not in public directory or sitemap
- one canonical URL per calculator
- no parameter/state URLs are generated or indexed
- no fabricated ratings/review schema
- sitemap is registry-driven
- Business/app/API paths are excluded from crawler rules

## Feature activation

`calculatorEngine` is enabled in B2 because certified calculators now have a public interface. Accounts, billing, Business, builder, embeds/leads, API/webhooks, AI and admin remain disabled.
