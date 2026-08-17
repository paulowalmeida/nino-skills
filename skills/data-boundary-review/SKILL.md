---
name: data-boundary-review
description: Review nino-app services, routers, libraries, constants, types, and adapters for clean data flow, domain/transport separation, authoritative sources, and correct ownership.
---

# Data Boundary Review

## Purpose

Verify that transport, domain policy, transformation, caching, routing, and UI adaptation remain in their intended boundaries and that each concern has one authoritative owner.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, then objective `enforce-*` results and package-local constraints. Mechanical failures are hard defects.

## Mandatory Review Sequence

1. Inspect the target unit completely enough to identify its public contract.
2. Trace one representative end-to-end path:

```text
UI intent → Hook/state → Service/transport → mapping/domain → consumer
```

3. For each boundary, identify who owns validation, transport, domain policy, transformation, caching, and presentation adaptation.
4. Inspect callers/callees where ownership is ambiguous.
5. Search for existing authoritative types, services, adapters, and paths before proposing a new boundary.
6. Record each finding and disposition.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- UI performs raw transport/business orchestration outside the approved boundary;
- a Service leaks presentation concerns or acts as a UI controller;
- an Adapter encodes business policy instead of representation mapping;
- domain policy is hidden in a generic utility, formatter, router, or transport helper;
- router modules implement business workflows, persistence policy, or domain mutation;
- constants contain executable behavior/JSX or become hidden policy engines;
- local types create a second source of truth without a real translation need;
- a supposedly generic utility depends on app-specific UI/domain knowledge;
- the boundary exists only in filename/location while actual dependencies violate it;
- a new Service/Adapter/Utility duplicates an existing approved data path without a demonstrated requirement.

## Source-of-Truth Test

For every important type, policy, or data transformation ask:

1. Where is the authoritative definition?
2. Is this unit consuming, transporting, translating, or redefining it?
3. If it translates, is the translation contract explicit?
4. Would a future policy change require editing multiple places?

Duplication is not automatically a defect when the second representation is a deliberate DTO/view model/adapter contract.

## Router Test

Navigation and route selection may be route-specific. Business workflows, persistence policy, and domain mutation must remain outside route governance.

## Boundary Test

Different reasons to change are evidence for separate ownership. Do not create boundaries merely because a file is large, and do not accept a boundary merely because code was moved into a file with the right name.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must state which path, caller, authoritative source, or rule remains unresolved.

## Resolution Protocol

- **VIOLATION:** provide the evidence and required correction.
- **LEGACY:** identify the out-of-scope violation; it MUST NOT justify new code.
- **EXCEPTION:** record explicit project authorization and exact scope. No inferred or convenience exceptions.
- **NEEDS-EVIDENCE:** name the missing evidence and the next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently treated as PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

## Evidence Standard

Every confirmed finding MUST include exact file/line, traced data path, current owner, expected owner, authoritative source/destination, impact, and minimal correction. Retrospective PASS requires enough dependency inspection to prove the data path considered.

## Handoffs

- UI layer → `architecture-review`.
- Hook/state → `hook-state-review`.
- Component/Composition presentation boundary → `component-review` / `composition-review`.
- Naming/abstraction → `code-quality-review`.
- Structural decomposition → `complexity-refactoring`.
- Mechanical import/type/structure → `enforce-*`.

The receiving Skill owns the final disposition; no ping-pong without new evidence.

## Non-Goals

Do not create layers merely to relocate code. Do not duplicate domain types just to avoid an import. Do not treat every mapping function as a new architectural layer.

## Final Review Gate

Before PASS, confirm authoritative sources, end-to-end path, ownership of each transformation/policy, boundary direction, caller evidence, duplicate-source risk, and objective enforcement results were inspected.
