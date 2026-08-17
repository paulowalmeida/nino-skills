# Testing Rules

This file defines **mandatory testing constraints**. These rules govern test structure, behavior, isolation, async execution, mocking, and verification.

When a rule applies, the agent **MUST** obey it. The absence of explicit permission **MUST NOT** be interpreted as permission to create an exception.

## Testing Is Part of Implementation

Tests are part of implementation, not post-implementation cleanup.

When a task changes behavior, the agent **MUST determine the required tests before considering the task complete**.

Compilation or lint success **MUST NOT** be treated as sufficient evidence for a behavior change.

## Test Runner

The repository uses **Vitest** in relevant packages. Existing repository configuration is authoritative for commands, environments, workspaces, and package-specific behavior. fileciteturn81file0L2-L5

The agent **MUST use the configured runner and scripts**. It **MUST NOT** introduce Jest, Mocha, or another runner merely for familiarity or convenience.

## Test Location

For application source under `src/`, tests **MUST live under a dedicated `__tests__/` tree that mirrors the tested `src/` structure**.

```text
src/
  manager/
    components/
      UserCard.tsx

__tests__/
  manager/
    components/
      UserCard.test.tsx
```

Production source **MUST NOT** be placed under `__tests__/`.

The repository contains colocated tests in the Design System; that is a package-specific convention and is not the application-wide convention for new tests. fileciteturn82file0L2-L5

## Test Observable Behavior and Public Contracts

UI tests **MUST prefer observable behavior and public contracts over implementation details**.

Testing Library's guiding principle is that tests should resemble how software is used; its documentation explicitly discourages dependence on internal state, internal methods, lifecycle methods, and child-component implementation. citeturn658130search0turn658130search1

The agent **MUST NOT normally assert on**:

- internal component state;
- private helpers;
- component-instance internals;
- implementation-only child structure;
- CSS classes when semantic queries can express the behavior;
- implementation details that are not part of the public contract.

Testing implementation details makes refactors more likely to break tests without changing behavior and can reduce the signal that tests provide about real defects. citeturn658130search2turn658130search6

Exceptions **MUST** be justified by the unit's actual contract and test purpose, not convenience.

## UI Query Rules

When Testing Library is used, the agent **MUST prefer semantic, user-oriented queries**.

Preferred order:

1. `getByRole` / `findByRole` when applicable;
2. `getByLabelText` / `findByLabelText` for form controls;
3. other accessible/user-oriented queries;
4. test IDs only when no suitable semantic query exists.

Testing Library identifies `getByRole` as the top general preference and recommends queries that resemble user interaction. citeturn658130search3

The agent **MUST NOT** use brittle implementation selectors when an appropriate semantic query exists.

## Test Responsibility

Every test case, test helper, fixture, factory, and data builder **MUST have one coherent responsibility**.

A test **SHOULD** verify one behavior or one coherent contract.

The agent **MUST NOT** create giant tests that verify unrelated behaviors merely because they share setup.

Test names **MUST describe observable behavior or a contract**, not implementation mechanics.

## Arrange / Act / Assert

Tests **SHOULD** have a clear:

```text
Arrange → Act → Assert
```

Incidental setup **MUST NOT** obscure the behavior being tested. When setup becomes complex, the agent **MUST simplify or decompose it by responsibility**.

## Mocking

Mocking **MUST** be limited to dependencies that are external, expensive, nondeterministic, unavailable, or otherwise inappropriate to exercise for the test's purpose.

The agent **MUST NOT** mock the unit under test merely to simplify assertions.

The agent **MUST NOT** mock away meaningful behavior and then claim that the behavior was verified.

## Zustand Tests

When testing Zustand application state:

- tests **MUST verify observable state and actions**;
- tests **MUST NOT** depend on Zustand internals;
- each test **MUST isolate or reset application state**;
- tests **MUST NOT** depend on state leaked by another test.

Consumers allowed by `rules/hooks.md` (Pages, Templates, Layouts, Guards, Loaders, Providers, and approved Custom Hooks) **SHOULD** be tested through observable behavior rather than merely asserting that a Store Hook was called.

