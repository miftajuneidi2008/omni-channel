import type { LeadStatus } from "@/types/pipeline";

export type FallbackResult = {
  status: LeadStatus;
  leadScore: number;
  companySize: string;
  estimatedArr: string;
  techStack: string[];
  aiSummary: string;
  assignedRep: string;
};

export function enrichLocally(fullName: string, domain: string, message = "") : FallbackResult {
  const enterprise = /global|enterprise|fintech|bank|saas|tech|cloud/i.test(`${domain} ${message}`);
  const corrupted = domain.includes("invalid") || domain.length < 4;

  if (corrupted) {
    return {
      status: "FAILED",
      leadScore: 0,
      companySize: "Unknown",
      estimatedArr: "$0",
      techStack: [],
      aiSummary: "Payload validation failed: the company domain schema is invalid.",
      assignedRep: "RevOps Queue",
    };
  }

  if (enterprise) {
    return {
      status: "VIP_QUALIFIED",
      leadScore: 94,
      companySize: "1,000–5,000 employees",
      estimatedArr: "$50M–$120M",
      techStack: ["Next.js", "AWS", "Stripe", "PostgreSQL"],
      aiSummary: `High-intent enterprise prospect. ${fullName} is exploring a platform expansion and should receive a technical discovery call from an enterprise AE.`,
      assignedRep: "Maya Chen · Enterprise AE",
    };
  }

  return {
    status: "STANDARD_NURTURE",
    leadScore: 54,
    companySize: "11–50 employees",
    estimatedArr: "$1M–$5M",
    techStack: ["React", "Shopify", "Google Cloud"],
    aiSummary: `Good-fit growth prospect. ${fullName} shows a mid-intent signal and is best routed into the automated nurture sequence.`,
    assignedRep: "Nurture Automation",
  };
}
