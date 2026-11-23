export type LeadStatus = "PENDING" | "ENRICHING" | "VIP_QUALIFIED" | "STANDARD_NURTURE" | "FAILED";

export type PipelineLog = {
  id: string;
  leadId: string;
  stepName: string;
  status: "SUCCESS" | "RUNNING" | "FAILED";
  durationMs: number | null;
  metadata: unknown;
  createdAt: string;
};

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  companyDomain: string;
  sourceChannel: string;
  rawMessage: string | null;
  status: LeadStatus;
  leadScore: number | null;
  companySize: string | null;
  estimatedArr: string | null;
  techStack: string[];
  aiSummary: string | null;
  assignedRep: string | null;
  logs: PipelineLog[];
};
