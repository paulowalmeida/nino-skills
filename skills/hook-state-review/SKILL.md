---
name: hook-state-review
description: Review React Hooks, state, providers, guards, loaders, effects, and store consumers in nino-app for correct ownership, lifecycle, data flow, and coherent contracts.
---

# Hook and State Review

## Purpose

Determine whether state and side effects live at the narrowest stable boundary, whether a Hook has one coherent responsibility, and whether providers/stores are used for the correct kind of state.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, `rules/hooks.md`, and objective `enforce-*`/lint failures. React Rules of Hooks are hard constraints; this Skill handles architectural judgment around otherwise-valid code.

## Mandatory Review Sequence

1. Inspect the complete Hook/component/provider/store consumer.
2. Classify each relevant value as server, local UI, derived, form, or shared application state.
3. Identify authoritative source of truth and smallest stable owner.
4. Trace reads, writes, mutations, effects, provider boundaries, and callers.
5. Determine whether each Hook coordinates one coherent behavior.
6. For each effect, identify the external system it synchronizes with.
7. Check the returned contract for unnecessary coupling or unstable breadth.
8. Record findings and disposition.

## 9/10 Gates

Report a confirmed violation when evidence shows:

- server state is copied into another state layer without a concrete synchronization requirement;
- derived state is stored despite safe derivation from authoritative inputs;
- state is lifted/globalized beyond the actual consumer set;
- a Custom Hook combines unrelated domains or independent reasons to change;
- a Hook contains presentation composition or bypasses component-layer boundaries;
- a Provider owns unrelated workflows or side effects instead of a coherent shared capability;
- an effect mirrors values that should be derived or responds to an event that should be handled at the event boundary;
- an effect lifecycle does not match the thing it synchronizes;
- a store becomes a transport/service boundary or stores server state that belongs elsewhere;
- a guard/loader performs business workflow instead of route gating/loading coordination;
- the Hook contract exposes unrelated capabilities solely to hide internal complexity.

## Ownership Test

Ask:

> Who is the smallest stable owner that needs this state for correct product behavior?

Real shared ownership justifies lifting. Anticipated reuse does not.

## Effect Test

For every effect, identify the external system. If there is none, treat the effect as suspect and evaluate whether derivation or explicit event handling is the correct model.

## Hook Cohesion Test

Several operations may be valid inside one Hook when they form one coherent behavior/state machine. Length, line count, or operation count alone is not evidence of multiple responsibilities.

Split when responsibilities have materially different reasons to change or can be independently understood without reconstructing the parent Hook.

## State Classification

Do not infer state category from API shape alone. Confirm whether the value is authoritative, derived, temporary UI state, form state, or application-shared state from its lifecycle and consumers.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must name the missing caller/provider/lifecycle evidence. Never downgrade it to PASS because the local file looks plausible.

## Evidence Standard

Every confirmed finding MUST include exact file/line, state/effect category, current owner, expected owner, dependency/lifecycle evidence, impact, and minimal correction. Retrospective PASS requires inspection of the relevant consumer graph.

## Handoffs

- UI layer responsibility → `architecture-review`.
- Component/Composition boundary → `component-review` / `composition-review`.
- API/service/data ownership → `data-boundary-review`.
- Test consequences → `testing-review`.
- Structural decomposition → `complexity-refactoring`.
- Objective Rules of Hooks or mechanical constraints → enforcement/linting.

The receiving Skill owns final disposition; do not bounce findings without new evidence.

## Non-Goals

Do not split Hooks because they are long, globalize state for convenience, or replace an approved server-state boundary with local/global state without a concrete requirement.

## Final Review Gate

Before PASS, confirm authoritative source, state category, narrowest owner, effects/lifecycle, Hook cohesion, provider/store responsibility, returned contract, and relevant consumer graph were inspected.
