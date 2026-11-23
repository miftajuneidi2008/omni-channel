import { enrichLocally } from "@/lib/fallback-engine";
import { prisma } from "@/lib/prisma";
import { IngestSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const parsed = IngestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { inquiryMessage, ...leadData } = parsed.data;
  const lead = await prisma.lead.create({
    data: {
      ...leadData,
      rawMessage: inquiryMessage,
      status: "PENDING",
      logs: {
        create: [
          { stepName: "Webhook Ingested", status: "SUCCESS", durationMs: 38 },
        ],
      },
    },
  });

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  let engineStatus = "fallback";

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret":
            process.env.WEBHOOK_SECRET ?? "nexusflow-secret-2026",
        },
        body: JSON.stringify({
          leadId: lead.id,
          callbackUrl: "/api/leads/callback",
          lead: parsed.data,
        }),
        signal: AbortSignal.timeout(2500),
      });
      console.log("n8n response status:", response);
      if (response.ok) engineStatus = "n8n";
    } catch {
      engineStatus = "fallback";
    }
  }

  if (engineStatus === "fallback") {
    const result = enrichLocally(
      lead.fullName,
      lead.companyDomain,
      lead.rawMessage ?? "",
    );
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: "ENRICHING",
        logs: {
          create: {
            stepName: "Local Fallback Enriching",
            status: "RUNNING",
            durationMs: 240,
          },
        },
      },
    });
    setTimeout(async () => {
      try {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            ...result,
            logs: {
              create: [
                {
                  stepName: "Firmographics Enriched",
                  status: "SUCCESS",
                  durationMs: 620,
                },
                {
                  stepName:
                    result.status === "FAILED"
                      ? "CRM Routing Rejected"
                      : "CRM Routed",
                  status: result.status === "FAILED" ? "FAILED" : "SUCCESS",
                  durationMs: 340,
                },
              ],
            },
          },
        });
      } catch (error) {
        console.error("Fallback enrichment failed", error);
      }
    }, 900);
  }

  return NextResponse.json({ leadId: lead.id, engineStatus }, { status: 201 });
}
