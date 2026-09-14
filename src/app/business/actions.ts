"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrganizationRole } from "@/lib/business/permissions";

const organizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/)
});
const workspaceNameSchema = z.string().trim().min(1).max(160);
const invitationSchema = z.object({
  organizationId: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["admin", "manager", "member", "viewer"])
});

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/business");
  return { supabase, user };
}

export async function createOrganization(formData: FormData) {
  const { supabase } = await requireUser();
  const parsed = organizationSchema.safeParse({ name: formData.get("name"), slug: formData.get("slug") });
  if (!parsed.success) throw new Error("Enter a valid organization name and URL slug");
  const { error } = await supabase.rpc("create_business_organization", {
    p_name: parsed.data.name,
    p_slug: parsed.data.slug
  });
  if (error) throw new Error(error.message);
  revalidatePath("/business");
}

export async function createProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const organizationId = z.string().uuid().parse(formData.get("organizationId"));
  const name = workspaceNameSchema.parse(formData.get("name"));
  const description = z.string().trim().max(500).optional().parse(String(formData.get("description") ?? "")) || null;
  const { error } = await supabase.from("business_projects").insert({ organization_id: organizationId, name, description, created_by: user.id });
  if (error) throw new Error(error.message);
  await supabase.from("organization_audit_events").insert({ organization_id: organizationId, actor_user_id: user.id, action: "project.created", target_type: "project", metadata: { name } });
  revalidatePath("/business");
}

export async function createClientWorkspace(formData: FormData) {
  const { supabase, user } = await requireUser();
  const organizationId = z.string().uuid().parse(formData.get("organizationId"));
  const name = workspaceNameSchema.parse(formData.get("name"));
  const referenceCode = z.string().trim().max(64).optional().parse(String(formData.get("referenceCode") ?? "")) || null;
  const { error } = await supabase.from("client_workspaces").insert({ organization_id: organizationId, name, reference_code: referenceCode, created_by: user.id });
  if (error) throw new Error(error.message);
  await supabase.from("organization_audit_events").insert({ organization_id: organizationId, actor_user_id: user.id, action: "client_workspace.created", target_type: "client_workspace", metadata: { name } });
  revalidatePath("/business");
}

export async function inviteMember(formData: FormData) {
  const { supabase, user } = await requireUser();
  const parsed = invitationSchema.safeParse({
    organizationId: formData.get("organizationId"),
    email: formData.get("email"),
    role: formData.get("role")
  });
  if (!parsed.success) throw new Error("Enter a valid email and role");

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { error } = await supabase.from("organization_invitations").insert({
    organization_id: parsed.data.organizationId,
    email: parsed.data.email,
    role: parsed.data.role as OrganizationRole,
    token_hash: tokenHash,
    invited_by: user.id
  });
  if (error) throw new Error(error.message);

  await supabase.from("organization_audit_events").insert({
    organization_id: parsed.data.organizationId,
    actor_user_id: user.id,
    action: "invitation.created",
    target_type: "invitation",
    metadata: { email: parsed.data.email, role: parsed.data.role }
  });

  // B5 stores only the hash. Delivery of the one-time raw token is intentionally delegated
  // to the outbound email integration added when production messaging is configured.
  revalidatePath("/business");
}

export async function acceptInvitation(formData: FormData) {
  const { supabase } = await requireUser();
  const token = z.string().min(20).parse(formData.get("token"));
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const { data, error } = await supabase.rpc("accept_business_invitation", { p_token_hash: tokenHash });
  if (error) throw new Error(error.message);
  redirect(`/business?organization=${encodeURIComponent(String(data))}`);
}
