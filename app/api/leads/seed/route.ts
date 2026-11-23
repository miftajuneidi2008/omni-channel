import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  await prisma.pipelineLog.deleteMany();
  await prisma.lead.deleteMany();

  const rows = [
    { fullName: "Sarah Jenkins", email: "sarah@globalfintech.io", companyDomain: "globalfintech.io", sourceChannel: "Web Form", status: "VIP_QUALIFIED" as const, leadScore: 94, companySize: "1,000–5,000 employees", estimatedArr: "$50M–$120M", techStack: ["Next.js", "AWS", "Stripe"], aiSummary: "High-intent enterprise prospect seeking a RevOps automation platform.", assignedRep: "Maya Chen · Enterprise AE" },
    { fullName: "Marcus Liu", email: "marcus@cloudscale.dev", companyDomain: "cloudscale.dev", sourceChannel: "LinkedIn Ad", status: "VIP_QUALIFIED" as const, leadScore: 89, companySize: "500–1,000 employees", estimatedArr: "$30M–$80M", techStack: ["React", "AWS", "PostgreSQL"], aiSummary: "Strong expansion signal from a high-growth engineering organization.", assignedRep: "Ethan Park · Enterprise AE" },
    { fullName: "Alex Rivera", email: "alex@localbakery.co", companyDomain: "localbakery.co", sourceChannel: "Product Hunt", status: "STANDARD_NURTURE" as const, leadScore: 58, companySize: "11–50 employees", estimatedArr: ["$1M–$5M"], techStack: ["React", "Shopify"], aiSummary: "Growth-stage prospect with moderate intent.", assignedRep: "Nurture Automation" },
    { fullName: "Priya Shah", email: "priya@acme-systems.com", companyDomain: "acme-systems.com", sourceChannel: "API Webhook", status: "ENRICHING" as const, leadScore: null, companySize: null, estimatedArr: null, techStack: [], aiSummary: null, assignedRep: null },
    { fullName: "Theo Martin", email: "theo@broken.invalid", companyDomain: "broken.invalid", sourceChannel: "Web Form", status: "FAILED" as const, leadScore: 0, companySize: "Unknown", estimatedArr: "$0", techStack: [], aiSummary: "Invalid domain schema blocked enrichment.", assignedRep: "RevOps Queue" },
    { fullName: "Nina Okafor", email: "nina@northstar.ai", companyDomain: "northstar.ai", sourceChannel: "LinkedIn Ad", status: "STANDARD_NURTURE" as const, leadScore: 72, companySize: "51–200 employees", estimatedArr: "$8M–$15M", techStack: ["Python", "GCP", "Snowflake"], aiSummary: "Technical buyer showing active comparison behavior.", assignedRep: "Nurture Automation" },
  ];

  for (const row of rows) {
    await prisma.lead.create({
      data: { ...row, estimatedArr: typeof row.estimatedArr === "string" ? row.estimatedArr : "$1M–$5M", rawMessage: "Interested in pipeline automation and B2B enrichment.", logs: { create: [
        { stepName: "Webhook Ingested", status: "SUCCESS", durationMs: 82 },
        { stepName: "Schema Validated", status: row.status === "FAILED" ? "FAILED" : "SUCCESS", durationMs: 126 },
        { stepName: row.status === "ENRICHING" ? "Firmographics Enriching" : "CRM Routed", status: row.status === "ENRICHING" ? "RUNNING" : "SUCCESS", durationMs: row.status === "ENRICHING" ? null : 340 },
      ] } },
    });
  }
  return NextResponse.json({ ok: true });
}
