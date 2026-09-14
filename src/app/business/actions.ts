"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { businessRoles, type BusinessRole } from "@/lib/business/permissions";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 63);
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function createOrganization(formData: FormData) {
  const { supabase } = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  if (name.length < 2 || slug.length < 2) throw new Error("Enter a valid organization name and slug");
  const { error } = await supabase.rpc("create_business_organization", { org_name: name, org_slug: slug });
  if (error) throw new Error(error.message);
  revalidatePath("/business");
}

export async function inviteMember(formData: FormData) {
  const { supabase, user } = await requireUser();
  const organizationId = String(formData.get("organizationId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "member") as BusinessRole;
  if (!organizationId || !email.includes("@") || !businessRoles.includes(role) || role === "owner") {
    throw new Error("Invalid invitation details");
  }

  const [{ count: memberCount }, { count: pendingCount }] = await Promise.all([
    supabase.from("organization_members").select("user_id", { count: "exact", head: true }).eq("organization_id", organizationId),
    supabase.from("organization_invitations").select("id", { count: "exact", head: true }).eq("organization_id", organizationId).is("accepted_at", null).gt("expires_at", new Date().toISOString())
  ]);
  if ((memberCount ?? 0) + (pendingCount ?? 0) >= 5) throw new Error("The included five Business seats are already allocated or pending");

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from("organization_invitations").insert({
    organization_id: organizationId,
    email,
    role,
    token_hash: tokenHash,
    invited_by: user.id,
    expires_at: expiresAt
  });
  if (error) throw new Error(error.message);

  // Email delivery is intentionally deferred until the transactional email provider is selected.
  revalidatePath("/business");
  redirect(`/business?invite=${encodeURIComponent(token)}`);
}

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const organizationId = String(formData.get("organizationId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!organizationId || name.length < 2) throw new Error("Enter a project name");
  const { error } = await supabase.from("business_projects").insert({
    organization_id: organizationId,
    name,
    description: description || null,
    created_by: user.id
  });
  if (error) throw new Error(error.message);
  revalidatePath("/business");
}

export async function createClientWorkspace(formData: FormData) {
  const { supabase, user } = await requireUser();
  const organizationId = String(formData.get("organizationId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();
  if (!organizationId || name.length < 2) throw new Error("Enter a client workspace name");
  const { error } = await supabase.from("client_workspaces").insert({
    organization_id: organizationId,
    name,
    client_reference: reference || null,
    created_by: user.id
  });
  if (error) throw new Error(error.message);
  revalidatePath("/business");
}

export async function acceptInvitation(formData: FormData) {
  const { supabase } = await requireUser();
  const token = String(formData.get("token") ?? "");
  if (!token) throw new Error("Invitation token is missing");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { error } = await supabase.rpc("accept_business_invitation", { invite_token_hash: tokenHash });
  if (error) throw new Error(error.message);
  redirect("/business");
}
