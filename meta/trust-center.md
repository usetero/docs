# Trust Center Architecture

Operating spec for Trust Center content.

This document defines how trust pages are organized, written, and maintained so they stay credible over time.

## Purpose

The Trust Center exists to answer security and compliance reviews quickly with concrete, verifiable information.

It is not marketing copy and not a control checklist dump.

## Core principles

- Clarity over volume: precise statements with clear scope.
- Current state first: say what is true now.
- Boundaries explicit: hosted vs self-hosted ownership is always visible.
- Evidence attached: each major claim maps to an artifact, doc, or control source.
- Honest roadmap: in-progress items include target dates.

## Information architecture

Single Trust Center with deployment-aware pages.

Root pages:

- `trust/overview`
- `trust/architecture`
- `trust/shared-responsibility`
- `trust/reviewer-map`

Domain pages:

- `trust/controls/*`
- `trust/assurance/*`
- `trust/policies/*`

Decision:

- Maintain one Trust Center and avoid separate full hosted/self-hosted copies.
- Use deployment profile sections within each page.
- Split into dedicated pages only when differences are large and sustained.

## Required page template

Every trust page should include:

1. Page metadata strip (last reviewed, owner, review cadence, status)
2. Reviewer orientation ("What this page answers")
3. Current state (with explicit date)
4. Scope and boundary
5. Controls and implementation detail
6. Evidence map
7. Exceptions process
8. In-progress items and target date (if applicable)

## Voice and readability

Write for security reviewers, not for marketing:

- Use direct language and short paragraphs.
- Prefer concrete operational phrasing over broad adjectives.
- Keep every section skimmable in under two minutes.
- Lead with what is implemented today, then describe what is in progress.

Tone targets:

- Calm, specific, and technically literate
- Helpful without being defensive
- Confident without overstating maturity

## Deployment model presentation rules

Use the smallest structure that preserves clarity:

- Small difference: comparison row in a table
- Medium difference: separate hosted/self-hosted subsections
- Large difference: dedicated page linked from both models

Anti-patterns:

- Tabs that only switch a sentence
- Duplicating entire pages for hosted and self-hosted when most content is shared
- Vague statements like "enterprise-grade" without implementation detail

## Claim policy

Allowed claim states:

- `Implemented`
- `In progress (target: DATE)`
- `Not in scope`

Disallowed:

- Implying completed certification before issuance
- Absolute claims without verifiable source

## Page status badge semantics

Each Trust page includes a status badge near the top. Use only:

- `Status: Implemented` - The page describes controls currently operating in production.
- `Status: In progress` - Material parts of the page scope are still being completed.
- `Status: Reference` - Index or mapping pages that point to control pages.

Color convention:

- Implemented: green
- In progress: orange
- Reference: blue

Do not mix contradictory signals on a page. If a page is marked Implemented, keep in-progress roadmap items on the relevant assurance/compliance page.

## Evidence mapping

Each domain page should include either:

- direct links to public docs, or
- clear statement that additional artifacts are available under NDA.

Questionnaire-facing pages should support "find in under 2 minutes" review behavior.

## Maintenance

Owner: Security + Engineering  
Review cadence: quarterly and after material architecture/control changes  
Update trigger examples:

- New subprocessor
- Auth model change
- New deployment option
- New compliance milestone
