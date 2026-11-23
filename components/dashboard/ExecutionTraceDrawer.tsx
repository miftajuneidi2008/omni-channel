"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Lead } from "@/types/pipeline";
import { Check, Copy, LoaderCircle, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";

export function ExecutionTraceDrawer({
  lead,
  open,
  setOpen,
  onRetry,
}: {
  lead: Lead | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onRetry: (lead: Lead) => void;
}) {
  if (!lead) return null;
  const raw = {
    leadId: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    companyDomain: lead.companyDomain,
    sourceChannel: lead.sourceChannel,
    inquiryMessage: lead.rawMessage,
  };
  const enriched = {
    leadId: lead.id,
    status: lead.status,
    leadScore: lead.leadScore,
    estimatedArr: lead.estimatedArr,
    companySize: lead.companySize,
    techStack: lead.techStack,
    aiSummary: lead.aiSummary,
    assignedRep: lead.assignedRep,
  };
  const copy = async (value: object) => {
    await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    toast.success("JSON copied to clipboard");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="fixed right-0 top-0 z-50 h-full w-[min(640px,calc(100%-1rem))] overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <SheetTitle className="text-lg">{lead.fullName}</SheetTitle>
            <SheetDescription className="mt-1 font-mono text-[11px] text-zinc-500">
              {lead.email} · {lead.companyDomain}
            </SheetDescription>
          </div>
          <Button variant="outline" onClick={() => onRetry(lead)}>
            <RotateCcw className="h-3.5 w-3.5" />
            Re-run Pipeline
          </Button>
        </div>
        <section className="mt-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
            AI qualification
          </p>
          <div className="rounded-md border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-sm leading-6 text-zinc-300">
              {lead.aiSummary ??
                "AI intent analysis is pending. The pipeline is currently processing this lead."}
            </p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-md border border-zinc-800 p-3">
              <p className="text-[10px] text-zinc-600">Lead score</p>
              <p className="mt-1 font-mono text-xl">{lead.leadScore ?? "—"}</p>
            </div>
            <div className="rounded-md border border-zinc-800 p-3">
              <p className="text-[10px] text-zinc-600">Est. ARR</p>
              <p className="mt-1 font-mono text-sm">
                {lead.estimatedArr ?? "—"}
              </p>
            </div>
            <div className="rounded-md border border-zinc-800 p-3">
              <p className="text-[10px] text-zinc-600">Company size</p>
              <p className="mt-1 text-xs">{lead.companySize ?? "—"}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {lead.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400"
              >
                {tech}
              </span>
            ))}
            <span className="ml-auto text-xs text-zinc-500">
              Owner:{" "}
              <span className="text-zinc-300">
                {lead.assignedRep ?? "Unassigned"}
              </span>
            </span>
          </div>
        </section>
        <section className="mt-6">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
            n8n execution timeline
          </p>
          <div className="relative space-y-0 before:absolute before:bottom-4 before:left-[11px] before:top-4 before:w-px before:bg-zinc-800">
            {lead.logs.map((log, index) => (
              <div key={log.id} className="relative  flex gap-3 pb-5">
                <div
                  className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-zinc-950 ${log.status === "SUCCESS" ? "border-emerald-500/40 text-emerald-400" : log.status === "FAILED" ? "border-rose-500/40 text-rose-400" : "border-blue-500/40 text-blue-400"}`}
                >
                  {log.status === "SUCCESS" ? (
                    <Check className="h-3 w-3" />
                  ) : log.status === "FAILED" ? (
                    <X className="h-3 w-3" />
                  ) : (
                    <LoaderCircle className="h-3 w-3 animate-spin" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-300">
                      {index + 1}. {log.stepName}
                    </p>
                    <span className="font-mono text-[10px] text-zinc-600">
                      {log.durationMs ?? 0} ms
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </p>
                  {log.metadata ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-[10px] text-zinc-500">
                        Step metadata
                      </summary>
                      <pre className="mt-2 overflow-x-auto rounded border border-zinc-800 bg-black/30 p-2 text-[10px] text-zinc-400">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </details>
                  ) : null}
                </div>
              </div>
            ))}
            {lead.logs.length === 0 ? (
              <p className="relative bg-zinc-950 pl-9 text-xs text-zinc-600">
                Waiting for pipeline events…
              </p>
            ) : null}
          </div>
        </section>
        <section className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
              Payload inspector
            </p>
          </div>
          <Tabs defaultValue="raw">
            <TabsList className="flex rounded-md border border-zinc-800 bg-zinc-950 p-1">
              <TabsTrigger
                value="raw"
                className="flex-1 rounded px-2 py-1.5 text-xs data-[state=active]:bg-zinc-800"
              >
                Raw input JSON
              </TabsTrigger>
              <TabsTrigger
                value="callback"
                className="flex-1 rounded px-2 py-1.5 text-xs data-[state=active]:bg-zinc-800"
              >
                Enriched callback
              </TabsTrigger>
            </TabsList>
            <TabsContent value="raw">
              <div className="relative mt-2">
                <button
                  onClick={() => copy(raw)}
                  className="absolute right-2 top-2 rounded border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-500"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <pre className="max-h-64 overflow-auto rounded-md border border-zinc-800 bg-black/30 p-3 pr-10 text-[11px] leading-5 text-zinc-400">
                  {JSON.stringify(raw, null, 2)}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="callback">
              <div className="relative mt-2">
                <button
                  onClick={() => copy(enriched)}
                  className="absolute right-2 top-2 rounded border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-500"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <pre className="max-h-64 overflow-auto rounded-md border border-zinc-800 bg-black/30 p-3 pr-10 text-[11px] leading-5 text-zinc-400">
                  {JSON.stringify(enriched, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </SheetContent>
    </Sheet>
  );
}
