# Voice

Write like you're explaining something to a smart colleague. Not a presentation, not a performance. Just clear communication between people who both have things to do.

The reader is a skeptical engineer who's been burned by vendor marketing. They can smell bullshit instantly — corporate speak, vague claims, over-promising trigger immediate dismissal. But they also respond to craft. When they see something well-designed, they recognize it.

## Tone

Conversational, but not casual. Write like you talk, but edited. No "Hey there!" or forced friendliness. No slang that might not translate. Just direct, human communication.

Confident, but not arrogant. State what's true and move on. Don't hedge unnecessarily, but don't claim to be the best at everything either. "We can answer this question because we build something no one else has: a semantic understanding of your telemetry" is confident. "We're revolutionizing the observability industry with our groundbreaking AI-powered solution" is arrogant.

Technical, but not jargon-heavy. Use real engineering terms. Mention technologies by name — Hyperscan, OTel, ClickHouse. But explain concepts when they're not obvious, and don't use jargon just to sound smart. "The policy engine uses Hyperscan, a high-performance regex library that can match tens of thousands of patterns at line rate" is technical. "Our proprietary pattern-matching technology leverages cutting-edge algorithms" is jargon.

Honest about limits. Say what Tero doesn't do yet. Be clear about current scope. "Right now, Tero answers questions about data waste. Questions like 'Why is checkout slow?' are coming — the same context graph makes them possible."

## Writing patterns

Lead with the point. Don't build up to your conclusion — state it, then explain. "Tero doesn't charge per GB. We don't care how much data you have." Not three paragraphs of context before you get there.

Use concrete examples. A `payment_failed` log isn't just a string with fields. It's a business event indicating a transaction didn't complete. The `user_id` field is context that matters for debugging. The `error_code` tells you why it failed. That's concrete. "Log events are enriched with semantic meaning that provides additional context for analysis" is abstract and says nothing.

Start simple, add depth for those who want it. "Tero builds a semantic understanding of your telemetry" with a link to how the context graph works. Don't dump all the technical details on the first page.

Use active voice. "Tero analyzes your logs and identifies waste." Not "Logs are analyzed and waste is identified."

Address the reader as "you." Never "the user" or "users" or "one."

Use present tense. Describe what things do, not what they will do. Present tense is direct. Use future tense only when describing something that literally happens later in a sequence.

Keep paragraphs focused — one idea each. Vary sentence length. Short sentences create emphasis. Longer sentences let you develop complex ideas and show how different pieces connect together. Mix them.

## What to avoid

**Corporate speak.** Best-in-class, enterprise-grade, seamless integration, cutting-edge, industry-leading, synergy, leverage, empower, world-class. These phrases mean nothing. Just say what the thing does.

**AI-writing tells.** "Delve into," "It's worth noting that," "In today's world," "Let's explore," starting paragraphs with "Moreover" or "Furthermore" or "Additionally," excessive bolding, lists where prose works better. If you find yourself writing these, rewrite.

**Hedging.** Arguably, potentially, relatively, somewhat, "in some cases" (unless being specific). Either something is true or it isn't. If you're not sure, find out before writing.

**Self-congratulation.** "We're proud to offer," "This innovative approach," "Our revolutionary technology." If something is good, the reader will see it. You don't need to point it out.

**Over-promising.** Don't claim capabilities that don't exist. Don't use future tense for features not yet shipped. Don't say "any question" when you mean specific questions. The skeptical reader will test your claims.

## Formatting

Use headings to organize thinking, not to compensate for unclear prose. If you need constant subheadings to make your point, you probably need clearer writing instead.

Lists are for actual lists of things. They're not a crutch to avoid writing connected thoughts. If you're tempted to make a bulleted list, ask whether it would be stronger as prose.

Bolding should be rare. When you bold something, you're saying "you might miss this if I don't highlight it." If you're bolding multiple things per paragraph, you're either burying your lead or you don't trust your reader.

Use inline `code` for CLI commands, file paths, function names, and configuration keys. Use code blocks for multi-line commands, configuration examples, and API requests.

Link generously to related concepts, but don't over-link — every link is a decision point that might take the reader away.

Use diagrams when they clarify better than prose. ASCII diagrams for simple relationships; Mermaid for flows and sequences with complexity.

## Heading conventions

For task-oriented page titles, use gerunds: "Connecting to Datadog", "Configuring Edge".

For task-based section headings, use imperatives: "Create a policy", "Configure your integration".

For conceptual or reference pages, use the thing's name: "Tero Edge", "Log Events".

## The test

After writing something, read it out loud. Does it sound like something a real person would say? Or does it sound like corporate communications?

If you wouldn't say it out loud, rewrite it.

## Examples

A good example:

> **What percentage of your data is waste?**
>
> Simple question. Brutally hard to answer.
>
> To answer it honestly, you need complete visibility across every telemetry source and deep comprehension of each piece — the ability to assess value, not just match patterns.
>
> No vendor can do this. Datadog sees bytes. Pipeline tools move data without understanding it. Your team has intuitions but no comprehensive view.
>
> We can answer it. Here's how.

This works because it leads with the point, uses short punchy sentences, stays concrete about what others can't do, and sets up the explanation without overselling.

A bad example:

> **Understanding Your Data Quality Metrics**
>
> In today's complex observability landscape, it's worth noting that understanding the quality of your telemetry data has become increasingly important. Many organizations struggle with the challenge of determining which data is truly valuable and which might be considered less essential for their operational needs.
>
> Our industry-leading platform leverages cutting-edge AI technology to help you delve into your data quality metrics and gain actionable insights. Through our seamless integration with your existing tools, we can provide a comprehensive analysis of your telemetry data.

This fails because it buries the point in throat-clearing, uses corporate speak ("industry-leading," "cutting-edge," "seamless"), has AI tells ("it's worth noting," "delve into"), stays vague ("less essential for operational needs"), and feels distant.

## Checklist

Before publishing:

- [ ] Does it lead with the point?
- [ ] Would I say this out loud?
- [ ] Any corporate speak?
- [ ] Any AI-writing tells?
- [ ] Unnecessary hedging?
- [ ] Honest about limitations?
- [ ] Concrete examples?
- [ ] Is the formatting helping or cluttering?
