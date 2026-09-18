import{readFileSync}from"node:fs";import{join}from"node:path";import{describe,expect,it}from"vitest";
const migration=readFileSync(join(process.cwd(),"supabase/migrations/010_b7_pro_workspace.sql"),"utf8");
describe("B7 Pro workspace migration",()=>{
 it("enables RLS on personal workspace tables",()=>{for(const t of["calculation_projects","saved_scenarios"])expect(migration).toContain(`alter table public.${t} enable row level security;`)});
 it("scopes project and scenario access to the authenticated owner",()=>{expect(migration).toContain("auth.uid()=user_id");expect(migration).toContain("p.user_id=auth.uid()")});
 it("requires a paid plan for workspace inserts",()=>{expect(migration).toContain("p.plan in ('pro','business')");expect(migration).toContain("profile.plan in ('pro','business')")});
 it("cascades project deletion to contained scenarios",()=>expect(migration).toContain("project_id uuid references public.calculation_projects(id) on delete cascade"));
});
