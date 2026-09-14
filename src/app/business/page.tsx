import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { businessRoleLabel, hasBusinessPermission, type OrganizationRole } from "@/lib/business/permissions";
import { createClientWorkspace, createOrganization, createProject, inviteMember } from "./actions";

type PageProps = { searchParams: Promise<{ organization?: string }> };

type MembershipRow = {
  role: OrganizationRole;
  organizations: { id: string; name: string; slug: string } | null;
};

export const metadata = { title: "Business Workspace" };

export default async function BusinessPage({ searchParams }: PageProps) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <section className="container page-top"><span className="eyebrow">Business workspace</span><h1>Business infrastructure is ready for configuration.</h1><p className="hero-copy">Connect the production Supabase environment before using organization workspaces.</p></section>;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/business");

  const [{ data: profile }, { data: membershipsRaw }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase.from("organization_members").select("role,organizations(id,name,slug)").eq("user_id", user.id)
  ]);

  if (profile?.plan !== "business") {
    return (
      <section className="container page-top">
        <span className="eyebrow">Business plan</span>
        <h1>Build, brand, automate and collaborate.</h1>
        <p className="hero-copy">Organization workspaces are reserved for Business accounts. Your current plan is {String(profile?.plan ?? "free")}.</p>
        <Link className="button primary" href="/pricing">Upgrade to Business</Link>
      </section>
    );
  }

  const memberships = (membershipsRaw ?? []) as unknown as MembershipRow[];
  if (memberships.length === 0) {
    return (
      <section className="container page-top business-page">
        <span className="eyebrow">Business workspace</span>
        <h1>Create your organization.</h1>
        <p className="hero-copy">Your first organization becomes the secure home for team members, projects, client workspaces, templates and shared calculations.</p>
        <form className="card form-stack business-create-card" action={createOrganization}>
          <label>Organization name<input name="name" required maxLength={120} placeholder="Acme Advisory" /></label>
          <label>Workspace slug<input name="slug" required maxLength={64} placeholder="acme-advisory" pattern="[a-z0-9][a-z0-9-]{1,62}[a-z0-9]" /></label>
          <button className="button primary" type="submit">Create Business workspace</button>
        </form>
      </section>
    );
  }

  const params = await searchParams;
  const selected = memberships.find((membership) => membership.organizations?.id === params.organization) ?? memberships[0];
  if (!selected.organizations) throw new Error("Organization membership is missing its organization");
  const organization = selected.organizations;
  const role = selected.role;

  const [{ data: members }, { data: projects }, { data: clients }, { data: invitations }, { data: audits }] = await Promise.all([
    supabase.from("organization_members").select("user_id,role,joined_at").eq("organization_id", organization.id).order("joined_at"),
    supabase.from("business_projects").select("id,name,description,created_at").eq("organization_id", organization.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("client_workspaces").select("id,name,reference_code,created_at").eq("organization_id", organization.id).order("created_at", { ascending: false }).limit(20),
    hasBusinessPermission(role, "members.manage") ? supabase.from("organization_invitations").select("id,email,role,status,expires_at").eq("organization_id", organization.id).order("created_at", { ascending: false }).limit(20) : Promise.resolve({ data: [] }),
    hasBusinessPermission(role, "audit.read") ? supabase.from("organization_audit_events").select("id,action,target_type,created_at").eq("organization_id", organization.id).order("created_at", { ascending: false }).limit(20) : Promise.resolve({ data: [] })
  ]);

  return (
    <section className="container page-top business-page">
      <div className="section-heading">
        <div><span className="eyebrow">Business workspace</span><h1>{organization.name}</h1><p className="hero-copy">Role: {businessRoleLabel(role)} · Workspace: {organization.slug}</p></div>
        <Link className="button secondary" href="/account">Personal account</Link>
      </div>

      {memberships.length > 1 && <div className="workspace-switcher">{memberships.map((item) => item.organizations && <Link key={item.organizations.id} className={item.organizations.id === organization.id ? "status" : "button secondary"} href={`/business?organization=${item.organizations.id}`}>{item.organizations.name}</Link>)}</div>}

      <div className="business-metrics">
        <div className="card"><span className="eyebrow">Team</span><strong>{members?.length ?? 0}</strong><p>Active organization members</p></div>
        <div className="card"><span className="eyebrow">Projects</span><strong>{projects?.length ?? 0}</strong><p>Shared project workspaces</p></div>
        <div className="card"><span className="eyebrow">Clients</span><strong>{clients?.length ?? 0}</strong><p>Client-facing workspaces</p></div>
      </div>

      <div className="account-grid section">
        <article className="card"><span className="eyebrow">Projects</span><h2>Shared projects</h2>{projects?.length ? <ul>{projects.map((project) => <li key={project.id}><strong>{project.name}</strong>{project.description ? ` — ${project.description}` : ""}</li>)}</ul> : <p>No projects yet.</p>}
          {hasBusinessPermission(role, "projects.manage") && <form className="form-stack compact-form" action={createProject}><input type="hidden" name="organizationId" value={organization.id} /><label>Project name<input name="name" required maxLength={120} /></label><label>Description<input name="description" maxLength={500} /></label><button className="button secondary" type="submit">Create project</button></form>}
        </article>

        <article className="card"><span className="eyebrow">Clients</span><h2>Client workspaces</h2>{clients?.length ? <ul>{clients.map((client) => <li key={client.id}><strong>{client.name}</strong>{client.reference_code ? ` · ${client.reference_code}` : ""}</li>)}</ul> : <p>No client workspaces yet.</p>}
          {hasBusinessPermission(role, "clients.manage") && <form className="form-stack compact-form" action={createClientWorkspace}><input type="hidden" name="organizationId" value={organization.id} /><label>Client name<input name="name" required maxLength={160} /></label><label>Reference code<input name="referenceCode" maxLength={64} /></label><button className="button secondary" type="submit">Create client workspace</button></form>}
        </article>
      </div>

      <div className="account-grid section">
        <article className="card"><span className="eyebrow">Members</span><h2>Team & roles</h2>{members?.length ? <ul>{members.map((member) => <li key={member.user_id}><code>{member.user_id.slice(0, 8)}…</code> · {businessRoleLabel(member.role as OrganizationRole)}</li>)}</ul> : <p>No members.</p>}
          {hasBusinessPermission(role, "members.manage") && <form className="form-stack compact-form" action={inviteMember}><input type="hidden" name="organizationId" value={organization.id} /><label>Email<input type="email" name="email" required /></label><label>Role<select name="role" defaultValue="member"><option value="admin">Admin</option><option value="manager">Manager</option><option value="member">Member</option><option value="viewer">Viewer</option></select></label><button className="button secondary" type="submit">Create invitation</button></form>}
        </article>

        <article className="card"><span className="eyebrow">Governance</span><h2>Audit trail</h2>{hasBusinessPermission(role, "audit.read") ? (audits?.length ? <ul>{audits.map((event) => <li key={event.id}><strong>{event.action}</strong>{event.target_type ? ` · ${event.target_type}` : ""}</li>)}</ul> : <p>No audit events yet.</p>) : <p>Managers, admins and owners can review the organization audit trail.</p>}
          {hasBusinessPermission(role, "members.manage") && invitations && invitations.length > 0 && <div className="pending-invites"><h3>Pending invitations</h3><ul>{invitations.map((invite) => <li key={invite.id}>{invite.email} · {businessRoleLabel(invite.role as OrganizationRole)} · {invite.status}</li>)}</ul></div>}
        </article>
      </div>

      <div className="card business-roadmap"><span className="eyebrow">Business capability boundary</span><h2>Ready for the next Business layers</h2><p>This organization model is the entitlement and tenancy foundation for the custom calculator builder, white-label embeds, lead capture, API keys, webhooks and automation that follow in B6–B8.</p></div>
    </section>
  );
}
