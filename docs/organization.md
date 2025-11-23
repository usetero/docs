# Documentation Organization

This document explains how we organize Tero's public documentation and why. Not the specific pages—those will evolve—but the fundamental structure and thinking behind it.

## The Core Principle

Documentation structure teaches customers how to think about your product. Navigation is a mental model, not just wayfinding. When someone lands on your docs, the way you organize information tells them what matters, how pieces fit together, and what their journey should be.

We're creating a new category—observability data management. Most customers don't wake up thinking "I need a semantic catalog for my telemetry." They wake up thinking "my Datadog bill is out of control" or "my logs are a mess and I don't know why." Our docs need to meet them where they are and progressively build understanding of what Tero is and how it works.

The structure has to serve two competing needs: make it simple enough that new customers can get started without drowning in concepts, and comprehensive enough that technical teams can deploy across their infrastructure with confidence.

## The Structure

We use a tab-based organization with three main sections plus supporting materials:

**Manual** - The progressive journey from first contact to organizational rollout
**Integrations** - Vendor-specific guides that tell the complete integration story
**Reference** - Non-progressive documentation of Tero's components
**Trust Center** - Security, compliance, and legal (global anchor, not a tab)

Each serves a distinct purpose and audience.

## Manual: The Journey

This is where most customers start and the only section designed to be read sequentially. It's a book, not a wiki. You start at the beginning, and each section builds on what came before.

The journey mirrors how customers actually adopt Tero and how trust builds over time. You don't deploy the edge on day one. You don't roll out quality SLOs to your entire engineering org in week one. There's a natural progression that looks like this:

**Understand what Tero is** - Core concepts, how the three layers work together, what problems this solves. Build the mental model.

**Get started** - Install the CLI, connect your first integration, see your first analysis. Proof of concept.

**Understand your data** - Explore the semantic catalog, see quality scores, understand what waste means. Build conviction that the analysis is real.

**Take action: read-only** - Analyze waste patterns, see recommendations, review examples. Build trust without risk—nothing changes yet.

**Take action: configuration** - Block waste via Datadog exclusion rules. First real impact, but reversible and auditable. Prove the value.

**Take action: edge deployment** - Deploy edge proxies for deeper optimization. More commitment, more savings. Customers only do this after they trust the control plane.

**Scale across your organization** - Enable bottom-up improvement, set quality goals, give teams ownership. This is the culture change piece that only makes sense once the product is proven.

Each section assumes you completed the previous ones. We don't explain what a quality rule is in the section about organizational rollout—you learned that earlier in the journey. This lets us build complexity progressively without overwhelming people upfront or repeating ourselves constantly.

The Manual answers: "I'm new to Tero, teach me everything I need to know in the right order."

## Integrations: Complete Vendor Stories

Each integration page tells the full story of how Tero works with that vendor. Not scattered across different sections—one cohesive guide.

Take Datadog. The integration involves multiple parts:
- The control plane connects via Datadog's API to read log metadata and configure exclusion rules
- The edge (optionally) sits alongside the Datadog agent to filter before ingestion
- There are specific permissions required, specific data flows, specific things that can break

A customer setting up Datadog integration shouldn't have to bounce between the CLI reference, the edge reference, and some hypothetical control plane integration guide. They should go to one place and see the complete picture: here's what integrates, here's how, here's what you need, here's how to verify it works.

This structure also scales naturally. When we add Splunk support, we add a Splunk integration page with the same structure. The pattern stays consistent, the vendor-specific details change.

Integrations are not progressive. You pick your vendor, follow the guide. Someone setting up Datadog doesn't need to read the Splunk page. These are independent, self-contained guides.

The Integrations section answers: "I need to connect Tero to Datadog/Splunk/whatever, show me everything about that integration."

## Reference: Tero Components

Reference documentation is organized by component—CLI, Edge, Control Plane, API. Each component gets its own section structured by concern: installation, configuration, operations, troubleshooting.

This is not progressive. You don't read the CLI reference start to finish. You jump to what you need: "What environment variables does the CLI support?" or "How do I deploy Edge on Kubernetes?" Each page is self-contained and assumes you know why you're there.

Reference documentation is what you hand to specific people for specific tasks:
- Give CLI reference to IT when rolling out to workstations
- Give Edge reference to the SRE deploying it in production
- Give API reference to engineers building custom integrations

The key difference from Integrations: Reference documents Tero's tools independently of vendor integrations. The CLI reference doesn't mention Datadog—that's in the Datadog integration guide. Reference explains how the CLI works, how to install it, how to configure it. The integration guide explains how it all connects to external systems.

Reference answers: "I know what I'm looking for, just tell me how this specific component works."

## Trust Center: The Checkbox

Security, compliance, privacy, legal. This is what InfoSec, compliance teams, and procurement need to approve Tero for use. It's not part of the product journey—it's a parallel evaluation that happens for organizational approval.

We keep this accessible but not prominent. It's a global anchor in the sidebar—always available, never in your face. Most users won't need it. The people who do need it know they need it and know what they're looking for.

Trust Center answers: "Does this meet our security/compliance requirements?"

## What This Structure Enables

**Clear mental model** - Three layers (control plane, CLI, edge), each documented separately. Vendor integrations as distinct from Tero's components.

**Progressive trust** - The Manual walks you from zero to full adoption in a way that builds trust at each step. You don't have to deploy everything at once.

**Role-based access** - Hand someone the specific section they need. IT gets CLI reference, SRE gets Edge reference, compliance gets Trust Center.

**Room to grow** - As we add vendors, they slot into Integrations. As we add components (maybe SDKs, maybe webhooks), they slot into Reference. The structure doesn't break.

**Avoids repetition** - Each integration guide can reference the CLI reference for installation details rather than duplicating. Snippets let us DRY up common content (permissions, verification steps) while keeping guides cohesive.

## What We're Avoiding

**Scattered integration docs** - Don't split Datadog setup across CLI reference, Edge reference, and some other section. One place, complete story.

**Flat reference docs** - Not just an alphabetical list of topics. Organized by component, then by concern. Structure that matches how people think.

**Documentation for its own sake** - No "Guides" section full of tutorials covering every possible use case. The Manual is the guide. If customers need more, we add to the Manual or write a specific blog post. Don't create a dumping ground.

**Over-prominence of advanced features** - Trust Center and API reference are important but not primary. Don't give them top-level tabs when most customers won't use them daily. Global anchors keep them accessible without cluttering navigation.

## How This Changes

As the product evolves, the organization might change. Here's how to think about that:

**New vendors** - Add to Integrations tab. Pattern stays the same.

**New components** - Add to Reference tab if it's a tool customers deploy or interact with directly.

**New concepts** - Probably belong in Manual. The journey can expand, sections can split, but it stays progressive.

**Separate products** - If Tero evolves into multiple distinct products (unlikely but possible), that's when you'd consider using Mintlify's "Products" feature to create higher-level divisions. Don't do this prematurely.

The structure should feel obvious and boring. That's the goal. Customers shouldn't have to think hard about where to find something. If they do, the structure is wrong.

## The Test

After organizing docs, ask: can I hand someone a specific section and trust they'll find what they need without explanation? Can a new customer follow the Manual from start to finish and understand how to adopt Tero? Can an experienced user jump to Reference and find answers quickly?

If yes, the organization works. If no, something's unclear or in the wrong place.

Good organization gets out of the way and lets the content do its job. That's what we're building.
