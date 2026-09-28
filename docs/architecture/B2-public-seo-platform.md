# B2 — Public Calculator Platform & SEO Foundation

B2 turns the governed, certified portion of the deterministic B1 engine into the public-facing calculator platform.

## Public routes

- `/calculators` — searchable calculator directory
- `/calculators/{category}` — category hub
- `/calculators/{category}/{slug}` — canonical calculator page
- `/sitemap.xml` — generated at runtime from governed published calculators
- `/robots.txt` — generated crawler rules

## Publication rule

Public visibility is a composed decision. A calculator is eligible for public discovery/rendering only when both authorities agree:

1. the repository definition is publication-eligible: `reviewStatus: "certified"`, with formula, worked-example and source artifacts required by the repository gate; and
2. the authoritative database publication manifest contains an exact matching calculator key, slug and version whose catalog lifecycle is `published`.

The anonymous manifest exposes only calculator key, slug and version. It does not expose `calculator_catalog_admin`, reviewer data, QA/source evidence, or other admin metadata.

If publication authority cannot be established—for example because manifest configuration, RPC access or returned data is unavailable—the public calculator set is empty. Public visibility therefore fails closed rather than falling back to repository certification alone.

The affected public routes resolve publication state dynamically so `next build --webpack` does not depend on a live production database.

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
- related calculator links restricted to the governed published set
- calculation trust/status panel
- non-blocking plan upgrade surface

## Search and internal linking

Homepage discovery, calculator directory/category search, related-calculator links and the deterministic AI finder/catalog operate only on the governed published calculator set. Repository-only candidate content remains an internal certification/content artifact and is not a public publication authority.

## SEO safeguards

- draft/reviewed or DB-unpublished calculators are not in public discovery or sitemap
- repository and database identity must match on calculator key, slug and version
- one canonical URL per calculator
- no parameter/state URLs are generated or indexed
- no fabricated ratings/review schema
- sitemap is generated from the governed published set
- Business/app/API paths are excluded from crawler rules

## Feature activation

`calculatorEngine` is enabled in B2 because governed published calculators have a public interface. Accounts, billing, Business, builder, embeds/leads, API/webhooks, AI and admin activation remain controlled by their own feature/governance boundaries.
