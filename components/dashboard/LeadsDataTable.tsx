"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lead, LeadStatus } from "@/types/pipeline";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

const filters: {
  label: string;
  value: "All" | "Active" | "VIP" | "Nurture" | "Failed";
}[] = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "VIP", value: "VIP" },
  { label: "Nurture", value: "Nurture" },
  { label: "Failed", value: "Failed" },
];

function matchesFilter(status: LeadStatus, filter: string) {
  if (filter === "All") return true;
  if (filter === "Active")
    return status === "PENDING" || status === "ENRICHING";
  if (filter === "VIP") return status === "VIP_QUALIFIED";
  if (filter === "Nurture") return status === "STANDARD_NURTURE";
  return status === "FAILED";
}

export function LeadsDataTable({
  leads,
  onInspect,
  onRetry,
}: {
  leads: Lead[];
  onInspect: (lead: Lead) => void;
  onRetry: (lead: Lead) => void;
}) {
  const [filter, setFilter] =
    useState<(typeof filters)[number]["value"]>("All");
  const filtered = leads.filter((lead) => matchesFilter(lead.status, filter));
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      <div className="flex items-center gap-1 border-b border-zinc-800 bg-zinc-950/40 px-3 py-2">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-md px-2.5 py-1.5 text-xs ${filter === item.value ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead & Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lead Score</TableHead>
              <TableHead>ARR & Size</TableHead>
              <TableHead>Tech Stack</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => {
              const latency = lead.logs.reduce(
                (sum, log) => sum + (log.durationMs ?? 0),
                0,
              );
              const statusClass =
                lead.status === "VIP_QUALIFIED"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : lead.status === "FAILED"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    : lead.status === "STANDARD_NURTURE"
                      ? "border-zinc-700 bg-zinc-800/50 text-zinc-300"
                      : "border-blue-500/20 bg-blue-500/10 text-blue-400";
              return (
                <TableRow
                  key={lead.id}
                  onClick={() => onInspect(lead)}
                  className="cursor-pointer"
                >
                  <TableCell>
                    <div className="font-medium text-zinc-200">
                      {lead.fullName}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-zinc-500">
                      {lead.companyDomain}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full border px-2 py-1 text-[10px] ${statusClass}`}
                    >
                      {lead.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-10 overflow-hidden rounded bg-zinc-800">
                        <div
                          className="h-full bg-zinc-300"
                          style={{ width: `${lead.leadScore ?? 0}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">
                        {lead.leadScore ?? "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs text-zinc-300">
                      {lead.estimatedArr ?? "—"}
                    </div>
                    <div className="mt-1 text-[11px] text-zinc-600">
                      {lead.companySize ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-44 flex-wrap gap-1">
                      {lead.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">
                    {lead.sourceChannel}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {latency ? `${latency} ms` : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onInspect(lead);
                        }}
                        className="rounded border border-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800"
                      >
                        Inspect
                      </button>
                      {lead.status === "FAILED" ? (
                        <button
                          title="Retry"
                          onClick={(event) => {
                            event.stopPropagation();
                            onRetry(lead);
                          }}
                          className="rounded border border-rose-900/50 p-1 text-rose-400"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
