# Product Philosophy

This repository is guided by a pragmatic product-management philosophy: use small systems to make product decisions more legible.

## Principles

### Start With the Decision

Every project exists to support a real PM decision:

- Is this idea worth exploring?
- Which user behaviors matter most?
- What are customers repeatedly asking for?
- Did the experiment move the core metric?
- Can a lightweight model inform a bet?
- Which roadmap items deserve attention now?

The code is intentionally shaped around those questions rather than around novelty for its own sake.

### Prefer Transparent Logic

Where possible, scoring systems are explicit. Retention, funnel math, experiment significance, and roadmap prioritization are implemented in readable Python rather than hidden behind opaque libraries. This is important for PM tooling because stakeholders need to understand why the tool produced a recommendation.

### AI Should Accelerate, Not Obscure

The AI-enabled apps do not rely exclusively on an LLM. They combine deterministic analysis with optional OpenAI-generated summaries. That keeps the tools useful when API access is unavailable and prevents the UI from becoming an unexplainable black box.

### Small Tools Can Still Be Production-Shaped

A portfolio project does not need microservices or excessive abstraction to feel professional. It does need:

- consistent structure
- clean naming
- predictable data flow
- working sample data
- clear documentation

This repository optimizes for that standard.

### Build for Iteration

Each project is small, but each could be extended:

- analytics dashboards could add segmentation and warehouse integrations
- customer insight tooling could add embeddings and clustering
- experimentation tooling could expand to sequential testing
- roadmap generation could pull live product metrics

The current implementation is intentionally narrow, but the architecture leaves room for future depth.

