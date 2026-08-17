---
name: architecture-review
description: Review nino-app UI architecture, Atomic Design layer placement, responsibility boundaries, and cross-layer behavior. Use when semantic judgment is required beyond enforce-* checks.
---

# Architecture Review

## Purpose

Determine whether each unit owns the right responsibility at the right UI layer. Review behavior and dependency direction, not folder names alone.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, then objective `enforce-*` results. A mechanical violation is a defect, not a semantic preference. Existing code is evidence, never permission.

## Mandatory Review Sequence

1. Define the review scope and affected units.
2. Read the applicable architecture and coding rules.
3. Inspect the target unit completely enough to understand its public contract.
4. Inspect immediate callers/callees when ownership is ambiguous.
5. Determine the unit's actual responsibility from behavior, not location or name.
6. Classify the unit: Element, Component, Composition, Page, or Layout.
7. Compare imports, rendered children, state, effects, data access, decisions, and exposed API with that layer.
8. Check whether a proposed correction restores ownership or merely relocates code.
9. Record each finding with evidence and a final disposition.

## Layer Contract

- **Element:** small UI unit; may use DS primitives and narrow router/interaction glue. No app-level composition or domain policy.
- **Component:** coherent UI unit from Elements/DS primitives. No sibling app Components, API orchestration, or business policy.
- **Composition:** named application section. May own local interaction/form state; no direct services, route governance, or application-wide orchestration.
- **Page:** route governance: params, redirects, top-level loading/error coordination, and selecting the Composition. It wires; it does not implement domain policy.
- **Layout:** shared chrome plus route outlet. It must not inspect or select the active Page.

## 9/10 Gates

Report a confirmed violation when evidence shows at least one of:

- responsibility belongs to another layer;
- a boundary hides materially different reasons to change;
- a Page implements business rules, validation, transport, or composition behavior;
- a Composition becomes a hidden Page controller or service boundary;
- an Element behaves like a Component/Composition;
- a Layout contains page-specific behavior;
- a boundary change would only move coupling without improving ownership;
- the public contract is misleading enough that correct reuse/extension decisions require reconstructing unrelated context.

Do **not** report a violation solely because:

- a file is large;
- a unit has several sequential steps in one coherent workflow;
- an alternate architecture is imaginable;
- a folder/name is unconventional but behavior is correct.

## Boundary Test

Ask: **what has the same reason to change?** Responsibilities with materially different reasons to change should not be forced behind one boundary. Conversely, do not split a coherent workflow merely because it contains several steps.

## Finding Classification

Every review item MUST end as exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

- **VIOLATION:** demonstrably breaks a rule/boundary.
- **LEGACY:** violates the target architecture but is outside the current task; never use it as precedent.
- **EXCEPTION:** intentional deviation with explicit project authorization and explicit scope.
- **NEEDS-EVIDENCE:** plausible concern with missing required evidence.
- **PASS:** sufficient inspection found no applicable violation.

## Resolution Protocol

A `NEEDS-EVIDENCE` item MUST name the missing evidence and the next concrete inspection. It remains unresolved until that evidence is obtained or the review is explicitly closed as incomplete.

A review MUST NOT end by silently converting `NEEDS-EVIDENCE` into `PASS`. If required evidence cannot be obtained, the final status is **INCOMPLETE**.

An `EXCEPTION` without explicit authorization is not an exception; classify it as `NEEDS-EVIDENCE` until authorization is established.

## Evidence Standard

A confirmed finding MUST include exact file/line, observed behavior, current owner/layer, expected owner/layer, violated rule, impact, and the smallest correction that restores the boundary.

For retrospective audits, inspect the complete relevant unit and required dependency context before reporting a clean PASS.

## Handoffs

- Mechanical import/type/CSS/structure rule → corresponding `enforce-*`.
- Component/Composition boundary or DS usage → `component-review` / `composition-review`.
- Hook/state/effect/provider ownership → `hook-state-review`.
- API/service/router/adapter/data flow → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.
- Complexity-driven decomposition → `complexity-refactoring`.

The receiving Skill owns the final disposition. Do not bounce a finding back without new evidence.

## Non-Goals

Do not create layers for convenience, introduce speculative abstractions, or use folder structure as proof. Do not fix code during review unless implementation was explicitly requested.

## Final Review Gate

Before PASS/complete, confirm scope was fully inspected, applicable enforcement was considered, every finding has a disposition, no mechanical failure was reclassified as subjective, all `NEEDS-EVIDENCE` items are resolved or explicitly reported as INCOMPLETE, and proposed corrections restore responsibility instead of relocating it.
