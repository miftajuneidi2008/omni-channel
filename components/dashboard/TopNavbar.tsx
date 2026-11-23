"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  LoaderCircle,
  Moon,
  Plus,
  Search,
  Sun,
  Table2,
  Workflow,
} from "lucide-react";

export type ViewMode = "kanban" | "table";

export function TopNavbar({
  search,
  setSearch,
  view,
  setView,
  onSimulate,
  onBatch,
  batching,
  dark,
  setDark,
}: {
  search: string;
  setSearch: (value: string) => void;
  view: ViewMode;
  setView: (value: ViewMode) => void;
  onSimulate: () => void;
  onBatch: () => void;
  batching: boolean;
  dark: boolean;
  setDark: (value: boolean) => void;
}) {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900">
            <Workflow className="h-4 w-4 text-zinc-100" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-base font-semibold tracking-tight">
                NexusFlow
              </h1>
              <span className="hidden text-[10px] text-zinc-600 sm:inline">
                AI Lead Enrichment
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-amber-400" />
              </span>
              Local fallback simulator active
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1 lg:w-64 lg:flex-none">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-600" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search leads, domains, tech…"
              className="pl-8"
            />
          </div>
          <div className="flex rounded-md border border-zinc-800 bg-zinc-950 p-0.5">
            <button
              onClick={() => setView("kanban")}
              title="Kanban view"
              className={`rounded px-2 py-1.5 ${view === "kanban" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              title="Table view"
              className={`rounded px-2 py-1.5 ${view === "table" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <Table2 className="h-4 w-4" />
            </button>
          </div>
          <Button variant="outline" onClick={onBatch} disabled={batching}>
            {batching ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : null}
            Batch Fire (5)
          </Button>
          <Button
            onClick={onSimulate}
            className="bg-white text-zinc-950 hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Simulate Lead
          </Button>
          <button
            onClick={() => setDark(!dark)}
            title="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 hover:bg-zinc-900"
          >
            {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
