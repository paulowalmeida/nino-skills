---
name: architecture-review
description: Review nino-app UI architecture, Atomic Design layer placement, responsibility boundaries, and cross-layer behavior. Use when a decision requires semantic judgment beyond the enforce-* hooks.
---

# Architecture Review

## Purpose

Determine whether a unit is responsible for the right job in the right UI layer. This Skill is the semantic counterpart to mechanical boundary enforcement; it must reason about behavior, ownership, and architectural intent rather than merely matching imports or folders.

## Authority

Apply, in order:

1. `CLAUDE.md` and applicable `.claude/rules/*` instructions;
2. `rules/architecture.md` and `rules/coding.md`;
3. objective `enforce-*` diagnostics;
4. this Skill for semantic judgment.

A mechanical enforcement failure is an objective defect. Do not reclassify it as a semantic preference to avoid fixing it.

Existing code is evidence, not permission. A legacy pattern is not precedent for new work.

## Review Method

1. Identify the unit's actual behavior from its implementation and callers.
2. Classify the unit independently of its filename or folder.
3. Identify what it renders, imports, owns, fetches, mutates, decides, and exposes.
4. Compare those responsibilities with the target layer.
5. Trace one level upward and downward whenever ownership is ambiguous.
6. Check whether the name, public contract, and file placement communicate the same architectural intent.
7. Check whether the proposed correction fixes the ownership boundary rather than merely moving code.

## Layer Boundaries

- **Element:** small UI unit; may use DS primitives and narrow interaction/router glue. It must not compose application-level Components or carry domain policy.
- **Component:** one coherent UI unit built from Elements and DS primitives. It must not compose sibling application Components, own API orchestration, or encode business policy.
- **Composition:** named cohesive application section combining Components/Elements. It may own local interaction/form state, but not direct service access, route governance, or application-wide orchestration.
- **Page:** route governance only: params, redirects, top-level loading/error coordination, and selection of the Composition to render. It wires; it does not implement domain policy.
- **Layout:** shared shell/chrome and route outlet. It must not choose or inspect the active page to implement page-specific behavior.

## 9/10 Gates

A finding is strong enough to report when there is concrete evidence that:

- responsibility belongs to a different layer;
- a unit's name or boundary hides a materially larger responsibility;
- a Page implements business rules, validation, transport, or composition behavior;
- a Composition has become a hidden Page controller or service boundary;
- an Element behaves like a Component or Composition;
- a Layout contains page-specific decisions;
- an extraction would merely move the same responsibility and coupling elsewhere;
- the proposed architecture cannot be explained from the unit's public contract without reconstructing unrelated context.

Do not report a violation solely because a file is large, a different layering choice is imaginable, or the folder name is unconventional.

## Boundary Test

Ask:

> What would change if this unit were moved to another route, another layer, or another consumer?

A responsibility with a different reason to change belongs behind a different boundary. A sequence of steps inside one coherent workflow does not automatically represent multiple responsibilities.

## Evidence Standard

Every finding MUST include:

- exact file and line/range;
- observed behavior;
- current layer/owner;
- expected layer/owner;
- violated rule or boundary;
- why the mismatch matters;
- smallest correction that restores the boundary.

When the evidence is incomplete, mark the finding as requiring further inspection instead of asserting a violation.

## Handoffs

- Purely mechanical import/structure/type/CSS violations → `enforce-*` hook.
- JSX/component boundary or DS-first concerns → `component-review` or `composition-review`.
- State/effect/provider ownership → `hook-state-review`.
- API/service/router/adapter/data flow → `data-boundary-review`.
- Naming/cohesion/abstraction quality → `code-quality-review`.
- Structural complexity → `complexity-refactoring`.

## Non-Goals

Do not create a new layer because the existing one is inconvenient. Do not introduce abstractions solely to satisfy this review. Do not use folder names as proof of responsibility. Do not replace a valid existing abstraction with an equivalent one without a concrete architectural improvement.
