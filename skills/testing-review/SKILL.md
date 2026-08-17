---
name: testing-review
description: Review nino-app tests for behavior coverage, boundary quality, isolation, failure-path confidence, selector/assertion stability, and maintainability.
---

# Testing Review

## Purpose

Determine whether tests protect important contracts, fail for the right reasons, remain stable under valid implementation change, and exercise the correct architectural boundary.

## Authority

Apply `CLAUDE.md`, applicable `rules/*`, and objective test enforcement first. This Skill evaluates semantic test quality; it does not replace linting or structural hooks.

## Mandatory Review Sequence

1. State the behavior/contract the test claims to protect.
2. Identify the narrowest stable boundary that can prove it.
3. Inspect setup, mocks, fixtures, selectors, assertions, and cleanup.
4. Check success, failure, boundary, permission, loading/empty, and concurrency-sensitive behavior where relevant.
5. Determine whether failures correspond to meaningful regressions.
6. Check for duplicate coverage or missing risk coverage.
7. Record each finding and disposition.

## 9/10 Gates

Report a confirmed defect when evidence shows:

- implementation details are asserted while the public behavior remains unprotected;
- a meaningful failure/error/permission path is absent;
- the test mocks the unit under test instead of an external boundary;
- mocks are so broad the target behavior can be bypassed;
- selectors/assertions depend on incidental DOM structure or formatting;
- snapshots replace clearer behavioral assertions without a justified value;
- shared setup hides required preconditions or makes the scenario hard to understand;
- fixtures are so large that the actual scenario is obscured;
- duplicate tests add no meaningful risk coverage;
- coverage-oriented tests exist without a concrete regression contract.

## Test Quality Test

Ask:

> What exact behavior would regress if the implementation changed, and would this test fail for the right reason?

A test is suspect when it survives removing the behavior under test, or fails because incidental markup/internal structure changed.

## Boundary Selection

Prefer the cheapest boundary that proves the behavior:

- pure transformation → unit;
- observable Hook/component state → Hook/component test;
- real module/service contract → integration;
- critical cross-system user workflow → end-to-end.

Do not force all behavior into E2E or all logic into unit tests.

## Finding Classification

Each item MUST be exactly one of `VIOLATION`, `LEGACY`, `EXCEPTION`, `NEEDS-EVIDENCE`, or `PASS`.

`NEEDS-EVIDENCE` must name the missing behavior contract, dependency, or execution path. It is not a soft PASS.

## Evidence Standard

Every confirmed finding MUST include exact test location, intended contract, current boundary, concrete blind spot/coupling, regression risk, and focused improvement. Retrospective PASS requires inspection of the relevant test and implementation contract, not test-name inference alone.

## Handoffs

- Objective test structure → `enforce-tests`.
- Hook/state behavior → `hook-state-review`.
- Component/Composition behavior → `component-review` / `composition-review`.
- API/service boundary → `data-boundary-review`.
- Test-setup complexity → `complexity-refactoring` only when structural evidence is material.

The receiving Skill owns final disposition; no ping-pong without new evidence.

## Non-Goals

Do not equate coverage percentage with quality. Do not add tests for trivial implementation details. Do not use snapshots as a substitute for meaningful behavioral assertions.

## Final Review Gate

Before PASS, confirm the contract, boundary, success/failure coverage, mock boundary, selector/assertion stability, setup clarity, and regression signal were inspected.
