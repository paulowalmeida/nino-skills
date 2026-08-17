# Semantic Skills

Skills are the semantic layer of the Nino quality system. They are intentionally broader than individual `enforce-*` hooks and narrower than the global `CLAUDE.md` contract.

## Authority order

```text
CLAUDE.md / project instructions
        ↓
applicable rules/*.md and .claude/rules/*
        ↓
enforce-* objective constraints
        ↓
semantic Skills
        ↓
implementation decision
```

A Skill MUST NOT weaken an objective enforcement result or invent a subjective rule as if it were mechanically enforced.

## Ownership matrix

| Skill | Primary semantic responsibility | Mechanical partners |
|---|---|---|
| `architecture-review` | Atomic Design layer, ownership, cross-layer responsibility | architecture-boundaries, components, compositions, elements, pages, layouts |
| `component-review` | Component cohesion, DS-first, CSS ownership, extraction | components, css, elements, imports, accessibility |
| `composition-review` | Section cohesion, DS-first, local interaction boundary | compositions, css, elements, services, imports |
| `hook-state-review` | Hook/state/provider/effect ownership | hooks, states, providers, guards-loaders |
| `data-boundary-review` | Service/API/router/adapter/utility/data ownership | services, router, lib, utils-adapters, constants, types |
| `testing-review` | Behavioral coverage, isolation, test boundary, failure paths | tests, types, architecture boundaries |
| `code-quality-review` | Naming, comments, abstraction, cohesion, duplication | constants, types, components, hooks, CSS |
| `complexity-refactoring` | Structural risk → semantic refactoring decision | complexity-analyzer/baseline, all applicable enforcement |

## Review discipline

A finding is not valid merely because a pattern is unusual. Skills must provide concrete evidence, identify the applicable rule or responsibility boundary, explain why the issue matters, and recommend the smallest correction that improves the design.

Skills MUST avoid metric gaming, speculative reuse, arbitrary decomposition, and creating abstractions solely to satisfy a threshold.

When one concern crosses multiple Skills, the Skill with the primary responsibility owns the finding and hands off the secondary concern rather than duplicating the same recommendation.
