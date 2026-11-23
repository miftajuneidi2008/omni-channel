"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Building2, Dices, Send, Store, TriangleAlert } from "lucide-react";
import { useState } from "react";

const presets = [
  {
    title: "Enterprise VIP",
    subtitle: "Sarah Jenkins · globalfintech.io",
    icon: Building2,
    name: "Sarah Jenkins",
    email: "sarah@globalfintech.io",
    domain: "globalfintech.io",
    message:
      "VP of Engineering evaluating a global lead enrichment platform for our enterprise sales team.",
  },
  {
    title: "SMB Startup",
    subtitle: "Alex Rivera · localbakery.co",
    icon: Store,
    name: "Alex Rivera",
    email: "alex@localbakery.co",
    domain: "localbakery.co",
    message:
      "Founder looking for a simple CRM and automated follow-up solution.",
  },
  {
    title: "Malformed Payload",
    subtitle: "Corrupted webhook test",
    icon: TriangleAlert,
    name: "Corrupted Webhook Test",
    email: "invalid@broken.invalid",
    domain: "broken.invalid",
    message: "Test invalid domain schema and failed callback handling.",
  },
];

export function LeadSimulatorModal({
  open,
  setOpen,
  onDispatch,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDispatch: (data: {
    fullName: string;
    email: string;
    companyDomain: string;
    sourceChannel: "Web Form" | "LinkedIn Ad" | "API Webhook" | "Product Hunt";
    inquiryMessage: string;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    companyDomain: string;
    sourceChannel: "Web Form" | "LinkedIn Ad" | "API Webhook" | "Product Hunt";
    inquiryMessage: string;
  }>({
    fullName: "",
    email: "",
    companyDomain: "",
    sourceChannel: "Web Form",
    inquiryMessage: "",
  });
  const [dispatching, setDispatching] = useState(false);
  const fillPreset = (preset: (typeof presets)[number]) =>
    setForm({
      fullName: preset.name,
      email: preset.email,
      companyDomain: preset.domain,
      sourceChannel: "Web Form",
      inquiryMessage: preset.message,
    });
  const randomize = () =>
    setForm({
      fullName: "Jordan Kim",
      email: `jordan${Math.floor(Math.random() * 900 + 100)}@cloudscale.dev`,
      companyDomain: "cloudscale.dev",
      sourceChannel: "LinkedIn Ad",
      inquiryMessage:
        "Engineering leader exploring high-intent account enrichment.",
    });
  const dispatch = async () => {
    setDispatching(true);
    await onDispatch(form);
    setDispatching(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
        <DialogTitle className="text-lg font-semibold">
          Lead Chaos Simulator
        </DialogTitle>
        <DialogDescription className="text-xs text-zinc-500">
          Dispatch realistic events into the live enrichment pipeline.
        </DialogDescription>
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            1-click scenarios
          </p>
          <div className="grid gap-2 md:grid-cols-3">
            {presets.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.title}
                  onClick={() => fillPreset(preset)}
                  className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-left transition hover:border-zinc-600 hover:bg-zinc-900"
                >
                  <Icon className="mb-3 h-4 w-4 text-zinc-400" />
                  <p className="text-xs font-semibold text-zinc-200">
                    {preset.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                    {preset.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="jane@company.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="domain">Company domain</Label>
            <Input
              id="domain"
              value={form.companyDomain}
              onChange={(event) =>
                setForm({ ...form, companyDomain: event.target.value })
              }
              placeholder="company.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="source">Source channel</Label>
            <Select
              id="source"
              value={form.sourceChannel}
              onChange={(event) =>
                setForm({
                  ...form,
                  sourceChannel: event.target
                    .value as typeof form.sourceChannel,
                })
              }
            >
              <option>Web Form</option>
              <option>LinkedIn Ad</option>
              <option>API Webhook</option>
              <option>Product Hunt</option>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="message">Inquiry message</Label>
            <textarea
              id="message"
              value={form.inquiryMessage}
              onChange={(event) =>
                setForm({ ...form, inquiryMessage: event.target.value })
              }
              className="min-h-20 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-600"
              placeholder="Describe the buyer intent…"
            />
          </div>
        </div>
        <div className="mt-5 flex justify-between border-t border-zinc-800 pt-4">
          <Button type="button" variant="outline" onClick={randomize}>
            <Dices className="h-4 w-4" />
            Fill Random Mock
          </Button>
          <Button
            type="button"
            onClick={dispatch}
            disabled={
              dispatching ||
              form.fullName.length < 2 ||
              form.email.length < 3 ||
              form.companyDomain.length < 3
            }
          >
            <Send className="h-4 w-4" />
            {dispatching ? "Dispatching…" : "Dispatch to n8n Pipeline"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
