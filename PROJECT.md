# AEGIS — project handoff

## One-line goal

Build AEGIS: a real-time security control plane that sits between AI agents and company systems, stopping dangerous actions and reducing privacy exposure before an agent can act.

## The problem we solve

Companies are giving coding agents and internal assistants access to files, databases, cloud services, and tools. Static permissions are not enough: an agent can misunderstand an environment, attempt a destructive action, or gradually collect enough safe-looking answers to reconstruct sensitive information.

AEGIS checks each tool request in context before it reaches a protected system. It decides whether to allow the action, return a masked result, require human approval, deny it, or contain the agent session.

### Why specific access alone is not enough

Giving an agent a limited database role is necessary, but it does not answer whether the request fits the current task, whether the target is really staging, whether several earlier results already expose too much, or whether a permitted action has a dangerous blast radius. A system prompt is also not a security control: the agent may misunderstand, be manipulated by untrusted content, or simply make a bad decision.

AEGIS enforces rules outside the model. It independently checks the request at the tool gateway before the protected system can perform it.

## Product promise

An operator can watch one agent session in real time and understand:

- what the agent asked to do;
- which assets and dependencies would be affected;
- what data was protected or transformed;
- why AEGIS allowed, masked, approved, blocked, or contained the request; and
- what evidence was recorded for later review.

AEGIS must never claim that it can show an AI model's hidden chain-of-thought. The product displays observable requests, tool calls, sanitized inputs and results, AEGIS's policy evaluation, blast-radius assessment, and audit events.

## Conceptual architecture

```text
User
  ↓
AEGIS Control Room (dashboard)
  ↓ real-time event stream
AEGIS Control Plane
  ├─ AgentGuard: policy decision point
  ├─ Data DNA: identity and handling rules for protected assets
  ├─ Security Twin: asset and dependency graph for impact assessment
  ├─ PRISM: cumulative privacy-exposure tracker
  └─ Evidence Ledger: tamper-evident audit record
  ↓
AEGIS MCP / tool gateway
  ↓
Sandboxed agent runner (Codex or Claude Code)
  ↓
Fake demo systems first; later, approved real systems
```

The browser is the control room, not the place where the agent runs. A separate local or containerized runner will execute Codex or Claude Code. The agent will receive only AEGIS-controlled tools through the gateway; it must not have raw database or cloud credentials.

## Core modules

### AgentGuard

The enforcement point between the agent and tools. Every action returns one of five decisions:

- **ALLOW** — action fits the task, policy, environment, and risk level.
- **MASK** — allow a minimized/tokenized/aggregated result.
- **APPROVAL** — pause for a named human approver.
- **DENY** — block the action.
- **CONTAIN** — revoke the agent's temporary capabilities and close write paths.

### Data DNA

Every protected asset gets a machine-enforced identity card. It contains:

- owner and business purpose;
- classification and environment;
- fields that need protection;
- allowed agent permission(s);
- default response treatment, such as masking or aggregation;
- dependency links; and
- integrity/provenance information.

Data DNA stores policy metadata, not a second copy of the underlying database. Protection happens at retrieval time.

### Security Twin

A compact model of company assets and their dependencies. It estimates blast radius before an action runs. Example:

```text
Agent → Finance application → Payroll database → Immutable backup
```

An attempted delete against the payroll database should expose that it affects payroll operations and recovery capability, even if the agent thought it was acting on staging.

### PRISM

Tracks cumulative disclosure over an agent session. A single answer may be safe, but several answers together may identify a person or reconstruct sensitive data. PRISM maintains an exposure budget and can cause later answers to be masked or denied.

### Evidence Ledger

Records the request, policy inputs, decision, redactions, impact assessment, and outcome. This is the explainable record shown to the operator.

## Required demo scenarios

The finished demonstration must support these three clear stories:

1. **Safe request:** an agent reads a permitted finance summary in staging. AEGIS allows it, returning only the approved scoped result.
2. **Dangerous mutation:** an agent tries to delete the payroll database, believing it is a test resource. Security Twin identifies the production target and backup impact; AgentGuard denies it and records the event.
3. **Slow privacy reconstruction:** an agent asks several harmless-looking questions that cumulatively expose employee information. PRISM increases the disclosure budget and causes the later response to be masked or denied.

These scenarios demonstrate cybersecurity and privacy together. The first two show action safety; the third shows privacy protection over time.

