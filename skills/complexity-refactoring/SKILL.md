---
name: complexity-refactoring
description: Review structural complexity in nino-app and decide whether refactoring materially improves responsibility, cohesion, comprehension, coupling, and maintainability.
---

# Complexity Refactoring

## Purpose

Use structural metrics as risk evidence and decide semantically whether refactoring is justified. The objective is better design, not smaller numbers.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, then objective enforcement failures. Static analysis informs this Skill; it does not replace semantic judgment or override hard rules.

## Mandatory Review Sequence

1. Inspect the complete unit and its architectural layer.
2. Capture available structural signals: LOC, cyclomatic, cognitive, nesting, parameters, file size, and relevant static metrics.
3. Identify the dominant responsibility and its reasons to change.
4. Determine whether complexity is inherent to a coherent workflow or accidental.
5. Inspect callers/callees when extraction boundaries depend on external usage.
6. Propose only semantic boundaries.
7. Compare before/after structural **and** semantic quality.
8. Record the final disposition.

## 9/10 Responsibility Gate

Refactor when distinct responsibilities have materially different reasons to change, coupling makes reasoning difficult, or a meaningful boundary clearly improves comprehension.

Strong signals include mixed validation/persistence policy, transport/domain mixing, unrelated presentation/data workflows, independent policies hidden in one branch tree, or effects mixed with pure transformation.

Sequential steps in one coherent workflow are not automatically multiple responsibilities.

## Extraction Test

Before extraction, identify:

- responsibility extracted;
- genuine inputs;
- owned output/effect;
- independent reason to change;
- semantic name;
- why the caller becomes easier to understand.

If those cannot be stated clearly, do not extract.

## Anti-Gaming / Complexity Relocation

Reject refactors that:

- only lower LOC or metrics;
- move the same branch tree elsewhere;
- create parameter plumbing solely to preserve coupling;
- create forwarding wrappers;
- split coherent linear workflows arbitrarily;
- create speculative abstractions;
- distribute one complex responsibility across many tightly coupled helpers.

A lower metric with worse cohesion, readability, or coupling is a failed refactor.

## TSX Exception

Do not split a coherent component because JSX is verbose. Extract UI only when it has semantic identity, meaningful contract, independent behavior, or a clear architectural boundary. Arbitrary JSX fragments are not valid extraction targets merely because they are long.

## Hook and Service Guidance

A Hook or Service may coordinate several operations when they form one coherent behavior/domain workflow. Split only when responsibilities become independently changeable or understandable. File size alone is not evidence.

## Threshold Policy

Metrics are diagnostic unless the project explicitly defines a hard threshold. Never invent a threshold and present it as project policy. A warning requires semantic review; only an explicit hard gate creates a mandatory refactoring outcome.

## Before/After Gate

Compare both:

```text
Structural
- LOC
- cyclomatic
- cognitive complexity
- nesting
- parameter count

Semantic
- responsibility clarity
- cohesion
- caller readability
- coupling
- abstraction quality
- indirection
```

The final implementation must preserve or improve semantic quality while meaningfully reducing structural risk when risk reduction was the reason for change.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

## Resolution Protocol

- **VIOLATION:** provide structural and semantic evidence plus the required correction.
- **LEGACY:** identify the out-of-scope complexity; it MUST NOT justify metric-driven decomposition in new work.
- **EXCEPTION:** record explicit project authorization and exact scope. Do not infer exceptions from metric convenience.
- **NEEDS-EVIDENCE:** identify the missing metric/caller/architecture evidence and the next concrete inspection. It remains unresolved until evidence is obtained or review is explicitly closed as incomplete.
- **PASS:** may be declared only after the Final Review Gate is satisfied.

An unresolved `NEEDS-EVIDENCE` item MUST NOT be silently converted to PASS. If required evidence cannot be obtained, final status is **INCOMPLETE**.

## Evidence Standard

Every confirmed finding MUST identify the structural signal, why it matters semantically, proposed responsibility boundary, and before/after evidence. Never claim success from metrics alone.

## Handoffs

- UI layer mismatch → `architecture-review`.
- Component/Composition extraction → `component-review` / `composition-review`.
- Hook/state decomposition → `hook-state-review`.
- Service/data boundary → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.

The receiving Skill owns final disposition; no ping-pong without new evidence.

## Non-Goals

Do not refactor to satisfy an arbitrary metric, create wrappers without semantic boundaries, or split coherent workflows solely because they are long.

## Final Review Gate

Before PASS/complete, confirm the original complexity signal was understood, semantic refactoring reason is explicit, complexity was not relocated, caller comprehension improved, before/after evidence was inspected, applicable enforcement still passes, and all `NEEDS-EVIDENCE` items are resolved or explicitly reported as INCOMPLETE.

## Final Principle

> Metrics identify risk. They do not define good design. Refactor when responsibility, cohesion, coupling, nesting, or comprehensibility actually improves.
