import type { Lead } from "@/types/pipeline";

export function MetricsHeader({ leads }: { leads: Lead[] }) {
  const active = leads.filter(
    (lead) => lead.status === "PENDING" || lead.status === "ENRICHING",
  ).length;
  const vip = leads.filter((lead) => lead.status === "VIP_QUALIFIED").length;
  const scored = leads.filter((lead) => lead.leadScore !== null);
  const average = scored.length
    ? Math.round(
        scored.reduce((sum, lead) => sum + (lead.leadScore ?? 0), 0) /
          scored.length,
      )
    : 0;
  const vipRate = leads.length
    ? Math.round(
        (leads.filter((lead) => (lead.leadScore ?? 0) >= 80).length /
          leads.length) *
          100,
      )
    : 0;
  const durations = leads.flatMap((lead) =>
    lead.logs
      .map((log) => log.durationMs)
      .filter((value): value is number => value !== null),
  );
  const latency = durations.length
    ? Math.round(
        durations.reduce((sum, value) => sum + value, 0) / durations.length,
      )
    : 0;

  const cards = [
    [
      "Total processed",
      leads.length.toLocaleString(),
      `${active} active`,
      "bg-blue-500",
    ],
    ["VIP qualification", `${vipRate}%`, `${vip} VIP leads`, "bg-emerald-500"],
    [
      "Average lead score",
      `${average}`,
      "0—100 quality index",
      "bg-violet-500",
    ],
    [
      "Avg. pipeline latency",
      `${latency.toLocaleString()} ms`,
      "End-to-end execution",
      "bg-amber-500",
    ],
  ] as const;

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([title, value, detail, color]) => (
        <div
          key={title}
          className="rounded-lg border border-zinc-800 bg-zinc-950/55 px-4 py-3"
        >
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
            {title}
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="font-mono text-2xl font-semibold tracking-tight text-zinc-100">
              {value}
            </div>
            <div className="pb-0.5 text-right text-xs text-zinc-500">
              {detail}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
