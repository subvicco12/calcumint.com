import { NextResponse } from "next/server";
import { authenticateApiRequest, ApiAuthError } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { customCalculatorSchema, runCustomCalculator } from "@/lib/builder/definition";

type RouteContext = { params: Promise<{ calculatorId: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const principal = await authenticateApiRequest(request, "calculations:run");
    const { calculatorId } = await params;
    const admin = createSupabaseAdminClient();
    if (!admin) return NextResponse.json({ error: "API service unavailable" }, { status: 503 });

    const { data: calculator } = await admin
      .from("custom_calculators")
      .select("id,organization_id,published_version,status")
      .eq("id", calculatorId)
      .eq("organization_id", principal.organizationId)
      .eq("status", "published")
      .maybeSingle();
    if (!calculator?.published_version) return NextResponse.json({ error: "Calculator not found" }, { status: 404 });

    const { data: versionRow } = await admin
      .from("custom_calculator_versions")
      .select("definition")
      .eq("calculator_id", calculatorId)
      .eq("version", calculator.published_version)
      .maybeSingle();
    const parsed = customCalculatorSchema.safeParse(versionRow?.definition);
    if (!parsed.success) return NextResponse.json({ error: "Published calculator definition is invalid" }, { status: 500 });

    const body = await request.json() as { inputs?: Record<string, unknown> };
    const result = runCustomCalculator(parsed.data, body.inputs ?? {});
    await admin.from("custom_calculator_runs").insert({
      calculator_id: calculatorId,
      calculator_version: calculator.published_version,
      organization_id: principal.organizationId,
      input_data: result.input,
      output_data: result.output
    });

    return NextResponse.json({ calculatorId, version: calculator.published_version, ...result });
  } catch (error) {
    if (error instanceof ApiAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Calculation failed" }, { status: 400 });
  }
}
