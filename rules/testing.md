# Testing Rules

This file defines mandatory testing constraints. The rules are target architecture, not a description of every current repository configuration.

## Current Code Is Not Architectural Precedent

Existing code in `nino-app/apps/manager` is current/legacy evidence. If existing code conflicts with this file, it MUST NOT be copied, extended, or used as justification for a new violation.

## Test Runner Baseline

The monorepo contains Vitest tooling, and relevant packages such as the Design System already expose Vitest scripts. However, the current `apps/manager/package.json` does not declare a test script. Therefore the agent MUST NOT invent a manager test command or claim that manager testing is already configured.

When adding the manager test workflow, use the repository's approved Vitest configuration and scripts rather than introducing Jest, Mocha, or another runner merely for familiarity.

## Test Location

For application source under `src/`, tests MUST live under a dedicated `__tests__/` tree that mirrors the tested source structure, unless a package-specific rule explicitly states otherwise.

Existing colocated tests in the Design System are package-specific precedent only and MUST NOT silently become the manager convention.

## Observable Behavior

UI tests MUST prefer observable behavior and public contracts over implementation details. Testing Library's guiding principles require tests to resemble user interaction and discourage dependence on internal state, methods, lifecycle details, and child implementation.

The agent MUST NOT normally assert internal component state, private helpers, implementation-only structure, or CSS classes when a semantic query expresses the behavior.

## UI Queries

When Testing Library is used, prefer:

1. `getByRole` / `findByRole` when applicable;
2. `getByLabelText` / `findByLabelText` for form controls;
3. other accessible/user-oriented queries;
4. test IDs only when no suitable semantic query exists.

Brittle implementation selectors MUST NOT be used when an appropriate semantic query exists.

## Test Responsibility

Each test case, fixture, factory, and helper MUST have one coherent responsibility. Tests SHOULD verify one behavior or one coherent contract. Test names MUST describe observable behavior or a contract rather than implementation mechanics.

## Arrange / Act / Assert

Tests SHOULD make Arrange → Act → Assert boundaries clear. Complex setup MUST NOT obscure the behavior under test; when setup acquires unrelated responsibilities it MUST be simplified or decomposed.

## Mocking

Mocks MUST be limited to external, expensive, nondeterministic, unavailable, or otherwise inappropriate dependencies for the test's purpose. The unit under test MUST NOT be mocked merely to simplify assertions. Meaningful behavior MUST NOT be mocked away and then claimed as verified.

## Zustand Tests

When Zustand application state is introduced:

- tests MUST verify observable state and actions;
- tests MUST NOT depend on Zustand internals;
- each test MUST isolate or reset relevant application state;
- tests MUST NOT depend on state leaked by another test.

Atoms, Molecules, and Organisms MUST remain testable without direct application-level Zustand consumption.

## Business Logic and Regression

Business rules outside TSX SHOULD be independently testable whenever practical. Utilities, domain logic, Service operations, selectors, and meaningful Custom Hooks SHOULD have focused contract tests.

Business logic MUST NOT be moved into TSX merely to avoid focused tests.

When fixing a bug, the agent MUST add or update a regression test unless a documented technical reason makes that impractical. The regression MUST fail before the fix and pass after it when executable.

The agent MUST consider invalid inputs, missing values, empty inputs, boundaries, failure responses, and relevant authorization outcomes.

Coverage is evidence, not proof. Meaningless tests MUST NOT be added merely to increase coverage.

## Async Tests

Async behavior MUST be awaited and verified deterministically. Use Vitest's documented async mechanisms and Testing Library's `findBy*`/`waitFor` when appropriate.

The agent MUST NOT use arbitrary sleeps, unawaited assertions whose result matters, or timing hacks that conceal race conditions.

## Isolation

Each test MUST be independently executable and MUST NOT depend on execution order, leaked module state, leaked Zustand state, prior output, or uncontrolled external services.

Where Vitest isolation is configured, it MUST NOT be disabled merely to make tests pass.

## No Test Circumvention

The agent MUST NOT disable failing tests, add unjustified skips, weaken assertions, mock away the behavior under investigation, alter configuration to conceal defects, delete regression tests for convenience, or disable isolation to hide shared-state problems.

A failing test MUST be investigated, not hidden.

## Verification Before Completion

The agent MUST:

1. identify changed behavior requiring tests;
2. inspect existing relevant tests before creating duplicates;
3. ensure the package test workflow actually exists before invoking package-specific commands;
4. add or update focused tests;
5. use semantic/user-oriented queries where applicable;
6. run the relevant configured test command(s);
7. investigate unexpected failures;
8. verify no test was weakened, skipped, or removed without explicit justification;
9. verify async assertions are awaited;
10. inspect the final diff.

Passing a suite does not prove every requirement was implemented correctly.

## Mechanical Enforcement

Where technically possible, automated checks MUST enforce test location/naming, TypeScript correctness, test linting, forbidden skip/focused modes, configured coverage thresholds, package test configuration, and objectively detectable violations of required query conventions.

The agent MUST fix the underlying problem rather than weaken the test or enforcement.

## Technical References

- https://testing-library.com/docs/guiding-principles/
- https://testing-library.com/docs/queries/about/
- https://vitest.dev/guide/learn/async
- https://vitest.dev/config/isolate.html

External guidance defines testing principles; Nino-specific structure and architecture remain authoritative.

## Final Rule

> Tests MUST prove observable behavior, protect contracts and regressions, remain isolated and deterministic, and never be weakened merely to make the suite pass. Current manager tooling MUST be inspected before test commands are assumed or invented.
