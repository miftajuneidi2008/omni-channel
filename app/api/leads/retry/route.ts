import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { enrichLocally } from "@/lib/fallback-engine";

const RetrySchema = z.object({ leadId: z.string().min(1) });

export async function POST(request: NextRequest) {
  const parsed = RetrySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid retry payload" }, { status: 400 });
  try {
    const lead = await prisma.lead.findUnique({ where: { id: parsed.data.leadId } });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: "ENRICHING",
        logs: { create: { stepName: "Pipeline Re-run Started", status: "RUNNING", durationMs: null } },
      },
    });

    const result = enrichLocally(lead.fullName, lead.companyDomain, lead.rawMessage ?? "");
    setTimeout(async () => {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { ...result, logs: { create: [
          { stepName: "Firmographics Re-enriched", status: "SUCCESS", durationMs: 580 },
          { stepName: result.status === "FAILED" ? "CRM Routing Rejected" : "CRM Re-routed", status: result.status === "FAILED" ? "FAILED" : "SUCCESS", durationMs: 310 },
        ] } },
      }).catch((error: unknown) => console.error("Retry enrichment failed", error));
    }, 900);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Retry failed" }, { status: 500 });
  }
}
