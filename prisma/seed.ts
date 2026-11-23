import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const samples = [
  ["Sarah Jenkins", "sarah@globalfintech.io", "globalfintech.io", "Web Form", "PENDING"],
  ["Marcus Liu", "marcus@cloudscale.dev", "cloudscale.dev", "LinkedIn Ad", "VIP_QUALIFIED"],
  ["Alex Rivera", "alex@localbakery.co", "localbakery.co", "Product Hunt", "STANDARD_NURTURE"],
  ["Priya Shah", "priya@acme-systems.com", "acme-systems.com", "API Webhook", "ENRICHING"],
  ["Theo Martin", "theo@broken.invalid", "broken.invalid", "Web Form", "FAILED"],
  ["Nina Okafor", "nina@northstar.ai", "northstar.ai", "LinkedIn Ad", "VIP_QUALIFIED"],
] as const;

async function main() {
  await prisma.pipelineLog.deleteMany();
  await prisma.lead.deleteMany();
  for (const [fullName, email, domain, source, status] of samples) {
    await prisma.lead.create({
      data: {
        fullName, email, companyDomain: domain, sourceChannel: source, status,
        rawMessage: "Interested in enterprise lead enrichment and automated pipeline routing.",
        leadScore: status === "VIP_QUALIFIED" ? 92 : status === "FAILED" ? 0 : status === "STANDARD_NURTURE" ? 58 : null,
        companySize: status === "VIP_QUALIFIED" ? "1,000–5,000 employees" : "11–50 employees",
        estimatedArr: status === "VIP_QUALIFIED" ? "$50M–$120M" : "$1M–$5M",
        techStack: status === "FAILED" ? [] : ["Next.js", "AWS", "PostgreSQL"],
        aiSummary: "Qualified from a seeded portfolio scenario.",
        assignedRep: status === "VIP_QUALIFIED" ? "Maya Chen · Enterprise AE" : "Nurture Automation",
        logs: { create: [{ stepName: "Webhook Ingested", status: "SUCCESS", durationMs: 82 }, { stepName: "Schema Validated", status: status === "FAILED" ? "FAILED" : "SUCCESS", durationMs: 126 }] },
      },
    });
  }
}
main().finally(() => prisma.$disconnect());
