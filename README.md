# NexusFlow — Omnichannel AI Lead Enrichment & CRM Pipeline

An event-driven B2B RevOps and lead enrichment platform powered by **Next.js (App Router)** on the frontend and **n8n** as the asynchronous workflow orchestration backend.

NexusFlow simulates real-time inbound lead capture, domain validation, mock firmographic/technographic enrichment, lead scoring, and automated CRM routing—complete with live step-by-step execution traces and a local fallback simulator for instant portfolio demos.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APPLICATION (UI & API)                  │
│                                                                         │
│  [Lead Simulator UI] ──(1. POST)──▶ /api/leads/ingest                   │
│                                          │ (Creates 'PENDING' record)   │
│  [Live Kanban & Logs] ◀──(5. Poll)──────┤                               │
│                                          ▲ (4. POST Callback + Secret)  │
└──────────────────────────────────────────┼──────────────────────────────┘
                                           │
                     (2. Fire Webhook)     │
                             │             │
                             ▼             │
┌─────────────────────────────────────────────────────────────────────────┐
│                     N8N WORKFLOW ENGINE (ORCHESTRATOR)                  │
│                                                                         │
│  [Webhook Trigger] ──▶ [Validate Schema] ──▶ [3. Callback: ENRICHING]   │
│                                                       │                 │
│                                                       ▼                 │
│                                            [Mock Enrichment (Code)]     │
│                                                       │                 │
│  [7. HTTP Callback] ◀── [Score >= 80? (IF)] ◀────────┘                 │
│                          ├─ True  ──▶ VIP_QUALIFIED                    │
│                          └─ False ──▶ STANDARD_NURTURE                 │
└─────────────────────────────────────────────────────────────────────────┘
```
