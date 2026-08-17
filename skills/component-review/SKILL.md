---
name: component-review
description: Review nino-app Components for Design System usage, responsibility boundaries, CSS ownership, naming, cohesion, and meaningful extraction.
---

# Component Review

## Purpose

Determine whether a Component is a coherent UI unit with the smallest practical responsibility, correct DS usage, explicit ownership, and a stable public contract.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, then objective `enforce-*` results. Mechanical failures are hard defects. Existing code is evidence, not permission.

## Mandatory Review Sequence

1. Inspect the complete component, its CSS, exports, props, state, effects, and immediate callers.
2. Inspect the applicable DS catalog before judging native markup or local styling.
3. Confirm folder/file/export ownership and whether the unit contains unrelated code.
4. Determine the component's dominant responsibility and reasons to change.
5. Check composition direction, state ownership, data access, and public API.
6. Evaluate extraction only after the boundary is understood.
7. Record each finding and disposition.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- sibling application Components are composed where the architecture forbids it;
- service/API orchestration or business policy is owned by the Component;
- raw markup recreates an existing DS primitive without a demonstrated DS gap;
- local styling recreates an existing DS contract or bypasses the intended styling boundary;
- a folder contains unrelated Components, stories/examples, or support code that obscures ownership;
- CSS exists without clear ownership, or ownership is implicit across unrelated units;
- nested JSX contains an independent UI responsibility that is already a meaningful boundary;
- the public props contract exposes implementation details or unrelated concerns;
- a proposed extraction only reduces LOC, moves the same coupling, or creates parameter plumbing;
- names obscure the actual UI/domain responsibility.

## DS-First Test

For every non-trivial native element or handcrafted visual pattern:

1. identify its semantic role;
2. inspect the current DS catalog;
3. determine whether an equivalent exists;
4. reuse it when it exists;
5. when it does not, record the concrete reason local implementation is necessary.

Repository precedent is not evidence that a duplicate primitive is correct.

## SRP / Extraction Test

Extract only when the candidate has semantic identity, independent state/style, or a distinct reason to change **and** the caller becomes easier to understand. Reuse is optional; semantic ownership is sufficient.

Reject extraction that merely:

- lowers line count;
- hides a branch tree;
- forwards parameters through a wrapper;
- creates speculative reuse;
- increases indirection without improving responsibility.

## Naming Test

Names MUST communicate the UI/domain role without requiring implementation inspection. Conventional concise names are acceptable when unambiguous in context; generic names are a problem when they conceal scope or responsibility.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must state which callers, DS entries, or related files remain necessary. It must not be silently treated as PASS.

## Resolution Protocol

- **VIOLATION:** provide the evidence and required correction.
- **LEGACY:** identify the out-of-scope violation; it MUST NOT justify new code.
- **EXCEPTION:** record the explicit project authorization and exact scope. No inferred or convenience exceptions.
- **NEEDS-EVIDENCE:** name the missing evidence and the next concrete inspection needed. It remains unresolved until that evidence is obtained or the review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

A review MUST NOT end with an unresolved `NEEDS-EVIDENCE` item silently treated as PASS. If required evidence cannot be obtained, the final status is **INCOMPLETE**, not PASS.

## Evidence Standard

Every confirmed finding MUST contain exact file/line, observed behavior, expected boundary, relevant DS evidence, impact, and the smallest correction. Retrospective PASS requires complete inspection of the scoped component, not search results alone.

## Handoffs

- Atomic layer responsibility → `architecture-review`.
- Section-level UI → `composition-review`.
- Hook/state/effect → `hook-state-review`.
- Data/service boundary → `data-boundary-review`.
- Naming/abstraction/cohesion → `code-quality-review`.
- Structural decomposition → `complexity-refactoring`.
- Objective CSS/import/structure violations → `enforce-*`.

The receiving Skill owns the disposition; do not bounce a finding back without new evidence.

## Non-Goals

Do not create speculative abstractions or treat file size as proof of poor design. Do not use existing code as architectural permission. Do not auto-fix during review unless implementation was explicitly requested.

## Final Review Gate

Before PASS, confirm component scope, DS decision, responsibility, state/data ownership, CSS ownership, naming, extraction risk, relevant callers, and objective enforcement results were inspected.
