import { createClient } from "@supabase/supabase-js";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const url = required("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

const [
  { count: adminCount, error: adminError },
  { count: ownerCount, error: ownerError },
  { count: catalogCount, error: catalogError },
  { count: sourceEvidenceCount, error: sourceError },
  { count: qaCheckCount, error: qaError },
  manifest
] = await Promise.all([
  supabase.from("platform_admins").select("*", { count: "exact", head: true }).eq("active", true),
  supabase.from("platform_admins").select("*", { count: "exact", head: true }).eq("active", true).eq("role", "owner"),
  supabase.from("calculator_catalog_admin").select("*", { count: "exact", head: true }),
  supabase.from("calculator_source_evidence").select("*", { count: "exact", head: true }),
  supabase.from("calculator_qa_checks").select("*", { count: "exact", head: true }),
  supabase.rpc("list_published_calculator_manifest")
]);
for (const error of [adminError, ownerError, catalogError, sourceError, qaError]) {
  if (error) throw error;
}
if (manifest.error) throw manifest.error;

const report = {
  activeAdmins: adminCount ?? 0,
  activeOwners: ownerCount ?? 0,
  catalogRows: catalogCount ?? 0,
  sourceEvidenceRows: sourceEvidenceCount ?? 0,
  qaRows: qaCheckCount ?? 0,
  manifestRows: Array.isArray(manifest.data) ? manifest.data.length : 0,
  readyForInventoryImport: (ownerCount ?? 0) === 1,
  publicCatalogNonEmpty: Array.isArray(manifest.data) && manifest.data.length > 0
};
console.log(JSON.stringify(report, null, 2));
if (!report.readyForInventoryImport) process.exitCode = 2;
