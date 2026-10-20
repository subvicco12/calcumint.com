import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateApiRequest, ApiAuthError } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { customCalculatorSchema, runCustomCalculator } from "@/lib/builder/definition";

export async function POST(request: Request) {
  try {
    const principal = await authenticateApiRequest(request, "calculations:batch");
    const parsedBody = z.object({ calculatorId: z.uuid(), rows: z.array(z.record(z.string(), z.unknown())).min(1).max(100) }).safeParse(await request.json().catch(() => null));
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Provide calculatorId and 1-100 rows" }, { status: 400 });
    }

    const { calculatorId, rows } = parsedBody.data;
    const admin = createSupabaseAdminClient();
    if (!admin) return NextResponse.json({ error: "API service unavailable" }, { status: 503 });
    const { data: calculator, error: calculatorError } = await admin
      .from("custom_calculators")
      .select("id,organization_id,published_version,status")
      .eq("id", calculatorId)
      .eq("organization_id", principal.organizationId)
      .eq("status", "published")
      .maybeSingle();
    if (calculatorError) return NextResponse.json({ error: "API storage unavailable" }, { status: 503 });
    if (!calculator?.published_version) return NextResponse.json({ error: "Calculator not found" }, { status: 404 });

    const { data: versionRow, error: versionError } = await admin
      .from("custom_calculator_versions")
      .select("definition")
      .eq("calculator_id", calculatorId)
      .eq("version", calculator.published_version)
      .maybeSingle();
    if (versionError) return NextResponse.json({ error: "API storage unavailable" }, { status: 503 });
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

    const { data: job, error: jobError } = await admin.from("batch_calculation_jobs").insert({
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

    if (jobError || !z.uuid().safeParse(job?.id).success) return NextResponse.json({ error: "Batch persistence could not be confirmed; do not retry automatically" }, { status: 503 });
    return NextResponse.json({ jobId: job!.id, calculatorId, version: calculator.published_version, rows: outputs });
  } catch (error) {
    if (error instanceof ApiAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Batch service unavailable" }, { status: 503 });
  }
}