## Demo company

Use the fictional company **Northstar Logistics**. The current finance scope includes:

- Finance application — staging service, read-only reconciliation workflows
- Payroll database — production, restricted financial and employee information
- Ledger export — restricted finance files
- Immutable backup — vaulted recovery system; agents cannot retrieve it directly

Never use real personal or company data in the demo.

## Current build state

The application is a polished React/Vinext and Tailwind control room with a local, server-side AEGIS demo gateway and a narrow local MCP server. The visual registry, twin, and policy library still use fictional mock data; protected requests execute through local API routes and are streamed back to the dashboard. A fresh Codex CLI session discovered the registered MCP server and completed both the masked finance read and the denied payroll-deletion test.

The current activity feed receives local gateway and MCP-client events. The local gateway evaluates reusable rules, including a real in-memory containment state that stops later requests. Data DNA selection remains a browser interaction. The verified Codex test used the local gateway only; no real company system or production credential was involved. A server-only Supabase Postgres adapter and restricted-function migration are now ready for an opt-in fictional database connection; without `AEGIS_DATABASE_URL`, the gateway safely uses the local fictional fixture.

### Completed

- AEGIS Control Room with a responsive security dashboard.
- Persistent **Dark** and **Light** themes.
- Simulated security-check and containment interactions.
- Live activity view with allow/mask/block/contain states.
- PRISM privacy-budget visualization.
- Security Twin visual preview in the Control Room.
- Interactive **Data DNA Registry**. Selecting an asset updates its owner, purpose, classification, fields, handling rule, permission, and dependencies.
- Interactive **Security Twin workspace**. Operators can evaluate a demo payroll-summary read or payroll-database deletion, see the dependency path, production and backup impact, risk score, recommended AgentGuard decision, and the protected response that would return to an agent.
- Interactive **Policy Library**. Operators can inspect the demo enforcement rules for finance reads, production mutations, cumulative privacy disclosure, and recovery-vault access, including match conditions, enforcement actions, and recorded evidence.
- Unified mock domain model for protected assets, agent actions, policy decisions, session metadata, and audit events. Control Room, Data DNA, Security Twin, and Policy Library now consume the same typed demo data.
- Local AEGIS demo gateway with an allowlisted request API and Server-Sent Event stream. The Control Room receives real local gateway events after a request runs.
- A protected fake payroll-system endpoint that rejects direct access. It is reachable only through the gateway implementation, so the browser and future agents are never given a direct database route or credential.
- Executable local demo scenarios: a masked payroll summary, cumulative employee-identity privacy checks, and a denied payroll deletion. The gateway returns aggregate or tokenized data only, and it records event evidence for each decision.
- Local stdio MCP server at `mcp/aegis-server.mjs`. It exposes exactly three validated AEGIS tools: a protected finance summary, a PRISM-controlled employee lookup, and a deliberately denied payroll-deletion test.
- The MCP server has no company-system client or credential. It forwards each declared tool request to the local AEGIS gateway, so gateway policy—not model instructions or tool metadata—determines the returned result.
- The MCP server is registered as `aegis-demo` in this workstation's Codex configuration. A fresh Codex CLI session discovered it, returned a `MASK` finance summary through `finance-read-boundary`, and received a `DENY` for the payroll-deletion test through `production-mutation-guard` before the fake system was called.
- Reusable local AgentGuard policy evaluator. Gateway decisions are now resolved from the finance-read, PRISM disclosure, and production-mutation policy definitions rather than from UI-specific button logic.
- Real local session containment. After a high-risk request is denied, an operator can revoke the session's temporary AEGIS capabilities; later tool requests return `CONTAIN` and no protected-system call is released.
- Database-ready protected retrieval adapter. The gateway can connect server-side to a fictional Supabase Postgres project using an `aegis_gateway` role with execute-only access to aggregate/tokenized functions. The migration keeps raw fictional payroll tables private; agents, MCP, browser code, and source control receive no database connection value.
- Private published preview: `https://aegis-agent-security.nehitha320.chatgpt.site`
- Private source repository: `https://github.com/nehitha-ss/aegis-agent-security`

### Not implemented yet — do not represent these as live

