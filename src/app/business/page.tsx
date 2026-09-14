import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canManageMembers, canManageProjects, type BusinessRole } from "@/lib/business/permissions";
import { createClientWorkspace, createOrganization, createProject, inviteMember } from "./actions";

export const metadata = { title: "Business Workspace" };

type PageProps = { searchParams: Promise<{ invite?: string }> };

export default async function BusinessPage({ searchParams }: PageProps) {
  const { invite } = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <section className="container page-top"><span className="eyebrow">Business</span><h1>Business workspace is ready for configuration.</h1><p className="hero-copy">Configure Supabase before activating organization workspaces.</p></section>;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("plan,display_name").eq("id", user.id).maybeSingle();
  if (profile?.plan !== "business") {
    return (
      <section className="container page-top">
        <span className="eyebrow">Business workspace</span>
        <h1>Upgrade to Business to create an organization.</h1>
        <p className="hero-copy">Business adds team roles, shared projects, client workspaces and the foundation for branded calculators, leads and automation.</p>
        <Link className="button primary" href="/pricing">View Business plan</Link>
      </section>
    );
  }

  const { data: memberships } = await supabase.from("organization_members").select("organization_id,role,joined_at").eq("user_id", user.id).order("joined_at", { ascending: true }).limit(1);
  const membership = memberships?.[0];

  if (!membership) {
    return (
      <section className="container page-top business-page">
        <span className="eyebrow">Business setup</span>
        <h1>Create your organization workspace.</h1>
        <p className="hero-copy">Your first workspace includes five seats and becomes the home for shared projects, client workspaces and future branded calculator deployments.</p>
        <form className="card form-stack business-setup-card" action={createOrganization}>
          <label>Organization name<input name="name" required minLength={2} maxLength={120} placeholder="Acme Advisory" /></label>
          <label>Workspace slug<input name="slug" required minLength={2} maxLength={63} pattern="[a-z0-9-]+" placeholder="acme-advisory" /></label>
          <button className="button primary" type="submit">Create Business workspace</button>
        </form>
      </section>
    );
  }

  const organizationId = membership.organization_id as string;
  const role = membership.role as BusinessRole;
  const [{ data: organization }, { data: members }, { data: projects }, { data: clients }, { data: audit }] = await Promise.all([
    supabase.from("organizations").select("id,name,slug,created_at").eq("id", organizationId).single(),
    supabase.from("organization_members").select("user_id,role,joined_at").eq("organization_id", organizationId).order("joined_at", { ascending: true }),
    supabase.from("business_projects").select("id,name,description,status,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(12),
    supabase.from("client_workspaces").select("id,name,client_reference,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(12),
    supabase.from("organization_audit_log").select("id,action,entity_type,created_at").eq("organization_id", organizationId).order("created_at", { ascending: false }).limit(8)
  ]);

  return (
    <section className="container page-top business-page">
      <div className="section-heading">
        <div><span className="eyebrow">Business workspace</span><h1>{organization?.name ?? "Organization"}</h1><p className="hero-copy">Role: {role} · {members?.length ?? 0}/5 included seats in use.</p></div>
        <span className="status">Business active</span>
      </div>

      {invite && (
        <div className="notice success-notice">
          Invitation created. Transactional email delivery is not connected yet; use this temporary acceptance link during setup: <Link className="text-link" href={`/business/invite/${invite}`}>Open invitation</Link>
        </div>
      )}

      <div className="business-stats">
        <article className="card"><span className="eyebrow">Seats</span><h2>{members?.length ?? 0} / 5</h2><p>Owner, Admin, Manager, Member and Viewer roles are supported.</p></article>
        <article className="card"><span className="eyebrow">Projects</span><h2>{projects?.length ?? 0}</h2><p>Shared containers for calculations and later templates.</p></article>
        <article className="card"><span className="eyebrow">Clients</span><h2>{clients?.length ?? 0}</h2><p>Separate client-facing workspaces ready for branded reports.</p></article>
      </div>

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Team</span><h2>Members</h2>
          <ul>{members?.map((member) => <li key={member.user_id}><code>{String(member.user_id).slice(0, 8)}…</code> — {member.role}</li>)}</ul>
          {canManageMembers(role) && (
            <form className="form-stack compact-form" action={inviteMember}>
              <input type="hidden" name="organizationId" value={organizationId} />
              <label>Email<input type="email" name="email" required placeholder="colleague@example.com" /></label>
              <label>Role<select name="role" defaultValue="member"><option value="admin">Admin</option><option value="manager">Manager</option><option value="member">Member</option><option value="viewer">Viewer</option></select></label>
              <button className="button secondary" type="submit">Create invitation</button>
            </form>
          )}
        </article>

        <article className="card">
          <span className="eyebrow">Permissions</span><h2>Your role: {role}</h2>
          <p>{canManageMembers(role) ? "You can manage team membership." : "Member administration is restricted to Owners and Admins."}</p>
          <p>{canManageProjects(role) ? "You can create and manage projects and client workspaces." : "You have read or contribution access according to your role."}</p>
        </article>
      </div>

      <div className="account-grid section">
        <article className="card">
          <span className="eyebrow">Shared work</span><h2>Projects</h2>
          {projects?.length ? <ul>{projects.map((project) => <li key={project.id}><strong>{project.name}</strong> · {project.status}{project.description ? ` — ${project.description}` : ""}</li>)}</ul> : <p>No projects yet.</p>}
          {canManageProjects(role) && <form className="form-stack compact-form" action={createProject}><input type="hidden" name="organizationId" value={organizationId} /><label>Project name<input name="name" required /></label><label>Description<input name="description" /></label><button className="button secondary" type="submit">Create project</button></form>}
        </article>

        <article className="card">
          <span className="eyebrow">Client delivery</span><h2>Client workspaces</h2>
          {clients?.length ? <ul>{clients.map((client) => <li key={client.id}><strong>{client.name}</strong>{client.client_reference ? ` — ${client.client_reference}` : ""}</li>)}</ul> : <p>No client workspaces yet.</p>}
          {canManageProjects(role) && <form className="form-stack compact-form" action={createClientWorkspace}><input type="hidden" name="organizationId" value={organizationId} /><label>Client name<input name="name" required /></label><label>Reference<input name="reference" /></label><button className="button secondary" type="submit">Create client workspace</button></form>}
        </article>
      </div>

      <article className="card section business-audit-card">
        <span className="eyebrow">Governance</span><h2>Recent audit activity</h2>
        {audit?.length ? <ul>{audit.map((event) => <li key={event.id}><strong>{event.action}</strong> · {event.entity_type} · {new Date(event.created_at).toLocaleString()}</li>)}</ul> : <p>No audit events yet.</p>}
      </article>
    </section>
  );
}
