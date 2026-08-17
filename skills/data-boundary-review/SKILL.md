---
name: data-boundary-review
description: Review nino-app services, routers, libraries, constants, types, and adapters for clean data flow, domain/transport separation, and correct ownership.
---

# Data Boundary Review

## Purpose

Verify that transport, domain policy, transformation, caching, routing, and UI adaptation remain in their intended boundaries. This Skill reasons about ownership and flow; `enforce-*` hooks handle objective syntax/placement constraints.

## Authority

Apply `CLAUDE.md`, applicable `.claude/rules/*`, `rules/architecture.md`, `rules/coding.md`, `rules/hooks.md`, and package-local rules. Objective enforcement findings are hard constraints.

## Review Method

Trace a representative end-to-end path:

```text
UI intent → Hook/state boundary → Service/transport → domain mapping → consumer
```

For each step identify who owns validation, API transport, domain policy, transformation, caching, and presentation adaptation.

## 9/10 Gates

Flag when:

- a UI layer performs raw transport or business orchestration that belongs behind the approved boundary;
- a Service leaks presentation concerns or becomes a component/controller in disguise;
- an adapter encodes business policy instead of transforming representations;
- domain policy is hidden inside a generic utility, formatter, router, or transport helper;
- the router owns a business workflow instead of navigation/route governance;
- constants contain executable behavior or JSX, or are used as a hidden policy engine;
- local types duplicate an authoritative domain contract without a translation need;
- a utility is app-specific but presented as generic infrastructure;
- a boundary exists only in the filename while imports/callers violate its intended ownership;
- a new abstraction duplicates an existing approved data path without a concrete architectural need.

## Boundary Test

For every candidate violation ask:

1. What data enters this boundary?
2. What knowledge does the unit own?
3. What knowledge is it merely transporting?
4. Where is the authoritative source of truth?
5. Where should a future change in this concern occur?

Different reasons to change are strong evidence for different boundaries.

## Types Test

A type may legitimately be local when it represents a view model, request DTO, or adapter-specific representation. It is a defect only when local duplication creates a second source of truth or obscures an authoritative domain contract.

## Router Test

Navigation decisions may be route-specific. Business workflows, persistence policy, and domain mutation should not be hidden inside route modules merely because the route can reach the necessary dependencies.

## Evidence Standard

Every finding MUST include exact file/line, traced data path, current owner, expected owner, authoritative destination, and minimal correction. If the end-to-end graph is incomplete, inspect callers/callees before declaring a violation.

## Handoffs

- UI layer responsibility → `architecture-review`.
- Hook/state ownership → `hook-state-review`.
- Component/composition presentation boundary → `component-review` / `composition-review`.
- Naming/abstraction quality → `code-quality-review`.
- Mechanical import/type/structure violations → `enforce-*`.

## Non-Goals

Do not create a new Service/Adapter/Utility simply to move code to another file. Do not duplicate domain types merely to avoid an import. Do not treat every transformation as a new architectural layer.
