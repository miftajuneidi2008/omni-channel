import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { N8nCallbackSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const parsed = N8nCallbackSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid callback payload" }, { status: 400 });
  }

  const callbackSecret = process.env.N8N_CALLBACK_SECRET;
  if (callbackSecret && request.headers.get("x-nexus-secret") !== callbackSecret) {
    return NextResponse.json({ error: "Unauthorized callback" }, { status: 401 });
  }

  const data = parsed.data;
  await prisma.lead.update({
    where: { id: data.leadId },
    data: {
      status: data.status,
      leadScore: data.leadScore,
      companySize: data.companySize,
      estimatedArr: data.estimatedArr,
      techStack: data.techStack,
      aiSummary: data.aiSummary,
      assignedRep: data.assignedRep,
      logs: data.stepName ? { create: {
        stepName: data.stepName,
        status: data.stepStatus ?? "SUCCESS",
        durationMs: data.durationMs,
      } } : undefined,
    },
  });

  return NextResponse.json({ ok: true });
}
