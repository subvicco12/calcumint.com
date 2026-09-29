import { createClient } from "@supabase/supabase-js";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const apply = process.argv.includes("--apply");
const ownerEmail = required("CALCUMINT_OWNER_EMAIL").toLowerCase();
const url = required("NEXT_PUBLIC_SUPABASE_URL");
const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const matches = [];
for (let page = 1; ; page += 1) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) throw error;
  matches.push(...data.users.filter((user) => user.email?.toLowerCase() === ownerEmail));
  if (data.users.length < 1000) break;
}
if (matches.length !== 1) {
  throw new Error(`Expected exactly one auth user for ${ownerEmail}; found ${matches.length}`);
}

const user = matches[0];
if (!user.email_confirmed_at) throw new Error("Owner auth user must have a confirmed email");

const { data: existingOwners, error: ownerError } = await supabase
  .from("platform_admins")
  .select("user_id,role,active")
  .eq("role", "owner")
  .eq("active", true);
if (ownerError) throw ownerError;

if (existingOwners.length > 0 && !existingOwners.some((row) => row.user_id === user.id)) {
  throw new Error("An active owner already exists; refusing to replace or add another owner");
}
if (existingOwners.some((row) => row.user_id === user.id)) {
  console.log("Requested user is already the active platform owner; no change required.");
  process.exit(0);
}

console.log(`Validated owner candidate ${ownerEmail} (${user.id}).`);
if (!apply) {
  console.log("Dry run only. Re-run with --apply to insert the platform owner.");
  process.exit(0);
}

const { error: insertError } = await supabase.from("platform_admins").insert({
  user_id: user.id,
  role: "owner",
  active: true
});
if (insertError) throw insertError;
console.log("Platform owner bootstrap completed.");
