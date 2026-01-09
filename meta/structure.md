# Structure

The information architecture of these docs. What goes where and why.

## Four Tabs

The docs have four top-level tabs:

```
Tero    |    Control Plane    |    Edge    |    Trust
```

Each tab serves a distinct audience and purpose.

### Tero (`/tero/...` or root)

The main tab. The product. This is where most users spend their time.

**Audience:** Anyone using Tero—engineers asking questions, platform leads understanding capabilities, new users getting started.

**Purpose:** Teach what Tero is, how to use it, and how to get value from it.

**Content:**
- Introduction (what is Tero, how it works)
- Getting Started (create account, connect first integration, ask first question)
- Questions (each question is a major section)
- Context (the semantic catalog)
- Capabilities (what Tero can do)
- Integrations (connecting external systems)
- CLI (terminal interface, at the bottom as a progressive topic)

### Control Plane (`/control-plane/...`)

The brain of Tero. For those deploying or operating it.

**Audience:** Platform engineers, DevOps, infrastructure teams. Also prospects evaluating deployment options.

**Purpose:** Explain what the control plane is, deployment options, configuration, operations.

**Content:**
- Overview (what is the control plane, what does it do)
- Deployment Options
  - Tero Cloud (managed, just connect)
  - Self-Hosted (your infrastructure, your AI, your data)
  - Hybrid options
- Configuration
- Bring Your Own AI (Bedrock, Azure OpenAI, etc.)
- Monitoring & Operations
- API Reference (if applicable)

### Edge (`/edge/...`)

Policy execution in your infrastructure. For those deploying edge components.

**Audience:** Platform engineers deploying the edge proxy or distributions. Also engineers interested in the policy engine.

**Purpose:** Explain what the edge is, deployment options, how policies work, performance characteristics.

**Content:**
- Overview (what is the edge, why deploy it)
- Edge Proxy
  - Deployment (sidecar, standalone, Lambda)
  - Configuration
  - Monitoring
- Distributions
  - OTel Collector
  - Vector
  - Datadog Agent
- Policy Libraries
  - Overview
  - Rust
  - Zig
  - Go
- Policy Specification
  - Format
  - OTel contribution
  - Examples
- Performance & Benchmarks

### Trust (`/trust/...`)

Security, compliance, privacy. For diligence.

**Audience:** Security teams, compliance officers, VPs evaluating risk.

**Purpose:** Answer "is this safe to use?" Provide everything needed for vendor review.

**Content:**
- Overview
- Security
- Privacy
- Compliance
- Resilience
- Checklist
- Sub-processors
- Documents (SOC 2, etc.)

## Within the Tero Tab

The Tero tab has the most depth. Here's the structure:

```
Tero
├── Introduction
│   ├── What is Tero?
│   ├── The Hardest Question
│   └── How It Works
│
├── Getting Started
│   ├── Create Account
│   ├── Connect Datadog (first integration)
│   └── Ask Your First Question
│
├── Questions
│   └── How much data is waste?
│       ├── Overview
│       ├── Understanding the Results
│       │   ├── By Service
│       │   ├── By Log Event
│       │   └── Evaluating Quality
│       ├── Taking Action
│       │   ├── Overview
│       │   ├── Drop in Provider
│       │   ├── Deploy to Infrastructure
│       │   ├── Remove from Code
│       │   └── Monitoring Impact
│       ├── Managing Your Contract
│       │   ├── Overview
│       │   ├── Renewal Planning
│       │   └── Executive Reporting
│       └── Scaling Quality
│           ├── Overview
│           ├── Starting Small
│           ├── Automating Decisions
│           └── Team Ownership
│
├── Context
│   ├── Overview
│   ├── Services
│   ├── Log Events
│   └── Metrics
│
├── Capabilities
│   ├── Overview
│   ├── Block Logs
│   ├── Redact PII
│   ├── Open PRs
│   ├── Create Tickets
│   └── Send Alerts
│
├── Integrations
│   ├── Overview
│   ├── Datadog
│   ├── Splunk (when ready)
│   ├── Slack
│   ├── GitHub
│   └── ...
│
└── CLI
    ├── Installation
    ├── Authentication
    ├── Commands
    └── Scripting & Automation
```

## URL Structure

URLs should be clean and predictable:

- `/` or `/tero/what-is-tero` — Homepage
- `/tero/getting-started/create-account` — Getting started flow
- `/tero/questions/waste/overview` — Waste question
- `/tero/context/log-events` — Context documentation
- `/tero/integrations/datadog` — Datadog integration
- `/control-plane/self-hosted` — Self-hosted deployment
- `/edge/proxy` — Edge proxy docs
- `/trust/security` — Security documentation

## Progressive Disclosure

The structure follows progressive disclosure—simple concepts first, depth available when wanted.

**Introduction:** High-level. What is this, why should I care, how does it work at a glance.

**Getting Started:** Do one thing. Get to value fast. Don't explain everything, just enough to succeed.

**Questions:** This is where depth lives. Each question is a complete journey from understanding to action to scale.

**Context/Capabilities/Integrations:** Reference-style. Explain each concept, let users drill into what they need.

**CLI:** At the end because it's for power users who already understand the concepts.

**Control Plane/Edge:** Separate tabs because they're operational, not about using Tero.

## Adding New Content

### Adding a New Question

When a new question launches:
1. Create a new section under Questions
2. Follow the same structure: Overview, Understanding Results, Taking Action, etc.
3. The question gets its own announcement, marketing, attention
4. Link from relevant places (introduction, capabilities)

### Adding a New Integration

When a new integration ships:
1. Add a page under Integrations
2. Document: what context it provides, what capabilities it unlocks, how to connect
3. Update relevant capability pages if new capabilities are unlocked

### Adding a New Capability

When a new capability ships:
1. Add a page under Capabilities
2. Document: what it does, which integrations enable it, how to use it
3. Link from relevant question sections (Taking Action)

### Adding Edge Components

When a new distribution or deployment option ships:
1. Add under the appropriate Edge section
2. Document: what it is, how to deploy, configuration, monitoring

## What Goes Where: Decision Guide

| Content Type | Location |
|-------------|----------|
| How to use Tero | Tero tab |
| Product concepts | Tero tab |
| CLI usage | Tero tab (CLI section) |
| Deploying control plane | Control Plane tab |
| Self-hosted configuration | Control Plane tab |
| Deploying edge components | Edge tab |
| Policy specification | Edge tab |
| Performance benchmarks | Edge tab |
| Security practices | Trust tab |
| Compliance info | Trust tab |

## Mermaid Diagrams

Use Mermaid diagrams when visualizing:
- Architecture and data flow
- Concept relationships
- Decision trees
- Deployment topologies

Mintlify supports Mermaid natively. Use it liberally when a diagram clarifies better than prose.
