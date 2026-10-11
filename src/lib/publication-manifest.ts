import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";
import { calculatorRegistry } from "@/calculators/registry";
import { composePublishedCalculatorSlugs, type PublishedCalculatorManifestEntry } from "@/calculators/publication-authority";

export type PublicationSnapshot = Readonly<{ state: "available" | "unavailable"; slugs: ReadonlySet<string> }>;

export async function getPublicationSnapshot(): Promise<PublicationSnapshot> {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { state: "unavailable", slugs: new Set() };

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { data, error } = await supabase.rpc("list_published_calculator_manifest");
    if (error || !Array.isArray(data)) return { state: "unavailable", slugs: new Set() };
    return { state: "available", slugs: composePublishedCalculatorSlugs(
      calculatorRegistry.list(),
      data as PublishedCalculatorManifestEntry[]
    ) };
  } catch {
    return { state: "unavailable", slugs: new Set() };
  }
}

/** Existing route/search callers stay fail-closed when authority is unavailable. */
export async function getPublishedCalculatorSlugs(): Promise<ReadonlySet<string>> {
  return (await getPublicationSnapshot()).slugs;
}
