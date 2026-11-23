import { z } from "zod";

export const IngestSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  companyDomain: z.string().trim().min(3).max(160),
  sourceChannel: z.enum(["Web Form", "LinkedIn Ad", "API Webhook", "Product Hunt"]),
  inquiryMessage: z.string().trim().max(2000).optional(),
});

export const N8nCallbackSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["PENDING", "ENRICHING", "VIP_QUALIFIED", "STANDARD_NURTURE", "FAILED"]),
  leadScore: z.number().int().min(0).max(100).optional(),
  companySize: z.string().optional(),
  estimatedArr: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  aiSummary: z.string().optional(),
  assignedRep: z.string().optional(),
  errorReason: z.string().optional(),
  stepName: z.string().optional(),
  stepStatus: z.enum(["SUCCESS", "RUNNING", "FAILED"]).optional(),
  durationMs: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});
