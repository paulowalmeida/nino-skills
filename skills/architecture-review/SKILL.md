---
name: architecture-review
description: Review nino-app UI architecture, Atomic Design layer placement, responsibility boundaries, and cross-layer violations. Use when deciding whether a unit belongs in Elements, Components, Compositions, Pages, or Layouts, or whether behavior is owned by the correct layer.
---

# Architecture Review

## Purpose

Determine whether an existing unit is architecturally placed in the correct UI layer and whether responsibilities respect the boundaries defined by the Nino rules.

## Authority

Treat `rules/architecture.md`, `rules/coding.md`, and the nino-app `.claude/rules/*` references as authoritative. Mechanical `enforce-*` failures are objective constraints and must not be rationalized away.

## Review Method

1. Identify the unit's actual responsibility from its behavior, not its folder or name.
2. Classify it as Element, Component, Composition, Page, or Layout.
3. Compare what it imports, renders, owns, fetches, mutates, and decides against that layer's responsibilities.
4. Trace caller/callee relationships when local code is insufficient.
5. Check whether the name communicates the correct architectural level.

## Layer Boundaries

- **Element:** small UI primitive; may use DS primitives and narrow interaction/router glue. It must not compose app-level components or contain domain policy.
- **Component:** combines Elements/DS primitives into one coherent UI unit. It must not compose sibling app Components, fetch domain data, or own business policy.
- **Composition:** named cohesive section combining Components/Elements. It may own local interaction/form state but must not call services directly or become an application-wide primitive.
- **Page:** route governance only: params, redirects, top-level loading/error state, and deciding which Composition to render. Business logic, validation, API orchestration, and presentation implementation belong below it.
- **Layout:** shared chrome and route outlet. It must not know or select the active Page.

## 9/10 Gates

Flag when:

- a unit performs work belonging to another layer;
- a name hides a larger responsibility than the layer implies;
- a page implements business or presentation policy instead of wiring it;
- a composition becomes a service boundary or hidden page controller;
- an element silently behaves like a component/composition;
- a layout contains page-specific decisions;
- a proposed extraction would merely move responsibility without creating a meaningful boundary.

## Evidence

Report exact file, line/range, current layer, expected layer, concrete responsibility mismatch, and the smallest architecture-preserving correction. Do not modify code during review unless the user explicitly requests implementation.

## Non-Goals

Do not reject code solely because a file is large, because a pattern appears elsewhere, or because a folder name looks unusual. Judge behavior and ownership first.
