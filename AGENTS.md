# Tero Documentation Repository

This is Tero's public documentation repository, built with [Mintlify](https://mintlify.com). It contains customer-facing documentation for understanding, integrating, and using Tero.

`CLAUDE.md` is a symlink to this file — edit `AGENTS.md`.

## What This Repo Is

A Mintlify-based documentation site with:
- **MDX files** - Documentation pages (content)
- **docs.json** - Navigation and site configuration
- **meta/** - Internal planning docs (philosophy, voice, product model)
- **Taskfile.yml** - Development commands
- **Hermit** - Tool management (node, pnpm, task)

This is a public repository. Customers may contribute. Write accordingly.

## Repository Structure

```
docs/
├── meta/               # Internal planning (not published)
│   ├── philosophy.md   # Why the docs exist, who reads them
│   ├── voice.md        # Writing voice and tone
│   ├── model.md        # Product mental model the docs teach
│   ├── trust-center.md # Operating spec for Trust content
│   └── todo.md         # Documentation TODOs
├── introduction/       # What Tero is, how it works (Tero tab)
├── issues/             # Issues workspace docs (Tero tab)
├── master-catalog/     # Master Catalog docs (Tero tab)
├── policies/           # Policy docs: categories, enforcement (Tero tab)
├── integrations/       # Vendor-specific guides (split across tabs)
├── edge/               # Edge runtime docs (Edge tab)
├── trust/              # Trust Center content (Trust tab)
├── snippets/           # Reusable content blocks
├── scripts/            # Screenshot tooling
└── docs.json           # Navigation configuration
```

## Documentation Organization

Navigation has three tabs, each serving a distinct audience and job:

**Tero** - The product. What it is, how it works, the quickstart, and the core workspaces: Issues, Master Catalog, Policies. Organized by product area; each area holds its own explanation, how-to, and reference pages.

**Edge** - The data plane. For engineers deploying and operating Edge: concepts, quickstart, distributions, deployment how-tos, configuration and policy reference.

**Trust** - Security review. Architecture, controls, assurance, and security policies for reviewers evaluating Tero.

Tabs are audience boundaries, not document-type boundaries. Don't create catch-all "Reference" or "Guides" groups that pull pages out of their product area — keep each area self-contained so the sidebar and URL hierarchy agree.

## Writing Documentation

We follow the [Diataxis framework](https://diataxis.fr/) for documentation types and [Google's Developer Documentation Style Guide](https://developers.google.com/style) for technical writing. Diataxis governs the form of each page, not the navigation — don't reorganize the sidebar around it.

Tero's style:
- Conversational but not casual
- Direct, no corporate speak
- Action-oriented, respect reader's intelligence
- Progressive disclosure (simple → complex)

See `meta/voice.md` for voice and tone, `meta/philosophy.md` for who the reader is and what earns their trust, and `meta/model.md` for the product mental model the docs should build.

## Key Principles

**Only publish what exists** - Don't create pages marked "Coming Soon." Add sections as features ship. This shows momentum instead of a TODO list.

**Progressive trust** - Docs follow how customers actually adopt: understand → analyze (read-only) → configure → deploy edge → scale org-wide. Each step builds trust.

**Self-contained integrations** - Each vendor integration page tells the complete story. Don't scatter setup across multiple sections.

**Reference is for lookup** - Not progressive. Jump to what you need. Self-contained pages.

**Titles must work out of context** - Agents consume pages through `llms.txt` and the MCP server as flat title + description lists, without tab context. Make titles globally unambiguous ("Edge quickstart", not a second "Quickstart") and never reuse a title across pages.

## Common Tasks

### Writing a New Doc Page

1. Determine the type (Tutorial, How-to, Reference, Explanation) - see Diataxis
2. Place it in the product area it belongs to (directory and nav group should agree)
3. Write following `meta/voice.md` and `meta/philosophy.md`
4. Add to `docs.json` navigation - a page not in navigation is still served by URL, so never leave orphans
5. Use snippets for reusable content (permissions, verification steps)

### Updating Docs

1. Read `meta/voice.md` for editing principles
2. Rewrite sections to stay coherent - don't just append
3. Maintain voice throughout
4. Update `docs.json` if structure changes

### Screenshots

Pages embed app screenshots via `screenshot-suggestion` comment blocks in MDX. Run `task screenshots` to capture and embed them, or `task screenshots:dry` to list suggestions without writing files. Generated blocks are marked `screenshot-generated` - edit the suggestion, not the generated markup.

### Checking Quality

Run `task check:links` to find broken links.

Format and lint tasks are placeholders - add tooling as needed (prettier, vale, etc.).

## Development

**Setup:**
```bash
# Hermit activates automatically with direnv
# Or manually: source bin/activate-hermit

pnpm install
```

**Common commands:**
```bash
task dev              # Start Mintlify dev server
task do               # Fast dev loop (format + lint)
task check:links      # Check for broken links
task build            # Build documentation
task screenshots      # Capture and embed screenshots
task screenshots:dry  # List screenshot suggestions
```

**Preview:** Dev server runs at `http://localhost:3000`

## Navigation (docs.json)

Navigation follows this structure:
```json
{
  "navigation": {
    "tabs": [
      { "tab": "Tero", "groups": [...] },
      { "tab": "Edge", "groups": [...] },
      { "tab": "Trust", "groups": [...] }
    ]
  }
}
```

Tabs appear in top navigation. The `contextual` block configures the page-level AI menu (copy as Markdown, open in ChatGPT/Claude/Cursor, MCP server).

## Agents and AI Consumption

Mintlify auto-hosts agent infrastructure for this site - no configuration lives in this repo:

- `llms.txt` at the site root indexes all pages (title + description, ordered by navigation)
- An MCP server at `/mcp` lets AI tools query live docs
- `skill.md` backs `npx skills add https://docs.usetero.com` (the quickstarts point readers at this)
- Appending `.md` to any page URL returns clean Markdown

Practical consequences: navigation structure and frontmatter descriptions are agent-facing surfaces, not just chrome. Keep descriptions specific and titles unambiguous.

## For Tero Employees

Reference `../knowledge-base/meta/writing.md` for company writing style.

## Mintlify-Specific

**Components:** Mintlify provides rich components (Card, Accordion, Tabs, CodeGroup, etc.). See [Mintlify docs](https://mintlify.com/docs) for usage.

**Snippets:** Create reusable content in `snippets/` and import with `<Snippet file="name.mdx" />`

**Frontmatter:** Every page needs:
```yaml
---
title: "Page Title"
description: "Brief description"
---
```

**Links:** Use relative paths: `[Link text](/path/to/page)` (no .mdx extension)

## The Goal

These docs are a sales tool. Prospects read them to evaluate Tero. Well-written docs signal clear product thinking, practical understanding of customer problems, and respect for reader intelligence.

Get customers to success as quickly as possible while building the understanding they need. That's what we're building.
