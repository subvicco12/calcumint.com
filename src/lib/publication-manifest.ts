import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";
import { calculatorRegistry } from "@/calculators/registry";
import { composePublishedCalculatorSlugs, type PublishedCalculatorManifestEntry } from "@/calculators/publication-authority";

export async function getPublishedCalculatorSlugs(): Promise<ReadonlySet<string>> {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return new Set();

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
    const { data, error } = await supabase.rpc("list_published_calculator_manifest");
    if (error || !Array.isArray(data)) return new Set();
    return composePublishedCalculatorSlugs(
      calculatorRegistry.list(),
      data as PublishedCalculatorManifestEntry[]
    );
  } catch {
    return new Set();
  }
}
