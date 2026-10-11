import { cache } from "react";
import { getPublicationSnapshot } from "./publication-manifest";
import { resolvePublicCalculatorRoute } from "@/calculators/public-route-readiness";

/** React cache is request-scoped: metadata and rendering share one authority decision. */
export const getPublicCalculatorRoute = cache(async (category: string, slug: string) =>
  resolvePublicCalculatorRoute(category, slug, await getPublicationSnapshot())
);
