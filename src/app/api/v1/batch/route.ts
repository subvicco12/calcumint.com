import { NextResponse } from "next/server";
import { authenticateApiRequest, ApiAuthError } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { customCalculatorSchema, runCustomCalculator } from "@/lib/builder/definition";

export async function POST(request: Request) {
  try {
    const principal = await authenticateApiRequest(request, "calculations:batch");
    const body = await request.json() as { calculatorId?: string; rows?: Record<string, unknown>[] };
    const calculatorId = String(body.calculatorId ?? "");
    const rows = Array.isArray(body.rows) ? body.rows : [];
    if (!calculatorId || rows.length < 1 || rows.length > 100) {
      return NextResponse.json({ error: "Provide calculatorId and 1-100 rows" }, { status: 400 });
    }

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

    const startedAt = new Date().toISOString();
    const outputs = rows.map((row, index) => {
      try {
        return { index, ok: true as const, ...runCustomCalculator(parsed.data, row) };
      } catch (error) {
        return { index, ok: false as const, error: error instanceof Error ? error.message : "Calculation failed" };
      }
    });

    const { data: job } = await admin.from("batch_calculation_jobs").insert({
      organization_id: principal.organizationId,
      api_key_id: principal.keyId,
      calculator_id: calculatorId,
      calculator_version: calculator.published_version,
      status: "completed",
      input_rows: rows,
      output_rows: outputs,
      started_at: startedAt,
      completed_at: new Date().toISOString()
    }).select("id").single();

    return NextResponse.json({ jobId: job?.id ?? null, calculatorId, version: calculator.published_version, rows: outputs });
  } catch (error) {
    if (error instanceof ApiAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Batch failed" }, { status: 400 });
  }
}
