import { calculatorRegistry } from "./registry";
import { categoryContent, getCertificationCandidateContent } from "./public-content";
import { isRepositoryPublicationEligible, type PublishedCalculatorManifestEntry } from "./publication-authority";

export type PublicRouteReadiness =
  | { state: "blocked"; reason: "unknown-calculator" | "uncertified" | "missing-content" | "invalid-category" | "unavailable-authority" | "unpublished" }
  | { state: "ready"; definition: NonNullable<ReturnType<typeof calculatorRegistry.getBySlug>>; content: NonNullable<ReturnType<typeof getCertificationCandidateContent>>; path: string };

/** Internal readiness evidence only; ready requires the current authoritative publication set. */
export function resolvePublicCalculatorRoute(category: string, slug: string, publication: { state: "available" | "unavailable"; slugs: ReadonlySet<string> }): PublicRouteReadiness {
  const definition = calculatorRegistry.getBySlug(slug);
  if (!definition) return { state: "blocked", reason: "unknown-calculator" };
  if (!isRepositoryPublicationEligible(definition)) return { state: "blocked", reason: "uncertified" };
  const content = getCertificationCandidateContent(slug);
  if (!content) return { state: "blocked", reason: "missing-content" };
  if (!Object.hasOwn(categoryContent, category) || content.category !== category) return { state: "blocked", reason: "invalid-category" };
  if (publication.state === "unavailable") return { state: "blocked", reason: "unavailable-authority" };
  if (!publication.slugs.has(slug)) return { state: "blocked", reason: "unpublished" };
  return { state: "ready", definition, content, path: `/calculators/${content.category}/${content.slug}` };
}

/** Counts local structural candidates separately from runtime approval evidence. */
export function buildPublicRouteReadinessReport(publication: { state: "available" | "unavailable"; slugs: ReadonlySet<string> }, manifest?: readonly PublishedCalculatorManifestEntry[]) {
  return calculatorRegistry.list().map(definition => {
    const content = getCertificationCandidateContent(definition.slug);
    const category = content?.category ?? definition.category;
    const structural = resolvePublicCalculatorRoute(category, definition.slug, { state: "available", slugs: new Set([definition.slug]) });
    const runtime = resolvePublicCalculatorRoute(category, definition.slug, publication);
    const observed = publication.state === "available" ? manifest?.find(entry => entry.slug === definition.slug) : undefined;
    const manifestIdentityEvidence = publication.state === "unavailable" || !manifest ? "not-observed" : !observed ? "absent" : observed.calculator_key !== definition.id ? "identity-mismatch" : observed.version !== definition.version ? "version-mismatch" : "matches";
    return { manifestIdentityEvidence, calculatorKey: definition.id, slug: definition.slug, version: definition.version, codeReviewStatus: definition.reviewStatus,
      structuralRoute: structural.state === "ready" ? structural.path : null,
      structuralBlocker: structural.state === "blocked" ? structural.reason : null,
      publicationEvidence: publication.state === "unavailable" ? "unknown" as const : runtime.state === "ready" ? "approved-route-ready" as const : "blocked" as const,
      runtimeBlocker: runtime.state === "blocked" ? runtime.reason : null };
  });
}
