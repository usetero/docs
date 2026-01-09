# Product Model

The mental model users should build about what Tero is and how it works.

## What Tero Is

Tero is an AI that understands your systems. You ask it questions, and it answers them using a deep semantic understanding of your telemetry data.

Not a dashboard platform. Not a pipeline. Not another place to send your data. An intelligence layer that connects to where your data already lives and builds understanding on top of it.

To users, Tero is the thing they interact with. There's no "workbench" or "platform"—there's Tero. They ask Tero questions. Tero shows them context. Tero helps them take action.

## Four Core Concepts

The product has four concepts that users need to understand:

### Questions

Questions are the interface to value. They're curated, QA'd use cases that Tero can answer.

The first question is: **"How much data is waste?"** This is the hardest question in observability—it requires complete visibility and semantic understanding of every piece of data. Answering it proves Tero actually understands.

Each question is a first-class thing:
- Announced when it launches
- Has its own documentation section
- Has a complete journey: understand the results, take action, scale to the org
- Gets marketing, attention, buzz

When you start a chat in Tero, the first thing that happens is routing. The AI determines which question you're asking, and your conversation happens within that use case. This lets us curate the experience, give the AI the right context, and guarantee quality.

If someone asks a question we don't support yet ("Why is checkout broken?"), we say so clearly rather than giving a bad answer. Over time, we add more questions. Each one is an announcement, a new capability, a reason to pay attention.

**Why this matters for docs:** Each question gets thorough documentation. The waste question has overview, understanding results, taking action, managing contracts, scaling to the org. Future questions get the same treatment.

### Context

Context is what makes Tero the best place to ask questions. It's a semantic catalog of everything happening in your infrastructure.

Not raw data—compressed understanding:
- **Log events**, not log lines. Billions of logs compressed into thousands of semantic events.
- **Support themes**, not tickets. Patterns of customer issues, not individual conversations.
- **Services** with meaning attached. What they do, how they relate, what they produce.
- **Failure scenarios.** Patterns of what goes wrong and how it manifests.
- **Relationships.** This error follows that timeout. This service depends on that one.

Context compounds. Every integration adds to it. Every conversation refines it. Relationships get established, understanding deepens. It's an investment that grows over time.

Context is transparent and explorable. Users can see what Tero knows about their systems, drill into any service or log event, and adjust classifications. It feels like *theirs*.

**Why this matters for docs:** Users need to understand what context Tero has, how it's structured, and how it grows. The Context section explains the semantic catalog.

### Capabilities

Capabilities are what Tero can do. Actions it can take on your behalf.

Examples:
- **Block logs** — Stop waste from reaching your vendor
- **Redact PII** — Scrub sensitive data before it leaves your network
- **Open PRs** — Create pull requests to fix issues in code
- **Create tickets** — File issues in your ticketing system
- **Send alerts** — Notify the right people when something matters
- **Configure exclusions** — Set up rules in your vendor's platform

Capabilities are unlocked by integrations. Connect Datadog → you can configure exclusion rules. Connect GitHub → you can open PRs. Connect the Edge → you can block at line rate.

Capabilities are shared across questions. "Block logs" isn't specific to waste—it's a capability that might be relevant for other questions too. The capability is the *what*; integrations provide the *how*.

**Why this matters for docs:** Users need to know what actions are available and how to use them. Capabilities may be documented at the top level or within specific questions depending on relevance.

### Integrations

Integrations are power-ups. They connect external systems to Tero, bringing in context and unlocking capabilities.

Each integration has a clear value proposition:
- **Datadog** → Context: services, log events, metrics. Capabilities: configure exclusions, search logs.
- **Slack** → Capabilities: send alerts, notify teams.
- **GitHub** → Capabilities: open PRs, link to code.
- **Jira/Linear** → Capabilities: create tickets, track work.
- **PagerDuty** → Capabilities: integrate with on-call, incident context.

The Edge is also an integration. It's Tero's execution layer deployed in your infrastructure:
- **Edge Proxy** → Capabilities: block at line rate, redact PII, enforce policies.
- **OTel Collector distribution** → Same capabilities, different deployment.
- **Vector distribution** → Same capabilities, for Vector users.

Integrations are how Tero becomes more valuable over time. Each one adds context and capabilities. The more you connect, the more Tero can do.

**Why this matters for docs:** Each integration gets a page explaining what context it provides and what capabilities it unlocks.

## How the Concepts Relate

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   INTEGRATIONS bring in CONTEXT and unlock CAPABILITIES    │
│                                                             │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │
│   │   Datadog   │     │    Slack    │     │   GitHub    │  │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘  │
│          │                   │                   │          │
│          ▼                   ▼                   ▼          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                      CONTEXT                         │  │
│   │   Services, Log Events, Metrics, Relationships...   │  │
│   └─────────────────────────┬───────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                     QUESTIONS                        │  │
│   │        "How much data is waste?"              │  │
│   │        "Why is checkout broken?" (future)           │  │
│   └─────────────────────────┬───────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                   CAPABILITIES                       │  │
│   │     Block logs, Open PRs, Create tickets...         │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The user journey:
1. **Connect integrations** → Context flows in, capabilities unlock
2. **Context builds** → Tero understands your systems
3. **Ask questions** → Get answers backed by semantic understanding
4. **Take action** → Use capabilities to make changes

## Components (Not Concepts)

Separate from the product concepts are the components—the actual pieces of software:

- **App** — The web interface where users interact with Tero
- **CLI** — Terminal interface for automation and power users
- **Control Plane** — The brain. Holds context, runs AI, generates policies. Cloud or self-hosted.
- **Edge** — Policy execution in your infrastructure. Proxy, distributions, libraries.

These are documented in separate tabs (Control Plane, Edge) because they're about operating Tero, not using it. The main Tero tab focuses on the product concepts; the component tabs focus on deployment and operations.

## The Semantic Catalog vs Data Catalog

Tero's context is not a data catalog. It's a semantic catalog.

A data catalog tells you: "You have a field called `user_id` in a log called `payment_failed`."

A semantic catalog tells you: "This is a business-critical error indicating a transaction didn't complete. The `user_id` field is context for debugging. This event often follows a timeout in payment-service. It's queried during incidents 4x more than average."

The difference is understanding vs inventory. We don't just know what exists—we know what it means, when it matters, and how it connects.

This is what makes Tero the best place to ask questions. The context has meaning attached. Questions get answered with real understanding, not pattern matching.
