# Manual

The complete outline for the Manual section. This shows the full vision—all sections, all pages—for planning purposes. Only publish what exists. Add sections to the actual docs as features ship.

## Purpose

The Manual is the progressive journey through Tero. It's designed to be read sequentially—each section builds on the last. This is different from Reference docs (random access) or Integrations (vendor-specific guides).

The structure mirrors how customers actually adopt the product and how trust builds over time. You don't deploy edge on day one. You don't roll out quality SLOs in week one. There's a natural progression: understand → prove value → take action → expand scope → scale organization.

## Complete Outline

### Introduction

**What is Tero**
- The problem: observability costs are a data quality problem
- What Tero does: semantic understanding + quality management  
- The category: observability data management
- How it's different: bottom-up improvement, not top-down mandates
- The three layers: control plane, CLI, edge

**Core Concepts**
- The semantic catalog (what it knows, why it matters)
- Quality rules and waste (keep, drop, distill)
- Workspaces (different teams, different rules for same data)
- Service ownership and discovery

**Roadmap** (optional single page showing the vision)
- The progressive journey from read-only to org-wide
- What comes first, what comes later
- Setting expectations without creating empty doc pages

### Getting Started

**Quickstart** (single page + video)
- Install the CLI
- Connect your first integration (Datadog)
- Run your first analysis
- "You just saw waste in 5 minutes"

### Understanding Your Data

**The Semantic Catalog**
- What the catalog captures about your telemetry
- Log events vs raw logs (the abstraction)
- Fields, patterns, and semantic meaning
- How the catalog evolves automatically

**Quality and Waste**
- What makes telemetry high quality vs wasteful
- How quality is scored and why
- Cost attribution (dollars per log event)
- Top offenders (services, patterns, teams)

**Service Ownership**
- How services are discovered and mapped
- Setting ownership in Tero
- Why ownership matters for bottom-up improvement

### Taking Action

**Read-Only Analysis**
- Exploring services and waste patterns
- Reviewing AI recommendations  
- Viewing actual log samples with context
- Building conviction before making changes

**Blocking Waste**
- How configuration-based blocking works
- Creating your first exclusion rule
- Monitoring impact after changes
- Understanding what changed and where

**Creating Quality Rules**
- What quality rules are
- Rule types: block, sample, distill
- Creating rules from AI recommendations
- Creating custom rules

**Workspaces**
- Why different teams need different rules
- Creating workspaces for different purposes
- The same log kept in one workspace, dropped in another
- Managing workspace membership

**Reversibility and Audit**
- Viewing active rules and their history
- Understanding who changed what and when
- Disabling or modifying rules
- Rolling back if something breaks
- Audit logs for compliance

### Deploying Edge (Optional)

**Why Edge**
- What edge provides beyond configuration
- Network egress savings
- Blocking before vendor ingestion
- When edge makes sense vs when it doesn't

**Deployment Guide**
- How edge fits into your infrastructure
- Data flow: logs → edge → agent → vendor
- Quality rule sync from control plane
- Deployment strategies (sidecar vs centralized)
- (References Edge Reference for detailed deployment)

**Operations**
- Monitoring edge health and performance
- Handling edge failures gracefully
- Upgrading edge software
- (Concepts here, details in Edge Reference)

### Scaling Your Organization

**Bottom-Up Culture**
- The cultural shift: engineers own their data quality
- Giving engineers the CLI
- How engineers use Tero for their services
- Platform team as enabler, not enforcer

**Quality Goals and SLOs**
- Defining org-wide targets (waste below X%)
- Service-level quality SLOs
- Team-level goals and accountability
- Tracking progress over time

**Team Enablement**
- Mapping teams to services
- Team-specific workspaces and rules
- Rollout strategies
- Communication and progress tracking

### Advanced

**Multi-Vendor**
- Using Tero with multiple observability platforms
- Unified catalog across vendors
- Vendor-specific workspaces and rules
- Migration strategies between vendors

**Custom Rules**
- Beyond AI recommendations
- Advanced sampling strategies
- Conditional rules (context-dependent)
- Testing custom rules before deployment

**Cost Forecasting**
- Modeling vendor contracts in Tero
- Forecasting usage and spend
- Scenario planning (Black Friday, new regions)
- Negotiating renewals with data

**API Integration**
- Building custom tools on Tero's API
- Integrating with internal systems
- (Concepts here, API Reference has the details)

**Self-Hosting** (future)
- When self-hosting the control plane makes sense
- Architecture and requirements overview
- (Details in Control Plane Reference when ready)

## Publishing Approach

Don't publish pages marked "Coming Soon." Only show what exists. Add sections as features ship. This shows momentum instead of a long TODO list.

Start with Introduction (concepts), add Getting Started when CLI onboarding works, build out other sections as capabilities exist. Document features as you ship them.
