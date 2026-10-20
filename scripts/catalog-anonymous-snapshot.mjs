// GET-only, anonymous evidence collection. Never logs configuration values.
import { writeFileSync } from "node:fs";

const destination = process.argv[2];
if (!destination) throw new Error("Provide a local snapshot JSON output path");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const snapshot = {
  observedAt: new Date().toISOString(), source: "configured-anonymous-supabase",
  method: "GET", credentialRole: "UNKNOWN", manifestState: "unavailable",
  manifest: [], manifestObservation: "public configuration absent",
  catalogVisibility: "UNKNOWN", catalogRows: [], certificationEvidence: "UNKNOWN",
  specialistEvidence: "UNKNOWN", deploymentAttestation: "UNKNOWN",
};
if (url && key) {
  let anonymous = key.startsWith("sb_publishable_");
  if (key.split(".").length === 3) {
    try { anonymous = JSON.parse(Buffer.from(key.split(".")[1], "base64url")).role === "anon"; } catch { anonymous = false; }
  }
  if (!anonymous || new URL(url).protocol !== "https:") throw new Error("Anonymous HTTPS configuration required; privileged credentials refused");
  snapshot.credentialRole = "anonymous";
  const headers = { apikey: key, ...(key.startsWith("sb_publishable_") ? {} : { Authorization: `Bearer ${key}` }), Range: "0-999" };
  const get = async path => {
    try {
      const response = await fetch(new URL(path, url), { method: "GET", headers, signal: AbortSignal.timeout(20000) });
      const data = response.ok ? await response.json() : null;
      return { status: response.status, data };
    } catch { return { status: null, data: null }; }
  };
  const manifest = await get("/rest/v1/rpc/list_published_calculator_manifest");
  snapshot.manifestHttpStatus = manifest.status;
  if (Array.isArray(manifest.data) && manifest.data.length < 1000 && manifest.data.every(row => row && typeof row.calculator_key === "string" && typeof row.slug === "string" && Number.isSafeInteger(row.version) && row.version > 0)) {
    snapshot.manifestState = "available";
    snapshot.manifest = manifest.data.map(({ calculator_key, slug, version }) => ({ calculator_key, slug, version }));
    snapshot.manifestObservation = "complete minimal public manifest observed; certification and protected approvals not exposed";
  } else snapshot.manifestObservation = "manifest unavailable, invalid or requires pagination; count UNKNOWN";
  const catalog = await get("/rest/v1/calculator_catalog_admin?select=calculator_key,slug,version,lifecycle,published_at&limit=1000");
  snapshot.catalogHttpStatus = catalog.status;
  if (Array.isArray(catalog.data) && catalog.data.length < 1000 && catalog.data.every(row => row && typeof row.calculator_key === "string" && typeof row.slug === "string" && Number.isSafeInteger(row.version) && typeof row.lifecycle === "string" && (row.published_at === null || typeof row.published_at === "string"))) {
    snapshot.catalogRows = catalog.data.map(({ calculator_key, slug, version, lifecycle, published_at }) => ({ calculator_key, slug, version, lifecycle, published_at }));
    snapshot.catalogVisibility = catalog.data.length ? "anonymous-visible-subset-only" : "zero-visible-rows-not-evidence-of-absence";
  }
}
writeFileSync(destination, JSON.stringify(snapshot, null, 2) + "\n");
console.log(JSON.stringify({ manifestState: snapshot.manifestState, manifestRows: snapshot.manifestState === "available" ? snapshot.manifest.length : null, credentialRole: snapshot.credentialRole, catalogVisibility: snapshot.catalogVisibility }));