- Persistent backend storage, authentication, or a durable audit ledger.
- A real Security Twin graph engine.
- Real PRISM disclosure scoring.
- Sandboxed Codex or Claude Code runner.
- Live event streaming from an actual agent.
- Connection to real company infrastructure.

## Code map

| Location | Purpose |
| --- | --- |
| `app/page.tsx` | Current AEGIS user interface and local interaction state. |
| `app/globals.css` | Design tokens and the dark/light theme mapping. |
| `lib/aegis-demo.ts` | Shared typed mock data for assets, requests, policy decisions, and audit events. |
| `lib/aegis-runtime.ts` | Local gateway evaluation and Server-Sent Event runtime. |
| `mcp/aegis-server.mjs` | Local stdio MCP door that exposes the three AEGIS-protected tools to Codex. |
| `app/layout.tsx` | Page metadata. |
| `public/favicon.svg` | AEGIS shield favicon. |
| `AGENTS.md` | Mandatory instructions for future coding agents. |
| `PROJECT.md` | This product handoff and roadmap. |

## Product and design guardrails

- This is an internal security control room, not a landing page or generic chatbot dashboard.
- Keep the dark control-room aesthetic and the crisp light workspace equivalent. Theme switching must remain available and remembered.
- Use concrete, realistic product language. Avoid hype and generic AI wording.
- The product should feel designed for a serious security operator, never like a generic AI-generated demo.
- Keep the primary working surface visible immediately; do not add a marketing hero.
- Build each feature as a usable interaction, not only decorative UI.
- Use fictional demo data only.
- Preserve accessibility: clear labels, keyboard-friendly controls, readable contrast, and responsive layout.
- Do not add a model API key to browser code or expose secrets in the UI.

## Security rules that must remain true

1. The agent has no direct production credentials.
2. The tool gateway verifies task scope, environment, purpose, Data DNA, and impact before access.
3. Sensitive output is tokenized, masked, or aggregated before it goes back to the agent.
4. High-impact mutations require a human approval or are denied.
5. Session capability tokens are temporary and revocable.
6. The demo never presents simulated events as evidence of a real model integration.
7. AEGIS is an external enforcement layer: it must remain safe even if the agent misunderstands or ignores a natural-language instruction.

## Delivery roadmap

### Next build slice — fictional Supabase connection, durable evidence, and approvals

Create the isolated Supabase demo project and wire its restricted `aegis_gateway` connection into local `.env.local`. Then persist policy decisions, PRISM state, and containment records outside the running local process. Add an explicit human-approval queue for recovery-vault access, with short-lived approved capabilities and an auditable approver record.

### Verified integration — Codex MCP

A fresh local Codex CLI session discovered `aegis-demo`, called the read-only finance-summary tool, and received a masked aggregate-only result. With Codex's tool approval enabled, it then called the fictional payroll-deletion tool; AEGIS denied it before the fake protected system was called. A future controlled runner should additionally capture this activity in a persistent evidence ledger.

### Final integration phase — real coding agents

Run Codex and Claude Code separately inside controlled local/container runners. Configure each to call only the AEGIS MCP tools. Stream tool requests and policy outcomes to the dashboard. Start against the fake company environment; do not connect a real production database during the project build.

## How to continue on another laptop

The source repository is private and ready: `https://github.com/nehitha-ss/aegis-agent-security`

1. On the other laptop, sign in to the same GitHub account.
2. Download the private repository and open the `aegis-agent-security` folder in Codex.
3. Run `npm install`, then `npm run dev` when you want a local preview.
4. Tell Codex: **“Read `AGENTS.md` and `PROJECT.md`, then continue the next build slice without changing the stated product goal.”**
5. Ask it to make one completed slice at a time and update `PROJECT.md` after each meaningful change.

### Sync routine

- Before starting work: download the newest changes from GitHub.
- After a completed slice: save the work with a clear message and upload it to GitHub.
- On the other laptop: download the newest changes before editing.
- Do not edit both laptops at once—finish, save, and synchronize on one before switching to the other.

### Publishing rule

GitHub stores the source code, but it does **not** automatically update the private AEGIS preview. Keep `.openai/hosting.json` unchanged. When a real product slice is ready, use the existing Sites publishing workflow from Codex while signed into the same owner account; do not create a second AEGIS Site.

## Local checks

```bash
npm install
npm run dev
npm run build
```

Run the build after every completed slice. Do not delete the existing Site configuration or replace the current framework structure.
