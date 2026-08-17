---
name: hook-state-review
description: Review React Hooks, state, providers, guards, loaders, effects, and store consumers in nino-app for correct ownership and data-flow boundaries.
---

# Hook and State Review

## Purpose

Determine whether state, effects, providers, guards, loaders, and custom Hooks live at the narrowest correct boundary and expose a coherent contract.

## Authority

Apply `CLAUDE.md`, `.claude/rules/*`, `rules/hooks.md`, `rules/architecture.md`, and applicable testing rules. Objective `enforce-*` failures are hard constraints. React Rules of Hooks are non-negotiable; this Skill reviews the architectural questions around otherwise-valid Hook usage.

## Review Method

1. Classify each state value as server state, local UI state, derived state, form state, or shared application state.
2. Identify its current owner and the narrowest set of consumers.
3. Trace reads, writes, effects, mutations, and provider/store boundaries.
4. Determine whether a Hook is orchestrating one coherent behavior or hiding multiple independent responsibilities.
5. Inspect dependencies and callers when ownership is ambiguous.

## 9/10 Gates

Flag when:

- server state is copied into local/global state without a concrete synchronization requirement;
- derived state is stored instead of safely derived from authoritative inputs;
- state is lifted higher than necessary or globalized merely for convenience;
- a custom Hook combines unrelated domains, workflows, or independent reasons to change;
- a Hook contains presentation composition or becomes an architectural escape hatch around layer rules;
- a Provider becomes a dumping ground for unrelated state, workflows, or side effects;
- an effect is used to mirror values that could be derived or triggered by the actual event;
- side effects occur in an abstraction whose lifecycle/ownership does not match the effect;
- a Hook returns a broad unstable contract solely to hide internal complexity;
- guards/loaders perform business workflows instead of route gating/loading coordination;
- a Zustand/application store becomes a transport/service boundary or stores data that belongs to server-state tooling.

## Ownership Test

Ask:

> Who is the smallest stable owner that needs this state to make the product behavior correct?

Moving state upward is justified by real shared ownership, not by anticipated reuse. Moving it downward is preferred when broader ownership is unnecessary.

## Effect Test

For each effect, identify the external system it synchronizes with. If there is no external synchronization, question whether the effect is actually derived state or event handling in disguise.

## Hook Cohesion Test

A Hook may coordinate several operations when they form one coherent user-facing or domain behavior. Multiple lines or operations alone are not evidence of multiple responsibilities. Split only when responsibilities have different reasons to change or can be independently understood.

## Evidence Standard

Every finding MUST include exact file/line, state/effect category, current owner, expected owner, dependency path or lifecycle evidence, and the smallest correction. Mark conclusions as uncertain when the caller/provider graph is incomplete.

## Handoffs

- UI layer responsibility → `architecture-review`.
- Component/composition boundary → `component-review` / `composition-review`.
- API/service/data ownership → `data-boundary-review`.
- Testing consequences → `testing-review`.
- Complexity-driven decomposition → `complexity-refactoring`.
- Rules of Hooks violations or other objective constraints → enforcement/linting.

## Non-Goals

Do not split Hooks because they are long. Do not globalize state for convenience. Do not replace server-state mechanisms with local state without a concrete product requirement.
