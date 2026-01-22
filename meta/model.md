# Product Model

The mental model users should build about what Tero is and how it works.

## What Tero Is

Tero is a control plane for observability data.

A control plane manages desired state. Kubernetes has a control plane that enforces how workloads should run. Tero enforces how observability data should look: what's valuable, what's waste, what should be fixed.

To users, Tero is the thing they interact with. They connect their stack, Tero builds understanding, proposes policies, and enforces them.

## Two Core Concepts

### Master Catalog

The Master Catalog is Tero's unified view of all observability data (services, log events, metrics, traces) across every source you connect.

Not sampling. Not partial visibility. Complete coverage, automatically maintained, semantically understood. Tero knows what each piece of data means, not just its format.

For each piece of telemetry, Tero builds understanding across four dimensions:
- **Structure.** Fields, types, formats. What the data looks like.
- **Semantics.** What it means. A `payment_failed` log is a business event, not just a string.
- **Relationships.** Which service emits it. What other events correlate with it.
- **Usage.** How often it's queried. Whether anyone actually looks at it.

This is what makes policy generation possible. Without understanding what data means and how it's used, you can only do pattern matching. With it, you can reason about value.

**Why this matters for docs:** Users need to understand that the catalog is the foundation. It's how Tero knows what's waste and what matters. The Master Catalog section explains services, log events, metrics, and trace spans.

### Policies

Policies are the artifact Tero produces. Each one is an atomic, portable statement about what's wrong with your data and how to fix it.

Policies are data quality as code: YAML documents you can inspect, version, and sync to repos.

Two sources:
- **Foundation policies** — Broad rules you write. Drop all debug logs. Redact CVV everywhere.
- **Generated policies** — Specific rules Tero creates per log event based on what it sees in the catalog.

Policy categories (what Tero detects):
- Redundant attributes
- Leftover debug logs
- Health checks
- PII leakage
- Bot traffic
- Malformed data
- Instrumentation bloat
- Excessive payloads
- Debug mode left on
- Logs in hot paths
- Burst protection
- High cardinality tags

Every category is objective. Each one is designed so any engineer looks at it and says "yes, that's obviously right." No judgment calls, no ambiguity.

**Why this matters for docs:** Users need to understand that policies are the output. The Policies section explains what they are, what categories exist, how they're enforced, and where they live.

## Supporting Concepts

### Enforcement

Where policies get executed:
- **Edge** — In your infrastructure, before data leaves
- **Provider** — Via API in Datadog, Splunk, etc.
- **Code** — PRs to fix instrumentation at the source
- **Tickets** — Delegate to engineers
- **Notify** — Alert without blocking
- **SLOs** — Track progress over time

### Integrations

Integrations connect external systems to Tero:
- **Observability platforms** (Datadog, Splunk) → Context + provider enforcement
- **Infrastructure** (Datadog Agent, OTel Collector) → Edge deployment
- **Code** (GitHub) → PR creation
- **AI** (Anthropic, OpenAI) → Bring your own AI provider

### Edge

Tero Edge is the execution layer. A lightweight proxy that enforces policies at line rate. Policies compile down to high-performance matching (Hyperscan).

Edge is documented in its own tab because it's about operating infrastructure, not using Tero.

## How the Concepts Relate

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   INTEGRATIONS bring in data and unlock capabilities        │
│                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │
│   │   Datadog   │     │   GitHub    │     │    Edge     │  │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘  │
│          │                   │                   │          │
│          ▼                   ▼                   ▼          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                  MASTER CATALOG                      │  │
│   │   Services, Log Events, Metrics, Trace Spans        │  │
│   └─────────────────────────┬───────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                      POLICIES                        │  │
│   │   Data quality as code — generated from catalog      │  │
│   └─────────────────────────┬───────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                    ENFORCEMENT                       │  │
│   │       Edge, Provider, Code, Tickets, Notify          │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The user journey:
1. **Connect integrations** → Data flows in, catalog builds
2. **Catalog grows** → Tero understands your systems
3. **Policies generate** → Specific statements about what's wrong
4. **Review and approve** → By category, with examples from your data
5. **Enforce** → Edge, provider, code, tickets

## The Master Catalog vs Data Catalog

Tero's Master Catalog is not a data catalog. It's a semantic catalog.

A data catalog tells you: "You have a field called `user_id` in a log called `payment_failed`."

A semantic catalog tells you: "This is a business-critical error indicating a transaction didn't complete. The `user_id` field is context for debugging. This event often follows a timeout in payment-service. It's queried during incidents 4x more than average."

The difference is understanding vs inventory. We don't just know what exists. We know what it means, when it matters, and how it connects.

This is what makes policy generation possible. Policies aren't pattern matching. They're reasoning about value based on semantic understanding.
