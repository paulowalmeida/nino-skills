---
name: code-quality-review
description: Review nino-app semantic clarity, naming, comments, abstraction quality, cohesion, duplication, and maintainability beyond mechanical enforcement.
---

# Code Quality Review

## Purpose

Review qualities that are difficult to encode safely as blocking rules: whether code communicates intent locally, whether abstractions represent real concepts, and whether changes improve cohesion instead of merely metrics.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, then objective `enforce-*` results. This Skill supplies semantic judgment; it must not turn personal style into mandatory project policy.

## Mandatory Review Sequence

1. Read the complete target unit and relevant public API.
2. Identify what a reader must infer from names, control flow, comments, and surrounding context.
3. Identify dominant responsibility and reasons to change.
4. Inspect callers when abstraction quality depends on usage.
5. Check for an existing approved abstraction before proposing a new one.
6. Evaluate the smallest semantic improvement.
7. Record each finding and disposition.

## 9/10 Gates

Report a confirmed defect when evidence shows:

- a name describes implementation shape instead of domain/UI meaning and materially obscures intent;
- a comment restates mechanics or compensates for a name that should carry the meaning;
- an abstraction exists only for LOC reduction, metric compliance, or hypothetical reuse;
- a helper name hides materially unrelated responsibilities;
- a wrapper merely forwards parameters without a semantic contract;
- duplicated knowledge has the same reason to change but remains artificially separate;
- extraction reduces local size while worsening cohesion, parameter plumbing, or indirection;
- generic containers such as `data`, `config`, `content`, `utils`, or `handleChange` conceal domain meaning where a precise name exists;
- a simple local workflow requires opening several unrelated helpers to understand it;
- concepts are coupled only because they execute sequentially when a clearer local workflow is possible.

## Naming Test

A strong name communicates domain, UI role, state meaning, or action without implementation inspection. Conventional concise names are acceptable when unambiguous within the bounded context.

## Comment Test

Prefer code that explains itself. Keep comments only for facts code cannot express directly: hidden constraints, non-obvious ordering, compatibility/workaround reasoning, or important external assumptions.

## Abstraction Test

Before proposing an abstraction, identify:

- concept being abstracted;
- independent reason it exists;
- contract created;
- improvement to caller/consumer clarity;
- existing abstractions checked and why they are insufficient.

## Anti-Gaming

Do not refactor because a number feels high, a file looks unfamiliar, or a different style is preferred. Do not optimize for shorter code at the expense of comprehension.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

## Resolution Protocol

- **VIOLATION:** provide exact evidence, concrete maintenance risk, and focused correction.
- **LEGACY:** identify the out-of-scope defect; it MUST NOT justify new weak code.
- **EXCEPTION:** record explicit project authorization and exact scope. No convenience or inferred exceptions.
- **NEEDS-EVIDENCE:** identify missing caller/context evidence and the next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently converted to PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

## Evidence Standard

Every confirmed finding MUST include exact file/line, what the reader must infer, concrete maintenance risk, applicable rule/principle, and smallest semantic improvement. Retrospective PASS requires sufficient surrounding-context inspection.

## Handoffs

- Responsibility/layer → `architecture-review`.
- Component/Composition boundary → `component-review` / `composition-review`.
- Hook/state → `hook-state-review`.
- Data/service → `data-boundary-review`.
- Structural complexity → `complexity-refactoring`.

The receiving Skill owns final disposition; no ping-pong without new evidence.

## Non-Goals

Do not refactor merely to make code look different. Do not force DRY, abstraction, comments, or naming conventions beyond project rules and semantic evidence.

## Final Review Gate

Before PASS/complete, confirm naming, comments, abstraction justification, cohesion, caller readability, duplication risk, existing-solution search, applicable enforcement, and resolution of all `NEEDS-EVIDENCE` items were inspected. Unresolved required evidence produces INCOMPLETE.
