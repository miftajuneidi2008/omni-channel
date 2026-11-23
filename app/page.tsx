"use client";

import { ExecutionTraceDrawer } from "@/components/dashboard/ExecutionTraceDrawer";
import { LeadsDataTable } from "@/components/dashboard/LeadsDataTable";
import { LeadSimulatorModal } from "@/components/dashboard/LeadSimulatorModal";
import { MetricsHeader } from "@/components/dashboard/MetricsHeader";
import { PipelineKanban } from "@/components/dashboard/PipelineKanban";
import { TopNavbar, type ViewMode } from "@/components/dashboard/TopNavbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead } from "@/types/pipeline";
import { useQuery } from "@tanstack/react-query";
import { Database, Plus, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

async function fetchLeads(): Promise<Lead[]> {
  const response = await fetch("/api/leads", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load leads");
  return (await response.json()).leads as Lead[];
}

export default function Home() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [search, setSearch] = useState("");
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [inspected, setInspected] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [batching, setBatching] = useState(false);
  const [dark, setDark] = useState(true);

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
    refetchInterval: (query) =>
      query.state.data?.some(
        (lead) => lead.status === "PENDING" || lead.status === "ENRICHING",
      )
        ? 2000
        : false,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const leads = leadsQuery.data ?? [];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) =>
      [lead.fullName, lead.email, lead.companyDomain, ...lead.techStack]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [leads, search]);

  const dispatch = async (data: {
    fullName: string;
    email: string;
    companyDomain: string;
    sourceChannel: "Web Form" | "LinkedIn Ad" | "API Webhook" | "Product Hunt";
    inquiryMessage: string;
  }) => {
    const response = await fetch("/api/leads/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      toast.error("Lead dispatch failed");
      return;
    }
    toast.success("Webhook dispatched to n8n — tracking live enrichment...");
    await leadsQuery.refetch();
  };

  const batch = async () => {
    setBatching(true);
    const samples = [
      [
        "Avery Stone",
        "avery@globalbank.io",
        "globalbank.io",
        "Enterprise lead expansion",
      ],
      [
        "Mia Chen",
        "mia@cloudscale.dev",
        "cloudscale.dev",
        "High-growth SaaS team",
      ],
      [
        "Noah Williams",
        "noah@northstar.ai",
        "northstar.ai",
        "AI platform evaluation",
      ],
      [
        "Olivia Park",
        "olivia@localbakery.co",
        "localbakery.co",
        "Small team CRM inquiry",
      ],
      [
        "Liam Foster",
        "liam@broken.invalid",
        "broken.invalid",
        "Malformed payload test",
      ],
    ] as const;
    await Promise.all(
      samples.map((item, index) =>
        fetch("/api/leads/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: item[0],
            email: item[1],
            companyDomain: item[2],
            sourceChannel: index % 2 ? "LinkedIn Ad" : "Web Form",
            inquiryMessage: item[3],
          }),
        }),
      ),
    );
    setBatching(false);
    toast.success("Batch of 5 leads dispatched");
    await leadsQuery.refetch();
  };

  const retry = async (lead: Lead) => {
    const response = await fetch("/api/leads/retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id }),
    });
    if (!response.ok) toast.error("Retry could not be started");
    else toast.success("Pipeline re-run started");
    await leadsQuery.refetch();
  };

  const inspect = (lead: Lead) => {
    setInspected(lead);
    setDrawerOpen(true);
  };
  const seed = async () => {
    await fetch("/api/leads/seed", { method: "POST" });
    toast.success("Seeded 6 sample leads");
    await leadsQuery.refetch();
  };

  useEffect(() => {
    const vip = leads.find(
      (lead) =>
        lead.status === "VIP_QUALIFIED" &&
        Date.now() - new Date(lead.updatedAt).getTime() < 8000,
    );
    if (vip)
      toast.success(
        `VIP Lead Qualified: ${vip.fullName} (Score: ${vip.leadScore})`,
      );
  }, [leads]);

  return (
    <div className="min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <TopNavbar
        search={search}
        setSearch={setSearch}
        view={view}
        setView={setView}
        onSimulate={() => setSimulatorOpen(true)}
        onBatch={batch}
        batching={batching}
        dark={dark}
        setDark={setDark}
      />
      <main className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6">
        {leadsQuery.isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-72" />
              ))}
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="mx-auto mt-24 max-w-md rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <Workflow className="h-5 w-5 text-zinc-400" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">
              Start your enrichment pipeline
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Seed realistic portfolio data or dispatch a custom lead through
              NexusFlow.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={seed}
                className="h-max px-3 py-1 leading-5 cursor-pointer"
              >
                <Database className="h-4 w-4 " />
                Seed 6 Sample Leads
              </Button>
              <Button
                onClick={() => setSimulatorOpen(true)}
                className="h-max px-3 py-1 leading-5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Simulate First Lead
              </Button>
            </div>
          </div>
        ) : (
          <>
            <MetricsHeader leads={filtered} />
            <div className="mt-4">
              {view === "kanban" ? (
                <PipelineKanban
                  leads={filtered}
                  onInspect={inspect}
                  onRetry={retry}
                />
              ) : (
                <LeadsDataTable
                  leads={filtered}
                  onInspect={inspect}
                  onRetry={retry}
                />
              )}
            </div>
          </>
        )}
      </main>
      <LeadSimulatorModal
        open={simulatorOpen}
        setOpen={setSimulatorOpen}
        onDispatch={dispatch}
      />
      <ExecutionTraceDrawer
        lead={inspected}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        onRetry={retry}
      />
    </div>
  );
}
