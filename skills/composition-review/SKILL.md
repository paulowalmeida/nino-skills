---
name: composition-review
description: Review nino-app Compositions for cohesive section boundaries, DS-first implementation, local interaction ownership, service isolation, naming, and meaningful extraction.
---

# Composition Review

## Purpose

Determine whether a Composition remains a named, cohesive application section rather than becoming a hidden Page, Service, or Design System primitive.

## Authority

Apply `CLAUDE.md`, applicable `.claude/rules/*`, `rules/architecture.md`, `rules/design-system.md`, `rules/coding.md`, and `rules/styling.md`. Mechanical `enforce-*` diagnostics are objective constraints; this Skill supplies semantic review where pattern matching is unsafe.

## Review Method

1. Identify the Composition's dominant responsibility.
2. Inspect what it renders, owns, fetches, mutates, and decides.
3. Trace the route/Page above it and the Components/Elements below it.
4. Verify local interaction state is truly local to the section.
5. Inspect DS usage, naming, CSS ownership, and extraction boundaries.

## 9/10 Gates

Flag when:

- the section implements route governance, redirects, or page-level orchestration;
- it calls services directly or becomes an API boundary instead of using the approved lower layer;
- it owns unrelated business workflows merely because they appear on the same screen;
- it becomes a generic UI primitive that should belong to the DS or a lower layer;
- it recreates an existing DS primitive without a demonstrated gap;
- its JSX contains multiple independent sections with distinct reasons to change and no semantic boundary;
- extraction would merely create wrappers, duplicate props, or move complexity without improving cohesion;
- its name suggests a generic container while its behavior is domain-specific;
- CSS or support files are attached to the Composition without clear ownership.

## Boundary Test

Ask:

> If this section moved to another Page, which responsibilities would remain valid and which would break?

Route-specific governance belongs above the Composition. Shared reusable UI behavior belongs below or beside it according to the project rules. The Composition itself should remain the named section boundary.

## DS-First Test

Inspect the actual DS catalog before accepting hand-built typography, layout primitives, form fields, status indicators, or repeated visual patterns. Existing precedent is not proof of correctness.

## Extraction Test

Extract when the candidate has semantic identity, independent state/styling, or a distinct reason to change and the resulting caller becomes easier to understand. Do not split merely because a block is long.

## Evidence Standard

Every finding MUST include exact file/line, observed responsibility, expected boundary, concrete evidence, and a minimal correction. Distinguish confirmed violations from questions requiring caller/route inspection.

## Handoffs

- Wrong Atomic Design layer → `architecture-review`.
- Component-level issue → `component-review`.
- State/effect ownership → `hook-state-review`.
- Service/API/data flow → `data-boundary-review`.
- Complexity or extraction quality → `complexity-refactoring` / `code-quality-review`.
- Mechanical import/CSS/structure issue → corresponding `enforce-*` hook.

## Non-Goals

Do not create a Composition solely because JSX is large. Do not create abstractions for speculative reuse. Do not treat one existing implementation as an architectural standard.
