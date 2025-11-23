# Writing Documentation

This guide explains how we write Tero's public documentation. We build on established frameworks and add our own tone and style.

## The Framework: Diataxis

We organize documentation using the [Diataxis framework](https://diataxis.fr/), which defines four types of documentation:

**Tutorials** - Learning-oriented. Teaching someone new concepts through guided steps. Focus: helping beginners succeed.

**How-to Guides** - Task-oriented. Solving a specific problem. Focus: getting something done efficiently.

**Reference** - Information-oriented. Technical descriptions for lookup. Focus: accuracy and completeness.

**Explanation** - Understanding-oriented. Clarifying concepts and context. Focus: building mental models.

### How Our Docs Map to Diataxis

**Manual** - Mix of all four types:
- Introduction: Explanation (what is Tero, why it matters)
- Getting Started: Tutorial (your first steps)
- Understanding Your Data: Explanation (how the catalog works)
- Taking Action: How-to Guides (accomplish specific tasks)

**Integrations** - How-to Guides (connect to Datadog, set up permissions, verify it works)

**Reference** - Reference (CLI options, API schema, configuration files)

## General Technical Writing

For technical writing fundamentals, follow [Google's Developer Documentation Style Guide](https://developers.google.com/style).

Key principles from Google's guide:
- Write in second person (you, not we)
- Use present tense
- Be clear and concise
- Use active voice
- Write for a global audience

## Tero's Style

We layer our own tone and voice on top of these frameworks.

### Core Principles

**Conversational but not casual** - Write like you're explaining to a smart colleague. Professional without being corporate.

**Direct, no fluff** - Avoid corporate speak. No "delve into", "it's worth noting that", "in today's world". Say what you mean.

**Action-oriented** - Every section should lead to understanding or doing something. Not just information for its own sake.

**Respect intelligence** - Don't over-explain or hand-hold. Readers can follow well-structured thinking.

**Progressive disclosure** - Start simple, add complexity. Early pages assume nothing. Later pages build on what came before.

### What to Avoid

**Corporate speak** - "Leverage our platform to empower your teams" → "Use Tero to reduce observability costs"

**Unnecessary qualifiers** - "arguably", "potentially", "relatively", "somewhat" - These add noise.

**Throat-clearing** - "Moreover", "Furthermore", "Additionally" - Just make your next point.

**Excessive bolding** - When everything is bold, nothing is. Let the ideas carry weight.

**Self-congratulation** - Don't tell readers something is "thoughtful" or "powerful". Show them through clear explanation.

### Writing for Different Doc Types

**Tutorials (Manual: Getting Started)**
- Second person, present tense: "You install the CLI"
- Walk through each step explicitly
- Show expected output
- Explain why you're doing each step
- Patient and thorough

**How-to Guides (Integrations, Manual: Taking Action)**
- Imperative mood: "Create an API key. Set these permissions."
- Assume they know why they're here
- Prerequisites upfront
- Steps → Verification → Troubleshooting structure
- Minimal explanation, maximum efficiency

**Reference (CLI, Edge, API)**
- Declarative: "The `--port` flag specifies the port"
- Tables and lists over prose
- Every option documented
- Examples without lengthy explanations
- Scannable and searchable

**Explanation (Manual: Introduction, Understanding Your Data)**
- Build mental models
- Use examples and analogies
- Show how pieces connect
- Answer "why" questions
- Take time to develop ideas

### Sentence and Paragraph Structure

Vary sentence length. Short sentences create emphasis. Longer sentences let you develop complex ideas and show connections between concepts, building rhythm that keeps readers engaged.

Keep paragraphs focused. One idea per paragraph. Sometimes that's two sentences, sometimes five. Let the idea dictate the length.

### Examples Matter

Show, don't just tell. Use real CLI output, actual log samples, concrete scenarios. Not "Tero identifies waste" but "Tero identified 2M debug logs per hour costing $8K/month."

### Formatting

Use formatting to clarify structure, not to add emphasis.

**Headings** organize content. Use them for sections, not to break up unclear prose.

**Lists** are for actual lists of things. Not a crutch to avoid writing connected thoughts.

**Code blocks** for commands, configuration, examples. Use syntax highlighting.

**Callouts** (Info, Warning, Tip boxes) for important asides. Don't overuse.

**Bolding** rarely. Only for critical terms on first use or genuine emphasis.

## For Tero Employees

If you work at Tero, also reference:
- `../knowledge-base/meta/writing.md` - Internal writing style guide
- `../.github-private/manual/documentation.md` - Repository documentation practices

These provide deeper context on our voice and approach to writing.

## The Test

After writing, ask:
- Does this help the reader succeed at their goal?
- Would I say this out loud to a colleague?
- Is every sentence doing work?
- Can I delete anything without losing meaning?

If you can answer yes to all four, publish it. If not, revise.

Good documentation respects the reader's time and intelligence. It gets them to success as quickly as possible while building the understanding they need. That's what we're building here.
