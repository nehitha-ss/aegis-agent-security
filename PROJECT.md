# AEGIS — project handoff

## One-line goal

Build AEGIS: a real-time security control plane that sits between AI agents and company systems, stopping dangerous actions and reducing privacy exposure before an agent can act.

## The problem we solve

Companies are giving coding agents and internal assistants access to files, databases, cloud services, and tools. Static permissions are not enough: an agent can misunderstand an environment, attempt a destructive action, or gradually collect enough safe-looking answers to reconstruct sensitive information.

AEGIS checks each tool request in context before it reaches a protected system. It decides whether to allow the action, return a masked result, require human approval, deny it, or contain the agent session.

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

## Demo company

Use the fictional company **Northstar Logistics**. The current finance scope includes:

- Finance application — staging service, read-only reconciliation workflows
- Payroll database — production, restricted financial and employee information
- Ledger export — restricted finance files
- Immutable backup — vaulted recovery system; agents cannot retrieve it directly

Never use real personal or company data in the demo.

## Current build state

The application is a polished client-side dashboard built with React/Vinext and Tailwind. Current functionality is intentionally simulated; it demonstrates product behavior while the real runner is not yet connected.

### Completed

- AEGIS Control Room with a responsive security dashboard.
- Persistent **Dark** and **Light** themes.
- Simulated security-check and containment interactions.
- Live activity view with allow/mask/block/contain states.
- PRISM privacy-budget visualization.
- Security Twin visual preview in the Control Room.
- Interactive **Data DNA Registry**. Selecting an asset updates its owner, purpose, classification, fields, handling rule, permission, and dependencies.
- Private published preview: `https://aegis-agent-security.nehitha320.chatgpt.site`

### Not implemented yet — do not represent these as live

- Backend API, database, authentication, or persistent audit ledger.
- A real Security Twin graph engine.
- Real PRISM disclosure scoring.
- MCP gateway and policy-enforced tool server.
- Sandboxed Codex or Claude Code runner.
- Live event streaming from an actual agent.
- Connection to real company infrastructure.

## Code map

| Location | Purpose |
| --- | --- |
| `app/page.tsx` | Current AEGIS user interface and local interaction state. |
| `app/globals.css` | Design tokens and the dark/light theme mapping. |
| `app/layout.tsx` | Page metadata. |
| `public/favicon.svg` | AEGIS shield favicon. |
| `AGENTS.md` | Mandatory instructions for future coding agents. |
| `PROJECT.md` | This product handoff and roadmap. |

## Product and design guardrails

- This is an internal security control room, not a landing page or generic chatbot dashboard.
- Keep the dark control-room aesthetic and the crisp light workspace equivalent. Theme switching must remain available and remembered.
- Use concrete, realistic product language. Avoid hype and generic AI wording.
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

## Delivery roadmap

### Next build slice — Security Twin workspace

Build the **Security Twin** navigation view as the next finished slice.

- Reuse the same four demo assets from Data DNA; do not create a conflicting asset list.
- Show their dependency graph and an action-impact panel.
- Let the operator select an action such as `Read payroll summary` or `Delete payroll database`.
- Show direct dependencies, affected business function, backup impact, risk score, and recommended AgentGuard decision.
- Keep this simulation clearly labelled as demo data.

### After that — unified event model

Create shared TypeScript models for assets, Data DNA, agent requests, policy decisions, and audit events. Replace isolated UI constants with one mock data source that drives Control Room, Data DNA, and Security Twin consistently.

### Then — fake company API and real-time stream

Implement a local fake systems service with safe endpoints for reading payroll summaries, searching employees, changing permissions, and attempting destructive actions. Add a Server-Sent Events or WebSocket stream so the dashboard receives events as they occur.

### Then — policy gateway

Implement AgentGuard with policy evaluation, Data DNA transformations, PRISM exposure accounting, approval state, denial, and containment. The gateway should be the only route from agents to demo systems.

### Final integration phase — real coding agents

Run Codex and Claude Code separately inside controlled local/container runners. Configure each to call only the AEGIS MCP tools. Stream tool requests and policy outcomes to the dashboard. Start against the fake company environment; do not connect a real production database during the project build.

## How to continue on another laptop

1. Open the same source folder from the shared private repository.
2. Start Codex in that folder.
3. Tell Codex: **“Read `AGENTS.md` and `PROJECT.md`, then continue the next build slice without changing the stated product goal.”**
4. Ask it to make one completed slice at a time and update `PROJECT.md` after each meaningful change.

Before using a second laptop, set up a private GitHub repository or another reliable source-control remote for this folder. The published AEGIS link is for viewing the app; source control is what keeps editable code synchronized between laptops.

## Local checks

```bash
npm install
npm run dev
npm run build
```

Run the build after every completed slice. Do not delete the existing Site configuration or replace the current framework structure.
