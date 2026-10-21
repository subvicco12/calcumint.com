import { createClient } from "@supabase/supabase-js";
import { buildPublicRouteReadinessReport } from "../src/calculators/public-route-readiness";
import { calculatorRegistry } from "../src/calculators/registry";
import { composePublishedCalculatorSlugs, parsePublishedCalculatorManifest, type PublishedCalculatorManifestEntry } from "../src/calculators/publication-authority";

// Read-only anonymous RPC; never imports inventory, changes lifecycle or uses a service key.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
let state: "available" | "unavailable" = "unavailable";
let slugs: ReadonlySet<string> = new Set();
let observedManifest: readonly PublishedCalculatorManifestEntry[] | undefined;
let authorityObservation = "public configuration absent";
if (url && key) {
  try {
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
    const { data, error } = await client.rpc("list_published_calculator_manifest");
    const manifest = parsePublishedCalculatorManifest(data);
    if (!error && manifest) {
      state = "available";
      observedManifest = manifest;
      slugs = composePublishedCalculatorSlugs(calculatorRegistry.list(), manifest);
      authorityObservation = "valid minimal publication manifest observed";
    } else authorityObservation = "publication manifest unavailable or invalid";
  } catch { authorityObservation = "publication manifest request failed"; }
}
const rows = buildPublicRouteReadinessReport({ state, slugs }, observedManifest);
console.log(JSON.stringify({
  readOnly: true, authority: state, authorityObservation,
  registryEntries: rows.length,
  structurallyRouteReady: rows.filter(row => row.structuralRoute !== null).length,
  runtimeApprovedRouteReady: state === "available" ? rows.filter(row => row.publicationEvidence === "approved-route-ready").length : null,
  specialistApprovals: "unknown: minimal public manifest does not expose specialist approval evidence",
  productionVisible: "unknown: this local report does not probe deployed routes",
  rows
}, null, 2));
