"use client";
import type { Lead, LeadStatus } from "@/types/pipeline";
import { ArrowRight, Building2, LoaderCircle, RotateCcw } from "lucide-react";

const columns: { title: string; statuses: LeadStatus[]; accent: string }[] = [
  {
    title: "Incoming & Enriching",
    statuses: ["PENDING", "ENRICHING"],
    accent: "border-t-blue-500/60",
  },
  {
    title: "VIP Qualified",
    statuses: ["VIP_QUALIFIED"],
    accent: "border-t-emerald-500/70",
  },
  {
    title: "Standard Nurture",
    statuses: ["STANDARD_NURTURE"],
    accent: "border-t-zinc-500/50",
  },
  {
    title: "Failed / Review",
    statuses: ["FAILED"],
    accent: "border-t-rose-500/70",
  },
];

export function PipelineKanban({
  leads,
  onInspect,
  onRetry,
}: {
  leads: Lead[];
  onInspect: (lead: Lead) => void;
  onRetry: (lead: Lead) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {columns.map((column) => {
        const items = leads.filter((lead) =>
          column.statuses.includes(lead.status),
        );
        const active =
          column.statuses.some(
            (status) => status === "PENDING" || status === "ENRICHING",
          ) && items.length > 0;
        return (
          <section
            key={column.title}
            className={`min-h-[280px] rounded-lg border border-zinc-800/80 border-t-2 bg-zinc-950/35 ${column.accent}`}
          >
            <div className="flex h-12 items-center justify-between border-b border-zinc-800/70 px-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                {column.title}
                <span className="rounded border border-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                  {items.length}
                </span>
              </div>
              {active ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-400" />
              ) : null}
            </div>
            <div className="space-y-2 p-2">
              {items.map((lead) => {
                const enriching =
                  lead.status === "ENRICHING" || lead.status === "PENDING";
                return (
                  <article
                    key={lead.id}
                    onClick={() => onInspect(lead)}
                    className={`group cursor-pointer rounded-md border bg-zinc-900/55 p-3 transition-all hover:-translate-y-0.5 hover:border-zinc-600 ${lead.status === "VIP_QUALIFIED" ? "border-zinc-800 border-l-emerald-500/70" : lead.status === "FAILED" ? "border-rose-900/50" : "border-zinc-800"}`}
                  >
                    {lead.status === "ENRICHING" ? (
                      <div className="-mx-3 -mt-3 mb-3 h-0.5 overflow-hidden rounded-t-md bg-blue-950">
                        <div className="shimmer h-full w-1/3 bg-blue-400" />
                      </div>
                    ) : null}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-zinc-100">
                          {lead.fullName}
                        </h3>
                        <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                          {lead.companyDomain}
                        </p>
                      </div>
                      {lead.leadScore !== null ? (
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm ${lead.status === "VIP_QUALIFIED" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 bg-zinc-800 text-zinc-300"}`}
                        >
                          {lead.leadScore}
                        </div>
                      ) : null}
                    </div>
                    {enriching ? (
                      <div className="mt-3 flex items-center gap-2 rounded border border-blue-500/15 bg-blue-500/5 px-2 py-1.5 text-[11px] text-blue-400">
                        <LoaderCircle className="h-3 w-3 animate-spin" />
                        {lead.status === "ENRICHING"
                          ? "Step 2/4: Querying firmographics"
                          : "Webhook queued"}
                      </div>
                    ) : null}
                    {lead.status === "VIP_QUALIFIED" ? (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] text-zinc-600">Est. ARR</p>
                          <p className="mt-0.5 font-mono text-zinc-300">
                            {lead.estimatedArr ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600">
                            Company size
                          </p>
                          <p className="mt-0.5 truncate text-zinc-300">
                            {lead.companySize ?? "—"}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {lead.techStack.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {lead.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[10px] text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {lead.status === "STANDARD_NURTURE" ? (
                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span className="rounded border border-zinc-800 px-1.5 py-1 text-zinc-500">
                          {lead.sourceChannel}
                        </span>
                        <span className="text-zinc-600">Nurture sequence</span>
                      </div>
                    ) : null}
                    {lead.status === "FAILED" ? (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="rounded border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[10px] text-rose-400">
                          Invalid domain schema
                        </span>
                        <button
                          title="Retry webhook"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRetry(lead);
                          }}
                          className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                    {lead.assignedRep ? (
                      <div className="mt-3 flex items-center gap-2 border-t border-zinc-800/70 pt-2 text-[11px] text-zinc-400">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800">
                          <Building2 className="h-3 w-3" />
                        </div>
                        <span className="truncate">{lead.assignedRep}</span>
                      </div>
                    ) : null}
                    <div className="mt-2 flex h-0 items-center justify-end overflow-hidden text-[10px] text-zinc-500 transition-all group-hover:h-4">
                      Inspect trace <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </article>
                );
              })}
              {items.length === 0 ? (
                <div className="flex h-24 items-center justify-center text-xs text-zinc-700">
                  No leads
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
