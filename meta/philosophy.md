# Philosophy

The soul of these docs. Who we write for, what we're trying to accomplish, and the feeling we want to create.

## The Reader

We write for the engineer responsible for observability at their company. The title varies—Staff SRE, Platform Lead, Director of Infrastructure—but the role is consistent: they're accountable for both supporting engineering teams and managing the observability budget.

These are technical people. They grew up as engineers and still think like engineers. They understand distributed systems, they've operated Datadog and Splunk and Prometheus, and they've felt the pain firsthand. They're not reading these docs to be sold—they're reading to evaluate whether Tero is real.

### What They're Feeling

**Skeptical but hopeful.** They've been burned. By vendors who could help but don't. By products that promised intelligence but delivered dashboards. By "AI" that's just marketing. They want to believe something better exists, but they've learned to protect themselves.

**Tired of the game.** The cost policing, the renewal anxiety, the begging vendors for forgiveness when someone's log explodes the bill. They don't want another tool. They want the game to change.

**Protective of their credibility.** They evaluate products the way they'd evaluate a hire: Will this create problems for me? Can I bring this to leadership without caveats? Is this something I want associated with my name?

### What Converts Them

They convert when they feel like Tero was built by people who understand their world. Not through marketing claims, but through the texture of the product and documentation itself.

They're looking for signals:

- **Engineering depth.** Real technology, not buzzwords. Mention Hyperscan, explain semantic compression, show benchmarks. They can smell when something is real.

- **Honest constraints.** What does Tero not do yet? Where are you headed? Being honest about current scope (Datadog logs first) builds trust. It says: we're not trying to trick you.

- **Respect for their intelligence.** No hand-holding, no over-explaining, no corporate speak. Write like you're explaining to a peer.

- **Aligned incentives.** No per-GB pricing. No storing their data. No lock-in. Open standards. They control their infrastructure.

The feeling to create: the reader recognizes that Tero was built by engineers who've lived their problems. The architecture makes sense. The trade-offs are explained. Nothing is hidden behind marketing.

### What Repels Them

They will write you off the moment you feel like another vendor. The violations:

1. **Per-GB pricing or volume-based anything.** Even implying metered billing triggers the "another vendor" response.

2. **"Send us your data."** The moment they think you're a hosted SaaS that owns their data, trust erodes. Emphasize: we connect to where your data lives, we don't store it, you own everything.

3. **Lock-in signals.** Proprietary agents, special query languages, data formats they can't escape. Counter this: open standards (OTel policies), works with what you have, you can leave anytime.

4. **Vaporware vibes.** "Coming soon," roadmap promises, features that don't exist. Only document what's real.

5. **Corporate speak.** "Best-in-class," "enterprise-grade," "seamless integration," "delve into," "it's worth noting." These words mean nothing and signal "we're like everyone else."

6. **Over-promising AI.** They've seen too many "AI-powered" products that are just wrappers around an LLM. Be specific about what the AI does and doesn't do.

## The Goal

These docs serve two purposes:

**For prospects:** Cash in the work done by the POV, the website, the positioning. A skeptical engineer reads the POV, thinks "this sounds right," comes to the docs asking "but is it real?" The docs answer: yes, here's exactly how it works, here's what you can do with it, here's how to get started.

**For customers:** Get them to success as quickly as possible. Help them understand the concepts, use the product effectively, and take action. Build the understanding they need to champion Tero internally.

The docs are a sales tool, but not in a salesy way. They convert by demonstrating competence, clarity, and care. Well-written docs signal clear product thinking, practical understanding of customer problems, and respect for the reader's intelligence.

## The Feeling

The docs should feel like they were written by engineers who care deeply about craft. Technical depth without pretension. Sophisticated but not complicated. The kind of documentation you read and think: these people know what they're doing.

### Care Without Coddling

Respect their intelligence. Don't over-explain. Don't add disclaimers everywhere. Write like you're explaining to a peer who's short on time but wants to understand deeply.

### Flex Without Bragging

Show engineering depth—mention Hyperscan, explain why semantic understanding matters, share real numbers (40% typical waste reduction). But never say "we're the best" or "revolutionary." Let the work speak.

### Simple Without Simplistic

The architecture is sophisticated. Don't dumb it down. But present it in a way that feels inevitable—"of course it works this way, this is obviously right." Progressive disclosure: simple on the surface, depth available when they want it.

### Honest About Limits

What do you not do yet? Where are you headed? Being honest about current scope builds trust. It says: we're not trying to trick you, we're building something real.

### They're On Your Team

The best docs feel like someone inside your company wrote them for you. Not sales material. Not marketing copy. A smart engineer saying "here's how this works, here's why it matters, here's how to use it."

## The Test

After writing or reading any page, ask:

1. Would a skeptical Staff SRE at a company spending $2M/year on Datadog find this credible?
2. Does it sound like a person wrote it, or like marketing/AI?
3. Does it respect their intelligence without being inaccessible?
4. Would they feel like Tero was built by people who understand their world?

If any answer is no, rewrite it.
