import { createClient } from "@supabase/supabase-js";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const url = required("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

const [{ count: adminCount, error: adminError }, { count: catalogCount, error: catalogError }, manifest] = await Promise.all([
  supabase.from("platform_admins").select("*", { count: "exact", head: true }).eq("active", true),
  supabase.from("calculator_catalog_admin").select("*", { count: "exact", head: true }),
  supabase.rpc("list_published_calculator_manifest")
]);
if (adminError) throw adminError;
if (catalogError) throw catalogError;
if (manifest.error) throw manifest.error;

const report = {
  activeAdmins: adminCount ?? 0,
  catalogRows: catalogCount ?? 0,
  manifestRows: Array.isArray(manifest.data) ? manifest.data.length : 0,
  readyForInventoryImport: (adminCount ?? 0) > 0,
  publicCatalogNonEmpty: Array.isArray(manifest.data) && manifest.data.length > 0
};
console.log(JSON.stringify(report, null, 2));
if (!report.readyForInventoryImport) process.exitCode = 2;
