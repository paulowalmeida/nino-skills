---
name: complexity-refactoring
description: Review structural complexity in nino-app and decide whether refactoring materially improves responsibility, cohesion, comprehension, and maintainability.
---

# Complexity Refactoring

## Purpose

Use structural metrics as evidence to identify potentially risky code, then decide semantically whether the code actually needs refactoring. The goal is better responsibility boundaries and comprehension, not smaller numbers.

## Authority

Apply `CLAUDE.md`, applicable `.claude/rules/*`, `rules/coding.md`, `rules/architecture.md`, and objective `enforce-*` findings first. Static analysis is evidence; this Skill provides semantic judgment.

## Inputs

When available, inspect:

- function/module LOC;
- cyclomatic complexity;
- cognitive complexity;
- maximum nesting;
- parameter count;
- file size;
- function category and architectural layer;
- TSX composition context;
- caller/callee relationships;
- before/after structural metrics.

## First Decision: Is Refactoring Required?

A metric warning is not a refactoring mandate. Before changing code answer:

1. What is the unit's dominant responsibility?
2. Is that responsibility coherent?
3. Is the complexity inherent to that responsibility or accidental?
4. Is the function orchestration, implementation, or presentation composition?
5. Which structural problem is actually harmful: branching, nesting, mixed responsibilities, side effects, data transformation, or coupling?
6. Would another engineer understand the unit locally without reconstructing unrelated context?

If the responsibility is coherent and the metric is explained by legitimate composition/orchestration, do not refactor merely to improve the number.

## 9/10 Responsibility Gate

Refactor when distinct responsibilities have different reasons to change, strong coupling makes reasoning difficult, or a meaningful semantic boundary can make the system easier to understand.

Strong signals include:

- unrelated validation and persistence policy;
- transport handling mixed with domain policy;
- data acquisition mixed with unrelated presentation decisions;
- independent business policies hidden in one branch tree;
- side effects mixed with transformations that could remain pure;
- unrelated workflows combined only because they happen sequentially.

Sequential steps in one coherent workflow are not automatically multiple responsibilities.

## Extraction Test

An extraction is justified only when it creates a meaningful semantic boundary. Identify the responsibility, required inputs, owned output/effect, independent reason to change, and why the caller becomes easier to understand.

The extracted function/component MUST have a responsibility-derived name.

## Anti-Gaming

Reject decomposition that:

- only lowers LOC or a metric;
- moves the same branch tree to another function;
- creates parameter plumbing solely to preserve old coupling;
- creates wrappers that only forward arguments;
- splits coherent linear workflows into arbitrary steps;
- creates speculative abstractions without a real contract.

A refactor that merely relocates complexity is not a successful refactor.

## Cohesion and Caller Tests

After extraction:

- every resulting unit must be more internally coherent;
- each parameter must be necessary for the responsibility;
- unrelated state must not be threaded through the boundary;
- the caller should read at a higher level of abstraction without becoming opaque.

## TSX Composition Exception

Do not split a coherent TSX component solely because JSX is verbose. Extract UI when it has semantic identity, meaningful contract, independently understandable behavior, reuse value, or a clear architectural boundary.

## Hooks and Services

A Hook or Service may legitimately coordinate several operations when those operations form one coherent behavior/domain workflow. Split only when the responsibilities become independently changeable or independently understandable.

## Metrics and Thresholds

Metrics are control signals, not universal definitions of good code. Do not invent thresholds and present them as objective truth. Project-calibrated thresholds may identify review priority, but a warning still requires semantic judgment unless an explicit hard gate exists.

## Before/After Verification

A refactor is successful only when semantic quality is maintained or improved and structural risk is meaningfully reduced.

Compare:

```text
Structural
- LOC
- cyclomatic
- cognitive complexity
- nesting
- parameters

Semantic
- responsibility clarity
- cohesion
- caller readability
- coupling
- abstraction quality
- indirection
```

A lower metric with worse cohesion or readability is a failed refactor.

## Evidence Standard

Every finding MUST identify the structural signal, why it matters semantically, the proposed responsibility boundary, and the before/after evidence. Do not claim success from metrics alone.

## Handoffs

- UI layer mismatch → `architecture-review`.
- Component/Composition extraction → `component-review` / `composition-review`.
- Hook/state decomposition → `hook-state-review`.
- Service/data boundary → `data-boundary-review`.
- Naming/cohesion/abstraction → `code-quality-review`.

## Final Principle

> Metrics identify risk. They do not define good design. Refactor when responsibility, cohesion, nesting, coupling, or comprehensibility actually improves.
