---
name: testing-review
description: Review nino-app tests for behavior coverage, boundary quality, isolation, failure-path confidence, and maintainability.
---

# Testing Review

## Purpose

Determine whether tests protect the behavior and contracts that matter, remain stable under legitimate implementation change, and exercise the correct architectural boundary.

## Authority

Apply `CLAUDE.md`, `.claude/rules/testing.md`, applicable `.claude/rules/*`, and `rules/testing.md`. Objective test-structure rules enforced by hooks remain hard constraints; this Skill evaluates test quality and risk coverage.

## Review Method

1. State the behavior/contract that the test is supposed to protect.
2. Identify the narrowest stable boundary through which that behavior should be observed.
3. Inspect success, failure, boundary, permission, loading, empty, and race-sensitive paths where relevant.
4. Check isolation and mock boundaries.
5. Check whether assertions fail for meaningful reasons.
6. Remove incidental coupling before adding more test cases.

## 9/10 Gates

Flag when:

- a test mirrors implementation details while leaving the public behavior unprotected;
- a meaningful failure path is untested;
- the test mocks the unit under test rather than an external dependency/boundary;
- a mock is so broad that the test can pass without exercising the intended behavior;
- selectors/assertions depend on incidental DOM structure rather than stable semantics;
- snapshots hide important behavioral assertions or create noisy false confidence;
- shared setup obscures the actual preconditions and outcome of the scenario;
- fixtures are so large that the tested behavior cannot be understood locally;
- duplicate tests cover the same contract with no additional risk coverage;
- a proposed test exists only to raise coverage instead of protecting a meaningful contract.

## Test Quality Test

A strong test answers:

> What behavior would regress if this implementation changed, and would this test fail for the right reason?

A test that would survive removing the behavior under test is suspect. A test that fails because markup spacing or an internal helper changed is usually too coupled.

## Boundary Test

Prefer:

- unit tests for pure domain transformations;
- Hook/component tests for observable UI/state contracts;
- integration tests at real module/service boundaries;
- end-to-end tests only for critical user workflows that cross meaningful system boundaries.

Do not push every behavior into the most expensive test layer.

## Evidence Standard

Every finding MUST identify the intended contract, current test boundary, concrete blind spot or coupling, and focused improvement. Do not recommend broad test expansion without identifying the risk it addresses.

## Handoffs

- Objective test file/structure rule → `enforce-tests`.
- Hook/state behavior → `hook-state-review`.
- Component/composition behavior → `component-review` / `composition-review`.
- API/service boundary behavior → `data-boundary-review`.
- Complexity introduced solely by test setup → `complexity-refactoring` only when structural evidence warrants it.

## Non-Goals

Do not equate coverage percentage with quality. Do not demand tests for trivial implementation details. Do not replace a focused assertion with a snapshot merely because it is shorter.