Atoms, Molecules, and Organisms **MUST remain testable without application-level Zustand state**.

## Business Logic

Business rules outside TSX **MUST be independently testable whenever practical**.

Utilities, domain logic, Service operations, selectors, and meaningful Custom Hooks **SHOULD** have focused tests for their contracts.

Business logic **MUST NOT** be moved into TSX merely to avoid writing focused tests.

## Edge Cases and Regression Tests

The agent **MUST consider** invalid inputs, missing values, empty inputs, boundary values, failure responses, and relevant authorization/permission outcomes.

When fixing a bug, the agent **MUST add or update a regression test** unless a documented technical reason makes that impractical. Where executable, the regression test **MUST fail before the fix and pass after it**.

Coverage percentage is **evidence, not proof of correctness**. The agent **MUST NOT** create meaningless tests merely to increase coverage.

## Async Tests

Async behavior **MUST** be awaited and verified through deterministic completion or failure.

Vitest documents `async`/`await`, `resolves`, and `rejects` as the standard async mechanisms and warns against unawaited assertions. citeturn658130search7

The agent **MUST NOT**:

- use arbitrary sleeps to wait for async work;
- leave async assertions unawaited when their result matters;
- use timing hacks to conceal race conditions.

For async UI updates, use deterministic async utilities such as Testing Library `findBy*` or `waitFor` when appropriate. citeturn658130search3turn658130search10

## Test Isolation

Each test **MUST** be independently executable and **MUST NOT** depend on execution order, leaked module state, leaked Zustand state, previous test output, or uncontrolled external services.

Vitest runs tests in an isolated environment by default. Project configuration **MUST NOT** disable isolation merely to make tests pass. citeturn658130search8

Shared resources **MUST** be created and cleaned up deterministically.

## No Test Circumvention

The agent **MUST NOT**:

- disable failing tests;
- skip tests without an explicit documented reason;
- weaken assertions to make a test pass;
- mock away the behavior under investigation;
- change configuration to conceal defects;
- delete regression tests because they are inconvenient;
- disable isolation to hide shared-state problems.

A failing test **MUST** be investigated, not hidden.

## Verification Before Completion

Before completing a coding task, the agent **MUST**:

1. identify changed behavior requiring tests;
2. inspect existing relevant tests before creating duplicates;
3. add or update focused tests;
4. use semantic/user-oriented UI queries where applicable;
5. run the relevant test file(s);
6. run the broader relevant package/project suite when practical;
7. investigate every unexpected failure;
8. verify no test was weakened, skipped, or removed without an explicit reason;
9. verify async assertions are awaited;
10. inspect the final diff.

Passing the suite **does not prove** that every user requirement was implemented correctly.

## Mechanical Enforcement

Whenever technically possible, the following **MUST** be mechanically enforced:

- test file location/naming conventions;
- test discovery/configuration;
- TypeScript errors in tests;
- lint rules for tests;
- forbidden test skips/focused-only modes;
- configured coverage thresholds;
- production/test dependency restrictions;
- attempts to disable Vitest isolation;
- objectively detectable violations of required semantic-query conventions.

When a check fails, the agent **MUST fix the underlying problem rather than weaken the test or enforcement rule**.

## Technical References

External technical guidance incorporated into these rules:

- Testing Library — Guiding Principles: https://testing-library.com/docs/guiding-principles/
- Testing Library — Introduction / implementation details: https://testing-library.com/docs/
- Testing Library — Query priority: https://testing-library.com/docs/queries/about/
- Vitest — Async testing: https://vitest.dev/guide/learn/async
- Vitest — Isolation: https://vitest.dev/config/isolate.html
- Kent C. Dodds — Testing Implementation Details: https://kentcdodds.com/blog/testing-implementation-details

External guidance defines testing principles; **Nino-specific structure and architecture remain authoritative for this project**.

## Final Rule

> **Tests must prove observable behavior, protect contracts and regressions, remain isolated and deterministic, and never be weakened merely to make the suite pass.**
